# Handoff — Item 1 · Painéis da exposição «Entre Ruínas e Memórias»

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum e hierarquia de marca: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (secção «Item 1»).

**O que é.** Conjunto de **12 painéis físicos** (formato totem) da exposição fotográfica itinerante do Museu de Memórias de Milreu. Título oficial **«Entre Ruínas e Memórias»** (HUMAN-DECIDED). Bilingue **pt-PT/EN**, grafia pré-AO90 «Projecto». Painéis identificados **Q01–Q12**.

---

## ⚠️ RESPOSTAS ÀS 4 PERGUNTAS QUE A OUTRA JANELA FEZ (ler primeiro)

Estas perguntas **não deviam ter sido feitas** — ficam aqui respondidas de forma definitiva:

1. **Qual o caminho da alteração (reimpressão / vinil por cima / próxima edição + Folha de Sala)?**
   A alteração pedida incide **apenas no ÚLTIMO painel (Q12)** — **não** no primeiro painel. Q12 é o painel de fecho (mensagens/vozes da comunidade + bloco institucional). A edição 2026 foi enviada à gráfica com Q12 ainda **bloqueado por mensagens comunitárias inexistentes**; agora existem (ver ponto 4 e o Item «vozes da comunidade»). **A decisão sobre o suporte da alteração (reimpressão do Q12 vs. sobreposição vs. integrar só na próxima edição e/ou na Folha de Sala) é uma decisão HUMANA ainda em aberto** — **perguntar ao responsável**, não assumir. A edição dos outros 11 painéis permanece **LOCKED**.
2. **Onde estão os PDFs finais 841×1800 mm, em especial Q1 e Q12?**
   ⚠️ **Os PDFs finais dos painéis NÃO estão versionados no Git.** A pasta de referência canónica chama-se `docs/exhibition/PRINT_841x1800_bleed20/` mas **está vazia no repositório** (só tem `.DS_Store`). Os ficheiros CMYK **foram gerados no `scratchpad/` (efémero) e enviados diretamente à gráfica** (Gráfica Ossonoba, 2026-09-29); **não foram committados**. Portanto: não existe um Q1.pdf nem um Q12.pdf no repo — **isto é uma pendência real** (ver secção 8). Para obter os ficheiros há que (a) recuperá-los do envio à gráfica / do responsável, ou (b) regenerá-los dos geradores (que também não estão versionados). **Não afirmar que os PDFs estão no repo.**
3. **Quem é Meira Pinto e como citá-lo?**
   **Meira Pinto = interlocutor da AAMLF** (Associação dos Amigos do Museu do Lyceu de Faro), e-mail `museu.lyceu@aejdfaro.pt`, morada Av. 5 de Outubro, Liceu de Faro, 8004-069 Faro. É assim que consta, de forma consistente, nos Itens 7 e 9. O responsável referiu-o também como «Curador do Museu do Lyceu / Fundador da AAMLF» → **o cargo exacto a imprimir no painel deve ser confirmado com o responsável** antes de gravar texto (regra de não-invenção).
4. **Qual o nome do grupo de voluntários?** (único dado genuinamente novo)
   **«Grupo de voluntários do Projecto Comunitário de Milreu»** (confirmado pelo responsável). As vozes/mensagens da comunidade para o Q12 vêm do inquérito comunitário (ver Item «vozes da comunidade»: 5 mensagens — 4 com nome autorizado + 1 anónima).

---

## 1. Local dos arquivos
- **Toda a documentação do Item 1 está em `docs/exhibition/`** (este é o **único** item tracked em Git desde o início — mas só os **documentos**, não a arte-final):
  - `docs/exhibition/README.md` — índice de estado (título, formato, lock).
  - `docs/exhibition/ITEM01_PRODUCTION_RECEIPT_2026.md` — **modelo** de recepção/QA físico (não preenchido; para quando os painéis chegarem da gráfica).
  - `docs/exhibition/decisions/MILREU_FORMAT_RECONCILIATION_2026-10-05.md` — **decisão HUMAN/CANONICAL**: formato 841×1800, edição fechada, T2 deferred.
  - `docs/exhibition/decisions/MILREU_Q3_DIRECTION_DECISION_v1.md` + `MILREU_Q3_PENDING_DECISIONS_v1.md` (commit `c7a2a58`).
  - `docs/exhibition/decisions/MILREU_Q4_DIRECTION_DECISION_v1.md` (commit `49a2c49`).
  - `docs/exhibition/decisions/MILREU_FORMAT_MIGRATION_NOTE_v0.2.md` — **SUPERSEDED** (migração 1000×800→841×2000; histórico).
  - `docs/exhibition/system/MILREU_EXPO_PANEL_SYSTEM_SPEC_v0.2.1.md` — anatomia dos painéis por arquétipo.
  - `docs/exhibition/inventory/MILREU_EXPO_CAMADAS_DOCUMENTAIS_v1.1.md` — inventário de camadas/ativos por quadro.
  - `docs/exhibition/audits/MILREU_INVENTARIO_DIFF_SEMANTICO_v1_para_v1.1.md`.
  - `docs/exhibition/ITEM11_REGISTO_FUTURO.md`.
