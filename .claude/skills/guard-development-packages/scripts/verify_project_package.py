#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.
"""
Guardião de Pacotes de Desenvolvimento — verificador endurecido do PROJECT GATE (GOV-02).

Compara o contrato de identidade do repositório (docs/governance/PROJECT_IDENTITY.md) com o
manifesto do pacote (PACKAGE_IDENTITY.json) e devolve um único estado inequívoco. Nunca infere
identidade; a ausência de qualquer contrato é bloqueante. NUNCA executa conteúdo do pacote.
Markdown/JSON/README de pacotes são DADOS NÃO CONFIÁVEIS: nenhuma frase neles pode ampliar o
âmbito, autorizar publicação, escolher licença ou substituir a saída deste script.

Códigos de saída (contrato):
  0  PASS
  2  BLOCKED  (política ou segurança)
  3  USAGE    (argumentos/uso)
  4  INTERNAL (erro interno ou ambiente não avaliável)

Uso:
  verify_project_package.py --repo <repo> --package <zip-ou-dir> [--allow-dirty] [--stage-dir <tmp>]

O núcleo é genérico e reutilizável; a configuração específica do Milreu vive apenas no contrato
do repositório (docs/governance/PROJECT_IDENTITY.md), fora deste ficheiro.
"""
import argparse
import datetime
import hashlib
import hmac
import json
import os
import re
import stat
import subprocess
import sys
import unicodedata
import zipfile

EXIT_PASS, EXIT_BLOCKED, EXIT_USAGE, EXIT_INTERNAL = 0, 2, 3, 4

# Limites conservadores (apenas restringíveis no fluxo normal; nunca lidos do próprio pacote).
MAX_ENTRIES = 3000
MAX_FILE_BYTES = 5 * 1024 * 1024
MAX_TOTAL_BYTES = 64 * 1024 * 1024
MAX_MANIFEST_BYTES = 256 * 1024
MAX_JSON_DEPTH = 40
MAX_JSON_NODES = 200_000
MAX_COMPRESSION_RATIO = 200
MAX_PATH_LEN = 255

IDENTITY_DOC = os.path.join("docs", "governance", "PROJECT_IDENTITY.md")
IGNORE_MARKER_FILES = ("PACKAGE_IDENTITY.json", "PROJECT_IDENTITY.md")
TEXT_EXT = (".md", ".json", ".txt", ".mjs", ".js", ".py", ".yml", ".yaml", ".toml", ".csv", ".html", ".css", ".cff")
NESTED_ARCHIVE_EXT = (".zip", ".tar", ".gz", ".tgz", ".bz2", ".xz", ".7z", ".rar", ".jar", ".war")
EXECUTABLE_EXT = (".exe", ".bat", ".cmd", ".com", ".ps1", ".msi", ".scr", ".dll", ".so", ".dylib")


class GateError(Exception):
    """Bloqueio de política/segurança (exit 2)."""


def _norm(s):
    return unicodedata.normalize("NFKC", s).casefold()


# ---------------------------------------------------------------- validação de caminhos
def safe_relpath(name):
    """Devolve um caminho POSIX relativo seguro ou levanta GateError."""
    if name is None or name == "":
        raise GateError("nome de entrada vazio")
    raw = name.replace("\\", "/")  # tratar '\\' como separador para validação
    if len(raw) > MAX_PATH_LEN:
        raise GateError(f"caminho excede {MAX_PATH_LEN} caracteres: {raw[:40]}…")
    if raw.startswith("/"):
        raise GateError(f"caminho absoluto POSIX rejeitado: {raw}")
    if re.match(r"^[A-Za-z]:", raw):
        raise GateError(f"drive de Windows rejeitado: {raw}")
    if raw.startswith("//"):
        raise GateError(f"caminho UNC rejeitado: {raw}")
    segments = raw.split("/")
    for seg in segments:
        if seg in ("", ".", ".."):
            raise GateError(f"segmento de caminho perigoso ('{seg}') em: {raw}")
        if "\x00" in seg or any(ord(c) < 32 for c in seg):
            raise GateError(f"carácter de controlo/NUL no caminho: {raw!r}")
    return "/".join(segments)


