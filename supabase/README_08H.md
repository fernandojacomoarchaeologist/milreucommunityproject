---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Supabase — Pacote 08H

## Migrations

```text
20260724140000_collaborative_notifications_foundation.sql
20260724140100_collaborative_notifications_rpc.sql
20260724140200_collaborative_notifications_seed.sql
```

## Teste

```text
supabase/tests/008h_notifications.test.sql
```

## Edge Function

```text
dispatch-collab-notifications
```

O worker utiliza `verify_jwt=false` porque exige um segredo customizado no header `x-milreu-worker-secret`. O service role permanece apenas no ambiente da função.

## Estado inicial

- centro interno: ativo;
- e-mail: desativado;
- provider: desativado;
- agendamento: desativado.

## Local

```bash
supabase start
supabase db reset
```

## Staging

```bash
supabase functions deploy dispatch-collab-notifications   --project-ref <staging>   --no-verify-jwt
```

Não ativar o canal de e-mail até o webhook e o remetente estarem homologados.