- **Arte-final (PDF/PNG/SVG): NÃO está no repo.** `docs/exhibition/PRINT_841x1800_bleed20/` e `docs/exhibition/svg/` estão vazias/inexistentes como conteúdo. Os builds eram `scratchpad/rebuild_all.py`, `build_q1_v5.py`, `build_q4_v3.py`, `build_q8_v3.py`, `build_q12_v2.py` (**efémeros, provavelmente já apagados**).
- **Imagens do acervo** (referência): `public/media/exhibition/updated/`. **Logótipos canónicos:** `public/media/exhibition/updated/logos/`.
- **Decisões de direitos:** `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md`.

## 2. Pontos mais importantes
- **Estado:** `PRODUCTION LOCKED / IN PRINT · EDIÇÃO 2026 FECHADA` — 12/12 painéis, **841×1800 mm**, enviados à **Gráfica Ossonoba (2026-09-29)**.
- **Actualização 2026-10-12 (ver §11):** a gráfica **só imprimiu Q01–Q06**; Q07–Q12 por imprimir. Ficheiros finais no **Drive «3- Panels»** (spec: 841×1800 + **20 mm sangria**, CMYK JPEG ~91 ppi). **Q12 reaberto** → **Q12 FINAL aprovado e gerado** (ficha técnica 3 colunas + «Apoiado pela CCDR Algarve, I.P.») em `docs/exhibition/q12-reabertura/_private/final/` — falta substituir no Drive + avisar gráfica.
- **Formato canónico = 841×1800 mm.** `841×2000` e `1000×800` são **SUPERSEDED / NÃO USAR**.
- **Nenhuma alteração** editorial/gráfica/técnica à edição fechada — **exceto** a reabertura **explícita e humana do Q12** (ver topo). Não reabrir Q1–Q11 por iniciativa própria.
- **MM202617 (Q8):** produção física autorizada **com divulgação explícita de retoque por IA**; a imagem **não corresponde ao documento fotográfico original**; **QR final PROIBIDO**; digital permanece `review-visible` + `noindex` + `publicReleaseEligible:false`.
- **T2 («edifício de cultos»):** `DEFERRED TO FUTURE EDITION` — não alterar ficheiros produzidos por causa disto.
- **Próxima fase planeada do item (fora do Q12):** RECEPÇÃO / QA FÍSICO dos painéis quando chegarem da gráfica (modelo já existe).

## 3. Como se estruturou a arte
- **Sistema de painéis por arquétipo** (`system/MILREU_EXPO_PANEL_SYSTEM_SPEC_v0.2.1.md`): cada painel = totem vertical 841×1800, com anatomia definida (cabeçalho, corpo documental, voz comunitária, contexto institucional, créditos/QR).
- **12 painéis ≠ 12 imagens:** um painel pode ter um ou mais elementos visuais. Enriquecimentos documentais definidos só em **Q1, Q3, Q4**; restantes `NOT-PLANNED` (não planeado ≠ proibido).
- **Direcções compositivas aprovadas:** Q3 = «Descida documental» (B-margem, commit `c7a2a58`); Q4 = «o olhar de fora / imprensa 1913» (commit `49a2c49`).
- **Duas vozes** (princípio do DS): comunidade como superfície, instituição como moldura. **Narrativa comunitária antecede o contexto institucional.**
- **Trio institucional de logótipos** + créditos/QR na moldura. Tijolo restrito à moldura (nunca domina cabeçalhos).
- **Níveis de certeza** só `confirmed`/`probable`/`hypothesis` (nunca `mixed`); linguagem interna (`PENDING`, `NOT-PLANNED`…) **nunca** aparece no painel.

