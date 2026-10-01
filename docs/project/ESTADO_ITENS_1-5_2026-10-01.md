# Estado dos itens · Divulgação e produção · Projecto Comunitário de Milreu

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **DOCUMENTO VIVO (canónico de referência) — consultar e atualizar a cada evolução.** Última atualização: **2026-10-01**.
> **Âmbito:** documentação de estado (o que é · o que foi feito · como · histórico · estado da última versão). Cobre os itens 1–6.
> **Método:** baseado em ficheiros do repositório, datas, documentos de decisão e verificações diretas. Estados reportados **tal como registados** — não se infere aprovação onde nenhum ficheiro a declara. Pontos por confirmar estão marcados.

## Nota de fonte-de-verdade (ler primeiro)
- Só o **Item 1 (exposição)** está **versionado em Git**. Os Itens 2–5 viviam **fora do Git**; o PR **#63** (merge `28bae5e`, 2026-10-01) passou a versionar **apenas as versões de impressão** (poster `print-A0/`, materiais `print/`) e o **README + vFinal do orçamento**. A **arte-fonte** de disseminação (poster `proof/`, materiais `v6.x`, etc.) **continua não versionada** — o estado assenta em texto de README + datas de ficheiro.
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

**Estado da última versão.** `docs/dissemination/poster-congresso/print-A0/poster_milreu_A0_PRINT_sangria5mm.pdf` (commitado, PR #63). **Não é print-final aprovado:** o **gate de impressão continua aberto** — formato/título do congresso, QR, **CMYK**, incorporação/licença de fontes, direitos das fotografias, hierarquia final de logótipos. A arte mantém o rótulo de rodapé **«PROVA VISUAL — QR e formato do congresso por confirmar»**. A arte-fonte (`proof/`) **não está versionada**.

---

## Item 5 — Flyer + Marcador

**O que é.** Materiais de divulgação do Museu «Entre Ruínas e Memórias»: **flyer** e **marcador de livro**, frente/verso.

**O que foi feito.** Arte **v6.4** (arquitectura congelada). Versões de **impressão** nos formatos pedidos: **Flyer A6** (105×148) e **Marcador 59×214**, frente/verso, com sangria 3 mm + marcas de corte.

**Como foi feito.** Gerador `scratchpad/item5_build/build.py` (PIL, 300 dpi, SVG editável + PNG). As versões de impressão derivam da arte v6.4 por **escala uniforme** (sem distorção): A5→A6 é escala √2; marcador 55×200→59×214 ≈ ×1,07. Sangria por replicação de bordo + marcas. **QR real** para `https://projectomilreu.pt` (site verificado ao vivo).

**Histórico.** v1…v6 (iterações de conceito/arquitectura, vários rejeitados) → **v6.1…v6.4** (ajustes cirúrgicos sobre arquitectura congelada). Técnicas: remoção de borda branca de scan por fração-branca; `img_topfade` (gradiente de topo); sky-trim por `rowfrac`.

**Estado da última versão.** `docs/dissemination/materiais-museu/print/` (4 PDFs frente/verso, commitados, PR #63). Estados herdados da v6.4: **Marcador = direcção aprovada (arte-final); Flyer = prova visual (ainda NÃO final)**. Pendente: **aprovação editorial do flyer**; **CMYK** + incorporação de fontes no prepress; confirmar zona de segurança do marcador na produção. A arte-fonte (`v6.4`) **não está versionada**.

---

## Item 6 — Convite ao Inquérito Milreu 2026

**O que é.** Peça(s) de **conversão** para convidar à participação no **Inquérito Milreu 2026** (exposições, comércio, balcões, espaços culturais e online). URL canónica: `https://pt.surveymonkey.com/r/3CFG2MQ`. Marca: **Projecto Comunitário de Milreu** (NÃO «Entre Ruínas e Memórias»). Distinto do Item 5.

**O que foi feito.** **Fase 1 (previews + QA)** das 5+1 faces: **A6 frente/verso, A4, A3, 1080×1350, 1080×1920**. Copy do brief usada **verbatim** (nada inventado — sem prazo/duração/anonimato/números). QR **real** para o inquérito. Uma fotografia (MM202608). Design System v0.2.

**Como foi feito.** Gerador `scratchpad/item6_build/build.py` (PIL, QR real via `qrcode`; A6/A4/A3 a 150 dpi com sangria 3 mm; digital em px). Brief em `ITEM06_CONVITE_INQUERITO_v1` (BRIEF/COPY/DIRECTION/DELIVERABLES/QA). Verificação de segurança do pacote: 0 marcadores estranhos, identidade Milreu confirmada.

**Histórico.** v1 — primeira montagem; 3 iterações de layout para eliminar overflow/sobreposição e aplicar fit-to-width nos títulos.

**Estado da última versão.** `docs/dissemination/convite-inquerito/**final**/` — **ARTE-FINAL entregue + commitada (HUMAN PASS)**. QA técnico **PASS** (dimensões, sangria, sem quebra de URL, QR validado 841/841, SVG não achatado). Entregáveis: `svg/` (5 SVG editáveis, grupos separados, texto vivo, QR vetorial) · `print/` (PDFs A6/A4/A3, sangria 3mm + marcas, 300 dpi **raster** — vetor/fontes no prepress a partir do SVG) · `digital/` (PNG+JPG 1080×1350 e 1080×1920) · `_PRANCHA_FINAL.png` · `QA_REPORT.md`. **HUMAN GATE pendente:** validação física do QR impresso; CMYK/export vetorial de fontes no prepress. **Tudo single-face.**

*Histórico de composição (aprovada em v6):* **Tudo single-face** (A6, A4, A3 só frente; digitais uma face por formato). Linguagem: eyebrow «INQUÉRITO MILREU 2026» (vermelho, pequeno) · headline «Milreu também se constrói…» (maior texto, 2 linhas) · descrição · **frase de contexto só em A4/A3/digital** · **QR grande** (cresce no A4/A3) + **PARTICIPE** + **URL subordinada** · assinatura discreta. Arte-final pendente: **SVG editável por face (grupos separados, não achatado)** + PDFs print-ready (A6/A4/A3, sangria 3mm + marcas) + PNG/JPG digitais + **teste físico do QR** + CMYK/fontes. (v1–v5 histórico; A6 decidido single-sided, verso eliminado.)

*Histórico:* `…/v5/` — A6 single-sided; `…/v4/` — RESET de composição do A6 (toda a informação cabe numa face; o resto está no inquérito/site). Bloco único PARTICIPE+URL+QR, URL subordinada ao CTA, assinatura subida a fechar, imagem ~42%. (v4 tinha frente+verso — substituído.) Ver histórico v1–v4 abaixo.

*Histórico:* `…/v4/` — **Fase 1 (v4 · RESET de composição do A6), aguarda HUMAN PASS do A6** (gate `preview_before_final_export`). v1/v2/v3 **todas rejeitadas** (escala tipográfica excessiva, ar de cartaz/académico). **v4 só produz A6 frente + A6 verso + prancha** (A4/A3/digital só depois do HUMAN PASS do A6). Nova hierarquia: **a chamada «Milreu também se constrói…» é o maior texto**; «INQUÉRITO MILREU 2026» = eyebrow pequeno vermelho (1 linha, sem barra grossa); **QR grande ~29 mm = ação principal**; **URL ≤ CTA** em tamanho/peso; assinatura discreta; imagem full-bleed ~41% (homem+bicicleta); 4 grupos com unidade-base. Verso refeito, leve, com copy revista. **Pendente:** HUMAN PASS do A6 → propagar sistema a A4/A3/digital → Fase 2 (SVG/PDF/exports) → teste físico do QR, CMYK/fontes. (v1–v3 como histórico.)

---

## Pendências transversais (decisão humana)

1. **Poster print-final indefinido** — gate de impressão aberto; a arte-fonte do poster não está versionada.
2. **Formato dos painéis 2000 vs 1800** — `STATUS.md` vs `WORK_QUEUE`/pasta PRINT por reconciliar; T2 («edifício de cultos») pendente.
3. **Aprovações editoriais** — flyer (Item 5); lançamento público do site (Item 2); adjudicação do orçamento (Item 3).
4. **Prepress** — conversão **CMYK** com perfil ICC da gráfica e **incorporação de fontes** para todos os PDFs de impressão (saem em RGB).
5. **Versionamento** — a arte-fonte de disseminação (poster `proof/`, materiais `v6.x`) continua fora do Git; só as versões de impressão + orçamento foram commitadas (PR #63).
6. **E-mail do formulário «Quero expor»** — requer secrets + deploy da Edge Function no Supabase.

## Ficheiros-chave (mapa rápido)
- Exposição: `docs/exhibition/PRINT_841x1800_bleed20/`, `docs/exhibition/STATUS.md`, `docs/exhibition/decisions/`
- Site: raiz do repo (`src/`, `supabase/functions/`), `.github/workflows/07d-pages.yml`
- Orçamento: `docs/procurement/orcamento-impressora-3d/` (README, `…vFinal…pdf`, `CHECKPOINT_FACTUAL_2026-10-01.md`)
- Poster: `docs/dissemination/poster-congresso/print-A0/` (impressão) · `…/proof/` (arte-fonte, não versionada) · `…/master/` **(rejeitado)**
- Materiais: `docs/dissemination/materiais-museu/print/` (impressão) · `…/v6.4/` (arte-fonte, não versionada)
- Convite inquérito (Item 6): `docs/dissemination/convite-inquerito/v1/` (previews + `QA_REPORT.md`; editáveis/PDFs = Fase 2) · gerador `scratchpad/item6_build/build.py`
