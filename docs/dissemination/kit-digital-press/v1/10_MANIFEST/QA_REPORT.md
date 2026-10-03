> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 9 — Kit Digital + Press Kit · QA (FASE 1)

**Estado: HUMAN CONTENT/DESIGN PASS / RIGHTS GATE PENDING** (FASE 1 aprovada). Estrutura + textos + previews + QA para validação. **ZIP final e imagens só após HUMAN GATE.** Sem commit de aprovação.
**PROJECT GATE: PASS** (pacote ITEM09; identidade Milreu; sem marcadores estrangeiros; sem checksums no pacote — registado).

## Entregáveis FASE 1 (presentes)
- Estrutura do kit (10 pastas) + `README_KIT.md` + `QUICK_START.md`.
- Textos canónicos: 50/100/250 palavras, bio curta, contactos.
- Press: `NOTA_DE_IMPRENSA_BASE.md` (editável, campos `[ ]`) + preview; **Fact Sheet 1 p.** preview.
- Social: preview **institucional** + preview **local** (derivado do Item 8).
- Web: preview **hero** + proposta (`SPECS_WEB.md`).
- Imagens: `LEGENDAS_E_CREDITOS.csv` (contexto/direitos/**redistribuição**) + `USO_E_DIREITOS.md`.
- Logos: `REGRAS_DE_USO.md` (parceiros vs anfitrião).
- `manifest.json` + `inventory.csv` + este QA.

## QA — verificação dos critérios de rejeição
- Kit **tem** README/Quick Start/manifest/inventory. **OK**
- Copy **coerente** com Itens 5/7 (mesma identidade/descrições canónicas). **OK**
- **Sem claims inventados** (sem visitantes, duração, datas locais, citações, financiamento). **OK**
- Imagens **com contexto/crédito** na CSV. **OK**
- **Redistribuição para PRESS NÃO assumida** — todas as imagens `redistribution_allowed = PENDING`; pastas WEB/PRESS **vazias** até confirmação. **OK**
- **Sem imagens externas/geradas**; só acervo canónico. **OK**
- **Logótipos** canónicos, não deformados; **anfitrião distinto** de parceiro estrutural. **OK**
- Nota de imprensa **com campos editáveis**; Fact Sheet **não inventa** dados. **OK**
- Social **não é miniatura** de impressão (composição digital própria). **OK**
- QR → `https://projectomilreu.pt` (matriz válida; scan físico = gate). **OK**

## Refinamento (HUMAN GATE 2026-10-03) — aplicado
- **Fact Sheet:** corrigida colisão QR/logótipos (rodapé em 2 níveis); contactos, rodapé e logótipos **legíveis a 100 %**; corpos **não reduzidos**.
- **Nota de imprensa:** estrutura e campos variáveis mantidos como texto vivo; sem citações/claims/dados não confirmados.
- **Social local:** mantém **slot do logótipo do anfitrião** (`[LOGÓTIPO DO ANFITRIÃO]`), separado dos parceiros.
- **Web:** proposta mantida; integração no site = **Item 2** (escopo adicional posterior).
- **RIGHTS GATE:** redistribuição deixa de ser estado único → **4 estados** por imagem (`project_official_publication`, `press_editorial_use`, `host_partner_republication`, `generic_third_party_redistribution`), cada um `YES/NO/PENDING` com fonte/condição. Hoje: **project=YES; restantes=PENDING**.
- Previews marcados **`HUMAN GATE · NOT FOR DISTRIBUTION`**.

## Preparação técnica autorizada (sem fechar pacote público)
Pode avançar: textos, templates, manifests, editáveis e **estrutura do ZIP** — mas **não fechar** o pacote público de distribuição com fotografias pendentes. Integração no Item 2 fica fora deste gate.

## HUMAN GATE (bloqueia FASE final / ZIP público com fotos)
1. **Redistribuição de cada imagem por fonte** (Torre do Tombo, páginas comunitárias, etc.) — sem isto, **nenhuma foto** entra em WEB/PRESS/SOCIAL distribuíveis.
2. Aprovação de textos e estrutura.
3. Prova visual das peças.
4. (Posterior) Integração no site — **Item 2**, escopo adicional.
