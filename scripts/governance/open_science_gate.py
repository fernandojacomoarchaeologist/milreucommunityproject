#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.
"""
Gate de Ciência Aberta (GOV-02) — determinístico, sem rede, alinhado com o Despacho RT.82/2025.

Perfis:
  baseline           valida coerência dos documentos/JSON de governança; deve PASSAR no GOV-02.
  public-git-content bloqueia novos metadados/afirmações/entidades/mapeamentos expostos em Git
                     público enquanto a licença de metadados (HD-01) e a classificação (HD-02)
                     estiverem PENDING-HUMAN.
  release-or-deposit bloqueia release/depósito/partilha enquanto licenças, autoria/PID,
                     preservação e regras de parceiros/financiadores estiverem pendentes.
  shareable-skill    bloqueia distribuição da skill enquanto segurança, autoria e licença
                     estiverem pendentes.

Exit: 0 OK · 2 BLOCKED · 3 usage · 4 internal. Não escolhe licença/DOI/classificação.
"""
import argparse
import json
import os
import sys

EXIT_OK, EXIT_BLOCKED, EXIT_USAGE, EXIT_INTERNAL = 0, 2, 3, 4
DEFAULT_DIR = os.path.join("docs", "governance", "open-science")
INREVIEW_KEYS = ("status", "editorialStatus", "siteStatus")
ITEM_ARRAYS = ("assertions", "entities", "relations", "works", "authors", "externalResources")


def _load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _pending(decisions, ids):
    return [i for i in ids if decisions.get(i, {}).get("state") == "PENDING-HUMAN"]


def _snapshot_findings(path, register_restricted):
    """Devolve motivos se um snapshot público contiver conteúdo que não deve estar exposto."""
    reasons = []
    if not os.path.isfile(path):
        return reasons
    data = _load(path)
    is_knowledge = "knowledge" in os.path.basename(path)
    if is_knowledge:
        for arr in ("assertions", "entities", "relations"):
            if data.get(arr):
                reasons.append(f"{os.path.basename(path)}: '{arr}' não vazio com decisões pendentes")
    for arr in ITEM_ARRAYS:
        for item in data.get(arr, []) or []:
            if not isinstance(item, dict):
                continue
            for k in INREVIEW_KEYS:
                if str(item.get(k, "")).lower() in ("in_review", "in-review", "review-visible"):
                    reasons.append(f"{os.path.basename(path)}: item '{item.get('id') or item.get('slug')}' em revisão exposto")
            ident = item.get("id") or item.get("slug")
            if ident and ident in register_restricted:
                reasons.append(f"{os.path.basename(path)}: registo restrito/controlado '{ident}' no snapshot público")
    return reasons


