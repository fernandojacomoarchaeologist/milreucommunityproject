---
title: "Pacote 04 — Auditoria e Migração da Versão Preliminar"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 04 — Auditoria e Migração da Versão Preliminar

Este pacote cria um retrato verificável da versão preliminar do Museu de Memórias e converte, de forma conservadora e reversível, os **31 registos `MM202601`–`MM202631`** para o modelo definido no Pacote 03.

## Entregas principais

- inventário técnico do protótipo;
- snapshot integral de `data/museum-items.js`;
- 31 registos JSON preliminares;
- preservação dos campos legados em `extensions.legacy`;
- auditorias de dados, relações, idiomas, direitos, ativos e funcionalidades;
- fila de revisão manual;
- scripts reproduzíveis de inventário, migração e validação;
- regras, skills e specs para controlar a integração;
- prompt, checklist, manifesto e release.

## Estado seguro

- nenhum registo foi marcado como aprovado ou publicado;
- os 31 ativos de media permanecem com `publicationAllowed: false`;
- os direitos permanecem `pending-review`;
- `MM202617`, uma imagem derivada por IA e explicitamente restrita no legado, foi marcada como `blocked`;
- nenhuma tradução foi produzida automaticamente;
- o site preliminar não foi modificado.

## Dependências

- Pacote 01 — Fundação, Governação e Escopo;
- Pacote 02 — Sistema de Design e Guia Vivo;
- Pacote 03 — Modelo de Dados do Museu.

## Validação

```bash
node scripts/validate-package-04.mjs
node tests/migration.test.mjs
```

Após integrar com o Pacote 03, validar também os registos contra `data/schemas/museum-memory.schema.json`.
