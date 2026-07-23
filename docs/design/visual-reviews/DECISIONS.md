---
title: "Decisões da revisão visual"
version: "0.4.0"
status: "internal-preview"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---

# Decisões da revisão visual

Decisões tomadas por Fernando Rodrigues de Jácomo durante a revisão visual. Cada decisão deve indicar o que foi decidido, a razão e a consequência (release alvo, componente afetado).

| Data | Decisão | Razão | Consequência | Release |
|---|---|---|---|---|
| 2026-07-23 | Gate A **aceite para arquitetura** | Fundação visual sólida e coerente com Milreu nos 3 viewports | Elementos passam a `accepted-for-architecture` (não `approved`); permite gerar o Pacote 06 | — |
| 2026-07-23 | **Promover tokens v0.2 a base canónica** da arquitetura | Fundações 05B validadas; evita construir sobre tokens indefinidos | A arquitetura (Pacote 06) consome v0.2 como referência principal; v0.1 preservado como legado; resolve VR-004 | — |
| 2026-07-23 | Logótipo claro/escuro aceite para arquitetura | Variantes limpas, texto correto; proveniência confirmada (ficheiro próprio) | Sai do bloqueio de arquitetura; SVG mestre e `approved` continuam pendentes (VR-003) | — |

## Plano de releases incrementais do Pacote 05D

Correções não criam um Pacote 05E; são releases incrementais do 05D:

- `v0.4.1` — correções técnicas;
- `v0.4.2` — ajustes de cores e tipografia;
- `v0.4.3` — revisão de componentes;
- `v0.4.4` — revisão responsiva;
- `v0.5.0` — Design System aprovado para o primeiro MVP.

## Regra de maturidade

Nenhum componente ou padrão passa a `approved` sem decisão explícita registada aqui pelo responsável.
