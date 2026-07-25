---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Runbook operacional

## Todos os dias de operação

- verificar canal;
- verificar pending;
- verificar failed;
- verificar dead-letter;
- rever pedidos de retirada;
- validar worker.

## Falha

1. pausar canal;
2. preservar outbox;
3. verificar webhook;
4. verificar domínio/remetente;
5. corrigir secret;
6. testar em staging;
7. repetir apenas itens elegíveis;
8. documentar incidente.

## Dead-letter

Não repetir em massa sem compreender a falha.
