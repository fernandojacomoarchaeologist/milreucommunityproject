---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Operações destrutivas

- `DROP`, `TRUNCATE`, exclusões massivas e alterações irreversíveis exigem bloqueio.
- Em produção, não executar por sessão.
- Exigir backup, migration, rollback, ticket e workflow aprovado.
