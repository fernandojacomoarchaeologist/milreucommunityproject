---
title: "Skill — map-legacy-memory-record"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Skill — Mapear registo legado

## Quando usar

No Pacote 04 ou numa tarefa explícita de migração do `museum-items.js`.

## Procedimento

1. Ler o registo legado sem o alterar.
2. Aplicar `LEGACY_FIELD_CROSSWALK.md`.
3. Preservar texto original e condição preliminar.
4. Não transformar `rights` textual em autorização confirmada.
5. Não inferir traduções ausentes.
6. Criar relatório de campos sem correspondência.
7. Validar o novo registo.
8. Manter ligação ao identificador e ficheiro original.

## Restrição

Esta skill não deve ser executada automaticamente durante a integração do Pacote 03.
