---
title: "Proposta de revisão por campo — MM202609, identificação do local"
version: "0.1.0"
status: "PROPOSTA — aguarda decisão do responsável"
date: "2026-11-16"
copyright: "© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu."
project: "Projecto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md"
---

# Proposta de revisão — MM202609 · identificação do local

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

**Estado:** PROPOSTA. Nada foi alterado em `public/data/`, nos derivados ou nos registos de migração. A aplicação exige: (1) resposta às duas divergências da secção 2; (2) revisão editorial; (3) verificação de direitos (sem impacto esperado: a autorização de publicação não depende do local); (4) decisão de publicação. Por esta ordem (`.claude/rules/08f-three-stage-approval.md`).

**Registo:** MM202609 — «Pessoas em frente ao edifício de cultos» (`public/data/memories.json`, `/records/8`; schema 0.8.0; `editorialStatus: preliminary`; `siteStatus: preview`; `robots: noindex`).
**Origem do pedido:** revisão do responsável, 2026-11-16 — a fotografia foi tirada numa praia (arribas e areia), não nas Ruínas de Milreu. Ligada ao Item 1 (adesivo do Q05; ver `HANDOFF_ITEM_01_paineis.md`).
**Regras:** `museum-revisions.md`, `museum-data-integrity.md`, `content-integrity.md`, `08f-field-level-proposals.md`, `derived-navigation-transparency.md`, `museum-localisation.md`, `legacy-migration-integrity.md`.

## 1. Texto proposto pelo responsável (2026-11-16, recebido no chat)

> **Atualização documental | Fotografia histórica**
> Estado: Identificação em investigação
>
> A fotografia inicialmente apresentada na exposição Entre Ruínas e Memórias com a identificação «Arqueólogos em Milreu» foi integrada a partir de um testemunho oral partilhado pela comunidade.
>
> Uma revisão posterior, enriquecida por novos contributos comunitários, permitiu reconhecer que o cenário fotografado corresponde a uma praia, e não às ruínas romanas de Milreu.
>
> A localização exata, a data, a autoria e a identidade das pessoas retratadas permanecem desconhecidas. A eventual ligação dos participantes à história das investigações arqueológicas de Milreu continua por verificar.
>
> A identificação original permanece preservada no registo documental enquanto testemunho comunitário, distinguindo-se da descrição histórica atualmente sustentada pelas evidências disponíveis.
>
> A legenda da exposição física será atualizada, mantendo-se aberta a investigação sobre a fotografia.

## 2. Divergências com os registos (bloqueiam a aplicação)

| Afirmação do texto | O que os registos dizem | Onde |
|---|---|---|
| A identificação na exposição era «Arqueólogos em Milreu» | A expressão não aparece em nenhum ficheiro do repositório nem do site preliminar. O título é «Pessoas em frente ao edifício de cultos». A legenda do estudo do Q05 era «Pessoas em frente ao edifício de cultos, Milreu (ano desconhecido)». A legenda impressa só se confirma com o PDF do Q05 | `public/data/memories.json`; `data/migration/snapshots/museum-items.legacy.snapshot.json`; estudo do Q05 (Agosto de 2026) |
| A identificação veio de «um testemunho oral partilhado pela comunidade» | A fonte registada é uma publicação na página de Facebook «Aldeia de Estoi — Cultura e Património», gerida por Luís Barriga (`sources[1].type: social-media`). Não há registo de testemunho oral | `sources`, `description.objective` |

Se houver evidência fora do repositório (uma conversa, uma reunião ou uma legenda diferente no painel), registá-la como fonte nova, com tipo e localizador reais, antes de publicar. Caso contrário, sugere-se a redacção da secção 3.

