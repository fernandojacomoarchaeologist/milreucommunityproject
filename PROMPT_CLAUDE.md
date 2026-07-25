---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 08H

Integra cumulativamente o 08H sobre o 08G.

## Contexto obrigatório

Ler:

- `PROJECT_CONTEXT_LEDGER.md`;
- `PACKAGE_DEPENDENCY_MAP.md`;
- `CHANGE_SURFACE_REGISTRY.md`;
- `CONTEXT_RECOVERY_PROTOCOL.md`;
- `docs/notifications/NOTIFICATION_ARCHITECTURE_08H.md`;
- `docs/notifications/NOTIFICATION_OPERATIONS_RUNBOOK_08H.md`;
- `docs/notifications/NOTIFICATION_PRIVACY_RETENTION_08H.md`.

## Objetivo

Ativar notificações internas e preparar e-mail transacional controlado.

## Integrar

1. migrations `20260724140000`–`140200`;
2. Edge Function `dispatch-collab-notifications`;
3. modelos, templates e runtime;
4. controller;
5. views, rotas, badge e estilos;
6. scripts;
7. workflows;
8. testes;
9. documentação e contexto.

## Regras

- centro interno ativo;
- e-mail desativado por padrão;
- sem fornecedor inventado;
- sem envio automático de convites;
- sem agenda automática do worker;
- service role apenas no servidor;
- worker secret obrigatório;
- e-mails e payloads não aparecem nos relatórios administrativos;
- templates aprovados são imutáveis;
- correções criam nova versão;
- HTML é gerado pelo worker a partir de texto escapado;
- tokens são limitados;
- eventos obrigatórios não podem ser desativados no centro interno;
- pedidos de retirada são prioritários;
- e-mail exige confirmação literal;
- dead-letter não é reenviado sem ação;
- staging antes de produção.

## Validação

```bash
npm ci
npm run notifications:config
npm run notifications:preview
npm run notifications:test-payload
npm run notifications:dispatch-status
npm run validate
npm test
npm run build
npm run smoke
```

Executar os testes SQL 08A–08H em Supabase local.

## Revisão manual

- badge;
- inbox;
- filtros;
- leitura;
- arquivo;
- preferências;
- aviso obrigatório;
- horário silencioso;
- templates;
- canal;
- teste interno;
- convite explícito;
- outbox;
- retry;
- cancelamento;
- dead-letter;
- 375, 768 e 1280 px.

Não ativar o e-mail durante a integração.
