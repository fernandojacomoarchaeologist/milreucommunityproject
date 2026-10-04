# Ficheiros para gráfica — CMYK / PDF/X-3

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

## O que são
PDFs **PDF/X-3:2002**, espaço de cor **CMYK (DeviceCMYK)**, 300 dpi, com **sangria 3 mm**, **marcas de corte** e **TrimBox/BleedBox** definidos. Sem fontes não embebidas (o conteúdo é rasterizado a 300 dpi, pelo que não há risco de substituição de tipos de letra).

- `06_A6_frente_PRINTX.pdf` — convite A6 (105×148), face única
- `06_A4_PRINTX.pdf` — A4 (210×297)
- `06_A3_PRINTX.pdf` — A3 (297×420)

## Perfil de cor — IMPORTANTE
A conversão para CMYK usou o **perfil padrão «Generic CMYK Profile»** (ColorSync), declarado no **OutputIntent** do PDF/X. **Não é o perfil final da gráfica.** Antes de imprimir:

1. confirmar com a gráfica o **perfil ICC de produção** (ex.: Coated FOGRA39, PSO Coated, etc.);
2. se diferente, **reconverter** a partir do original (os geradores produzem também **SVG editável** com texto vivo em `../svg/`, que a gráfica pode usar para prepress vetorial com fontes incorporadas);
3. validar uma **prova de cor**.

## SVG editável (incluído nesta pasta)
`06_A6_frente_PRINTX.svg` · `06_A4_PRINTX.svg` · `06_A3_PRINTX.svg` — **SVG editável** com **texto vivo (vetor)** e fotografias embebidas (base64), já com **sangria 3 mm**. Permitem prepress vetorial com fontes incorporadas. Os mesmos ficheiros existem em `../svg/`. As fotografias permanecem raster em qualquer caso.
