# Handoff — Item 2B · Segurança do sistema

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Escopo adicional do Item 2 (website). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (secção «Item 2 — Segurança do sistema»).

**O que é.** Avaliação de **segurança defensiva** do próprio projecto (prevenção de invasão, governança de CI/CD, endurecimento dos endpoints públicos) + **documentação de sistema** que serve de base à avaliação. **HUMAN GATE, sem commit/PR.**

**Estado actual (2026-10-12):** `P0 AUDIT COMPLETE / NO PATCHES APPLIED` (validação aceite) → **`L1 PHASE 1 APPLIED / ADMINISTRATIVE VERIFIED`** (L1-01…L1-05 + L1-06 + **L1-06b**, 2026-10-12) → **L2 em desenvolvimento** na branch `security/l2-workflow-hardening` (3 commits, **sem push/PR/merge**; aguarda revisão). L3–L6 não iniciados.

## 1. Local dos arquivos
- **`docs/security/SYSTEM_ARCHITECTURE_AND_INTEGRATIONS.md`** — documento de sistema (grounded no repo). ⚠️ Contém afirmações que a auditoria P0 **desmentiu** (ver §2) — corrigir quando o doc for revisto.
- **Relatórios P0 + plano L1 — só no scratchpad da sessão `d4d07cf9` (EFÉMERO, não versionado)**, por decisão do responsável («não integrar ainda o relatório definitivo no repositório»):
  - `…/scratchpad/SECURITY_AUDIT_P0_2026-10-12.md` (auditoria completa: workflows, endpoints, CSP, SEC-P0-001…015)
  - `…/scratchpad/SECURITY_AUDIT_P0_VALIDATION_2026-10-12.md` (verificações administrativas GitHub, evidência 001/002/010, severidades revistas, lotes L1–L7)
  - `…/scratchpad/L1_GITHUB_GOVERNANCE_PLAN_2026-10-12.md` (preflight + plano + gate L1-01…L1-13)
  - `…/scratchpad/sec001/sim.py` (harness local que demonstra a injecção do SEC-P0-001 com stubs)
  - Caminho completo do scratchpad: `/private/tmp/claude-501/-Users-fernandojacomo-Desktop-Milreu-community-Project/d4d07cf9-8edd-417e-bec9-3b50f3aef0f2/scratchpad/`
  - **Risco:** o scratchpad pode desaparecer → **integrais preservados no cofre privado** `/Users/fernandojacomo/Desktop/Milreudocs/SEGURANCA/2026-10-12_P0_L1/` (4 MD + `sec001_sim.py` + `l1_api_responses/` + `SHA256SUMS.txt`; permissões 700/600; fora do Git).
- **Versões públicas expurgadas (preparadas, SEM commit, aguardam revisão humana):** `docs/security/audits/SECURITY_AUDIT_P0_2026-10-12_PUBLIC.md`, `docs/security/audits/SECURITY_AUDIT_P0_VALIDATION_2026-10-12_PUBLIC.md`, `docs/security/plans/L1_GITHUB_GOVERNANCE_2026-10-12_PUBLIC.md`. Expurgo: sem mecânica/payloads de achados abertos, sem nomes de secrets, IDs de projectos, scopes de token, fornecedor DNS ou harness.
- ~~`docs/security/AUDIT_P0_2026-10-12.md`~~ — **removido** (versão temporária, sem informação única; ver §11).
- Pré-existentes: `docs/security/THREAT_MODEL.md`, `RLS_BASELINE.md`, `SECRET_MANAGEMENT.md`, `PRODUCTION_ACCESS_POLICY.md`, `PERSONAL_DATA_BOUNDARIES.md`, `INCIDENT_AND_ROLLBACK.md`.

