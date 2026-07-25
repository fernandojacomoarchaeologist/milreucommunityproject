---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Supabase — Pacote 08D

## Migrations

1. `20260724100000_collaborative_agenda_exhibitions.sql`
2. `20260724100100_collaborative_agenda_exhibitions_rpc.sql`
3. `20260724100200_collaborative_agenda_exhibitions_seed.sql`

## Teste

```text
supabase/tests/008d_agenda_exhibitions.test.sql
```

## Dependência

A migration utiliza `btree_gist` para impedir sobreposição da mesma exposição.

## Execução

```bash
supabase start
supabase db reset
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres   -v ON_ERROR_STOP=1   -f supabase/tests/008d_agenda_exhibitions.test.sql
```

Executar primeiro num ambiente local e depois em staging.
