---
title: "Release — Pacote 04 v0.1.0"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 04 v0.1.0 — Auditoria e Migração da Versão Preliminar

## Data

20 de julho de 2026.

## Tipo

Primeiro release de auditoria técnica e conversão preliminar dos dados legados.

## Dependências

Pacotes 01, 02 e 03.

## Adicionado

- inventário de 47 ficheiros lógicos da versão preliminar;
- identificação de 56 ficheiros `__MACOSX` no recipiente ZIP e de 3 ficheiros `.DS_Store` no diretório do site;
- fingerprint de `museum-items.js`;
- snapshot integral dos 31 objetos legados;
- 31 registos JSON preliminares;
- preservação integral dos campos originais;
- manifesto de migração;
- relatórios de qualidade, relações, idiomas, direitos, ativos e funcionalidades;
- identificação de 37 relações não recíprocas;
- identificação do duplicado `MM202612.jpg`/`.jpeg`;
- identificação do hero com extensão PNG e conteúdo JPEG;
- registo das intervenções digitais explícitas em `MM202617`, `MM202618`, `MM202619` e `MM202631`;
- bloqueio editorial preliminar de `MM202617`;
- fila de revisão manual;
- método, decisões, rollback e plano futuro de cutover;
- quatro specs de migração;
- quatro rules e quatro skills;
- scripts reproduzíveis e testes;
- prompt, checklist e manifesto de integração.

## Alterado

Nenhum ficheiro do protótipo.

## Removido

Nada.

## Decisões consolidadas

- migração é separada de publicação;
- todos os registos permanecem preliminares;
- direitos não são inferidos a partir do texto legado;
- traduções ausentes permanecem nulas;
- relações assimétricas não são corrigidas automaticamente;
- o legado permanece reversível e rastreável.

## Não incluído

- cutover da UI;
- portal ou Museu final;
- persistência online;
- tradução completa;
- revisão jurídica;
- revisão científica final;
- normalização definitiva dos ativos;
- remoção do Drive.

## Validação

```bash
node scripts/validate-package-04.mjs
node tests/migration.test.mjs
```

## Próximo release recomendado

Pacote 05 — Arquitetura de Navegação, Portal e Museu Digital.
