> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 10 — Folha de Sala / Guia Breve · QA_REPORT

**Data:** 2026-10-07 · **Estado:** **HUMAN DESIGN PASS / FINAL ART READY / PRODUCTION GATE PENDING**.
**Gate restante:** FASE B — prepress/ICC real da gráfica (só se a peça vier a ser produzida fisicamente). **Não marcar `DONE`** enquanto esse gate não estiver resolvido.

> **Revisão 2026-10-07 (b):** por decisão do responsável, a Folha passou a **incluir duas fotografias** do acervo (frente MM202608 Ruínas/homem+bicicleta; verso MM202602 jovens, anos 1950) e foi criada uma **versão de impressão simplificada 2-up** (A4 paisagem, 2 cópias por folha). Texto apertado (corpos/entrelinhas/intervalos reduzidos) para acomodar as imagens. **Zero sobreposição / zero clipping** reverificado em ambas as páginas (frente: imagem+legenda+índice+rodapé; verso: imagem+caras completas+QR+MSF+créditos+rodapé). Recorte das meninas enviesado para cima (rostos completos) após revisão.

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
| Fotografias do acervo (decisão 2026-10-07) | ✓ **2**: FRENTE MM202608 (Ruínas/homem+bicicleta) · VERSO MM202602 (jovens, anos 1950); ambas `project_official_publication=YES`, **sem IA**, com legenda + crédito |
| Rostos/sujeitos não cortados | ✓ (recorte enviesado: ruínas p/ baixo mostra homem+bicicleta; meninas p/ cima mantém rostos) |
| Créditos das fotografias | ✓ «Fotografia comunitária · página *Aldeia de Estoi — Cultura e Património* (Luís Barriga)»; MM202602 com restrição de reutilização genérica assinalada nos direitos |
| Tipografia DS | ✓ Fraunces (títulos) · Spectral (leitura) · Archivo (metadata/eyebrows/números/labels) |
| Hierarquia Projecto → MSF 2026 → parceiros | ✓ (cabeçalho em 2 linhas + rodapé) |
| Barra de logos canónica | ✓ (5 unidades, dos materiais actuais) |
| Direitos/créditos presentes | ✓ (AAMLF = parceiro institucional e de acompanhamento; nota CC BY 4.0 + terceiros) |
| Outputs reproduzíveis | ✓ (gerador com paths relativos ao repo; sem dependências de scratchpad; fontes de `~/Library/Fonts`, logos/QR versionados no repo) |

## Corpos finais (apertados em 2026-10-07b para acomodar as imagens)
- Título: Fraunces ~31 pt · Subtítulo: Spectral itálico 11,8 pt
- Corpo de leitura: Spectral **11,0 pt** (entrelinha 1,44–1,46) · Índice: números Archivo 11,8 pt / títulos Spectral 11,8 pt
- Legendas das fotografias: Spectral itálico 8,3 pt · crédito: Archivo 6,4 pt (INK3)
- Eyebrows: 8,5 pt · 2.ª linha institucional do cabeçalho: Archivo 7,2 pt (INK5/tracked)
- MSF/AAMLF: 9,3 pt · direitos: 8,8 pt · rodapé: assinatura 9,5 pt · identificador MSF **6,8 pt** · «Apoio…» 6 pt
- **Menor corpo presente: 6 pt** (micro-label de rodapé). Menor corpo de **leitura corrida: 8,8 pt** (direitos).

## Outputs finais
- `final/FOLHA_SALA_Entre_Ruinas_e_Memorias_DIGITAL.pdf` — RGB, A4 trim, hyperlinks activos.
- `final/FOLHA_SALA_Entre_Ruinas_e_Memorias_PRINT.pdf` — RGB, A4 + **sangria 3 mm** + **marcas de corte**; MediaBox 216×303 mm, TrimBox 210×297 mm; **sem simular ICC CMYK definitivo** (FASE B).
- `final/FOLHA_SALA_Entre_Ruinas_e_Memorias_2UP_IMPRESSAO_SIMPLIFICADA.pdf` — **impressão simplificada 2-up**: A4 **paisagem**, 2 páginas (Folha 1 = 2×FRENTE · Folha 2 = 2×VERSO); mesma arte replicada, redução uniforme A4→A5 (√2), linha de corte ao centro; RGB, sem sangria/marcas.
- `final/_PRANCHA_2up.png` — pré-visualização das 2 folhas 2-up.
- `final/svg/folha_frente.svg`, `folha_verso.svg` — **SVG vetorial editável** (texto vivo; QR/logos embebidos; fotografias embebidas como raster).
- `proof/folha_frente.png`, `folha_verso.png`, `_PRANCHA_folha.png` — previews (300 dpi).

## Impressão duplex
- **Versão normal (A4 F/V):** folha única A4 — **virar na margem LONGA (long-edge)**. Página 1 = FRENTE, Página 2 = VERSO.
- **Versão 2-up (A4 paisagem):** **virar na margem CURTA (short-edge)** (folha paisagem → mantém o verso ao direito) e **cortar ao meio** → duas folhas de sala A5 frente/verso. Como as duas cópias são idênticas, o alinhamento esquerda/direita é indiferente; só importa que o verso não saia invertido (garantido pela margem curta).

## Reprodutibilidade
`source/generators/folha_sala_build.py` (design + SVG + links) → `proof/`; `source/generators/folha_sala_finalize.py` → `final/`.
Correr: `ITEM10_DPI=300 python3 folha_sala_build.py && python3 folha_sala_finalize.py`.
Dependências: fontes DS em `~/Library/Fonts`; logos em `public/media/exhibition/updated/logos`; QR canónico em `docs/dissemination/dossie-convite/final/editaveis/QR_projectomilreu.png`.
