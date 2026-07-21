---
title: "Plano de cutover futuro"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Plano de cutover futuro

Este pacote não executa cutover.

## Condições mínimas

1. 31 registos revistos contra o schema;
2. direitos e consentimentos avaliados;
3. ativos reconciliados;
4. traduções com estados claros;
5. UI capaz de consumir o novo modelo;
6. testes de regressão das funcionalidades essenciais;
7. URLs permanentes definidas;
8. rollback testado.

## Estratégia recomendada

- leitura dupla durante transição;
- comparação entre cartão legado e novo cartão;
- ativação por feature flag;
- validação por lote;
- desativação de `museum-items.js` apenas após release aprovado.
