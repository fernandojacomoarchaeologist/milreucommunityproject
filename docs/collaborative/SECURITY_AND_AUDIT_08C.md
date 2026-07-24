---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08C"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Segurança e auditoria — 08C

- tarefas em rascunho são visíveis apenas a gestores;
- membros veem tarefas abertas, em curso, concluídas ou atribuídas a si;
- atribuições são visíveis ao próprio membro e à coordenação;
- disponibilidade é visível ao próprio membro e a gestores de tarefas;
- registos de tempo são visíveis ao membro e a validadores;
- escritas diretas foram revogadas;
- alterações passam por RPCs `security definer` com validação de permissão;
- eventos relevantes entram em `collab_audit_log` e `collab_task_updates`.
