---
title: "Append proposto para CLAUDE.md — Pacote 02"
version: "0.1.0"
status: "ready-to-merge"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Append proposto para `CLAUDE.md`

Fundir semanticamente após a secção de Design. Não substituir o ficheiro integralmente.

## Sistema de design

A fonte de verdade visual está distribuída entre:

- `docs/design/` para intenção e regras;
- `packages/design-tokens/tokens.json` para valores estruturados;
- `packages/design-tokens/tokens.css` para Web;
- `docs/design/COMPONENT_REGISTRY.md` para estado dos componentes;
- `apps/design-guide/` para referência visual viva.

Antes de alterar tokens ou componentes, executar a skill `design-system-change`.

O sistema possui uma identidade e dois modos de composição: Portal e Museu. O tijolo é restrito à moldura institucional, créditos, QR e pequenos sinais; nunca deve dominar cabeçalhos ou superfícies.

Não criar logótipo, textura, ícone ou reprodução do livro por inferência. Não incluir ficheiros de fontes. Novos componentes exigem `component-intake` e registo.
