---
title: "SPEC-DS-003 — Shell imersivo do Museu"
version: "0.1.0"
status: "draft"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# SPEC-DS-003 — Shell imersivo do Museu

## Estado

Draft — implementation scaffold only.

## Iniciativa

Museu de Memórias de Milreu.

## Produto

Museu Web.

## Modo de experiência

Imersivo e exploratório.

## Objetivo

Definir a moldura mínima para fotografia dominante, navegação rápida e detalhe progressivo.

## Estrutura autorizada

- ligação discreta para regressar ao Portal;
- identificação do Museu;
- imagem dominante;
- título e data;
- controlos anterior/seguinte;
- acesso ao detalhe;
- acesso ao modo de ecrã inteiro;
- indicação de posição na coleção;
- saída sempre visível ou recuperável;
- painel de metadados acessível sem ecrã inteiro.

## Fora do âmbito

- mapa vivo;
- timeline final;
- favoritos;
- comentários públicos;
- upload;
- autenticação;
- persistência de narrativas;
- conteúdo real incorporado no scaffold.

## Regras

- não abrir automaticamente em ecrã inteiro;
- não ocultar controlos essenciais apenas em hover;
- não apresentar menus institucionais extensos sobre a imagem;
- respeitar movimento reduzido;
- disponibilizar imagem integral no detalhe;
- distinguir informação confirmada e interpretativa.

## Critérios de aceitação do scaffold

- utiliza placeholder abstrato identificado;
- teclado e foco funcionam;
- shell é visualmente distinto do Portal sem criar nova identidade;
- tijolo não ocupa grandes áreas;
- componentes são derivados dos tokens comuns.
