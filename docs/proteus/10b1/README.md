<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Pacote 10B.1 — Piloto catalográfico controlado

Versão-alvo: `v0.37.1`  
Pacote anterior obrigatório: `10B`  
Modo: implementação funcional, dados reais mínimos, sem ingestão documental  
Entrega: PR sem merge automático

Este pacote introduz seis registos reais e controlados no catálogo Proteus para validar obras, autores, proveniência, direitos, acesso e páginas públicas. Não cria afirmações históricas, OCR, embeddings, RAG, API ou MCP.

## Preflight bloqueante

1. Confirmar que o PR #46 / Pacote 10B foi integrado no `main` e que o CI está verde.
2. Registar o SHA real, a versão e `currentPackage` encontrados; não inventar nem usar o estado deste pacote como prova.
3. Se o 10B não estiver no `main`, parar sem alterações e relatar o bloqueio.
4. Confirmar árvore limpa e criar branch a partir do `main` atualizado.

## Resultado esperado

- seis obras/fontes catalogadas conforme `data/pilot-records.json`;
- quatro autores/entidades conforme `data/pilot-agents.json`;
- publicação pública apenas de metadados aprovados;
- texto integral apenas ligado externamente quando a abertura estiver comprovada;
- nenhuma cópia dos anexos no repositório ou no build;
- estados editoriais honestos e negação por defeito;
- testes, documentação, ledger e release atualizados para `v0.37.1 / 10B.1`.

Leia primeiro `docs/01-escopo-e-fronteira.md`, depois `PROMPT-CLAUDE.md`.
