# Estado dos itens · Divulgação e produção · Projecto Comunitário de Milreu

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **DOCUMENTO VIVO (canónico de referência) — consultar e atualizar a cada evolução.** Última atualização: **2026-10-02**.
> **Âmbito:** documentação de estado (o que é · o que foi feito · como · histórico · estado da última versão). Cobre os itens 1–7.
> **Método:** baseado em ficheiros do repositório, datas, documentos de decisão e verificações diretas. Estados reportados **tal como registados** — não se infere aprovação onde nenhum ficheiro a declara. Pontos por confirmar estão marcados.

## Resumo — estado dos itens 1–6 (2026-10-02)

| # | Item | O que é | Estado atual |
|---|---|---|---|
| 1 | Painéis da exposição | 12 painéis «Entre Ruínas e Memórias» (totem) | PRINT 841×1800 CMYK gerado; **NÃO é arte-final formal**; conflito **2000 vs 1800** + item T2 por reconciliar |
| 2 | Website | Portal `projectomilreu.pt` (estático) | **LIVE** (HTTP 200), `noindex`; barra de parcerias **canónica PUBLICADA** (PR #66 merged `91485cc`; o PR #65 trazia a lista antiga) — verificado ao vivo (5 logótipos, antigos 404); imagens da exposição do site = local |
| 3 | Orçamento 3D | Consulta de mercado (impressora + filamentos) | **vFinal** commitado (PR #63); **DRAFT, sem adjudicação**; decisão de compra = humana |
| 4 | Poster de congresso | Poster A0 académico | `print-A0` + sangria commitado (PR #63); **gate de impressão aberto** («prova visual»); arte-fonte não versionada |
| 5 | Flyer + Marcador | Materiais do Museu | `print/` (Flyer A6 + Marcador 59×214) commitado (PR #63); **marcador arte-final, flyer ainda prova visual** |
| 6 | Convite ao Inquérito | Peça de conversão (A6/A4/A3/digitais) | **DONE · PRODUCTION GATE** (PR #64 merged `aa0e018`); **barra canónica de parcerias** aplicada (A6/A4/A3 + story); QA técnico **PASS**; pendente **teste físico do QR** + prepress vetorial/CMYK |
| 7 | Dossiê «convite ao convite» | Booklet A5 4 páginas (distribuição inicial PDF) | **FASE 1 — previews** P1–P4 (PNG) atualizados; P4 com **barra canónica de parcerias**; **arte-final/PDF por produzir**; direitos de logótipos por confirmar |

## Nota — directiva de recomposição do bloco institucional (2026-10-02)

Directiva do responsável para **Itens 5, 6 e 7**: o bloco de apoio/parcerias deve ser **recomposto** (não «encaixado no fundo»), **secundário** a título/CTA/QR/site/mensagem, com **estrutura fixa** = *assinatura do projecto* + *subtítulo «Apoio institucional e parcerias»* + *fila/grelha de logótipos*; aumentar espaçamentos sem apertar leading/margens/texto principal. **Marcador:** imagem mantém-se dominante; bloco institucional em **versão condensada com logótipos** (2 filas — 4 logótipos + composição Milreu policromático), não texto. **Item 7:** bloco só na **última página** (fecho editorial). Aplicado em 2026-10-02 (flyer verso, marcador verso, convite A6/A4/A3 + story, dossiê P4).

## Nota — conjunto canónico de parcerias (2026-10-02)

Conjunto **canónico** e ordem (fixado por referência do responsável), aplicado a Itens 4, 5, 6 e 7:

1. **Projecto Comunitário de Milreu** (`logo-projeto-comunitario-milreu.png`)
2. **CCDR Algarve — versão RGB** (`logo-ccdr-algarve.png`; fonte: cultalg.gov.pt / «CCDR Algarve - RGB»)
3. **Associação dos Amigos do Museu do Lyceu de Faro** (`logo-associacao-amigos-museu-lyceu-faro.png`)
4. **Milreu policromático** (`Milreu_policromatico.png`) — composição **indivisível**: República Portuguesa (Cultura, Juventude e Desporto) + Património Cultural, I.P. + Milreu («sempre juntos»)
5. **Universidade do Algarve — completo** (`logo-ualg-completo.png`)

- **Cabeçalho:** «APOIO INSTITUCIONAL E PARCERIAS · INSTITUTIONAL SUPPORT AND PARTNERSHIPS» (bilingue; no marcador 59 mm fica só o texto dos nomes, por legibilidade).
- **Composição:** **alinhada à esquerda**; **espaçamento = 0,6 × altura** (mesma proporção do gap interno do trio do Milreu policromático).
- **Ficheiros canónicos** em `public/media/exhibition/updated/logos/`. Removidos/obsoletos (não reutilizar): `logo-ualg.png` (símbolo só), `logo-museu-lyceu.png`, `logo-republica-portuguesa-cultura.png`, `logo-patrimonio-cultural-DGPC.png`.
- **Direitos:** uso institucional dos logótipos **por confirmar** (`PROVENIENCIA.txt` = «a confirmar»); **não** publicar/distribuir externamente sem confirmação do responsável.

## Nota de fonte-de-verdade (ler primeiro)
- O **Item 1 (exposição)** está versionado em Git desde o início. O **PR #63** (`28bae5e`, 2026-10-01) versionou as **versões de impressão** de disseminação (poster `print-A0/`, materiais `print/`) + o **README/vFinal do orçamento**. O **PR #64** (`aa0e018`, 2026-10-01) versionou a **arte-final do Item 6** (`convite-inquerito/final/`). A **arte-fonte** de disseminação (poster `proof/`, materiais `v6.x`, previews do convite `v1–v6`) e os **geradores em `scratchpad/`** **continuam não versionados** — para essas, o estado assenta em README + datas de ficheiro.
- Site **verificado ao vivo** em 2026-10-01: `https://projectomilreu.pt` responde HTTP 200 (GitHub Pages). Documentos de deployment que digam «não publicado» estão **desatualizados**.

---

## Item 1 — Painéis da exposição «Entre Ruínas e Memórias»

**O que é.** Conjunto de **12 painéis** físicos (formato totem) da exposição itinerante do Museu de Memórias de Milreu. Bilingue (pt-PT/EN), grafia pré-AO90 «Projecto».

**O que foi feito.** 12 painéis Q01–Q12 em nível de estudo; conjunto de impressão **CMYK** gerado a pedido da **Gráfica Ossonoba** (2026-09-29). Decisões de composição aprovadas para Q3 e Q4; reenquadramento de Q8 (transparência de IA) e Q12 (vozes reais da comunidade). Trio institucional de logótipos. MM202617: produção física autorizada **com divulgação explícita de IA**; **QR final proibido**.

**Como foi feito.** Builds em `scratchpad/rebuild_all.py` + builds por painel (`build_q1_v5.py`, `build_q4_v3.py`, `build_q8_v3.py`, `build_q12_v2.py`); SVGs em `docs/exhibition/svg/`; CMYK genérico (não o ICC específico da gráfica); raster ~91 PPI.

**Histórico.** Baseline migrou de **841×2000 → 841×1800** (pedido da gráfica). Produção em `docs/exhibition/PRINT_841x1800_bleed20/` (12 PDFs CMYK + ZIP + contact sheet). Decisões em `docs/exhibition/decisions/` (Q3 `c7a2a58`, Q4 `49a2c49`, direitos/Q8 2026-09-15).

**Estado da última versão.** `PRINT_841x1800_bleed20/` — **não há declaração formal de arte-final**. Contradição por reconciliar: `docs/exhibition/STATUS.md` (15-set) diz **«arte-final = 0/12»** e baseline **2000**; `docs/project/WORK_QUEUE_2026-09.md` (30-set) diz **«produção pronta / gráfica aprovou»** e baseline **1800**. Pendente: item editorial **T2 («edifício de cultos»)** em Q2/Q5/Q10; perfil CMYK ICC da gráfica. *(Único item tracked em Git.)*

---

## Item 2 — Website `projectomilreu.pt`

**O que é.** Portal público do projecto — SPA estática (vanilla JS, routing por hash), servida por **GitHub Pages**.

**O que foi feito.** Correção de **i18n do Museu** (strings de interface em 4 idiomas + aviso explícito de fallback quando falta tradução de conteúdo — sem inventar traduções); formulário público **«Quero expor»** (Edge Function só-email → `a78190@ualg.pt` + `fernando.jacomo@yahoo.com`). Ativação **EN/ES/FR**, nova home, navegação simplificada, agenda de exposições (exemplo de demonstração declarado).

**Como foi feito.** `src/` (`main.js`, `views/`, `lib/i18n.js`, `lib/router.js`); Edge Functions em `supabase/functions/`; build `scripts/build.mjs`; publicação pelo workflow manual `.github/workflows/07d-pages.yml` (confirmação `PUBLISH_TECHNICAL_MVP`).

**Histórico.** PR **#58** (fix do workflow + CNAME), **#59** (idiomas + nova home + fix carrossel), **#60** (agenda de exposições), **#62** (i18n Museu + «Quero expor»). Todos mergeados em `main`.

**Estado da última versão.** **LIVE** em `https://projectomilreu.pt` (verificado HTTP 200), com `noindex` — **lançamento editorial continua com gate humano** (`publicLaunch.approved` por decidir). Pendente: configurar secrets do Supabase + `supabase functions deploy exhibition-proposal-intake` para o email do formulário; **tradução real** dos conteúdos EN/ES/FR (trabalho humano futuro). Nota: falha pré-existente de CI `09C.1` em `main`, por investigar.

---

## Item 3 — Orçamento de impressora 3D (Circuito Educativo)

**O que é.** Documento de **consulta de mercado** (não adjudicação) para aquisição de uma impressora 3D FDM + consumíveis para o Circuito Educativo.

**O que foi feito.** Versão **vFinal (2026-10-01)**, A4, 8 páginas: três cotações por modelo (com data e método), comparação técnica das configurações, filamentos (4 cores), cenários de custo total, **avaliação/pontuação** das 3 opções e balanço qualitativo. Recomendação (sem adjudicação): **Adventurer 5M + enclosure = candidata principal**; **Kobra S1 Combo = alternativa técnica**; 5M Pro = fechada de fábrica; A1 Combo = excluída (não cumpre enclosure).

**Como foi feito.** Renderer `scratchpad/orc_vfinal/build.py` (A4, Design System v0.2, PIL→PDF). Fundamentado no `CHECKPOINT_FACTUAL_2026-10-01.md`; preços **medidos** em retalhistas UE (Amazon.es, Flashforge EU, PcComponentes, 3DJake); contradição da loja Anycubic resolvida **no checkout** (produto não entra no carrinho → indisponível). Rótulos de rigor: MEDIDO / DOCUMENTADO / INFERIDO.

**Histórico.** v2 (6 páginas) → **v3** (8 páginas, 30-set) → **vFinal** (8 páginas, 1-out). O STOP GATE do checkpoint foi **levantado por decisão do responsável** em conversa.

**Estado da última versão.** `Orcamento_Impressora_3D_vFinal_2026-10-01.pdf` — **DRAFT · consulta de mercado, sem adjudicação** (commitado + registado no README, PR #63). Por confirmar: portes/totais entregues exatos, **NIF institucional** (AAMLF/Museu do Lyceu de Faro), e a **decisão de aquisição** (humana). Limite de execução indicado: 10 de Outubro de 2026.

---

## Item 4 — Poster de congresso

**O que é.** Poster **A0** (841×1189 mm, retrato) do Projecto Comunitário de Milreu para apresentação em congresso — direcção **académica, texto-protagonista**.

**O que foi feito.** Poster canónico «fechado» = o **académico** (`vFinal-Academic`): blocos «O Projecto», «Do diagnóstico à intervenção», «Metodologia / O que entendemos por Arqueologia Pública e Comunitária», iniciativa **«Entre Ruínas e Memórias»**, **«Circuito Educativo»** (faixa gráfica **abstrata** — grelha/estratigrafia/tesselas, sem ilustração/IA/ícones), «Desenvolvimento em 2026», «Próximos passos», «Parceria e apoio» + logótipos. Gerada a **versão de impressão A0 + sangria 5 mm** + marcas de corte.

**Como foi feito.** Gerador canónico `scratchpad/poster/proof.py` (PIL dual: SVG editável + PNG). A versão de impressão foi **regenerada do gerador canónico** (idêntica ao `vFinal-Academic`) e envelopada com sangria (replicação de bordo) + marcas, 150 dpi, **sem redesenhar** a composição.

**Histórico.** Muitas iterações com **resets totais** do responsável. **Rejeitadas (não reutilizar como fonte):** v1, `gate3/`, **`master/`** (poster retrato «dois pilares», `master.py`), `reset/`. Linha **canónica** = `proof/` (`proof.py`), v2…v9 → `vFinal-Academic`. ⚠️ **Lição desta sessão:** foi gerado por engano um «banner 80×160» a partir do `master/` **rejeitado** (+ má interpretação de «não alterar proporção»); o responsável corrigiu, o banner foi **apagado** e a versão de impressão passou a sair do poster canónico.

**Estado da última versão.** `docs/dissemination/poster-congresso/print-A0/poster_milreu_A0_PRINT_sangria5mm.pdf` (commitado, PR #63). **Atualização 2026-10-02:** rodapé «Parceria e apoio» regenerado com a **barra canónica de parcerias** (5 unidades, ordem fixa, cabeçalho bilingue, **alinhada à esquerda**, gap 0,6×altura) — ver «Nota — conjunto canónico de parcerias»; corrigidos logótipos **não canónicos** usados por engano em montagem anterior. **Não é print-final aprovado:** o **gate de impressão continua aberto** — formato/título do congresso, QR, **CMYK**, incorporação/licença de fontes, direitos das fotografias. A arte mantém o rótulo de rodapé **«PROVA VISUAL — QR e formato do congresso por confirmar»**. A arte-fonte (`proof/`) **não está versionada**.

---

## Item 5 — Flyer + Marcador

**O que é.** Materiais de divulgação do Museu «Entre Ruínas e Memórias»: **flyer** e **marcador de livro**, frente/verso.

**O que foi feito.** Arte **v6.4** (arquitectura congelada). Versões de **impressão** nos formatos pedidos: **Flyer A6** (105×148) e **Marcador 59×214**, frente/verso, com sangria 3 mm + marcas de corte.

**Como foi feito.** Gerador `scratchpad/item5_build/build.py` (PIL, 300 dpi, SVG editável + PNG). As versões de impressão derivam da arte v6.4 por **escala uniforme** (sem distorção): A5→A6 é escala √2; marcador 55×200→59×214 ≈ ×1,07. Sangria por replicação de bordo + marcas. **QR real** para `https://projectomilreu.pt` (site verificado ao vivo).

**Histórico.** v1…v6 (iterações de conceito/arquitectura, vários rejeitados) → **v6.1…v6.4** (ajustes cirúrgicos sobre arquitectura congelada). Técnicas: remoção de borda branca de scan por fração-branca; `img_topfade` (gradiente de topo); sky-trim por `rowfrac`.

**Estado da última versão.** `docs/dissemination/materiais-museu/print/` (4 PDFs + PNG frente/verso, PR #63 + **atualização 2026-10-02**). **Parcerias adicionadas (decisão humana):** **Flyer verso** = **barra canónica** (5 unidades, cabeçalho bilingue, alinhada à esquerda, gap 0,6×altura, com margem de segurança ao corte); **Marcador verso** = **linha de texto** dos nomes das entidades (logótipos ficariam ilegíveis a 59 mm) sob «APOIO INSTITUCIONAL E PARCERIAS». Estados herdados da v6.4: **Marcador = direcção aprovada (arte-final); Flyer = prova visual (ainda NÃO final)**. Pendente: **aprovação editorial do flyer**; **CMYK** + incorporação de fontes no prepress; confirmar zona de segurança do marcador na produção; **direitos dos logótipos (a confirmar)**. A arte-fonte (`v6.x`) e os geradores (`scratchpad/item5_build`, `item5_print`) **não estão versionados**.

---

## Item 6 — Convite ao Inquérito Milreu 2026

**O que é.** Peça(s) de **conversão** para convidar à participação no **Inquérito Milreu 2026** (exposições, comércio, balcões, espaços culturais e online). URL canónica: `https://pt.surveymonkey.com/r/3CFG2MQ`. Marca: **Projecto Comunitário de Milreu** (NÃO «Entre Ruínas e Memórias»). Distinto do Item 5.

**O que foi feito.** **Arte-final entregue e MERGED em `main`** (PR #64, `aa0e018`): 5 formatos **single-face** — **A6, A4, A3, 1080×1350, 1080×1920**. Copy do brief **verbatim** (nada inventado — sem prazo/duração/anonimato/números). **QR real**. Fotografia MM202608. Design System v0.2. **QA técnico PASS**.

**Como foi feito.** Previews: `scratchpad/item6_build/build.py`; arte-final: `scratchpad/item6_build/arte_final.py` (dual **PIL + SVG editável** @300 dpi; QR real via `qrcode`; A6/A4/A3 com sangria 3 mm + marcas; digital em px). Brief em `ITEM06_CONVITE_INQUERITO_v1`. Verificação de segurança do pacote: 0 marcadores estranhos, identidade Milreu confirmada.

**Histórico.** Previews v1 → iterações de layout → **RESET do A6** (rejeitado «ar de cartaz/académico») → A6 **single-sided** (verso eliminado) → **propagação da linguagem** a A4/A3/digital → **ajustes finos** → **arte-final** (v6). Cada passo com decisão humana.

**Estado da última versão: DONE · PRODUCTION GATE PENDING** (decisão humana 2026-10-01). `docs/dissemination/convite-inquerito/final/` (PR #64, commit `3fdc007`).
- design **aprovado** · arte-final **entregue** · SVG editável **PASS** · PDFs **PASS técnico** · QR digital **PASS** (841/841) · Git/PR **concluído**.
- **Pendência de produção (HUMAN GATE):** (a) **teste físico do QR** numa impressão real; (b) **prepress final** — conversão/validação **vetorial e CMYK a partir do SVG mestre** quando a gráfica exigir.
- **Ressalva (decisão humana):** os **PDFs raster 300 dpi** servem como press-ready mas **não são «print-ready definitivo» sem ressalva**; para gráfica, **prioridade ao SVG mestre + prepress**, sobretudo se houver exigência de **CMYK, fontes incorporadas ou PDF/X**.
- Entregáveis: `svg/` (5 SVG editáveis, grupos separados, texto vivo, QR vetorial) · `print/` (PDFs A6/A4/A3, sangria 3mm + marcas, 300 dpi raster) · `digital/` (PNG+JPG 1080×1350 e 1080×1920) · `_PRANCHA_FINAL.png` · `QA_REPORT.md`. **Tudo single-face.**
- **Atualização 2026-10-02 — parcerias (decisão humana):** adicionada a **barra canónica de parcerias** no fundo da **frente** (convite é de face única) em **A6/A4/A3** (cabeçalho bilingue, alinhada à esquerda, gap 0,6×altura, margem de segurança ao corte) e no **story 1080×1920**; o **post quadrado 1080×1350 fica sem a barra** (sem espaço — colidiria com QR/assinatura). `final/{print,svg,digital}` reescritos a partir de `arte_final.py`; **QA técnico PASS**. **Direitos dos logótipos a confirmar.** *(Esta reescrita ainda NÃO foi re-commitada/PR — ficheiros atualizados na árvore de trabalho.)*

*Linguagem (aprovada, v6):* **tudo single-face**; eyebrow «INQUÉRITO MILREU 2026» (vermelho, pequeno, 1 linha) · headline «Milreu também se constrói…» (**maior texto**, 2 linhas) · descrição · **frase de contexto só em A4/A3/digital** · **QR grande** (ação; cresce no A4/A3) + **PARTICIPE** + **URL subordinada** · assinatura discreta; imagem full-bleed (homem+bicicleta). A6 é **single-sided** (verso eliminado por decisão humana). Iterações v1–v6 arquivadas em `convite-inquerito/v*/`.

---

## Item 7 — Dossiê «convite ao convite»

**O que é.** **Booklet A5, 4 páginas** — dossiê institucional para convidar espaços (museus, bibliotecas, escolas, universidades, autarquias, associações) a **acolher a exposição itinerante** «Entre Ruínas e Memórias». Distribuição inicial em **PDF**. Grafia pré-AO90 «Projecto».

**O que foi feito.** **FASE 1 — previews** das 4 páginas (PNG): **P1** capa · **P2** Projecto/Museu/Exposição · **P3** a exposição no espaço (diagramas de implantação vetoriais: linear/ziguezague/núcleos, 12 painéis 841:1800) · **P4** convite + contactos + QR (`projectomilreu.pt`) + **barra canónica de parcerias**. Fotografias reais autorizadas; **sem IA**; dados canónicos travados.

**Como foi feito.** Gerador `scratchpad/item7_build/build.py` (PIL, 150 dpi, 2 famílias Fraunces+Spectral). **Atualização 2026-10-02:** P4 passou a usar a **barra canónica** (5 unidades, cabeçalho bilingue, alinhada à esquerda, gap 0,6×altura) em vez da fila não canónica anterior.

**Estado da última versão.** `docs/dissemination/dossie-convite/v1/previews/` (P1–P4 + `_PRANCHA_dossie.png`, PNG). **FASE 1 (previews) — NÃO é arte-final.** Pendente: validação editorial do dossiê; **FASE 2** (arte-final + **PDF de 4 páginas** com imposição, sangria/marcas, prepress); **direitos dos logótipos e das fotografias (a confirmar)**. Geradores e previews **não versionados em Git** (estado por README + datas de ficheiro).

---

## Pendências transversais (decisão humana)

1. **Poster print-final indefinido** — gate de impressão aberto; a arte-fonte do poster não está versionada.
2. **Formato dos painéis 2000 vs 1800** — `STATUS.md` vs `WORK_QUEUE`/pasta PRINT por reconciliar; T2 («edifício de cultos») pendente.
3. **Aprovações editoriais** — flyer (Item 5); lançamento público do site (Item 2); adjudicação do orçamento (Item 3).
4. **Prepress** — conversão **CMYK** com perfil ICC da gráfica e **incorporação de fontes** para todos os PDFs de impressão (saem em RGB).
5. **Versionamento** — versões de impressão + orçamento (PR #63) e **arte-final do Item 6** (PR #64) estão em Git; a **arte-fonte** de disseminação (poster `proof/`, materiais `v6.x`, previews do convite) e os geradores `scratchpad/` continuam **fora do Git**.
6. **E-mail do formulário «Quero expor»** — requer secrets + deploy da Edge Function no Supabase.
7. **Direitos dos logótipos de parceria** — uso institucional **a confirmar** (`PROVENIENCIA.txt`); a barra canónica foi aplicada a pedido do responsável nas peças de disseminação, mas **não** autoriza publicação/distribuição externa nem uso no site sem confirmação. *(Item 2 / PR #65 da barra de logótipos do site permanece por rever/mergir por esta razão.)*
8. **Re-commit da disseminação atualizada (2026-10-02)** — poster (Item 4), flyer+marcador (Item 5), convite (Item 6) e dossiê (Item 7) foram **regenerados na árvore de trabalho** com a barra canónica; **falta commit/PR** desta atualização.
9. **Dossiê (Item 7) FASE 2** — arte-final + PDF de 4 páginas + prepress.

## Ficheiros-chave (mapa rápido)
- Exposição: `docs/exhibition/PRINT_841x1800_bleed20/`, `docs/exhibition/STATUS.md`, `docs/exhibition/decisions/`
- Site: raiz do repo (`src/`, `supabase/functions/`), `.github/workflows/07d-pages.yml`
- Orçamento: `docs/procurement/orcamento-impressora-3d/` (README, `…vFinal…pdf`, `CHECKPOINT_FACTUAL_2026-10-01.md`)
- Poster: `docs/dissemination/poster-congresso/print-A0/` (impressão) · `…/proof/` (arte-fonte, não versionada) · `…/master/` **(rejeitado)**
- Materiais: `docs/dissemination/materiais-museu/print/` (impressão) · `…/v6.4/` (arte-fonte, não versionada)
- Convite inquérito (Item 6): `docs/dissemination/convite-inquerito/final/` (`svg/` + `print/` + `digital/` + `QA_REPORT.md`; arte-final MERGED · barra canónica atualizada 2026-10-02 na árvore de trabalho) · iterações em `…/v1–v6/` · geradores `scratchpad/item6_build/`
- Dossiê (Item 7): `docs/dissemination/dossie-convite/v1/previews/` (P1–P4 + prancha, PNG) · `REPORT.md` · gerador `scratchpad/item7_build/build.py`
- **Logótipos canónicos de parceria:** `public/media/exhibition/updated/logos/` (ver «Nota — conjunto canónico de parcerias»)