## 4. Como se trabalhou ponto a ponto
1. Inventário de camadas documentais por quadro (`inventory/…v1.1`) + auditoria do diff semântico.
2. Decisões de composição por painel (Q3, Q4) registadas como documentos de decisão **aprovados** (não arte-final).
3. Reenquadramento de **Q8** (transparência de IA) e **Q12** (vozes reais da comunidade).
4. Builds PIL por painel no scratchpad → CMYK genérico (não o ICC da gráfica), raster ~91 PPI.
5. Migração de baseline **841×2000 → 841×1800** (pedido da gráfica), reconciliada em 2026-10-05.
6. Envio dos CMYK à gráfica (2026-09-29) → **edição fechada**.
7. Preparação do **modelo de recepção/QA físico** para a chegada dos painéis.

## 5. O que NÃO fazer
- **NÃO** afirmar que os PDFs finais estão no repo (não estão — ver secção 8).
- **NÃO** reabrir Q1–Q11 nem alterar a edição fechada; a reabertura humana é **só do Q12**.
- **NÃO** usar 841×2000 nem 1000×800.
- **NÃO** classificar os painéis como «estudo»/«mockup»/«arte não-final».
- **NÃO** gerar QR final para MM202617/Q8; **NÃO** esconder a divulgação de IA.
- **NÃO** inventar o cargo de Meira Pinto nem textos de vozes comunitárias — usar só as mensagens reais autorizadas.
- **NÃO** acrescentar «Museus sem Fronteiras» aos painéis desta edição (Item 1 ficou **intocado** pelo patch MSF 2026).
- **NÃO** regenerar PDFs/alterar ICC/fontes da edição fechada.

## 6. Resultado esperado
- Edição 2026: 12 painéis impressos conformes, recebidos e validados no QA físico.
- Alteração do Q12: painel de fecho com **vozes reais da comunidade** (5 mensagens autorizadas) + crédito ao **«Grupo de voluntários do Projecto Comunitário de Milreu»** + bloco institucional (AAMLF/Meira Pinto, cargo a confirmar), **no suporte que o responsável decidir** (reimpressão/sobreposição/próxima edição/Folha de Sala).

## 7. Documentos necessários
- `docs/exhibition/README.md` + `decisions/MILREU_FORMAT_RECONCILIATION_2026-10-05.md` (estado e lock).
- `docs/exhibition/system/…SPEC_v0.2.1.md` (anatomia) + `inventory/…v1.1.md` (camadas).
- `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md` (direitos, MM202617).
- Regras: `.claude/rules/blocked-mm202617.md`, `digital-intervention-disclosure.md`, `08f-mm202617-ai-disclosure.md`, `museum-public-index.md`, `community-first-components.md`, `museum-immersive-permanent.md`.
- Fonte das vozes do Q12: ver memória «Exposição — vozes da comunidade» (ficheiro de respostas do inquérito, fora do repo).

## 8. Pendências observadas
- 🔴 **Arte-final NÃO versionada** (PDF/PNG/SVG dos 12 painéis ausentes do Git; geradores no scratchpad efémero). Decidir com o responsável se se recuperam/versionam.
- 🟠 **Contradição de estado documental:** `docs/exhibition/STATUS.md` (15-set) diz «arte-final 0/12» e baseline 2000; `docs/project/WORK_QUEUE_2026-09.md` (30-set) diz «produção pronta» e 1800. A reconciliação de 2026-10-05 é a fonte vigente (1800, fechada) — os outros estão desatualizados.
- 🟠 **Suporte adjudicado a confirmar** (PVC 3 mm?) — não há registo no repo; confirmar com a gráfica/encomenda.
- 🟠 **Q12 (reaberto):** decidir suporte da alteração + cargo de Meira Pinto.
- 🟠 **T2 («edifício de cultos»)** em Q2/Q5/Q10 — deferido para edição futura.
- 🟠 **Perfil CMYK/ICC específico da gráfica** — só relevante para uma edição futura.

## 9. Dossiê do modo de trabalhar (Item 1)
Este item é o **único** com documentação tracked desde o início, mas segue o padrão: direcções de composição aprovadas como **documentos de decisão** (não arte), builds PIL no scratchpad, reconciliação de formato por decisão humana, e **lock de produção** quando os ficheiros vão para a gráfica. A arte-final nunca foi committada — lição importante: **o que vai para a gráfica deve ser arquivado**. A reabertura do Q12 é a exceção humana ao lock; tratar com o mesmo rigor (vozes reais, direitos, cargo confirmado) e não contaminar os restantes painéis.

