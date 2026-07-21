---
title: "Skill — Auditar site legado"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Auditar site legado

## Quando usar
Antes de migrar ou alterar a versão preliminar.

## Procedimento
1. Localizar o diretório legado.
2. Executar `inventory-legacy-site.mjs`.
3. Comparar o fingerprint com o manifesto do Pacote 04.
4. Listar divergências, ficheiros novos, ausentes, duplicados e inconsistências.
5. Parar se `museum-items.js` tiver mudado e a origem da mudança não estiver documentada.
6. Não corrigir ficheiros durante a auditoria.
