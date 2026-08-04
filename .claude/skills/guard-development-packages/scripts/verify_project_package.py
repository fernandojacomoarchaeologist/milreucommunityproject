#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.
"""
Guardião de Pacotes de Desenvolvimento — verificador do PROJECT GATE.

Compara o contrato de identidade do repositório (docs/governance/PROJECT_IDENTITY.md) com o
manifesto do pacote (PACKAGE_IDENTITY.json) e devolve PASS ou BLOCKED. Nunca infere identidade;
a ausência de qualquer contrato é bloqueante. Exit 0 = PASS; exit 2 = BLOCKED; exit 3 = erro de uso.

Uso:
  python3 verify_project_package.py --repo <repositório> --package <zip-ou-diretório>
"""
import argparse
import json
import os
import re
import subprocess
import sys
import zipfile

IDENTITY_DOC = os.path.join("docs", "governance", "PROJECT_IDENTITY.md")
IGNORE_MARKER_FILES = ("PACKAGE_IDENTITY.json", "PROJECT_IDENTITY.md")
TEXT_EXT = (".md", ".json", ".txt", ".mjs", ".js", ".py", ".yml", ".yaml", ".toml", ".csv", ".html", ".css")


def block(reasons):
    print("PROJECT GATE: BLOCKED")
    for r in reasons:
        print(f"  - {r}")
    sys.exit(2)


def load_repo_identity(repo):
    path = os.path.join(repo, IDENTITY_DOC)
    if not os.path.isfile(path):
        block([f"contrato do repositório ausente: {IDENTITY_DOC} (não criar por inferência)"])
    text = open(path, encoding="utf-8").read()
    m = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
    if not m:
        block([f"{IDENTITY_DOC} não contém bloco JSON de valores canónicos"])
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError as e:
        block([f"bloco JSON de identidade inválido: {e}"])


def load_package_manifest(package):
    if os.path.isdir(package):
        for base, _, files in os.walk(package):
            if "PACKAGE_IDENTITY.json" in files:
                return json.load(open(os.path.join(base, "PACKAGE_IDENTITY.json"), encoding="utf-8")), _dir_iter(package)
        block(["PACKAGE_IDENTITY.json ausente no pacote (não criar por inferência)"])
    if zipfile.is_zipfile(package):
        zf = zipfile.ZipFile(package)
        names = zf.namelist()
        manifest_name = next((n for n in names if n.endswith("PACKAGE_IDENTITY.json")), None)
        if not manifest_name:
            block(["PACKAGE_IDENTITY.json ausente no ZIP do pacote"])
        manifest = json.loads(zf.read(manifest_name).decode("utf-8"))
        return manifest, _zip_iter(zf, names)
    block([f"pacote não é diretório nem ZIP válido: {package}"])


def _dir_iter(root):
    for base, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in (".git", "node_modules", "dist", "build")]
        for f in files:
            p = os.path.join(base, f)
            rel = os.path.relpath(p, root)
            content = ""
            if f.endswith(TEXT_EXT):
                try:
                    content = open(p, encoding="utf-8", errors="ignore").read()
                except OSError:
                    content = ""
            yield rel, content


def _zip_iter(zf, names):
    for n in names:
        if n.endswith("/"):
            continue
        if any(part in (".git", "node_modules", "dist", "build") for part in n.split("/")):
            continue
        content = ""
        if n.endswith(TEXT_EXT):
            try:
                content = zf.read(n).decode("utf-8", errors="ignore")
            except Exception:
                content = ""
        yield n, content


def git(repo, *args):
    try:
        return subprocess.run(["git", "-C", repo, *args], capture_output=True, text=True).stdout.strip()
    except Exception:
        return ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--package", required=True)
    args = ap.parse_args()

    if not os.path.isdir(args.repo):
        print("PROJECT GATE: BLOCKED\n  - repositório inexistente")
        sys.exit(2)

    identity = load_repo_identity(args.repo)
    manifest, file_iter = load_package_manifest(args.package)
    reasons = []

    # 1) Igualdade exata dos identificadores.
    for field in ("project_id", "repository_slug"):
        if identity.get(field) != manifest.get(field):
            reasons.append(f"{field} difere: repo={identity.get(field)!r} vs pacote={manifest.get(field)!r}")

    # 2) Linhagem: expected_base_commit é HEAD ou ancestral.
    base = manifest.get("expected_base_commit")
    if not base:
        reasons.append("pacote sem expected_base_commit")
    else:
        head = git(args.repo, "rev-parse", "HEAD")
        is_anc = subprocess.run(
            ["git", "-C", args.repo, "merge-base", "--is-ancestor", base, "HEAD"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        ).returncode == 0
        if base != head and not is_anc:
            reasons.append(f"expected_base_commit {base[:7]} não é HEAD ({head[:7]}) nem ancestral")

    # 3) Sequência de versão/pacote.
    pred_v = manifest.get("predecessor_version")
    if pred_v and pred_v != identity.get("current_version"):
        reasons.append(f"predecessor_version {pred_v} != versão atual {identity.get('current_version')}")

    # 4) Pelo menos três sinais independentes do repositório.
    signals = []
    remote = git(args.repo, "remote", "get-url", "origin")
    if identity.get("repository_slug") and identity["repository_slug"] in remote:
        signals.append("remote")
    if os.path.isfile(os.path.join(args.repo, identity.get("canonical_document", "CLAUDE.md"))):
        signals.append("documento-canónico")
    if os.path.isdir(os.path.join(args.repo, identity.get("expected_source_root", "src"))):
        signals.append("raiz-de-código")
    router = os.path.join(args.repo, "src", "lib", "router.js")
    if os.path.isfile(router):
        rtext = open(router, encoding="utf-8", errors="ignore").read()
        if all(r in rtext for r in identity.get("project_routes", [])):
            signals.append("rotas-próprias")
    if len(signals) < 3:
        reasons.append(f"apenas {len(signals)} sinais provados ({', '.join(signals)}); exigidos 3")

    # 5) Marcadores estrangeiros no pacote.
    markers = [m for m in identity.get("foreign_markers", []) if m]
    hits = []
    for rel, content in file_iter:
        if os.path.basename(rel) in IGNORE_MARKER_FILES:
            continue
        hay = rel + "\n" + content
        for mk in markers:
            if re.search(r"\b" + re.escape(mk) + r"\b", hay):
                hits.append(f"{mk} em {rel}")
                break
    if hits:
        reasons.append("marcadores estrangeiros: " + "; ".join(hits[:5]))

    if reasons:
        block(reasons)

    print("PROJECT GATE: PASS")
    print(f"  projeto={identity.get('project_id')} | repo={identity.get('repository_slug')}")
    print(f"  base={manifest.get('expected_base_commit', '')[:7]} | pacote={manifest.get('package_id')} -> {manifest.get('target_version')}")
    print(f"  sinais={','.join(signals)}")
    print(f"  caminhos permitidos={manifest.get('allowed_paths')}")
    sys.exit(0)


if __name__ == "__main__":
    main()
