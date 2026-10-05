<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Modelo de prompt — gerar um cartaz local real (Item 8)

> O master (`master/cartaz_local_generator.py`) está em **STAND BY / TEMPLATE READY**. Para cada **evento/local real**, copiar o bloco abaixo, **preencher com dados CONFIRMADOS** e enviar. A guarda `final=True` **bloqueia** qualquer export que ainda contenha placeholders `[...]` ou a marca de demonstração. Nada é publicado nem versionado sem decisão humana.

## Bloco a copiar e preencher

```
GERAR CARTAZ LOCAL — evento real (final=True)

LOCAL/ANFITRIÃO
- NOME_DO_LOCAL:            «...»            (ex.: Casa das Artes de ...)
- CIDADE_LOCALIDADE:        «...»            (ex.: Loulé · Algarve)
- MORADA:                   «...»            (rua, nº, código postal, localidade)

DATAS/HORÁRIO/ENTRADA
- DATA_INICIO:              «...»            (ex.: 12 de Março de 2026)
- DATA_FIM:                 «...»            (ex.: 27 de Abril de 2026)
- HORARIO:                  «...»            (ex.: Terça a domingo · 10h00–18h00)
- ENTRADA:                  «...»            (ex.: Entrada livre / 2€ / ...)

LOGÓTIPOS DO ANFITRIÃO (opcional)
- LOGOTIPO_ANFITRIAO:       caminho do ficheiro, OU «sem logótipo»
- LOGOS_LOCAIS_ADICIONAIS:  caminho(s), OU «nenhum»
  (ficheiros entregues à parte; não redesenhar; não misturar com a barra canónica de parceiros)

FORMATOS
- FORMATOS:                 A3 e/ou A4
- NOTA_GRÁFICA (se houver): dimensão física / sangria / CMYK exigidos pela gráfica (senão deixar em branco)
```

## Regras (não alterar sem HUMAN GATE)
- **Fixos (não editáveis):** marca «Projecto Comunitário de Milreu», identificador «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026», barra canónica dos 5 parceiros, nome da exposição «Entre Ruínas e Memórias», imagem principal canónica (substituível só com crédito).
- **Dados reais obrigatórios:** sem placeholders `[...]`; sem datas/locais fictícios. Campos desconhecidos → **não inventar**; perguntar ou deixar o evento por confirmar.
- **Logótipo do anfitrião:** entra na caixa «ACOLHIMENTO», **separado** da barra de parceiros; nunca redesenhar nem substituir variantes canónicas.
- **Direitos da imagem principal:** crédito obrigatório (a atual é «Arquivo Nacional da Torre do Tombo — Foto Artística Samorrinha»); substituir só por asset autorizado com crédito.
- **Estado:** enquanto não houver dados confirmados + decisão humana, o cartaz permanece **placeholder** (`_TEMPLATE_*_preview.png`). Só com `final=True` e dados reais se gera o cartaz do evento; só então se decide versionar/exportar.
- **Prepress:** sem especificações da gráfica documentadas, **não** chamar o PDF de print-ready.

## Como processo o pedido
Ao receber o bloco preenchido: valido que não há placeholders, gero A3/A4 reais (`final=True`), mostro prova, e aguardo o teu **HUMAN PASS** antes de qualquer export/versionamento final.
