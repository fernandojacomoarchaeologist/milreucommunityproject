---
title: "Checklist de integração — Pacote 02"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Checklist de integração

## Dependência

- [ ] Pacote 01 integrado ou respetivos ficheiros equivalentes existentes.
- [ ] `COPYRIGHT.md` e `RIGHTS.md` disponíveis na raiz.
- [ ] `CLAUDE.md` lido antes de qualquer alteração.

## Pré-integração

- [ ] Comparar os caminhos do manifesto com o repositório.
- [ ] Identificar design system produzido noutro agente, caso esteja presente.
- [ ] Identificar tokens, componentes ou guide já existentes.
- [ ] Confirmar que o ZIP preliminar permanece preservado.
- [ ] Não tratar o logótipo preliminar como definitivo.

## Integração

- [ ] Registar documentação em `docs/design/`.
- [ ] Registar specs em `docs/specifications/`.
- [ ] Registar tokens e componentes em `packages/`.
- [ ] Registar o guia vivo em `apps/design-guide/`.
- [ ] Registar rules, skills e script de validação.
- [ ] Fundir manualmente os appendices em `integration/`.
- [ ] Registar `releases/PACKAGE_02_v0.1.0.md`.

## Validação

- [ ] Executar `node scripts/validate-design-system.mjs`.
- [ ] Abrir `apps/design-guide/index.html` num servidor local.
- [ ] Verificar navegação por teclado.
- [ ] Verificar troca entre os quatro idiomas da interface do guia.
- [ ] Verificar comparação Spectral/Archivo.
- [ ] Confirmar que o tijolo não ocupa grandes áreas.
- [ ] Confirmar que Portal e Museu permanecem modos distintos.

## Não fazer neste pacote

- [ ] Não migrar o site preliminar automaticamente.
- [ ] Não inventar um logótipo.
- [ ] Não reproduzir páginas ou grafismos do livro sem material de referência e análise.
- [ ] Não introduzir novas visualizações fora das specs.
- [ ] Não incluir fontes binárias no repositório.
