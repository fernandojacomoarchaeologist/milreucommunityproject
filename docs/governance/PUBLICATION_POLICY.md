---
title: "Política preliminar de publicação"
version: "0.1.0"
status: "draft-policy"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Política preliminar de publicação

## Objetivo

Separar produção, revisão e publicação num projeto vivo, evitando que conteúdo de exemplo, preliminar ou contestado seja apresentado como definitivo.

## Estados editoriais mínimos

- `sample`: conteúdo demonstrativo, nunca publicável como real.
- `draft`: em construção.
- `submitted`: recebido e ainda não revisto.
- `in-review`: em análise.
- `changes-requested`: necessita de correções ou confirmação.
- `approved`: aprovado editorialmente, mas ainda não publicado.
- `published`: disponível publicamente.
- `contested`: sujeito a contestação ou dúvida relevante.
- `withdrawn`: retirado de publicação.
- `archived`: preservado apenas para histórico interno.

## Critérios gerais para publicação

Um conteúdo só pode ser publicado quando:

- não estiver marcado como exemplo;
- possuir origem ou proveniência registada;
- possuir estado de direitos adequado ou uma justificação documentada;
- possuir tratamento de consentimento compatível com o conteúdo;
- não contiver dados pessoais desnecessários;
- indicar incerteza quando aplicável;
- ter sido revisto por uma pessoa responsável;
- possuir idioma-fonte aprovado;
- não estiver contestado ou retirado.

## Conteúdo preliminar público

Resultados ou informações em curso podem ser apresentados publicamente quando:

- o estado preliminar estiver visível;
- a data ou versão estiver indicada;
- as limitações forem descritas;
- a visualização não induzir conclusão definitiva.

## Publicação por idioma

A aprovação de `pt-PT` não aprova automaticamente as traduções. Cada idioma possui estado editorial próprio.

## Revisão e retirada

A política deverá permitir correções, novas versões, contestação e retirada. Uma retirada pública não obriga a apagar o histórico interno necessário para auditoria, desde que o acesso seja restrito e juridicamente adequado.

## Automação futura

Scripts, testes e pipelines deverão impedir builds públicos com conteúdo inválido. Este pacote define a política, mas não implementa ainda os bloqueios automáticos.
