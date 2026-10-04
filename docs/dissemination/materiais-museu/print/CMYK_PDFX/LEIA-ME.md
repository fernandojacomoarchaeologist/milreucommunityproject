# Ficheiros para gráfica — CMYK / PDF/X-3

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

## O que são
PDFs **PDF/X-3:2002**, espaço de cor **CMYK (DeviceCMYK)**, 300 dpi, com **sangria 3 mm**, **marcas de corte** e **TrimBox/BleedBox** definidos. Sem fontes não embebidas (conteúdo rasterizado a 300 dpi).

- `flyer_a6_front_PRINTX.pdf` / `flyer_a6_back_PRINTX.pdf` — Flyer A6 (105×148), frente/verso
- `marcador_59x214_front_PRINTX.pdf` / `marcador_59x214_back_PRINTX.pdf` — Marcador (59×214), frente/verso

## Perfil de cor — IMPORTANTE
Conversão CMYK com o **perfil padrão «Generic CMYK Profile»** (ColorSync), declarado no **OutputIntent**. **Não é o perfil final da gráfica.** Antes de imprimir: confirmar o **perfil ICC de produção** da gráfica (ex.: Coated FOGRA39); se diferente, **reconverter** a partir do original. Validar **prova de cor**.

## SVG (incluído nesta pasta)
`flyer_a6_front_PRINTX.svg` · `flyer_a6_back_PRINTX.svg` · `marcador_59x214_front_PRINTX.svg` · `marcador_59x214_back_PRINTX.svg` — SVG à dimensão exacta de impressão **com sangria 3 mm**, com a **arte aprovada embebida** (base64). Estas peças foram finalizadas como **raster**, pelo que o SVG é um **contentor dimensionado com a imagem aprovada** — **não** é vetor-texto editável. Para texto vetorial com fontes incorporadas, reabrir o gerador (tarefa à parte). As fotografias permanecem raster em qualquer caso.

## Impressão
- Flyer A6: frente + verso (4/4), couché mate sugerido; acabamento a confirmar.
- Marcador 59×214: frente + verso; cartão ≥ 300 g/m²; considerar laminação/arredondamento (a confirmar).