## 2. Pontos mais importantes
- **Exposição real em produção (VERIFIED 2026-10-12):** site estático GitHub Pages, `noindex`; **Área Colaborativa inactiva** (`mode:"demo"`, `supabaseUrl:null`, `allowDemo:false`). **Único endpoint activo:** `exhibition-proposal-intake` («Quero expor», projecto Supabase `xdbdifjkqvvqcxpfhlwt`). Versões implantadas = HEAD (função @ `43f20ad`, site @ `aecc76c`).
- **Correcções a afirmações anteriores (medido):** (a) secrets **NÃO** estão por GitHub Environment — os 6 existentes são **repo-level** e os environments `production`/`github-pages` não têm secrets; (b) rate-limit e Turnstile existem **só** no `community-contribution-intake` (não activo), e o Turnstile tem falhas (fail-open; o frontend nunca envia o token); o «Quero expor» **não** tem rate-limit nem Turnstile; (c) environment `staging` **não existe**; `production` **não tem revisores**; `main` **sem branch protection/rulesets**.
- **Achados P0 (severidades revistas):** **SEC-P0-016 Medium** (governança GitHub: `main` desprotegida, `production` sem revisores, secrets críticos repo-level incl. `SUPABASE_ACCESS_TOKEN`) · **SEC-P0-002 Medium** («Quero expor» sem rate-limit/desafio; pedidos sem `Origin` passam; impacto = inundação/quota Resend/phishing via `reply_to`; **não** é relay aberto) · **SEC-P0-001 Low hoje → Medium** se forem criados `SUPABASE_URL`/`SERVICE_ROLE_KEY` (injecção de comandos em `08i-retention-apply.yml`, **execução comprovada localmente**) · **SEC-P0-017 Low** (domínio sem verificação) · **SEC-P0-010 Informational** (`07d-pages` sem `MILREU_ENVIRONMENT` → `environment:"local"`; nenhum bypass efectivo) · 003–006 Low mas **bloqueantes da activação da Área Colaborativa** · restantes Low/Info.
- **Positivo (VERIFIED):** 0 `pull_request_target`/`workflow_run`; 56/56 workflows com `permissions:` explícito; nenhum secret em workflows de PR; secret scanning + push protection activos (0 alertas); token por omissão `read`.
- **Método obrigatório:** audit-first; cada achado `MEASURED → GAP → PROPOSED CHANGE → RISK → TEST`; estados de evidência `IMPLEMENTED/DEPLOYED/CONFIGURED/ACTIVE/VERIFIED/UNKNOWN`; cada alteração em matriz `ACTUAL → PROPOSTA → DEPENDÊNCIAS → RISCO → VALIDAÇÃO → ROLLBACK`.
- **Correcção técnica:** `frame-ancestors`, **HSTS** e **CSP Report-Only** **não funcionam** via `<meta>` (Pages não permite headers próprios).

## 3. Como se estruturou a arte
N/A (item documental/técnico). Formato = auditoria por superfície (workflows · endpoints · CSP) + registo SEC-P0-XXX + lotes de remediação L1–L7.

## 4. Como se trabalhou ponto a ponto
1. Documentar o sistema real (grounded).
2. Verificação read-only do bundle público (sem segredos).
3. Plano reordenado **audit-first**.
4. **Auditoria P0 read-only** (repo + GETs a ficheiros públicos do site) → `P0 AUDIT PARTIAL`.
5. **Validation gate**: GETs à API GitHub (sem revelar valores), simulação local do 08i, análise de `environment:"local"` → `P0 AUDIT COMPLETE / NO PATCHES APPLIED`.
6. **L1 preflight + plano** (governança GitHub) → `L1 PLAN READY / NOT APPLIED`.
7. Próximo: aprovação por ID do L1 → depois **L2** (workflows: 001, 007, 008, 009, 010 + nomes de jobs únicos; testes locais, sem credenciais reais, sem deploy).

## 5. O que NÃO fazer
- **NÃO** aplicar alterações administrativas GitHub nem migrar secrets sem aprovação explícita **por ID** (L1-01…L1-13).
- **NÃO** criar o environment `staging` só para cumprir documentação (não há projecto/secrets de staging; decisão de 2026-10-12).
- **NÃO** exigir aprovações ≥1 em PR nem `prevent_self_review` (um só administrador → auto-bloqueio).
- **NÃO** exigir status checks `validate`/`quality` (nomes repetidos em 18/12 workflows) nem checks com filtro `paths:` — só após o L2.
- **NÃO** copiar os mecanismos do `community-contribution-intake` para o «Quero expor» sem corrigir as falhas (fail-open, User-Agent no fingerprint, erros crus, sem timeout).
- **NÃO** fazer pedidos/submissões aos endpoints de produção para testar; **NÃO** disparar workflows privilegiados.
- **NÃO** pedir/mostrar valores de secrets; os valores nunca passam pelo Claude.
- **NÃO** pôr `frame-ancestors`/HSTS/Report-Only em CSP `<meta>`.
- **NÃO** escrever em produção pelo browser; produção read-only por defeito.

