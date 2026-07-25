---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08I"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Integridade da auditoria

Cada evento possui:

- hash anterior;
- hash do evento;
- categoria;
- prioridade;
- correlação;
- versão de redacção.

A cadeia é calculada por projeto e protegida por lock transacional. Updates e deletes são bloqueados.

A consulta não devolve snapshots completos. Ela apresenta apenas chaves alteradas e metadados redigidos.
