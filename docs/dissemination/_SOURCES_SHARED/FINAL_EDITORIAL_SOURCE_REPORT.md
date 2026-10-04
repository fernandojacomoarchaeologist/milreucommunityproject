# FINAL_EDITORIAL_SOURCE_REPORT — Fontes de editoração / Production Source Pack · Itens 2–9

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Objectivo:** garantir que cada peça final tem uma **fonte de editoração canónica, versionada e reprodutível**, sem depender de `scratchpad/`, desta conversa ou de conhecimento implícito. **Design, copy, arquitectura, spacing, imagens e hierarquia NÃO foram reabertos.** HUMAN GATE antes do merge.
> **Partilhado:** `FONTS_MANIFEST.md` · `BUILD_ENVIRONMENT.md` · `SOURCES_INVENTORY.sha256`.

## Tabela de fontes (2–9)

| Item | Source canónica (versionada) | Editável | Output reproduzido | Checksum / preflight | Estado | Gates externos |
|---|---|---|---|---|---|---|
| **2 — Website** | `docs/website/editorial-source/README.md` → `src/views/{media-press,visual-identity,portal}.js`, `public/data/{media-assets,brand-assets}.json`, i18n, tokens v0.2 | código (JS/JSON/MD) vivo | páginas `#/imprensa`/`#/identidade` + `/sobre` (build+deploy) | build OK · 641/641 · validate 0 | **MERGED** | HTTPS; tradução EN/ES/FR |
| **3 — Orçamento** | `docs/procurement/orcamento-impressora-3d/source/` (`orcamento_generator.py`) | gerador Python (sem imagens) | `vFinal.pdf` (8pp) + preview | **PNG preview SHA-256 idêntico** ✓ | FINAL | CMYK gráfica + fontes; adjudicação |
| **4 — Poster** | `poster-congresso/source/` (`poster_proof_print.py` + `poster_finalize.py`) | gerador + SVG(proof) + PNG | A0 print sangria5mm + preview | geometria/visual OK (0 colisões) · PDF metadata difere | FINAL (prova visual) | CMYK/fontes; QR final; formato congresso · **GAP de assets** ↓ |
| **5 — Flyer+Marcador** | `materiais-museu/source/` (`flyer_marcador_build.py` + `flyer_marcador_print.py`) + CMYK partilhado | **SVG texto-vivo** + geradores | 4 PRINT + 4 CMYK + preview | PNG editáveis determinísticos OK | FINAL | CMYK gráfica; **GAP de assets** ↓ |
| **6 — Convite** | `convite-inquerito/source/` (`convite_arte_final.py` + `cmyk_pdfx.py`) | **5 SVG masters** texto-vivo | 5 formatos + CMYK + prancha | **digitais 1080×1350/1920 SHA-256 idênticos** ✓ | FINAL ART | CMYK gráfica + **teste físico QR**; **GAP de asset** ↓ |
| **7 — Dossiê** | `dossie-convite/final/editaveis/dossie_generator.py` + `.../final/source/generators/dossie_finalize.py` | raster-native (gerador+copy viva+imagens) | DIGITAL/PRINT/LIVRETO + prancha | **`_PRANCHA` SHA-256 idêntica** ✓ (P4 incl.) | FINAL ART DELIVERED | CMYK/fontes; QR físico; **GAP de asset** ↓ |
| **8 — Template cartaz** | `cartaz-local/master/cartaz_local_generator.py` + `FIELDS_template.json` + `source_README.md` | gerador (inputs 100% canónicos) | template A3/A4 (previews) | **A3 template SHA-256 idêntico** ✓ | TEMPLATE READY / STAND BY | ao gerar evento: prepress + dados confirmados |
| **9 — Kit** | `kit-digital-press/v1/source/` (`kit_previews_build.py`) + copy/manifest vivos | gerador + copy MD/TXT/CSV + manifest/inventory | previews internos (NOT FOR DISTRIBUTION) | previews determinísticos OK | FASE 1 · **RIGHTS GATE PENDING** | fotos press/host/generic PENDING; SVG/PDF logo; CMYK; fontes; ZIP público |

## Reprodução (regra 13)
- **Determinísticos (SHA-256 idêntico ao `main`):** orçamento preview (Item 3), template A3 (Item 8), digitais 1080×1350/1920 (Item 6), `_PRANCHA` do dossiê (Item 7). → reprodução **PASS**.
- **PDFs:** metadata não determinística → comparados por geometria/páginas/dimensões/visual/texto/assets/QR/preflight; **sem diferença visual**. (Nenhum `SOURCE REPRODUCTION MISMATCH`.)
- Os geradores portados preservam a lógica de arte; **só os caminhos** passaram a relativos ao repositório (verificado: sem resíduos de `/Users/...` ou `/private/tmp/...`).

## Gaps — fontes que ainda NÃO podem ser versionadas (decisão humana)
1. **Imagens de input preparadas (acervo) — tamanho/direitos:**
   - Item 5/6: `MM202608.png` (**5,3 MB**), `MM202601-original.jpg`, `MM202603-original.jpg`, `MM202607-original.jpg` — **acervo autorizado** (project publication); não versionadas por tamanho/duplicação.
   - Item 7: `MM202613_hauschild.png` (**14,7 MB**) + acervo preparado partilhado.
   - Item 4: acervo (`MM202601_procissao`, `MM202603_pessoas`, `MM202608_contexto/ctx`) + `MM202613_hauschild.png` (14,7 MB).
   - **Decisão:** versionar (rights OK, custo de tamanho) **ou** manter como fonte externa documentada; hoje residem na árvore de trabalho/`scratchpad` e estão **identificadas com precisão** em cada `source/README.md`.
2. **Item 4 — assets não-acervo (direitos/natureza a confirmar):** `milreu-hoje.jpg`, `circuito/*.jpg` (oficinas) — confirmar autoria/direitos antes de versionar.
3. **Ficheiros de fonte** (Fraunces/Spectral/Archivo) — **não versionados por política/licença**; documentados em `FONTS_MANIFEST.md`.
4. **Dependências pip** (Pillow, numpy, qrcode, reportlab, pikepdf) — instaladas pelo operador (ver `BUILD_ENVIRONMENT.md`), não versionadas.

## CANONICAL / SUPERSEDED / REJECTED (regra 14)
- **CANONICAL:** os geradores em `source/` (+ `editaveis/dossie_generator.py`, `cartaz-local/master/`).
- **REJECTED — não usar:** poster `master/` (retrato rejeitado); previews antigos do convite `v1–v6`; materiais `v3/v5/v6.x`; layouts pré-HUMAN SPACING PASS.
- **SUPERSEDED (histórico):** arte-fonte antiga de disseminação (mantida por rastreabilidade onde existir).

## QA final (regra 15)
- ✅ Nenhum source canónico depende **exclusivamente** de `scratchpad/` (geradores portados para o repo; inputs documentados).
- ✅ Nenhum item depende desta conversa para ser reconstruído (README + inventory + manifest).
- ✅ Nenhum gerador rejeitado é apresentado como fonte (poster `master/` explicitamente marcado REJECTED).
- ✅ Outputs aprovados **visualmente inalterados** (reprodução verificada).
- ✅ Rights gates preservados (Item 9 fotos PENDING; nenhuma ganhou direitos).
- ✅ QR preservados.
- ✅ Testes **641/641** · `validate` **exit 0** · working tree limpo.
