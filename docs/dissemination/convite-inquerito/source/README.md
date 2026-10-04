# Fonte de editoração — Item 6 · Convite ao Inquérito Milreu 2026

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **CANONICAL** (pós-arquitetura CTA/QR + HUMAN SPACING PASS). Não regressar aos digitais/layouts antigos. Formatos: **A6 · A4 · A3 · 1080×1350 · 1080×1920.**

## O que regenera
`../final/{svg,print,digital,CMYK_PDFX}` + `_PRANCHA_FINAL.png`. Garante: **QR independente + quiet zone limpa**; identificador 2026 (Archivo caps); **bloco institucional completo no 1080×1350**; **safe-area no 1080×1920**.

## Fonte
- `generators/convite_arte_final.py` — compõe os 5 formatos (SVG texto-vivo + PNG/JPG + PDFs print sangria 3mm).
- `generators/cmyk_pdfx.py` — CMYK PDF/X-3 (A6/A4/A3) — **partilhado com o Item 5** (gera ambos). *(ver nota abaixo)*
- QR: gerado pelo próprio pipeline (vetorial no SVG + raster).

## Assets / fontes
- **Logótipos:** canónico. ✓ · **Fontes:** Fontes: `../../_SOURCES_SHARED/FONTS_MANIFEST.md` · Ambiente: `../../_SOURCES_SHARED/BUILD_ENVIRONMENT.md` (Pillow, numpy, qrcode, reportlab, pikepdf).
- **Imagem de input (⚠️ GAP):** `source/generators/assets/MM202608.png` (**5,3MB**, acervo autorizado) — a **mesma** usada no Item 5 (não duplicar: referência canónica do acervo + preparação documentada).
- **Nota `cmyk_pdfx.py`:** copiado para esta pasta como fonte; cobre Itens 5 e 6 (lê os PNG print de cada peça e escreve os `*_PRINTX.pdf`). Perfil = genérico (ver BUILD_ENVIRONMENT).

## Reprodução verificada (2026-10-03)
Digitais 1080×1350 e 1080×1920 regenerados = **SHA-256 idêntico** aos de `main`. Prints A6/A4/A3 + CMYK correspondem (geometria/visual).

## Estado / gates
FINAL ART. Gates: **CMYK gráfica** + **teste físico do QR**.