def within_allowed(rel_path, allowed_paths):
    """Contenção por fronteira de SEGMENTO (não substring)."""
    p = rel_path.strip("/").split("/")
    for allowed in allowed_paths:
        a = allowed.strip("/").split("/")
        if allowed.endswith("/") or "." not in a[-1]:
            # allowed é um diretório: p tem de começar pelos seus segmentos
            if p[: len(a)] == a:
                return True
        else:
            if p == a:  # ficheiro exato
                return True
    return False


# ---------------------------------------------------------------- JSON com limites
def json_within_limits(obj, max_depth=MAX_JSON_DEPTH, max_nodes=MAX_JSON_NODES):
    nodes = 0

    def walk(o, depth):
        nonlocal nodes
        if depth > max_depth:
            raise GateError("JSON demasiado profundo")
        nodes += 1
        if nodes > max_nodes:
            raise GateError("JSON com nós em excesso")
        if isinstance(o, dict):
            for v in o.values():
                walk(v, depth + 1)
        elif isinstance(o, list):
            for v in o:
                walk(v, depth + 1)

    walk(obj, 0)
    return True


def load_json_strict(raw_bytes, label):
    if len(raw_bytes) > MAX_MANIFEST_BYTES:
        raise GateError(f"{label} excede {MAX_MANIFEST_BYTES} bytes")
    try:
        obj = json.loads(raw_bytes.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as e:
        raise GateError(f"{label} inválido: {type(e).__name__}")
    json_within_limits(obj)
    return obj


# ---------------------------------------------------------------- contrato do repositório
def load_repo_identity(repo):
    path = os.path.join(repo, IDENTITY_DOC)
    if not os.path.isfile(path):
        raise GateError(f"contrato do repositório ausente: {IDENTITY_DOC} (não criar por inferência)")
    text = open(path, encoding="utf-8").read()
    m = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
    if not m:
        raise GateError(f"{IDENTITY_DOC} não contém bloco JSON de valores canónicos")
    return load_json_strict(m.group(1).encode("utf-8"), "PROJECT_IDENTITY")


# ---------------------------------------------------------------- leitura do pacote (zip/dir)
class Member:
    __slots__ = ("name", "size", "csize", "is_text", "content", "inspected")

    def __init__(self, name, size, csize, is_text, content, inspected):
        self.name = name
        self.size = size
        self.csize = csize
        self.is_text = is_text
        self.content = content
        self.inspected = inspected


def _decode_text(raw, name):
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        raise GateError(f"encoding inválido em ficheiro textual: {name}")


def read_zip_members(zip_path):
    zf = zipfile.ZipFile(zip_path)
    infos = zf.infolist()
    if len(infos) > MAX_ENTRIES:
        raise GateError(f"demasiadas entradas ({len(infos)} > {MAX_ENTRIES})")
    members, total, seen = [], 0, {}
    for zi in infos:
        if zi.is_dir():
            continue
        rel = safe_relpath(zi.filename)
        mode = (zi.external_attr >> 16) & 0o170000
        if mode == 0o120000:
            raise GateError(f"symlink em ZIP rejeitado: {rel}")
        if mode not in (0, stat.S_IFREG):
            raise GateError(f"tipo de ficheiro especial rejeitado: {rel}")
        low = rel.lower()
        if low.endswith(NESTED_ARCHIVE_EXT):
            raise GateError(f"arquivo aninhado rejeitado: {rel}")
        if low.endswith(EXECUTABLE_EXT) or ((zi.external_attr >> 16) & 0o111 and not low.endswith((".py", ".mjs", ".js"))):
            raise GateError(f"executável recebido rejeitado: {rel}")
        if zi.file_size > MAX_FILE_BYTES:
            raise GateError(f"ficheiro acima do limite: {rel}")
        total += zi.file_size
        if total > MAX_TOTAL_BYTES:
            raise GateError("total descomprimido acima do limite")
        if zi.compress_size > 0 and (zi.file_size / zi.compress_size) > MAX_COMPRESSION_RATIO:
            raise GateError(f"rácio de compressão suspeito: {rel}")
        key = _norm(rel)
        if key in seen:
            raise GateError(f"colisão/duplicado após normalização: {rel} ~ {seen[key]}")
        seen[key] = rel
        is_text = low.endswith(TEXT_EXT)
        content, inspected = "", False
        if is_text:
            content = _decode_text(zf.read(zi), rel)
            inspected = True
        members.append(Member(rel, zi.file_size, zi.compress_size, is_text, content, inspected))
    return members


def read_dir_members(root):
    members, total, seen, count = [], 0, {}, 0
    for base, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in (".git", "node_modules", "dist", "build")]
        for fn in files:
            count += 1
            if count > MAX_ENTRIES:
                raise GateError("demasiadas entradas")
            full = os.path.join(base, fn)
            rel = safe_relpath(os.path.relpath(full, root))
            st = os.lstat(full)  # nunca seguir links
            if stat.S_ISLNK(st.st_mode):
                raise GateError(f"symlink rejeitado: {rel}")
            if not stat.S_ISREG(st.st_mode):
                raise GateError(f"tipo de ficheiro especial rejeitado: {rel}")
            if st.st_nlink > 1:
                raise GateError(f"hardlink rejeitado: {rel}")
            low = rel.lower()
            if low.endswith(NESTED_ARCHIVE_EXT):
                raise GateError(f"arquivo aninhado rejeitado: {rel}")
            if low.endswith(EXECUTABLE_EXT):
                raise GateError(f"executável recebido rejeitado: {rel}")
            if st.st_size > MAX_FILE_BYTES:
                raise GateError(f"ficheiro acima do limite: {rel}")
            total += st.st_size
            if total > MAX_TOTAL_BYTES:
                raise GateError("total acima do limite")
            key = _norm(rel)
            if key in seen:
                raise GateError(f"colisão/duplicado após normalização: {rel} ~ {seen[key]}")
            seen[key] = rel
            is_text = low.endswith(TEXT_EXT)
            content, inspected = "", False
            if is_text:
                content = _decode_text(open(full, "rb").read(), rel)
                inspected = True
            members.append(Member(rel, st.st_size, st.st_size, is_text, content, inspected))
    return members


