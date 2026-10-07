> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 10 — Folha de Sala / Guia Breve · QA_REPORT

**Data:** 2026-10-07 · **Estado:** **HUMAN DESIGN PASS / FINAL ART READY / PRODUCTION GATE PENDING**.
**Gate restante:** FASE B — prepress/ICC real da gráfica (só se a peça vier a ser produzida fisicamente). **Não marcar `DONE`** enquanto esse gate não estiver resolvido.

## Formato
- **A4 210 × 297 mm**, frente/verso, **não dobrado**, PT-PT.
- Margens: **18 mm** (todas). DPI dos rasters finais: **300**.

## Verificação (secção 5)
| Critério | Resultado |
|---|---|
| A4 correcto (210×297) | ✓ (DIGITAL MediaBox 595,3×841,9 pt) |
| Margens 18 mm | ✓ |
| Frente/verso na ordem correcta | ✓ (p1 = FRENTE · p2 = VERSO) |
| Nenhum overflow/clipping | ✓ |
| Q1–Q12 completos | ✓ (índice 2 col × 6, número + título) |
| QR funcional + quiet zone | ✓ (34 mm + moldura de respiro; QR canónico `projectomilreu.pt`) |
| URL correcto | ✓ `https://projectomilreu.pt` |
| Hyperlinks do DIGITAL | ✓ **4**: FRENTE rodapé (URL) · VERSO QR · VERSO «projectomilreu.pt» (CTA) · VERSO URL de direitos. **Sem e-mails** (não se criou link novo). |
| Nenhuma fotografia | ✓ (decisão editorial) |
| Tipografia DS | ✓ Fraunces (títulos) · Spectral (leitura) · Archivo (metadata/eyebrows/números/labels) |
| Hierarquia Projecto → MSF 2026 → parceiros | ✓ (cabeçalho em 2 linhas + rodapé) |
| Barra de logos canónica | ✓ (5 unidades, dos materiais actuais) |
| Direitos/créditos presentes | ✓ (AAMLF = parceiro institucional e de acompanhamento; nota CC BY 4.0 + terceiros) |
| Outputs reproduzíveis | ✓ (gerador com paths relativos ao repo; sem dependências de scratchpad; fontes de `~/Library/Fonts`, logos/QR versionados no repo) |

## Corpos finais
- Título: Fraunces ~34 pt · Subtítulo: Spectral itálico 12,5 pt
- Corpo de leitura: Spectral **11,3 pt** · Índice: números Archivo 12,5 pt / títulos Spectral 12,3 pt
- Eyebrows: 8,5 pt · 2.ª linha institucional do cabeçalho: Archivo 7,2 pt (INK5/tracked)
- MSF/AAMLF: 9,5 pt · direitos: 9 pt · rodapé: assinatura 9,5 pt · identificador MSF **6,8 pt** · «Apoio…» 6 pt
- **Menor corpo presente: 6 pt** («Apoio institucional e parcerias», micro-label de rodapé). Menor corpo de **leitura: 9 pt**.

## Outputs finais
- `final/FOLHA_SALA_Entre_Ruinas_e_Memorias_DIGITAL.pdf` — RGB, A4 trim, hyperlinks activos.
- `final/FOLHA_SALA_Entre_Ruinas_e_Memorias_PRINT.pdf` — RGB, A4 + **sangria 3 mm** + **marcas de corte**; MediaBox 216×303 mm, TrimBox 210×297 mm; **sem simular ICC CMYK definitivo** (FASE B).
- `final/svg/folha_frente.svg`, `folha_verso.svg` — **SVG vetorial editável** (texto vivo; QR/logos embebidos).
- `proof/folha_frente.png`, `folha_verso.png`, `_PRANCHA_folha.png` — previews (300 dpi).

## Impressão duplex
Folha única A4, frente/verso: **virar na margem LONGA (long-edge)**. Página 1 = FRENTE, Página 2 = VERSO.

## Reprodutibilidade
`source/generators/folha_sala_build.py` (design + SVG + links) → `proof/`; `source/generators/folha_sala_finalize.py` → `final/`.
Correr: `ITEM10_DPI=300 python3 folha_sala_build.py && python3 folha_sala_finalize.py`.
Dependências: fontes DS em `~/Library/Fonts`; logos em `public/media/exhibition/updated/logos`; QR canónico em `docs/dissemination/dossie-convite/final/editaveis/QR_projectomilreu.png`.