## 6. Resultado esperado
Remediação por lotes independentes e reversíveis: **L1** governança GitHub → **L2** workflows → **L3** «Quero expor» higiene + testes (+ redeploy com gate) → **L4** Turnstile fail-closed (decisão humana) → **L7** CSP; **L5** (rate-limit com BD) e **L6** (activação colaborativa: 003–006, 011) só com decisão própria. Pré-go-live: OAuth/storage/backup+restauro/observabilidade.

## 7. Documentos necessários
Relatórios do scratchpad (§1); `docs/security/*`; `.github/workflows/*.yml`; `supabase/functions/*`; regras `.claude/rules/secrets-and-environments.md`, `08g-no-secrets-in-artifacts.md`, `08e-edge-service-role-boundary.md`, `production-data-access.md`, `collaborative-rls-required.md`.

## 8. Pendências observadas
- ✅ **L1 fase 1 aplicada** (L1-01…L1-05) + **L1-06 restrição de produção a `main`** — verificado por leitura (ver §11).
- ✅ `require_extra_approval_for_unattributed_changes: true` — **mantido por decisão** (2026-10-12); comportamento a confirmar no **próximo PR normal** (candidato: PR do L2). Parâmetro sem documentação pública encontrada.
- ✅ **L1-06b aplicado**: `production` com revisor obrigatório = administrador único, `prevent_self_review:false`, bypass admin permitido, deploy só de `main`. Validação = no próximo deploy legítimo (`exhibition-proposal-deploy` deve parar em «Review deployments»).
- 🟠 **Revisão do L2** (diff + testes no cofre e no scratchpad) → autorizar push/PR.
- 🟠 **L1-07…L1-13** sem autorização (checks após L2; secrets; domínio; 2FA/token).
- 🟠 **Revisão humana das 3 versões públicas** antes de qualquer commit.
- 🟠 **L1-09:** há cópia segura de `SUPABASE_ACCESS_TOKEN` e `EXPOR_RESEND_API_KEY`? Se não → migração exige credencial nova (fase de rotação, fora do L1).
- 🟠 **Verificação do domínio** `projectomilreu.pt` (TXT `_github-pages-challenge-…` ainda inexistente; DNS em `host-redirect.com`; fornecedor UNKNOWN).
- 🟠 **2FA** da conta e redução de scopes do token `gh` local (`repo, workflow, read:org, gist`, sem expiração) — UNKNOWN/humano.
- 🟠 **Decisão L4:** Turnstile no «Quero expor» (terceiro, privacidade, CSP).
- 🟠 **UNKNOWN (sem acesso):** Supabase (`ALLOWED_ORIGINS` efectivo, schema colaborativo em `xdbdif…`, limite de corpo, `X-Forwarded-For`), Resend (plano/quota/alertas, SPF/DKIM/DMARC), plano da conta GitHub.
- 🟠 Corrigir `SYSTEM_ARCHITECTURE_AND_INTEGRATIONS.md` (afirmações desmentidas em §2).
- 🟠 P1 restante: RLS audit, CodeQL, SHA-pinning, Dependabot.

## 9. Dossiê do modo de trabalhar (Item 2B)
Postura defensiva e conservadora: **medir antes de mudar**; distinguir código vs. implantado vs. configurado vs. verificado; nunca inferir estado sem acesso (→ `UNKNOWN`); nunca tocar produção; nunca expor segredos; testes intrusivos proibidos — demonstrações só locais com stubs. Cada recomendação testável e reversível, com rollback. Fases terminam sempre com **STOP para aprovação humana**.

