# Handoff — Item 5 · Flyer + Marcador (+ reconciliação A5)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 5 + «Item 5 reconciliação»).

**O que é.** Materiais de divulgação do Museu «Entre Ruínas e Memórias»: **flyer** (A6) e **marcador de livro** (59×214), frente/verso. **Distinto do Item 6** (convite ao inquérito). Inclui uma **reconciliação A5** posterior (sessão 2026-10-08→12) para alinhar o flyer com o DS actual.

## 1. Local dos arquivos
- **Impressão (versionada, PR #63 + atualização 2026-10-02/03):** `docs/dissemination/materiais-museu/print/` — Flyer A6 (105×148) + Marcador 59×214, F/V, 4 PDFs + PNG F/V + **CMYK PDF/X** (PR #78).
- **SVG editável:** `docs/dissemination/materiais-museu/editavel-vetor/` (⚠️ tem **base64 embebido → não editável** à mão).
- **Reconciliação A5 (sessão 2026-10-08→12, HUMAN GATE, SEM commit):**
  - `docs/dissemination/materiais-museu/reconciliacao/proof/flyer_a5_frente_DEPOIS.png` + `…_verso_DEPOIS.png`
  - `…/reconciliacao/proof/ANTESDEPOIS_frente.jpg` + `ANTESDEPOIS_verso.jpg`
  - `docs/dissemination/materiais-museu/AUDITORIA_RECONCILIACAO_FLYER_A5_v0.1.md`
  - **Gerador:** `docs/dissemination/materiais-museu/source/generators/flyer_a5_reconc_build.py` (versionado).
- **Arte-fonte original v6.x + gerador `scratchpad/item5_build/build.py`** — **não versionados**.

## 2. Pontos mais importantes
- **Flyer + Marcador = FINAL** (v6.4, pós HUMAN SPACING PASS, PR #78). **Gate:** CMYK c/ perfil da gráfica + incorporação de fontes.
- **Reconciliação A5 = HUMAN GATE (fecho aplicado, sem commit).** Prova final F/V a 100%. O **DEPOIS é reconstrução PIL** (o SVG original tem base64, não foi editado).
- **QR real** → `https://projectomilreu.pt` (site verificado ao vivo).
- **Crédito da Festa da Pinha (verso):** **Arquivo Nacional da Torre do Tombo — Foto Artística Samorrinha, J. V. Samorrinha, `PT/TT/SAM/A/001/000016`** (preservar termos TT).
- **Rodapé hierárquico:** «Parceria e acompanhamento: AAMLF · Apoio: CCDR» — **NÃO** «iniciativa da AAMLF».

## 3. Como se estruturou a arte
- **Flyer:** hero **MM202608** preservado; 2.ª linha «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026»; subtítulo «Museu e exposição itinerante…»; **CTA único** (Conheça o museu + site + QR). Verso v6.4 = 4 níveis com respiro (QR em coluna própria); reconc. A5 verso = «O que é» condensado · **1 só foto** (Festa da Pinha) · «No site» sem as 3 barras (bloco empilhado) · «Quer acolher» + 1 QR · rodapé hierárquico + logos.
- **Marcador:** imagem dominante; bloco institucional **condensado**/linha de texto dos nomes (logótipos ficariam ilegíveis a 59 mm) sob «APOIO INSTITUCIONAL E PARCERIAS».
- **Flyer verso** usa a **barra canónica** (5 logos) com margem de segurança ao corte.

## 4. Como se trabalhou ponto a ponto
1. v1…v6 (conceito/arquitectura, vários rejeitados) → **v6.1…v6.4** (ajustes cirúrgicos sobre arquitectura congelada).
2. Técnicas de imagem: remoção de borda branca de scan por fração-branca; `img_topfade`; sky-trim por `rowfrac`.
3. Versões de impressão por **escala uniforme** (A5→A6 = √2; marcador 55×200→59×214 ≈ ×1,07) + sangria 3 mm + marcas.
4. **Reconciliação A5 (2026-10-08→12):** auditoria vs DS → **DEPOIS reconstruído em PIL** (A5 148×210 + 3 mm @200dpi); ANTES renderizado do SVG via **QuickLook** (`qlmanage`). Menor corpo: 5,6 pt (crédito foto) · 6,8 pt (rodapé).

## 5. O que NÃO fazer
- **NÃO** redesenhar do zero a reconciliação (preservar hero, identidade, título, paleta, tipografia).
- **NÃO** dizer «iniciativa da AAMLF» (AAMLF = parceria/acompanhamento; beneficiária administrativa, não autora).
- **NÃO** alterar o crédito/termos da Torre do Tombo.
- **NÃO** pôr logótipos no marcador a 59 mm (ilegíveis — usar texto).
- **NÃO** commitar a reconciliação sem pedido explícito (HUMAN GATE).

## 6. Resultado esperado
Flyer A6 + Marcador prontos para gráfica (CMYK/fontes) e flyer A5 reconciliado coerente com os Itens 7/10/14, mantendo hero e identidade.

## 7. Documentos necessários
`AUDITORIA_RECONCILIACAO_FLYER_A5_v0.1.md`; `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md` (direitos das fotos); «Nota — conjunto canónico de parcerias»; regra `publication-safe-examples`.

## 8. Pendências observadas
- 🟠 **Prepress:** CMYK c/ perfil da gráfica + incorporação de fontes (flyer/marcador).
- 🟠 **Reconciliação A5 sem commit/PR** (HUMAN GATE).
- 🟠 **SVG editável original** não editável (base64) — reconstrução PIL serve de fonte.
- 🟠 **Direitos dos logótipos** a confirmar.

## 9. Dossiê do modo de trabalhar (Item 5)
Arquitectura **congelada** a partir de v6.4; versões de impressão por **escala uniforme** (sem distorção). Reconciliação feita **sem redesenhar** (preservar o aprovado). Créditos de fonte (Torre do Tombo) tratados como invioláveis. Trabalho recente em HUMAN GATE até decisão de commit.

## 10. Onde está cada informação
- **Impressão final:** `docs/dissemination/materiais-museu/print/`.
- **Reconciliação:** `…/reconciliacao/proof/` + `AUDITORIA_RECONCILIACAO_FLYER_A5_v0.1.md` + gerador em `…/source/generators/`.
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 5 + reconc.) + memórias «Disseminação» e da sessão.

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
