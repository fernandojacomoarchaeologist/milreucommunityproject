> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 12 — override de tipografia (Acumin → Archivo) · HUMAN DESIGN PASS

**Data:** 2026-10-06 · **Estado:** **RESOLVIDO** — **HUMAN DESIGN PASS / EDITORIAL CONTENT FROZEN**.

## RESOLUÇÃO (decisão HUMAN 2026-10-06) — supersede o gate anterior
O blocker **`FONT REQUIRED / ACUMIN PRO`** foi **superado por decisão humana explícita**: está **autorizada a adopção de Archivo** (fonte sans do Design System) no lugar da Acumin Pro, especificamente para concluir o poster com a tipografia canónica disponível no DS. **Não se aguarda Acumin Pro.**

- Aplicada **só** ao parágrafo que dependia de Acumin (ENQUADRAMENTO / PROBLEMA); **não** se converteu o resto do poster. Preservados: arquitectura, headings, cores, imagens, dimensões, espaçamentos, rodapé e restante conteúdo.
- Correcção factual definitiva: `(n=385)` → **`(532 respostas)`**. Frase: «…iniciada em 2024, baseada em inquérito local **(532 respostas)**, que identificou…».
- Archivo mantém o mais próximo possível peso/corpo/leading/tracking/largura de caixa/alinhamento do parágrafo original (corpo canónico `source/poster_body.png` agora corrigido; original preservado em `poster_body_ORIG_n385.png`).
- **QA:** diferenças **só** no parágrafo (bbox 24,389–541,510); **0 px alterados fora** do parágrafo; reflui em 5 linhas (sem overflow/clipping; 510 vs 543 px do bloco seguinte); nenhuma outra copy mudou; composição inalterada. Prova integral: `final/poster_congresso2_C_preview.png`. Comparação da região: `review/item12/REGIAO_CORRIGIDA_ANTES_DEPOIS.png`.
- Provas em fonte substituta (Helvetica Neue) e o SVG de estado `n=385` foram **removidos** (eram só encaixe/estado intermédio); ficam identificados neste histórico.

**Gate restante: FASE B / PREPRESS** (não iniciado).

---

## HISTÓRICO (gate anterior — superado pela resolução acima; preservado para rastreabilidade)

### Item 12 — CONTENT PASS / FINAL ART PENDING FONT-MATCH

**Estado (anterior):** correcção factual **aprovada no conteúdo**, **arte final pendente de fonte**. **STOP / FONT REQUIRED.**

## Copy final aprovada (conteúdo)
Substituir, no parágrafo ENQUADRAMENTO / PROBLEMA do corpo:

- **Antes:** `(n=385)`
- **Final aprovado:** `(532 respostas)`

Frase final:
> «…investigação académica iniciada em 2024, baseada em inquérito local **(532 respostas)**, que identificou um progressivo distanciamento entre a comunidade de Faro/Estoi e as Ruínas Romanas de Milreu.»

**Regras:** não repetir «2024» no parêntese · não usar `n=385` · não usar `amostra mínima prevista` · não incluir «422 Algarve» neste ponto · **não** alterar mais nada no corpo.

## STOP / FONT REQUIRED
A fonte do corpo é **AcuminPro-Regular** (confirmada no PSD `Milreu - Proposta de Trabalho-8.psd`, camada de texto do parágrafo). **Acumin Pro não está instalada neste ambiente.**

- A alteração definitiva **tem de ser feita no PSD/original** com **Acumin Pro**, preservando do parágrafo original: **família (Acumin Pro)**, **variante/peso (Regular)**, **corpo (~21,3 px no documento 1200×1700)**, **leading (~26 px)**, **tracking** e **alinhamento (esq.)**.
- **Não** substituir por fonte semelhante no ficheiro final. **Não** chamar FINAL a qualquer output com fonte substituta.
- O corpo canónico foi **revertido ao original aprovado** (`source/poster_body.png` == `source/poster_body_ORIG_n385.png`); o final regenerado (`final/poster_congresso2_C.svg/.png`) reflecte o original (ainda com `n=385`) **até** a correcção em Acumin.

## Prova de encaixe (apenas isso)
Uma prova anterior em **Helvetica Neue** demonstrou que a correcção **cabe** (refluía em 5 linhas, sem colisão com o bloco seguinte). Como `(532 respostas)` é **mais curto** que a string testada, o encaixe está garantido *a fortiori*. Essa prova era **só de encaixe** — **não** é fonte final e foi retirada da pasta de revisão para não ser confundida com arte final. **Não** se gera nova prova com substituto até existir Acumin Pro.

## Localização técnica (para o PSD)
- Ficheiro: `~/Downloads/Milreu - Proposta de Trabalho-8.psd` (1200×1700).
- Camada de texto: parágrafo que começa «O Projeto Comunitário de Milreu surge na sequência…», bbox ≈ (24, 389)–(566, 616).
- Cor do texto: ≈ `#1D1E1D`; fundo do bloco: cor chapada `#E8EEE5` (232,238,229).
- Grafia AO90 «Projeto» no corpo aprovado — **preservar** (não harmonizar com a grafia pré-AO90 do rodapé/outros materiais).

## SVG do estado actual exportado (SUPERSEDED / removido)
Exportou-se então o vetor do estado `n=385` (`poster_item12_ESTADO_ACTUAL_n385_NAO_FINAL_...svg`) e provas em Helvetica Neue. **Todos removidos** após a resolução acima (Archivo adoptado como final). O corpo canónico `poster_congresso2_C.svg` passou a conter `(532 respostas)`. Não se gerou PDF CMYK do Item 12 (FASE B pendente).

## Não fazer agora
Não acrescentar Metodologia · não acrescentar referências · não aumentar o rodapé · não iniciar FASE B/prepress.
