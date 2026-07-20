---
title: "Pacote 02 — Sistema de Design e Guia Vivo"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Pacote 02 — Sistema de Design e Guia Vivo

Este pacote estabelece a primeira versão estruturada do sistema de design do **Projeto Comunitário de Milreu** e cria um guia vivo, estático e navegável para consulta futura.

## Objetivo

Transformar as decisões visuais já registadas no handoff do Museu de Memórias numa fonte de verdade reutilizável para:

- portal público do Projeto Comunitário de Milreu;
- experiência imersiva do Museu de Memórias;
- exposição física, painéis e totens;
- futura aplicação Flutter;
- componentes de consulta, proveniência, confiança, direitos e idiomas;
- migração progressiva da identidade visual preliminar do ZIP existente.

## Base autoritativa deste pacote

O pacote parte das decisões já estabelecidas:

- comunidade como superfície e primeira voz;
- instituição como moldura;
- identidade inspirada na linguagem visual de *Milreu. Ruínas*, de Theodor Hauschild e Felix Teichner, sem reproduzir o livro como fac-símile;
- paleta de linho, tinta, sépia, pedra, prata, pátina e tijolo;
- Fraunces como tipografia de destaque;
- Spectral como opção inicial para corpo e Archivo como alternativa a validar em ecrã;
- Archivo para metadados, identificadores, confiança e utilitários;
- tijolo restrito a moldura institucional, créditos, QR e pequenos sinais;
- paridade conceptual entre meios digitais e físicos;
- quatro idiomas previstos: `pt-PT`, `en`, `es` e `fr`.

## Conteúdo

- documentação completa de fundações, princípios e governação do design;
- tokens em CSS e JSON;
- primeira projeção de tokens para Flutter;
- componentes agnósticos em CSS e Vanilla JavaScript;
- adaptador React de referência, sem tornar React obrigatório;
- shells distintos para Portal e Museu;
- tokens de impressão;
- guia vivo estático em `apps/design-guide/`;
- camada de migração segura para o CSS preliminar;
- specs do guia, do Portal e do Museu;
- rules e skills para evolução controlada;
- script local de validação;
- prompt de integração e release.

## Instalação

1. Confirmar que o Pacote 01 foi integrado.
2. Descompactar este pacote na raiz do repositório.
3. Preservar a estrutura de pastas.
4. Utilizar `PROMPT_CLAUDE.md` como prompt de integração.
5. Não ligar automaticamente `skin-migration/tokens-migration.css` ao site preliminar.
6. Não substituir o logótipo, o `style.css` existente ou assets sem comparação e aprovação.
7. Executar `node scripts/validate-design-system.mjs` após a integração.

## Estado

Esta versão cria uma base funcional e consultável, mas não declara como concluídos:

- o logótipo definitivo;
- a auditoria visual página a página do livro de Hauschild e Teichner;
- a decisão final entre Spectral e Archivo para corpo em ecrã;
- os templates finais de impressão;
- a aplicação Flutter;
- a migração visual do Museu preliminar.

Essas pendências não impedem o registo do sistema. Impedem apenas que a identidade seja declarada como final ou que o protótipo seja migrado automaticamente.
