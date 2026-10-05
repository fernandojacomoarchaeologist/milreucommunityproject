# Spec (PROPOSTA) — Backend do formulário «Quero expor» sem quebrar o site estático

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **ESTADO: PROPOSTA — NÃO APROVADA, NÃO IMPLEMENTADA.** Requer decisão humana (governação) + aprovação desta spec antes de qualquer alteração de código. scope-check: `IN_SCOPE_NEEDS_SPEC` · iniciativa `INIT-MUSEUM` (sec. `INIT-MEETINGS`).

## 1. Problema
O formulário público «Quero expor» (pedido para acolher a exposição itinerante) está pronto no frontend e tem uma Edge Function pronta (`exhibition-proposal-intake`, só notificação por e-mail). Mas:
- O site publicado é **estático por desenho**; `validate-foundation.mjs` **proíbe credenciais Supabase no pacote** (alinhado com `mvp-scope-control` e `static-first-runtime`).
- Hoje o frontend chama a função via **cliente Supabase** (`functions.invoke`), que exigiria `supabaseUrl` + chave no site → **barra a publicação**.
- Resultado atual (correto, por desenho): o formulário cai em **demo** e **não envia e-mail**.

## 2. Objetivo
Permitir **apenas** o envio real do formulário «Quero expor», **sem** introduzir no site o cliente/credenciais Supabase, autenticação ou base de dados — mantendo o resto do MVP estático.

## 3. Princípio de desenho (mínimo e honesto)
O formulário passa a submeter **diretamente** para o **URL público da Edge Function** via `fetch`, em vez de usar o cliente Supabase.
- O URL da função (`https://<ref>.supabase.co/functions/v1/exhibition-proposal-intake`) **não é uma credencial**: não contém chaves; a função é pública (deploy `--no-verify-jwt`) e protege-se por **allowlist de origem + honeypot + validação + consentimento**.
- **Não** se adiciona `supabaseUrl`/`supabasePublishableKey` ao pacote → a regra `validate-foundation` **continua a passar** (não é contornada; apenas não lhe damos credenciais).
- Sem cliente Supabase, sem auth, sem DB, sem leitura remota: o site continua estático.

## 4. Alterações previstas (a implementar só após aprovação)
### 4.1 Código
- `src/collab/controller.js` — no envio do «quero expor», substituir `this.client.functions.invoke(...)` por `fetch(endpoint, {method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({payload, website})})`, lendo `endpoint` da config pública. Manter o fallback demo quando `endpoint` não estiver definido.
- `src/views/expor.js` — sem alteração (já trata demo/enviado/erro).
### 4.2 Configuração (sem credenciais)
- Novo campo público, ex.: `exhibitionProposalEndpoint` (string | null), por omissão `null` (→ demo). Em produção é preenchido com o URL da função (injeção por `env` no build, p.ex. `MILREU_EXPOR_ENDPOINT`). **Não** reutiliza `supabaseUrl`.
- `validate-foundation.mjs` — manter o gate de credenciais; acrescentar que `exhibitionProposalEndpoint` é permitido (URL público, sem chave) e **não** conta como «credencial Supabase». Testes atualizados.
### 4.3 Governação
- Anotar em `mvp-scope-control` / `static-first-runtime` a **exceção estrita**: «o formulário público de intenção pode submeter para um endpoint serverless de notificação; isto **não** habilita o backend colaborativo (sem auth, sem DB, sem cliente Supabase no site)».
### 4.4 Deploy da função
- Integrar o workflow corrigido (`fix/form-deploy-vars-smoke`: lê `vars.*` + smoke test) e executá-lo.

## 5. Pré-requisitos externos (HUMAN)
1. **Token Supabase com permissões** — o token atual falha com `Missing required permission(s): edge_functions_secrets_write`. Regenerar um token com acesso completo (ou definir os secrets da função no **dashboard** do Supabase: Edge Functions → Secrets).
2. **Resend — verificar o domínio** `projectomilreu.pt` (registos DNS) para o e-mail chegar a `a78190@ualg.pt` e `fernando.jacomo@yahoo.com`. Sem isto, o remetente de teste `onboarding@resend.dev` só entrega ao e-mail da conta Resend.

## 6. Ordem de execução (após aprovação)
1. (HUMAN) decisão de governação + aprovação desta spec.
2. (HUMAN) regenerar token Supabase + verificar domínio no Resend.
3. (CÓDIGO) alteração 4.1–4.3 + testes → PR → merge.
4. (DEPLOY) merge do workflow corrigido → correr deploy da função + smoke test.
5. (BUILD) definir `MILREU_EXPOR_ENDPOINT` no build do site + republicar (continua demo/estático para tudo o resto).
6. (QA) desktop/mobile, sucesso/erro, validação, acentos PT, **e-mail recebido**, sem exposição de segredos.
7. (SEPARADO) só depois decidir `noindex`/indexação pública.

## 7. O que NÃO muda
- `noindex` mantém-se.
- Nenhuma outra funcionalidade Supabase (auth, área colaborativa, DB) é ativada no site público.
- Direitos por asset, regras de conteúdo e governação inalterados.

## 8. Riscos / notas
- Se a decisão de governação **não** for dada, nada avança (fica em demo).
- O endpoint público recebe tráfego anónimo: mitigado por honeypot + validação + allowlist de origem; pode acrescentar-se rate limit simples na função se necessário (fora do âmbito mínimo).
- O envio real depende do Resend com domínio verificado.

## 9. Decisão pedida ao responsável
- [ ] Aprovar a **exceção de governação** (endpoint serverless só para o formulário de intenção, sem backend colaborativo).
- [ ] Aprovar esta **spec** (desenho por `fetch` direto, sem credenciais no site).
- [ ] Confirmar que trata dos **2 pré-requisitos externos** (token Supabase + domínio Resend).
