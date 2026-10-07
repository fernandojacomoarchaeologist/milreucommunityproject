> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 10 — Folha de Sala / Guia Breve

**Estado:** **HUMAN DESIGN PASS / FINAL ART READY / PRODUCTION GATE PENDING** (2026-10-07).

Folha A4 frente/verso (não dobrada), PT-PT, **sem fotografia** (decisão editorial — distingue do Flyer/Dossiê/Painéis e reforça a função de orientação). Serve como complemento dos 12 painéis da exposição «Entre Ruínas e Memórias»: identificar a exposição, orientar pelos 12 painéis, enquadrar brevemente o Projecto e continuar a visita no site.

## Conteúdo
- **Frente:** cabeçalho (MUSEU · PROJECTO COMUNITÁRIO DE MILREU + MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026) · título «Entre Ruínas e Memórias» · subtítulo · introdução · COMO PERCORRER · **índice Q1–Q12** (2 colunas) · rodapé.
- **Verso:** O Projecto Comunitário de Milreu · Como foi construído · CONTINUE A VISITA + QR · MSF · Iniciativas 2026 · créditos/parcerias (AAMLF) · direitos · rodapé institucional (logos).

## Pastas
- `final/` — PDFs finais (DIGITAL RGB com links, PRINT RGB com sangria/marcas) + `svg/` (editável).
- `proof/` — previews PNG (frente, verso, prancha) + `svg/` + `_links.json`.
- `source/generators/` — `folha_sala_build.py` (design + SVG + links) e `folha_sala_finalize.py` (PDFs).
- `QA_REPORT.md`, `MANIFEST.json`.

## Fonte de verdade dos títulos Q1–Q12
Sequência editorial de referência **confirmada por decisão HUMAN (2026-10-07)**. Os ficheiros finais dos painéis do Item 1 (841×1800, `PRODUCTION LOCKED`) **não estão versionados no repositório**; a Folha **não altera** o Item 1. Se, na produção física, algum título de painel divergir, prevalece o **painel final de produção** e a Folha deve ser reconciliada.

## Regenerar
```bash
cd docs/dissemination/folha-sala/source/generators
ITEM10_DPI=300 python3 folha_sala_build.py && python3 folha_sala_finalize.py
```
Dependências: fontes DS (`~/Library/Fonts`), logos (`public/media/exhibition/updated/logos`), QR canónico (`docs/dissemination/dossie-convite/final/editaveis/QR_projectomilreu.png`). Sem dependências de scratchpad.

## Gate restante
**FASE B** — prepress/ICC CMYK real da gráfica, se a peça vier a ser produzida fisicamente. O PRINT.pdf actual é **RGB com sangria/marcas** e **não** simula perfil CMYK definitivo.
