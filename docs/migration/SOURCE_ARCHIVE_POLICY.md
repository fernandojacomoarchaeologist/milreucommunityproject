---
title: "Política para o arquivo da fonte legada"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Política do arquivo legado

A versão preliminar deve ser preservada como material de proveniência.

## Recomendações

- manter uma cópia imutável do ZIP original fora do diretório publicado;
- registar checksum do ZIP e de `museum-items.js`;
- manter `legacy/museum-v1/` apenas quando a integração do repositório estiver aprovada;
- nunca editar o snapshot;
- qualquer correção deve ocorrer nos novos registos e gerar revisão;
- excluir `__MACOSX` e `.DS_Store` da versão ativa, sem os confundir com alteração do acervo.
