---
title: "SPEC-DS-001 — Guia vivo do sistema de design"
version: "0.1.0"
status: "approved"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# SPEC-DS-001 — Guia vivo do sistema de design

## Estado

Approved for foundation implementation.

## Iniciativa relacionada

Transversal ao Projeto Comunitário de Milreu.

## Produto

Guia do Sistema de Design.

## Problema

As decisões visuais encontram-se distribuídas entre o protótipo, o handoff e materiais produzidos noutro agente. É necessário um mapa navegável e versionado para impedir redescoberta, divergências e utilização inadequada dos elementos.

## Objetivo

Criar uma referência viva que apresente fundações, duas vozes, componentes, padrões, impressão e implementação.

## Utilizadores

- responsável pelo projeto;
- Claude e outros agentes de desenvolvimento;
- designers e programadores;
- parceiros que precisem de produzir materiais;
- público interessado, quando o guia for publicado.

## Dentro do âmbito

- navegação por secções;
- paleta e tokens;
- tipografia e comparação Spectral/Archivo;
- componentes nucleares;
- exemplos de Portal e Museu;
- referência de impressão;
- interface em `pt-PT`, `en`, `es` e `fr` para os conteúdos essenciais do guia;
- indicação clara de itens pendentes.

## Fora do âmbito

- editor visual de tokens;
- download de fontes;
- geração automática de componentes;
- logótipo definitivo;
- documentação integral traduzida nesta versão;
- autenticação.

## Visualização autorizada

Página documental com navegação lateral em ecrãs largos e navegação linear em ecrãs pequenos. Não utilizar estética de dashboard corporativo.

## Dados utilizados

Tokens locais e registo de componentes. Nenhum dado pessoal ou do acervo.

## Acessibilidade

Teclado, foco, contraste, landmarks, idioma, movimento reduzido e zoom.

## Critérios de aceitação

- abre sem framework;
- não depende de build;
- apresenta todos os tokens autoritativos;
- demonstra componentes beta;
- troca os quatro idiomas essenciais;
- permite comparar a fonte de corpo;
- distingue Portal e Museu;
- não utiliza tijolo como grande superfície;
- não apresenta logótipo inventado.
