# Prepress — FASE B (CMYK / PDF/X-3, perfil genérico INTERINO)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

## Objectivo
Produzir, para cada peça **gráfica** de impressão, a **versão esperada** em **PDF/X-3:2002 / CMYK (DeviceCMYK)** com `TrimBox`/`BleedBox`/`ArtBox` e `OutputIntent`, usando um **perfil CMYK genérico nomeado** («Generic CMYK Profile», ColorSync). **Não é o perfil final da gráfica** — é um interino substituível pelo ICC de produção (ex.: Coated FOGRA39), sem alterar a composição aprovada.

O gerador `faseb_cmyk.py` **extrai o raster já aprovado** de cada PDF RGB de impressão e converte apenas o espaço de cor + metadados de impressão.

## Como correr
```
python3 docs/dissemination/_SOURCES_SHARED/prepress/faseb_cmyk.py .   # PDFs CMYK/X
python3 docs/dissemination/_SOURCES_SHARED/prepress/wrap_svg.py .     # SVG à dimensão de impressão (com sangria)
```
(argumento = raiz do repo; predefinição `.`). Dependências em `BUILD_ENVIRONMENT.md` (Pillow, reportlab, pikepdf). Escreve para `…/CMYK_PDFX/` de cada peça.

### SVG nas pastas de impressão
Cada `CMYK_PDFX/` inclui também o **SVG** correspondente, com a sangria da peça:
- **Convite (Item 6):** SVG **editável** (texto vivo vetor + fotos embebidas), sangria 3 mm.
- **Poster (Item 4) e materiais (Item 5):** SVG = **arte aprovada embebida** à dimensão de impressão (poster **A0 + sangria 5 mm**; flyer/marcador sangria 3 mm). Estas peças foram finalizadas como raster, pelo que o SVG é um contentor dimensionado, **não** vetor-texto editável (`wrap_svg.py`). Para editar texto em vetor, reabrir o gerador da peça.

## Estado por item (gráficos → PDF)
| Item | Peça | CMYK/X | Localização |
|---|---|---|---|
| 4 | Poster A0 (841×1189, sangria 5 mm, ~150 dpi) | ✅ gerado nesta fase | `poster-congresso/print-A0/CMYK_PDFX/` |
| 5 | Flyer A6 + Marcador 59×214 (300 dpi, sangria 3 mm) | ✅ já versionado | `materiais-museu/print/CMYK_PDFX/` |
| 6 | Convite A6/A4/A3 (300 dpi, sangria 3 mm) | ✅ já versionado | `convite-inquerito/final/CMYK_PDFX/` |
| 7 | Dossiê (livreto/print) | ✅ já em CMYK/X no PDF de produção | `dossie-convite/final/…_PRINT.pdf` |

**Não-gráficos / fora da FASE B:** Item 2 (website, sem impressão), Item 8 (template em stand-by), Item 9 (rights gate), orçamento (documento de escritório).

## Perfil de cor — IMPORTANTE
Todos os ficheiros declaram no `OutputIntent`: *«Generic CMYK Profile (perfil padrão INTERINO — substituir pelo ICC da gráfica)»*. Antes de imprimir: confirmar o ICC de produção, **reconverter a partir do original RGB** se diferir, e validar **prova de cor** física.

## Gates ainda abertos (conteúdo, não cor)
- **Poster (Item 4):** a arte aprovada ainda exibe «PROVA VISUAL — QR e formato do congresso por confirmar»; a conversão CMYK está pronta, mas o **QR real e o formato do congresso** permanecem por decidir.
- **Convite (Item 6):** **teste físico de leitura do QR** ainda pendente.