## 10. Onde está cada informação
- **Arquitectura/integrações:** `docs/security/SYSTEM_ARCHITECTURE_AND_INTEGRATIONS.md` (com correcções pendentes).
- **Auditoria P0, validação e plano L1:** scratchpad da sessão `d4d07cf9` (§1) — efémero.
- **Modelo de ameaças/RLS/segredos:** restantes ficheiros `docs/security/`.
- **Estado/histórico:** §11 deste ficheiro + `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (secção Segurança + «Registo incremental por item») + memória da sessão.

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
- 2026-10-12 · NOVO · Auditoria P0 read-only executada (workflows, endpoints «Quero expor» + `community-contribution-intake`, inventário CSP); estado `P0 AUDIT PARTIAL` (faltavam definições administrativas GitHub). · `scratchpad/SECURITY_AUDIT_P0_2026-10-12.md`
- 2026-10-12 · DECISÃO · Auditoria aceite com reservas; implementação NÃO autorizada; relatório definitivo NÃO integrado no repo. · responsável
- 2026-10-12 · REMOVIDO · `docs/security/AUDIT_P0_2026-10-12.md` (não versionado; versão temporária coberta pelo relatório completo; remoção autorizada). · responsável
- 2026-10-12 · NOVO · Validation gate: verificações administrativas GitHub read-only; SEC-P0-001 demonstrado localmente (execução de comandos + persistência via `GITHUB_ENV`/`BASH_ENV`); SEC-P0-010 sem bypass efectivo; novos achados SEC-P0-016 (Medium) e SEC-P0-017 (Low). Estado → `P0 AUDIT COMPLETE / NO PATCHES APPLIED`. · `scratchpad/SECURITY_AUDIT_P0_VALIDATION_2026-10-12.md`
- 2026-10-12 · ALTERADO · Severidades: 001 Medium→Low (hoje; Medium se forem criados os secrets de service role); 010 Low→Informational; 003–006 = bloqueantes da activação da Área Colaborativa.
- 2026-10-12 · ALTERADO · §2 corrigido: secrets são repo-level (não por environment); rate-limit/Turnstile não existem no «Quero expor»; `staging` inexistente; `production` sem revisores; `main` desprotegida. · API GitHub
- 2026-10-12 · DECISÃO · Validação aceite; estado canónico `P0 AUDIT COMPLETE / NO PATCHES APPLIED`; iniciar remediação pelo **L1**; preparação integral autorizada, **aplicação e migração de secrets NÃO autorizadas**. · responsável
- 2026-10-12 · NOVO · L1 preflight + plano (L1-01…L1-13): ruleset `main` (deletion + non_fast_forward + PR com 0 aprovações, sem required checks); `production` com reviewer = admin, `prevent_self_review:false`, branch `main`, `can_admins_bypass:false`; migração de 6 secrets para `production` em gate próprio; domínio, 2FA e token = acções humanas. Estado → `L1 PLAN READY / NOT APPLIED`. · `scratchpad/L1_GITHUB_GOVERNANCE_PLAN_2026-10-12.md`
- 2026-10-12 · DECISÃO (proposta) · Não criar o environment `staging` nesta fase (sem projecto/secrets de staging; 0 runs); guarda contra auto-criação de environment vai para o L2. · plano L1 §A4
- 2026-10-12 · PENDENTE · Aprovação por ID do L1; cópia segura de `SUPABASE_ACCESS_TOKEN`/`EXPOR_RESEND_API_KEY` (L1-09); verificação do domínio; 2FA/token; persistência dos relatórios do scratchpad.
- 2026-10-12 · DECISÃO · Execução faseada autorizada: Fase 1 = L1-01…L1-05 via API; Fase 2 = L1-06 só restrição de branch; L1-07…13, secrets, tokens e `staging` NÃO autorizados; persistir relatórios com versões públicas expurgadas. · responsável
- 2026-10-12 · NOVO · L1-01 aplicado: ruleset `main-baseline` (id `24915653`, `~DEFAULT_BRANCH`, `deletion` + `non_fast_forward`, sem bypass). Leitura de confirmação OK. · API GitHub
- 2026-10-12 · NOVO · L1-02 aplicado: Dependabot alerts activados (GET 204); security updates automáticas continuam desligadas. · API GitHub
- 2026-10-12 · NOVO · L1-03 aplicado: private vulnerability reporting `enabled:true`. · API GitHub
- 2026-10-12 · REMOVIDO · L1-04: política de deploy `None` (id `61525819`) do environment `github-pages`; resta só `main` (todos os 14 deploys do site saíram de `main`; ramo `None` inexistente). · API GitHub
- 2026-10-12 · NOVO · L1-05 aplicado: regra `pull_request` no ruleset (0 aprovações; merge/squash/rebase; sem required checks); `current_user_can_bypass: never`. ⚠️ GitHub acrescentou por omissão `require_extra_approval_for_unattributed_changes: true` (não pedido) — **não alterado**, aguarda decisão. · API GitHub
- 2026-10-12 · NOVO · L1-06 (parte autorizada): `production` só aceita deploys de `main` (política `62762326`); `can_admins_bypass:true`, sem revisores, wait 0 — inalterados. Nenhum workflow corrido. · API GitHub
- 2026-10-12 · RESOLVIDO · Leitura global pós-alteração: 6 secrets e 3 variables inalterados; environments = `github-pages`, `production` (sem `staging`); 1 ruleset activo. Estado → `L1 PHASE 1 APPLIED / ADMINISTRATIVE VERIFIED`. · API GitHub
- 2026-10-12 · NOVO · Relatórios integrais + harness + registo de execução + respostas da API preservados no cofre privado `Milreudocs/SEGURANCA/2026-10-12_P0_L1/` (SHA-256). · cofre
- 2026-10-12 · NOVO · 3 versões públicas expurgadas preparadas em `docs/security/audits/` e `docs/security/plans/` (sem commit; varredura de expurgo limpa). · repo (untracked)
- 2026-10-12 · PENDENTE · Decisão sobre `require_extra_approval_for_unattributed_changes`; L1-06b; revisão humana das versões públicas; L2 após aprovação.
- 2026-10-12 · DECISÃO · L1 fase 1 aceite; manter `require_extra_approval_for_unattributed_changes=true` e confirmá-lo num PR normal; configurar L1-06b; iniciar L2 numa branch dedicada (commits só na branch; sem merge/deploy/migrations/alterações administrativas adicionais); rever versões públicas sem commit. · responsável
- 2026-10-12 · RESOLVIDO · Fase 1 do L1 encerrada (L1-01…L1-06 verificados).
- 2026-10-12 · NOVO · L1-06b aplicado e verificado: `production` → `required_reviewers` = `fernandojacomoarchaeologist` (User), `prevent_self_review:false`, `can_admins_bypass:true`, `branch_policy` custom = `main` (política `62762326` preservada). Sem auto-bloqueio. Nenhum workflow corrido; validação no próximo deploy legítimo. · API GitHub
- 2026-10-12 · PENDENTE · `require_extra_approval_for_unattributed_changes`: sem documentação pública; não há PRs abertos → verificar no PR do L2 (estado de merge/regras) quando autorizado.
- 2026-10-12 · NOVO · L2 desenvolvido num worktree isolado (`scratchpad/wt-l2`, branch `security/l2-workflow-hardening` a partir de `1339188`): commits `58e1ffc` (SEC-P0-001), `d2f1873` (SEC-P0-009/010), `3689254` (SEC-P0-007/008/012 + guarda de staging `MILREU_STAGING_ENABLED`). 56 workflows tocados (maioria mecânica: `persist-credentials:false` ×67, `setup-cli` por SHA `1dedf2c…` v1.7.3 + CLI `2.109.1` ×19). **Sem push.** · worktree
- 2026-10-12 · NOVO · Testes L2 (locais, sem credenciais): SEC-P0-001 13/13 (controlo `main` 0/13 com 4 execuções injectadas); URL 10/10; simulação do build de produção OK (`environment=production`, `allowDemo=false`, perfil regenerado após testes); 641/641 testes; validate exit 0; actionlint 0; zizmor 0 (baseline 92). Residuais documentados: env do job em `07d-pages` (config pública) e `08g` (config não-credencial incl. e-mail master, workflow inactivo). Evidências no cofre `…/2026-10-12_P0_L1/l2/`. · scratchpad + cofre
- 2026-10-12 · ALTERADO · Versões públicas revistas semanticamente: removidos sinais operacionais (componente público com achado aberto, estado de verificação do domínio, composição/higiene de contas, âmbito de credenciais, controlos em falta); actualizado L1-06b e L2. Continuam **sem commit**. · `docs/security/audits|plans/*_PUBLIC.md`
- 2026-10-12 · PENDENTE · Aprovação para push + abrir PR do L2 (e verificar nele a regra de PR); L1-07 após o L2; L1-08…13; L3–L6 não iniciados.
