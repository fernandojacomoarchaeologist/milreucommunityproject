---
title: "SPEC-DATA-002 — Direitos, consentimento e publicação"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# SPEC-DATA-002 — Direitos, consentimento e publicação

## Objetivo

Modelar separadamente direitos, consentimento, base de utilização, autorização de publicação, contestação e retirada.

## Requisitos

- estado controlado;
- referência segura a evidências;
- possibilidade de revisão;
- bloqueio de publicação por estado;
- pedidos privados por defeito;
- canal para correção, identificação e remoção;
- não transferência automática de direitos para o autor do projeto.

## Critérios de aceitação

- nenhum estado textual livre substitui os campos controlados;
- direitos pendentes mantêm publicação em revisão ou bloqueada;
- `withdrawn` impede publicação;
- dados pessoais do requerente não entram no registo público.
