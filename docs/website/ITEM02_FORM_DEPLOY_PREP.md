# Item 2 — Formulário «Quero expor»: pré-deploy e inventário (HUMAN GATE)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Estado: **deploy PREPARADO, NÃO EXECUTADO.** Depende de **credenciais/contas externas** não disponíveis nesta sessão. **Nenhum valor de secret foi inventado nem deve ser colado no chat/repositório.**

## Pré-requisito que muitas vezes passa despercebido
O site publicado está **hoje em `mode: demo`** (`https://projectomilreu.pt/public/config/collaborative-area.runtime.json` → `supabaseUrl: null`). Em demo, o formulário **mostra-se e aceita**, mas devolve uma **referência DEMO sem enviar e-mail** (fallback gracioso). Para o formulário funcionar a sério é preciso, **por ordem**:
1. Existir um **projecto Supabase de produção**.
2. O **site** ser publicado em **modo `supabase`** — definir os secrets `MILREU_SUPABASE_URL` + `MILREU_SUPABASE_PUBLISHABLE_KEY` no deploy do Pages e **republicar** (workflow `07d-pages.yml`).
3. A **Edge Function** ser publicada nesse projecto (workflow `exhibition-proposal-deploy.yml`).
4. Os **secrets da função** (Resend, remetente, destinatários, origem) estarem configurados.
5. A conta **Resend** ter o **domínio/remetente verificado**.

## Inventário de variáveis

| Variável | Secret? | Valor/configuração conhecida? | Onde configurar | Acção humana necessária |
|---|---|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | **SIM (secret)** | ❌ não (token de conta Supabase) | GitHub → Settings → Secrets and variables → Actions → **Secret** | **Sim** — gerar na conta Supabase (Account → Access Tokens) |
| `SUPABASE_PROJECT_REF` | Não (identificador público) | ❌ **não derivável** (não há projecto prod; `config.toml` só tem o nome local) | GitHub → Settings → Secrets and variables → Actions → **Variable** `SUPABASE_PROJECT_REF` | **Sim** — criar/designar o projecto Supabase de produção e copiar o *Project ref* |
| `EXPOR_RESEND_API_KEY` | **SIM (secret)** | ❌ não (API key Resend) | GitHub → Settings → Secrets and variables → Actions → **Secret** | **Sim** — criar conta Resend e gerar API key |
| `EXPOR_EMAIL_FROM` | Não (endereço remetente) | ⚠️ a decidir (ex.: `no-reply@projectomilreu.pt`) — exige **domínio verificado no Resend** | GitHub → Settings → Secrets and variables → Actions → **Variable** `EXPOR_EMAIL_FROM` | **Sim** — verificar domínio/remetente no Resend e indicar o endereço |
| `EXPOR_NOTIFY_RECIPIENTS` | **SIM (secret)** — são e-mails pessoais (não registar em logs/repo) | ⚠️ **HUMAN PENDING** — sugestão do código: `a78190@ualg.pt,fernando.jacomo@yahoo.com` | GitHub → Settings → Secrets and variables → Actions → **Secret** | **Sim** — **confirmar** os destinatários |
| `ALLOWED_ORIGINS` | Não (origem pública) | ✅ **conhecido**: `https://projectomilreu.pt` | Já é **default no workflow** (opcional: Variable `EXPOR_ALLOWED_ORIGINS`) | **Não** (confirmado) |

**Resumo da classificação**
- **GitHub Secrets (sensíveis):** `SUPABASE_ACCESS_TOKEN`, `EXPOR_RESEND_API_KEY`, `EXPOR_NOTIFY_RECIPIENTS`.
- **GitHub Variables (não-sensíveis):** `SUPABASE_PROJECT_REF`, `EXPOR_EMAIL_FROM` (e, opcional, `EXPOR_ALLOWED_ORIGINS`).
- **Já resolvido no repo:** `ALLOWED_ORIGINS = https://projectomilreu.pt` (default do workflow).
- **Pré-requisito do site (separado):** secrets `MILREU_SUPABASE_URL` + `MILREU_SUPABASE_PUBLISHABLE_KEY` no deploy do Pages (senão fica em demo).

## Workflow e smoke test (prontos, não executados)
- `.github/workflows/exhibition-proposal-deploy.yml`: valida presença da config → aplica secrets à função → publica (`--no-verify-jwt`) → **smoke test** (honeypot → 200 sem e-mail; payload inválido → 422). O smoke test prova que a função está publicada e a validar **sem enviar e-mail**.

## Checklist exacta (o que o Fernando faz FORA do repositório)
> Nenhum destes valores deve ser colado no chat. Configuram-se diretamente no GitHub/Supabase/Resend.

1. **Supabase (produção)**
   a. Criar (ou escolher) o **projecto Supabase de produção**.
   b. Copiar o **Project ref** (Settings → General) e a **Project URL** e a **publishable/anon key** (Settings → API).
   c. Gerar um **Access Token** (foto de perfil → Account → Access Tokens).
2. **Resend (e-mail)**
   a. Criar conta em resend.com.
   b. **Verificar o domínio** de envio (ou um remetente), p.ex. `projectomilreu.pt` (adicionar os registos DNS que o Resend indicar).
   c. Gerar uma **API key**.
3. **GitHub → repositório → Settings → Secrets and variables → Actions** (nível do repositório — sem criar ambientes)
   - Separador **Secrets:** `SUPABASE_ACCESS_TOKEN`, `EXPOR_RESEND_API_KEY`, `EXPOR_NOTIFY_RECIPIENTS` (destinatários confirmados).
   - Separador **Variables:** `SUPABASE_PROJECT_REF`, `EXPOR_EMAIL_FROM` (remetente verificado).
   - **Para o site sair de demo (deploy do Pages):** Secrets `MILREU_SUPABASE_URL`, `MILREU_SUPABASE_PUBLISHABLE_KEY`.
4. **Avisar o Claude** que os secrets/variables estão criados (sem os valores). A partir daí, o Claude pode: republicar o site em modo supabase, correr o workflow de deploy da função + smoke test, e fazer o QA do frontend. **O envio real de e-mail** confirma-se consigo (verificar a caixa de entrada dos destinatários).

## HUMAN GATE
Parar aqui. O deploy só avança depois de (1) e (2) e (3) acima. O Claude **não** tem, e **não** deve receber no chat, nenhum destes tokens/keys.
