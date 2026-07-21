---
title: "Roadmap de arquitetura e pacotes"
version: "0.1.0"
status: "planning"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Roadmap de arquitetura e pacotes

## Pacote 01 — Fundação, Governação e Escopo

- definição do projeto guarda-chuva;
- limites do Museu de Memórias;
- registo das iniciativas;
- copyright e direitos;
- política preliminar de publicação, consentimento e idiomas;
- template de specs;
- regras e skills iniciais.

## Pacote 02 — Sistema de Design e Guia Vivo

- estudo da referência visual de Hauschild e Teichner;
- princípios das duas vozes;
- tokens;
- tipografia;
- componentes digitais e físicos;
- mapa navegável do design system;
- guia de implementação web e Flutter.

## Pacote 03 — Modelo de Dados do Museu

- schemas de memórias, media, proveniência, certeza, direitos e consentimento;
- migração controlada da base preliminar;
- estados editoriais;
- validação automática.

## Pacote 04 — Portal e Museu Web

- arquitetura de navegação;
- experiência portal;
- experiência imersiva;
- rotas e páginas individuais;
- acessibilidade e internacionalização.

## Pacote 05 — Narrativas, Mapa e Persistência

- base de dados;
- submissões;
- revisão e moderação;
- versionamento;
- mapa vivo;
- políticas de acesso.

## Pacote 06 — Base de Conhecimento e Biblioteca

- bibliografia;
- ficheiros públicos e privados;
- notas de fontes;
- páginas relevantes;
- mapas de citação;
- auditoria RPA e outros estilos.

## Pacote 07 — Inquéritos e Dados Públicos

- dicionários;
- releases anonimizadas;
- métodos;
- consulta pública;
- limitações;
- versionamento.

## Pacote 08 — Arqueologia e Artefactos

- estudos;
- campanhas;
- estruturas;
- artefactos;
- relações com memórias e bibliografia;
- camadas CIDOC quando aplicáveis.

## Pacote 09 — Exposição Física

- templates de totens e painéis;
- materiais;
- escala tipográfica;
- preflight;
- exports e manifests.

## Pacote 10 — Aplicação Flutter

- estrutura do projeto;
- design tokens;
- cliente de API;
- exploração do museu;
- idiomas;
- favoritos;
- mapa e experiência offline, conforme viabilidade.

## Regra de sequência

O número dos pacotes indica a ordem recomendada, não uma obrigação absoluta. Nenhum pacote deve ser gerado quando faltar uma decisão que bloqueie o seu conteúdo. Pendências não bloqueantes devem ser registadas sem serem resolvidas por inferência.

## Handoff após a série 05 — pelo Pacote 05D

Com a série 05 concluída (Design System), o próximo pacote pode especificar a arquitetura e a navegação do Portal e do Museu digital. Deve consumir os tokens 05B, os componentes e padrões 05D, os schemas 03 e os dados preliminares 04, sem publicar automaticamente.
