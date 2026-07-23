---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Referências técnicas verificadas — 08A

- Supabase Login with Google: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase `signInWithOAuth`: https://supabase.com/docs/reference/javascript/auth-signinwithoauth
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase RBAC e custom claims: https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac
- Supabase segurança de produtos: https://supabase.com/docs/guides/security/product-security
- GitHub Pages com workflows personalizados: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Supabase JavaScript v2.110.8: https://github.com/supabase/supabase-js/releases/tag/v2.110.8

## Decisão técnica

O cliente JavaScript está pinado na versão `2.110.8` no adaptador runtime. Uma atualização deverá passar por revisão, testes de login, callback e regressão.
