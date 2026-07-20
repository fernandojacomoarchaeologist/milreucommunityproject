---
title: "Modelo de localização linguística"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Modelo de localização linguística

## Idiomas obrigatórios na estrutura

- `pt-PT`;
- `en`;
- `es`;
- `fr`.

A presença estrutural das quatro chaves não significa que todas tenham texto. Ausências devem usar `null`.

## Estado por idioma

- `source` — texto original em português de Portugal;
- `missing` — não produzido;
- `machine-draft` — tradução automática não revista;
- `draft` — tradução em elaboração;
- `reviewed` — revista, mas ainda não aprovada para publicação;
- `approved` — aprovada para publicação;
- `not-required` — exceção documental justificada.

## Fallback

Interfaces podem apresentar `pt-PT` quando uma tradução falta, mas devem indicar que o conteúdo não está disponível no idioma escolhido. Não apresentar fallback como se fosse tradução aprovada.
