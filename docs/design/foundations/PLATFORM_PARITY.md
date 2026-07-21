---
title: "Paridade entre plataformas"
version: "0.2.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Paridade entre plataformas

## Fonte de verdade

`packages/design-tokens/v0.2/tokens.json` é a fonte consolidada.

## Exportações

- CSS: propriedades customizadas;
- JavaScript: objeto congelado;
- Flutter: classe estática com cores, dimensões e durações;
- impressão: CSS com decisões seguras e avisos de prova.

## Regra

Paridade significa equivalência semântica, não igualdade absoluta de renderização. Alterações devem atualizar todas as exportações e passar o teste de paridade.
