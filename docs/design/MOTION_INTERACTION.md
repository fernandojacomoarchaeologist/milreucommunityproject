---
title: "Movimento e interação"
version: "0.1.0"
status: "provisional"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Movimento e interação

## Princípio

O movimento deve orientar, relacionar e revelar. Não deve competir com a fotografia nem criar uma experiência de espetáculo desligada da memória.

## Portal

- transições breves e discretas;
- foco visível;
- feedback claro em filtros e formulários;
- sem scroll hijacking;
- navegação convencional preservada.

## Museu

- transições entre imagens podem ser mais imersivas;
- controlos devem desaparecer sem se tornarem inacessíveis;
- teclado, gesto e botões visíveis devem coexistir;
- detalhes podem abrir em camadas progressivas;
- o utilizador deve conseguir sair facilmente do modo de ecrã inteiro.

## Duração inicial

- feedback curto: 120–180 ms;
- mudança de estado: 180–280 ms;
- transição imersiva: 280–450 ms.

São valores técnicos iniciais, ajustáveis após testes.

## Movimento reduzido

Respeitar `prefers-reduced-motion`. Nesse modo:

- remover deslocações amplas;
- reduzir fades;
- desativar parallax;
- evitar autoplay;
- preservar toda a informação e funcionalidade.
