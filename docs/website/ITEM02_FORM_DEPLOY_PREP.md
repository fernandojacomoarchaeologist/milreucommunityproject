# Item 2 — Formulário «Quero expor»: preparação do deploy (HUMAN GATE)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Estado: **deploy PREPARADO, NÃO EXECUTADO.** O deploy real depende de **credenciais externas** que não estão disponíveis nesta sessão. **Não se inventaram valores de secrets.**

## O que já está pronto
- **Edge Function** `supabase/functions/exhibition-proposal-intake/index.ts` — valida campos, exige consentimento (`privacyAccepted`), honeypot anti-bot, allowlist de origem (CORS), envia e-mail via **Resend**, **falha fechada** (503) sem secrets, **não grava em DB**, **não expõe nem regista segredos**.
- **Workflow de deploy** `.github/workflows/exhibition-proposal-deploy.yml` — aplica os secrets à função (a partir de GitHub Environment secrets, nunca hardcoded) e publica com `--no-verify-jwt` (endpoint público protegido pela própria função).
- **Frontend** ligado: `src/collab/controller.js` → `functions.invoke("exhibition-proposal-intake")`.

## Secrets necessários (GitHub Environment «production») — valores canónicos a definir pelo responsável
| Secret (GitHub) | Aplicado a | Valor canónico | Estado |
|---|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | CLI Supabase | *(token de conta Supabase)* | ⛔ **EXTERNO — não disponível nesta sessão** |
| `SUPABASE_PROJECT_REF` | projecto Supabase de produção | *(project ref)* | ⛔ **a confirmar** (o mesmo projecto que serve o site) |
| `EXPOR_RESEND_API_KEY` | `EXPOR_RESEND_API_KEY` da função | *(API key Resend)* | ⛔ **EXTERNO — conta Resend** |
| `EXPOR_EMAIL_FROM` | remetente | ex.: `no-reply@projectomilreu.pt` (**domínio/remetente verificado no Resend**) | ⛔ **a verificar no Resend** |
| `EXPOR_NOTIFY_RECIPIENTS` | destinatários | **a confirmar** (o comentário da função sugere `a78190@ualg.pt,fernando.jacomo@yahoo.com`) | ⚠️ **confirmar — não inventado** |
| `EXPOR_ALLOWED_ORIGINS` | `ALLOWED_ORIGINS` | `https://projectomilreu.pt` | ✅ conhecido (origem pública do site) |

## Passos de deploy (quando os secrets existirem)
1. Criar os secrets acima no GitHub Environment `production`.
2. **Resend:** verificar o **domínio/remetente** (`EXPOR_EMAIL_FROM`) na conta Resend (SPF/DKIM), senão o envio falha.
3. Correr o workflow **Deploy Exhibition Proposal Intake** (`workflow_dispatch`, confirmação `DEPLOY_EXHIBITION_PROPOSAL_INTAKE`).
4. Executar o QA abaixo em produção.

## QA de produção (a executar após o deploy)
- [ ] **Desktop** — submissão válida → sucesso (referência `EXPO-…`);
- [ ] **Mobile** — idem;
- [ ] **Erro** — e-mail inválido/mensagem curta/sem consentimento → mensagem de erro clara (422);
- [ ] **Campos obrigatórios** — validação no cliente e no servidor;
- [ ] **Caracteres PT** (acentos, ç, «») preservados no e-mail recebido;
- [ ] **E-mail efectivamente recebido** pelos destinatários (conteúdo correcto, `reply-to` = e-mail do proponente);
- [ ] **Sem exposição** de secrets/dados sensíveis (frontend, logs, respostas);
- [ ] Origem não permitida → 403 (allowlist); honeypot preenchido → aceite silenciosamente sem notificar.

## HUMAN GATE — o que falta exactamente (deploy parado aqui)
Não é possível avançar sem, do responsável:
1. **`SUPABASE_ACCESS_TOKEN`** (token de conta Supabase) + **`SUPABASE_PROJECT_REF`** do projecto de produção.
2. **Conta/`EXPOR_RESEND_API_KEY` do Resend** + **domínio/remetente verificado** (`EXPOR_EMAIL_FROM`).
3. **Confirmação dos destinatários** (`EXPOR_NOTIFY_RECIPIENTS`).

Assim que estes forem criados como GitHub Environment secrets (ou indicados por canal seguro — **nunca** colar no chat), executa-se o workflow e corre-se o QA. **Não** colar valores de secrets no chat nem no repositório.
