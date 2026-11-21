# Estado dos itens · Divulgação e produção · Projecto Comunitário de Milreu

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **DOCUMENTO VIVO (canónico de referência) — consultar e atualizar a cada evolução.** Última atualização: **2026-10-12** (sessão 2026-10-08→12: **Item 13** Relatório CCDR · **Item 14** Banner institucional · reconciliação do **Item 5** (flyer) · **Item 2/Segurança**). Atualização anterior: 2026-10-07.
> **Âmbito:** documentação de estado (o que é · o que foi feito · como · histórico · estado da última versão). Cobre os itens **1–14** + escopo de Segurança do Item 2.

> ## ⚠️ ATUALIZAÇÃO 2026-10-12 — SESSÃO 2026-10-08 → 12 (ler primeiro)
> Nota importante: **nada desta sessão foi committado nem teve PR** — tudo em **HUMAN GATE** (ver secção «Sessão 2026-10-08→12» abaixo e o **HANDOFF** `docs/project/HANDOFF_2026-10-12.md`). Árvore de trabalho com ficheiros **untracked**.
>
> | # | Item | Estado (2026-10-12) | Onde |
> |---|---|---|---|
> | **13** | **Relatório de Execução e Execução Financeira (CCDR 2026)** | **v1.5 · FECHADO PARA ENTREGA / PRELIMINARY · RETOMADO 2026-10-12 · corte 2026-10-13 (fatura VEVOR + Folha de Sala reconciliadas)** — 1.ª apresentação pública da exposição (10-10-2026, Museu do Traje, 6 painéis, ~50 participantes) integrada; relatório preliminar (art. 13.º n.º 3). Sem commit/PR. | `docs/relatorio-execucao-ccdr-2026/` |
> | **14** | **Banner institucional (lona 850×2000)** | **v0.6b · HUMAN DESIGN PASS / FINAL ART READY · PREPRESS PENDING** + **prova para gráfica** gerada (PDF c/ sangria+marcas, ~152 dpi RGB). Sem PR. | `docs/dissemination/banner-institucional/` |
> | **5** | **Flyer A5 — reconciliação v2 com o DS actual** | **Prova final frente/verso · HUMAN GATE** (fecho aplicado). Sem PR. | `docs/dissemination/materiais-museu/reconciliacao/proof/` |
> | **2/Seg** | **Segurança do sistema** | **P0 AUDIT COMPLETE / NO PATCHES APPLIED** (validação aceite 2026-10-12) → **L1 governança GitHub: `L1 PHASE 1 APPLIED / ADMINISTRATIVE VERIFIED`** (L1-01…06b; 2026-10-12) → **L2 em desenvolvimento** (branch `security/l2-workflow-hardening`, sem push/PR). Relatórios no scratchpad (efémero). Ver handoff 2B. | `docs/security/SYSTEM_ARCHITECTURE_AND_INTEGRATIONS.md` |
>
> Detalhe completo na secção **«Sessão 2026-10-08 → 12»** (fim do documento).
> **Método:** baseado em ficheiros do repositório, datas, documentos de decisão e verificações diretas. Estados reportados **tal como registados** — não se infere aprovação onde nenhum ficheiro a declara. Pontos por confirmar estão marcados.
>
> **🟢 ESTADO GLOBAL (2026-10-07): `EDITORIAL/DESIGN COMPLETO ATÉ AOS GATES FÍSICOS/PREPRESS`.** Patch transversal MSF 2026 (2–9) **mergeado** (#74–#83). **Ronda complementar 2026-10-06/07 mergeada:** Item 4 editorial congelado (#111) · Item 7 reconstruído em SVG vetorial + AAMLF (#106/#110/#113) · Item 9 direitos por imagem + pacote PRESS_EDITORIAL_USE (#105/#107/#108/#109) · Item 10 Folha de Sala FINAL ART READY (#114/#115) · Item 11 Manual do Expositor HUMAN CONTENT/DESIGN PASS (#116) · Item 12 revertido ao legado + decisão tipográfica final (#111/#112). **Nenhum item novo está `DONE`:** os estados fecham em **HUMAN DESIGN/CONTENT PASS** e aguardam *gates de produção* — **prepress CMYK/ICC da gráfica**, **teste físico do QR**, **validação física VEVOR/embalagem/armazenamento** (Item 11) e **correção PSD** (Item 12). Ver §«Pendências transversais». Regra viva em `docs/governance/IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md`.

## Resumo — estado dos itens 1–12 (2026-10-07)

| # | Item | O que é | Estado atual |
|---|---|---|---|
| 1 | Painéis da exposição | 12 painéis «Entre Ruínas e Memórias» (totem) | **PRODUCTION LOCKED / IN PRINT · EDIÇÃO 2026 FECHADA** — 12 painéis · **841×1800** (`841×2000` **SUPERSEDED/NÃO USAR**) · **ficheiros já enviados à gráfica**; **nenhuma** alteração editorial/gráfica/técnica nesta edição. **T2 `DEFERRED TO FUTURE EDITION`**. Prepress **deixa de ser gate ativo** desta edição. Próxima fase: **RECEPÇÃO / QA FÍSICO** |
| 2 | Website | Portal `projectomilreu.pt` (estático) | **LIVE**, `noindex`; barra canónica de 5 logótipos; Media/Press + Identidade; bloco 2026. **2026-10-05:** **Enforce HTTPS ativado** (http→301→https, sem mixed content); página **`#/direitos`** publicada (PR #102); **formulário «Quero expor» OPERACIONAL** (fetch direto à Edge Function, site mantém-se estático/`demo`, e-mail real validado). **Pendente:** decisão de **indexação pública** (remover `noindex` + decisões SEO) e **tradução real EN/ES/FR** |
| 3 | Orçamento 3D | Consulta de mercado (impressora + filamentos) | **VERSÃO FINAL — consulta de mercado** (2026-10-07: selo «DRAFT» substituído por «CONSULTA DE MERCADO · VERSÃO FINAL» por decisão do responsável; dados/preços inalterados). Identificação administrativa **«PROJECTO COMUNITÁRIO DE MILREU / MUSEUS SEM FRONTEIRAS»** (PR #75, GOV-MSF-2026 v3). **Não é adjudicação** — decisão de compra continua por registar; direcção recomendada documentada (Adventurer 5M + enclosure; Kobra S1 Combo alternativa). CMYK gráfica pendente |
| 4 | Poster de congresso | Poster A0 académico | **2026-10-06: EDITORIAL CONTENT FROZEN / HUMAN DESIGN PASS** (PR #111) — prova v9 com **Objectivo** + **Diagnóstico e resultados (2024: 532 respostas; 7,6/10 visitantes)** + **Discussão integrada** + **contacto** (a78190@ualg.pt) + **Referências 16 pt** (Hauschild&Teichner 2002 · Jácomo 2025 · Moshenska 2017); 0 colisões, folga +22,5 mm. SVG final + prova RGB A0 em `docs/dissemination/poster-congresso/final/`; `print-A0` com barra canónica 5 logos + identificador 2026 (PR #74). **Gate restante:** FASE B / prepress (CMYK/fontes + QR final) |
| 5 | Flyer + Marcador | Materiais do Museu | `print/` (Flyer A6 + Marcador 59×214) + **CMYK PDF/X** com **identificador 2026** (Archivo caps) no bloco institucional; flyer verso 4 níveis com respiro; marcador verso compacto (PR #78). **Gate:** CMYK gráfica |
| 6 | Convite ao Inquérito | Peça de conversão (A6/A4/A3/digitais) | **FINAL ART** (PR #77/#82) — identificador 2026 no **bloco institucional top-anchored** (QR independente, quiet zone limpa); 5 formatos + CMYK; digitais 1080×1350 (bloco completo) e 1080×1920 (safe-area). **Gates:** CMYK gráfica + **teste físico do QR** |
| 7 | Dossiê «convite ao convite» | Booklet A5 4 páginas (distribuição PDF) | **FINAL ART — AAMLF DISPLAY SYSTEM + SVG VETORIAL** (2026-10-06/07) — **P3** reescrita (sistema de expositores AAMLF: 7 estruturas metálicas/14 faces, diagramas 2+2+3 e ziguezague, montagem autónoma em desenvolvimento/esquema conceptual) + **P4** com bloco **PARCERIA E ACOMPANHAMENTO** (AAMLF/Meira Pinto/morada) + linha MSF (PR #106); previews sincronizados com os PDFs (PR #110). **2026-10-07:** gerador reconstruído com backend **SVG vetorial editável** (texto vivo, 4×07_P1–P4; PNG byte-idêntico) + PDFs DIGITAL/PRINT/LIVRETO_A4 regenerados (PR #113). **NIF fora do repo**; fotos só referência (→ Item 11). **Aguarda prepress** (CMYK/fontes) |
| 8 | Cartaz local | Master/template editável A3+A4 por local | **TEMPLATE READY / STAND BY** (PR #80/**#97**) — master versionado com **slot 2026** + **template SVG A3/A4** (campos locais em vetor-texto vivo). **Não** se geram cartazes de evento sem local/data; prepress quando houver evento |
| 9 | Kit Digital + Press Kit | Pacote para anfitriões/imprensa/parceiros | **PRESS EDITORIAL PACKAGE READY / GENERIC & HOST REDISTRIBUTION GATED** (2026-10-06, PRs #105/#107/#108/#109) — matriz de direitos por imagem aplicada (#105) + auditoria de impacto AAMLF (#107) + reconciliação **MM202601→YES** e taxonomia (#108). `press_editorial_use=YES`: **MM202601** (Festa da Pinha/Torre do Tombo, c/ termos da fonte), MM202603, MM202608, MM202613; **YES c/ restrição**: MM202602; **NO**: MM202604/MM202627/MM202631. `host_partner`=PENDENTE e `generic`=NO (todas). Pacote **`04_IMAGENS/PRESS_EDITORIAL_USE/`** (5 JPEG + créditos + texto obrigatório) (#109). Previews regenerados (sem taxonomia superseded); kit + taxonomia de entidades (sem duplicar AAMLF) atualizados; **NIF fora do kit**. **ZIP público genérico + republicação por anfitrião bloqueados** |
| 10 | Folha de Sala / Guia breve | A4 frente/verso (PT-PT), complemento aos 12 painéis | **2026-10-07: HUMAN DESIGN PASS / FINAL ART READY / PRODUCTION GATE PENDING** (MERGED PR #114 + fix #115; **revisão 07b: fotografias + 2-up**). **2026-10-07b (decisão do responsável):** a decisão «sem fotografia» foi **substituída** — a Folha passa a incluir **2 fotografias do acervo** (frente MM202608 Ruínas/homem+bicicleta; verso MM202602 jovens anos 1950; ambas `project_official_publication=YES`, sem IA, com legenda+crédito «Aldeia de Estoi — Luís Barriga»; texto apertado; zero overlap reverificado). Criada **versão de impressão simplificada 2-up** (A4 paisagem: Folha 1=2×frente, Folha 2=2×verso; mesma arte replicada; cortar ao meio → 2 folhas A5; duplex margem CURTA). A4 F/V, DS integral (Fraunces/Spectral/Archivo). Frente: cabeçalho (MUSEU·PROJECTO + MSF 2026) · título · intro · COMO PERCORRER · **índice Q1–Q12** (fonte de verdade = sequência de referência, decisão HUMAN; painéis finais do Item 1 não versionados) · rodapé. Verso: Projecto · Como foi construído · CONTINUE+QR canónico · MSF · AAMLF (parceiro) · direitos · rodapé/logos. Finais em `docs/dissemination/folha-sala/`: DIGITAL (RGB+4 links), PRINT (RGB+sangria 3mm+marcas; **CMYK não simulado**), SVG editável, previews, QA_REPORT, MANIFEST. **Gate restante: FASE B (ICC real da gráfica). NÃO marcar DONE.** Margens 18mm; menor corpo 6pt (micro-label rodapé) |
| 11 | Manual do Expositor | Documento operacional da exposição itinerante | **2026-10-07: HUMAN CONTENT/DESIGN PASS / PHYSICAL VALIDATION GATE OPEN (FINAL ART BLOCKED BY PHYSICAL VALIDATION)** (MERGED PR #116) — prova v3 APROVADA (conteúdo/arquitectura/DS/legibilidade/operação); não é FINAL ART. Manual (21 pág. A4, DS, operacional, imprimível/B-W-safe) em `docs/dissemination/manual-expositor/`: capa·índice clicável·12 secções (antes/receber/check-in/armazenamento/montagem VEVOR/percurso/AAMLF fallback/durante/danos/check-out/embalagem/métricas+avaliação)·anexos A–G imprimíveis. Kit: 12 painéis Q1–Q12 + **6 suportes VEVOR SW-03** (VEVOR×AAMLF separados). PDF prova (bookmarks+links+QR), source reprodutível, REFERENCIAS_TECNICAS, PROPOSTA_INQUERITO (PENDING HUMAN APPROVAL), PENDING_PHYSICAL_VALIDATION. **Sem specs inventadas** (carga/espessura/2-painéis-por-suporte = gate físico; envelope/armazenamento PENDING). **Não FINAL/DONE.** Gate: teste físico painéis+suportes → aprovação → regenerar |
| 12 | Poster de Congresso 2 | Adaptação editorial 2026 de poster académico aprovado | **FINAL (opção C) DELIVERED** (PR **#97**) — corpo aprovado **PRESERVADO** + rodapé 2026 em vetor + barra canónica; SVG editável. Divergência grafia corpo («Projeto») vs rodapé («Projecto**») **aceite** (preservação do design). **2026-10-06/07: CONTENT PASS / FINAL ART PENDING SINGLE PSD TEXT CORRECTION** (PR #111 trouxe a revisão; **PR #112 reverteu ao legado** após decisão final) — **peça legada aprovada**: preservar tipografia original (Bebas Neue títulos · Acumin Pro corpo · Source Sans 3 autoria · Archivo rodapé 2026 — coexistência intencional). Normalização para DS **SUPERSEDED**. Única alteração: `(n=385)`→`(532 respostas)` **no PSD em Acumin** (mesmo peso/corpo/leading/tracking/caixa). Provas Archivo = PROOF ONLY/SUPERSEDED. Arte revertida ao legado (== main) até chegar o PNG corrigido do PSD. Ver `poster-congresso2/ITEM12_TYPOGRAPHY_NORMALIZATION_2026-10-06.md`. **Gate:** correcção no PSD em Acumin → QA → depois FASE B |

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

## Ronda complementar de editoração — 2026-10-06 / 2026-10-07 · CONCLUÍDA (até aos gates)

**O que é.** Ronda de **revisão científica/editorial e novos entregáveis de sala** sobre a base MSF 2026 já mergeada. Não reabre identidade nem reabre o Item 1. Todos os PRs abaixo estão **MERGED em `main`**.

**Deltas por item.**
- **Item 4 — Poster (PR #111):** **EDITORIAL CONTENT FROZEN / HUMAN DESIGN PASS.** Auditoria científica das 3 referências; **dados 2024 canónicos** (HUMAN): 532 respostas totais · 422 Algarve · 318 visitaram · 98 não · **7,6/10 satisfação de visitantes** · 9 entrevistas (`n=385` = amostra mínima, **não** efetiva). Adicionados **Objectivo**, **Diagnóstico e resultados (2024)** sem os 422 no bloco principal, **Discussão integrada**, **contacto** e **Referências 16 pt** (Jácomo **2025**, *Anais do Município de Faro* XLVII, 323–358). SVG final + prova RGB A0 em `final/`.
- **Item 7 — Dossiê (PRs #106 → #110 → #113):** P3/P4 para o **sistema de expositores AAMLF** (#106); previews sincronizados com os PDFs (#110); gerador **reconstruído com SVG vetorial editável** de texto vivo, PNG byte-idêntico, + PDFs DIGITAL/PRINT/LIVRETO_A4 regenerados (#113).
- **Item 9 — Kit/Press (PRs #105/#107/#108/#109):** matriz de direitos **por imagem** (#105), auditoria de impacto AAMLF (#107), **MM202601→YES** + taxonomia de entidades (#108) e pacote **`PRESS_EDITORIAL_USE`** com texto obrigatório de crédito (#109). `generic`=NO e `host_partner`=PENDENTE em todas → ZIP público/republicação continuam bloqueados.
- **Item 10 — Folha de Sala (PRs #114 + #115):** **novo entregável.** A4 F/V, PT-PT, **sem fotografia**, índice Q1–Q12, DS integral; DIGITAL (RGB + hyperlinks) + PRINT (sangria 3 mm + marcas, CMYK não simulado) + SVG editável. **HUMAN DESIGN PASS / FINAL ART READY.** Fix: hyperlink de direitos → `#/direitos` (#115).
- **Item 11 — Manual do Expositor (PR #116):** **novo entregável.** Manual operacional de 21 pág. A4 (receção→montagem VEVOR→percurso→AAMLF *fallback*→danos→check-out→devolução), anexos A–G imprimíveis, fluxo documental por `a78190@ualg.pt`. **HUMAN CONTENT/DESIGN PASS — FINAL ART BLOCKED BY PHYSICAL VALIDATION.**
- **Item 12 — Poster 2 (PRs #111 → #112):** a revisão entrou em #111 (corpo Archivo-mix) mas a **decisão final** preservou a **peça legada** → #112 reverteu a arte ao legado. Única alteração pendente: `(n=385)`→`(532 respostas)` **no PSD em Acumin** (externo).

**Gates que permanecem (realmente de produção/físicos).** Prepress **CMYK/ICC da gráfica** + incorporação de fontes (Itens 4·7·10·12) · **teste físico do QR** · **validação física** VEVOR/embalagem/armazenamento + **URL/QR do inquérito** (Item 11) · **correção PSD** em Acumin (Item 12) · direitos `host_partner`/`generic` e **ZIP público** (Item 9). **Nenhum destes itens está `DONE`.**

## Nota de fonte-de-verdade (ler primeiro)
- O **Item 1 (exposição)** está versionado em Git desde o início. O **PR #63** (`28bae5e`, 2026-10-01) versionou as **versões de impressão** de disseminação (poster `print-A0/`, materiais `print/`) + o **README/vFinal do orçamento**. O **PR #64** (`aa0e018`, 2026-10-01) versionou a **arte-final do Item 6** (`convite-inquerito/final/`). A **arte-fonte** de disseminação (poster `proof/`, materiais `v6.x`, previews do convite `v1–v6`) e os **geradores em `scratchpad/`** **continuam não versionados** — para essas, o estado assenta em README + datas de ficheiro.
- Site **verificado ao vivo** em 2026-10-01: `https://projectomilreu.pt` responde HTTP 200 (GitHub Pages). Documentos de deployment que digam «não publicado» estão **desatualizados**.

---

## Item 1 — Painéis da exposição «Entre Ruínas e Memórias»

**O que é.** Conjunto de **12 painéis** físicos (formato totem) da exposição itinerante do Museu de Memórias de Milreu. Bilingue (pt-PT/EN), grafia pré-AO90 «Projecto».

**O que foi feito.** 12 painéis Q01–Q12 — **PRODUCTION LOCKED / IN PRINT · EDIÇÃO 2026 FECHADA** (2026-10-05): ficheiros de impressão **CMYK já enviados à gráfica** (**Gráfica Ossonoba**, 2026-09-29); **nenhuma** alteração editorial/gráfica/técnica nesta edição (não regenerar PDFs, não alterar ICC/fontes, não corrigir T2, não acrescentar MSF, não alterar QR, não substituir imagens, não reabrir Q1–Q12). Formato canónico **841×1800** (2000 SUPERSEDED/NÃO USAR). **Prepress deixa de ser gate ativo** desta edição. Próxima fase: **RECEPÇÃO / QA FÍSICO** (ver `docs/exhibition/ITEM01_PRODUCTION_RECEIPT_2026.md`). Decisões de composição aprovadas para Q3 e Q4; reenquadramento de Q8 (transparência de IA) e Q12 (vozes reais da comunidade). Trio institucional de logótipos. MM202617: produção física autorizada **com divulgação explícita de IA**; **QR final proibido**.

**Actualização 2026-10-12 (decisão humana).** A gráfica imprimiu só **Q01–Q06**. O **Q12** foi reaberto (único) e tem **arte-final aprovada**: banda «Agradecimentos» (defeituosa) → **ficha técnica** com os créditos canónicos 2026 + «Apoiado pela CCDR Algarve, I.P.»; gerador e README em `docs/exhibition/q12-reabertura/`; ficheiro final em `_private/` (fora do Git). Ficheiros enviados à gráfica = Drive «3- Panels» (841×1800 + 20 mm sangria, CMYK). Falta: substituir Q12 no Drive + avisar gráfica. Ver «Registo incremental por item».

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

**Estado da última versão. HUMAN DESIGN PASS / FINAL ART DELIVERED.** **Atualização 2026-10-03 (patch MSF 2026, PR #79/#83):** enquadramento 2026 inserido **só na P4** (sem reabrir a arquitectura); **logos em safe-area real** (não encostam ao corte), coerente em **DIGITAL/PRINT/LIVRETO_A4** (verificado); gerador versionado em `final/editaveis/dossie_generator.py`. **Atualização 2026-10-06 (PR #106/#110):** P3/P4 reescritas para o **sistema de expositores AAMLF** (7 estruturas / 14 faces; diagramas 2+2+3 e ziguezague; montagem autónoma = esquema conceptual em desenvolvimento) + bloco **PARCERIA E ACOMPANHAMENTO** (AAMLF/Meira Pinto/morada); previews sincronizados com os PDFs. **Atualização 2026-10-07 (PR #113):** o gerador passou a emitir **SVG vetorial editável** (texto vivo, 4×`07_P1–P4`) além do PNG — **PNG byte-idêntico** ao preview committado (correr com `ITEM7_DPI=300`); PDFs DIGITAL/PRINT/LIVRETO_A4 regenerados (conteúdo idêntico). Aguarda **gates de produção** (CMYK/fontes prepress; teste físico QR). Direcção aprovada e **congelada** (arquitectura, imagens, hierarquia, copy, diagramas, parceiros). Arte-final em `docs/dissemination/dossie-convite/final/`:
- `…_DIGITAL.pdf` — RGB, 4×A5 (148×210), sem sangria/marcas, **6 hyperlinks** (site, 2 e-mails `mailto:`, telefone `tel:`, site sob QR) + QR funcional;
- `…_PRINT.pdf` — **CMYK · PDF/X-3:2002**, 4×A5 + 3 mm sangria + marcas + TrimBox/BleedBox + OutputIntent (perfil «Generic CMYK» padrão — **confirmar com a gráfica**); texto raster a 300 dpi (gerador raster-nativo, sem SVG);
- `…_LIVRETO_A4.pdf` — imposição 1 folha A4 landscape (duplex, dobra ao meio), versão **adicional**;
- `editaveis/` (fonte `dossie_generator.py` com texto vivo/diagramas vetoriais; imagens; QR svg+png), `_PRANCHA_FINAL.png`, `QA_REPORT.md`.

**Atualização 2026-10-12 (P3 v2, HUMAN PASS):** P3 refeita — material «PVC expandido, impressão em vinil laminado»; **ordenação frente/verso** (frente Q1→Q6, verso Q7→Q12; Q1/Q12 costas com costas); diagramas em linha (suportes próprios) / ziguezague (AAMLF, presas entre si); estruturas AAMLF mediante consulta · suportes próprios mediante apontamento; bloco **AMBIENTE** (interior; exterior ≤ 4 h com responsável). Removidos 2+2+3, «montagem autónoma», triangular. **P4 (mesma data):** pedidos pelo site «Quero expor» (URL + QR → formulário), contactos lado a lado (Fernando | Meira Pinto/AAMLF), ficha técnica = Q12; bloco «Parceria e acompanhamento» removido. PDFs DIGITAL/PRINT/LIVRETO + prancha regenerados; P1/P2 inalteradas. **Sem commit.** Ver «Registo incremental por item».

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
7. **Item 3 — Orçamento** — documento na **VERSÃO FINAL** (consulta de mercado); falta apenas a **adjudicação/compra** (decisão humana), que não está registada. CMYK gráfica, se for impresso.
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
- Dossiê (Item 7): `docs/dissemination/dossie-convite/final/` (PDFs DIGITAL/PRINT/LIVRETO_A4 + `editaveis/dossie_generator.py` com SVG vetorial + `07_P1–P4.svg`) · `v1/previews/` (P1–P4, PNG)
- Folha de Sala (Item 10): `docs/dissemination/folha-sala/` (DIGITAL + PRINT + SVG editável + previews + `QA_REPORT` + `MANIFEST`; gerador `source/generators/folha_sala_build.py` + `folha_sala_finalize.py`)
- Manual do Expositor (Item 11): `docs/dissemination/manual-expositor/` (PDF de prova + `source/generators/manual_build.py` + `manual_finalize.py` + `REFERENCIAS_TECNICAS.md` + `ITEM11_PROPOSTA_INQUERITO_ANFITRIAO.md` + `PENDING_PHYSICAL_VALIDATION.md` + `QA_REPORT_v2/v3`)
- Poster 2 (Item 12): `docs/dissemination/poster-congresso2/` (corpo legado `poster_body.png` + `poster_congresso2_C.svg` + `ITEM12_TYPOGRAPHY_NORMALIZATION_2026-10-06.md`)
- **Logótipos canónicos de parceria:** `public/media/exhibition/updated/logos/` (ver «Nota — conjunto canónico de parcerias»)
- **Item 13 (Relatório CCDR):** `docs/relatorio-execucao-ccdr-2026/` (gerador `source/generators/relatorio_build.py` + `anexos_build.py` + `anexo_iv_build.py`; `MANIFEST.json`; DIFFs v0.1→v0.17; dossier privado `_private/` **gitignored** e `/Users/fernandojacomo/Desktop/Milreudocs`)
- **Item 14 (Banner):** `docs/dissemination/banner-institucional/` (geradores `source/generators/banner_build_v06.py` (=v0.6b); `proof/BANNER_v0.6b_final.png`; `print/…PRINT_856x2006mm_sangria3mm.pdf`; imagens em `_private/imagens/` **gitignored**; `ARQUITETURA_E_COPY_v0.1.md`)
- **Item 5 (Flyer reconc.):** `docs/dissemination/materiais-museu/reconciliacao/proof/` (`flyer_a5_{frente,verso}_DEPOIS.png`, `ANTESDEPOIS_*`) + gerador `source/generators/flyer_a5_reconc_build.py` + `AUDITORIA_RECONCILIACAO_FLYER_A5_v0.1.md`
- **Segurança (Item 2):** `docs/security/SYSTEM_ARCHITECTURE_AND_INTEGRATIONS.md` (+ THREAT_MODEL/RLS_BASELINE/SECRET_MANAGEMENT existentes)
- **HANDOFF da sessão:** `docs/project/HANDOFF_2026-10-12.md`

---

# Sessão 2026-10-08 → 12 (novos itens / trabalho não committado)

> **Regra transversal desta sessão:** tudo em **HUMAN GATE** — **sem commit, sem PR**. Inputs privados em pastas `_private/` **gitignored** e no cofre externo `/Users/fernandojacomo/Desktop/Milreudocs`. Reconstruções via geradores PIL (fontes em `~/Library/Fonts/`; deps Python no scratchpad `pydeps` — `pikepdf`, `pdfminer.six`, `qrcode`, `xlrd`, `openpyxl`, `cairosvg` [sem libcairo]).

## Item 13 — Relatório de Execução e Execução Financeira (CCDR Algarve 2026)

**O que é.** **Relatório PRELIMINAR** de execução (física+financeira) da candidatura **«PROJECTO COMUNITÁRIO DE MILREU / Museu sem fronteiras»** ao Programa de Apoio a Iniciativas Culturais Regionais 2026 da **CCDR Algarve, I.P.**. Base legal = **art. 13.º n.º 3 do Aviso** (permite relatório preliminar + adenda; prazo-limite **2026-11-15**). Entidade beneficiária = **AAMLF**. **Montante atribuído = 2.200,00 €** (deliberação 2026-07-06; **Cabimento 83 · Compromisso 1132**). Estado **IN PROGRESS / PRELIMINARY**.

**O que foi feito.** Iterado **v0.1 → v0.17**. Arquitectura de privacidade: repo público = sanitizado; **dossier administrativo de entrega** privado (`/milreudocs`) = originais fiscais/NIF/IBAN/cartão. Principais consolidações: 3 estados financeiros distintos (pagamento PAGO ≠ documento fiscal ≠ prova de pagamento); enquadramento administrativo real (montante/cabimento/compromisso/artigos); **3 sessões comunitárias** documentadas (07-02, 11-04, 18-04-2026 — relatório de eventos Anexo A); direitos de imagem por ficheiro; **Anexo IV localizado e obtido** (cultalg.gov.pt/downloads/doc/67) + réplica preenchida; **elegibilidade art. 12.º** tratada como **«a entidade informa; a CCDR decide»** (sem subtotal de elegíveis); «Regras canónicas do documento»; enquadramento académico (doutoramento UAlg). Totais à data: doc. fiscal **1.459,01 €** · prova pgto **839,71 €** · despesas realizadas apresentadas **1.687,24 €** (apoio 2.200 € → **a integrar ~513 €** de despesas elegíveis faturadas à AAMLF).

**Como foi feito.** Geradores `relatorio_build.py` (relatório, 13 págs, image-based @200dpi) + `anexos_build.py` (Anexos A–F) + `anexo_iv_build.py` (réplica .xlsx do Anexo IV). Dataset CSV (`despesas.csv` c/ `data_pagamento` e `elegibilidade_apoio`, `doc_financeiros.csv`, `sessoes.csv`, `evidencias.csv`, `acoes.csv`, `orcamento_*.csv`). `MANIFEST.json`. DIFFs por versão.

**Estado da última versão (v1.0 — FECHADO PARA ENTREGA, 2026-10-16; relatório datado de 2026-10-17). RETOMADO** — integrada a 1.ª apresentação pública da exposição (10-10-2026; ver «Registo incremental por item»). *(Histórico: v0.17 esteve EM PAUSA.)* Pendências reais (gates): preencher o **Anexo IV oficial** (datas de pagamento + «objeto do apoio»); **comprovativo de cartão das 50 cópias da Folha de Sala** (2.º PNG numerado, por integrar); **despesas elegíveis adicionais faturadas à AAMLF** (deslocação de equipa — ex.: Faro — e serviços de design/comunicação) para justificar os 2.200 €; **fatura fiscal dos filamentos** (hoje proforma); **fatura das estruturas** (DESP-004, em andamento); **prova do remanescente dos painéis** (~30 dias); **folhas de presença**; **contrapartidas art. 16.º** (logótipo CCDR + «Apoiado pela CCDR Algarve, I.P.» nos materiais); **recibo da AAMLF à CCDR** (2.200 €, NIPC 517638827) + documentos do art. 14.º. **Orientação de despesas:** serviço/logística de equipa/aluguer faturado à AAMLF = forte; compra de bens/equipamento (impressora, filamentos, ferramentas de escavação) ou **hospitalidade ao público** (buffet, água aos convidados) = fraco/arriscado (art. 12.º/2). **Sem commit/PR.**

## Item 14 — Banner institucional vertical (lona)

**O que é.** Banner **institucional perene** do Projecto (lona vertical **850×2000 mm**) — identidade principal e permanente do projecto; «Museus sem Fronteiras · Iniciativas 2026» como camada secundária.

**O que foi feito.** Iterado **v0.1 → v0.6b**. Arquitectura final: logótipo (marca principal) · enquadramento «Arqueologia Pública e Comunitária · Ruínas Romanas de Milreu, Estói (Faro)» · MSF 2026 secundário · **faixa documental de 3 imagens P&B** · **Sobre o projecto** (perene, com origem no doutoramento UAlg) · **4 FRENTES** («Entre Ruínas e Memórias» · Circuito Educativo · **Documentando Milreu** · Investigação, participação e comunicação científica) · **Coordenação** (bio sintética) · **rodapé** (hierarquia canónica **Projecto em cima → MSF 2026 em baixo → iniciativas do ciclo → logos ordem canónica**). Imagens (**autoria DESCONHECIDA**; «Aldeia de Estói» = só fonte digital): MM202608 (edifício de cultos, c.1910) · MM202613 (equipa de escavações, c.1981; col. M. L. Mendes Martins / prov. Celeste e Branca Pimenta) · MM202603 (achados romanos, associados às descobertas de 1966). Micro-QA final passou (créditos legíveis, safe area, logos, PROJETO = asset oficial preservado). **Documentando Milreu NÃO é apresentada como iniciativa MSF 2026.**

**Como foi feito.** Gerador `banner_build_v06.py` (PIL, 1700×4000=~51 dpi mestre; Fraunces/Spectral/Archivo; paleta v0.2; distribuição vertical em 2 passagens). **Prova para gráfica**: `print/BANNER_v0.6b_PRINT_856x2006mm_sangria3mm.pdf` (850×2000 trim + 3 mm sangria + marcas; **3× LANCZOS → ~152 dpi; RGB**).

**Estado da última versão (v0.6b). HUMAN DESIGN PASS / FINAL ART READY · PREPRESS PENDING.** Prova para gráfica gerada. **Pendências (confirmar c/ a gráfica + decisão):** **re-render «print-grade»** a resolução real com **logótipo em VETOR** (SVG oficial do logo **pendente** no projecto; raster 450px suaviza a 360 mm) + fotos à resolução total; **CMYK** (confirmar se a gráfica exige; hoje RGB); **formato/acabamento** (lona com ilhós vs rollup — margem extra; sangria pedida). **Sem commit/PR.**

## Item 5 (reconciliação) — Flyer A5 vs Design System actual

**O que é.** **Reconciliação** do flyer A5 «Entre Ruínas e Memórias» (frente+verso) com os padrões consolidados (Itens 7/10/14). Preservar hero, identidade, título, paleta, tipografia. Não redesenhar do zero.

**O que foi feito.** Auditoria + **DEPOIS** reconstruído em PIL (A5 148×210 + 3 mm sangria @200dpi). **Frente:** hero MM202608 preservado · +2.ª linha «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026» · subtítulo novo «Museu e exposição itinerante…» · **CTA único** (Conheça o museu + projectomilreu.pt + QR real). **Verso:** «O que é» condensado · **1 só foto** (Festa da Pinha 1909; crédito **Arquivo Nacional da Torre do Tombo — Foto Artística Samorrinha, J. V. Samorrinha, PT/TT/SAM/A/001/000016**; termos TT preservados) · **«No site» sem as 3 barras** (bloco editorial empilhado) · «Quer acolher» com espaço + 1 QR · rodapé **hierárquico** («Parceria e acompanhamento: AAMLF · Apoio: CCDR» — **não** «iniciativa da AAMLF») + logos normalizados.

**Como foi feito.** Gerador `flyer_a5_reconc_build.py` (PIL + `qrcode`). ANTES renderizado do SVG editável via QuickLook; DEPOIS em PIL. Menor corpo: 5,6 pt (crédito foto) · 6,8 pt (rodapé).

**Estado da última versão. HUMAN GATE (fecho aplicado).** Prova final frente/verso a 100%. **Pendências:** prepress (CMYK/fontes); o SVG editável original (`materiais-museu/editavel-vetor/`) **não** foi editado (base64 embebido) — o DEPOIS é reconstrução PIL. **Sem commit/PR.**

## Item 2 — Segurança do sistema (escopo adicional)

**O que é.** Avaliação de segurança defensiva do próprio projecto + **documentação de sistema** para suportar a avaliação.

**O que foi feito.** **Documento de sistema** `docs/security/SYSTEM_ARCHITECTURE_AND_INTEGRATIONS.md` (grounded no repo: static-first, Supabase, 4 Edge Functions com CORS/rate-limit/Turnstile/worker-secret/caps, deploys protegidos por confirmação literal, segredos por environment, `dependencies: []`). Verificação read-only: **bundle público sem segredos**. Plano de segurança **reordenado por feedback humano** (audit-first, formato **`MEASURED → GAP → PROPOSED CHANGE → RISK → TEST`**): **P0** = auditoria de workflows/permissões (`GITHUB_TOKEN`, `pull_request_target`, injecção em `run:`, secrets por job) **+** endurecer «Quero expor» reutilizando o padrão existente; **P1** = RLS audit + CodeQL + SHA-pinning/Dependabot + estado do secret-scanning nativo; **P2** = CSP **correcta** (só `<meta>`; `frame-ancestors`/HSTS/Report-Only **não** funcionam em Pages — corrigido no doc) + `security.txt` + verificação de domínio; **P3** = higiene de build; pré-go-live = OAuth/storage/backup+restauro/observabilidade.

**Estado.** *(Histórico/superseded: «próximo passo = auditoria P0».)* **2026-10-12: `P0 AUDIT COMPLETE / NO PATCHES APPLIED`** → **L1 PLAN READY / NOT APPLIED**. Achados principais: SEC-P0-016 Medium (governança GitHub: `main` desprotegida, `production` sem revisores, secrets repo-level), SEC-P0-002 Medium («Quero expor» sem rate-limit/desafio), SEC-P0-001 Low→Medium condicional (injecção em `08i-retention-apply`). ⚠️ O documento de sistema contém afirmações desmentidas pela auditoria (secrets «por environment»; rate-limit/Turnstile em todas as funções) — por corrigir. Detalhe, lotes L1–L7 e registo: `handoff/HANDOFF_ITEM_02B_seguranca.md`. **Sem alterações no repo** além de documentação.

---

# Registo incremental por item (append-only)

> **REGRA DE MAPEAMENTO INCREMENTAL (decisão do responsável, 2026-10-12).** Cada novidade, decisão, acréscimo ou remoção num item é registada **no próprio momento**, como entrada nova, em **dois sítios**: (1) §11 «Registo incremental» do `handoff/HANDOFF_ITEM_XX_*.md` desse item; (2) secção «Registo incremental por item» no fim de `ESTADO_ITENS_1-5_2026-10-01.md`. **Append-only:** não reescrever nem apagar entradas antigas; uma correcção é uma entrada nova (`ALTERADO`/`REMOVIDO`). Formato `AAAA-MM-DD · TIPO · descrição · fonte`, TIPO ∈ NOVO · DECISÃO · ALTERADO · REMOVIDO · PENDENTE · RESOLVIDO. O estado-resumo (§2 / tabelas) é actualizado em paralelo.

## Item 1 — Painéis
- 2026-10-12 · NOVO · 1.ª apresentação pública dos painéis a 10-10-2026 (Museu do Traje, São Brás de Alportel; ~50 participantes de museus do Algarve); painéis recebidos e em uso (fotos `evento1010-*`). · responsável + fotos
- 2026-10-12 · PENDENTE · Registo formal de RECEPÇÃO/QA físico; n.º de painéis expostos a 10-10.
- 2026-10-12 · NOVO · Estado real de impressão: a Gráfica Ossonoba **imprimiu só Q01–Q06**; **Q07–Q12 ainda por imprimir** ⇒ há tempo para substituir o Q12. (Corrige «IN PRINT 12/12»; a entrada de uso a 10-10 refere-se aos painéis já impressos.) · responsável
- 2026-10-12 · NOVO · Ficheiros finais enviados à gráfica localizados no Drive «3- Panels» (`https://drive.google.com/drive/folders/1zY9Rgqe0HtYT_6_AcB8Yv2x9cJ7Gj8_4`): 12 PDFs `NN - MILREU_QNN_841x1800_bleed20_CMYK.pdf`. Q12 sha256 `046db67d…e48779c`; cópia local em `docs/exhibition/q12-reabertura/_private/original/` (gitignored). · Drive + verificação local
- 2026-10-12 · NOVO · **Especificação da gráfica (medida nos PDFs):** página 881×1840 mm = 841×1800 corte + **20 mm sangria**; TrimBox/BleedBox definidos; 1 raster **CMYK JPEG 3160×6600 px (~91 ppi)**, `Decode [1 0…]`, sem OutputIntent/ICC. · `q12_ficha_tecnica_build.py`
- 2026-10-12 · NOVO · **Defeito no Q12 enviado:** a banda «AGRADECIMENTOS · WITH THANKS» repete duas vezes a tradução EN da citação de Leandro C Dias (a linha «PT» está em inglês); não contém agradecimentos. · inspecção do PDF do Drive
- 2026-10-12 · DECISÃO · Reabertura do **Q12** (só o Q12): acrescentar ficha técnica no fim — «Curadoria: Grupo de voluntários do Projecto Comunitário de Milreu» + «Investigação, design e produção: Fernando Rodrigues de Jácomo» + AAMLF/Meira Pinto **sem ficar abaixo** do responsável. · responsável
- 2026-10-12 · DECISÃO · Acrescentar **menção real à CCDR** no último painel. · responsável
- 2026-10-12 · NOVO · **Prova Q12 v2** (PROVA, marca de água, HUMAN GATE): banda «Agradecimentos» (defeituosa) substituída por **FICHA TÉCNICA · CREDITS** em 3 colunas de peso igual — (1) COORDENAÇÃO INSTITUCIONAL / Institutional coordination · **Meira Pinto** · Associação dos Amigos do Museu do Lyceu de Faro; (2) CURADORIA / Curated by · **Grupo de voluntários** · do Projecto Comunitário de Milreu; (3) INVESTIGAÇÃO, DESIGN E PRODUÇÃO / Research, design and production · **Fernando Rodrigues de Jácomo** — + linha **«Apoiado pela CCDR Algarve, I.P. · Supported by CCDR Algarve, I.P.»** (fórmula do art. 16.º). Trabalho em CMYK sobre o raster original; hash-gate PASS; **0 px alterados fora da banda**; caixas/resolução/Decode preservados; render independente (PyMuPDF) com cores idênticas ao original. Gerador `docs/exhibition/q12-reabertura/source/generators/q12_ficha_tecnica_build.py`; provas em `docs/exhibition/q12-reabertura/_private/proof/` (contêm fotos de terceiros → gitignored). · esta sessão
- 2026-10-12 · PENDENTE · Aprovação humana da prova v2 → gerar versão `--final` (sem marca de água) → substituir o Q12 no Drive/avisar gráfica (acção do responsável). Confirmar: papel «Coordenação institucional» e forma «Meira Pinto» (cargo/nome completo não impressos); remoção do título «Agradecimentos» (o conteúdo era defeituoso; os nomes autorizados já aparecem em «Vozes da comunidade»).

- 2026-10-12 · RESOLVIDO · 6 painéis expostos a 10-10, nas estruturas da AAMLF. · responsável
- 2026-10-12 · NOVO · Art. 16.º: logótipo CCDR na barra dos painéis; menção textual a entrar na ficha técnica do Q12.
- 2026-10-12 · DECISÃO · Prova v2 aprovada na estrutura («Gosto»), com uma alteração: **o nome do responsável vem primeiro**. · responsável
- 2026-10-12 · ALTERADO · **Prova Q12 v3**: ordem das colunas → (1) Investigação, design e produção · Fernando Rodrigues de Jácomo; (2) Coordenação institucional · Meira Pinto · AAMLF; (3) Curadoria · Grupo de voluntários do Projecto Comunitário de Milreu. Mantém 3 colunas de peso igual (Meira Pinto ao lado, nunca abaixo) e a linha CCDR. Hash-gate PASS; 0 px fora da banda. v2 substituída. · `q12_ficha_tecnica_build.py`
- 2026-10-12 · PENDENTE · Confirmar v3 → gerar `--final` → substituir Q12 no Drive/avisar Gráfica Ossonoba (responsável). Mantêm-se em aberto: título «Agradecimentos» removido; cargo de Meira Pinto; menção CCDR em Q01–Q06 já impressos.
- 2026-10-12 · NOVO · Material dos painéis confirmado pelo responsável (via Item 7): **PVC expandido, impressão em vinil laminado**. Espessura continua por confirmar (registo de produção `ITEM01_PRODUCTION_RECEIPT_2026.md` mantém o campo em aberto). · responsável · handoff 7 §11
- 2026-10-12 · DECISÃO · **Prova Q12 v3 APROVADA** («aprovado — gerar versão final»). Aprovação inclui, tal como na prova: remoção do título «Agradecimentos» (substituído pela ficha técnica) e «Meira Pinto» sem cargo. · responsável
- 2026-10-12 · NOVO · **Q12 FINAL gerado** (sem marca de água): `docs/exhibition/q12-reabertura/_private/final/12 - MILREU_Q12_841x1800_bleed20_CMYK.pdf` (mesmo nome do original do Drive) · sha256 `48601014b9297d09b7ade1c00c3ca2cbe8c696bd99edbac3fd379f81c4722c12` (sidecar `.sha256`). Verificado: 881×1840 mm (841×1800 + 20 mm sangria), TrimBox/BleedBox iguais ao original, raster CMYK JPEG 3160×6600, `Decode [1 0…]`, 0 px alterados fora da banda, render independente OK. Original preservado em `_private/original/`. Ficheiros em `_private/` (gitignored; contém fotos de terceiros). · `q12_ficha_tecnica_build.py --final`
- 2026-10-12 · PENDENTE · **Acção do responsável:** substituir o Q12 no Drive «3- Panels» e avisar a Gráfica Ossonoba antes de imprimir Q07–Q12. Por decidir: menção textual CCDR em Q01–Q06 já impressos (hoje só logótipo). Arquivo da arte-final no Git = pendência geral do Item 1.
- 2026-10-12 · DECISÃO · **Créditos canónicos das iniciativas 2026** (ordem fixa, pesos iguais): (1) Investigação, design e produção — Fernando Rodrigues de Jácomo; (2) Coordenação institucional — Meira Pinto (AAMLF, sem cargo); (3) Curadoria — Grupo de voluntários do Projecto Comunitário de Milreu; + «Apoiado pela CCDR Algarve, I.P.» quando houver ficha técnica. Registado em `docs/governance/IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md` §7. · responsável
- 2026-10-12 · NOVO · Commit/PR do Item 1 (Q12: gerador + README; créditos canónicos; handoff/índice). Arte-final e original ficam em `_private/` (fotos de terceiros, fora do Git). · esta sessão
- 2026-10-12 · NOVO · **Duas falhas no Q01 já impresso** (não reimprimível): (1) **mapa com erro**; (2) **falta o logótipo da Junta de Freguesia de Estoi**. Correcção por **adesivos**. · responsável
- 2026-10-12 · NOVO · Mapa corrigido recebido: `Mapa de Milreu e Ria Formosa.png` (1137×1383 px, RGB; sha256 `b3742ddc…`), **sem** «Serra do Caldeirão» e «Barrocal algarvio»; mantém MILREU, Estoi, Faro, São Brás de Alportel, Santa Bárbara de Nexe, Loulé, Olhão, Ria Formosa, Oceano Atlântico, EN2, ≈9 km, norte, escala (verificado). Autoria/proveniência do mapa por registar. · ~/Downloads
- 2026-10-12 · NOVO · **Medidas do mapa no Q01** (PDF do Drive): moldura 382,2×445,2 mm; canto sup-esq a 404,3 mm da esquerda e 1109,4 mm do topo do corte; filete ~1,1 mm CMYK (74,75,97,2)/255. Painéis convertidos com sRGB→«Generic CMYK Profile» (papel = C2 M4 Y7 K0). · `q1_mapa_adesivo_build.py`
- 2026-10-12 · NOVO · **Adesivo do mapa (arte para impressão, por aprovar):** corte **386,2×449,2 mm** (folga 2 mm/lado sobre a moldura antiga) + sangria 3 mm = 392,2×455,2 mm; filete do painel na orla; mapa escalado sem distorção (corte de 57 px no relevo superior e 10 px abaixo da escala); 150 ppi de saída, **~74 ppi efectivos da fonte** (limite). PDF CMYK + TIFF CMYK + PNG em `docs/exhibition/adesivos-correctivos/print/`; montagem em `_private/proof/`. · esta sessão
- 2026-10-12 · NOVO · **Brasão de Estoi:** `brasao.gif` (419×446, com transparência) e `Logo_Estoi.jpeg` (fundo branco). Fila de logótipos do Q01 medida (Q12 tem a mesma fila). **Recomendado: posição A**, entre o logótipo Milreu (fim do trio indivisível) e a UAlg, a 30 mm de altura (≈28×30 mm): esq. a 646,9 mm do corte esq., topo a 1657,0 mm do corte topo (≈15,9 mm livres de cada lado; topo/base alinhados com o logótipo da UAlg). Alternativa B (entre CCDR e AAMLF) também mostrada. · `_private/proof/Q01_brasao_Estoi_OPCOES_A_B.png`
- 2026-10-12 · PENDENTE · Aprovação da posição do brasão + produção do adesivo do brasão; autorização de uso do brasão pela Junta (registar em PROVENIENCIA); integrar o brasão directamente no **Q12** (ainda não impresso) em vez de adesivo; confirmar se outros painéis têm fila de logótipos; autoria do mapa e eventual ficheiro de maior resolução; material do adesivo (vinil mate) com a gráfica.
- 2026-10-12 · NOVO · Confirmado: adesivo do mapa = corte **386,2×449,2 mm** (PDF TrimBox 386,23×449,24; página com sangria 392,23×455,24 mm). · verificação PyMuPDF
- 2026-10-12 · DECISÃO (proposta, aceite em princípio pelo responsável) · Em vez do brasão sozinho, **substituir a faixa de logótipos inteira** por adesivo de largura total (841 mm): bordo superior sobre o fio (1619,3 mm do topo do corte), bordo inferior a ~1703,5 mm (logótipos acabam a 1690,1; «Impressão dos painéis» começa a 1717,2) ⇒ ≈ **841×84 mm** + 3 mm de sangria em cima e em baixo. Q12 (por imprimir) recebe a mesma faixa no ficheiro. · esta sessão
- 2026-10-12 · NOVO · **Skill canónica** `.claude/skills/build-logo-band/SKILL.md` (v0.1.0): conjunto/ordem, trio indivisível, estrutura do bloco, modos A (distribuída) / B (compacta 0,6×H), alturas ópticas medidas no Q01, CMYK, faixa de substituição, art. 16.º, QA. Junta de Freguesia de Estoi = **posição 4 PROPOSTA, por confirmar** + autorização por registar. · esta sessão
- 2026-10-12 · PENDENTE · Confirmar posição da Junta na ordem canónica + autorização de uso (→ `PROVENIENCIA.txt` e asset `logo-junta-freguesia-estoi.png`) antes de gerar a faixa nova.
- 2026-10-12 · DECISÃO · Junta de Freguesia de Estoi na **posição 4** (Projecto · CCDR · AAMLF · **Junta** · trio Milreu · UAlg) — aprovada. **Intervalos iguais entre todos os logótipos** (o trio destoava dos restantes). A faixa é um **adesivo à parte, colado por cima** da faixa impressa. · responsável
- 2026-10-12 · NOVO · **Adesivo da faixa de logótipos (prova):** corte **841,0×87,5 mm** (+3 mm sangria = 847,0×93,5 mm, 300 ppi CMYK); bordo superior a 1617,6 mm do topo do painel (2 mm acima do fio, que é reimpresso); lados = bordos do painel; cobre fio + cabeçalho + fila; termina a meio entre fila e «Impressão dos painéis». Intervalo único **25,6 mm** = intervalo interno médio do trio; fila de margem a margem (55 mm), escala ×1,139 das alturas aprovadas. Serve **Q01 e Q12** (faixa nas mesmas cotas, verificado). Gerador `faixa_logos_adesivo_build.py`; ficheiros em `docs/exhibition/adesivos-correctivos/print/`; montagens em `_private/proof/`. · esta sessão
- 2026-10-12 · PENDENTE · ⚠️ **Trio Milreu policromático** só existe a 613×90 px → **~55 ppi** no adesivo (no painel impresso já estava a ~63 ppi). Pedir ficheiro oficial vectorial/alta resolução (República Portuguesa + Património Cultural + Milreu). Autorização de uso do brasão da Junta por registar em `PROVENIENCIA.txt`.
- 2026-10-12 · NOVO · Mapa: confirmado que o adesivo **386,2×449,2 mm** é o tamanho certo para colar por cima da moldura impressa de 382,2×445,2 mm (2 mm de cobertura em cada lado). · esta sessão
- 2026-10-12 · DECISÃO · **Faixa de logos APROVADA** (adesivo 841×87,5 mm, Q01 e Q12). · responsável
- 2026-10-12 · DECISÃO · **«Faixa de Logos» canónica para todo o projecto**: `docs/governance/FAIXA_DE_LOGOS_CANONICA.md` (CANONICAL — HUMAN APPROVED) + regra `.claude/rules/logo-band-canonical.md` + skill `build-logo-band` v0.2.0. Ordem: Projecto · CCDR · AAMLF · **Junta de Freguesia de Estoi** · trio Milreu · UAlg; intervalo único = intervalo interno do trio. Materiais existentes actualizam-se na próxima revisão de cada item. · responsável
- 2026-10-12 · NOVO · Asset canónico `public/media/exhibition/updated/logos/logo-junta-freguesia-estoi.png` (de `brasao.gif`, píxeis idênticos; sha256 `28edeb3a…`); `PROVENIENCIA.txt` actualizado (posição 4; trio passa a 5, UAlg a 6). Gerador da faixa passa a usar o asset canónico (saída byte-idêntica à aprovada). · esta sessão
- 2026-10-12 · PENDENTE · Documento de autorização da Junta; trio Milreu em alta resolução; autoria do mapa (ficheiros de impressão do mapa fora do Git até lá).

> Outros itens: entradas mantidas localmente até revisão própria (conteúdo de segurança/privado não publicado).


---

## Manutenção da faixa de logótipos + entregáveis para gráfica — 2026-10-12

**Faixa canónica (6 logótipos, Junta de Freguesia de Estoi na posição 4)** aplicada/verificada nos materiais; espaçamento canónico 0,6 × altura.

- **Item 14 — Banner institucional (v0.6b):** rodapé reconstruído como **faixa canónica única** (sem destaque isolado da CCDR; logo do Projecto na faixa, redundância aceite), **espaçamento 0,6 × altura**, imagem central com zoom (sem margens brancas). Alterações **persistidas** no gerador; finais em `proof/` + `print/`. **APROVADO.**
- **Item 15 — Adesivo do logótipo (NOVO):** redondo Ø50 mm, sangria 3 mm, logótipo preservado. **APROVADO.** Ver `docs/dissemination/adesivo-logo/` e `handoff/HANDOFF_ITEM_15_adesivo.md`.
- **Entregáveis para gráfica** reunidos no cofre externo `Milreudocs/Temporary` (RGB c/ sangria + CMYK «Generic» de referência + SVG auto-contidos; a **gráfica faz a conversão CMYK**). Itens 1,2,4,5,6,7,8,9,10,11,12,14,15.
- **Pendente:** Item 4 (poster) com a faixa Estoi existe **apenas no cofre** — falta aplicá-la no repo pela janela do Item 4 (o `origin/main` do poster ainda não tem a Junta). SVG auto-contido de poster/flyer/marcador depende de exportar os assets recortados.

## Item 8 — Cartaz local (registo incremental)
- 2026-10-13 · ALTERADO · **Cartaz Estoi — nova data:** abertura e inauguração **sexta-feira 30-10-2026, 21h00** (exposição 30-10 → 06-11); pasta `eventos/2026-10-30_estoi/`. · responsável
- 2026-10-13 · ALTERADO · Cartaz Estoi com **Faixa de Logos canónica** (Junta na posição 4, intervalo único, menção art. 16.º) e anfitrião = `logo-junta-freguesia-estoi.png`; `Logo_Estoi.jpeg` retirado. PDFs A3/A4 regenerados; aguarda HUMAN GATE. · esta sessão
- 2026-10-13 · NOVO · Cartaz Estoi: **ficheiro final** PDF/X-3 CMYK genérico (A3/A4), **versão online** 1080×1350 + 1080×1920 e **versão animada** MP4 (14 s, 4:5 e 9:16). FINAL ART; pendente teste físico do QR e ICC da gráfica. · responsável

## Item 2 — Website (registo incremental)
- 2026-10-13 · NOVO · Agenda pública: primeira paragem real (Junta de Freguesia de Estoi, 30-10 → 06-11-2026; inauguração 30-10 21h00). · responsável
- 2026-10-13 · NOVO · **Produção:** agenda pública com a paragem de Estoi publicada em https://projectomilreu.pt/#/exposicoes — deploy `07d-pages` run 38400451323 (success, build 2026-10-13T12:52Z); verificado ao vivo (período 30-10 → 06-11-2026, morada, horário, inauguração 30-10 às 21:00 hora de Lisboa). Home e página da iniciativa só têm ligação «Acompanhar a agenda» (sem destaque próprio). Cache do Pages: max-age 600 s. · esta sessão
- 2026-10-13 · ALTERADO · Cartaz Estoi — **vídeo animado v2**: sem QR; 4 fotografias do acervo (MM202601/08/03/13) com crédito por cena, texto animado e cartão final «projectomilreu.pt» + Faixa de Logos. · responsável
- 2026-10-13 · PENDENTE · Vídeo animado v2 (e restantes peças do cartaz Estoi) **enviados para validação externa — STAND BY** até retorno. · responsável
- 2026-10-14 · DECISÃO · **3 tipos canónicos de divulgação por paragem**: cartaz geral (impressão, único com QR) · animação (sem QR) · post de rede social (informativo, sem QR; 1080×1350/1080×1080/1080×1920). Dados por paragem só em `eventos/<id>/evento.json`; geradores em `docs/dissemination/cartaz-local/canonico/` (`build_evento.py`). Estoi migrado; versão «online» retirada. · responsável
## Item 6 — Convite ao Inquérito
- 2026-10-12 · NOVO · Convite impresso em circulação a 10-10-2026 (EVID-016, Item 13).
- 2026-10-12 · NOVO · Orientador sugere alargar o inquérito via museu de S. Brás e Museu do Lyceu de Faro; protocolo de colaboração em conversações (partes não especificadas). Oportunidade, não compromisso. · mensagem privada
- 2026-10-12 · PENDENTE · Teste físico do QR continua por registar.

- 2026-10-13 · ALTERADO · A afirmação «convite impresso: 100 cópias a cores» (Item 13) estava errada — essas 100 impressões são a Folha de Sala. **Impressão do convite: documento/quantidade A CONFIRMAR.** (O convite esteve em circulação a 10-10, EVID-016.) · responsável

- 2026-10-13 · RESOLVIDO · Impressão do convite: **103 cópias a preto e branco, formato A5** (Auchan Coimbra, 2026-10-08, 5,15 €; fatura regista «A4 PB»; mesma fatura com guilhotina). Nota: A5 PB não é um dos 5 formatos da arte-final (A6/A4/A3/digitais, cor). · responsável · Item 13 DESP-005

## Item 10 — Folha de Sala
- 2026-10-12 · NOVO · Folha de Sala em circulação a 10-10-2026 (EVID-016, Item 13).

- 2026-10-13 · RESOLVIDO · Impressão documentada: **50 exemplares frente/verso** a cores (100 impressões A4, 30,00 €), fatura Auchan …/000343 de 2026-10-08, paga por Mastercard. · responsável · Item 13 DESP-005

## Item 11 — Manual do Expositor
- 2026-10-12 · NOVO · 1.ª montagem real a 10-10-2026 (estruturas metálicas articuladas, ar livre).
- 2026-10-12 · PENDENTE · Estruturas AAMLF ou VEVOR SW-03? Conta como teste físico do gate? (decisão humana)
- 2026-10-12 · RESOLVIDO · Estruturas = AAMLF → não conta como teste VEVOR; gate VEVOR mantém-se. · responsável
- 2026-10-12 · PENDENTE · Decisão transversal vinda do Item 7: a exposição destina-se a **espaços interiores**; em exterior, **máx. 4 horas** com acompanhamento de um responsável do projecto. Integrar no Manual (secções Antes da chegada / Durante a exposição) quando o Manual for regenerado. · responsável · handoff 7 §11

- 2026-10-13 · NOVO · Fatura VEVOR (2026-10-07, emitida à AAMLF) confirma **6 suportes** de poster dupla face, altura ajustável até 1905 mm — coerente com o kit «6 suportes VEVOR SW-03». Gate físico VEVOR mantém-se aberto. · DOC-FIN-008 (Item 13)

## Item 13 — Relatório CCDR
- 2026-10-12 · DECISÃO · Item retomado (pausa v0.17 levantada). · responsável
- 2026-10-12 · ALTERADO · v0.18: ACAO-03 → EXECUTADO (1.ª apresentação 10-10-2026); SESSAO-004; EVID-012…017; convite + Folha de Sala → UTILIZADOS. · `DIFF_v0.17_v0.18.md`
- 2026-10-12 · RESOLVIDO · v0.19: público 10-10 = ~50 participantes, representantes de diversos museus do Algarve (estimativa do responsável). · `DIFF_v0.18_v0.19.md`
- 2026-10-12 · NOVO · Contexto do orientador (privado): expectativa de intervenção oral a 10-10; orientador ausente. Não integrado no relatório.
- 2026-10-12 · PENDENTE · Direitos das fotos 10-10 · n.º de painéis · intervenção oral · estruturas · art. 16.º nos painéis · deslocação a São Brás.
- 2026-10-12 · NOVO · Contrapartida art. 16.º: menção «Apoiado pela CCDR Algarve, I.P.» aplicada em **prova** no Q12 (Item 1, prova v2; logótipo CCDR já presente na banda de parcerias). Por aprovar/imprimir; Q01–Q06 já impressos sem a menção textual. · Item 1 §11


- 2026-10-12 · RESOLVIDO · Fotos 10-10 = **Fernando Jácomo** (licença não especificada); reproduzidas EVID-013/014/016; EVID-015/017 continuam fora. · responsável
- 2026-10-12 · RESOLVIDO · **6 painéis** expostos · **estruturas da AAMLF** · **sem intervenção oral formal** (esclarecimentos individuais) · **deslocação não computada**. v0.20. · responsável · `DIFF_v0.19_v0.20.md`
- 2026-10-12 · ALTERADO · Art. 16.º: logótipo CCDR confirmado nos painéis/Folha de Sala/convite; menção textual «Apoiado pela CCDR Algarve, I.P.» só na ficha técnica do Q12 em reabertura → «em inclusão».
- 2026-10-12 · REMOVIDO · Pendências: público · direitos fotos · n.º painéis · intervenção oral · estruturas · deslocação.

- 2026-10-12 · DECISÃO · Parte do contexto da mensagem do orientador **ocultada do registo público** por decisão do responsável (protecção de pessoas); entradas anteriores redigidas. Excepção de privacidade ao append-only. Não reintroduzir. · responsável

- 2026-10-13 · RESOLVIDO · **DESP-004 deixa de ser placeholder**: fatura VEVOR (INDEPSALE TECHNOLOGY LIMITED, 20261007000185, 2026-10-07, emitida à AAMLF) — 6 suportes, **167,40 €** (era ~120 € provisório). DOC-FIN-008 no dossier privado. v0.21. · responsável (`Milreudocs/faturas/in4.pdf`) · `DIFF_v0.20_v0.21.md`
- 2026-10-13 · ALTERADO · Totais: realizadas **1.734,64 €** · doc. fiscal **1.626,41 €** · prova pgto 839,71 € · **a integrar 465,36 €** (era ≈513 €). Texto da síntese passa a calcular do dataset.
- 2026-10-13 · PENDENTE · Prova do pagamento online da fatura VEVOR.
- 2026-10-13 · ALTERADO · `DOCUMENTACAO_EM_FALTA.md` secção E (desactualizada desde v0.5) corrigida: só faltam prova remanescente painéis, fatura definitiva filamentos, prova pgto VEVOR, evidência das 50 cópias da Folha de Sala.

- 2026-10-13 · ALTERADO · **Correcção DESP-005**: as 100 impressões A4 cor (30,00 €) da fatura Auchan …/000343 = **50 Folhas de Sala F/V** (antes atribuídas por engano ao convite). Pagamento = talão Mastercard (DOC-FIN-007b). v0.22. · responsável · `DIFF_v0.21_v0.22.md`
- 2026-10-13 · RESOLVIDO · Evidência de pagamento das 50 cópias da Folha de Sala (fatura + talão já no dossier).
- 2026-10-13 · PENDENTE · Documento da **impressão do convite ao inquérito** (já não suportado pela fatura Auchan); finalidade das 103 cópias PB a confirmar.

- 2026-10-13 · RESOLVIDO · Convite ao inquérito = **103 cópias a preto e branco, formato A5** (5,15 €, fatura Auchan …/000343, DESP-005). «Teste PB» abandonado. v0.23. · responsável · `DIFF_v0.22_v0.23.md`

- 2026-10-14 · RESOLVIDO · **Fatura definitiva 3DJake** (R49010013926102460, 2026-10-13, 108,23 €, «já paga») → DOC-FIN-009; proforma DOC-FIN-003 SUPERSEDED. Todas as despesas com documento fiscal (1.734,64 €); prova pgto 947,94 €. v0.24. · responsável · `DIFF_v0.23_v0.24.md`
- 2026-10-14 · DECISÃO · DESP-004 (VEVOR): sem prova documental de pagamento além da fatura (privacidade); **não mencionar no relatório**. · responsável
- 2026-10-14 · REMOVIDO · Pendência «folhas de presença» — não exigida pelo art. 13.º n.º 1 c) do Aviso (só n.º de sessões e público); tinha sido acrescentada internamente.
- 2026-10-14 · NOVO · **Anexo IV oficial preenchido** (versão preliminar): 7 faturas, total 1.734,64 €; «objeto do apoio» = total realizadas; gerador `anexo_iv_oficial_fill.py`, saída e dados com NIF em `_private/anexo-iv/`. · pedido do responsável
- 2026-10-14 · NOVO · Pendências art. 14.º n.º 1 explicitadas (AAMLF): autorização SS, autorização AT, RCBE, fatura/recibo à CCDR 2.200 € (cab. 83 / comp. 1132) até 2026-11-15.
- 2026-10-14 · PENDENTE (EM ANDAMENTO) · Prova do remanescente dos painéis; despesas adicionais (465,36 €). · responsável

- 2026-10-14 · DECISÃO · **Regra de valores:** cada despesa vale **sempre o valor da fatura, em euros** (variações de cobrança no cartão não contam). · responsável
- 2026-10-14 · DECISÃO · **Valor total do projecto = Museu + Circuito**; «Documentando Milreu» pode ser citado, **não computado**. · responsável
- 2026-10-14 · ALTERADO · Sessões **abertas** (sem bilheteira/registo de presenças). 10-10: ~50 no encontro **+ visitantes do Museu do Traje ao longo do dia** (não contabilizados). v0.25. · responsável · `DIFF_v0.24_v0.25.md`
- 2026-10-14 · DECISÃO · Documentos do art. 14.º n.º 1 b)–e): o responsável envia ao interlocutor da AAMLF (mensagem + e-mail), que remete à CCDR. Fora do âmbito de produção do relatório. · responsável
- 2026-10-14 · PENDENTE · **Divergência de público:** responsável indicou Fev 15 / Abr 12; Anexo A regista Fev «nove participantes» (+2 convidados não inscritos? +4 visitantes não-participantes) / Abr «aproximadamente quinze». Valores do Anexo A mantidos até decisão.
- 2026-10-14 · PENDENTE · Valor total do projecto: Circuito = 8.480 € (soma das rubricas) ou 8.580 € (total impresso no orçamento v0)? Hoje 13.966 € (5.486 + 8.480).

- 2026-10-14 · RESOLVIDO · **Valor total do projecto = 13.966,00 €**, conforme o declarado nos formulários submetidos nos Serviços Online (n.º 182 Programação/Circulação e n.º 188 Protocolo, 18-04-2026: «Custo total do projeto» e «Total despesas previstas» = 13.966,00 €) = Museu 5.486 + Circuito 8.480. Os 8.580 € são só o total impresso no anexo «orçamento ccdr.pdf» (gralha de 100 € interna ao anexo). Anexo IV e relatório já correctos. · Milreudocs/CCDR/candidatura
- 2026-10-14 · NOVO · As autorizações de consulta SS e AT (art. 14.º n.º 1 b) e c)) já foram anexadas pela AAMLF às candidaturas de 18-04-2026; podem ser reenviadas/actualizadas. Faltam RCBE e fatura/recibo à CCDR.

- 2026-10-14 · DECISÃO · Público de Fevereiro e Abril = **valores do Anexo A** (07-02: 9 presentes, 25 inscrições; 11-04: ~15 participantes). Divergência encerrada; relatório já usava estes valores (sem alteração). · responsável

- 2026-10-14 · DECISÃO · **Placeholder das despesas adicionais = orçamento Gráfica Ossónoba n.º 20261056** (DESP-008): 470,00 € s/ IVA + IVA 23 % ≈ **578,10 €**; prevista, fatura a emitir **à AAMLF** (orçamento está em nome do responsável). Realizadas 1.734,64 + previstas 578,10 = **2.312,74 €** (≥ 2.200). Anexo IV oficial só com faturas (DESP-008 entra com a fatura). v0.26. · responsável · `DIFF_v0.25_v0.26.md`
- 2026-10-14 · PENDENTE · Fatura da Gráfica Ossónoba (orçamento 20261056) — «em breve»; valor definitivo = o da fatura (IVA incluído).

- 2026-10-14 · DECISÃO · Apresentar despesas **acima do apoio** (2.200 €) não é problema — a **CCDR filtra** o objeto do apoio. Frase na síntese financeira; Anexo IV «objeto do apoio» = total apresentado. v0.27. · responsável

- 2026-10-14 · NOVO · O roll-up da DESP-008 (orçamento 20261056) é o banner institucional do Item 14. · responsável

## Item 14 — Banner institucional
- 2026-10-14 · DECISÃO · **Formato = roll-up**, como no orçamento Gráfica Ossónoba n.º 20261056: «Roll Up com tela, medida 2,00 mt × 0,85, imp. a cores frente, entregue com suporte e mala de transporte» (105,00 € s/ IVA; DESP-008 no Item 13). Pendência «lona com ilhós vs rollup» resolvida. · responsável
- 2026-10-14 · PENDENTE · Confirmar com a gráfica a especificação do ficheiro para roll-up (área visível vs zona recolhida na base/topo, sangria) antes do envio da arte 850×2000.

- 2026-10-14 · DECISÃO · **Linguagem institucional:** relatório sem jargão de sistema (ex.: «regras canónicas»), sem códigos internos nem rótulos de «preliminar»; só se marca o que é previsto/placeholder. · responsável
- 2026-10-14 · DECISÃO · **Seguir sempre o texto do orçamento/fatura** nas descrições das despesas (DESP-008 = designações do orçamento 20261056). · responsável
- 2026-10-14 · ALTERADO · v0.28: relatório reescrito (10 secções alinhadas com o art. 13.º n.º 1; 9 páginas); ficheiro sem sufixo PRELIMINAR; mantida 1 frase sobre a adenda (art. 13.º n.º 3). Anexos: só cabeçalho/rodapé revistos. · `DIFF_v0.27_v0.28.md`
- 2026-10-14 · PENDENTE · Rever a linguagem do texto interno dos Anexos A–F (ainda com códigos e termos técnicos).

- 2026-10-14 · RESOLVIDO · Fotos de 10-10 de pernas para o ar (relatório p. 5 e Anexo A): rotação EXIF aplicada aos derivados. · responsável
- 2026-10-14 · ALTERADO · v0.29: anexos A–F reescritos em linguagem institucional; **pacote de entrega** em `_private/entrega/` (relatório + A–F + Anexo IV .xls), com Anexo E contendo as **faturas e comprovativos** e Anexo A com o relatório de eventos (08-10-2026). Versão pública dos anexos sem dados fiscais. · responsável · `DIFF_v0.28_v0.29.md`
- 2026-10-14 · NOVO · Programação da exposição em **Estoi (30-10 a 06-11-2026, inauguração 30-10 às 21h00)** incluída no relatório (secção 8) e no Anexo C, lida do `evento.json` do Item 8. · responsável
- 2026-10-14 · PENDENTE · O relatório de eventos anexado (Anexo A) tem «Preliminar» no próprio título — confirmar se há versão final.

- 2026-10-15 · NOVO · Documento FlixBus (reserva #3403942071, emitido 15-10-2026, comprador AAMLF NIF 517897717): deslocação Coimbra → Faro 16-10-2026 e regresso 16/17-10 do investigador, para testar as novas estruturas metálicas e validar as provas na gráfica. Bruto 29,49 + 12,49 + taxa 0,99 = 42,97 €; lugares 0,00 €. Guardado como DOC-FIN-010 (cofre privado). **Não integrado ainda.** · responsável
- 2026-10-15 · PENDENTE · Cada fatura FlixBus mostra «Voucher de crédito: −X € · Total: 0,00 €» (pago com voucher) — confirmar a origem do voucher antes de apresentar 42,97 € como despesa; e data do relatório (≥ 17-10) para redigir a deslocação no passado.

- 2026-10-15 · RESOLVIDO · Bilhetes FlixBus: o responsável declara ter **pago com o seu cartão**; integrado como **DESP-009 = 42,97 €** (valor das faturas), deslocação da equipa (art. 12.º/1/d). Nota interna: os documentos mostram «Voucher de crédito … Total 0,00 € · Já pago por: Apple Pay». · responsável
- 2026-10-15 · DECISÃO · Deslocação de 16/17-10 **redigida no passado**; data do relatório passa a **17-10-2026**. v0.30: realizadas 1.777,61 € + previstas 578,10 € = 2.355,71 €; Anexo IV oficial com 8 faturas (nome sem PRELIMINAR). · responsável · `DIFF_v0.29_v0.30.md`
- 2026-10-15 · PENDENTE · Confirmar após 16-10 que a deslocação, os testes das estruturas e a validação das provas decorreram como descrito (o relatório já os dá como realizados).

## Item 11 — Manual do Expositor (cont.)
- 2026-10-15 · NOVO · Deslocação do investigador a Faro **planeada para 16-10-2026** para **testar as novas estruturas metálicas** (VEVOR) e validar provas na gráfica — possível execução do gate de validação física. Registar o resultado do teste quando ocorrer. · responsável (Item 13, DESP-009)

- 2026-10-16 · DECISÃO · O relatório de eventos **não** é anexado na íntegra; em vez disso, síntese (objectivos, participação, contributos, resultados, relação com Museu de Memórias e Circuito Educativo) no relatório §3.1 e no Anexo A. · responsável
- 2026-10-16 · NOVO · v0.31: 9 novas evidências (EVID-018…026: estruturas AAMLF, montagem, ganchos, público [só entrega], novos suportes testados na gráfica a 16-10, modelo 3D); sistema expositivo (AAMLF ≈2 m vs novos suportes ≈1 m retrácteis, combináveis); cabeça de Milreu 3D com Jorge de Sena; adesivos do orçamento 20261056. 11 páginas. · responsável · `DIFF_v0.30_v0.31.md`
- 2026-10-16 · PENDENTE · Texto concreto de Saramago sobre a cabeça não verificado — só se refere a ligação Estói/Milreu ↔ *Viagem a Portugal* (Rota Literária do Algarve). Se o responsável tiver a passagem (edição/página), acrescentar.

- 2026-10-16 · DECISÃO · Explicitar que as despesas apresentadas são as **seleccionadas para o apoio** e que há **outros custos não apresentados** (pré-apoio; não faturados à AAMLF; pessoais/não elegíveis, ex. água aos participantes): deslocações/alojamento/alimentação+água ≈200 € · ads ≈500 R$ · site 35 €/ano · Claude+Photoshop ≈150 US$/mês · SurveyMonkey ≈100 R$/mês · armazenamento/filamentos extra/impressões pré-apoio por apurar → «pelo menos cerca de 850 €», ~1/3 Circuito. v0.32 (relatório §7.3 + Anexo F §5). · responsável · `DIFF_v0.31_v0.32.md`
- 2026-10-16 · PENDENTE · Revalidar o total: com assinaturas desde fevereiro (9 meses) ultrapassa 1.500 €; 850 € ≈ 2–3 meses. Confirmar nº de meses e quota imputável ao projecto (Claude/Photoshop, SurveyMonkey) e valores dos itens por apurar.

- 2026-10-16 · RESOLVIDO · Assinaturas Claude e SurveyMonkey = **6 meses** → outros custos não apresentados **≥ ~1.190 €** (Claude+Photoshop ≈ 780 €, SurveyMonkey ≈ 96 €, restantes 315 €). v0.33. Pressuposto: Photoshop também 6 meses (no mesmo valor de 150 US$/mês). · responsável

- 2026-10-16 · ALTERADO · Outros custos não apresentados: assinaturas **10 meses** (não 6); armazenamento = **rateio 10 % da quota Google (90 R$/mês) × 10 meses ≈ 14 €** (digital, não material físico); filamentos adicionais ≈ 50 €; impressões ≈ 50 €; água ≈ 10 € (investigador 190 €) → **≈ 1.890 €** (aproximado, ~1/3 Circuito). v0.34. · responsável · `DIFF_v0.33_v0.34.md`

- 2026-10-16 · DECISÃO · Documento orientado **por compra/fatura** (uma linha por documento); a despesa n.º 9 ganha subtabela com as 8 linhas do orçamento 20261056 + **linha de IVA 23 % estimado** (108,10 €); reconciliar com a fatura quando chegar. v0.35 (relatório 7.1 + Anexo D; `data/orcamento_20261056.csv`). · responsável · `DIFF_v0.34_v0.35.md`
- 2026-10-16 · PENDENTE · Reconciliação da despesa n.º 9 com a fatura da Gráfica Ossónoba (linhas, IVA, total) e entrada no Anexo IV oficial.

- 2026-10-16 · DECISÃO · Abordagem da despesa n.º 9 (linha única + detalhe do orçamento + IVA separado) **aprovada** pelo responsável; aplicar o mesmo padrão a futuras despesas previstas com orçamento. · responsável

- 2026-10-16 · RESOLVIDO · Fatura **Gráfica Ossónoba FAC A/80365** (16-10-2026, AAMLF) = **571,95 €** (465,00 + IVA 106,95) substitui o orçamento 20261056; DESP-008 passa a realizada («Faturada»). Diferenças: **sem «Adesivo do projecto»** (25 €); **lona A0** 40 € (era 59,4×42, 20 €). Realizadas **2.349,56 €**; Anexo IV oficial com 9 faturas. v0.36. · responsável · `DIFF_v0.35_v0.36.md`
- 2026-10-16 · PENDENTE · Pagamento da FAC A/80365 (estado «a confirmar»); adesivo do projecto (não faturado) — será faturado à parte?
- 2026-10-16 · PENDENTE (EM DISCUSSÃO) · Comprovativo da 2.ª prestação dos painéis. · responsável
- 2026-10-16 · RESOLVIDO · Deslocação de 16-10, teste dos suportes e validação das provas **realizados como descrito** no relatório. · responsável
- 2026-10-16 · NOVO · Redigido o pedido ao interlocutor da AAMLF com os documentos do art. 14.º n.º 1 (SS, AT, RCBE, fatura/recibo 2.200 € à CCDR NIPC 517638827, cab. 83 / comp. 1132, até 15-11-2026); tipologia de apoio a confirmar. · esta sessão

- 2026-10-16 · RESOLVIDO · «Adesivo do projecto» **incorporado pela gráfica** (sem custo) — pendência removida. · responsável
- 2026-10-16 · NOVO · **Pagamentos previstos até 31-10-2026:** FAC A/80365 (571,95 €) junto com a **2.ª prestação** da FAC A/80286 (pagamento: 500 € no acto + restante a 30 dias). Relatório: DESP-001 «Paga parcialmente», DESP-009(n.º 9) «Faturada; pagamento até 31-10-2026». v0.37. · responsável · `DIFF_v0.36_v0.37.md`
- 2026-10-16 · RESOLVIDO · Galerias públicas = agenda do portal, «Eventos realizados» (`projectomilreu.pt/#/exposicoes`: 07-02, 11-04, 10-10) — ligações no relatório §4 e Anexo A. (Fonte canónica no projecto: `public/data/exhibitions-public.json`.) · responsável
- 2026-10-16 · PENDENTE · Comprovativos dos pagamentos de 31-10 → actualizar situação para «Paga» e Anexo E.

- 2026-10-16 · DECISÃO · **Documento e pacote FECHADOS (v1.0)** para entrega: sem placeholders; pagamentos à Gráfica Ossónoba «no final de outubro de 2026, conforme plano de pagamento acordado»; **sem juízos de elegibilidade** (só natureza das despesas; CCDR decide); Anexo IV com «Total despesas objeto do apoio» **em branco** (preenchimento CCDR); Anexo C enriquecido; Anexo F corrigido; revisão visual de todas as páginas. Pacote: `docs/relatorio-execucao-ccdr-2026/_private/entrega/`. · responsável · `DIFF_v0.37_v1.0.md`
- 2026-10-16 · PENDENTE (fora do documento) · Comprovativos dos pagamentos do final de outubro (2.ª prestação FAC A/80286 + FAC A/80365) → adenda; documentos do art. 14.º via interlocutor da AAMLF; adenda final (art. 13.º n.º 3) com a conclusão da itinerância e do Circuito Educativo.

- 2026-10-19 · NOVO · v1.1: **capítulo 1 sobre a AAMLF** (fonte aamlf.pt + candidatura) e secções renumeradas; **apresentações programadas** com histórico (III ENEP 5–7/11 UAlg; V CAAP 18–21/11 UMinho; Jornadas da Rede de Museus do Algarve 20/11 Alcoutim). Pacote de entrega actualizado. · responsável · `DIFF_v1.0_v1.1.md`
- 2026-10-19 · RESOLVIDO · Data das Jornadas da RMA = **20-11-2026** (dados da página do Município de Alcoutim + Algarve Atlas), não 19-11. · cm-alcoutim.pt

- 2026-10-21 · RESOLVIDO · **Pagamento de 1.191,25 € à Gráfica Ossónoba** (transferência 21-10-2026, DOC-FIN-012) = 2.ª prestação FAC A/80286 + FAC A/80365 → **todas as 9 despesas pagas**; relatório datado de **21-10-2026**. v1.2. · responsável · `DIFF_v1.1_v1.2.md`
- 2026-10-21 · NOVO · Mensagem do interlocutor da AAMLF: pede que fique referenciada no orçamento uma verba de **500 € de despesas administrativas e deslocações/transporte da AAMLF**, mesmo não paga, «como financiamento da AAMLF». Avaliação entregue ao responsável; **não integrado** até decisão (forma: contributo próprio valorizado, fora do registo de despesas/Anexo IV). · AAMLF
- 2026-10-21 · NOTA · Na pasta de entrega existe `1- RELATORIO_EXECUCAO_CCDR_2026.pdf` = cópia da v1.0 (sha256 8656caaa…), não gerada pela sessão; a versão actual é `RELATORIO_EXECUCAO_CCDR_2026.pdf`.

- 2026-10-21 · DECISÃO · Os 500 € da AAMLF são **custo real** suportado pela Associação/interlocutor (não pelo investigador) → **linha final** na composição financeira: realizadas 2.349,56 + AAMLF 500,00 = **2.849,56 €** (apoio 2.200). Valor declarado pela Associação, **sem documentos → fora do Anexo IV**. Menções à AAMLF acrescentadas no cap. 1 e §8.2. v1.3. · responsável · `DIFF_v1.2_v1.3.md`
- 2026-10-21 · PENDENTE (opcional) · Se a AAMLF tiver documentos dessas despesas (bilhetes, recibos), podem entrar no Anexo IV e no Anexo E como as restantes.

- 2026-10-21 · ALTERADO · Montante **500,00 €** explícito nas menções à AAMLF (cap. 1 e §8.2), a pedido do responsável. v1.4. · responsável

- 2026-10-27 · ALTERADO · v1.5 — apontamentos da AAMLF (26-10): (1) cap. 1 com **todos os órgãos sociais 2025–2028** (sem destaque à Tesoureira); (2) **Rede de Museus do Algarve não teve papel no 2.º Encontro** — encontros anuais de iniciativa exclusiva dos 3 grupos de amigos de museus do Algarve (AAMLF incluída), edição acolhida pelo Museu do Traje; frase de «promotora» retirada (corrige registo de 2026-10-19 baseado na viralagenda); (3) **9.as Jornadas RMA**: poster apresentado **pela AAMLF em representação do investigador**. · AAMLF/responsável · `DIFF_v1.4_v1.5.md`

- 2026-11-10 · NOVO · A pedido (CCDR/AAMLF): enviados os **ficheiros originais** (não consolidados) das 9 faturas + 3 comprovativos de pagamento, cópias byte-a-byte verificadas por SHA-256, em `docs/relatorio-execucao-ccdr-2026/_private/entrega/faturas_originais/` (+ `faturas_originais.zip`). Excluídos: proforma 3DJake (substituída) e nota de entrega. · responsável

## Item 4 — Poster A0 (19-10)
- 2026-10-27 · NOVO · Jornadas RMA = **9.as Jornadas**; o poster será **apresentado pela AAMLF em representação do investigador responsável**. · AAMLF
- 2026-10-19 · DECISÃO · **Poster 4 → Jornadas da Rede de Museus do Algarve**, 20-11-2026, 9h30, Espaço Guadiana, Alcoutim (org. Rede de Museus do Algarve + Município de Alcoutim; sessão «Arqueologia para todos: mediação e comunicação do património»). Formato/título do congresso agora definidos quanto ao evento. · responsável

## Item 12 — Poster 2 (19-10)
- 2026-10-19 · DECISÃO · **Poster 12 → V CAAP** (18–21/11/2026, UMinho), **poster + comunicação sobre os desafios da implementação** do projecto; sessão de posters 19-11, 17h00–17h30. · responsável

## Item 14 — Banner (16-10)
- 2026-10-16 · NOVO · Roll up 2,00 × 0,85 m faturado (Gráfica Ossónoba FAC A/80365, 105,00 € s/ IVA), entregue a 16-10-2026. · Item 13

## Item 1 — Painéis (16-10, fatura)
- 2026-10-16 · NOVO · Autocolantes de correcção (vinil 3992,2 × 455,2 mm ×5; 880 × 60 mm ×20) faturados (FAC A/80365) e entregues a 16-10-2026. «Adesivo do projecto» 40 × 40 mm **não** consta da fatura. · Item 13

## Item 17 — Modelagem 3D
- 2026-10-16 · NOVO · Cabeça incluída no relatório CCDR (Item 13, §3.4 + Anexo A §4) com declaração de IA. Referência **verificada**: poema «Cabecinha romana de Milreu», Jorge de Sena, *Metamorfoses* (1963) (Poetry International; Isabel Pires de Lima, *Metamorfoses* v.16 n.3, 2019). Saramago: só a ligação Estói ↔ *Viagem a Portugal* (Rota Literária do Algarve) — passagem sobre a cabeça **não verificada**. · Item 13
- 2026-10-16 · NOVO · Responsável: modelo digital concluído; filamentos ainda não chegaram; **próximos passos: réplicas dos bustos de Adriano e de Agripina Menor** (Milreu). · responsável

## Item 11 — Manual do Expositor (16-10)
- 2026-10-16 · RESOLVIDO · Novos suportes VEVOR **testados** com painel na gráfica a 16-10-2026 (fotografias IMG_0107/0111/0112 = EVID-022…024). Registar se o teste fecha o gate de validação física (decisão humana). · responsável
- 2026-10-16 · NOVO · Paradigma das estruturas (responsável): AAMLF ≈2 m, sólidas, de grande presença, para espaços amplos; VEVOR desmontáveis, regulável até 1905 mm, retrácteis ≈1 m, para espaços/logística condicionados; combináveis. Ganchos: 3–4 por painel, com reposição. · responsável

## Item 1 — Painéis (16-10)
- 2026-10-16 · NOVO · Adesivos de correcção dos painéis (orçamento Gráfica Ossónoba 20261056: «Mapas» 5 × 3992,2 × 455,2 mm; «Logótipos» 20 × 880 × 60 mm) e «Adesivo do projecto» (200 × 40 × 40 mm) para distribuição — a faturar à AAMLF. · responsável (Item 13)

## Item 8 — Cartaz local
- 2026-10-27 · PENDENTE · Recomendação da AAMLF: os **convites** (e todos os documentos) devem referir o **envolvimento da AAMLF, o seu principal parceiro e o nome da candidatura** («Projecto Comunitário de Milreu / Museu sem fronteiras»). Rever convites/cartazes do Item 8; identificar qual é o «principal parceiro» (a confirmar com o responsável). · AAMLF
- 2026-10-14 · NOVO · A programação de Estoi (`evento.json`) é lida pelo relatório CCDR (Item 13, secção 8 e Anexo C) — alterações às datas/horário devem ser feitas só no `evento.json` e o relatório regenerado. · Item 13

## Itens 2, 2B, 3, 4, 5, 7, 8, 9, 12, 14
- 2026-10-12 · NOVO · Registo incremental iniciado; sem alterações nesta data.

## Item 2 — Website
- 2026-10-12 · RESOLVIDO · «E-mail do formulário» já operacional (2026-10-05; função implantada @ `43f20ad` = HEAD). · handoff 2 §11
- 2026-10-12 · RESOLVIDO · Falha CI `09C.1` não reproduzida (44/44 checks `success` no HEAD `1339188`). · API GitHub
- 2026-10-12 · NOVO · Build de produção com `environment:"local"` + perfil de deployment estático desactualizado (SEC-P0-010, informativo) → correcção no L2. · handoff 2 §11
- 2026-10-12 · NOVO · Dependência externa: o Dossiê (Item 7, P4) imprime o URL e um QR para `projectomilreu.pt/#/participar/expor`. Qualquer mudança desta rota exige redirect (`route-governance`). · handoff 7 §11
- 2026-10-12 · NOVO · Faixa de Logos canónica no site (Junta na posição 4, intervalo único, 2 linhas canónicas), commit `08b177f` na branch `feat/item2-faixa-logos-site` — sem push (bloqueado pelo controlo de permissões; aguarda autorização). · handoff 2 §11
- 2026-10-12 · PENDENTE · Push/PR/merge + deploy do site; autorização da Junta em `PROVENIENCIA.txt`.
- 2026-10-12 · ALTERADO · PR #127 (faixa de logos) MERGED em `main` (`04b5a14`) pela conta do responsável — não pelo Claude; correcção do botão fixo (`53a8eb6`) ficou fora do merge. Site live inalterado. · handoff 2 §11
- 2026-10-12 · RESOLVIDO · Merge do PR #127 **feito pelo responsável** (confirmado). CI em `04b5a14` = 44/44 `success`. · responsável + API GitHub
- 2026-10-12 · NOVO · PR #130 (correcção do botão no Museu) aberto, sem merge; preflight do 1.º deploy com o novo `07d-pages` preparado (não executado). · handoff 2 §11
- 2026-10-12 · RESOLVIDO · CI do PR #130 = **45/45 `success`**; mergeable `clean`. Aguarda merge humano. · API GitHub
- 2026-10-12 · RESOLVIDO · PR #130 **MERGED pelo responsável** → `main` = `04de24c` (inclui também #131, só `docs/`). Conteúdo do site a publicar face ao live: 4 ficheiros (logo Junta, PROVENIÊNCIA, `layout.js`, `app.css`). Preflight do deploy em finalização (aguarda CI do HEAD). · responsável + git
- 2026-10-12 · NOVO · CI do `main` `04de24c` = 44/44 `success`. **Preflight do 1.º deploy com o novo `07d-pages` COMPLETO** (cópia no cofre `…/2026-10-12_P0_L1/`); deploy NÃO executado — aguarda autorização. · API GitHub
- 2026-10-12 · RESOLVIDO · **DEPLOY VERIFIED**: run `38269296943`, `04de24c` publicado; live em `production`/demo desligada/`noindex`; faixa de logos canónica e botão do Museu verificados em desktop e mobile. · handoff 2 §11
- 2026-10-13 · NOVO · Agenda `#/exposicoes` melhorada (pedido directo ao Claude): próximos/realizados pela hora do servidor, freguesia/município/Maps, partilha, páginas de detalhe com fotos; eventos 07-02, 11-04, 10-10; 4.º destaque na Home. PR #137 (sem merge). · handoff 2 §11
- 2026-10-13 · ALTERADO · CI do PR #137: 40/45 + 5 falhas E2E (`e2e-playwright`, `carousel-e2e`, `banner-geometry-e2e`, `08j-ci-quality`, `role-profile-e2e`) — só expectativas de browser fixadas em 2 destaques visíveis; caixa igual (0px) e sem overflow confirmados. Corrigido em `9f8c24b` (`scripts/e2e/run-browser-e2e-08j.mjs`, `tests/e2e/portal/home-carousel.spec.mjs`: 2 → 3 visíveis). Lição: procurar expectativas também em `tests/e2e/` e `scripts/e2e/`. · logs CI
- 2026-10-13 · RESOLVIDO · CI do PR #137 após correcção (`9f8c24b`) = **45/45 `success`**; aguarda merge humano e depois deploy autorizado. · API GitHub
- 2026-10-13 · RESOLVIDO · PR #137 **MERGED pelo responsável** → `main` = `f8a2c37`. Face ao live (`04277c8`): só os ficheiros da agenda/carrossel + 29 imagens em `public/media/events`; workflows inalterados. Deploy por autorizar. · responsável + git
- 2026-10-13 · NOVO · Site público sem texto técnico/demonstração/processo interno (pedido directo do responsável): PR #139 (649/649; 63 páginas re-auditadas). · handoff 2 §11
- 2026-10-13 · RESOLVIDO · CI do PR #139 = **51/51 `success`**, mergeable `clean`; aguarda merge humano. CI do `main` `f8a2c37` (agenda #137) = 44/44. Deploy por autorizar (publicará #137 + #139 juntos, se #139 for integrado antes). · API GitHub
- 2026-10-13 · RESOLVIDO · **Publicado** (`601125b`, run 38410125645): agenda melhorada + site sem texto técnico/demonstração; verificado no live (63 páginas limpas). · handoff 2 §11
- 2026-10-13 · NOVO · PR #140 (MM202617 sem frase de processo interno), CI 45/45; aguarda merge + publicação. · handoff 2 §11
- 2026-10-13 · RESOLVIDO · PR #140 publicado (`2b24eba`); MM202617 verificada no live. · handoff 2 §11
- 2026-10-13 · NOVO · PR #141: Área Colaborativa carregada a pedido; JS público −64 % (≈291 KB); orçamento redefinido; CI 46/46. · handoff 2 §11
- 2026-10-13 · RESOLVIDO · PR #141 merged (`15fc28c`); publicação por autorizar. · handoff 2 §11
- 2026-10-13 · DECISÃO · Três melhorias pedidas directamente pelo responsável:
  - estatística: Umami Cloud, sem cookies;
  - agenda em gaveta lateral;
  - modo escuro a seguir o dispositivo, com botão. · handoff 2 §11
- 2026-10-13 · NOVO · PRs abertos, sem merge:
  - #142: gaveta da agenda, CI 45/45;
  - #143: modo escuro + ADR-DS-009;
  - #144: estatística preparada e desligada. · handoff 2 §11
- 2026-10-13 · PENDENTE · Conta Umami (responsável) · revisão do texto de privacidade · orçamento CSS 195 KB · merges + publicação. · handoff 2 §11
- 2026-10-13 · RESOLVIDO · #142/#143/#144 merged (`main` = `86c9281`); conjunto testado (656/656). Publicação por autorizar. · handoff 2 §11
- 2026-10-13 · RESOLVIDO · **Publicado** (`86c9281`, run 38442922561): Área Colaborativa só carregada quando é precisa, gaveta da agenda e modo escuro verificados no site; estatística publicada desligada. Pendente: conta Umami + texto de privacidade. · handoff 2 §11
- 2026-10-14 · NOVO · PR #146: agenda — botão «Ver cartaz e detalhes» + «Encontros anteriores» na gaveta dos eventos por realizar. · handoff 2 §11
- 2026-10-14 · NOVO · Conta Umami criada pelo responsável; PR #149 liga a estatística. Sem dados anteriores à activação. · handoff 2 §11
- 2026-10-14 · RESOLVIDO · Estatística **ligada e publicada** (`936cf03`); recolha verificada no site. PR #151 corrige o funil do Museu (`#/museu`). · handoff 2 §11
- 2026-10-14 · NOVO · Relatório de visitas: PR #152 (gerador, merged) + tarefa agendada semanal (quartas 09h10; 1.º a 21-10). Linha reposta a 2026-10-15: tinha-se perdido numa edição paralela. · handoff 2 §11
- 2026-10-15 · NOVO · **Item 2C:** relatório comparativo 14/10 vs 15/10 (32 → 7 visitantes; dias incompletos). Museu é o destino principal (44–57 %); Agenda 14–16 %; Inquérito 1 clique. · handoff 2 §11
- 2026-10-15 · NOVO · Preflight do deploy do site OK (CSP, 22 rotas, readiness redigido). ⚠️ Formulário «Quero expor» publicado em falha: projecto Supabase com NXDOMAIN (provável pausa). · handoff 2 §11
- 2026-10-15 · NOVO · **Incidente P0 «Quero expor»:** projecto Supabase em NXDOMAIN (provável pausa; configuração correcta; funcionou a 05-10). PR #164: alternativa por e-mail sem perder dados + calendário de datas ≥ hoje + obrigatórios assinalados. Confirmar/reactivar no painel Supabase. · handoff 2 §11
- 2026-10-15 · NOVO · L8: PR #165, monitorização a cada 30 min do endpoint do «Quero expor» (DNS/TLS/CORS/função; alertas por issue). Sem alterações de produção. · handoff 2 §11
- 2026-10-15 · RESOLVIDO · **Publicado e verificado** `ef76826` (deploy `7097431382`): continuidade do «Quero expor» em produção (alternativa por e-mail, calendários ≥ hoje, obrigatórios, sem duplicados), CSP, readiness redigido. Formulário ainda sem entrega (Supabase NXDOMAIN). L8 activo. · handoff 2 §11
- 2026-10-15 · NOVO · PR #166: e-mail alternativo com os 12 campos + mensagem revista. Supabase: NXDOMAIN; causa mais provável = pausa por inactividade de BD (Free), recorrente. Retomar no painel + decisão estrutural. · handoff 2 §11

## Item 2B — Segurança
- 2026-10-12 · NOVO · Auditoria P0 read-only (workflows, endpoints, CSP) → validação com API GitHub read-only → `P0 AUDIT COMPLETE / NO PATCHES APPLIED`. Relatórios só no scratchpad da sessão `d4d07cf9` (efémero). · handoff 2B §11
- 2026-10-12 · REMOVIDO · `docs/security/AUDIT_P0_2026-10-12.md` (temporário, não versionado, sem informação única). · responsável
- 2026-10-12 · ALTERADO · Afirmações anteriores corrigidas: secrets são repo-level (não por environment); «Quero expor» sem rate-limit/Turnstile; `staging` inexistente; `production` sem revisores; `main` sem protecção. · API GitHub
- 2026-10-12 · DECISÃO · Iniciar remediação pelo L1 (governança GitHub); preparação autorizada; aplicação e migração de secrets NÃO autorizadas. · responsável
- 2026-10-12 · NOVO · Plano L1 (L1-01…L1-13) pronto: ruleset `main` (sem force-push/eliminação; PR com 0 aprovações; checks diferidos até ao L2), `production` com reviewer = admin + branch `main`, migração de 6 secrets em gate próprio, domínio/2FA/token humanos; proposta de **não** criar `staging`. · handoff 2B §11
- 2026-10-12 · PENDENTE · Aprovação por ID do L1; cópia segura de `SUPABASE_ACCESS_TOKEN`/`EXPOR_RESEND_API_KEY`; verificação do domínio; 2FA; persistência dos relatórios.
- 2026-10-12 · NOVO · L1 fase 1 aplicada via API e verificada: ruleset `main-baseline` (sem eliminação/force-push; PR obrigatório com 0 aprovações; sem required checks), Dependabot alerts e private vulnerability reporting activados, política `None` removida do `github-pages`; L1-06: `production` só a partir de `main`. Secrets/variables/environments inalterados. → `L1 PHASE 1 APPLIED / ADMINISTRATIVE VERIFIED`. · handoff 2B §11
- 2026-10-12 · NOVO · Relatórios integrais no cofre privado `Milreudocs/SEGURANCA/2026-10-12_P0_L1/`; 3 versões públicas expurgadas em `docs/security/audits|plans/` (sem commit). · handoff 2B §11
- 2026-10-12 · PENDENTE · `require_extra_approval_for_unattributed_changes` (default do GitHub, não pedido); L1-06b; revisão das versões públicas; L2.
- 2026-10-12 · NOVO · L1-06b aplicado: `production` com revisor obrigatório (admin único), `prevent_self_review:false`, bypass admin permitido, só `main`. Fase 1 do L1 encerrada. · handoff 2B §11
- 2026-10-12 · NOVO · L2 desenvolvido em branch dedicada (3 commits, sem push): SEC-P0-001 eliminado (13/13; controlo main 0/13), 007/008/009/010/012 corrigidos, guarda de staging; 641/641, validate OK, actionlint/zizmor 0. · handoff 2B §11
- 2026-10-12 · ALTERADO · Versões públicas expurgadas revistas semanticamente (sem commit). · handoff 2B §11
- 2026-10-12 · PENDENTE · Push/PR do L2 (e verificação da regra `require_extra_approval_for_unattributed_changes` nesse PR); L1-07…13; L3–L6.
- 2026-10-12 · DECISÃO (interpretada) · «Seguir com o ponto de segurança» → tentado push da branch L2 + abertura de PR; **push bloqueado** pelo controlo de permissões (escrita em sistema externo). Nada publicado; aguarda autorização explícita. · sessão
- 2026-10-12 · ALTERADO · PR #128 (L2) MERGED em `main` (`a85f401`) pela conta do responsável, antes do CI concluir — não pelo Claude. Dependabot: 18 alertas Pillow (`requirements-media.txt`). · handoff 2B §11
- 2026-10-12 · RESOLVIDO · Merge do PR #128 **feito pelo responsável** (confirmado). CI em `a85f401` e `04b5a14` = 44/44 `success` (L2 sem regressões no CI). · responsável + API GitHub
- 2026-10-12 · NOVO · L1-07 preparado (nomes de job únicos; branch local sem push); Pillow (18 alertas, `requirements-media.txt`) registado como pendência da ferramenta local de media; `deployment-readiness.json` público com `blockingItems` registado como achado P3. · handoff 2B §11
- 2026-10-12 · RESOLVIDO · Novo `07d-pages` validado em produção (build sem escrita; deploy só `Pages: write`; `environment: production`). SEC-P0-009/010 fechados. · handoff 2B §11
- 2026-10-13 · NOVO · L1-07: PR #132 aberto (60/60 `success`, mergeable); 44 required checks propostos e verificados em PRs de docs, código e workflows; regra administrativa preparada, não aplicada. · handoff 2B §11
- 2026-10-13 · NOVO · **L1-07 APPLIED / ADMINISTRATIVE VERIFIED / BEHAVIORAL VALIDATION PENDING**: `main` = `0e1e849`; ruleset `main-baseline` com 44 required checks (app GitHub Actions), regras anteriores preservadas. · handoff 2B §11
- 2026-10-13 · RESOLVIDO · **Validação comportamental do L1-07**: no PR #137 (primeiro PR legítimo após a regra), com checks a correr, `mergeable_state = blocked` — o merge fica impedido até os checks terminarem. · API GitHub
- 2026-10-13 · RESOLVIDO · L1-07 validado também em falha: PR #137 com 5 checks falhados ficou `blocked` (merge impedido) até à correcção. · API GitHub
- 2026-10-15 · NOVO · Pillow 12.3.0 → PR #153 (18 alertas; outputs idênticos byte a byte). Plano L1-08/09 pronto, sem secrets alterados. Estado `PILLOW PR READY / L1-08-09 MIGRATION PLAN READY / NO SECRETS CHANGED`. · handoff 2B §11
- 2026-10-15 · NOVO · #153 merged (Dependabot 0 abertos). PR #154 preflight B2 (não destrutivo) + PR #155 isolamento do staging; plano L1-08/09 revisto (token com âmbito, Resend só de envio, 8 gates). Nenhum secret alterado. · handoff 2B §11
- 2026-10-15 · NOVO · Migração L1-08/09 em espera. PRs autónomos: #156 (preflight honesto), #157 (cobertura de isolamento), #158 (CodeQL, 0 achados), #159 (Actions por SHA), #160 (L3 «Quero expor»), #161 (CSP), #162 (`deployment-readiness` redigido). Estado `SECURITY HARDENING PRs READY / NO PRODUCTION CHANGES / SECRETS MIGRATION ON HOLD`. · handoff 2B §11
- 2026-10-15 · RESOLVIDO · #156–#162 merged; `main` `285a26e` CI 46/46. CodeQL: 20 alertas JS/TS (1 no site, baixo). PR #163 do Dependabot com majors: não integrar tal como está. L3 pronto no código, deploy pendente. Secrets inalterados. · handoff 2B §11
- 2026-10-15 · NOVO · L3 parado até à recuperação do Supabase; produção congelada (incidente «Quero expor»). · handoff 2B §11
- 2026-10-15 · RESOLVIDO · CSP e readiness redigido em produção; L3 (função) por publicar; secrets inalterados. · handoff 2B §11

## Item 12 — Poster de Congresso 2
- 2026-10-12 · DECISÃO · Logótipo do Projecto junto ao título, com maior destaque (sobreposição; corpo legado intacto). · responsável · handoff 12 §11
- 2026-10-12 · ALTERADO · Gerador + SVG/preview regenerados na branch `feat/item12-logo-titulo` (sem commit). · handoff 12 §11
- 2026-10-12 · PENDENTE · Logo duplicado na barra de parcerias? · formato oficial AAP. · responsável

## Item 7 — Dossiê «convite ao convite»
- 2026-10-12 · DECISÃO · Rever a **ordenação da exposição** na P3 considerando estruturas metálicas como as da montagem de 10-10 (fotografia de referência do responsável, não versionada); as estruturas são usadas só **frente e verso** (1 painel por face). · responsável
- 2026-10-12 · DECISÃO · A opção **triangular não é opção** (por agora). Ramo de diagrama triangular removido do gerador da proposta. · responsável
- 2026-10-12 · NOVO · **Proposta P3 v2** (HUMAN GATE): ordenação frente/verso — 6 estruturas, ida pela frente Q1→Q6, regresso pelo verso Q7→Q12, Q1/Q12 costas com costas (coerente com Item 11, pares S1–S6); diagramas «Em linha» e «Em ziguezague». Em `docs/dissemination/dossie-convite/proposta_p3_v2/` (gerador + preview P3, reprodução byte-idêntica verificada). PDFs finais **não** regenerados. · esta sessão
- 2026-10-12 · REMOVIDO · Da P3 (proposta): diagrama «núcleos 2+2+3» e bloco «Montagem autónoma — em desenvolvimento» (esquema conceptual). · esta sessão
- 2026-10-12 · DECISÃO · Suportes próprios = os 6 VEVOR, **ainda em teste** — **não** mencionar marca/modelo nem estado de teste no dossiê; retirar «a caminho». Texto: «Suportes próprios. Solução mais simples, também de dupla face, mediante apontamento.» · responsável
- 2026-10-12 · DECISÃO · Estruturas AAMLF «mediante consulta à AAMLF sobre disponibilidade» e **presas entre si** → diagrama ziguezague = AAMLF; diagrama em linha = suportes próprios (isolados). · responsável
- 2026-10-12 · DECISÃO · Novo bloco **AMBIENTE**: «A exposição destina-se a espaços interiores. Em exterior, apenas por um período máximo de 4 horas e com o acompanhamento de um responsável do projecto.» Checklist: «espaço interior · dimensões / área disponível». · responsável
- 2026-10-12 · REMOVIDO · Fotografia da montagem (exterior, 10-10) testada na P3 e **retirada** («não gostei da imagem»); a informação de ambiente mantém-se. Reafirma «NÃO inserir fotos dos expositores». · responsável
- 2026-10-12 · PENDENTE · HUMAN PASS da P3 v2 → transpor para o gerador final, regenerar DIGITAL/PRINT/LIVRETO + QA_REPORT → PR. · responsável
- 2026-10-12 · DECISÃO · Confirmado pelo responsável: logo do Projecto junto ao título; logo do congresso excluído (a entrada DECISÃO anterior antecedeu esta confirmação). · handoff 12 §11
- 2026-10-12 · DECISÃO · Material dos painéis confirmado pelo responsável: **«PVC expandido, impressão em vinil laminado»** (linha sob o título da P3). Espessura **não** indicada (não confirmada). **Peso não indicado** no dossiê (sem registo; não é informação necessária para o convite). · responsável
- 2026-10-12 · RESOLVIDO · **HUMAN PASS da P3 v2** («confirmado — gerar versões finais»). P3 v2 integrada em `final/editaveis/dossie_generator.py`; regenerados previews P3 (PNG+SVG, 300 dpi), prancha, **DIGITAL**, **PRINT** (CMYK/OutputIntent/TrimBox) e **LIVRETO_A4**. P1/P2/P4 byte-idênticas. QA_REPORT actualizado. · esta sessão
- 2026-10-12 · ALTERADO · `_PRANCHA_FINAL.png` substituída pela prancha actual — a versionada estava desactualizada (pré-2026-10-06, ainda com diagramas linear/costas/triangular). · esta sessão
- 2026-10-12 · REMOVIDO · Pasta temporária `dossie-convite/proposta_p3_v2/` (não versionada) — conteúdo integrado no gerador final. · esta sessão
- 2026-10-12 · PENDENTE · Commit/PR das versões finais (HUMAN GATE) · prepress CMYK/ICC da gráfica · prova física QR/livreto (mantêm-se). · responsável

- 2026-10-12 · NOVO · Prova aprovada → ficheiro final `final/print/poster_congresso2_C_final.pdf`/.png (≈218 dpi @ 841 mm, RGB, sem sangria). Pendente: `(n=385)`→`(532 respostas)` no PSD; FASE B. · handoff 12 §11
- 2026-10-12 · DECISÃO · P4: incluir a **ficha técnica** como no Q12 (Item 1) — Investigação, design e produção · Fernando Rodrigues de Jácomo | Coordenação institucional · Meira Pinto (AAMLF) | Curadoria · Grupo de voluntários do Projecto Comunitário de Milreu (3 colunas de peso igual, mesma ordem). Supera, neste item, a forma «Interlocutor da AAMLF». · responsável
- 2026-10-12 · DECISÃO · Contactos: Meira Pinto **ao lado** do responsável, com o e-mail. Usado `museu.lyceu@aejdfaro.pt` (único e-mail associado a Meira Pinto no repositório — institucional da AAMLF; nenhum e-mail pessoal registado). · responsável
- 2026-10-12 · DECISÃO · Encaminhar os pedidos para o **site, opção «Quero expor»** (`projectomilreu.pt/#/participar/expor`, rota canónica; página verificada publicada). · responsável
- 2026-10-12 · ALTERADO · P4 refeita: blocos COMO PEDIR (texto + URL + **QR → formulário**), CONTACTOS (2 colunas), FICHA TÉCNICA (3 colunas). Espaçamentos compactados; rodapé na posição original. PDFs DIGITAL/PRINT/LIVRETO, prancha e previews regenerados; P1/P2 inalteradas. 7 hyperlinks. · esta sessão
- 2026-10-12 · REMOVIDO · Bloco «PARCERIA E ACOMPANHAMENTO» da P4 (parágrafo «O desenvolvimento e a circulação das iniciativas de 2026 contam com a colaboração da AAMLF…» + «AAMLF · Meira Pinto — Interlocutor da AAMLF»); a AAMLF passa a figurar nos contactos, na ficha técnica e na barra de parcerias. · esta sessão
- 2026-10-12 · NOVO · `editaveis/QR_quero_expor.{png,svg}` (QR do formulário). `QR_projectomilreu.*` mantém-se inalterado (canónico, Itens 10/11). `dossie_finalize.py`: QR do formulário + `collect_editaveis` corrigido. · esta sessão
- 2026-10-12 · RESOLVIDO · Pendência cosmética do `collect_editaveis` (SameFileError) corrigida. · esta sessão
- 2026-10-12 · PENDENTE · Prova física do **novo QR** (formulário) · commit/PR (HUMAN GATE) · prepress CMYK/ICC. · responsável


## Item 8 — Cartaz local
- 2026-10-12 · DECISÃO · **Primeiro evento real do cartaz:** Junta de Freguesia de Estoi · exposição 30-10 → 06-11-2026 · **inauguração sábado 31-10, 14h00** (linha de destaque) · horário da Junta (2.ª–6.ª 9h00–12h00 / 14h00–18h00; encerrado ao fim-de-semana excepto inauguração) · entrada livre · morada «Largo Ossónoba · 8005-454 Estoi» (confirmada pelo responsável) · logótipo anfitrião = `~/Downloads/Logo_Estoi.jpeg` tal como está (sha256 `a0788fc3…`; outra sessão trata do logótipo definitivo). · responsável
- 2026-10-12 · NOVO · **Prova A3/A4** gerada em scratchpad (`item8_estoi/`; cópia do gerador com campo `DESTAQUE`, linha «Com o apoio de» só em demo, altura da imagem 0.405 A3 / 0.365 A4); guarda `final=True` PASS. Master **não alterado**. · esta sessão
- 2026-10-12 · PENDENTE · HUMAN GATE da prova · confirmar datas (abertura sexta 30-10 vs. inauguração sábado 31-10) · logótipo Estoi definitivo (fundo branco/transparência) · teste físico do QR · prepress da gráfica · commit/PR. · responsável
- 2026-10-12 · NOVO · SVG + PDF/PNG com sangria 3 mm (TrimBox no PDF). PENDENTE: título legado a ~1,4 mm do corte no topo (decisão no PSD). · handoff 12 §11
- 2026-10-12 · ALTERADO · Datas corrigidas pelo responsável: exposição **abre sábado 31-10** (inauguração 14h00) → 06-11-2026; prova A3/A4 regenerada com «31 de Outubro — 6 de Novembro de 2026». Resolve a pendência «abertura 30-10 vs. 31-10». · responsável
- 2026-10-12 · ALTERADO · Imagem principal: MM202601 substituída por fotografia da **equipa reunida** (decisão do responsável) — candidatas `Milreudocs/imagem dos eventos/Evento_Abril*.JPG` (roda de conversas 11-04-2026 = EVID-010/011; direitos Fernando Jácomo); provas V1/V2 em scratchpad, a escolher. ⚠ resolução baixa p/ impressão (1280×842 / 1600×900 px ≈ 107–134 ppi no A3). · responsável
- 2026-10-12 · ALTERADO · **Correcção:** a imagem pedida é a **MM202613 «Theodor Hauschild e equipa de escavadores em Milreu», ca. 1981** (não as fotografias EVID-010/011 — interpretação errada, descartada). Crédito canónico do índice: «Coleção de Maria de Lurdes Mendes Martins; fotografia providenciada por Celeste Pimenta e Branca Pimenta». Original 3508×2481 px; enquadramento vertical av=0.9. Prova A3/A4 regenerada. · responsável
- 2026-10-12 · NOVO · **PR #122** aberto (branch `feat/item7-p3-p4-ordenacao-quero-expor`, commit `0d6827c`): P3 v2 + P4 + PDFs/prancha/QR. Só ficheiros do dossiê; ESTADO/handoff fora do PR (alterações de outras sessões). Merge = decisão humana. · https://github.com/fernandojacomoarchaeologist/milreucommunityproject/pull/122
- 2026-10-12 · RESOLVIDO · PR #121 MERGED. · ALTERADO · Faixa canónica (Junta de Estoi pos. 4) aplicada → PR #125. PENDENTE: autorização Junta · art. 16.º no poster · alinhamento da faixa. · handoff 12 §11

## Item 16 — Relatório de Apoio Institucional
- 2026-10-14 · NOVO · Gerador + handoff versionados no PR #147 (branch `feat/item16-relatorio-apoio`); PDFs mantêm-se em `_private/`. Merge = decisão humana. · responsável

## Item 17 — Modelagem e impressão 3D (experimento)
- 2026-10-14 · NOVO · Item 17 aberto: preparar 1.º experimento de impressão numa impressora Flashforge do responsável; software e material gratuitos; ficheiros podem ser públicos. · responsável
- 2026-10-14 · DECISÃO · Objecto: réplica da «cabecinha» de Milreu (Cabeça Feminina, MNA) por via B (IA imagem→3D), com divulgação obrigatória «modelo interpretativo assistido por IA — não equivale ao original». Filamento recomendado: PLA mate 1,75 mm, tom pedra. · responsável
- 2026-10-14 · NOVO · Fonte base: fotografia **CC0 do Museu Nacional de Arqueologia** (Wikimedia Commons, 1875×2500, sha256 3b668cd5…). Vistas de Á. M. Felicísimo (CC BY 2.0) descarregadas como referência, ainda não usadas. A imagem de 4 faces dos Downloads (500×165, autoria desconhecida) fica só como referência visual. Blender 5.2.2 LTS instalado em ~/Applications (checksum oficial OK). · esta sessão
- 2026-10-14 · REMOVIDO · Modelos gerados com Hunyuan3D-2 apagados: a licença Tencent **exclui a UE** (e o uso dos resultados fora do território). Não usar Hunyuan3D. · esta sessão
- 2026-10-14 · PENDENTE · Gerar com modelo MIT (TRELLIS ou TripoSG): os espaços gratuitos do Hugging Face recusam pedidos anónimos (erro de quota ZeroGPU). Altura real da peça não confirmada; o texto colado com «poema»/citação de Saramago não está verificado e não serve de fonte. · responsável
- 2026-10-14 · DECISÃO · Medida real **29 × 19,1 × 22,7 cm** (ficha MNA 994.6.3, raiz.museusemonumentos.pt) — substitui «20 cm» do texto colado. · responsável
- 2026-10-14 · NOVO · 5 vistas Commons (MNA CC0 ×2, Steele/Felicísimo CC BY 2.0, Sailko CC BY 3.0) → TRELLIS multi-imagem (MIT) gerado pelo responsável. v1 `stochastic` aceite para teste; v2 `multidiffusion` rejeitada. STL de teste 80 mm em `docs/impressao-3d/cabecinha-milreu/`; handoff `HANDOFF_ITEM_17_modelagem_3d.md`. Sem commit. · esta sessão
- 2026-10-14 · PENDENTE · Escala final (29 cm em 2 partes vs ~21 cm) · imagens usadas na geração a confirmar · filamento por chegar · Orca-Flashforge por instalar. · responsável
- 2026-10-14 · DECISÃO · Item 17: v3 TRELLIS (imagens 1–5) adoptada; **escala real 29 cm em 2 partes coladas** com pinos Ø6 mm; STLs em `docs/impressao-3d/cabecinha-milreu/modelo/`. Sem commit. · responsável
- 2026-10-14 · RESOLVIDO · PR #147 (Item 16) MERGED `f9c9ecf` · PR #148 (Item 17) MERGED `2a4b5ef`. · responsável
- 2026-10-15 · NOVO · Item 17: trança da nuca reconstruída (declarada) a partir da fotografia MNA; STLs regenerados; skill `modelo-3d-impressao`; pesados só locais. Sem commit. · esta sessão
- 2026-10-15 · PENDENTE · Item 17: rosto (nariz/boca) aguarda quota HF para TRELLIS.2; interior do laço + caracol direito feitos; STLs regenerados. Sem commit. · esta sessão
- 2026-10-15 · DECISÃO · Item 17: coque não automatizável com fidelidade (v5/v7/v8/v9 não aprovadas; limitações registadas no handoff). Preparada cena de escultura com 4 câmaras calibradas (`docs/impressao-3d/cabecinha-milreu/escultura/`). Sem commit. · responsável
- 2026-10-15 · NOVO · Item 2 · Pacote A (P0) PR #167: aviso de falha do «Quero expor» visível ao abrir corrigido (`[hidden]` + estados); CI 48/48. · sessão
- 2026-10-15 · NOVO · Item 2 · Pacote B PR #168: declaração de finalidade em vez de «Li a informação de privacidade»; proposta RGPD documental, com decisões humanas pendentes; CI 48/48. · sessão
- 2026-10-15 · NOVO · Item 2 · Pacote C PR #169: avaliação anónima por corações no Museu; partilha implementada e **desligada** até decisão sobre direitos. · sessão
- 2026-10-15 · NOVO · Item 2B: pacotes A/B/C sem novas origens CSP, SDKs ou dados pessoais nos eventos; pendente decisão RGPD do formulário. · sessão
- 2026-10-15 · RESOLVIDO · Item 2 · PRs #167/#168/#169 merged (`main` = `48aad47`, CI 46/46); deploy do site pendente de autorização. · API GitHub
- 2026-10-15 · RESOLVIDO · Item 2 publicado (`48aad47`): correcção do aviso «Quero expor», declaração de finalidade e corações do Museu em produção; partilha desligada. · sessão
- 2026-10-15 · NOVO · Item 17: v10 (fusão TRELLIS.2 frente+trás) aprovada condicionalmente; v15 = refino de superfície + renders barro/mármore, aguarda aprovação antes dos STL. Sem commit. · responsável
- 2026-10-15 · NOVO · Item 2: teste dos formulários no site real; «Quero expor» e filtros OK; **contributos em modo demonstração dão falsa confirmação** (pendente decisão). · sessão
- 2026-10-19 · NOVO · Item 2: visitas 13–19/10 = 84 únicos (Museu 38, Agenda 10, Inquérito 2); Supabase activo; keep-alive pendente de decisão (precisa de chave anon em secret). · sessão
- 2026-10-20 · NOVO · Item 18 aberto: template PPT do Projecto (`docs/dissemination/template-apresentacao/`), 19 slides/8 layouts, tokens v0.2, Faixa de Logos na capa/parcerias/fecho, 16 imagens sugeridas (recortes sem alteração tonal) + CSV de créditos; handoff `HANDOFF_ITEM_18_template_apresentacao.md`. Sem commit. · esta sessão
- 2026-10-20 · NOVO · Item 18: 1.ª derivação do template — comunicação «O arqueólogo e a manutenção da memória» (`derivacoes/comunicacao-arqueologo-memoria/`): 11 slides (capa + 8 cronometrados + bibliografia + fecho), talking points e bibliografia RPA do responsável nas notas, referências autor–data no rodapé, 12 imagens recortadas com CSV de créditos, QR validado para projectomilreu.pt. Template inalterado (layouts exportados por `build_template.js`, saída verificada idêntica). Sem commit. · esta sessão
- 2026-10-20 · ALTERADO · Item 18 / derivação «arqueólogo e memória» v0.2 (v0.1 mantida): texto afinado para não sobre-afirmar (slides 1, 7, 8), legenda de certeza ligada ao vocabulário da ficha (slide 6), Estácio da Veiga vs foto de 1897 clarificado (slide 2), ortografia pré-AO90 coerente nas notas, nota de ritmo no slide 1 (~170 palavras/min). Bibliografia revista (RPA, itálicos) e verificada: DOIs Moser/Tully (Crossref), Thomas pp. 14–30 e Introdução de Moshenska pp. 1–13 (substitui a entrada do livro), Pinho & Freitas 2.ª ed. revista, Teichner 2001 (vol. 19, edit. 2003). PENDENTE: co-autoria de Virgílio Correia em «Arqueologia: normas gerais» (catálogo consultado só indica Raposo e Martins). Sem commit. · esta sessão
- 2026-10-20 · NOVO · Item 18 / derivação «arqueólogo e memória»: `NOTA_DE_CORRECAO_v0.2.md` com o que não foi encontrado ou diverge da fonte, e sugestões (não aplicadas): (1) Hauschild & Teichner 2002, p. 13 dá início das escavações sistemáticas em 1971, sob IAA + FA-UTL + Museu Monográfico de Conímbriga, sem nomear Hauschild → corrigir slide 2; (2) co-autoria de V. Correia em «Arqueologia: normas gerais» não encontrada; (3) números 19 / 6–7 sem registo no repositório (Anexo D); (4–5) páginas citadas não conferidas no texto; (6–7) opcionais Teichner [2003] e handle da dissertação. · esta sessão
- 2026-10-20 · ALTERADO · Item 18 / derivação ENEP v0.3 (v0.1/v0.2 mantidas), conforme `NOTA_DE_RESOLUCAO_v0.3.md`: capa com título oficial do Programa do III ENEP (5-11-2026, 15h45, Painel 2); slide 2 «desde 1971» (Hauschild & Teichner 2002, p. 13) mantendo a direcção de Hauschild (Teichner 1997, p. 107, dossiê RPA); slide 4 Anexo D p. 2 (19 membros até Junho/2026; média 6–7 por etapa); slide 6 com o vocabulário e exemplos da ficha MM202613 (Anexo C), sem a data 1981; bibliografia com Teichner 1997 e o handle da dissertação; Anexos C/D à parte como dados primários. Co-autoria de V. Correia mantida. PENDENTE: data da MM202613 no índice do Museu diverge do Anexo C (revisão de registo); confirmar arquivo da autorização da MM202614. Sem commit. · responsável + esta sessão
- 2026-10-20 · PENDENTE · Museu / MM202613: **proposta de revisão por campo da datação** em `docs/museum/revisions/PROPOSTA_MM202613_DATACAO_2026-10-20.md`. Registo canónico e índice dizem «ca. 1981, segundo hipótese de Cristina Farias» (herdado do site preliminar); o Anexo C (ficha MM202613) diz «ca. 1970s · possible» e só regista a sugestão de 1981 de C. Farias na ficha MM202614 («segunda fotografia»). Alternativas: A1 «ca. década de 1970» (1970–1979, década); A2 «ca. década de 1970 – início da década de 1980» (início 1970, fim a decidir); B manter 1981 com evidência nova. **Nada alterado**; aguarda escolha do responsável + revisão editorial → direitos → publicação; derivados (índice, canais, JSON-LD, seed) a regenerar só depois. Materiais com «ca. 1981» sinalizados (cartaz Estoi 30-10, kit de imprensa, banner). Sem commit. · sessão (pedido do Item 18)
- 2026-10-20 · DECISÃO · Museu / MM202613: o responsável escolheu **ainda não decidir** a datação. Proposta fica PENDENTE; registo e derivados inalterados. · responsável
- 2026-10-21 · DECISÃO · Museu / MM202613: responsável escolheu a **alternativa B — manter «ca. 1981, segundo hipótese de Cristina Farias»**. Proposta fechada; registo canónico, derivados e materiais inalterados. Ficam por tratar: Anexo C (ficha MM202613 diz «ca. 1970s») a corrigir na próxima versão; slide 6 do ENEP v0.3 («ca. década de 1970 · possível») diverge agora do registo — decidir no Item 18; referência do testemunho de C. Farias para a MM202613 a acrescentar às fontes quando indicada. Sem commit. · responsável
- 2026-10-21 · ALTERADO · Item 18 / derivação ENEP v0.4 (v0.1–v0.3 mantidas), conforme `NOTA_DE_RESOLUCAO_v0.4.md`: ligação ao tema «Patrimónios rurais» nas notas (slides 3 e 9); legenda MM202606 «posterior a Estácio da Veiga (década de 1870)»; diagnóstico 2024 com 532 respostas + 9 entrevistas (dados canónicos de 06-10); catalogação reformulada (fichas inspiradas nas Normas; CIDOC CRM como referencial conceptual; «testemunhos orais»); MM202613 «facultada por» (não «cedida»), certeza por afirmação, decisão de 21-10 sobre 1981 nas notas; discussão como leitura do caso; bibliografia em 2 páginas legíveis com DOI de capítulo (Moshenska, Thomas). Co-autoria de V. Correia confirmada na ficha técnica do IPM (encerrada). PENDENTE: papéis na proveniência da MM202613, âmbito das autorizações (gravação/publicação), fac-símile de Teichner 1997 p. 107, evento de 31-10. Sem commit. · responsável + esta sessão
- 2026-10-21 · ALTERADO · Item 18 / derivação ENEP v0.5 (v0.1–v0.4 mantidas), por indicação do responsável: slide 3 com três quadrantes iguais (século XIX · segunda metade do século XX · actualmente — diagnóstico 2024 + roda de conversas de 07-02-2026, com hipótese); «Anexo C/D» retirado de todos os slides (substituído por «inventário do Museu de Memórias / registos de curadoria, em preparação»; mantém-se só nas notas do orador); slide 9 simplificado em três frases curtas; slide 4 «uma das iniciativas» + «exemplos do acervo · 2 de 31 fotografias». Sem commit. · responsável
- 2026-10-22 · ALTERADO · Item 18 / derivação ENEP v0.6 (v0.1–v0.5 mantidas), por pedido do responsável: novo slide 2 «Milreu e o Projecto Comunitário de Milreu» — sítio (villa romana em Estoi; pars urbana, pars rustica e edifício religioso; ocupação romana, paleocristã e islâmica; casa rural até meados do séc. XX — Hauschild & Teichner 2002, pp. 8–9, 12; Monumento Nacional sob tutela do Património Cultural, I.P.) e projecto (definição canónica; iniciativas Museu de Memórias, «Entre Ruínas e Memórias», Circuito Educativo; 3 pilares); imagem MM202608 (recorte de margem). Fala ~30 s → total ~10 min. Datas de classificação (1910/1932 divergem entre fontes) e distância a Faro omitidas. Sem commit. · responsável
- 2026-10-22 · NOVO · Item 2: 88 visitantes únicos 14–22/10 (Museu 38, Agenda 11, Inquérito 2); procura quase nula desde 16/10; Supabase activo. · sessão
- 2026-10-22 · NOVO · Item 17: v17 refino do cabelo posterior (superfície, ≤0,78 mm) — aguarda avaliação; sem STL nem commit. · esta sessão
- 2026-10-22 · NOVO · Item 17: v18 limpeza localizada do cabelo posterior — aguarda decisão; sem STL nem commit. · esta sessão
- 2026-10-22 · DECISÃO · Item 17: v18 aprovada/congelada (cabelo posterior); oval = retoque manual localizado posterior (pendência assumida); segue por zonas: cabelo lateral → rosto → orelhas → base. · responsável
- 2026-10-22 · NOVO · Item 17: zona 1 (cabelo lateral) v19 — caracóis frente às orelhas + limpeza; aguarda avaliação. · esta sessão
- 2026-10-22 · DECISÃO · Item 17: v19 aprovada (zona 1); caracol esquerdo = reconstrução interpretativa por simetria; atrás das orelhas → zona 3; oval → retoque manual posterior; inicia zona 2 (túneis + rosto). · responsável
- 2026-10-22 · NOVO · Item 17: zona 2 v20 — túneis fechados + limpeza do rosto; pendente decisão nariz/queixo partidos. Sem commit. · esta sessão
- 2026-10-22 · DECISÃO · Item 17: v20 aprovada (zona 2); opção (a) — fracturas do nariz e queixo reproduzidas (inteiros = reconstrução implícita IA, rejeitada para a versão principal). · responsável
- 2026-10-22 · NOVO · Item 17: v21 — fracturas do nariz e queixo (estado actual); aguarda avaliação. Sem commit. · esta sessão
- 2026-10-22 · ALTERADO · Item 17: v21 rejeitada; v22 = lasca do nariz no lado direito, 3 variantes, aguarda escolha. Sem commit. · esta sessão
- 2026-10-23 · NOVO · Item 2: «Quero expor» testado no site real (envios interceptados) = PASS em computador e telemóvel; função activa. · sessão
- 2026-10-26 · NOVO · Item 2: 103 visitantes únicos desde 14/10 (12 em 23–26/10); Supabase activo. · sessão
- 2026-10-29 · NOVO · «Quem é Quem?» (peça por numerar; `docs/dissemination/quem-e-quem/`): folheto A4 frente/verso para levar para casa — frente = as duas fotografias numeradas (A1–A38, B1–B31, numeração de 2026-10-29 ainda por validar) a 125 mm de largura; verso = 3 passos, grelha de 9 linhas, «quem preenche» opcional, caixa RGPD com o texto da UAlg fornecido verbatim pelo responsável (DPO rgpd@ualg.pt) e assinatura. Devolução «no local onde o recebeu» (decisão do responsável). Sem logótipos (só texto, como o cartaz A3). Geradores versionados em `source/generators/` (`build_folheto.py` reutiliza `build_a3.py`). PDFs RGB + CMYK genérico com sangria 3 mm em `print/`. Sem commit; aguarda aprovação. · responsável + esta sessão
- 2026-10-29 · PENDENTE · «Quem é Quem?»: validar numeração das fotografias; crédito/direitos das fotografias para esta recolha; o texto RGPD da UAlg refere «formulário de inscrição» (verbatim) — confirmar se se mantém; alternativa de formato = A3 dobrado (fotos a 190 mm) se a legibilidade a 125 mm for insuficiente. · esta sessão
- 2026-10-29 · ALTERADO · «Quem é Quem?» folheto A4: verso abre com «Porque pedimos isto?» (fotografias do Museu de Memórias; conversar com quem esteve nas escavações ou as conheceu; recolher histórias e memórias do período para o livro de memórias do Projecto), pedido do responsável; grelha passa de 9 para 8 linhas. Regenerado em `arte/` + `print/`. Sem commit. · responsável + esta sessão
- 2026-10-29 · ALTERADO · «Quem é Quem?» folheto A4: parágrafo de parceria no verso, a seguir ao «Porque pedimos isto?» — recolha integra as iniciativas 2026 do Projecto, «em parceria com a Associação dos Amigos do Museu do Lyceu de Faro (AAMLF)», candidatura «Projecto Comunitário de Milreu / Museus sem Fronteiras», «apoiada pela CCDR Algarve, I.P.» (pedido do responsável; ver regra AAMLF 2026-10-26). Linhas da grelha 9,2 → 8,0 mm para caber. Regenerado em `arte/` + `print/`. Sem commit. · responsável + esta sessão
- 2026-10-29 · ALTERADO · «Quem é Quem?» folheto A4: passo 3 passa a «Devolva o folheto preenchido no local onde o recebeu — ou tire uma fotografia às duas faces e envie para a78190@ualg.pt» (decisão do responsável). Linhas da grelha 7,8 mm. Regenerado em `arte/` + `print/`. Sem commit. · responsável + esta sessão
- 2026-11-01 · NOVO · Item 2: fotografias da inauguração de 30-10 + modo slide em ecrã inteiro (PR #172, por aprovar). · sessão
- 2026-11-01 · NOVO · Item 2: #172 publicado; PR #173 (CSS −4,8 KB + sobreposição no imersivo) e PR #170 (Actions) prontos para merge, CI verde. · sessão
- 2026-11-03 · NOVO · Item 2: protótipo de jogo «Detetives da Memória» (só HML, PR draft #174); HML privado no link registado no handoff do Item 2. · sessão
- 2026-11-03 · ALTERADO · Correcção: PR do «Detetives da Memória» = #176 (não #174). · API GitHub
- 2026-11-03 · NOVO · Item 2: Detetives v0.2 com fotografias reais (MM202615/621/614), recompensas e álbum, só HML (PR #176). MM202618 bloqueada (IA). · sessão
- 2026-11-03 · NOVO · Item 2: Detetives v0.3 «mesa de investigação» (lupa real, pistas invisíveis, cartões de objectos, guia, Caderno animado), só HML, PR #176 (`c1b6075`). Incidente de disco cheio recuperado sem perdas. · sessão
- 2026-11-03 · ALTERADO · Item 2: Detetives 0.3.1 com as correcções do responsável (textos sem suposições, resultado imediato, curiosidades da ficha, mapa de atenção local), só HML, PR #176 (`5119bb6`). · sessão
- 2026-11-10 · NOVO · Investigação / história do sítio: `docs/research/HISTORIA_DA_VILLA_DE_MILREU.md` v0.1 — síntese **século a século** (I a.C.–X d.C.) da villa de Milreu com citação de página para cada afirmação: fases A–I de Teichner, o que se construiu e como (lagares, peristilo, termas, triclinium, edifício de culto, mausoléus), economia e relação com Ossonoba (fundus 300–400 ha, azeite/vinho, porto e mercado), pessoas (proprietários anónimos, M. Acilius Balbus, Acte/Daphine/Daphinus, al-Hammi), bustos e datas (Agripina 56–58, Adriano 120–130, Galieno c. 260), mosaicos/opus sectile, cristianização e islão, imperadores reinantes (quadro de referência assinalado como não extraído das fontes). Fontes: Hauschild & Teichner 2002 (pp. 8–59, PDF privado), Teichner 2001 (área 21), Hauschild 2008 (aula), Teichner & Peña Cervantes 2010/11 (pp. 449–454), Bernardes 2011 (Ossónoba), Wielewski 2022 (fases em 2.ª mão), Jácomo 2025. 13 divergências entre fontes registadas (distância 7/9 km; fase C; data e função do edifício G; friso 50/67 m; inscrições séc. IX/X; casa rural XIV/XV/XVI; dolia 36/46–50; Plínio-o-Jovem **não** menciona Milreu; 407 Didimus/Veridianus só em 2.ª mão). Estado `preliminar · uso interno`; **nenhum PDF alojado no repo**. Sem commit (HUMAN GATE). · responsável + esta sessão
- 2026-11-10 · ALTERADO · Investigação / história do sítio: `docs/research/HISTORIA_DA_VILLA_DE_MILREU.md` v0.2 — aprofundamento de todas as secções a pedido do responsável (nova 2.1 paisagem/acessos/entrada; 3.1 Ossonoba; blocos «Aprofundamento» em 4.2–4.9; linhas novas nas tabelas 5, 7 e 13 — 13.14 FRONTINIANVS Milreu vs Astigi, 13.15 bispo séc. III vs IV; complementos em 6, 8, 9.1, 10, 12.1 e 14). Fontes relidas: HT02 pp. 8–13, 16–22, 53–59; H08 pp. 17–27. Sem commit (HUMAN GATE). · sessão
- 2026-11-11 · RESOLVIDO · Item 4 (poster A0): a prova impressa mostrava a regra separadora da Iniciativa 2 sobre as legendas das fotografias secundárias (impressão suspensa pelo responsável). Corrigida a geometria no gerador canónico (`poster_proof_print.py`, `y2` mínimo +10 unidades), pipeline de impressão versionado em `source/generators/poster_print_build.py` e ficheiros regenerados com data 2026-11-11 (SVG editável de corte e com sangria 5 mm; PDF vectorial com texto vivo e fontes embebidas; PDF 300 dpi; CMYK genérico interino). Os PDFs de 27-10 (que também tinham fontes erradas) ficam como histórico. Sem commit (HUMAN GATE). · responsável + esta sessão
- 2026-11-11 · ALTERADO · Item 4 (poster A0): segunda correcção — a frase de introdução das iniciativas quase tocava a fotografia (1 mm); agora 10 mm, com compensação de 2 mm antes de «Desenvolvimento em 2026» e 4 mm no rodapé (folga das referências mantida em 12,5 mm). Ficheiros 2026-11-11 regenerados. Sem commit. · responsável + esta sessão
- 2026-11-14 · NOVO · Item 18 / V CAAP: apresentação da comunicação 7.13 (Braga, 20-11-2026) em `docs/dissemination/template-apresentacao/derivacoes/comunicacao-caap-2026/` (PPTX + PDF v0.1, DRAFT, HUMAN GATE). Ver handoff do Item 18. · responsável + esta sessão
- 2026-11-14 · NOTA · Item 13 (Relatório CCDR): apontamento do Meira (secção 9) — a frase sobre a Rede de Museus como promotora do 2.º Encontro existia na v1.4 e já foi retirada na v1.5 (27-10); o pedido «alterar data para 2 de dezembro» não foi aplicado por não se saber a que data se refere (Jornadas RMA continuam a 20-11 nas fontes públicas; exposição de Estoi 30-10 a 6-11). Aguarda decisão do responsável. · esta sessão
- 2026-11-16 · NOVO · Item 1 (painéis): a MM202609 no Q05 não é de Milreu (fotografia de praia). Proposta de adesivo correctivo com a MM202608 no lugar; aguarda escolha do responsável e o PDF do Q05 para medir. O registo público MM202609 também precisa de revisão. Ver handoff do Item 1. · responsável + esta sessão
- 2026-11-16 · NOVO · Item 1: MM202608 decidida para o Q05; gerador do adesivo pronto e ensaiado no Q12; falta o PDF do Q05. Item 2: proposta de revisão do registo MM202609 (praia, não Milreu) em `docs/museum/revisions/`, por aplicar até se esclarecerem duas divergências. · responsável + esta sessão
- 2026-11-17 · NOVO · Item 4: notas de apresentação de 5 minutos para Meira Pinto (AAMLF) nas 9.as Jornadas RMA, em `docs/dissemination/poster-congresso/apresentacao-jornadas-rma/`. Detectado erro «AMLF» no rodapé do poster. Ver handoff do Item 4. · responsável + esta sessão
- 2026-11-17 · NOVO · **Item 19** (novo): candidatura de mediação cultural ao Ministério da Cultura, pelo Município de Faro / Museu Municipal, para o Circuito Educativo; prazo 08-12-2026. Ver `HANDOFF_ITEM_19_candidatura_mediacao_cultural.md`; materiais privados em `docs/project/candidatura-mediacao-cultural-2026/_private/`. · responsável + esta sessão
- 2026-11-17 · NOVO · Item 4: documento curto de pontos-chave para o Meira (`PONTOS_CHAVE_APRESENTACAO.md` + PDF de uma página). · responsável + esta sessão
- 2026-11-18 · NOVO · **CE001** (novo; numeração CE do Circuito Educativo): «Pedido de suporte» ao museu — análise e planeamento concluídos (fontes de 18-11 arquivadas com SHA-256, blueprints indexados, auditoria bibliográfica, coerência/viabilidade, materiais por actividade, plano de 13 capítulos, controlo de escrita PT-PT pré-AO90, lacunas). Escrita em Word por iniciar. Bloqueantes: destinatário vs. Item 19, destino dos bens, impressora/componente Circuito CCDR 2026. Ver `docs/project/handoff/HANDOFF_CE001_pedido_suporte.md` e `docs/circuito-educativo/`. Sem commit. · responsável + esta sessão
- 2026-11-18 · DECISÃO · CE001: impressora fora do pedido (recurso existente); sem kit de mosaico para levar para casa (reserva); tecido/tintas/cortiça/caixas/verniz no escopo; seguro e local das oficinas com os parceiros (Museu Arqueológico de Faro, AAMLF, Junta de Estoi); arranque na 1.ª semana de Fevereiro (ano a confirmar); caixas de plástico pretas (sem CE-BP-01); bibliografia em anexo, parecer crítico adoptado. Ver handoff CE001. · responsável
- 2026-11-18 · DECISÃO · CE001: caixas de plástico substituem a caixa de madeira de 1 m² nos três modelos de escavação; madeira, ferragens e verniz de madeira saem do pedido. Ver handoff CE001. · responsável
- 2026-11-18 · DECISÃO · CE001: arranque confirmado na 1.ª semana de Fevereiro de 2027, pelos mosaicos. · responsável
- 2026-11-18 · DECISÃO · CE001: destinatário Município de Faro / Museu Municipal de Faro (verificado); custos absorvidos definidos; origem nas entrevistas de 2024; caixa de plástico 32×40×50 cm; plástico bolha. Ver handoff CE001. · responsável
- 2026-11-19 · NOVO · CE001: arquivado o documento de adaptações etárias e de acessibilidade; públicos de idades diversas (6–8 … 18+, níveis flexíveis); texto e pictogramas obrigatórios; táctil em piloto; mesas acessíveis a cargo do anfitrião. Ver handoff CE001. · responsável
- 2026-11-19 · DECISÃO · CE001: os mosaicos não vão para casa; a impressora 3D é do investigador (fora do pedido); designação oficial nos dados formais, «Museu Arqueológico de Faro» aceite no texto. · responsável
- 2026-11-19 · DECISÃO · CE001: 2 tablets, no mínimo; bustos para uso académico e liberados; cronograma autofinanciado de 2 meses por acção (sem moedas, cadernos e oficina de montar). Ver handoff CE001. · responsável
- 2026-11-19 · CORRIGIDO · CE001: a estrutura de escavação de 1 × 1 m mantém-se (madeira, ferragens e verniz voltam ao pedido) e guarda-se em sacos ou na lona do fundo; as caixas de plástico são de arrumação. Todo o circuito entra nos dois cenários de cronograma. Ver handoff CE001. · responsável
- 2026-11-19 · DECISÃO · CE001: enchimento até 20–30 kg por caixa de escavação. · responsável
- 2026-11-19 · CORRIGIDO · CE001: o limite de 20–30 kg é por volume transportado; o enchimento reparte-se por contentores. · responsável
- 2026-11-21 · NOVO · CE001: novas componentes (livro com as crianças, passaporte cultural, quebra-cabeças, adolescentes, acessibilidade) analisadas: bibliografia A4, fichas A5, materiais A6. Perguntas F1–F9 abertas. Ver handoff CE001. · responsável + esta sessão
- 2026-11-21 · DECISÃO · CE001: perguntas F1–F9 respondidas (menores, livro de 50 pp. e 500 ex., passaporte de 500 × 20 pp., 10 quebra-cabeças, braille, adolescentes em 2027, cenário sem financiamento reduzido). Ver handoff CE001. · responsável
