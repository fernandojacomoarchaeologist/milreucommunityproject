---
title: "Manifesto — Pacote 04"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Manifesto do Pacote 04

## Identificação

- pacote: `pacote-04-auditoria-migracao-versao-preliminar-v0.1.0`;
- versão: `0.1.0`;
- data: `2026-07-20`;
- dependências: Pacotes 01, 02 e 03;
- fonte analisada: versão preliminar `museu-memorias-milreu-GITHUB`;
- registos migrados: 31;
- cutover: não incluído.

## Regras de integração

1. Comparar o fingerprint antes de integrar.
2. Não alterar o protótipo.
3. Não promover estados editoriais ou jurídicos.
4. Manter a migração reversível.
5. Executar validadores e testes.
6. Não avançar para a UI nova neste pacote.

## Ficheiros

| Caminho | Ação esperada |
|---|---|
| `.claude/rules/legacy-assets.md` | Criar ou fundir após comparação |
| `.claude/rules/legacy-migration-integrity.md` | Criar ou fundir após comparação |
| `.claude/rules/no-auto-publication-migration.md` | Criar ou fundir após comparação |
| `.claude/rules/reversible-migration.md` | Criar ou fundir após comparação |
| `.claude/skills/audit-legacy-site/SKILL.md` | Criar ou fundir após comparação |
| `.claude/skills/migrate-legacy-record/SKILL.md` | Criar ou fundir após comparação |
| `.claude/skills/reconcile-legacy-assets/SKILL.md` | Criar ou fundir após comparação |
| `.claude/skills/review-migrated-record/SKILL.md` | Criar ou fundir após comparação |
| `INTEGRATION_CHECKLIST.md` | Criar ou fundir documentação |
| `PROMPT_CLAUDE.md` | Criar ou fundir documentação |
| `README.md` | Criar ou fundir documentação |
| `data/migration/manifests/legacy-site-inventory.json` | Criar relatório, snapshot ou manifesto técnico |
| `data/migration/manifests/migration-index.json` | Criar relatório, snapshot ou manifesto técnico |
| `data/migration/records/MM202601.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202602.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202603.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202604.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202605.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202606.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202607.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202608.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202609.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202610.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202611.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202612.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202613.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202614.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202615.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202616.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202617.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202618.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202619.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202620.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202621.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202622.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202623.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202624.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202625.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202626.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202627.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202628.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202629.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202630.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/records/MM202631.preliminary.json` | Criar registo preliminar; não publicar |
| `data/migration/reports/asset-audit.json` | Criar relatório, snapshot ou manifesto técnico |
| `data/migration/reports/data-quality-report.json` | Criar relatório, snapshot ou manifesto técnico |
| `data/migration/reports/functional-inventory.json` | Criar relatório, snapshot ou manifesto técnico |
| `data/migration/reports/localisation-audit.json` | Criar relatório, snapshot ou manifesto técnico |
| `data/migration/reports/migration-summary.json` | Criar relatório, snapshot ou manifesto técnico |
| `data/migration/reports/relations-audit.json` | Criar relatório, snapshot ou manifesto técnico |
| `data/migration/reports/rights-publication-audit.json` | Criar relatório, snapshot ou manifesto técnico |
| `data/migration/reports/source-zip-container-audit.json` | Criar relatório, snapshot ou manifesto técnico |
| `data/migration/snapshots/museum-items.legacy.snapshot.json` | Criar relatório, snapshot ou manifesto técnico |
| `docs/migration/ASSET_AUDIT.md` | Criar ou fundir documentação |
| `docs/migration/CONTENT_CLASSIFICATION.md` | Criar ou fundir documentação |
| `docs/migration/CUTOVER_PLAN.md` | Criar ou fundir documentação |
| `docs/migration/DATA_MIGRATION_METHOD.md` | Criar ou fundir documentação |
| `docs/migration/DATA_QUALITY_REPORT.md` | Criar ou fundir documentação |
| `docs/migration/DRIVE_INTEGRATION_ASSESSMENT.md` | Criar ou fundir documentação |
| `docs/migration/EXHIBITIONS_DATA_ASSESSMENT.md` | Criar ou fundir documentação |
| `docs/migration/FEATURE_DEPENDENCY_MAP.md` | Criar ou fundir documentação |
| `docs/migration/LEGACY_FILE_INVENTORY.md` | Criar ou fundir documentação |
| `docs/migration/LEGACY_FUNCTIONAL_INVENTORY.md` | Criar ou fundir documentação |
| `docs/migration/LEGACY_SNAPSHOT.md` | Criar ou fundir documentação |
| `docs/migration/LOCALISATION_AUDIT.md` | Criar ou fundir documentação |
| `docs/migration/MANUAL_REVIEW_QUEUE.md` | Criar ou fundir documentação |
| `docs/migration/MIGRATION_DECISIONS.md` | Criar ou fundir documentação |
| `docs/migration/PENDING_DECISIONS.md` | Criar ou fundir documentação |
| `docs/migration/RELATIONSHIP_AUDIT.md` | Criar ou fundir documentação |
| `docs/migration/RIGHTS_AND_PUBLICATION_AUDIT.md` | Criar ou fundir documentação |
| `docs/migration/ROLLBACK_AND_REVERSIBILITY.md` | Criar ou fundir documentação |
| `docs/migration/SCOPE_AND_OBJECTIVE.md` | Criar ou fundir documentação |
| `docs/migration/SOURCE_ARCHIVE_POLICY.md` | Criar ou fundir documentação |
| `docs/specifications/SPEC-MIG-001-LEGACY-SNAPSHOT.md` | Criar ou fundir documentação |
| `docs/specifications/SPEC-MIG-002-RECORD-CONVERSION.md` | Criar ou fundir documentação |
| `docs/specifications/SPEC-MIG-003-ASSET-RECONCILIATION.md` | Criar ou fundir documentação |
| `docs/specifications/SPEC-MIG-004-CUTOVER-ROLLBACK.md` | Criar ou fundir documentação |
| `integration/CLAUDE_APPEND.md` | Aplicar manualmente após comparação |
| `integration/MIGRATION_REGISTRY_APPEND.md` | Aplicar manualmente após comparação |
| `releases/PACKAGE_04_v0.1.0.md` | Registar release |
| `scripts/inventory-legacy-site.mjs` | Criar e executar |
| `scripts/migrate-legacy-records.mjs` | Criar e executar |
| `scripts/validate-package-04.mjs` | Criar e executar |
| `tests/migration.test.mjs` | Criar e executar |

## Resultado esperado

O repositório passa a possuir uma auditoria reproduzível e uma conversão preliminar dos 31 registos, pronta para revisão humana e para consumo futuro, sem modificar a versão pública existente.
