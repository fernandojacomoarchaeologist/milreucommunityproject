# Item 1 — Reabertura do painel Q12 · ficha técnica + menção CCDR (2026-10-12)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

**Estado:** `Q12 FINAL — HUMAN APPROVED (prova v3) · por substituir no Drive da gráfica`. Só o **Q12** foi reaberto, por decisão humana; Q01–Q11 continuam fechados. A Gráfica Ossonoba imprimiu Q01–Q06; Q07–Q12 ainda não tinham sido impressos.

## O que mudou no Q12
- A banda «AGRADECIMENTOS · WITH THANKS» do ficheiro enviado tinha um **defeito**: repetia duas vezes a tradução EN da citação de Leandro C Dias e não tinha agradecimentos.
- Foi substituída por **FICHA TÉCNICA · CREDITS**, com três colunas do mesmo peso: Investigação, design e produção — Fernando Rodrigues de Jácomo · Coordenação institucional — Meira Pinto (Associação dos Amigos do Museu do Lyceu de Faro) · Curadoria — Grupo de voluntários do Projecto Comunitário de Milreu.
- Foi acrescentada a menção «**Apoiado pela CCDR Algarve, I.P.** · Supported by CCDR Algarve, I.P.» (art. 16.º).
- Créditos canónicos para as iniciativas de 2026: `docs/governance/IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md` §7.

## Especificação da gráfica (medida nos PDFs do Drive «3- Panels»)
881×1840 mm = **841×1800 de corte + 20 mm de sangria** · TrimBox/BleedBox definidos · um raster **CMYK JPEG 3160×6600 px (~91 ppi)** · `Decode [1 0 …]` · sem OutputIntent.

## Reprodução
```
PYTHONPATH=<pydeps com pikepdf+Pillow+numpy> python3 source/generators/q12_ficha_tecnica_build.py \
  "_private/original/12 - MILREU_Q12_841x1800_bleed20_CMYK.pdf" _private/build [--final]
```
- O original tem de existir localmente; o script recusa-o se o SHA-256 não for `046db67d…e48779c` (hash-gate).
- O script edita **só a banda** y=5484..5878 px e falha se algum píxel fora dela mudar.
- Sem `--final`, a saída leva a marca de água «PROVA».
- Fontes do DS em `~/Library/Fonts/` (Archivo, Spectral; não distribuídas).

## Ficheiros
- `source/generators/q12_ficha_tecnica_build.py` — gerador (versionado).
- `_private/original/` — Q12 original do Drive (**gitignored**: contém fotografias de terceiros).
- `_private/final/12 - MILREU_Q12_841x1800_bleed20_CMYK.pdf` + `.sha256` — arte-final (sha256 `48601014b9297d09b7ade1c00c3ca2cbe8c696bd99edbac3fd379f81c4722c12`; **gitignored**).

## Pendente (responsável)
- Substituir o Q12 no Drive «3- Panels» e avisar a Gráfica Ossonoba antes de imprimirem Q07–Q12.
- Decidir se a menção textual à CCDR é precisa em Q01–Q06, que já estão impressos e só têm o logótipo.
