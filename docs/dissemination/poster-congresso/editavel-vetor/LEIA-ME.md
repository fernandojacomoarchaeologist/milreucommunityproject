# Poster A0 — SVG vetor-texto EDITÁVEL

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

## Ficheiros
- `poster_A0_editavel.svg` — **master** (trim A0 841×1189 mm), **texto vivo** (vetor) + imagens embebidas (base64).
- `poster_A0_editavel_sangria5mm.svg` — o mesmo **com sangria 5 mm** (851×1199 mm): fundo de papel estendido + conteúdo deslocado 5 mm.

Texto editável nas famílias **Fraunces / Spectral / Archivo** (instalar as fontes — ver `_SOURCES_SHARED/FONTS_MANIFEST.md`; não distribuídas).

## Verificação (coincidência com a arte aprovada)
Confirmado **antes de entregar**: a **composição vetorial coincide com a arte aprovada**. Método: o gémeo raster do vetor (`proof/poster_congresso_PROVA_VISUAL_v9.png`) é exatamente o que o finalizador de impressão consome; comparado ao **trim** da arte aprovada (removida a sangria 5 mm) → **texto e layout idênticos**, diferenças **limitadas à compressão JPEG das fotografias** embebidas no PDF de produção (bandas de texto: erro médio 0,3–0,7; diferenças concentradas nas fotos/logótipos). A sangria oficial de impressão foi feita por **replicação de bordo** sobre o raster; aqui a sangria vetorial é por **extensão do papel** (equivalente, por nenhum elemento tocar a margem de corte).

## Notas
- Imagens embebidas **reamostradas a ≤1800 px** no lado maior (portabilidade; plenas à escala do poster). Para produção final, **religar as imagens em resolução plena** se necessário.
- Este SVG é a **fonte de edição**; o ficheiro de produção CMYK permanece o PDF/X em `print-A0/CMYK_PDFX/`.
- O rendering exato do texto depende do motor/fontes do editor (próprio de vetor).

Gerado por `_SOURCES_SHARED/prepress/make_editable_vector.py` (não altera texto/geometria; apenas embebe imagens, corrige `font-weight` duplicado do gerador e, na variante, adiciona a sangria).
