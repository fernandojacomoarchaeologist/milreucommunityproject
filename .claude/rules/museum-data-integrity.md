---
title: "Regra — Integridade dos dados do Museu"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Integridade dos dados do Museu

Aplica-se a `data/**`, `content/museum/**`, `docs/data-model/**` e scripts relacionados.

- Nunca fabricar registos, pessoas, datas, relações, memórias, fontes ou coordenadas.
- Valores desconhecidos devem permanecer `null`, vazios quando o schema permitir, ou com estado explícito de pendência.
- Não converter hipótese em facto.
- Não usar `mixed` como nível de certeza.
- Não apagar incerteza, proveniência ou histórico de revisão para simplificar a interface.
- Não tratar templates ou exemplos como registos publicáveis.
- Não alterar identificadores existentes para os tornar “mais bonitos”.
- Qualquer mudança estrutural requer atualização de schema, documentação e release.