Notas menores, sem bloqueio:
- **Linha «Estado: …»:** o site público não mostra rótulos de processo interno (decisão de 2026-10-13). «Identificação em investigação» descreve o conhecimento sobre a fotografia, não o fluxo editorial. Fica aceitável como frase do texto, sem o rótulo «Estado:».
- **Título «Atualização documental | Fotografia histórica»:** o registo público não tem um campo para notas de actualização. Mostrar um bloco próprio exige spec e componente registado. Proposta: o texto entra nos campos que já existem (secção 4).

## 3. Redacção sugerida (só muda o que contradiz os registos)

> A fotografia foi apresentada na exposição *Entre Ruínas e Memórias* com a identificação «Pessoas em frente ao edifício de cultos», divulgada na página Aldeia de Estoi — Cultura e Património.
>
> Uma revisão posterior, enriquecida por novos contributos comunitários, permitiu reconhecer que o cenário fotografado corresponde a uma praia, e não às Ruínas Romanas de Milreu.
>
> A localização exata, a data, a autoria e a identidade das pessoas retratadas permanecem desconhecidas. A eventual ligação dos participantes à história das investigações arqueológicas de Milreu continua por verificar.
>
> A identificação original fica preservada no registo como parte da história desta fotografia, distinta da descrição que as evidências atuais sustentam. A legenda da exposição física será atualizada; a investigação sobre a fotografia continua aberta.

## 4. Alterações por campo (uma proposta por JSON Pointer, relativo a `/records/8`)

| JSON Pointer | Actual | Proposto |
|---|---|---|
| `/title/pt-PT` | «Pessoas em frente ao edifício de cultos» | **a decidir** — ex.: «Grupo de pessoas numa praia» |
| `/title/en` | «People in front of the cult building» | `null` (o original mudou; sem tradução automática) |
| `/localisationStatus/en` | `draft` | `missing` |
| `/description/short/pt-PT` | «Fotografia de pessoas em frente ao edifício de cultos de Milreu, em ano desconhecido.» | «Fotografia de um grupo de pessoas numa praia, em local e ano desconhecidos. Identificação em investigação.» |
| `/description/objective/pt-PT` | (texto do edifício de cultos) | Parágrafos 2–4 da secção 3 |
| `/description/community/pt-PT` | `null` | Parágrafo 1 da secção 3 (a identificação original, preservada como parte da história da fotografia) |
| `/description/historicalContext/pt-PT` | «A imagem integra o conjunto de registos comunitários em torno do edifício de cultos de Milreu.» | `null` |
| `/places/0/publicLabel/pt-PT` | «Ruínas Romanas de Milreu, Estoi, Faro» | «Local desconhecido (praia)» |
| `/places/0/specificLabel/pt-PT` | «Edifício de cultos de Milreu» | `null` |
| `/places/0/precision` | `area` | `unknown` (valor do vocabulário `common.schema.json`) |
| `/classification/tags` | Milreu · edifício de cultos · Estoi · memória comunitária | **a decidir** — retirar «edifício de cultos»; manter «memória comunitária» |
| `/relations` | MM202602 · MM202605 · MM202608 | **a decidir** — as três assentavam no edifício de cultos. Não alterar relações sem decisão (`derived-navigation-transparency.md`) |
| `/channels/portal/summary/pt-PT`, `/channels/museum/introduction/pt-PT`, `/channels/totem/shortText/pt-PT` | cópias do resumo antigo | igual a `/description/short/pt-PT` (regenerar com `npm run channels:export`) |

Não muda: `media`, `rights`, `sources` (salvo nova fonte da secção 2), `publication`, `editorialStatus` (`preliminary`), `date` (já «Ano desconhecido»). Não se toca no snapshot nem em `data/migration/records/MM202609.preliminary.json`: a revisão gera nova entrada, não sobrescreve.

## 5. Depois da decisão

1. Aplicar os campos em `public/data/memories.json` e regenerar os exports (`npm run channels:export`, índice, JSON-LD) com os validadores.
2. Registar a revisão em `docs/website/decisions/` (antes/depois, decisor, data, motivo).
3. Publicação no site: commit, PR e deploy só com aprovação (HUMAN GATE).