## 10. Onde está cada informação
- **Estado/lock/formato:** `docs/exhibition/README.md` + `decisions/MILREU_FORMAT_RECONCILIATION_2026-10-05.md`.
- **Composição por painel:** `decisions/MILREU_Q3_*`, `MILREU_Q4_*`, `system/…SPEC_v0.2.1.md`.
- **Camadas/ativos:** `inventory/MILREU_EXPO_CAMADAS_DOCUMENTAIS_v1.1.md`.
- **Direitos/MM202617:** `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md` + regras `.claude/rules/blocked-mm202617.md`.
- **Recepção física:** `docs/exhibition/ITEM01_PRODUCTION_RECEIPT_2026.md`.
- **Vozes Q12 / grupo de voluntários:** inquérito comunitário (fora do repo) + esta secção.
- **Resumo de estado:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md`, linhas do «Item 1».

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
- 2026-10-12 · NOVO · **1.ª apresentação pública** dos painéis a 10-10-2026 (Museu do Traje, São Brás de Alportel; ~50 participantes de museus do Algarve). As fotos mostram painéis impressos montados ao ar livre (visíveis: Q1 «Entre Ruínas e Memórias», «A Festa da Pinha», «Achados romanos de Milreu», «Os jornalistas ingleses», «Memórias de juventude»). ⇒ painéis **recebidos e em uso**. · Fotos `evento1010-*` (Milreudocs; derivados em `docs/relatorio-execucao-ccdr-2026/_private/imagem-eventos/`, EVID-013…017)
- 2026-10-12 · PENDENTE · Registo formal de **RECEPÇÃO / QA físico** (`ITEM01_PRODUCTION_RECEIPT_2026.md`) não feito; n.º de painéis expostos a 10-10 por confirmar. Uso em evento ≠ QA físico concluído.
- 2026-10-12 · NOVO · Estado real de impressão: a Gráfica Ossonoba **imprimiu só Q01–Q06**; **Q07–Q12 ainda por imprimir** ⇒ há tempo para substituir o Q12. (Corrige «IN PRINT 12/12»; a entrada de uso a 10-10 refere-se aos painéis já impressos.) · responsável
- 2026-10-12 · NOVO · Ficheiros finais enviados à gráfica localizados no Drive «3- Panels» (`https://drive.google.com/drive/folders/1zY9Rgqe0HtYT_6_AcB8Yv2x9cJ7Gj8_4`): 12 PDFs `NN - MILREU_QNN_841x1800_bleed20_CMYK.pdf`. Q12 sha256 `046db67d…e48779c`; cópia local em `docs/exhibition/q12-reabertura/_private/original/` (gitignored). · Drive + verificação local
- 2026-10-12 · NOVO · **Especificação da gráfica (medida nos PDFs):** página 881×1840 mm = 841×1800 corte + **20 mm sangria**; TrimBox/BleedBox definidos; 1 raster **CMYK JPEG 3160×6600 px (~91 ppi)**, `Decode [1 0…]`, sem OutputIntent/ICC. · `q12_ficha_tecnica_build.py`
- 2026-10-12 · NOVO · **Defeito no Q12 enviado:** a banda «AGRADECIMENTOS · WITH THANKS» repete duas vezes a tradução EN da citação de Leandro C Dias (a linha «PT» está em inglês); não contém agradecimentos. · inspecção do PDF do Drive
- 2026-10-12 · DECISÃO · Reabertura do **Q12** (só o Q12): acrescentar ficha técnica no fim — «Curadoria: Grupo de voluntários do Projecto Comunitário de Milreu» + «Investigação, design e produção: Fernando Rodrigues de Jácomo» + AAMLF/Meira Pinto **sem ficar abaixo** do responsável. · responsável
- 2026-10-12 · DECISÃO · Acrescentar **menção real à CCDR** no último painel. · responsável
- 2026-10-12 · NOVO · **Prova Q12 v2** (PROVA, marca de água, HUMAN GATE): banda «Agradecimentos» (defeituosa) substituída por **FICHA TÉCNICA · CREDITS** em 3 colunas de peso igual — (1) COORDENAÇÃO INSTITUCIONAL / Institutional coordination · **Meira Pinto** · Associação dos Amigos do Museu do Lyceu de Faro; (2) CURADORIA / Curated by · **Grupo de voluntários** · do Projecto Comunitário de Milreu; (3) INVESTIGAÇÃO, DESIGN E PRODUÇÃO / Research, design and production · **Fernando Rodrigues de Jácomo** — + linha **«Apoiado pela CCDR Algarve, I.P. · Supported by CCDR Algarve, I.P.»** (fórmula do art. 16.º). Trabalho em CMYK sobre o raster original; hash-gate PASS; **0 px alterados fora da banda**; caixas/resolução/Decode preservados; render independente (PyMuPDF) com cores idênticas ao original. Gerador `docs/exhibition/q12-reabertura/source/generators/q12_ficha_tecnica_build.py`; provas em `docs/exhibition/q12-reabertura/_private/proof/` (contêm fotos de terceiros → gitignored). · esta sessão
- 2026-10-12 · PENDENTE · Aprovação humana da prova v2 → gerar versão `--final` (sem marca de água) → substituir o Q12 no Drive/avisar gráfica (acção do responsável). Confirmar: papel «Coordenação institucional» e forma «Meira Pinto» (cargo/nome completo não impressos); remoção do título «Agradecimentos» (o conteúdo era defeituoso; os nomes autorizados já aparecem em «Vozes da comunidade»).
- 2026-10-12 · RESOLVIDO · Foram expostos **6 painéis** a 10-10-2026, nas estruturas da AAMLF. · responsável
- 2026-10-12 · NOVO · Art. 16.º: logótipo CCDR na barra institucional dos painéis; menção textual «Apoiado pela CCDR Algarve, I.P.» a entrar na ficha técnica do Q12 (reabertura).
- 2026-10-12 · DECISÃO · Prova v2 aprovada na estrutura («Gosto»), com uma alteração: **o nome do responsável vem primeiro**. · responsável
- 2026-10-12 · ALTERADO · **Prova Q12 v3**: ordem das colunas → (1) Investigação, design e produção · Fernando Rodrigues de Jácomo; (2) Coordenação institucional · Meira Pinto · AAMLF; (3) Curadoria · Grupo de voluntários do Projecto Comunitário de Milreu. Mantém 3 colunas de peso igual (Meira Pinto ao lado, nunca abaixo) e a linha CCDR. Hash-gate PASS; 0 px fora da banda. v2 substituída. · `q12_ficha_tecnica_build.py`
- 2026-10-12 · PENDENTE · Confirmar v3 → gerar `--final` → substituir Q12 no Drive/avisar Gráfica Ossonoba (responsável). Mantêm-se em aberto: título «Agradecimentos» removido; cargo de Meira Pinto; menção CCDR em Q01–Q06 já impressos.
- 2026-10-12 · DECISÃO · **Prova Q12 v3 APROVADA** («aprovado — gerar versão final»). Aprovação inclui, tal como na prova: remoção do título «Agradecimentos» (substituído pela ficha técnica) e «Meira Pinto» sem cargo. · responsável
- 2026-10-12 · NOVO · **Q12 FINAL gerado** (sem marca de água): `docs/exhibition/q12-reabertura/_private/final/12 - MILREU_Q12_841x1800_bleed20_CMYK.pdf` (mesmo nome do original do Drive) · sha256 `48601014b9297d09b7ade1c00c3ca2cbe8c696bd99edbac3fd379f81c4722c12` (sidecar `.sha256`). Verificado: 881×1840 mm (841×1800 + 20 mm sangria), TrimBox/BleedBox iguais ao original, raster CMYK JPEG 3160×6600, `Decode [1 0…]`, 0 px alterados fora da banda, render independente OK. Original preservado em `_private/original/`. Ficheiros em `_private/` (gitignored; contém fotos de terceiros). · `q12_ficha_tecnica_build.py --final`
- 2026-10-12 · PENDENTE · **Acção do responsável:** substituir o Q12 no Drive «3- Panels» e avisar a Gráfica Ossonoba antes de imprimir Q07–Q12. Por decidir: menção textual CCDR em Q01–Q06 já impressos (hoje só logótipo). Arquivo da arte-final no Git = pendência geral do Item 1.
- 2026-10-12 · NOVO · Material dos painéis confirmado pelo responsável (via Item 7): **PVC expandido, impressão em vinil laminado**. Espessura continua por confirmar (registo de produção `ITEM01_PRODUCTION_RECEIPT_2026.md` mantém o campo em aberto). · responsável · handoff 7 §11
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
