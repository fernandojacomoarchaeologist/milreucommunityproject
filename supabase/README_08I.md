---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08I"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Supabase — Pacote 08I

## Migrations

```text
20260724150000_collaborative_operations_foundation.sql
20260724150100_collaborative_operations_rpc.sql
20260724150200_collaborative_operations_seed.sql
```

## Teste

```text
supabase/tests/008i_operations_governance.test.sql
```

## Edge Function

```text
export-collab-audit
```

A exportação usa a sessão do utilizador e a chave publicável. Não utiliza service role.

## Aplicação da retenção

A função `collab_apply_retention_run_08i` é exclusiva do service role e deve ser chamada apenas por workflow protegido.

Não executar `db reset --linked` em produção.
