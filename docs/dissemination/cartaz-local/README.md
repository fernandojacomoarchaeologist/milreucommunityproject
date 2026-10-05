# Item 8 — Cartaz local (master/template)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Estado: `STAND BY / TEMPLATE READY`.** Isto é um **master/template**, **não** um cartaz final de evento. Nenhum cartaz final é gerado enquanto não houver **local e datas concretos** (decisão humana).

## O que é
Master A3 (com derivação A4) do cartaz de divulgação local da exposição itinerante **«Entre Ruínas e Memórias»**, para espaços de acolhimento. Os campos locais são **editáveis** (placeholders); a composição não se parte com nomes curtos ou longos (auto-fit).

## Enquadramento 2026 (GOV-MSF-2026)
O master inclui, no rodapé institucional, o identificador secundário **«Museus sem Fronteiras · Iniciativas 2026»** (abaixo da assinatura «Projecto Comunitário de Milreu», acima de «Apoio institucional e parcerias»). Assim, quando houver local/data concretos, a versão final **já nasce correcta** com o enquadramento. O identificador **não** é logótipo nem parceiro; não substitui «Entre Ruínas e Memórias».

## Campos editáveis (placeholders)
`[NOME_DO_LOCAL]` · `[CIDADE_LOCALIDADE]` · `[DATA_INICIO]`–`[DATA_FIM]` · `[HORARIO]` · `[MORADA]` · `[ENTRADA]` · `[LOGÓTIPO DO ANFITRIÃO]` · `[LOGOS_LOCAIS_ADICIONAIS]` · `[IMAGEM_PRINCIPAL]` (substituível).

## Ficheiros
- `master/cartaz_local_generator.py` — gerador do master (Design System Milreu; auto-fit; guarda de export final).
- `master/_TEMPLATE_A3_preview.png` · `master/_TEMPLATE_A4_preview.png` — **previews de template** com **dados fictícios de demonstração** (banner «EXEMPLO»). **Não** são cartazes reais.
- `cartaz_local_TEMPLATE_A3.svg` · `cartaz_local_TEMPLATE_A4.svg` — **template SVG** (placeholder): base fixa (imagem + identidade + QR + rodapé institucional) **embebida** como raster, e os **campos locais editáveis em vetor-texto vivo** (placeholders `[ … ]`). Podem ser editados diretamente num editor vetorial **ou** pelo gerador. **Não** são export final de produção (contêm placeholders).
- `master/cartaz_svg.py` — gera os SVG template a partir do gerador. Usa a captura **opt-in** (`SVG_CAPTURE`) que desenha os campos locais invisíveis no raster-base e os recolhe para vetor; **não afeta** a geração normal de PNG (por defeito `SVG_CAPTURE=False`).

## Geração de cartazes reais (quando houver evento)
A pedido do responsável, preencher os campos com **dados confirmados** e gerar as versões finais. A guarda do gerador (`final=True`) **bloqueia** exports finais que ainda contenham placeholders ou marca de demonstração. Nenhum cartaz final é versionado aqui sem decisão humana.

## QA do template
Ver `QA_TEMPLATE.md`.
