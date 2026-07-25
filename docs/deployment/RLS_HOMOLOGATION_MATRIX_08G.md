---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Matriz de RLS e perfis

Testar no mínimo:

- master;
- coordinator;
- volunteer;
- reviewer;
- researcher;
- translator;
- partner;
- observer;
- autenticado sem membership;
- anónimo.

Para cada perfil:

- rotas visíveis;
- tabelas legíveis;
- RPCs permitidas;
- RPCs proibidas;
- dados próprios;
- dados de terceiros;
- storage;
- gestão;
- auditoria.

Usar utilizadores de teste separados. Não reutilizar a sessão do master.
