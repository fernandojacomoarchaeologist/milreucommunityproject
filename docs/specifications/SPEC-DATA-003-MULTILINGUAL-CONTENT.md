---
title: "SPEC-DATA-003 — Conteúdo multilingue"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# SPEC-DATA-003 — Conteúdo multilingue

## Idiomas

`pt-PT`, `en`, `es`, `fr`.

## Requisitos

- quatro chaves presentes;
- valores ausentes como `null`;
- estado editorial por idioma;
- `pt-PT` como fonte;
- tradução automática marcada;
- fallback visível e não enganador;
- glossário futuro compatível.

## Critérios de aceitação

- schemas validam as quatro chaves;
- nenhum idioma adicional entra sem decisão versionada;
- tradução ausente não é fabricada.