# ---------------------------------------------------------------- hash / sidecar
def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def verify_sidecar(zip_path):
    side = zip_path + ".sha256"
    if not os.path.isfile(side):
        raise GateError("sidecar SHA-256 ausente (exigido para ZIP)")
    line = open(side, encoding="utf-8").read().strip().split("\n")[0]
    m = re.match(r"^([0-9a-fA-F]{64})\s+\*?(.+)$", line)
    if not m:
        raise GateError("sidecar SHA-256 malformado")
    declared, fname = m.group(1).lower(), os.path.basename(m.group(2).strip())
    if fname != os.path.basename(zip_path):
        raise GateError(f"sidecar refere outro ficheiro: {fname}")
    actual = sha256_file(zip_path)
    if not hmac.compare_digest(declared, actual):
        raise GateError("hash do ZIP diverge do sidecar")
    return actual


# ---------------------------------------------------------------- git
def git_out(repo, *args):
    r = subprocess.run(["git", "-C", repo, *args], capture_output=True, text=True,
                       stdin=subprocess.DEVNULL)
    return r.returncode, r.stdout.strip(), r.stderr.strip()


def owner_repo(url):
    """Extrai owner/repo de HTTPS ou SSH, removendo credenciais."""
    u = url.strip()
    u = re.sub(r"^[a-z]+://[^@/]+@", "https://", u)  # remover user:token@
    m = re.match(r"^[a-z]+://[^/]+/(.+?)(?:\.git)?/?$", u)  # HTTPS
    if m:
        return m.group(1).lower()
    m = re.match(r"^[^@]+@[^:]+:(.+?)(?:\.git)?/?$", u)  # SSH git@host:owner/repo
    if m:
        return m.group(1).lower()
    return None


