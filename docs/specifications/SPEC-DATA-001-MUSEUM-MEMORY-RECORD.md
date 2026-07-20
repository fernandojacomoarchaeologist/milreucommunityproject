---
title: "SPEC-DATA-001 — Registo de memória"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# SPEC-DATA-001 — Registo de memória

## Estado

Approved for model implementation.

## Iniciativa

Museu de Memórias de Milreu.

## Objetivo

Representar uma memória como conjunto documentado de conteúdo, media, pessoas, lugares, fontes, proveniência, direitos, traduções e relações.

## Dentro do âmbito

- estrutura JSON;
- quatro idiomas;
- estados editoriais;
- certeza;
- fontes e proveniência;
- media e intervenções digitais;
- direitos e consentimento;
- relações e vozes comunitárias;
- auditoria.

## Fora do âmbito

- persistência;
- UI;
- migração em massa;
- decisão automática de publicação.

## Critérios de aceitação

- schema válido;
- exemplo preliminar válido;
- nenhum campo obrigatório preenchido por invenção;
- suporte a `null` para traduções ausentes;
- ausência do nível `mixed`;
- publicação separada do estado editorial.
