# Item 1 — Adesivos de correcção dos painéis (2026-10-12)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

Os painéis já impressos não podem ser reimpressos. Duas falhas corrigem-se com **adesivos colados por cima**. Todas as medidas foram tiradas dos PDFs enviados à gráfica (Drive «3- Panels»): 841×1800 mm + 20 mm de sangria, CMYK, sRGB → «Generic CMYK Profile».

## 1. Faixa de logos — `HUMAN APPROVED 2026-10-12`
- **Corrige:** falta do brasão da **Junta de Freguesia de Estoi** e espaçamento desigual (o trio Milreu destoava).
- **Aplica-se a:** Q01 e Q12 (faixa nas mesmas cotas, verificado).
- **Corte:** **841,0 × 87,5 mm**. Com 3 mm de sangria, o ficheiro tem 847,0 × 93,5 mm (300 ppi, CMYK).
- **Colocação:** bordo superior a **1617,6 mm** do topo do painel, 2 mm acima do fio antigo (fio e cabeçalho vêm reimpressos). Lados = bordos do painel. O crédito da gráfica fica visível.
- **Ordem e espaçamento:** segundo `docs/governance/FAIXA_DE_LOGOS_CANONICA.md`. Intervalo único de 25,6 mm, igual ao intervalo interno do trio.
- **Ficheiros:** `print/ADESIVO_FAIXA_LOGOS_841x87.5mm_*` (PDF, preview, medidas por logótipo).
- ⚠️ O trio Milreu fica a ~55 ppi, porque o ficheiro canónico tem só 613×90 px. Pedir a versão oficial em alta resolução.

## 2. Mapa do Q01 — arte gerada (vai por cima da moldura antiga)
- **Corrige:** erro no mapa. O mapa novo já não tem «Serra do Caldeirão» nem «Barrocal algarvio».
- **Moldura impressa:** 382,2 × 445,2 mm.
- **Adesivo (corte):** **386,2 × 449,2 mm**, com 2 mm de cobertura em cada lado. Com sangria de 3 mm: 392,2 × 455,2 mm.
- **Colocação:** canto superior esquerdo a **402,3 mm** da esquerda e **1107,4 mm** do topo do painel.
- **Resolução:** ~74 ppi efectivos, porque o PNG fonte tem 1137 px de largura.
- **Ficheiros de impressão:** **fora do Git** até se registar a autoria/proveniência do mapa. Estão em `print/ADESIVO_Q01_MAPA_*`, localmente; no Git só fica `*_MEDIDAS.txt`.

## Reprodução
```
PYTHONPATH=<pydeps: pikepdf, Pillow, numpy> python3 source/generators/faixa_logos_adesivo_build.py \
  <Q01.pdf> <Q12.pdf> public/media/exhibition/updated/logos print _private/proof
PYTHONPATH=<pydeps> python3 source/generators/q1_mapa_adesivo_build.py \
  <Q01.pdf> "<Mapa de Milreu e Ria Formosa.png>" print _private/proof
```
- Os PDFs dos painéis e o mapa fonte ficam em `_private/inputs/` (gitignored).
- O gerador do mapa verifica o SHA-256 das entradas antes de gerar.

## Material recomendado
- Vinil **mate**, para combinar com o acabamento do painel.
- Pedir à gráfica uma prova de cor do fundo (papel C2 M4 Y7 K0) ao lado do painel antes da tiragem.
