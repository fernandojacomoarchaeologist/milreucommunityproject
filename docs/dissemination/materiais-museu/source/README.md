# Fonte de editoração — Item 5 · Flyer A6 + Marcador 59×214

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **CANONICAL** (pós-HUMAN SPACING PASS). Não reutilizar `v1–v6` (rejeitadas). Quatro superfícies: **Flyer frente/verso · Marcador frente/verso.**

## O que regenera
`../print/{flyer_a6_front,flyer_a6_back,marcador_59x214_front,marcador_59x214_back}_PRINT.{png,pdf}` + `CMYK_PDFX/*_PRINTX.pdf` + `_PREVIEW_print.png`. Identificador «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026» (Archivo caps) no bloco institucional.

## Fonte (pipeline, 3 passos)
1. `generators/flyer_marcador_build.py` — compõe as 4 faces (SVG texto-vivo + PNG editáveis) → escreve na própria pasta.
2. `generators/flyer_marcador_print.py` — reescala A5→A6 e 55×200→59×214 + sangria 3mm + marcas → `../print/`.
3. `../../_SOURCES_SHARED/` → CMYK: ver `convite-inquerito/source` (o `cmyk_pdfx` é partilhado 5+6).

## Assets / fontes
- **Logótipos:** canónico. ✓ · **Fontes:** Fontes: `../../_SOURCES_SHARED/FONTS_MANIFEST.md` · Ambiente: `../../_SOURCES_SHARED/BUILD_ENVIRONMENT.md` (Pillow, numpy, qrcode, reportlab, pikepdf).
- **Imagens de input (⚠️ GAP):** `source/generators/assets/` — **acervo autorizado** preparado: `MM202601-original.jpg` (632KB), `MM202603-original.jpg` (328KB), `MM202607-original.jpg` (26KB), `MM202608.png` (**5,3MB**). Derivados do acervo (project publication). Versionar (tamanho) = decisão humana.

## Reprodução verificada (2026-10-03)
PNG editáveis determinísticos regenerados do pipeline = correspondem às versões aprovadas em `main` (print + CMYK). SVGs de texto-vivo preservados.

## Estado / gates
FINAL. Gates: **CMYK c/ perfil da gráfica** + fontes; zona de segurança do marcador na produção; **direitos dos logótipos (a confirmar)**.
