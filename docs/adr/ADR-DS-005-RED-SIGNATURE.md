---
title: "ADR-DS-005 — Vermelho como assinatura"
version: "0.2.0"
status: "accepted"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# ADR-DS-005 — Vermelho como assinatura

## Estado
Aceite.

## Decisão
O vermelho principal é usado em aberturas, transições, fechos, pequenos acentos e moldura institucional. Não é fundo padrão para leitura longa.

## Justificação
A fonte primária usa vermelho como campo editorial forte, enquanto o miolo preserva grandes superfícies claras. A adaptação conserva reconhecimento e corrige legibilidade.

## Consequências
- texto branco sobre vermelho principal ou profundo;
- componentes comuns não devem usar vermelho por decoração;
- erro e perigo usam tokens de estado separados, mesmo quando cromaticamente próximos.
