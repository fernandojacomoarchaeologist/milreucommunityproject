# Item 8 — Divulgação de paragem: os 3 tipos canónicos

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Decisão do responsável (2026-10-14):** cada paragem da exposição itinerante «Entre Ruínas e Memórias» é divulgada por **3 peças canónicas**. **Data e local mudam a cada paragem**; tudo o resto (identidade, composição, créditos, Faixa de Logos) é fixo. Estado do sistema: **v1 — em validação**.

| # | Tipo | Para quê | Gerador | Saída (na pasta do evento) |
|---|---|---|---|---|
| 1 | **Cartaz geral** | impressão (A3/A4) e afixação | `cartaz_impressao.py` (motor `cartaz_gerador.py`, derivado do `../master/`) | `final/` — A3/A4 RGB 300 dpi com sangria 3 mm, previews e `CMYK_PDFX/` (PDF/X-3, perfil genérico interino) |
| 2 | **Animação** | vídeo para feed e stories | `animacao.py` | `animado/` — MP4 1080×1350 e 1080×1920, 30 fps, ~22 s, sem som |
| 3 | **Post de rede social** | Facebook, Instagram e stories | `post_social.py` | `social/` — PNG + JPG 1080×1350 (feed 4:5), 1080×1080 (quadrado) e 1080×1920 (stories) |

**Regras por tipo**
- **Cartaz geral:** é o único com **QR** (para quem está diante do papel). Contém tudo: local, datas, destaque, horário, morada, entrada, acolhimento, Faixa de Logos canónica e a menção do art. 16.º.
- **Animação:** **sem QR**, porque o link vai no texto do post. Composição livre: 4 fotografias do acervo, cada uma com o crédito do índice; texto animado; cartão final com convite ao site.
- **Post social:** **sem QR**, porque o link vai no texto do post. É uma peça **informativa**, com tipografia legível (a 1080 px: corpo ≥ 30 px, rótulos ≥ 19 px). As stories respeitam a zona segura inferior (250 px) da interface.
- **Em todos:**
  - grafia «Projecto Comunitário de Milreu»;
  - identificador «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026»;
  - Faixa de Logos canónica (`docs/governance/FAIXA_DE_LOGOS_CANONICA.md`);
  - «Apoiado pela CCDR Algarve, I.P.»;
  - crédito de cada fotografia;
  - nenhum texto, data ou local fora do `evento.json`.

## Nova paragem (procedimento)
1. Copiar `eventos/<paragem anterior>/evento.json` para `eventos/AAAA-MM-DD_<local>/evento.json`. Só se editam dados **confirmados pelo responsável**: local, morada, datas, destaque, horário, entrada, fotografias e créditos. Nunca se inventam.
2. Se o anfitrião tiver logótipo próprio, usar um ficheiro de `public/media/exhibition/updated/logos/` com proveniência registada.
3. Gerar: `python3 canonico/build_evento.py eventos/AAAA-MM-DD_<local>` (ou só um tipo: `… impressao`, `… animacao`, `… social`).
4. Rever as 3 peças (HUMAN GATE), testar o QR impresso e fazer commit/PR. Registar no handoff do Item 8 (§11) e no ESTADO.

**Dependências:** Pillow e numpy; `qrcode` (`QRPYLIBS`); `pikepdf` + `reportlab` (CMYK); `imageio-ffmpeg` (MP4). As fontes Fraunces, Spectral e Archivo vêm de `~/Library/Fonts/` e não são versionadas.

## Ficheiros
- `evento_lib.py`: lê e valida o `evento.json`, deriva os textos comuns aos 3 tipos e partilha a Faixa de Logos e o aparamento das molduras dos scans.
- `cartaz_gerador.py`: motor do cartaz impresso, derivado do master do Item 8 (o master não foi alterado).
- `cartaz_impressao.py` · `animacao.py` · `post_social.py`: um gerador por tipo.
- `build_evento.py`: gera os 3 tipos de uma vez.
