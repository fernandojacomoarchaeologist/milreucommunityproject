---
title: "SPEC-DS-002 — Shell do Portal"
version: "0.1.0"
status: "draft"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# SPEC-DS-002 — Shell do Portal

## Estado

Draft — implementation scaffold only.

## Produto

Portal público do Projeto Comunitário de Milreu.

## Modo de experiência

Consulta institucional e pública.

## Objetivo

Definir a composição base do Portal sem implementar as páginas finais.

## Estrutura autorizada

- skip link;
- cabeçalho com assinatura textual;
- navegação principal superior em ecrãs largos;
- adaptação para menu compacto em ecrãs pequenos;
- breadcrumb opcional;
- contentor de leitura;
- ligações claras para Museu, dados, investigação, arqueologia, biblioteca e participação;
- rodapé normalizado.

## Visualizações excluídas

- hero com autoplay;
- navegação experimental obrigatória;
- menu pesado sobre o Museu;
- dashboard como página inicial;
- painéis de tijolo em grande área.

## Componentes

Standard Footer, Language Toggle, Status Badge, Rights Notice e componentes futuros aprovados.

## Paridade

O shell não será copiado integralmente para Flutter. Tokens e hierarquia serão partilhados.

## Critérios de aceitação do scaffold

- responsivo;
- sem conteúdo inventado;
- funciona sem JavaScript para navegação principal;
- foco visível;
- ligação de entrada no Museu identificada;
- utiliza apenas tokens do design system.
