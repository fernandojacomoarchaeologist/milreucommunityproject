---
title: "Release — Pacote 02 v0.1.0"
version: "0.1.0"
status: "released"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
release-date: "2026-07-18"
---
# Pacote 02 v0.1.0 — Sistema de Design e Guia Vivo

## Tipo

Release de fundação visual, componentes e documentação viva.

## Dependência

Pacote 01 — Fundação, Governação e Escopo.

## Adicionado

- escopo do sistema de design;
- dez princípios de design;
- modelo das duas vozes;
- referência conceptual a Hauschild e Teichner;
- paleta autoritativa;
- tokens semânticos de confiança, superfícies, texto e moldura;
- tipografia Fraunces, Spectral e Archivo;
- comparação prevista entre Spectral e Archivo;
- defaults técnicos de espaçamento, grelha, raio, elevação e movimento;
- regras de fotografia, textura, tratamento e placeholders;
- política temporária de logótipo e assinatura textual;
- requisitos de acessibilidade;
- distinção entre modo Portal e modo Museu;
- paridade entre impressão e digital;
- governação e versionamento do sistema;
- registo inicial de dez componentes e padrões;
- tokens CSS e JSON;
- projeções JavaScript e Flutter;
- componentes beta em Vanilla JavaScript e CSS;
- adaptador React opcional;
- scaffolds CSS de Portal e Museu;
- tokens iniciais de impressão;
- guia vivo estático com interface essencial em quatro idiomas;
- controlo de comparação de fonte de corpo;
- camada de aliases para a identidade preliminar;
- mapa e auditoria inicial de tokens do protótipo;
- plano de migração progressiva;
- rules e skills do sistema de design;
- specs do guia, Portal e Museu;
- validador local;
- prompt, checklist e manifesto de integração.

## Análise do protótipo registada

Foi documentado o forte acoplamento dos tokens `terracotta`, `sand` e `charcoal`. O alias de `terracotta` foi direcionado para sépia, e não para tijolo, para evitar violar a regra de superfície institucional.

## Alterado

Nenhum ficheiro da versão preliminar foi alterado por este pacote.

## Removido

Nada.

## Não incluído

- logótipo definitivo;
- assets visuais finais;
- reprodução de páginas do livro;
- migração ativa do protótipo;
- portal público;
- Museu final;
- timeline e mapa;
- templates print-ready;
- componentes Flutter de produção;
- pipeline CI.

## Compatibilidade

O pacote pode coexistir com o protótipo. `tokens-migration.css` é opt-in e não deve ser carregado sem instrução explícita.

## Próximo pacote recomendado

Pacote 03 — Modelos de Dados, Schemas, Estados Editoriais e Validação do Museu de Memórias.
