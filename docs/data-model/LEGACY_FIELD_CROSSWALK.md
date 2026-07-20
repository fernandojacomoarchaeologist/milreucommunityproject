---
title: "Correspondência com o modelo legado"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Correspondência com `museum-items.js`

Este documento prepara a migração futura sem a executar.

| Campo legado | Destino proposto | Observação |
|---|---|---|
| `id` | `id` | Preservar. |
| `filename` | `media[].fileName` | Criar ativo e papel adequado. |
| `title` | `title.pt-PT` | Manter texto original para revisão. |
| `titleEn` | `title.en` | Estado inicial nunca superior a `draft` sem revisão. |
| `descriptionShort` | `narratives.shortDescription.pt-PT` | Preservar como preliminar. |
| `descriptionLong` | `narratives.objectiveDescription.pt-PT` | Rever porque pode misturar descrição e interpretação. |
| `year` | `date` | Não usar isoladamente quando houver intervalo ou incerteza. |
| `dateApprox` | `date.display` e normalização | Preservar a formulação original. |
| `period` | `classification.periodLabel` ou extensão | A decidir na migração. |
| `locationSpecific` | `places[].specificLabel` | Avaliar sensibilidade. |
| `locationPublic` | `places[].publicLabel` | Pode ser publicável após revisão. |
| `peoplePublic` | `people[]` e/ou narrativa | Não dividir nomes automaticamente sem revisão. |
| `memoryType` | `classification.primaryType` | Vocabulário ainda aberto. |
| `memoryText` | `narratives.communityNarrative.pt-PT` | Confirmar origem comunitária. |
| `historicalContext` | `narratives.historicalContext.pt-PT` | Exigir fontes. |
| `credit` | `sources[]`, `media[].credit` e proveniência | Pode conter vários conceitos. |
| `rights` | `rightsAndConsent` | Texto legado não equivale a autorização confirmada. |
| `tags` | `classification.tags` | Preservar, normalizar depois. |
| `relatedIds` | `relations[]` | Converter para relações tipadas quando possível. |
| `communityVoices` | `communityVoices[]` | Validar consentimento e fonte. |

Nenhum campo legado deve ser descartado sem relatório de migração.
