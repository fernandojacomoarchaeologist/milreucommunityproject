---
title: "Rollback e reversibilidade"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Reversibilidade

A migração não exige remoção ou substituição do legado.

## Garantias

- o snapshot conserva os 31 objetos originais;
- cada JSON conserva o objeto original em `extensions.legacy`;
- o fingerprint identifica a versão exata da fonte;
- os novos ficheiros ficam num caminho separado;
- o protótipo continua a ler `museum-items.js`;
- nenhuma rota pública aponta para os JSON migrados.

## Rollback

Para reverter a integração do Pacote 04, remover apenas:

- `data/migration/`;
- documentação, skills, rules, specs, scripts e release deste pacote.

Não é necessário restaurar o protótipo porque ele não é alterado.
