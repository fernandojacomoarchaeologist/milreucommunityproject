---
title: "Plano de migração visual do protótipo"
version: "0.1.0"
status: "planned"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Plano de migração visual do protótipo

## Fase 0 — Preservação

- manter versão preliminar funcional;
- criar branch de migração;
- registar screenshots de referência;
- não alterar dados nem integração Drive.

## Fase 1 — Alias

- carregar `packages/design-tokens/tokens.css`;
- carregar `skin-migration/tokens-migration.css` depois do CSS antigo;
- validar regressões;
- não declarar a nova identidade como concluída.

## Fase 2 — Componentes nucleares

- introduzir prefixo `.ds-`;
- migrar confiança, proveniência, rodapé, idiomas e direitos;
- manter `.museum-*` quando necessário.

## Fase 3 — Composição

- separar shell do Portal e shell do Museu;
- rever cabeçalho, hero, cartões e modo imersivo;
- retirar tijolo de superfícies extensas;
- validar Spectral e Archivo.

## Fase 4 — Conteúdo e quatro idiomas

- não hard-codear textos;
- adotar modelo de tradução estruturado;
- conservar fallback e estado editorial.

## Fase 5 — Remoção de aliases

Só após cobertura total, testes e release major.

## Critério de interrupção

Parar e questionar quando a migração exigir:

- logótipo definitivo;
- decisão de fonte de corpo;
- alteração de conteúdo real;
- reestruturação da integração Drive;
- criação de visualização não especificada.
