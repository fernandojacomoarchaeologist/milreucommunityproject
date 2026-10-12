# Item 12 — Poster de Congresso 2 (adaptação editorial 2026)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md` (direitos de terceiros preservados).

Adaptação **mínima** de um poster académico **aprovado** (`Milreu - Proposta de Trabalho-8.psd`, 1200×1700, RGB) ao ciclo de 2026. O corpo do poster **não** foi redesenhado nem convertido ao Design System actual: apenas se aplicou uma **escala uniforme** (proporção preservada) para abrir espaço, dentro do próprio formato, a um **rodapé 2026 discreto**.

## Decisão
- **Opção C (strip mínimo)** — escolhida pelo responsável.
- Final em **SVG** (texto vivo editável), conforme as outras peças de disseminação.

## Ficheiros
- `final/poster_congresso2_C.svg` — entregável editável: corpo aprovado **embebido** (raster, resolução nativa 1200×1700) + rodapé em **vetor-texto** (nítido a qualquer dimensão) + logos embebidos (PNG).
- `final/poster_congresso2_C_preview.png` — render de verificação (coordenadas idênticas ao SVG).
- `final/poster_congresso2_C_sangria3mm.svg` — o mesmo SVG com **sangria de 3 mm** (847×1197,4 mm; corte 841×1191,4 mm = `rect#trim`).
- `final/print/poster_congresso2_C_final.pdf` — final raster (render ×6, 7200×10200 px, ≈218 dpi à largura A0), sem sangria.
- `final/print/poster_congresso2_C_final_sangria3mm.pdf` — idem com sangria 3 mm (MediaBox/BleedBox = sangria; **TrimBox** = corte).
- Os PNG de impressão (`final/print/*.png`, ~20 MB cada) **não são versionados**: regeneram-se com o gerador.
- `source/poster_body.png` — composto do PSD aprovado (corpo, sem rodapé). Fonte do corpo.
- `source/ITEM12_CONTENT_NOTES.md` — diferenças entre o corpo aprovado e a identidade/copy canónica (**INFORMATION ONLY — NOT CHANGED**).
- `source/generators/build_item12_final.py` — gerador (SVG + preview + PDF/PNG de impressão, com e sem sangria).

## Logótipo junto ao título (decisão humana 2026-10-12)
- Logótipo do **Projecto Comunitário de Milreu** (`assets/brand/derived/light/logo-full-colour-transparent@2x.png`, sem alteração de proporção/cor/texto) **sobreposto** na zona livre à esquerda do título, ~165 px de altura em 1200×1700. O corpo legado **não** é editado. Prova aprovada pelo responsável.
- Sangria por extensão: papel à volta; no topo, a faixa cinzenta prolonga-se replicando a linha 0 do corpo.

## Rodapé 2026 (copy canónica)
- Esquerda: **Projecto Comunitário de Milreu** + `MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026`.
- Direita: `APOIO INSTITUCIONAL E PARCERIAS` + faixa canónica de 6 logos (`docs/governance/FAIXA_DE_LOGOS_CANONICA.md`, modo B compacto): Projecto · CCDR · AAMLF · **Junta de Freguesia de Estoi** (entrada 2026-10-12) · trio República+Património+Milreu (indivisível) · UAlg; alturas iguais (30 px), intervalo único 0,6×altura; alinhada à direita (composição aprovada do rodapé).

## Preservação do original
- O PSD original permanece em `~/Downloads/Milreu - Proposta de Trabalho-8.psd` (não versionado); a cópia de trabalho (`ITEM12_Poster_Congresso2_v1.psd`) está fora do repositório.
- **Não** alterar proporção do formato, composição, ordem ou texto do corpo aprovado.

## Pendências / limites
- **Resolução**: o corpo é embebido à resolução nativa do PSD (1200×1700). Não existe master de maior resolução; para impressão de grande formato, confirmar com o responsável se o PSD de origem a maior resolução está disponível.
- **Prepress**: sem CMYK / perfil ICC da gráfica (FASE B não iniciada); fontes não embebidas (regra do projecto). Não declarar *print-ready* sem specs da gráfica.
- **Topo**: no corpo legado o til de «INTEGRAÇÃO» fica a ~1,4 mm do corte (A0) — risco de ser aparado; decidir no PSD.
- **Correcção pendente** no PSD: `(n=385)` → `(532 respostas)` (Acumin); regenerar ao chegar o PNG corrigido.
- Eventual divergência de grafia entre o corpo aprovado («Projeto», AO90) e o rodapé canónico («Projecto», pré-AO90) fica para decisão do responsável — ver `source/ITEM12_CONTENT_NOTES.md`.
