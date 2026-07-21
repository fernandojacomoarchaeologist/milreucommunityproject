---
title: "ADR-DS-006 — Papéis tipográficos"
version: "0.2.0"
status: "accepted"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# ADR-DS-006 — Papéis tipográficos

## Estado
Aceite.

## Decisão
Fraunces representa abertura e personalidade; Spectral representa leitura editorial; Archivo representa interface e metadados.

## Justificação
A separação preserva a relação serif/sans observada no livro e evita usar uma única família em funções incompatíveis.

## Consequências
- três famílias devem ser testadas e carregadas de forma progressiva;
- fallbacks são obrigatórios;
- o guia deve mostrar papéis, não apenas amostras de alfabeto.
