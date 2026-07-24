---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08B"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Gestão de membros e perfis

## Fluxo de pedido

```text
Google login → pending → revisão → active ou rejected
```

## Estados

- pending;
- active;
- suspended;
- archived;
- rejected.

A suspensão é reversível. O arquivo preserva histórico e não elimina a identidade.

## Decisões do gestor

Uma alteração deve indicar perfil, funções, estado e, quando necessário, nota interna. A operação é transacional e registada em auditoria.
