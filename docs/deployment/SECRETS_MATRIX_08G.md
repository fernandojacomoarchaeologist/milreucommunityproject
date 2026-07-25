---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Matriz de secrets

## Frontend público

Pode conter:

- URL Supabase;
- chave publicável;
- URL do site;
- domínios permitidos;
- site key do Turnstile.

Não pode conter:

- service role;
- secret Google;
- password do banco;
- access token Supabase;
- e-mail master;
- salt de rate limit.

## GitHub Environment

Staging:

- `SUPABASE_ACCESS_TOKEN`;
- `STAGING_DB_PASSWORD`;
- `STAGING_PROJECT_ID`;
- URL e chave publicável;
- e-mail master;
- URL do site.

Produção deverá usar ambiente e aprovação separados.
