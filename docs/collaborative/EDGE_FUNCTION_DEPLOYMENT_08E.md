---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08E"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Deploy da Edge Function

## Deploy

```bash
supabase functions deploy community-contribution-intake --no-verify-jwt
```

## Secrets

```bash
supabase secrets set   RATE_LIMIT_SALT="valor-aleatorio-longo"   ALLOWED_ORIGINS="https://dominio.example"
```

O ambiente Supabase fornece:

- `SUPABASE_URL`;
- `SUPABASE_ANON_KEY`;
- `SUPABASE_SERVICE_ROLE_KEY`.

A service role permanece apenas dentro da Edge Function.

## Turnstile

Opcional:

```bash
supabase secrets set TURNSTILE_SECRET_KEY="..."
```

O site key deve ser incluído na configuração pública somente quando o widget for integrado e testado.
