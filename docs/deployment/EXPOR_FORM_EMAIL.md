# Formulário «Quero expor» — ativação do e-mail

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

O formulário público **«Quero expor»** (`#/participar/expor`, com chamada na home) envia a proposta por e-mail à equipa através da Edge Function `supabase/functions/exhibition-proposal-intake`. **Não grava em base de dados** (apenas notificação) e **não envia nada até os secrets abaixo estarem configurados** (e-mail desativado por omissão — regra `08h-email-disabled-by-default`).

Enquanto não estiver configurado:
- em ambiente local/demo, o formulário mostra o estado de sucesso com a nota «ambiente de demonstração — não foi enviado e-mail»;
- em produção sem secrets, a função responde `edge_function_not_configured` (falha fechada, sem revelar configuração).

## Secrets da Edge Function (definir no Supabase, nunca no Git/frontend/logs)

| Secret | Descrição | Valor esperado |
|---|---|---|
| `EXPOR_NOTIFY_RECIPIENTS` | Destinatários internos, separados por vírgula | `a78190@ualg.pt,fernando.jacomo@yahoo.com` |
| `EXPOR_EMAIL_FROM` | Remetente verificado no fornecedor | ex.: `Projecto Milreu <no-reply@projectomilreu.pt>` |
| `EXPOR_RESEND_API_KEY` | Chave de API do fornecedor de e-mail (Resend) | chave privada do fornecedor |
| `ALLOWED_ORIGINS` | Origens permitidas (CORS) | `https://projectomilreu.pt` |

A função usa a API do **Resend** (`https://api.resend.com/emails`) por simplicidade; qualquer outro fornecedor pode substituir o bloco de envio, mantendo os mesmos secrets. O e-mail do proponente é usado como **reply-to** (resposta direta). Os destinatários e a chave **nunca** aparecem em logs (apenas o estado de erro).

## Deploy
1. Definir os secrets acima no projeto Supabase (produção).
2. Publicar a função: `supabase functions deploy exhibition-proposal-intake`.
3. Confirmar que `MILREU_SUPABASE_URL` / `MILREU_SUPABASE_PUBLISHABLE_KEY` do site apontam para esse projeto (o frontend invoca a função quando o modo é `supabase`).
4. Testar uma submissão real (o formulário invoca a função; verificar a receção nos dois endereços).

## Campos recolhidos
Nome, e-mail, telefone (opc.), organização/coletivo (opc.), tipo de espaço, nome do espaço/local, localidade, datas pretendidas (opc.), descrição da proposta, condições/necessidades (opc.), consentimento de privacidade. Honeypot anti-spam incluído.
