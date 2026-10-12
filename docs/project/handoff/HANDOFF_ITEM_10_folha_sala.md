# Handoff — Item 10 · Folha de Sala / Guia breve (A4 F/V)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 10).

**O que é.** **Folha de Sala** A4 frente/verso (PT-PT), **complemento aos 12 painéis** do Item 1. DS integral. **MERGED em `main`** (PR #114 + fix #115 + revisão 07b fotografias/2-up, PR #119).

## 1. Local dos arquivos
- **`docs/dissemination/folha-sala/final/`**:
  - `FOLHA_SALA_Entre_Ruinas_e_Memorias_DIGITAL.pdf` (RGB + 4 hyperlinks).
  - `FOLHA_SALA_Entre_Ruinas_e_Memorias_PRINT.pdf` (RGB + sangria 3 mm + marcas; **CMYK não simulado**).
  - `FOLHA_SALA_Entre_Ruinas_e_Memorias_2UP_IMPRESSAO_SIMPLIFICADA.pdf` (A4 paisagem 2-up).
  - `_PRANCHA_2up.png`.
- **`docs/dissemination/folha-sala/source/generators/`**: `folha_sala_build.py` + `folha_sala_finalize.py` (**versionados**).
- **`docs/dissemination/folha-sala/proof/`** + `QA_REPORT` + `MANIFEST`.

## 2. Pontos mais importantes
- **Estado: HUMAN DESIGN PASS / FINAL ART READY / PRODUCTION GATE PENDING.** **NÃO marcar DONE** (falta FASE B = ICC real da gráfica).
- **Revisão 07b (decisão do responsável):** a decisão «sem fotografia» foi **substituída** — passa a incluir **2 fotografias do acervo**: frente **MM202608** (Ruínas/homem+bicicleta); verso **MM202602** (jovens anos 1950). Ambas `project_official_publication=YES`, **sem IA**, com legenda+crédito. (PR #119: removida moldura branca da MM202608 + mostrar homem+bicicleta.)
- **Versão 2-up** (A4 paisagem): Folha 1 = 2×frente, Folha 2 = 2×verso; cortar ao meio → 2 folhas A5; **duplex pela margem CURTA**.
- **Índice Q1–Q12** = sequência de referência (decisão HUMAN); ⚠️ **os painéis finais do Item 1 não estão versionados** — a Folha usa a sequência de referência, não os PDFs dos painéis.

## 3. Como se estruturou a arte
- **Frente:** cabeçalho (MUSEU · PROJECTO + MSF 2026) · título · intro · **COMO PERCORRER** · **índice Q1–Q12** · foto MM202608 · rodapé.
- **Verso:** Projecto · Como foi construído · **CONTINUE + QR canónico** · MSF · **AAMLF (parceiro)** · direitos · rodapé/logos · foto MM202602.
- A4 F/V, DS integral (Fraunces/Spectral/Archivo). Margens **18 mm**; menor corpo **6 pt** (micro-label rodapé). Zero overlap reverificado.

## 4. Como se trabalhou ponto a ponto
1. FASE 1: A4 F/V sem fotografia, índice Q1–Q12, DS integral (PR #114).
2. Fix hyperlink de direitos → `#/direitos` (PR #115).
3. **Revisão 07b:** inserção de 2 fotos do acervo (texto apertado, zero overlap reverificado) + **versão 2-up** de impressão simplificada (PR #119, com fix da moldura da MM202608).

## 5. O que NÃO fazer
- **NÃO** marcar DONE (falta ICC da gráfica).
- **NÃO** usar os PDFs dos painéis do Item 1 (não versionados) — usar a sequência de referência Q1–Q12.
- **NÃO** usar fotos com IA; **NÃO** omitir legenda/crédito.
- **NÃO** alterar a imposição 2-up (duplex margem CURTA).
- **NÃO** reduzir o corpo abaixo de 6 pt.

## 6. Resultado esperado
Folha de Sala A4 F/V (DIGITAL + PRINT + 2-up) pronta para impressão após FASE B (ICC real da gráfica).

## 7. Documentos necessários
`final/QA_REPORT.md`, `MANIFEST`; `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md`; «Nota — conjunto canónico de parcerias».

## 8. Pendências observadas
- 🟠 **FASE B — ICC real da gráfica** (PRINT hoje RGB, CMYK não simulado).
- 🟠 Dependência da sequência de referência Q1–Q12 (painéis do Item 1 não versionados).

## 9. Dossiê do modo de trabalhar (Item 10)
Gerador **versionado** (não só no scratchpad) → reprodutível. Decisão editorial reversível (sem foto → com foto) tratada com nova revisão + reverificação de overlap. Versão de impressão simplificada (2-up) para facilitar produção caseira. FINAL ART READY ≠ DONE.

## 10. Onde está cada informação
- **PDFs:** `docs/dissemination/folha-sala/final/`. **Gerador:** `…/source/generators/`.
- **QA/MANIFEST:** `docs/dissemination/folha-sala/`.
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 10).

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
- 2026-10-12 · NOVO · Folha de Sala impressa **em circulação** a 10-10-2026 (mesa de apoio da exposição, Museu do Traje) — EVID-016 no Item 13. · Fotos `evento1010-*` (Milreudocs; derivados em `docs/relatorio-execucao-ccdr-2026/_private/imagem-eventos/`, EVID-013…017)
- 2026-10-12 · PENDENTE · Gate FASE B (ICC da gráfica) inalterado; n.º de exemplares distribuídos não contado.
