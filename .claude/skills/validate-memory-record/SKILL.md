---
title: "Skill — validate-memory-record"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Skill — Validar registo de memória

## Quando usar

Antes de integrar, publicar ou migrar qualquer registo.

## Verificações

- conformidade com o schema;
- identificador válido;
- quatro chaves linguísticas;
- níveis de certeza permitidos;
- fontes e proveniência;
- direitos e consentimento;
- coerência entre `recordStatus` e `publicationStatus`;
- relações sem autorreferência indevida;
- inexistência de coordenadas sensíveis publicáveis;
- intervenções digitais declaradas;
- ausência de dados pessoais desnecessários.

## Regra

Falhar validação não autoriza corrigir por invenção. Deve produzir lista de erros e lacunas.
