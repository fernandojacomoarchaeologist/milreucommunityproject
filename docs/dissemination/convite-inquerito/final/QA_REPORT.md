# Item 6 — Convite ao Inquérito Milreu 2026 · ARTE-FINAL + QA técnico

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Estado: ARTE-FINAL (Fase 2).** Composição, tipografia, hierarquia e copy = **aprovadas (v6), inalteradas**. Gerado 2026-10-01. Renderer: `scratchpad/item6_build/arte_final.py`.
>
> **Atualização 2026-10-03 (enquadramento 2026, GOV-MSF-2026):** acrescentado o identificador secundário **«Museus sem Fronteiras · Iniciativas 2026»** no **bloco institucional**, abaixo da assinatura «Projecto Comunitário de Milreu» e acima de «Apoio institucional e parcerias». **CTA «PARTICIPE», QR, URL `pt.surveymonkey.com/r/3CFG2MQ`, chamada e hierarquia preservados.** Barra canónica de 5 logótipos intacta. Não é logótipo nem parceiro.
>
> **Correção de arquitetura + spacing pass (HUMAN SPACING GATE PASS 2026-10-03):** (1) identificador em **Archivo MAIÚSCULAS** (tipografia do sistema), **menor/secundário** face à assinatura — já **não** em itálico; sem a 2.ª linha das iniciativas no rodapé. (2) Bloco institucional **top-anchored**: começa **inteiramente abaixo** do fundo do QR, com **separador** e **espaço real** entre o bloco CTA/QR e o bloco institucional — a **quiet zone do QR fica limpa** (nenhum texto/linha/logo a invade). (3) Página redistribuída (imagem principal ligeiramente menor + espaços anteriores reduzidos) para dar respiro **sem** reduzir fontes/QR/logos; margem safe-area inferior A6≈6 · A4≈17 · A3≈24 mm. 5 formatos + CMYK PDF/X regenerados; A6/A4/A3 validados visualmente.

## Ficheiros entregues
- **SVG editável** (mestre vetorial, grupos separados, texto vivo): `svg/06_A6_frente.svg`, `svg/06_A4.svg`, `svg/06_A3.svg`, `svg/06_1080x1350.svg`, `svg/06_1080x1920.svg`.
- **PDFs print-ready** (sangria 3 mm + marcas de corte, 300 dpi): `print/06_A6_frente_PRINT.pdf`, `print/06_A4_PRINT.pdf`, `print/06_A3_PRINT.pdf`.
- **Digitais**: `digital/06_1080x1350.png` + `.jpg`, `digital/06_1080x1920.png` + `.jpg` (+ SVG editável em `svg/`).
- **Prancha final**: `_PRANCHA_FINAL.png` (todos os formatos).

## Estrutura editável do SVG (grupos nomeados, não achatado)
`image` · `eyebrow` · `headline` · `description` · `context` (só A4/A3/digital) · `qr` · `cta` · `url` · `signature`.
Texto **vivo** (`<text>`), fotografia como `<image>` (JPEG embebido), **QR vetorial** (grupo de `<rect>`, substituível, com `data-qr` = URL).

## Pipeline de impressão — nota honesta (fontes)
Neste ambiente **não existe renderizador SVG→PDF vetorial** (sem libcairo/rsvg/inkscape). Por isso:
- Os **PDFs print são raster 300 dpi** (press-ready; sem risco de substituição de fontes, pois o texto está rasterizado à resolução de impressão).
- Para **PDF vetorial com fontes incorporadas/contornadas**, usar o **SVG mestre** no prepress (abrir em Illustrator/Inkscape/RIP e exportar com fontes embebidas ou em curvas). O SVG mantém o texto vivo e as fontes do Design System (Fraunces/Spectral/Archivo).

## QA técnico — resultado: **PASS**
1. **Dimensões físicas** — A6 1311×1819 px = 111×154 mm (trim 105×148 + 3 mm) · A4 2551×3579 = 216×303 (trim 210×297 + 3 mm) · A3 3579×5031 = 303×426 (trim 297×420 + 3 mm). **OK**
2. **Sangria** — 3 mm em redor (trim + 6 mm) nos três formatos físicos. **OK**
3. **Clipping/overflow** — layout idêntico ao aprovado (v6); limites verificados. **OK**
4. **URL sem quebra** — `pt.surveymonkey.com/r/3CFG2MQ` numa única linha em todos os formatos (A6 470/651 px, A4 806/1395, A3 1146/1945, 1350 451/615, 1920 451/572). **OK**
5. **QR validado digitalmente** — round-trip de matriz: **841/841 módulos coincidem**; codifica `https://pt.surveymonkey.com/r/3CFG2MQ`. **OK**
6. **SVG não achatado** — 8–9 grupos nomeados, 7–9 `<text>` vivos, 1 `<image>`, QR vetorial em todos. **OK**

## HUMAN GATE (não concluído automaticamente)
- **Validação física do QR impresso** (abrir `https://pt.surveymonkey.com/r/3CFG2MQ` a partir de uma impressão real) — permanece decisão/teste humano.
- Conversão CMYK com perfil ICC da gráfica, se exigida, e export vetorial com fontes a partir do SVG.
