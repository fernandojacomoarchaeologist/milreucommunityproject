---
title: "Manifesto — Pacote 03"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Manifesto do Pacote 03

## Identificação

- pacote: `pacote-03-modelo-dados-museu-v0.1.0`;
- versão: `0.1.0`;
- data: `2026-07-20`;
- dependências: Pacote 01 e Pacote 02;
- próximo pacote previsto: auditoria e migração da versão preliminar.

## Regras de integração

1. Comparar antes de substituir.
2. Não migrar registos durante esta integração.
3. Não alterar estados para aprovado ou publicado.
4. Não executar alterações visuais.
5. Não criar infraestrutura de persistência.
6. Executar os validadores após integrar.

## Ficheiros

| Caminho | Ação esperada |
|---|---|
| `.claude/rules/museum-data-integrity.md` | Criar ou fundir regra contextual |
| `.claude/rules/museum-localisation.md` | Criar ou fundir regra contextual |
| `.claude/rules/museum-revisions.md` | Criar ou fundir regra contextual |
| `.claude/rules/museum-rights-consent.md` | Criar ou fundir regra contextual |
| `.claude/skills/catalog-memory/SKILL.md` | Criar ou fundir skill |
| `.claude/skills/manage-memory-revision/SKILL.md` | Criar ou fundir skill |
| `.claude/skills/map-legacy-memory-record/SKILL.md` | Criar ou fundir skill |
| `.claude/skills/record-rights-consent/SKILL.md` | Criar ou fundir skill |
| `.claude/skills/translate-memory-record/SKILL.md` | Criar ou fundir skill |
| `.claude/skills/validate-memory-record/SKILL.md` | Criar ou fundir skill |
| `INTEGRATION_CHECKLIST.md` | Criar na raiz do pacote |
| `PROMPT_CLAUDE.md` | Criar na raiz do pacote |
| `README.md` | Criar na raiz do pacote |
| `data/examples/MM202601.preliminary.example.json` | Criar exemplo preliminar; não publicar |
| `data/examples/README.md` | Criar exemplo preliminar; não publicar |
| `data/schemas/collection-manifest.schema.json` | Criar schema ou comparar versão existente |
| `data/schemas/common.schema.json` | Criar schema ou comparar versão existente |
| `data/schemas/community-contribution.schema.json` | Criar schema ou comparar versão existente |
| `data/schemas/museum-memory.schema.json` | Criar schema ou comparar versão existente |
| `data/schemas/rights-concern.schema.json` | Criar schema ou comparar versão existente |
| `data/schemas/schema-registry.json` | Criar schema ou comparar versão existente |
| `data/templates/collection-manifest.template.json` | Criar template; não publicar |
| `data/templates/community-contribution.template.json` | Criar template; não publicar |
| `data/templates/museum-memory.template.json` | Criar template; não publicar |
| `data/templates/rights-concern.template.json` | Criar template; não publicar |
| `data/vocabularies/certainty-levels.json` | Criar vocabulário inicial |
| `data/vocabularies/languages.json` | Criar vocabulário inicial |
| `data/vocabularies/provenance-event-types.json` | Criar vocabulário inicial |
| `data/vocabularies/publication-statuses.json` | Criar vocabulário inicial |
| `data/vocabularies/record-statuses.json` | Criar vocabulário inicial |
| `data/vocabularies/relation-types.json` | Criar vocabulário inicial |
| `data/vocabularies/rights-consent-statuses.json` | Criar vocabulário inicial |
| `docs/data-model/DATA_DICTIONARY.md` | Criar ou fundir documentação |
| `docs/data-model/DATES_PLACES_AND_CERTAINTY.md` | Criar ou fundir documentação |
| `docs/data-model/DOMAIN_MODEL.md` | Criar ou fundir documentação |
| `docs/data-model/IDENTIFIERS_AND_REFERENCES.md` | Criar ou fundir documentação |
| `docs/data-model/LEGACY_FIELD_CROSSWALK.md` | Criar ou fundir documentação |
| `docs/data-model/LOCALISATION_MODEL.md` | Criar ou fundir documentação |
| `docs/data-model/MEDIA_AND_DIGITAL_INTERVENTIONS.md` | Criar ou fundir documentação |
| `docs/data-model/MIGRATION_BOUNDARIES.md` | Criar ou fundir documentação |
| `docs/data-model/NARRATIVE_LAYERS.md` | Criar ou fundir documentação |
| `docs/data-model/PENDING_DECISIONS.md` | Criar ou fundir documentação |
| `docs/data-model/PEOPLE_AND_COMMUNITY_VOICES.md` | Criar ou fundir documentação |
| `docs/data-model/PROVENANCE_AND_SOURCES.md` | Criar ou fundir documentação |
| `docs/data-model/PUBLICATION_GATES.md` | Criar ou fundir documentação |
| `docs/data-model/README.md` | Criar ou fundir documentação |
| `docs/data-model/RECORD_LIFECYCLE.md` | Criar ou fundir documentação |
| `docs/data-model/RELATIONSHIPS.md` | Criar ou fundir documentação |
| `docs/data-model/REVISION_AND_AUDIT_TRAIL.md` | Criar ou fundir documentação |
| `docs/data-model/RIGHTS_CONSENT_AND_CONCERNS.md` | Criar ou fundir documentação |
| `docs/data-model/SCHEMA_REGISTRY.md` | Criar ou fundir documentação |
| `docs/specifications/SPEC-DATA-001-MUSEUM-MEMORY-RECORD.md` | Criar ou fundir documentação |
| `docs/specifications/SPEC-DATA-002-RIGHTS-CONSENT-PUBLICATION.md` | Criar ou fundir documentação |
| `docs/specifications/SPEC-DATA-003-MULTILINGUAL-CONTENT.md` | Criar ou fundir documentação |
| `docs/specifications/SPEC-DATA-004-REVISION-AND-AUDIT.md` | Criar ou fundir documentação |
| `integration/CLAUDE_APPEND.md` | Aplicar apenas após comparação |
| `integration/SOURCE_HIERARCHY_APPEND.md` | Aplicar apenas após comparação |
| `releases/PACKAGE_03_v0.1.0.md` | Registar release |
| `scripts/validate-data-model.mjs` | Criar e executar validação |
| `tests/README.md` | Criar e executar validação |
| `tests/data-model.test.mjs` | Criar e executar validação |

## Resultado esperado

O repositório passa a possuir um modelo de dados documentado e verificável, preparado para a migração controlada dos registos no pacote seguinte.
