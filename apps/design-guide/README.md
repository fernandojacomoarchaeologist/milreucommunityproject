---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Design Guide 0.3.0

Aplicação estática do catálogo visual do Sistema de Design de Milreu.

## Arquitetura

- `index.html`: shell acessível.
- `guide.css`: layout e visualização do catálogo.
- `guide.js`: inicialização da app.
- `app/catalog-data.js`: páginas e navegação.
- `app/i18n.js`: interface em quatro idiomas.
- `app/router.js`: rotas por hash.
- `app/renderers.js`: renderização das páginas e exemplos.
- `app/search.js`: índice e pesquisa local.
- `app/state.js`: preferências locais.

## Dependência

`../../packages/design-tokens/v0.2/tokens.css`

## Estado

`internal-preview`. Componentes especializados serão adicionados no Pacote 05D.

## Ferramentas relacionadas

`apps/foundations-lab/` (Pacote 05B) é ferramenta interna e não deve ser ligada ao menu público.

## Integração (Pacote 05C)

Esta app substitui a implementação preliminar de `apps/design-guide/` criada no Pacote 02, mantendo o caminho canónico. O histórico do guia anterior fica preservado no Git; não manter uma app paralela.

Os fallbacks em `guide.css` existem apenas para resiliência de visualização e não redefinem tokens: alterações de valor devem ocorrer em `packages/design-tokens/v0.2/` e ser validadas pelas skills do Pacote 05B.
