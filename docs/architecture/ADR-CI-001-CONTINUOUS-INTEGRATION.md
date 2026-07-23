---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# ADR-CI-001 — Integração contínua

## Estado

Aprovada.

## Decisão

Adicionar CI mínimo para:

- validar Markdown e copyright;
- validar JSON e schemas;
- testar guards;
- validar migrations;
- executar testes SQL localmente;
- verificar ausência de segredos e binários proibidos;
- preparar build do GitHub Pages.

## Produção

Deployment de migrations só pode ocorrer num workflow manual que:

- utilize o ambiente GitHub `production`;
- tenha required reviewer;
- exija ticket;
- exija confirmação literal;
- execute preflight;
- aplique apenas migrations versionadas.
