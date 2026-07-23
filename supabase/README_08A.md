# Supabase — Área Colaborativa 08A

## Conteúdo

- identidade e perfis;
- pedidos de acesso;
- vínculos ao projeto;
- funções e permissões;
- RLS;
- auditoria;
- bootstrap do master;
- esqueletos de tarefas e exposições.

## Ordem das migrations

1. `20260723080000_collaborative_foundation.sql`
2. `20260723080100_collaborative_seed.sql`
3. `20260723080200_collaborative_rls_and_rpc.sql`
4. `20260723080300_collaborative_context_and_admin.sql`
5. `20260723080400_collaborative_tasks_exhibitions.sql`

## Segurança

A chave `service_role` nunca entra no frontend. O navegador usa apenas a chave publicável e depende de RLS.

## Master

1. O utilizador faz login com Google uma vez.
2. O registo é criado em `auth.users`.
3. Num ambiente administrativo local, executar:

```bash
MILREU_SUPABASE_URL="..." \
SUPABASE_SERVICE_ROLE_KEY="..." \
MILREU_MASTER_EMAIL="email-real" \
npm run collab:bootstrap-master
```

O e-mail não é guardado no repositório.

---

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.
