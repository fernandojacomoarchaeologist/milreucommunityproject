---
title: "ADR-DS-008 — Separação da paleta de dados"
version: "0.2.0"
status: "accepted"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# ADR-DS-008 — Separação da paleta de dados

## Estado
Aceite.

## Decisão
Cores de mapas, gráficos e categorias não são extensões da paleta de marca.

## Consequências
- cada visualização deve ter legenda;
- tokens de dados ficam em namespace próprio;
- vermelho de assinatura não representa automaticamente valores negativos.
