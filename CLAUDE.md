---
title: "Instruções permanentes para Claude"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Projeto Comunitário de Milreu — instruções permanentes

## 1. Natureza do projeto

O Projeto Comunitário de Milreu é um programa plurianual de Arqueologia Pública e Comunitária associado às Ruínas Romanas de Milreu, em Estoi, Faro. Funciona como guarda-chuva de várias iniciativas com métodos, públicos, dados e resultados próprios.

O Museu de Memórias de Milreu é a iniciativa prioritária atual, mas não representa a totalidade do projeto.

## 2. Regra de integridade

Nunca inventar nomes, datas, locais, memórias, testemunhos, direitos, consentimentos, resultados, fontes, identificadores ou relações entre pessoas e Milreu.

Quando faltar informação:

1. indicar claramente o que falta;
2. manter o campo vazio, nulo, pendente ou marcado como exemplo;
3. perguntar ao responsável antes de transformar a lacuna em conteúdo real.

## 3. Fonte de verdade

Respeitar a hierarquia definida em `docs/project/SOURCE_HIERARCHY.md`.

Documentos recentes e decisões explícitas do responsável prevalecem sobre protótipos, versões antigas e inferências. O site preliminar é uma fonte de requisitos e conteúdo em revisão, não uma especificação autoritativa.

## 4. Escopo

Antes de criar ou alterar uma funcionalidade:

- identificar a iniciativa relacionada;
- executar a skill `scope-check`;
- verificar se existe uma spec aprovada;
- não criar uma nova visualização sem registo em `VISUALIZATION_REGISTRY.md`;
- não converter uma ideia futura em compromisso implementado.

## 5. Produtos digitais

O projeto poderá possuir:

- portal público do projeto;
- experiência web imersiva do Museu de Memórias;
- guia vivo do design system;
- área de revisão e administração;
- aplicação móvel Flutter;
- exposição física e materiais de impressão.

Todos partilham conteúdo e princípios, mas podem usar composições de navegação distintas.

## 6. Idiomas

O idioma-fonte é português de Portugal. O conteúdo público deverá prever:

- `pt-PT`;
- inglês;
- espanhol;
- francês.

Não publicar traduções automáticas como revistas. Não completar traduções em falta sem assinalar o estado editorial.

## 7. Direitos e consentimento

O consentimento e os direitos podem ter sido manifestados em reuniões, entrega voluntária de materiais ou outros processos comunitários documentados. Não reduzir essas situações a um simples campo booleano.

Permitir futura correção, contestação, identificação e remoção. Não afirmar que o projeto detém direitos sobre todos os conteúdos.

## 8. Estado vivo dos dados

Distinguir sempre:

- exemplo;
- preliminar;
- em revisão;
- aprovado;
- publicado;
- contestado;
- retirado.

Não tratar dados em construção como definitivos.

## 9. Design

A identidade visual preliminar do ZIP antigo não é autoritativa. O design system futuro deverá partir das referências visuais do livro de Hauschild e Teichner e das decisões já documentadas sobre as duas vozes: comunidade como superfície e instituição como moldura.

Não implementar o design system antes do pacote específico.

## 10. Copyright

Todos os novos MDs e ficheiros de código devem conter:

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.

A atribuição não deve apagar ou substituir direitos de terceiros.

## 11. Alterações e releases

Cada pacote integrado deve:

- possuir manifesto;
- possuir prompt;
- possuir release;
- indicar ficheiros criados, alterados, mantidos e não tocados;
- apresentar conflitos antes de sobrescrever;
- preservar a rastreabilidade das decisões.

## 12. Perguntas

Claude pode e deve questionar quando uma informação necessária não estiver disponível. As perguntas devem ser específicas, agrupadas e limitadas ao que bloqueia a tarefa atual.
