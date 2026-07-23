---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "06"
rights: "Consultar RIGHTS.md no repositório principal"
---

# SPEC-PAGE-018-UNPUBLISHED

## Estado

Accepted for architecture

## Produto

museu

## Rota

`/museu/memorias/:id/indisponivel`

## Objetivo

Proteger registo não publicável

## Componentes autorizados

- MuseumHeader
- UnavailableState
- PrimaryAction
- MuseumFooter

## Fontes de dados

- recordStatus

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
