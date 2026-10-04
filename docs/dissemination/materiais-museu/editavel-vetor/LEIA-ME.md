# Materiais (flyer + marcador) — SVG vetor-texto EDITÁVEL

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

## Ficheiros (masters editáveis, texto vivo + imagens embebidas)
- `flyer_a5_frente_editavel.svg` · `flyer_a5_verso_editavel.svg` — **master A5** (trim 148×210 mm) **com sangria 3 mm**.
- `marcador_frente_editavel.svg` · `marcador_verso_editavel.svg` — **master do marcador** (trim 55×200 mm) **com sangria 3 mm**.

Texto editável nas famílias **Fraunces / Spectral / Archivo** (instalar as fontes — ver `_SOURCES_SHARED/FONTS_MANIFEST.md`).

## Verificação (coincidência com a arte aprovada) — PIXEL-IDÊNTICA
Confirmado **antes de entregar**, pela prova mais forte: correr o **gerador de impressão canónico** (`materiais-museu/source/generators/flyer_marcador_print.py`) sobre estes masters reproduz os PNG de impressão aprovados **byte-a-byte idênticos** (diferença média 0,0000; máximo 0; nas 4 peças).

A arte **final de impressão** deriva destes masters por **reescala uniforme + sangria 3 mm**:
- Flyer: master A5 (148×210) → **A6 (105×148)**.
- Marcador: master (55×200) → **59×214**.

## Notas
- Imagens embebidas **reamostradas a ≤1800 px** no lado maior (portabilidade). Para produção, o gerador usa as imagens em resolução plena.
- Estes SVG são a **fonte de edição**; os ficheiros de produção CMYK permanecem os PDF/X em `print/CMYK_PDFX/`.
- Editar o texto **no master** e, para o tamanho final, correr o gerador de impressão (a reescala é uniforme).

Gerado por `_SOURCES_SHARED/prepress/make_editable_vector.py` (embebe imagens e corrige `font-weight` duplicado do gerador; não altera texto/geometria).
