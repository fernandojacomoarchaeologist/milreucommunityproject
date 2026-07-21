---
title: "Testes do modelo de dados"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Testes

## Modelo de dados (Pacote 03)

```bash
node scripts/validate-data-model.mjs
node tests/data-model.test.mjs
```

Os testes cobrem estrutura mínima, idiomas, certeza proibida, direitos e localização sensível. Não substituem validação humana, jurídica, histórica ou curatorial.

## Migração (Pacote 04)

```bash
node scripts/validate-package-04.mjs
node tests/migration.test.mjs
```

Os testes confirmam contagem, IDs, estados preliminares, ausência de publicação automática, preservação do legado, duplicação de `MM202612` e incompatibilidade de extensão do hero.
