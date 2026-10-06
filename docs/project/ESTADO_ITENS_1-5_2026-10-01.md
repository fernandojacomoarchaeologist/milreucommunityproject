# Estado dos itens · Divulgação e produção · Projecto Comunitário de Milreu

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **DOCUMENTO VIVO (canónico de referência) — consultar e atualizar a cada evolução.** Última atualização: **2026-10-05** (reconciliação HUMAN/CANONICAL).
> **Âmbito:** documentação de estado (o que é · o que foi feito · como · histórico · estado da última versão). Cobre os itens **1–12**.
> **Método:** baseado em ficheiros do repositório, datas, documentos de decisão e verificações diretas. Estados reportados **tal como registados** — não se infere aprovação onde nenhum ficheiro a declara. Pontos por confirmar estão marcados.
>
> **🟢 ESTADO GLOBAL (2026-10-03): `MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026 — PATCH 2–9 CONCLUÍDO`.** Patch transversal de enquadramento 2026 aplicado e **mergeado** (10 PRs #74–#83, `main` HEAD `580e338`); fecho verificado (working tree limpo · `validate` 0 · 641/641 · outputs↔sources · sem divergências). **Concluir o patch ≠ marcar tudo `DONE`:** mantêm-se os *gates de produção* (ver §«Patch transversal MSF 2026» e «Pendências transversais»). Ver regra viva em `docs/governance/IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md`.

## Resumo — estado dos itens 1–9 (2026-10-03)

| # | Item | O que é | Estado atual |
|---|---|---|---|
| 1 | Painéis da exposição | 12 painéis «Entre Ruínas e Memórias» (totem) | **PRODUCTION LOCKED / IN PRINT · EDIÇÃO 2026 FECHADA** — 12 painéis · **841×1800** (`841×2000` **SUPERSEDED/NÃO USAR**) · **ficheiros já enviados à gráfica**; **nenhuma** alteração editorial/gráfica/técnica nesta edição. **T2 `DEFERRED TO FUTURE EDITION`**. Prepress **deixa de ser gate ativo** desta edição. Próxima fase: **RECEPÇÃO / QA FÍSICO** |
| 2 | Website | Portal `projectomilreu.pt` (estático) | **LIVE**, `noindex`; barra canónica de 5 logótipos; Media/Press + Identidade; bloco 2026. **2026-10-05:** **Enforce HTTPS ativado** (http→301→https, sem mixed content); página **`#/direitos`** publicada (PR #102); **formulário «Quero expor» OPERACIONAL** (fetch direto à Edge Function, site mantém-se estático/`demo`, e-mail real validado). **Pendente:** decisão de **indexação pública** (remover `noindex` + decisões SEO) e **tradução real EN/ES/FR** |
| 3 | Orçamento 3D | Consulta de mercado (impressora + filamentos) | **vFinal** com identificação administrativa **«PROJECTO COMUNITÁRIO DE MILREU / MUSEUS SEM FRONTEIRAS»** (PR #75, GOV-MSF-2026 v3); regenerado do pipeline, dados inalterados; **DRAFT, sem adjudicação**; CMYK gráfica pendente |
| 4 | Poster de congresso | Poster A0 académico | **2026-10-06: EDITORIAL CONTENT FROZEN / HUMAN DESIGN PASS** — prova v9 com **Objectivo** + **Diagnóstico e resultados (2024: 532 respostas; 7,6/10 visitantes)** + **Discussão integrada** + **contacto** (a78190@ualg.pt) + **Referências 16 pt** (Hauschild&Teichner 2002 · Jácomo 2025 · Moshenska 2017); 0 colisões, folga +22,5 mm. `print-A0` com barra canónica 5 logos + identificador 2026 (PR #74). **Gate restante:** FASE B / prepress (CMYK/fontes + QR final) |
| 5 | Flyer + Marcador | Materiais do Museu | `print/` (Flyer A6 + Marcador 59×214) + **CMYK PDF/X** com **identificador 2026** (Archivo caps) no bloco institucional; flyer verso 4 níveis com respiro; marcador verso compacto (PR #78). **Gate:** CMYK gráfica |
| 6 | Convite ao Inquérito | Peça de conversão (A6/A4/A3/digitais) | **FINAL ART** (PR #77/#82) — identificador 2026 no **bloco institucional top-anchored** (QR independente, quiet zone limpa); 5 formatos + CMYK; digitais 1080×1350 (bloco completo) e 1080×1920 (safe-area). **Gates:** CMYK gráfica + **teste físico do QR** |
| 7 | Dossiê «convite ao convite» | Booklet A5 4 páginas (distribuição PDF) | **FINAL ART — UPDATED FOR AAMLF DISPLAY SYSTEM** (2026-10-06) — **P3** reescrita (sistema de expositores AAMLF: 7 estruturas metálicas/14 faces, diagramas 2+2+3 e ziguezague, montagem autónoma em desenvolvimento/esquema conceptual) + **P4** com bloco **PARCERIA E ACOMPANHAMENTO** (AAMLF/Meira Pinto/morada) + linha MSF; P1/P2 intactas; PDFs 300 DPI. **NIF fora do repo**; fotos só referência (→ Item 11). **Aguarda prepress** (CMYK/fontes) |
| 8 | Cartaz local | Master/template editável A3+A4 por local | **TEMPLATE READY / STAND BY** (PR #80/**#97**) — master versionado com **slot 2026** + **template SVG A3/A4** (campos locais em vetor-texto vivo). **Não** se geram cartazes de evento sem local/data; prepress quando houver evento |
| 9 | Kit Digital + Press Kit | Pacote para anfitriões/imprensa/parceiros | **PRESS EDITORIAL PACKAGE READY / GENERIC & HOST REDISTRIBUTION GATED** (2026-10-06) — `press_editorial_use=YES`: **MM202601** (Festa da Pinha/Torre do Tombo, c/ termos da fonte), MM202603, MM202608, MM202613; **YES c/ restrição**: MM202602; **NO**: MM202604/MM202627/MM202631. `host_partner`=PENDENTE e `generic`=NO (todas). Pacote **`04_IMAGENS/PRESS_EDITORIAL_USE/`** (5 JPEG + créditos + texto obrigatório). Previews regenerados (sem taxonomia superseded); kit + taxonomia de entidades (sem duplicar AAMLF) atualizados; **NIF fora do kit**. **ZIP público genérico + republicação por anfitrião bloqueados** |
| 10 | Folha de Sala / Guia breve | A4 frente/verso (PT-PT), complemento aos 12 painéis | **DEFINED / NOT STARTED** — item canónico definido, **sem execução** no repositório. Escopo: introdução a «Entre Ruínas e Memórias», índice/percurso Q1–Q12, continuação da visita (site + QR), contexto breve do Projecto Comunitário de Milreu, enquadramento 2026, parceiros/créditos |
| 11 | Manual do Expositor | Documento operacional da exposição itinerante | **DEFINED / NOT STARTED** — item canónico definido, **sem execução** no repositório. Escopo: transporte, acondicionamento, montagem, cuidados, procedimentos em caso de dano e operação da itinerância |
| 12 | Poster de Congresso 2 | Adaptação editorial 2026 de poster académico aprovado | **FINAL (opção C) DELIVERED** (PR **#97**) — corpo aprovado **PRESERVADO** + rodapé 2026 em vetor + barra canónica; SVG editável. Divergência grafia corpo («Projeto») vs rodapé («Projecto**») **aceite** (preservação do design). **2026-10-06: HUMAN DESIGN PASS / EDITORIAL CONTENT FROZEN** — correcção factual `(n=385)`→`(532 respostas)` aplicada; **override HUMAN: Archivo (DS) adoptado** no parágrafo editado (Acumin dispensada por decisão). QA: diferenças só no parágrafo, 0 px fora, sem overflow, restante inalterado. Ver `poster-congresso2/ITEM12_FONT_REQUIRED_2026-10-06.md`. **Gate restante:** FASE B / prepress (CMYK/fontes) |

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

## Patch transversal MSF 2026 — «Museus sem Fronteiras · Iniciativas 2026» (2026-10-03) · CONCLUÍDO

**O que é.** Pacote de governação/copy **GOV-MSF-2026** (`PATCH_2026_MUSEUS_SEM_FRONTEIRAS_v2`, PROJECT GATE PASS). Torna inequívoco o enquadramento das iniciativas de 2026 **sem renomear** o projecto, e aplica-o transversalmente aos Itens 2–9 (Item 1 intocado).

**Arquitetura canónica (fonte única: `docs/governance/IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md`).**
- **Projecto Comunitário de Milreu** — marca **principal e permanente** (não é sinónimo de «Museus sem Fronteiras»).
- **PROJECTO COMUNITÁRIO DE MILREU / MUSEUS SEM FRONTEIRAS** — designação **administrativa/programática** do ciclo financiado 2026 (candidatura CCDR); forma completa nos documentos de verba.
- **MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026** — **identificador público secundário** (editorial). **Não** é logótipo, marca, parceiro nem novo nome; compõe-se só com tipografia (**Archivo maiúsculas**) e cores do Design System; fica **fora** da fila de parceiros.
- **Duas iniciativas 2026:** museu itinerante **«Entre Ruínas e Memórias»** + **Circuito Educativo**.
- **Museu do Lyceu** = enquadramento associativo **factual** da candidatura (não autor/proprietário).

**Como foi aplicado, por item (deltas 2026-10-03).**
- **Item 2 — Website:** páginas públicas **Media/Press** (`#/imprensa`) e **Identidade visual** (`#/identidade`) integradas (PR #71/#73), consumindo o Item 9 aprovado + Design System v0.2; **bloco de enquadramento 2026** em `/sobre` e Media/Press (PR #73). Rights gate: só textos + logótipo PNG; SVG/PDF/CMYK/fontes/fotografias protegidos. Postflight (screenshots desktop+mobile) entregue.
- **Item 3 — Orçamento:** identificação administrativa completa (eyebrow + subtítulo das 2 iniciativas) regenerada do pipeline; **GOV-MSF-2026 v3** alargou o âmbito a `docs/procurement/` (PR #75). Dados/preços inalterados.
- **Item 4 — Poster:** regenerado do pipeline com **barra canónica de 5 logótipos** + **identificador 2026** no rodapé institucional, com mais respiro antes de «Parceria e apoio» (PR #74).
- **Item 5 — Flyer + Marcador:** identificador 2026 (Archivo caps) no bloco institucional; flyer verso com **4 níveis e respiro** (QR em coluna própria); marcador verso compacto. PRINT + CMYK PDF/X regenerados (PR #78).
- **Item 6 — Convite:** identificador 2026 no **bloco institucional top-anchored** — **QR = bloco funcional independente (quiet zone limpa)**, separador e bloco institucional **inteiramente abaixo** do QR; identificador secundário à assinatura. 5 formatos + CMYK; **1080×1350** com bloco institucional completo e **1080×1920** com safe-area inferior (PR #77/#82).
- **Item 7 — Dossiê:** enquadramento 2026 **só na P4** (sem reabrir arquitetura); **logos em safe-area real** (não encostam ao corte), coerente em DIGITAL/PRINT/LIVRETO_A4 (PR #79/#83).
- **Item 8 — Cartaz local:** master/template versionado com **slot 2026** (`docs/dissemination/cartaz-local/`); permanece **TEMPLATE READY / STAND BY** — sem cartaz de evento (PR #80).
- **Item 9 — Kit:** bloco «Enquadramento 2026» em README/Quick Start/nota/Fact Sheet + `02_TEXTOS/ENQUADRAMENTO_2026.txt`; manifest/inventory/QA/regras de marca atualizados (PR #76/#81). **RIGHTS GATE das fotografias mantido** — nenhuma ganhou direitos.

**Correções da revisão final humana.** Tipografia do identificador passou a **Archivo maiúsculas** (não itálico), secundária; arquitetura CTA/QR do convite corrigida (QR independente, bloco institucional abaixo); digitais do convite (1080×1350 bloco completo + 1080×1920 safe-area); P4 do dossiê com logos em safe-area. **HUMAN SPACING GATE PASS** (A6/A4/A3) + revisão final.

**PRs (todos MERGED em `main`, HEAD `580e338`):** #71 (Media/Press+Identidade), #74 (poster), #75 (orçamento v3), #76 (Item 9 previews), #77 (convite), #78 (flyer+marcador), #79 (dossiê), #80 (template cartaz), #81 (Item 9 completar), #82 (convite digitais), #83 (dossiê P4). Fecho verificado: working tree limpo · `validate` exit 0 · 641/641 · outputs 6/7 byte-idênticos aos sources · sem versões finais divergentes.

**Gates de produção mantidos (o patch concluído ≠ tudo DONE):** Item 6 = **CMYK gráfica + teste físico do QR**; Item 7 = **FINAL ART DELIVERED**, aguarda produção; Item 8 = **TEMPLATE READY / STAND BY**; Item 9 = **RIGHTS GATE PENDING** (fotografias + SVG/PDF logo + CMYK + fontes + ZIP público). Prepress CMYK/incorporação de fontes = pendência transversal.

## Nota de fonte-de-verdade (ler primeiro)
- O **Item 1 (exposição)** está versionado em Git desde o início. O **PR #63** (`28bae5e`, 2026-10-01) versionou as **versões de impressão** de disseminação (poster `print-A0/`, materiais `print/`) + o **README/vFinal do orçamento**. O **PR #64** (`aa0e018`, 2026-10-01) versionou a **arte-final do Item 6** (`convite-inquerito/final/`). A **arte-fonte** de disseminação (poster `proof/`, materiais `v6.x`, previews do convite `v1–v6`) e os **geradores em `scratchpad/`** **continuam não versionados** — para essas, o estado assenta em README + datas de ficheiro.
- Site **verificado ao vivo** em 2026-10-01: `https://projectomilreu.pt` responde HTTP 200 (GitHub Pages). Documentos de deployment que digam «não publicado» estão **desatualizados**.

---

## Item 1 — Painéis da exposição «Entre Ruínas e Memórias»

**O que é.** Conjunto de **12 painéis** físicos (formato totem) da exposição itinerante do Museu de Memórias de Milreu. Bilingue (pt-PT/EN), grafia pré-AO90 «Projecto».

**O que foi feito.** 12 painéis Q01–Q12 — **PRODUCTION LOCKED / IN PRINT · EDIÇÃO 2026 FECHADA** (2026-10-05): ficheiros de impressão **CMYK já enviados à gráfica** (**Gráfica Ossonoba**, 2026-09-29); **nenhuma** alteração editorial/gráfica/técnica nesta edição (não regenerar PDFs, não alterar ICC/fontes, não corrigir T2, não acrescentar MSF, não alterar QR, não substituir imagens, não reabrir Q1–Q12). Formato canónico **841×1800** (2000 SUPERSEDED/NÃO USAR). **Prepress deixa de ser gate ativo** desta edição. Próxima fase: **RECEPÇÃO / QA FÍSICO** (ver `docs/exhibition/ITEM01_PRODUCTION_RECEIPT_2026.md`). Decisões de composição aprovadas para Q3 e Q4; reenquadramento de Q8 (transparência de IA) e Q12 (vozes reais da comunidade). Trio institucional de logótipos. MM202617: produção física autorizada **com divulgação explícita de IA**; **QR final proibido**.

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

**Estado da última versão.** `docs/dissemination/materiais-museu/print/` (4 PDFs + PNG frente/verso, PR #63 + **atualização 2026-10-02**). **Parcerias adicionadas (decisão humana):** **Flyer verso** = **barra canónica** (5 unidades, cabeçalho bilingue, alinhada à esquerda, gap 0,6×altura, com margem de segurança ao corte); **Marcador verso** = **linha de texto** dos nomes das entidades (logótipos ficariam ilegíveis a 59 mm) sob «APOIO INSTITUCIONAL E PARCERIAS». Estados herdados da v6.4 (histórico). **Atualização 2026-10-03 (patch MSF 2026, PR #78 — supersede o estado anterior):** **Flyer e Marcador = FINAL** pós-HUMAN SPACING PASS — identificador «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026» (Archivo maiúsculas, secundário) no bloco institucional; flyer verso com 4 níveis e respiro (QR em coluna própria, quiet zone limpa); marcador verso compacto. 4 PRINT (PNG+PDF) + 4 CMYK PDF/X regenerados do pipeline. Deixa de aplicar-se «flyer ainda NÃO final». Pendente: **CMYK c/ perfil da gráfica** + incorporação de fontes; **direitos dos logótipos (a confirmar)**. A arte-fonte (`v6.x`) e os geradores continuam **fora do Git** (fase de source pack abaixo trata disto).

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
- **Atualização 2026-10-02 — parcerias (decisão humana):** adicionada a **barra canónica de parcerias** no fundo da **frente** (convite é de face única) em **A6/A4/A3** (cabeçalho bilingue, alinhada à esquerda, gap 0,6×altura, margem de segurança ao corte) e no **story 1080×1920**. **Atualização 2026-10-03 (patch MSF 2026, PR #77/#82 — supersede o estado anterior):** identificador 2026 no **bloco institucional top-anchored** (QR = bloco funcional independente com quiet zone limpa; separador e bloco inteiramente abaixo do QR); **o 1080×1350 passa a ter bloco institucional COMPLETO** (Projecto → identificador → Apoio → logos) e o **1080×1920 tem safe-area inferior**. Já **não** se aplica «post quadrado sem barra». 5 formatos + CMYK PDF/X **re-commitados em `main`**. **QA técnico PASS.** Pendente: CMYK gráfica + **teste físico do QR**. Direitos dos logótipos a confirmar.

*Linguagem (aprovada, v6):* **tudo single-face**; eyebrow «INQUÉRITO MILREU 2026» (vermelho, pequeno, 1 linha) · headline «Milreu também se constrói…» (**maior texto**, 2 linhas) · descrição · **frase de contexto só em A4/A3/digital** · **QR grande** (ação; cresce no A4/A3) + **PARTICIPE** + **URL subordinada** · assinatura discreta; imagem full-bleed (homem+bicicleta). A6 é **single-sided** (verso eliminado por decisão humana). Iterações v1–v6 arquivadas em `convite-inquerito/v*/`.

---

## Item 7 — Dossiê «convite ao convite»

**O que é.** **Booklet A5, 4 páginas** — dossiê institucional para convidar espaços (museus, bibliotecas, escolas, universidades, autarquias, associações) a **acolher a exposição itinerante** «Entre Ruínas e Memórias». Distribuição inicial em **PDF**. Grafia pré-AO90 «Projecto».

**O que foi feito.** **FASE 1 — previews** das 4 páginas (PNG): **P1** capa · **P2** Projecto/Museu/Exposição · **P3** a exposição no espaço (diagramas de implantação vetoriais: linear/ziguezague/núcleos, 12 painéis 841:1800) · **P4** convite + contactos + QR (`projectomilreu.pt`) + **barra canónica de parcerias**. Fotografias reais autorizadas; **sem IA**; dados canónicos travados.

**Como foi feito.** Gerador `scratchpad/item7_build/build.py` (PIL, 150 dpi, 2 famílias Fraunces+Spectral). **Atualização 2026-10-02:** P4 passou a usar a **barra canónica** (5 unidades, cabeçalho bilingue, alinhada à esquerda, gap 0,6×altura) em vez da fila não canónica anterior.

**Estado da última versão. HUMAN DESIGN PASS / FINAL ART DELIVERED.** **Atualização 2026-10-03 (patch MSF 2026, PR #79/#83):** enquadramento 2026 inserido **só na P4** (sem reabrir a arquitectura); **logos em safe-area real** (não encostam ao corte), coerente em **DIGITAL/PRINT/LIVRETO_A4** (verificado); gerador versionado em `final/editaveis/dossie_generator.py`. Aguarda **gates de produção** (CMYK/fontes prepress; teste físico QR). Direcção aprovada e **congelada** (arquitectura, imagens, hierarquia, copy, diagramas, parceiros). Arte-final em `docs/dissemination/dossie-convite/final/`:
- `…_DIGITAL.pdf` — RGB, 4×A5 (148×210), sem sangria/marcas, **6 hyperlinks** (site, 2 e-mails `mailto:`, telefone `tel:`, site sob QR) + QR funcional;
- `…_PRINT.pdf` — **CMYK · PDF/X-3:2002**, 4×A5 + 3 mm sangria + marcas + TrimBox/BleedBox + OutputIntent (perfil «Generic CMYK» padrão — **confirmar com a gráfica**); texto raster a 300 dpi (gerador raster-nativo, sem SVG);
- `…_LIVRETO_A4.pdf` — imposição 1 folha A4 landscape (duplex, dobra ao meio), versão **adicional**;
- `editaveis/` (fonte `dossie_generator.py` com texto vivo/diagramas vetoriais; imagens; QR svg+png), `_PRANCHA_FINAL.png`, `QA_REPORT.md`.

Narrativa de imagens: Lugar (MM202608) → Comunidade (MM202602 + MM202604 recortada + MM202613) → Exposição (diagramas) → Convite (MM202601); sem repetições. **Portas de legibilidade PASS** (A5 100%, logos P4, alinhamentos, PPI ≥275, QR matriz, hyperlinks). **DONE só após revisão humana.** **HUMAN PRODUCTION GATE:** prova física do QR; prova do livreto dobrado; cor/prepress final da gráfica; **forma de exibição dos créditos das fotografias** (`creditRequired`) a decidir. Tabela de contexto das imagens em `v1/RELATORIO_FASE1.md`. Geradores/finalização em `scratchpad/item7_build` + `item7_finalize.py` (não versionados).

---

## Item 8 — Cartaz local «Entre Ruínas e Memórias»

**O que é.** **Master de cartaz editável por local** para a exposição itinerante — **A3 vertical** (principal) + **A4 vertical** (derivado). Sistema estável: trocar local/datas/horário/morada/logótipo do anfitrião/imagem **não destrói a composição**. Identidade fixa (Entre Ruínas e Memórias · exposição itinerante do Projecto Comunitário de Milreu · projectomilreu.pt). Campos locais = **texto vivo**.

**O que foi feito. HUMAN DESIGN PASS — arte-final a CONCLUIR (Fase 2).** *(Decisão 2026-10-03: não fechar como final ainda; a arte-final preliminar abaixo foi produzida mas **não é committada**; concluir Fase 2 / QA técnico / exports e apresentar para HUMAN GATE antes do commit final.)* Arquitectura em 4 zonas (imagem+identidade · informação local com forte hierarquia · CTA+QR · assinaturas com **parceiros estruturais separados do acolhimento local**). Robustez validada (nome curto/longo, horário 2 linhas, morada extensa; A4 deriva do A3). IMAGE CONTEXT FIRST: default **MM202601** (Festa da Pinha, autorizado, crédito obrigatório exibido), **substituível**. Guarda de **export final** (bloqueia placeholders/dados fictícios). Entregáveis em `docs/dissemination/cartaz-local/final/`: A3/A4 **print-ready** (RGB, 3 mm sangria + marcas + Trim/BleedBox), PNG previews, `editaveis/` (gerador com texto vivo + `FIELDS_template.json` + README + QR svg/png + imagem principal + nota de logos), `QA_REPORT.md`.

**Como foi feito.** Gerador `scratchpad/item8_build/build.py` (PIL, Design System; auto-fit de nome/datas; escala `sf` para rodapé legível no A4) + `item8_finalize.py` (print-ready + previews + QR + editáveis). Pacote de brief `ITEM08_CARTAZ_LOCAL_v1` verificado (PROJECT GATE PASS; 11/11 checksums). **Sem CMYK/PDF-X** por decisão do brief (perfil da gráfica só quando especificado). FASE 1 (previews em `cartaz-local/v1/`) → refinamento humano → arte-final.

**Estado da última versão. TEMPLATE READY / STAND BY — master versionado (PR #80).** *(Histórico/superseded: a descrição anterior «arte-final preliminar não committada» já não se aplica.)* O **master/template** está versionado em `docs/dissemination/cartaz-local/` (gerador `master/cartaz_local_generator.py` com **slot «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026»** + guarda `final=True`; previews de template A3/A4 com dados fictícios declarados; README + QA). **Não** se geram cartazes de evento sem local/data concretos. Gates de produção (quando houver evento): legibilidade A4 100 %; QR validado em impressão; sem placeholders em export específico; crédito/direitos da foto; perfil/prepress da gráfica.

---

## Item 9 — Kit Digital + Press Kit «Entre Ruínas e Memórias»

**O que é.** **Pacote organizado** (não um documento) para **espaços anfitriões, imprensa e parceiros** divulgarem a exposição itinerante sem reinventar identidade, copy, créditos, logótipos ou fotografias. Estrutura de 10 pastas (README/Quick Start · textos 50/100/250 · press · imagens+direitos · logos · social · web · cartaz(ref. Item 8) · QR · manifest).

**O que foi feito. HUMAN CONTENT/DESIGN PASS / RIGHTS GATE PENDING (2026-10-03).** FASE 1: estrutura + README/Quick Start + drafts (copy canónica, coerente c/ Itens 5/7) + **nota de imprensa editável** (campos `[ ]`) + **Fact Sheet 1 p.** + **social institucional/local** (local derivado do Item 8, c/ slot do anfitrião) + **web hero** + proposta web/social + `LEGENDAS_E_CREDITOS.csv` + `USO_E_DIREITOS.md` + `REGRAS_DE_USO.md` (logos) + QR + manifest/inventory/QA. PROJECT GATE PASS (sem checksums no pacote — registado). Sem claims inventados.

**RIGHTS GATE (refinado).** Redistribuição **não é estado único** → **4 estados** por imagem: `project_official_publication` (**YES**, confirmado 2026-07-23), `press_editorial_use`, `host_partner_republication`, `generic_third_party_redistribution` (**PENDING**, condições da fonte aplicáveis — ex.: Torre do Tombo). **Nenhuma foto** entra em pastas distribuíveis (WEB/PRESS/social) sem `YES` no estado respectivo; previews marcados `HUMAN GATE · NOT FOR DISTRIBUTION`.

**Estado da última versão.** `docs/dissemination/kit-digital-press/v1/`. **Patch Identidade/Marca (2026-10-03):** área `05_LOGOS/PROJECTO/` com logótipo oficial (PNG transparente; SVG/PDF **pendentes**), `REGRAS_DE_USO_DA_MARCA.md` e link ao Design System marcado `PUBLIC_DS_PAGE_PENDING_ITEM2` (versão pública fica para o Item 2). **Pode avançar** preparação técnica (textos/templates/manifests/editáveis/estrutura do ZIP), mas **não fechar o pacote público com fotos pendentes**. HUMAN GATE: confirmar redistribuição por imagem/fonte; aprovar textos/estrutura; prova visual. **Atualização 2026-10-03 (patch MSF 2026, PR #76/#81 — supersede «integração posterior»):** **integração pública no site CONCLUÍDA** (Item 2 — `#/imprensa` + `#/identidade`), resolvendo `PUBLIC_DS_PAGE_PENDING_ITEM2`; bloco «Enquadramento 2026» em README/Quick Start/nota/Fact Sheet + `ENQUADRAMENTO_2026.txt`; manifest/inventory/QA/regras de marca atualizados; **nenhuma foto ganhou direitos** (project=YES; press/host/generic=PENDING). **Rights gates ainda pendentes:** `press_editorial_use`, `host_partner_republication`, `generic_third_party_redistribution` por imagem/fonte → **ZIP público com fotos continua bloqueado**. Geradores: fase de source pack abaixo.

---

## Item 2 (escopo adicional) — Media/Press + Identidade visual no portal

**O que é.** Duas páginas públicas e interligadas no portal (`#/imprensa` e `#/identidade`), consumindo conteúdo **aprovado do Item 9** (textos, logótipo, matriz de direitos) e o **Design System canónico** (tokens v0.2). O Item 9 **não é reaberto**; os seus rights gates permanecem a fonte de verdade.

**O que foi feito (2026-10-03). FASE A→D concluídas; aguarda HUMAN GATE antes de merge.** Páginas orientadas a dados (`public/data/media-assets.json` + `brand-assets.json`), não hardcoded. Media/Press: hero (kit ZIP + «Ver identidade») · Sobre (50/250) · Documentos (downloads de texto + Fact Sheet/Dossiê **gated** por conterem foto) · Fotografias e Anfitriões em **estado vazio elegante** (`press_editorial_use`/`host_partner_republication` PENDING) · Logótipos (link) · Contactos. Identidade: Logótipo (PNG; SVG/PDF «em preparação») · Regras · Cores HEX/RGB (**CMYK não publicado**, não canónico) · Tipografia (Fraunces/Spectral/Archivo, **sem ficheiros de fonte**) · Exemplos ✔/✘ · Downloads. Acessos no **footer** e na **página do projecto**; cross-links em ambos os sentidos. Fora da nav principal.

**Direitos.** `downloadEnabled = true` **apenas** quando o uso da página é `yes` → 3 downloads de texto + logótipo PNG. Nenhum activo `pending`/`no` gera botão. Previews `NOT FOR DISTRIBUTION` **não** são copiados para `public/`. Resolve o `PUBLIC_DS_PAGE_PENDING_ITEM2` do Item 9.

**QA (FASE D).** Mobile 375×812 sem overflow nas duas páginas; a11y (headings semânticos, alt real, estados não só por cor, rótulos explícitos); SEO (title/description próprios; rotas classificadas no inventário 09f); **641/641 testes** + `npm run validate` **exit 0**. Correcção incidental: `channel-records.json` 11 `printSource` `.jpg`→`.png` (bug pré-existente do PR #68). Relatórios: `docs/website/ITEM02_MEDIA_PRESS_DS_AUDIT_FASEA.md` + `…_QA_FASED.md`.

**Estado da última versão. ✅ MERGED (PR #71/#73).** *(Histórico/superseded: a nota anterior «HUMAN GATE antes de merge» refere-se à fase pré-merge.)* Media/Press (`#/imprensa`) e Identidade (`#/identidade`) **estão em `main` e live** após deploy; bloco de enquadramento 2026 em `/sobre` + Media/Press (PR #73). Pendentes externos ao código (não bloqueiam): SVG/PDF vectorial do logótipo; CMYK canónico; direitos de fotografias para imprensa/anfitrião; uso institucional dos logos de parceiros; Enforce HTTPS; tradução real EN/ES/FR.

---

## Pendências transversais (decisão humana)

1. **Prepress (transversal)** — conversão **CMYK** com perfil ICC **da gráfica** e **incorporação de fontes** para todos os PDFs de impressão (hoje saem em RGB ou CMYK genérico). Aplica-se a Itens 3, 4, 5, 6, 7 **e 12**. *(Inalterado nesta reconciliação.)*
2. **Teste físico do QR** — Item 6 (convite) e demais peças com QR: validar leitura em impressão real antes de produção.
3. **Item 9 — RIGHTS das fotografias (parcialmente resolvido 2026-10-05)** — fotos históricas selecionadas (Festa da Pinha/Torre do Tombo, homem de bicicleta, imagens das descobertas): `project_official_publication=YES` e `press_editorial_use=YES` **com crédito**; fotografia das meninas = uso do Projecto autorizado, **não** reutilização genérica; `generic_third_party_redistribution` = **NO** salvo licença expressa da fonte; `host_partner_republication` ainda restrito/condicional. Ver `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md`. **ZIP público** condicionado às condições por asset.
4. **Identidade da marca (pendentes)** — **SVG/PDF vectorial** do logótipo (`PENDING`); **CMYK** canónico; **ficheiros de fonte** (OFL, licença/produção por decisão humana) — não distribuídos.
5. **Direitos dos logótipos de parceria (RESOLVIDO 2026-10-05)** — **AUTORIZADOS** para uso institucional pelo Projecto e nos seus materiais; **NÃO** autoriza redistribuição autónoma dos ficheiros por terceiros. `PROVENIENCIA.txt` atualizado. Mantêm-se crédito/termos próprios por entidade.
6. **Website** — marcar **«Enforce HTTPS»**; **tradução real** EN/ES/FR do conteúdo (hoje fallback visível); lançamento público (editorial) continua com gate humano.
7. **Item 3 — Orçamento** — adjudicação/compra (decisão humana); continua `DRAFT`.
8. **Item 1 — PRODUCTION LOCKED / IN PRINT (2026-10-05)** — canónico **841×1800**; **841×2000 → SUPERSEDED/NÃO USAR**; **edição 2026 FECHADA**, **ficheiros já enviados à gráfica** (nenhuma alteração editorial/gráfica/técnica); **prepress deixa de ser gate ativo** desta edição; **T2 `DEFERRED TO FUTURE EDITION`**. Próxima fase = **RECEPÇÃO / QA FÍSICO** (modelo em `docs/exhibition/ITEM01_PRODUCTION_RECEIPT_2026.md`). Ver `docs/exhibition/decisions/MILREU_FORMAT_RECONCILIATION_2026-10-05.md`.
9. **E-mail do formulário «Quero expor»** — requer secrets + deploy da Edge Function no Supabase.
10. **Reprodutibilidade (RECONCILIADO 2026-10-05)** — a dependência de `scratchpad` para os Itens **2–9** foi **superada pelos PRs #85 (source pack de editoração) e #91 (A2)**; o **Item 12** (PR #97) também reproduz do repo (corpo `poster_body.png` + logos versionados). Dependências reais que **restam**: (a) referência **morta** a `../item5_build/` no passo opcional `collect_editaveis` do `dossie_finalize.py` (imagens já versionadas em `editaveis/imagens/` — cosmético, não bloqueia); (b) **ficheiros de fonte** (Fraunces/Spectral/Archivo) e perfil ICC permanecem do operador, não versionados (ver `FONTS_MANIFEST.md`/`BUILD_ENVIRONMENT.md`).
11. **Direitos/licenças (decisões 2026-10-05)** — ver `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md`. Pendências que daí resultam: (a) **licença CC canónica** do conteúdo original do Projecto a **formalizar** (gate de Ciência Aberta, **não** alterado aqui) e a **indicar online**; (b) **política pública de contacto** para pedidos de crédito/correção/remoção a **implementar no site** (Item 2).

> **Resolvidas no patch MSF 2026 (2026-10-03):** re-commit da disseminação atualizada (poster/flyer/marcador/convite/dossiê); Dossiê Fase 2 (FINAL ART DELIVERED); Item 2 Media/Press + Identidade integrados; Item 8 master/template versionado; enquadramento 2026 em todos os itens 2–9.

## Ficheiros-chave (mapa rápido)
- Exposição: `docs/exhibition/PRINT_841x1800_bleed20/`, `docs/exhibition/STATUS.md`, `docs/exhibition/decisions/`
- Site: raiz do repo (`src/`, `supabase/functions/`), `.github/workflows/07d-pages.yml`
- Orçamento: `docs/procurement/orcamento-impressora-3d/` (README, `…vFinal…pdf`, `CHECKPOINT_FACTUAL_2026-10-01.md`)
- Poster: `docs/dissemination/poster-congresso/print-A0/` (impressão) · `…/proof/` (arte-fonte, não versionada) · `…/master/` **(rejeitado)**
- Materiais: `docs/dissemination/materiais-museu/print/` (impressão) · `…/v6.4/` (arte-fonte, não versionada)
- Convite inquérito (Item 6): `docs/dissemination/convite-inquerito/final/` (`svg/` + `print/` + `digital/` + `QA_REPORT.md`; arte-final MERGED · barra canónica atualizada 2026-10-02 na árvore de trabalho) · iterações em `…/v1–v6/` · geradores `scratchpad/item6_build/`
- Dossiê (Item 7): `docs/dissemination/dossie-convite/v1/previews/` (P1–P4 + prancha, PNG) · `REPORT.md` · gerador `scratchpad/item7_build/build.py`
- **Logótipos canónicos de parceria:** `public/media/exhibition/updated/logos/` (ver «Nota — conjunto canónico de parcerias»)
