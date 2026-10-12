# Handoff — Item 11 · Manual do Expositor

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 11).

**O que é.** **Manual operacional** da exposição itinerante — documento A4 (21 páginas) para o anfitrião: receção → montagem → percurso → danos → check-out → devolução. **MERGED em `main`** (PR #116).

## 1. Local dos arquivos
- **`docs/dissemination/manual-expositor/`**:
  - `proof/MANUAL_DO_EXPOSITOR_Entre_Ruinas_e_Memorias_PROVA.pdf` (prova v3; bookmarks + links + QR).
  - `proof/_PRANCHA_manual.png` + `_manual_meta.json` + crops (`crop_01_capa.png`…`crop_21_anexoG_fecho.png`).
  - `source/generators/` (`manual_build.py` + `manual_finalize.py` — **versionados**).
  - `README.md`, `REFERENCIAS_TECNICAS.md`, `ITEM11_PROPOSTA_INQUERITO_ANFITRIAO.md`, `PENDING_PHYSICAL_VALIDATION.md`, `QA_REPORT_v2.md`, `QA_REPORT_v3.md`.

## 2. Pontos mais importantes
- **Estado: HUMAN CONTENT/DESIGN PASS / PHYSICAL VALIDATION GATE OPEN** — prova v3 APROVADA (conteúdo/arquitectura/DS/legibilidade/operação). **FINAL ART BLOCKED BY PHYSICAL VALIDATION. NÃO é FINAL/DONE.**
- **Kit da exposição:** 12 painéis Q1–Q12 + **6 suportes VEVOR SW-03** (VEVOR × AAMLF tratados **separadamente**).
- **Sem specs inventadas:** carga/espessura/«2 painéis por suporte» = **gate físico**; envelope/armazenamento = PENDING. Não inventar números técnicos.
- Fluxo documental por **`a78190@ualg.pt`**.
- **AAMLF fallback** documentado como contingência de montagem.

## 3. Como se estruturou a arte
A4, DS, operacional, **imprimível / B-W-safe**. Capa · índice clicável · **12 secções** (antes / receber / check-in / armazenamento / montagem VEVOR / percurso / AAMLF fallback / durante / danos / check-out / embalagem / métricas+avaliação) · **anexos A–G imprimíveis** (recepção, ocorrência, avaliação, fecho, etc.).

## 4. Como se trabalhou ponto a ponto
1. Conteúdo operacional redigido sem inventar specs físicas (marcadas como gate).
2. Prova v2 → ajustes → **prova v3 APROVADA** (QA_REPORT_v2/v3).
3. Source reprodutível (`manual_build.py`) + PROPOSTA_INQUERITO (PENDING HUMAN APPROVAL) + PENDING_PHYSICAL_VALIDATION.

## 5. O que NÃO fazer
- **NÃO** marcar FINAL/DONE antes da **validação física** (painéis + suportes VEVOR).
- **NÃO** inventar carga/espessura/«2 painéis por suporte» nem specs de envelope/armazenamento.
- **NÃO** fundir VEVOR e AAMLF (entidades/papéis separados).
- **NÃO** aprovar a PROPOSTA_INQUERITO sem decisão humana.

## 6. Resultado esperado
Manual operacional completo e, após **teste físico** (painéis + suportes) + aprovação + regeneração, FINAL ART para distribuição aos anfitriões.

## 7. Documentos necessários
`REFERENCIAS_TECNICAS.md`, `PENDING_PHYSICAL_VALIDATION.md`, `QA_REPORT_v3.md`, `ITEM11_PROPOSTA_INQUERITO_ANFITRIAO.md`; dados dos suportes VEVOR SW-03.

## 8. Pendências observadas
- 🟠 **Validação física** VEVOR / embalagem / armazenamento (gate que bloqueia FINAL).
- 🟠 **URL/QR do inquérito ao anfitrião** por confirmar.
- 🟠 **PROPOSTA_INQUERITO** aguarda aprovação humana.
- 🟠 Specs técnicas (carga/espessura) por medir fisicamente.

## 9. Dossiê do modo de trabalhar (Item 11)
Documento **operacional**, imprimível e B-W-safe, com anexos de campo. Rigor: tudo o que depende de teste físico fica **explicitamente pendente**, nunca inventado. Source versionado e reprodutível. CONTENT/DESIGN PASS ≠ FINAL enquanto o físico não for validado.

## 10. Onde está cada informação
- **Manual/prova:** `docs/dissemination/manual-expositor/proof/`. **Gerador:** `…/source/generators/`.
- **Specs/pendências:** `REFERENCIAS_TECNICAS.md`, `PENDING_PHYSICAL_VALIDATION.md`.
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 11).

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
- 2026-10-12 · NOVO · 1.ª montagem real da exposição a 10-10-2026 (ao ar livre, estruturas metálicas articuladas em ziguezague). · Fotos `evento1010-*` (Milreudocs; derivados em `docs/relatorio-execucao-ccdr-2026/_private/imagem-eventos/`, EVID-013…017)
- 2026-10-12 · PENDENTE · Confirmar se as estruturas usadas eram **AAMLF** ou **VEVOR SW-03** e se a montagem conta como teste físico do gate (por decisão humana; não inferir).
- 2026-10-12 · RESOLVIDO · As estruturas usadas a 10-10-2026 eram as **da AAMLF** (não VEVOR SW-03) → **não** conta como teste físico VEVOR; gate VEVOR mantém-se aberto. · responsável
- 2026-10-12 · PENDENTE · Decisão transversal vinda do Item 7: a exposição destina-se a **espaços interiores**; em exterior, **máx. 4 horas** com acompanhamento de um responsável do projecto. Integrar no Manual (secções Antes da chegada / Durante a exposição) quando o Manual for regenerado. · responsável · handoff 7 §11