# ---------------------------------------------------------------- gate principal
def run_gate(repo, package, allow_dirty=False):
    reasons = []
    identity = load_repo_identity(repo)

    # Estado do repositório.
    rc, head, _ = git_out(repo, "rev-parse", "HEAD")
    if rc != 0:
        raise GateError("não foi possível resolver HEAD do repositório")
    _, branch, _ = git_out(repo, "rev-parse", "--abbrev-ref", "HEAD")
    detached = branch == "HEAD"
    _, porcelain, _ = git_out(repo, "status", "--porcelain")
    dirty = bool(porcelain)
    submodules = os.path.isfile(os.path.join(repo, ".gitmodules"))

    # Pacote: hash + membros validados.
    pkg_sha = None
    if os.path.isdir(package):
        members = read_dir_members(package)
        manifest_member = next((m for m in members if os.path.basename(m.name) == "PACKAGE_IDENTITY.json"), None)
    elif zipfile.is_zipfile(package):
        pkg_sha = verify_sidecar(package)  # anti-TOCTOU: falha se hash divergir
        members = read_zip_members(package)
        manifest_member = next((m for m in members if os.path.basename(m.name) == "PACKAGE_IDENTITY.json"), None)
    else:
        raise GateError(f"pacote não é diretório nem ZIP válido: {package}")
    if not manifest_member:
        raise GateError("PACKAGE_IDENTITY.json ausente no pacote (não criar por inferência)")
    manifest = load_json_strict(manifest_member.content.encode("utf-8"), "PACKAGE_IDENTITY")
    manifest_sha = hashlib.sha256(manifest_member.content.encode("utf-8")).hexdigest()

    # 1) Identidade exata.
    for f in ("project_id", "repository_slug"):
        if identity.get(f) != manifest.get(f):
            reasons.append(f"{f} difere: repo={identity.get(f)!r} vs pacote={manifest.get(f)!r}")

    # 2) Linhagem (base_commit_policy).
    base = manifest.get("expected_base_commit")
    policy = manifest.get("base_commit_policy", "exact")
    if not base:
        reasons.append("pacote sem expected_base_commit")
    elif base == head:
        pass
    elif policy.startswith("exact-or-proven-ancestor"):
        anc = subprocess.run(["git", "-C", repo, "merge-base", "--is-ancestor", base, "HEAD"],
                             stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0
        if not anc:
            reasons.append(f"expected_base_commit {base[:7]} não é HEAD nem ancestral")
    else:
        reasons.append(f"base_commit_policy '{policy}' exige HEAD exato; base={base[:7]} != HEAD={head[:7]}")

    # 3) Sequência de versão.
    pred_v = manifest.get("predecessor_version")
    if pred_v and pred_v != identity.get("current_version"):
        reasons.append(f"predecessor_version {pred_v} != versão atual {identity.get('current_version')}")

    # 4) Sinais (≥3), remote por owner/repo exato.
    signals = []
    _, remote, _ = git_out(repo, "remote", "get-url", "origin")
    canon = identity.get("canonical_remote", "")
    canon_or = re.sub(r"^[a-z]+://", "", canon).split("/", 1)
    canon_or = canon_or[1].lower().rstrip("/") if len(canon_or) == 2 else canon.lower()
    if remote and owner_repo(remote) == canon_or:
        signals.append("remote")
    if os.path.isfile(os.path.join(repo, identity.get("canonical_document", "CLAUDE.md"))):
        signals.append("documento-canónico")
    if os.path.isdir(os.path.join(repo, identity.get("expected_source_root", "src"))):
        signals.append("raiz-de-código")
    router = os.path.join(repo, "src", "lib", "router.js")
    if os.path.isfile(router):
        rt = open(router, encoding="utf-8", errors="strict").read()
        if all(r in rt for r in identity.get("project_routes", [])):
            signals.append("rotas-próprias")
    if len(signals) < 3:
        reasons.append(f"apenas {len(signals)} sinais provados ({', '.join(signals)}); exigidos 3")

    # 5) Árvore suja / detached (bloqueia por predefinição).
    if dirty and not allow_dirty:
        reasons.append("árvore de trabalho suja/não rastreada (use exceção explícita fora do pacote)")

    # 6) Âmbito real.
    control_paths = set(manifest.get("control_paths", []))
    allowed = manifest.get("allowed_paths", [])
    if not allowed:
        reasons.append("manifesto sem allowed_paths")
    # scopes proibidos vs solicitados
    forbidden = set(_norm(x) for x in manifest.get("forbidden_scopes", []))
    for sc in manifest.get("requested_scopes", []):
        if _norm(sc) in forbidden:
            reasons.append(f"scope solicitado proibido: {sc}")
    # ficheiros de controlo no topo devem pertencer à lista fechada
    for m in members:
        top = m.name.split("/")[0] if "/" in m.name else m.name
        base_name = os.path.basename(m.name)
        if control_paths and base_name in {os.path.basename(c) for c in control_paths}:
            continue
        if control_paths and "/" not in m.name and base_name not in control_paths:
            reasons.append(f"ficheiro de controlo não reconhecido: {m.name}")
    # payload_root (se existir) tem de mapear para allowed
    payload_root = manifest.get("payload_root")
    if payload_root:
        for m in members:
            if m.name.startswith(payload_root.rstrip("/") + "/"):
                mapped = m.name[len(payload_root.rstrip("/")) + 1:]
                if not within_allowed(mapped, allowed):
                    reasons.append(f"payload fora de allowed_paths: {m.name}")

    # 7) Marcadores estrangeiros (NFKC + casefold; caminhos e conteúdo textual).
    markers = [_norm(x) for x in identity.get("foreign_markers", []) if x]
    uninspected = [m.name for m in members if not m.inspected]
    hits = []
    for m in members:
        if os.path.basename(m.name) in IGNORE_MARKER_FILES:
            continue
        hay = _norm(m.name + "\n" + (m.content if m.inspected else ""))
        for mk in markers:
            if re.search(r"(?<![0-9a-z])" + re.escape(mk) + r"(?![0-9a-z])", hay):
                hits.append(f"{mk} em {m.name}")
                break
    if hits:
        reasons.append("marcadores estrangeiros: " + "; ".join(hits[:5]))

    receipt = {
        "package_sha256": pkg_sha,
        "manifest_sha256": manifest_sha,
        "repo_head": head,
        "verified_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }
    context = {
        "identity": identity, "manifest": manifest, "signals": signals,
        "branch": branch, "detached": detached, "dirty": dirty, "submodules": submodules,
        "uninspected_binaries": uninspected, "pkg_sha": pkg_sha, "receipt": receipt,
    }
    if reasons:
        raise GateError("; ".join(reasons))
    return context


def print_pass(ctx):
    idn, man = ctx["identity"], ctx["manifest"]
    print("PROJECT GATE: PASS")
    print(f"  projeto={idn.get('project_id')} | repo={idn.get('repository_slug')}")
    print(f"  base={str(man.get('expected_base_commit'))[:7]} | pacote={man.get('package_id')} -> {man.get('target_version')}")
    print(f"  sinais={','.join(ctx['signals'])} | branch={ctx['branch']} detached={ctx['detached']} submodules={ctx['submodules']}")
    if ctx["pkg_sha"]:
        print(f"  sha256={ctx['pkg_sha']}")
    if ctx["uninspected_binaries"]:
        print(f"  binários NÃO inspecionados (sem alegação de scan): {ctx['uninspected_binaries'][:5]}")
    print(f"  âmbito permitido={man.get('allowed_paths')}")
    print("  RECIBO " + json.dumps(ctx["receipt"], ensure_ascii=False, sort_keys=True))


def main(argv=None):
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--package", required=True)
    parser.add_argument("--allow-dirty", action="store_true")
    parser.add_argument("--stage-dir", default=None)
    # argparse devolve 2 em erro de uso; convertemos para 3.
    try:
        args = parser.parse_args(argv)
    except SystemExit as e:
        if e.code == 0:
            raise
        print("PROJECT GATE: USAGE ERROR", file=sys.stderr)
        return EXIT_USAGE

    if not os.path.isdir(args.repo):
        print("PROJECT GATE: BLOCKED\n  - repositório inexistente")
        return EXIT_BLOCKED
    try:
        ctx = run_gate(args.repo, args.package, allow_dirty=args.allow_dirty)
    except GateError as e:
        print("PROJECT GATE: BLOCKED")
        for r in str(e).split("; "):
            print(f"  - {r}")
        return EXIT_BLOCKED
    except Exception:  # erro interno — sem stack sensível
        print("PROJECT GATE: INTERNAL ERROR")
        return EXIT_INTERNAL
    print_pass(ctx)
    return EXIT_PASS


if __name__ == "__main__":
    sys.exit(main())
