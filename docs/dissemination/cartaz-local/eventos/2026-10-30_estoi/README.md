# Item 8 — Cartaz de evento · Junta de Freguesia de Estoi (30-10 → 06-11-2026)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Estado: REVISÃO 2026-10-13 (data + Faixa de Logos canónica) — AGUARDA HUMAN GATE**; depois, production gate (teste físico do QR · prepress da gráfica).

Primeiro cartaz de **evento real** gerado a partir do master do Item 8 (`../../master/`). O master **não foi alterado** (templates aprovados são imutáveis): este evento usa um gerador derivado em `source/`.

## Dados do evento (confirmados pelo responsável, 2026-10-12)
| Campo | Valor |
|---|---|
| Local | Junta de Freguesia de Estoi · Estoi · Faro |
| Datas | 30 de Outubro — 6 de Novembro de 2026 |
| Destaque | Inauguração · sexta-feira, 30 de Outubro · 21h00 |
| Horário | Segunda a sexta · 9h00 – 12h00 e 14h00 – 18h00 · encerrado ao fim-de-semana |
| Morada | Largo Ossónoba · 8005-454 Estoi |
| Entrada | Entrada livre |
| Imagem | **MM202613** «Theodor Hauschild e equipa de escavadores em Milreu», ca. 1981 (`public/media/museum/originals/MM202613.png`, 3508×2481 px) |
| Crédito | Coleção de Maria de Lurdes Mendes Martins; fotografia providenciada por Celeste Pimenta e Branca Pimenta (índice do Museu) |
| Anfitrião | `public/media/exhibition/updated/logos/logo-junta-freguesia-estoi.png` (ficheiro canónico, transparente; substitui o `Logo_Estoi.jpeg` de fundo branco) |
| Faixa de Logos | canónica (`docs/governance/FAIXA_DE_LOGOS_CANONICA.md`): Projecto · CCDR · AAMLF · **Junta** · trio Milreu · UAlg; modo B (compacta, à esquerda), intervalo único = 0,6 × altura do trio, alturas ópticas §3, numa linha (escala uniforme no A4); cabeçalho «APOIO INSTITUCIONAL E PARCERIAS» (Archivo Bold); menção art. 16.º «Apoiado pela CCDR Algarve, I.P.» |

## Ficheiros
- `final/ITEM8_Estoi_A3_PRINT_sangria3mm_300dpi.pdf` — 303×426 mm (A3 + 3 mm de sangria), RGB, 300 dpi.
- `final/ITEM8_Estoi_A4_PRINT_sangria3mm_300dpi.pdf` — 216×303 mm (A4 + 3 mm de sangria), RGB, 300 dpi.
- `final/*_preview.png` — pré-visualizações para ecrã.
- `source/cartaz_evento_generator.py` — gerador derivado do master (campo `DESTAQUE`; «Com o apoio de» só em demo; altura da imagem 0.405 A3 / 0.365 A4; `IMG_AV`; Faixa de Logos canónica).
- `source/build_estoi.py` — preenche os campos e exporta com guarda `final=True`.

**Reproduzir:** `QRPYLIBS=<dir com o pacote qrcode> ITEM8_DPI=300 python3 source/build_estoi.py` (requer Pillow, numpy, qrcode e as fontes Fraunces/Spectral em `~/Library/Fonts/`, não versionadas).

## Gates de produção (pendentes)
- 🟠 **Autorização da Junta** para uso do brasão: documento por anexar em `PROVENIENCIA.txt` (pendência da Faixa canónica §7).
- 🟠 **Resolução dos logótipos**: trio Milreu só existe a 613×90 px (< 300 ppi à dimensão final) — aviso da Faixa canónica §7.
- 🟠 **Teste físico do QR** (`https://projectomilreu.pt`) em impressão.
- 🟠 **Prepress da gráfica**: perfil CMYK/ICC não aplicado (RGB).

## Registo incremental (append-only)
- 2026-10-12 · DECISÃO · Evento Estoi: local, datas, inauguração (linha de destaque), horário da Junta, entrada livre, morada «Largo Ossónoba · 8005-454 Estoi» confirmados pelo responsável. · responsável
- 2026-10-12 · ALTERADO · Abertura corrigida para **sábado 31-10** (não 30-10). · responsável
- 2026-10-12 · ALTERADO · Imagem principal: MM202601 → **MM202613** (Hauschild e equipa). Fotografias EVID-010/011 (roda de conversas, Abril) consideradas por engano e **descartadas**. · responsável
- 2026-10-12 · DECISÃO · Prova A3/A4 aprovada para commit/PR (HUMAN DESIGN PASS). · responsável
- 2026-10-13 · ALTERADO · **Nova data:** abertura e inauguração **sexta-feira 30-10, 21h00** (exposição 30-10 → 06-11-2026); horário sem a excepção de fim-de-semana; pasta renomeada `2026-10-31_estoi` → `2026-10-30_estoi`. · responsável
- 2026-10-13 · ALTERADO · **Faixa de Logos canónica** aplicada (Junta na posição 4, intervalo único, cabeçalho Archivo, menção art. 16.º); anfitrião passa ao ficheiro canónico transparente; `assets/Logo_Estoi.jpeg` removido (deixou de ser usado). PDFs A3/A4 regenerados. · esta sessão
- 2026-10-13 · PENDENTE · HUMAN GATE da revisão · teste físico do QR · prepress da gráfica · autorização da Junta em `PROVENIENCIA.txt`. · responsável
