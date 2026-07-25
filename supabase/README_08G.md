---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Supabase — Pacote 08G

## Migrations

```text
20260724130000_collaborative_deployment_homologation.sql
20260724130100_collaborative_deployment_homologation_rpc.sql
20260724130200_collaborative_deployment_homologation_seed.sql
```

## Teste

```text
supabase/tests/008g_deployment_homologation.test.sql
```

## Local

```bash
supabase start
supabase db reset
```

## Staging

```bash
supabase link --project-ref <staging>
supabase db push --dry-run
supabase db push
```

Não usar `--include-seed` ou `db reset --linked` em produção.
