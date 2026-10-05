# Item 12 — Poster de Congresso 2 (adaptação editorial 2026)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md` (direitos de terceiros preservados).

Adaptação **mínima** de um poster académico **aprovado** (`Milreu - Proposta de Trabalho-8.psd`, 1200×1700, RGB) ao ciclo de 2026. O corpo do poster **não** foi redesenhado nem convertido ao Design System actual: apenas se aplicou uma **escala uniforme** (proporção preservada) para abrir espaço, dentro do próprio formato, a um **rodapé 2026 discreto**.

## Decisão
- **Opção C (strip mínimo)** — escolhida pelo responsável.
- Final em **SVG** (texto vivo editável), conforme as outras peças de disseminação.

## Ficheiros
- `final/poster_congresso2_C.svg` — entregável editável: corpo aprovado **embebido** (raster, resolução nativa 1200×1700) + rodapé em **vetor-texto** (nítido a qualquer dimensão) + logos embebidos (PNG).
- `final/poster_congresso2_C_preview.png` — render de verificação (coordenadas idênticas ao SVG).
- `source/poster_body.png` — composto do PSD aprovado (corpo, sem rodapé). Fonte do corpo.
- `source/ITEM12_CONTENT_NOTES.md` — diferenças entre o corpo aprovado e a identidade/copy canónica (**INFORMATION ONLY — NOT CHANGED**).
- `source/generators/build_item12_final.py` — gerador (SVG + preview).

## Rodapé 2026 (copy canónica)
- Esquerda: **Projecto Comunitário de Milreu** + `MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026`.
- Direita: `APOIO INSTITUCIONAL E PARCERIAS` + barra canónica de 5 logos (alturas iguais, trio República+Património+Milreu à largura natural).

## Preservação do original
- O PSD original permanece em `~/Downloads/Milreu - Proposta de Trabalho-8.psd` (não versionado); a cópia de trabalho (`ITEM12_Poster_Congresso2_v1.psd`) está fora do repositório.
- **Não** alterar proporção do formato, composição, ordem ou texto do corpo aprovado.

## Pendências / limites
- **Resolução**: o corpo é embebido à resolução nativa do PSD (1200×1700). Não existe master de maior resolução; para impressão de grande formato, confirmar com o responsável se o PSD de origem a maior resolução está disponível.
- **Prepress**: sem CMYK / perfil ICC da gráfica (FASE B não iniciada); fontes não embebidas (regra do projecto). Não declarar *print-ready* sem specs da gráfica.
- Eventual divergência de grafia entre o corpo aprovado («Projeto», AO90) e o rodapé canónico («Projecto», pré-AO90) fica para decisão do responsável — ver `source/ITEM12_CONTENT_NOTES.md`.
