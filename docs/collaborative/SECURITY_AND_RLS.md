---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Segurança e RLS

Todas as tabelas expostas possuem Row Level Security.

## Regras principais

- cada membro consulta e atualiza o próprio perfil;
- pedidos pendentes podem ser consultados pelo próprio utilizador;
- coordenação consulta e aprova membros conforme permissão;
- tarefas são visíveis conforme `tasks.view`;
- agenda e exposições são visíveis conforme `agenda.view`;
- alterações de exposições exigem `exhibitions.manage`;
- auditoria exige `audit.view`.

## Dados de autorização

Permissões não são guardadas em `raw_user_meta_data`, pois esse conteúdo pode ser alterado pelo utilizador. A fonte de verdade está nas tabelas de funções e permissões.

## Referências oficiais

- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac
- https://supabase.com/docs/guides/security/product-security
