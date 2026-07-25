---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Homologação de staging

## Pré-requisitos

- projeto Supabase separado;
- Google OAuth configurado;
- master autenticado;
- ambiente GitHub `staging`;
- secrets configurados;
- domínio ou URL HTTPS;
- migrations no Git.

## Ordem

1. preflight;
2. OAuth check;
3. `supabase link`;
4. `supabase db push --dry-run`;
5. aprovação manual;
6. `supabase db push`;
7. functions;
8. teste SQL;
9. build;
10. remote smoke;
11. testes por perfil;
12. 24 checks;
13. homologação.

Não usar `db reset --linked` num ambiente com dados que devam ser preservados.
