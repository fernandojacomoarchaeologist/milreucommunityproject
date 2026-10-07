> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 10 — Folha de Sala / Guia Breve

**Estado:** **HUMAN DESIGN PASS / FINAL ART READY / PRODUCTION GATE PENDING** (2026-10-07).

Folha A4 frente/verso (não dobrada), PT-PT. Serve como complemento dos 12 painéis da exposição «Entre Ruínas e Memórias»: identificar a exposição, orientar pelos 12 painéis, enquadrar brevemente o Projecto e continuar a visita no site.

> **Atualização 2026-10-07 (decisão do responsável):** a decisão editorial anterior **«sem fotografia» foi substituída** — a Folha passa a incluir **duas fotografias comunitárias** do acervo do Museu, com legenda e crédito, ainda que o texto fique mais apertado. Foi também criada uma **versão de impressão simplificada 2-up** (ver abaixo).

## Fotografias (acervo do Museu)
Ambas `project_official_publication=YES` (cobre a publicação oficial do Projecto — site/museu/exposição); créditos preservados; **sem intervenção de IA**.
- **Frente — MM202608** (Ruínas de Milreu / edifício de cultos, imagem canónica com homem+bicicleta). Recorte enviesado para baixo para mostrar o homem+bicicleta.
- **Verso — MM202602** (jovens junto ao edifício de cultos, anos 1950). Recorte enviesado para cima para manter os rostos.
- **Crédito (ambas):** «Fotografia comunitária · página *Aldeia de Estoi — Cultura e Património* (Luís Barriga)».
- **Direitos:** MM202602 tem **restrição de reutilização genérica** (uso editorial do Projecto). A linha de direitos do verso mantém que fotografias/terceiros conservam os respectivos créditos e condições. Não confere ao Projecto titularidade sobre as fotografias.

## Conteúdo
- **Frente:** cabeçalho (MUSEU · PROJECTO COMUNITÁRIO DE MILREU + MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026) · título «Entre Ruínas e Memórias» · subtítulo · **imagem das Ruínas (MM202608)** + legenda/crédito · introdução · COMO PERCORRER · **índice Q1–Q12** (2 colunas) · rodapé.
- **Verso:** O Projecto Comunitário de Milreu · Como foi construído · **imagem das jovens (MM202602)** + legenda/crédito · CONTINUE A VISITA + QR · MSF · Iniciativas 2026 · créditos/parcerias (AAMLF) · direitos · rodapé institucional (logos).

## Versões finais
1. **DIGITAL** (`..._DIGITAL.pdf`) — RGB A4 F/V, com hyperlinks (site, QR, direitos → `#/direitos`).
2. **PRINT** (`..._PRINT.pdf`) — RGB A4 F/V + **sangria 3 mm + marcas** (Trim/Bleed/Art box). **Duplex: virar na margem LONGA (long-edge).** CMYK/ICC = FASE B.
3. **2-UP IMPRESSÃO SIMPLIFICADA** (`..._2UP_IMPRESSAO_SIMPLIFICADA.pdf`) — **mesma arte, apenas replicada**. A4 **paisagem**, 2 páginas: **Folha 1 = duas cópias da FRENTE**, **Folha 2 = duas cópias do VERSO**; linha de corte ténue ao centro (na margem branca). Imprimir **duplex, virar pela margem CURTA (short-edge)**, e **cortar ao meio** → **duas folhas de sala A5** frente/verso. Redução uniforme A4→A5 (√2), sem distorção; RGB, sem sangria/marcas (impressão doméstica/escritório).

## Pastas
- `final/` — PDFs finais (DIGITAL, PRINT, 2-UP) + `svg/` (editável) + `_PRANCHA_2up.png`.
- `proof/` — previews PNG (frente, verso, prancha) + `svg/` + `_links.json`.
- `source/generators/` — `folha_sala_build.py` (design + SVG + links), `folha_sala_finalize.py` (DIGITAL/PRINT) e `folha_sala_2up.py` (2-up simplificada).
- `QA_REPORT.md`, `MANIFEST.json`.

## Fonte de verdade dos títulos Q1–Q12
Sequência editorial de referência **confirmada por decisão HUMAN (2026-10-07)**. Os ficheiros finais dos painéis do Item 1 (841×1800, `PRODUCTION LOCKED`) **não estão versionados no repositório**; a Folha **não altera** o Item 1. Se, na produção física, algum título de painel divergir, prevalece o **painel final de produção** e a Folha deve ser reconciliada.

## Regenerar
```bash
cd docs/dissemination/folha-sala/source/generators
ITEM10_DPI=300 python3 folha_sala_build.py && python3 folha_sala_finalize.py && python3 folha_sala_2up.py
```
Dependências: fontes DS (`~/Library/Fonts`), logos (`public/media/exhibition/updated/logos`), QR canónico (`docs/dissemination/dossie-convite/final/editaveis/QR_projectomilreu.png`), fotografias do acervo (`public/media/museum/originals/MM202608.jpg` e `MM202602.png`). Sem dependências de scratchpad.

## Gate restante
**FASE B** — prepress/ICC CMYK real da gráfica, se a peça vier a ser produzida fisicamente. O PRINT.pdf actual é **RGB com sangria/marcas** e **não** simula perfil CMYK definitivo.
