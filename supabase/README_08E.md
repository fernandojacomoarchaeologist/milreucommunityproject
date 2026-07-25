---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08E"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Supabase — Pacote 08E

## Migrations

1. `20260724110000_collaborative_contributions_foundation.sql`
2. `20260724110100_collaborative_contributions_rpc.sql`
3. `20260724110200_collaborative_contributions_seed.sql`

## Edge Function

```text
supabase/functions/community-contribution-intake
```

## Teste

```text
supabase/tests/008e_contributions.test.sql
```

## Deploy

```bash
supabase functions deploy community-contribution-intake --no-verify-jwt
```

## Secrets obrigatórios

```bash
supabase secrets set RATE_LIMIT_SALT="..."
supabase secrets set ALLOWED_ORIGINS="https://dominio.example"
```

`SUPABASE_SERVICE_ROLE_KEY` é disponibilizada pelo ambiente da função e não entra no frontend.
