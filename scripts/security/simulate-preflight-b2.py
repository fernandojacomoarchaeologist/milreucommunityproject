# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.
"""Simula o preflight B2 (L1-08/09) com Supabase CLI e curl falsos, sem rede nem secrets reais.

Uso: python3 scripts/security/simulate-preflight-b2.py   (requer PyYAML e jq no PATH)
Verifica, por cenário, o estado atribuído a cada propriedade e que nenhum valor aparece
no output nem no resumo. Ferramenta de desenvolvimento; não corre no CI.
"""
import os, re, subprocess, sys, tempfile, yaml

WF = ".github/workflows/l1-08-production-secrets-preflight.yml"
SUPABASE = r'''#!/bin/bash
case "$1 $2" in
  "functions list") [ "$SIM_FN" = deny ] && { echo "status 403: permission" >&2; exit 1; }; echo '[{"slug":"exhibition-proposal-intake"}]';;
  "secrets list") [ "$SIM_SEC" = deny ] && { echo "status 403: You do not have permission" >&2; exit 1; }; echo '[{"name":"ALLOWED_ORIGINS"},{"name":"EXPOR_EMAIL_FROM"},{"name":"EXPOR_NOTIFY_RECIPIENTS"},{"name":"EXPOR_RESEND_API_KEY"}]';;
  "projects list") case "$SIM_PROJ" in deny) echo "status 403: You do not have permission" >&2; exit 1;; one) echo '[{"id":"refprod"}]';; many) echo '[{"id":"refprod"},{"id":"a"},{"id":"b"}]';; *) echo "network error" >&2; exit 1;; esac;;
esac
'''
CURL = r'''#!/bin/bash
out=""; while [ $# -gt 0 ]; do [ "$1" = "-o" ] && { out="$2"; shift; }; shift; done
case "$SIM_RESEND" in restricted) echo '{"name":"restricted_api_key"}' >"$out"; printf 401;; full) echo '{"data":[]}' >"$out"; printf 200;; *) echo '{"name":"validation_error"}' >"$out"; printf 400;; esac
'''
CASES = {  # cenário: (variáveis, estados esperados {propriedade (substring): estado}, rc esperado)
    "classico_1_projecto": (dict(SIM_FN="ok", SIM_SEC="ok", SIM_PROJ="one", SIM_RESEND="restricted"), {"limitado a um só": "UNKNOWN", "restrita a envio": "VERIFIED"}, 0),
    "classico_3_projectos": (dict(SIM_FN="ok", SIM_SEC="ok", SIM_PROJ="many", SIM_RESEND="full"), {"limitado a um só": "VERIFIED (NÃO limitado)", "restrita a envio": "VERIFIED (NÃO restrita)"}, 0),
    "limitado_recusa": (dict(SIM_FN="ok", SIM_SEC="deny", SIM_PROJ="deny", SIM_RESEND="restricted"), {"não é clássico": "VERIFIED", "limitado a um só": "NOT VERIFIED", "Secrets Read |": "NOT VERIFIED"}, 0),
    "erro_rede": (dict(SIM_FN="ok", SIM_SEC="ok", SIM_PROJ="err", SIM_RESEND="restricted"), {"limitado a um só": "UNKNOWN"}, 0),
    "sem_funcoes": (dict(SIM_FN="deny", SIM_SEC="ok", SIM_PROJ="one", SIM_RESEND="restricted"), {"Edge Functions Read no": "FAIL"}, 1),
    "resend_invalida": (dict(SIM_FN="ok", SIM_SEC="ok", SIM_PROJ="one", SIM_RESEND="bad"), {"reconhecida": "FAIL"}, 1),
}

def main():
    steps = [s["run"] for s in yaml.safe_load(open(WF))["jobs"]["preflight"]["steps"] if "run" in s]
    tmp = tempfile.mkdtemp(); os.makedirs(f"{tmp}/bin")
    for name, body in (("supabase", SUPABASE), ("curl", CURL)):
        open(f"{tmp}/bin/{name}", "w").write(body); os.chmod(f"{tmp}/bin/{name}", 0o755)
    failures = 0
    for case, (sim, expected, want_rc) in CASES.items():
        summary = f"{tmp}/summary.md"; open(summary, "w").close()
        env = dict(os.environ, PATH=f"{tmp}/bin:" + os.environ["PATH"], GITHUB_STEP_SUMMARY=summary, GITHUB_REF="refs/heads/main",
                   CONFIRMATION="RUN_PRODUCTION_SECRETS_PREFLIGHT", PROJECT_REF="refprod", SUPABASE_ACCESS_TOKEN="tok-SECRETVALUE", RESEND_KEY="re_SECRETVALUE", **sim)
        env.update({f"S_{n}": "v-SECRETVALUE" for n in ("SUPABASE_ACCESS_TOKEN", "SUPABASE_PROJECT_REF", "EXPOR_RESEND_API_KEY", "EXPOR_EMAIL_FROM", "EXPOR_NOTIFY_RECIPIENTS", "EXPOR_ALLOWED_ORIGINS")})
        out, rc = "", 0
        for step in steps:
            r = subprocess.run(["bash", "-c", step], env=env, capture_output=True, text=True); out += r.stdout + r.stderr
            if r.returncode: rc = r.returncode; break
        text = open(summary).read()
        problems = []
        if "SECRETVALUE" in out + text: problems.append("valor exposto")
        if (rc != 0) != bool(want_rc): problems.append(f"rc={rc}")
        for prop, state in expected.items():
            line = next((l for l in text.splitlines() if prop in l), "")
            if f"| {state} |" not in line: problems.append(f"{prop!r}: {line or 'ausente'}")
        print(("OK   " if not problems else "FAIL ") + case + ("" if not problems else "  " + "; ".join(problems)))
        failures += bool(problems)
    sys.exit(1 if failures else 0)

if __name__ == "__main__":
    main()
