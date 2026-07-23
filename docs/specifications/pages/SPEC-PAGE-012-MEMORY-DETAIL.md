---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "06"
rights: "Consultar RIGHTS.md no repositório principal"
---

# SPEC-PAGE-012-MEMORY-DETAIL

## Estado

Accepted for architecture

## Produto

museu

## Rota

`/museu/memorias/:id`

## Objetivo

Apresentar memória completa

## Componentes autorizados

- MuseumHeader
- PhotoViewer
- CommunityNarrative
- InstitutionalContext
- ProvenanceNote
- RightsNotice
- RelatedRecords
- MuseumFooter

## Fontes de dados

- memory
- relations

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
