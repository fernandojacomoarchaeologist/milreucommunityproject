# Handoff — Item 6 · Convite ao Inquérito Milreu 2026

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 6).

**O que é.** Peça(s) de **conversão** para convidar à participação no **Inquérito Milreu 2026**. URL canónica: **`https://pt.surveymonkey.com/r/3CFG2MQ`**. Marca: **Projecto Comunitário de Milreu** (NÃO «Entre Ruínas e Memórias»). **Distinto do Item 5.** Tudo **single-face**.

## 1. Local dos arquivos
- **`docs/dissemination/convite-inquerito/final/`** (arte-final MERGED, PR #64, commit `3fdc007`/`aa0e018`):
  - `svg/` — 5 SVG editáveis (grupos separados, texto vivo, QR vetorial).
  - `print/` — PDFs **A6/A4/A3** (sangria 3 mm + marcas, 300 dpi raster).
  - `digital/` — PNG+JPG **1080×1350** e **1080×1920**.
  - `CMYK_PDFX/` — PDF/X CMYK.
  - `_PRANCHA_FINAL.png` + `QA_REPORT.md`.
- **`docs/dissemination/convite-inquerito/source/`** (README + generators).
- **Geradores:** `scratchpad/item6_build/build.py` (previews) + `arte_final.py` (dual PIL+SVG @300dpi) — **não versionados**.
- Iterações v1–v6 em `convite-inquerito/v*/`.

## 2. Pontos mais importantes
- **Estado: DONE · PRODUCTION GATE PENDING** (decisão humana 2026-10-01). Git/PR concluído.
- **5 formatos single-face:** A6, A4, A3, 1080×1350, 1080×1920.
- **Copy verbatim do brief** (`ITEM06_CONVITE_INQUERITO_v1`) — **nada inventado** (sem prazo/duração/anonimato/números).
- **QR real** para o SurveyMonkey. **Fotografia MM202608.**
- **Ressalva (decisão humana):** os PDFs raster 300 dpi servem press-ready **mas não são «print-ready definitivo»**; para gráfica, **prioridade ao SVG mestre + prepress** (CMYK/fontes/PDF-X).

## 3. Como se estruturou a arte (linguagem aprovada v6)
- Eyebrow **«INQUÉRITO MILREU 2026»** (vermelho, pequeno, 1 linha).
- Headline **«Milreu também se constrói…»** = **maior texto** (2 linhas).
- Descrição · frase de contexto **só em A4/A3/digital** · **QR grande** (ação; cresce no A4/A3) + **PARTICIPE** + **URL subordinada** · assinatura discreta · imagem full-bleed (homem+bicicleta).
- **Bloco institucional top-anchored:** QR = bloco funcional **independente** com quiet zone limpa; separador + bloco institucional **inteiramente abaixo** do QR; identificador 2026 secundário à assinatura. 1080×1350 = bloco institucional **COMPLETO**; 1080×1920 = safe-area inferior.

## 4. Como se trabalhou ponto a ponto
1. Previews v1 → iterações de layout → **RESET do A6** (rejeitado «ar de cartaz/académico») → A6 **single-sided** (verso eliminado).
2. Propagação da linguagem a A4/A3/digital → ajustes finos → **arte-final v6**.
3. Barra canónica de parcerias adicionada no fundo da frente (A6/A4/A3) + story 1080×1920 (2026-10-02); patch MSF 2026 (PR #77/#82).
4. QA técnico PASS (QR digital 841/841).

## 5. O que NÃO fazer
- **NÃO** inventar prazo/duração/anonimato/números (copy é verbatim).
- **NÃO** usar a marca «Entre Ruínas e Memórias» (este item é do **Projecto**, não do museu).
- **NÃO** fazer verso (tudo single-face).
- **NÃO** tratar os PDFs raster como print-ready definitivo — usar o SVG mestre no prepress.
- **NÃO** comprometer a quiet zone do QR.

## 6. Resultado esperado
Convite multiformato pronto a converter (QR testado fisicamente, prepress CMYK a partir do SVG mestre quando a gráfica exigir).

## 7. Documentos necessários
`final/QA_REPORT.md`; brief `ITEM06_CONVITE_INQUERITO_v1`; «Nota — conjunto canónico de parcerias»; regra `qr-requires-public-domain`.

## 8. Pendências observadas
- 🟠 **Teste físico do QR** numa impressão real.
- 🟠 **Prepress final** — conversão/validação **vetorial e CMYK a partir do SVG mestre**.
- 🟠 **Direitos dos logótipos** a confirmar.

## 9. Dossiê do modo de trabalhar (Item 6)
Peça de conversão com **hierarquia clara** (chamada > QR > URL) e **copy inviolável** (verbatim). Dual PIL+SVG para manter texto vivo e QR vetorial. QR sempre real e com quiet zone. Entregue e mergeado; só faltam gates físicos/prepress.

## 10. Onde está cada informação
- **Arte final:** `docs/dissemination/convite-inquerito/final/` (svg/print/digital/CMYK_PDFX).
- **QA:** `final/QA_REPORT.md`. **Iterações:** `…/v1–v6/`.
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 6).

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
- 2026-10-12 · NOVO · Convite impresso **em circulação** a 10-10-2026 (mesa de apoio da exposição, Museu do Traje) — evidência EVID-016 no Item 13. · Fotos `evento1010-*` (Milreudocs; derivados em `docs/relatorio-execucao-ccdr-2026/_private/imagem-eventos/`, EVID-013…017)
- 2026-10-12 · NOVO · Orientador sugere **alargar o inquérito** via museu de S. Brás e Museu do Lyceu de Faro (Meira Pinto); protocolo de colaboração em conversações. Oportunidade, **não** compromisso. · mensagem privada (`docs/relatorio-execucao-ccdr-2026/_private/contexto/`)
- 2026-10-12 · PENDENTE · Teste físico do QR continua por registar (circulação ≠ teste do QR).
