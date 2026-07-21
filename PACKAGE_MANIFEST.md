---
title: "Manifesto — Pacote 05A"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório e SOURCE_RIGHTS_NOTICE.md neste pacote"
---
# Manifesto — Pacote 05A

## Identificação

- Pacote: `05A`
- Versão: `0.1.0`
- Ficheiros antes deste manifesto: 78
- Fonte PDF: 36 páginas
- SHA-256 da fonte: `61324968a0f9e534405133877b8f6cee0fad85b7d1874e0a174b6627578621ca`

## Dependências

- Pacote 01;
- Pacote 02;
- Node.js para validação;
- servidor HTTP local para o quadro visual.

## Estrutura

### Documentação

- `docs/design-source/`: auditoria contextual e visual;
- `docs/specifications/`: spec do quadro interno;
- `integration/`: adendas para fusão manual.

### Dados

- `data/design-source/source-manifest.json`;
- `page-elements.json`;
- `chapter-map.json`;
- `colour-observations.json`;
- `component-candidates.json`;
- `source-to-token-map.json`.

### Ferramenta interna

- `apps/visual-source-board/`;
- 36 miniaturas WebP.

### Fonte

- `sources/primary/private/HAUSCHILD_TEICHNER_Milreu_ruinas.pdf`.

### Automação

- rules e skills Claude;
- validador e testes;
- prompt de integração;
- release.

## Lista de ficheiros

- `.claude/rules/primary-source-and-visual-audit.md`
- `.claude/skills/analyse-visual-source/SKILL.md`
- `.claude/skills/cite-book-page/SKILL.md`
- `INTEGRATION_CHECKLIST.md`
- `PROMPT_CLAUDE.md`
- `README.md`
- `SOURCE_RIGHTS_NOTICE.md`
- `apps/visual-source-board/README.md`
- `apps/visual-source-board/assets/pages/page-01.webp`
- `apps/visual-source-board/assets/pages/page-02.webp`
- `apps/visual-source-board/assets/pages/page-03.webp`
- `apps/visual-source-board/assets/pages/page-04.webp`
- `apps/visual-source-board/assets/pages/page-05.webp`
- `apps/visual-source-board/assets/pages/page-06.webp`
- `apps/visual-source-board/assets/pages/page-07.webp`
- `apps/visual-source-board/assets/pages/page-08.webp`
- `apps/visual-source-board/assets/pages/page-09.webp`
- `apps/visual-source-board/assets/pages/page-10.webp`
- `apps/visual-source-board/assets/pages/page-11.webp`
- `apps/visual-source-board/assets/pages/page-12.webp`
- `apps/visual-source-board/assets/pages/page-13.webp`
- `apps/visual-source-board/assets/pages/page-14.webp`
- `apps/visual-source-board/assets/pages/page-15.webp`
- `apps/visual-source-board/assets/pages/page-16.webp`
- `apps/visual-source-board/assets/pages/page-17.webp`
- `apps/visual-source-board/assets/pages/page-18.webp`
- `apps/visual-source-board/assets/pages/page-19.webp`
- `apps/visual-source-board/assets/pages/page-20.webp`
- `apps/visual-source-board/assets/pages/page-21.webp`
- `apps/visual-source-board/assets/pages/page-22.webp`
- `apps/visual-source-board/assets/pages/page-23.webp`
- `apps/visual-source-board/assets/pages/page-24.webp`
- `apps/visual-source-board/assets/pages/page-25.webp`
- `apps/visual-source-board/assets/pages/page-26.webp`
- `apps/visual-source-board/assets/pages/page-27.webp`
- `apps/visual-source-board/assets/pages/page-28.webp`
- `apps/visual-source-board/assets/pages/page-29.webp`
- `apps/visual-source-board/assets/pages/page-30.webp`
- `apps/visual-source-board/assets/pages/page-31.webp`
- `apps/visual-source-board/assets/pages/page-32.webp`
- `apps/visual-source-board/assets/pages/page-33.webp`
- `apps/visual-source-board/assets/pages/page-34.webp`
- `apps/visual-source-board/assets/pages/page-35.webp`
- `apps/visual-source-board/assets/pages/page-36.webp`
- `apps/visual-source-board/index.html`
- `apps/visual-source-board/source-board.css`
- `apps/visual-source-board/source-board.js`
- `data/design-source/chapter-map.json`
- `data/design-source/colour-observations.json`
- `data/design-source/component-candidates.json`
- `data/design-source/page-elements.json`
- `data/design-source/source-manifest.json`
- `data/design-source/source-to-token-map.json`
- `docs/design-source/ACCESSIBILITY_PROBLEMS.md`
- `docs/design-source/ARCHAEOLOGICAL_OBJECTS.md`
- `docs/design-source/BOOK_CONTENT_STRUCTURE.md`
- `docs/design-source/BOOK_VISUAL_AUDIT.md`
- `docs/design-source/COLOUR_SOURCE_ANALYSIS.md`
- `docs/design-source/DIGITAL_ADAPTATION_RULES.md`
- `docs/design-source/EDITORIAL_COMPONENT_CANDIDATES.md`
- `docs/design-source/IMAGE_USE_AND_ATTRIBUTION.md`
- `docs/design-source/LAYOUT_GRAMMAR.md`
- `docs/design-source/MAPS_PLANS_AND_DIAGRAMS.md`
- `docs/design-source/OPEN_DESIGN_DECISIONS.md`
- `docs/design-source/PAGE_BY_PAGE_MAP.md`
- `docs/design-source/PHOTOGRAPHY_AND_IMAGE_LANGUAGE.md`
- `docs/design-source/PRIMARY_CONTEXTUAL_SOURCE.md`
- `docs/design-source/SOURCE_USAGE_FOR_SITE_CONTENT.md`
- `docs/design-source/TYPOGRAPHY_SOURCE_ANALYSIS.md`
- `docs/design-source/VISUAL_LANGUAGE.md`
- `docs/specifications/SPEC-DS-004-VISUAL-SOURCE-BOARD.md`
- `integration/DESIGN_DECISIONS_APPEND.md`
- `integration/HAUSCHILD_REFERENCE_UPGRADE.md`
- `integration/SOURCE_HIERARCHY_APPEND.md`
- `releases/PACKAGE_05A_v0.1.0.md`
- `scripts/validate-package-05a.mjs`
- `sources/primary/private/HAUSCHILD_TEICHNER_Milreu_ruinas.pdf`
- `tests/source-audit.test.mjs`

## Regras de integração

- não publicar a pasta privada;
- não converter cores observadas em tokens;
- não copiar páginas;
- fundir manualmente as adendas;
- preservar o histórico do Pacote 02.