def run(profile, gov_dir, repo, snapshot_override=None):
    decisions_path = os.path.join(gov_dir, "OPEN_SCIENCE_DECISIONS.json")
    if not os.path.isfile(decisions_path):
        return EXIT_BLOCKED, [f"registo de decisões ausente: {decisions_path}"]
    doc = _load(decisions_path)
    decisions = doc.get("decisions", {})
    profiles = doc.get("gate_profiles", {})
    if profile not in profiles:
        return EXIT_USAGE, [f"perfil desconhecido: {profile}"]
    cfg = profiles[profile]
    reasons = []

    if profile == "baseline":
        for name in cfg.get("requires_documents", []):
            if not os.path.isfile(os.path.join(gov_dir, name)):
                reasons.append(f"documento de governança ausente: {name}")
        # estados válidos
        for i, d in decisions.items():
            if d.get("state") not in ("PENDING-HUMAN", "CONFIRMED"):
                reasons.append(f"decisão {i} com estado inválido: {d.get('state')}")
        # não permitir ficheiro de licença oficial enquanto HD-03 pendente
        if cfg.get("forbid_official_license_while_pending") and _pending(decisions, ["HD-03"]):
            for lf in doc.get("official_license_files", []):
                p = os.path.join(repo, lf)
                if os.path.isfile(p) and not p.endswith(".template"):
                    reasons.append(f"ficheiro de licença oficial presente com HD-03 pendente: {lf}")
        # registo de produtos deve existir e ter classificações válidas
        reg_path = os.path.join(gov_dir, "RESEARCH_OUTPUTS_REGISTER.json")
        if os.path.isfile(reg_path):
            reg = _load(reg_path)
            valid = set(reg.get("classification_values", []))
            for o in reg.get("outputs", []):
                if o.get("classification") not in valid:
                    reasons.append(f"produto {o.get('id')} com classificação inválida")
        return (EXIT_BLOCKED, reasons) if reasons else (EXIT_OK, [])

    if profile == "public-git-content":
        pend = _pending(decisions, cfg.get("blocked_while_pending", []))
        reg_path = os.path.join(gov_dir, "RESEARCH_OUTPUTS_REGISTER.json")
        restricted = set()
        if os.path.isfile(reg_path):
            for o in _load(reg_path).get("outputs", []):
                if o.get("classification") in ("restricted", "controlled"):
                    for p in o.get("paths", []):
                        restricted.add(p)
        snaps = [snapshot_override] if snapshot_override else [os.path.join(repo, s) for s in doc.get("public_proteus_snapshots", [])]
        findings = []
        for s in snaps:
            findings += _snapshot_findings(s, restricted)
        # Guard SEMPRE ativo (mesmo com decisões confirmadas): o snapshot SERVIDO nunca pode
        # apresentar conteúdo 'in_review' como aprovado nem expor registos restritos/controlados
        # (limite de HD-02: "não apresentar como aprovado enquanto in_review").
        if cfg.get("served_snapshot_must_not_contain_inreview_or_restricted") and findings:
            return EXIT_BLOCKED, ["snapshot público servido não pode apresentar in_review/restrito como aprovado"] + findings
        # Enquanto a licença de metadados (HD-01) ou a classificação (HD-02) estiverem pendentes,
        # qualquer conteúdo público novo é bloqueado.
        if pend and findings:
            return EXIT_BLOCKED, [f"decisões pendentes {pend}"] + findings
        return EXIT_OK, []

    if profile == "release-or-deposit":
        pend = _pending(decisions, cfg.get("blocked_while_pending", []))
        if pend:
            return EXIT_BLOCKED, [f"release/depósito bloqueado; decisões pendentes: {pend}"]
        return EXIT_OK, []

    if profile == "shareable-skill":
        pend = _pending(decisions, cfg.get("blocked_while_pending", []))
        if cfg.get("requires_security_confirmed") and not doc.get("security_hardening_confirmed"):
            reasons.append("segurança da skill não confirmada (security_hardening_confirmed=false)")
        if pend:
            reasons.append(f"decisões pendentes: {pend}")
        return (EXIT_BLOCKED, reasons) if reasons else (EXIT_OK, [])

    return EXIT_INTERNAL, ["perfil não implementado"]


def main(argv=None):
    ap = argparse.ArgumentParser(add_help=True)
    ap.add_argument("--profile", required=True)
    ap.add_argument("--dir", default=DEFAULT_DIR)
    ap.add_argument("--repo", default=".")
    ap.add_argument("--snapshot", default=None)
    try:
        args = ap.parse_args(argv)
    except SystemExit as e:
        if e.code == 0:
            raise
        print("OPEN-SCIENCE GATE: USAGE ERROR", file=sys.stderr)
        return EXIT_USAGE
    try:
        code, reasons = run(args.profile, args.dir, args.repo, args.snapshot)
    except Exception:
        print("OPEN-SCIENCE GATE: INTERNAL ERROR")
        return EXIT_INTERNAL
    label = {EXIT_OK: "PASS", EXIT_BLOCKED: "BLOCKED", EXIT_USAGE: "USAGE"}.get(code, "INTERNAL")
    print(f"OPEN-SCIENCE GATE [{args.profile}]: {label}")
    for r in reasons:
        print(f"  - {r}")
    return code


if __name__ == "__main__":
    sys.exit(main())
