# Fonte de editoração — Item 7 · Dossiê «Entre Ruínas e Memórias»

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **CANONICAL.** Peça **raster-native** (não há SVG/IDML — não inventar). Fonte = gerador + copy viva + imagens + QR + config + instruções.

## O que regenera
`../DOSSIE_*_{DIGITAL,PRINT,LIVRETO_A4}.pdf` + `_PRANCHA_FINAL.png`, preservando a **P4 final** (enquadramento 2026 + logos integralmente em safe-area).

## Fonte (pipeline, 2 passos)
1. `../editaveis/dossie_generator.py` — compõe as 4 páginas (copy viva, diagramas, imagens, QR) → `../editaveis/previews/`.
2. `generators/dossie_finalize.py` — DIGITAL (RGB+hiperligações), PRINT (CMYK PDF/X-3, sangria+marcas), LIVRETO_A4 (imposição) + QR svg/png.

## Assets / fontes
- **Imagens versionadas:** `../editaveis/imagens/` (MM202601/602/604/608/613) ✓ · derivados `public/media/...generated` (canónico) ✓.
- **Logótipos:** canónico ✓. **Fontes:** Fontes: `../../_SOURCES_SHARED/FONTS_MANIFEST.md` · Ambiente: `../../_SOURCES_SHARED/BUILD_ENVIRONMENT.md`.
- **Gaps:** `../editaveis/assets/` (acervo preparado partilhado, inc. `MM202613_hauschild.png` **14,7MB**) ainda não versionado — ver gap no relatório final.

## Reprodução verificada (2026-10-03)
Gerador versionado = **idêntico** ao usado; `_PRANCHA` regenerada **SHA-256 idêntica** à de `main` (prancha compõe as 4 páginas → P4 idêntica). DIGITAL/PRINT/LIVRETO = geometria/visual correspondem.

## Estado / gates
FINAL ART DELIVERED. Gates: **CMYK/fontes prepress**; teste físico QR.
