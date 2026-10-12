# Handoff — Item 3 · Orçamento de impressora 3D (Circuito Educativo)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 3).

**O que é.** Documento de **consulta de mercado** (NÃO adjudicação) para aquisição de uma **impressora 3D FDM + consumíveis** para o **Circuito Educativo**. A4, 8 páginas.

## 1. Local dos arquivos
- **`docs/procurement/orcamento-impressora-3d/`**:
  - `Orcamento_Impressora_3D_vFinal_2026-10-01.pdf` — **documento final** (versionado, PR #63).
  - `PREVIEW_vFinal_8paginas.png` — preview.
  - `CHECKPOINT_FACTUAL_2026-10-01.md` — base factual (preços medidos, método).
  - `README.md` + `source/README.md`.
- **Gerador:** `scratchpad/orc_vfinal/build.py` (**não versionado** — scratchpad efémero).

## 2. Pontos mais importantes
- **Estado:** `CONSULTA DE MERCADO · VERSÃO FINAL` — o selo «DRAFT» foi **substituído por decisão do responsável** (2026-10-07); dados/preços inalterados.
- **NÃO é adjudicação** — a decisão de compra continua **por registar** (decisão humana).
- **Recomendação documentada (sem adjudicar):** **Adventurer 5M + enclosure = candidata principal**; **Kobra S1 Combo = alternativa técnica**; 5M Pro = fechada de fábrica; A1 Combo = excluída (não cumpre enclosure).
- **Identificação administrativa:** «PROJECTO COMUNITÁRIO DE MILREU / MUSEUS SEM FRONTEIRAS» (GOV-MSF-2026 v3, PR #75).
- **Limite de execução indicado:** 10 de Outubro de 2026.

## 3. Como se estruturou a arte
A4 8 páginas, Design System v0.2 (PIL→PDF): três cotações por modelo (data + método), comparação técnica das configurações, filamentos (4 cores), cenários de custo total, **avaliação/pontuação** das 3 opções, balanço qualitativo. Eyebrow + subtítulo das 2 iniciativas no cabeçalho administrativo.

## 4. Como se trabalhou ponto a ponto
1. Checkpoint factual: preços **MEDIDOS** em retalhistas UE (Amazon.es, Flashforge EU, PcComponentes, 3DJake).
2. Resolução de contradição (loja Anycubic): produto **não entra no carrinho** → marcado indisponível **no checkout**.
3. Rótulos de rigor: **MEDIDO / DOCUMENTADO / INFERIDO**.
4. v2 (6 pág.) → v3 (8 pág., 30-set) → **vFinal** (8 pág., 1-out).
5. STOP GATE do checkpoint **levantado por decisão do responsável**.

## 5. O que NÃO fazer
- **NÃO** transformar a consulta em adjudicação/decisão de compra sem o responsável.
- **NÃO** alterar preços/dados (estão medidos e datados).
- **NÃO** inventar NIF institucional nem portes/totais exactos.
- **NÃO** apresentar a recomendação como decisão final.

## 6. Resultado esperado
Documento de consulta de mercado robusto e rastreável, que suporte uma **decisão humana de aquisição** (ainda não tomada) dentro do prazo (10-out-2026).

## 7. Documentos necessários
`CHECKPOINT_FACTUAL_2026-10-01.md`, `README.md`; regra `.claude/rules/production-foundations.md` (CMYK se for impresso); governação GOV-MSF-2026.

## 8. Pendências observadas
- 🟠 **Adjudicação/compra** (decisão humana) — não registada.
- 🟠 **NIF institucional** (AAMLF/Museu do Lyceu de Faro) por confirmar.
- 🟠 **Portes/totais entregues exactos** por confirmar.
- 🟠 **CMYK gráfica** se o documento vier a ser impresso.

## 9. Dossiê do modo de trabalhar (Item 3)
Rigor factual acima de tudo: cada preço tem data, fonte e método; contradições resolvidas empiricamente (checkout). Recomendação técnica sem usurpar a decisão humana de compra. Selo de estado controlado pelo responsável.

## 10. Onde está cada informação
- **Documento/preview:** `docs/procurement/orcamento-impressora-3d/`.
- **Base factual:** `CHECKPOINT_FACTUAL_2026-10-01.md`.
- **Gerador:** `scratchpad/orc_vfinal/build.py` (efémero).
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 3).

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
