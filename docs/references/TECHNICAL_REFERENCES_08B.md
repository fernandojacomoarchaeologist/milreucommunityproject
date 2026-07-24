---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08B"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Referências técnicas verificadas — 08B

- Supabase Users: https://supabase.com/docs/guides/auth/users
- Admin invite user by email: https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- RBAC: https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac
- Secure product configuration: https://supabase.com/docs/guides/security/product-security

## Decisão do projeto

O 08B não usa `inviteUserByEmail` no navegador. Em vez disso, cria uma pré-autorização no banco e mantém o login Google como mecanismo de identidade. Operações administrativas de Auth continuam fora do frontend.
