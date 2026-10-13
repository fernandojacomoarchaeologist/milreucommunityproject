# Item 8 — Cartaz de evento · Junta de Freguesia de Estoi (30-10 → 06-11-2026)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Estado: FINAL ART (2026-10-13, pedido do responsável) — PRODUCTION GATE PENDENTE** (teste físico do QR · ICC da gráfica, se diferente do genérico · autorização da Junta).

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
**Impressão (ficheiro final para a gráfica)**
- `final/CMYK_PDFX/ITEM8_Estoi_A3_PRINTX_CMYKgenerico.pdf` — **ficheiro a enviar**: PDF/X-3, CMYK «Generic CMYK Profile» (interino), 303×426 mm com TrimBox 297×420 e sangria 3 mm, 300 dpi.
- `final/CMYK_PDFX/ITEM8_Estoi_A4_PRINTX_CMYKgenerico.pdf` — idem A4 (216×303 mm, TrimBox 210×297).
- `final/ITEM8_Estoi_{A3,A4}_PRINT_sangria3mm_300dpi.pdf` — mestres RGB aprovados (para a gráfica converter com o seu ICC, se preferir).
- `final/*_preview.png` — pré-visualizações.

**Online**
- `digital/ITEM8_Estoi_1080x1350.{png,jpg}` — feed (4:5).
- `digital/ITEM8_Estoi_1080x1920.{png,jpg}` — stories / estados (9:16).

**Animado**
- `animado/ITEM8_Estoi_1080x1350_animado.mp4` e `animado/ITEM8_Estoi_1080x1920_animado.mp4` — **v2 (2026-10-13)**: H.264, 30 fps, 21,8 s, sem som, **sem QR** (o link vai no post). Composição livre: 4 fotografias do acervo com transição cruzada e zoom lento — MM202601 (Festa da Pinha, 1909) · MM202608 (Edifício de cultos, c. 1910) · MM202603 (Achados romanos, 1966-67) · MM202613 (Hauschild e equipa, c. 1981) — com texto animado sobre painel chapado (título, local e datas, inauguração 30-10 às 21h00, entrada livre) e **crédito do índice em cada cena**; termina em cartão MARF «Saiba mais e acompanhe a agenda em projectomilreu.pt» + identidade + Faixa de Logos canónica + «Apoiado pela CCDR Algarve, I.P.». Moldura branca dos scans aparada (só a margem).

**Fontes**
- `source/cartaz_evento_generator.py` — gerador derivado do master (campo `DESTAQUE`; «Com o apoio de» só em demo; altura da imagem 0.405 A3 / 0.365 A4 ou `IMG_RATIO`; `IMG_AV`; `IMG_TRIM` apara só a margem do scan; Faixa de Logos canónica).
- `source/build_estoi.py` (impressão RGB) · `source/build_cmyk.py` (PDF/X-3, via `_SOURCES_SHARED/prepress/faseb_cmyk.py`) · `source/build_digital.py` (online) · `source/build_animado.py` (MP4 v2, composição livre).

**Reproduzir:** `QRPYLIBS=<qrcode> ITEM8_DPI=300 python3 source/build_estoi.py` → `PYTHONPATH=<pikepdf,reportlab> python3 source/build_cmyk.py` → `QRPYLIBS=<qrcode> python3 source/build_digital.py` → `PYTHONPATH=<imageio-ffmpeg> python3 source/build_animado.py` (Pillow, numpy; fontes Fraunces/Spectral/Archivo em `~/Library/Fonts/`, não versionadas).

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
- 2026-10-13 · NOVO · **Ficheiro final** (PDF/X-3 CMYK genérico A3/A4), **versão online** (1080×1350 e 1080×1920) e **versão animada** (MP4 14 s, 4:5 e 9:16) gerados a pedido do responsável. Estado → FINAL ART; production gate pendente. · responsável
- 2026-10-13 · ALTERADO · **Vídeo animado v2** (decisão do responsável): sai o QR e a réplica do cartaz; passa a composição livre com 4 fotografias do acervo (MM202601/08/03/13, uso = publicação oficial do projecto, crédito por cena), texto animado e convite final a visitar projectomilreu.pt. · responsável
- 2026-10-13 · PENDENTE · Vídeo animado v2 (e restantes peças do cartaz Estoi) **enviados para validação externa — STAND BY** até retorno. · responsável
