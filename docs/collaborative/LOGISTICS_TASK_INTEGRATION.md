---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Integração com tarefas

A coordenação pode gerar duas tarefas a partir de um período:

- montagem;
- desmontagem.

As tarefas são:

- criadas como `draft`;
- ligadas por `source_entity_type = exhibition_schedule`;
- idempotentes;
- configuradas com local e datas;
- publicadas posteriormente pelo gestor de tarefas.

A geração não atribui voluntários nem publica automaticamente a tarefa.
