---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "06"
rights: "Consultar RIGHTS.md no repositório principal"
---

# SPEC-PAGE-004-INITIATIVE-DETAIL

## Estado

Accepted for architecture

## Produto

portal

## Rota

`/iniciativas/:slug`

## Objetivo

Apresentar uma iniciativa

## Componentes autorizados

- ProjectHeader
- EditorialSection
- StatusBadge
- RelatedRecords
- StandardFooter

## Fontes de dados

- initiative
- relatedRecords

## Idiomas

pt-PT, en, es e fr, com fallback para pt-PT.

## Acessibilidade

Aplicar Gate A e arquitetura de acessibilidade.

## Fora do âmbito

Qualquer funcionalidade não descrita.

## Critérios

- rota funcional;
- conteúdo demonstrativo ou aprovado;
- navegação de entrada e saída;
- estados de erro;
- responsividade;
- nenhuma publicação de conteúdo preliminar.
