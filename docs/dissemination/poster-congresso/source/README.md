# Fonte de editoração — Item 4 · Poster de congresso (A0 académico)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **CANONICAL.** Pipeline **académico aprovado**. ⚠️ **NÃO usar `../master/` (REJEITADO).**

## O que regenera
`../print-A0/poster_milreu_A0_PRINT_sangria5mm.pdf` (A0 841×1189mm + sangria 5mm + marcas) + `_PREVIEW_poster_A0_print.png`, com **barra canónica de 5 logótipos** + **identificador «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026»** no rodapé.

## Fonte (pipeline, 2 passos)
1. `generators/poster_proof_print.py` — compõe o A0 (trim). Correr com `PPI=150`.
2. `generators/poster_finalize.py` — adiciona sangria 5mm + marcas → PDF print-ready.

## Assets / fontes
- **Logótipos:** `public/media/exhibition/updated/logos/` (canónico). ✓
- **Fontes:** Fraunces/Spectral/Archivo (`~/Library/Fonts/`). Fontes: `../../_SOURCES_SHARED/FONTS_MANIFEST.md` · Ambiente: `../../_SOURCES_SHARED/BUILD_ENVIRONMENT.md` (Pillow, numpy, qrcode, reportlab, pikepdf).
- **Imagens de input (⚠️ GAP de versionamento):** o gerador lê de `source/assets/` (= antigo `proof/assets/`), **ainda não versionado**:
  - `MM202601_procissao.jpg`, `MM202603_pessoas.jpg`, `MM202608_contexto.png`, `MM202608_ctx.jpg` — **acervo autorizado** (project publication);
  - `MM202613_hauschild.png` (**14,7 MB**) — acervo; tamanho elevado;
  - `milreu-hoje.jpg`, `circuito/*.jpg` (oficinas) — **direitos/natureza a confirmar** (representações conceptuais/fotos de referência).
  - **Decisão humana pendente:** versionar (rights + tamanho) ou manter como fonte externa documentada.

## Reprodução verificada (2026-10-03)
Regenerado do pipeline (@150dpi + finalize) = corresponde ao PDF aprovado em `main` (0 colisões; geometria A0+sangria; barra 5 logos + identificador). PDF difere só em metadata.

## Estado / gates
Arte aprovada (rodapé «PROVA VISUAL — QR e formato por confirmar»). Gates: **CMYK/fontes prepress**; **QR final** (URL real); formato do congresso.
