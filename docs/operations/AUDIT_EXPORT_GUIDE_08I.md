---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08I"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Exportação de auditoria

A exportação:

- exige `audit.export`;
- utiliza o JWT do utilizador;
- não utiliza service role;
- limita 5000 linhas;
- não contém e-mail;
- não contém snapshots completos;
- usa `Cache-Control: no-store`;
- gera CSV.

Exportações devem ser guardadas num local privado.
