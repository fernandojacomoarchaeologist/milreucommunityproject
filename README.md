---
title: "Pacote 03 — Modelo de Dados do Museu"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 03 — Modelo de Dados do Museu

Este pacote define o modelo de dados inicial do **Museu de Memórias de Milreu**. Ele transforma as decisões metodológicas e editoriais dos Pacotes 01 e 02 em estruturas verificáveis para memórias, narrativas, pessoas, fontes, proveniência, datas, locais, media, direitos, consentimento, traduções, relações e revisões.

## Objetivo

Criar uma fonte de verdade para os dados do Museu antes da migração dos 31 registos atualmente presentes na versão preliminar.

## Entregas principais

- modelo de domínio documentado;
- dicionário de dados;
- schemas JSON Schema 2020-12;
- vocabulários controlados iniciais;
- templates de registo;
- exemplo real e preliminar de mapeamento do item `MM202601`;
- regras de integridade e publicação;
- skills para catalogação, validação, revisão, tradução e direitos;
- specs do domínio de dados;
- script de validação sem dependências externas;
- testes básicos;
- prompt de integração e release.

## Limites deste pacote

Este pacote não:

- migra automaticamente os 31 registos de `museum-items.js`;
- altera HTML, CSS, JavaScript ou imagens do protótipo;
- cria uma base de dados;
- configura Supabase, autenticação ou persistência;
- publica novos conteúdos;
- resolve direitos ou consentimentos por inferência;
- traduz os conteúdos existentes;
- cria páginas, mapas ou componentes visuais.

## Instalação

1. Integrar primeiro os Pacotes 01 e 02, ou confirmar que as respetivas decisões já existem no repositório.
2. Descompactar este pacote na raiz do repositório.
3. Executar o conteúdo de `PROMPT_CLAUDE.md` no Claude.
4. Não substituir schemas ou documentação já existentes sem comparação semântica.
5. Executar `node scripts/validate-data-model.mjs`.
6. Executar `node tests/data-model.test.mjs`.
7. Registar o release `releases/PACKAGE_03_v0.1.0.md`.

## Estado das decisões

Não existem pendências bloqueantes para este release. Questões que dependem de infraestrutura futura, autoridades de vocabulário ou decisões editoriais posteriores foram registadas em `docs/data-model/PENDING_DECISIONS.md`.
