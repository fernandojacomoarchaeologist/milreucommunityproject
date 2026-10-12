# Item 8 — Cartaz de evento · Junta de Freguesia de Estoi (31-10 → 06-11-2026)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Estado: HUMAN DESIGN PASS (2026-10-12) — PRODUCTION GATE PENDENTE** (teste físico do QR · prepress da gráfica · logótipo definitivo do anfitrião).

Primeiro cartaz de **evento real** gerado a partir do master do Item 8 (`../../master/`). O master **não foi alterado** (templates aprovados são imutáveis): este evento usa um gerador derivado em `source/`.

## Dados do evento (confirmados pelo responsável, 2026-10-12)
| Campo | Valor |
|---|---|
| Local | Junta de Freguesia de Estoi · Estoi · Faro |
| Datas | 31 de Outubro — 6 de Novembro de 2026 |
| Destaque | Inauguração · sábado, 31 de Outubro · 14h00 |
| Horário | Segunda a sexta · 9h00 – 12h00 e 14h00 – 18h00 · encerrado ao fim-de-semana (excepto inauguração) |
| Morada | Largo Ossónoba · 8005-454 Estoi |
| Entrada | Entrada livre |
| Imagem | **MM202613** «Theodor Hauschild e equipa de escavadores em Milreu», ca. 1981 (`public/media/museum/originals/MM202613.png`, 3508×2481 px) |
| Crédito | Coleção de Maria de Lurdes Mendes Martins; fotografia providenciada por Celeste Pimenta e Branca Pimenta (índice do Museu) |
| Anfitrião | `assets/Logo_Estoi.jpeg` — ficheiro recebido, **sem alterações** (sha256 `a0788fc3902b4745205a3a4e0179fb8076e1c4cfb048faf137bcfd3d4e40bbde`; fundo branco opaco) |

## Ficheiros
- `final/ITEM8_Estoi_A3_PRINT_sangria3mm_300dpi.pdf` — 303×426 mm (A3 + 3 mm de sangria), RGB, 300 dpi.
- `final/ITEM8_Estoi_A4_PRINT_sangria3mm_300dpi.pdf` — 216×303 mm (A4 + 3 mm de sangria), RGB, 300 dpi.
- `final/*_preview.png` — pré-visualizações para ecrã.
- `source/cartaz_evento_generator.py` — gerador derivado do master (campo `DESTAQUE`; «Com o apoio de» só em demo; altura da imagem 0.405 A3 / 0.365 A4; `IMG_AV`).
- `source/build_estoi.py` — preenche os campos e exporta com guarda `final=True`.

**Reproduzir:** `QRPYLIBS=<dir com o pacote qrcode> ITEM8_DPI=300 python3 source/build_estoi.py` (requer Pillow, numpy, qrcode e as fontes Fraunces/Spectral em `~/Library/Fonts/`, não versionadas).

## Gates de produção (pendentes)
- 🟠 **Logótipo do anfitrião**: versão definitiva/transparente a fornecer (tratada noutra sessão); o JPEG actual mostra um rectângulo branco sobre o painel «Acolhimento».
- 🟠 **Teste físico do QR** (`https://projectomilreu.pt`) em impressão.
- 🟠 **Prepress da gráfica**: perfil CMYK/ICC não aplicado (RGB).

## Registo incremental (append-only)
- 2026-10-12 · DECISÃO · Evento Estoi: local, datas, inauguração (linha de destaque), horário da Junta, entrada livre, morada «Largo Ossónoba · 8005-454 Estoi» confirmados pelo responsável. · responsável
- 2026-10-12 · ALTERADO · Abertura corrigida para **sábado 31-10** (não 30-10). · responsável
- 2026-10-12 · ALTERADO · Imagem principal: MM202601 → **MM202613** (Hauschild e equipa). Fotografias EVID-010/011 (roda de conversas, Abril) consideradas por engano e **descartadas**. · responsável
- 2026-10-12 · DECISÃO · Prova A3/A4 aprovada para commit/PR (HUMAN DESIGN PASS). · responsável
