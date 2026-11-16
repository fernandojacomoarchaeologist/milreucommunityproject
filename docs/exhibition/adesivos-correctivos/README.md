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

## 3. «Imagem relacionada» do Q05 — dois adesivos (2026-11-16, por gerar)
- **Corrige:** a MM202609 impressa no Q05 é uma fotografia de praia, não de Milreu. Decisão do responsável: substituir pela **MM202608** («Edifício de cultos, potencialmente em 1910»), que não está em nenhum painel.
- **Adesivo 1 — fotografia:** só imagem, até ao corte, 2 mm maior que a moldura antiga em cada lado. A sangria de 3 mm também é fotografia. Não tem orla cor de papel.
- **Adesivo 2 — legenda:** tira estreita cor de papel sobre as duas linhas antigas, com a nova legenda na mesma linha de base. Tipografia Archivo Regular 19,1/15,0 pt, calibrada pelas legendas do Q12. A cor vem das letras antigas.
- O papel entre a fotografia e a legenda fica o original do painel.
- **Medidas:** saem do PDF do Q05 no ficheiro `ADESIVOS_Q05_MEDIDAS.txt`, com corte, sangria e colocação de cada peça. Estimativa pela pré-visualização do Drive: fotografia ≈ 738 × 388 mm; legenda ≈ 330 × 24 mm.
- **Ensaio no Q12:** fotografia 736,1 × 304,3 mm e legenda 333,6 × 23,6 mm. PDF à escala 1:1, com TrimBox igual ao corte.
- **Falta:** o PDF do Q05 enviado à gráfica (Drive «3- Panels»). Legenda proposta, por confirmar:
  «Edifício de cultos de Milreu, potencialmente em 1910 · The cult building at Milreu, possibly 1910.» /
  «Fonte: Aldeia de Estoi — Cultura e Património · datação segundo relatos orais.»

## Reprodução
```
PYTHONPATH=<pydeps> python3 source/generators/q05_imagem_relacionada_adesivo_build.py \
  "<05- MILREU_Q05_841x1800_bleed20_CMYK.pdf>" print _private/proof [--sha <sha256 do Q05>]
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
