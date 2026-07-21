---
title: "Regra — Integridade da migração legada"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Integridade da migração

Aplicável a `data/migration/**`, `legacy/**` e scripts de migração.

- Não alterar o snapshot.
- Não melhorar silenciosamente o texto legado.
- Não eliminar campos sem relatório.
- Não corrigir relações por inferência.
- Não converter hipóteses em certezas.
- Qualquer transformação precisa de trilho de auditoria.
