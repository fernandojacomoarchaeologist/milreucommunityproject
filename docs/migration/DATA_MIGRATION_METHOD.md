---
title: "Método de migração dos registos"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Método de migração

## Princípios

1. Preservar o texto legado sem o melhorar silenciosamente.
2. Não transformar texto de direitos em autorização.
3. Não inferir identificações, datas ou localizações definitivas.
4. Manter traduções incompletas como incompletas.
5. Registar toda transformação no trilho de auditoria.
6. Permitir reconstruir o registo original.

## Correspondência

- `title` → `title.pt-PT`;
- `titleEn` → `title.en`, com estado `draft`;
- `descriptionShort` → `narratives.shortDescription.pt-PT`;
- `descriptionLong` → `narratives.objectiveDescription.pt-PT`, marcado para revisão de camadas;
- `memoryText` → `narratives.communityNarrative.pt-PT`, com origem por validar;
- `historicalContext` → `narratives.historicalContext.pt-PT`;
- `relatedIds` → relações preliminares;
- todos os campos originais → `extensions.legacy`.

A migração foi executada por `scripts/migrate-legacy-records.mjs`.
