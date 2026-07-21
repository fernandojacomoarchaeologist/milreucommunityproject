---
title: "Release consolidada do repositório — série de fundação + Design System"
version: "consolidated-2026-07-21"
status: "internal-preview"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---

# Release consolidada — 2026-07-21

Consolida a integração sequencial dos Pacotes 01 → 05D no ramo `main`. Documenta o estado verificado do repositório antes da revisão visual do Design System e antes de qualquer trabalho de Portal ou Museu.

Esta release **não** promove maturidade: o Design System permanece `internal-preview` até revisão visual de Fernando Rodrigues de Jácomo.

## Sequência integrada

| Ordem | Pacote | Versão | Commit | Estado |
|---|---|---|---|---|
| 1 | 01 — Fundação, Governação e Escopo | 0.1.0 | `f61f063` | integrado no `main` |
| 2 | 02 — Sistema de Design e Guia Vivo | 0.1.0 | `66022b8` | integrado no `main` |
| 3 | 03 — Modelo de Dados do Museu | 0.1.0 | PR #2 | integrado no `main` |
| 4 | 04 — Auditoria e Migração da Versão Preliminar | 0.1.0 | PR #3 | integrado no `main` |
| 5 | 05A — Auditoria Visual e Fonte Primária | 0.1.0 | PR #4 | integrado no `main` |
| 6 | 05B — Fundações Visuais de Produção | 0.2.0 | PR #5 | integrado no `main` |
| 7 | 05C — Catálogo Visual Interativo | 0.3.0 | PR #6 | integrado no `main` |
| 8 | 05D — Componentes e Padrões Museológicos | 0.4.0 | PR #7 | integrado no `main` |

Cada pacote foi integrado com o respetivo `PROMPT_CLAUDE.md`, verificação de conflitos de caminho, fusão manual das adendas de `integration/` e validação verde antes do merge. O histórico permanente por pacote está em `releases/PACKAGE_0N_*.md`.

## Conteúdo verificado

- **Fundação:** governação, escopo, políticas de idioma/publicação/direitos, hierarquia de fontes.
- **Dados:** schemas JSON Schema 2020-12, vocabulários, templates; 4 idiomas (`pt-PT` fonte, `en`/`es`/`fr`); certeza `confirmed`/`probable`/`hypothesis` (sem `mixed`).
- **Migração:** 31 registos preliminares (`MM202601..631`) em `data/migration/` — não públicos, `MM202617` bloqueado, protótipo intocado.
- **Fonte visual:** livro *Milreu: Ruínas* auditado página a página; PDF e miniaturas mantidos **privados** via `.gitignore` (ver `SOURCE_RIGHTS_NOTICE.md`).
- **Tokens v0.2:** cor, tipografia, grelha, espaçamento, formas, elevação, movimento; exportações Web/JS/Flutter/impressão. Tokens v0.1 do Pacote 02 preservados para comparação.
- **Catálogo:** guia vivo interativo em `apps/design-guide/` (58 páginas, 4 idiomas, pesquisa, rotas por hash), consumindo tokens v0.2.
- **Componentes e padrões:** 21 componentes + 13 padrões museológicos, exemplos apenas demonstrativos (`demo-*`).

## Verificação automática (Node v24)

- Validadores de pacote (data-model, design-system, 04, 05A–05D): **verdes**.
- 15 testes automáticos (`tests/*.test.mjs`): **verdes** — incluem contraste, paridade de plataforma, esquema de tokens, integridade do catálogo, registos de componentes/padrões, segurança dos exemplos (`demo-safety`) e acessibilidade estática.
- Contraste mínimo das combinações principais: **4,84:1** (sepia/paper).
- Guia servido por HTTP: `index.html`, módulos `app/*`, `catalog.json` v0.4 e `tokens.css` v0.2 respondem 200.
- 269 ficheiros Markdown com copyright verificado.

Notas:
- `scripts/inventory-legacy-site.mjs` e `scripts/migrate-legacy-records.mjs` são **geradores** do Pacote 04; exigem a fonte legada externa e não fazem parte da suite de validação.
- `scripts/validate-package-05a.mjs` exige o PDF e as miniaturas privadas em disco; é validador **local de mantenedor** e não corre num clone público.

## Limites desta release

- Não aprova o Design System nem qualquer componente/padrão.
- Não cria Portal, Museu público, backend, aplicação Flutter nem ficheiros finais de impressão.
- Não incorpora os 31 registos migrados nos exemplos.
- Não publica imagens ou páginas do livro.

## Próximos passos

1. Revisão visual do Design System no browser (ver `docs/design/visual-reviews/`).
2. Correções como releases incrementais do Pacote 05D: `v0.4.1` (técnicas), `v0.4.2` (cor/tipografia), `v0.4.3` (componentes), `v0.4.4` (responsivo), `v0.5.0` (aprovado para o primeiro MVP).
3. Só depois: specs e arquitetura do Portal e do Museu, consumindo este sistema, sem publicação automática.

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.
