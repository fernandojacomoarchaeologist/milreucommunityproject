---
title: "Componentes nucleares — utilização"
version: "0.1.0"
status: "beta"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Componentes nucleares

Os componentes deste pacote são agnósticos quanto ao produto e utilizam classes prefixadas por `.ds-` para reduzir colisões com o protótipo.

## Componentes incluídos

- Figure Card;
- Confidence Dot;
- Provenance Note;
- Standard Footer;
- Language Toggle;
- Rights Notice;
- Status Badge.

## Implementações

- `components.css`: estilos base;
- `components.vanilla.js`: funções DOM sem framework;
- `components.react.jsx`: adaptador de referência, opcional.

## Regras

- não renomear componentes sem release;
- não introduzir conteúdo real nos exemplos;
- preservar semântica e acessibilidade;
- consumir tokens de `packages/design-tokens/`;
- não usar classes do protótipo `.museum-*`;
- React não é dependência obrigatória.
