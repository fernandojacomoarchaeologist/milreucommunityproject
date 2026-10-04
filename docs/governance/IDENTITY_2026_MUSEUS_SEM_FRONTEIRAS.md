<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Enquadramento 2026 — «Museus sem Fronteiras» · arquitectura canónica de identidade

> **Fonte única** desta arquitectura para todos os itens e canais. Integrado pelo pacote `GOV-MSF-2026` (PATCH_2026_MUSEUS_SEM_FRONTEIRAS_v2). Decisão humana de 2026-10-03. Não substitui `PROJECT_IDENTITY.md` (identidade do repositório); complementa-o no plano editorial/programático.

## 1. Arquitectura (quatro níveis)

1. **Projecto Comunitário de Milreu** — marca **principal e permanente**. Projecto académico/comunitário mais amplo (investigação, participação, Museu de Memórias, inquéritos, mediação, produção de conhecimento, iniciativas educativas, circulação pública e outras frentes presentes e futuras). **Não** é sinónimo de «Museus sem Fronteiras» e **não** pode ser renomeado como tal.
2. **PROJECTO COMUNITÁRIO DE MILREU / MUSEUS SEM FRONTEIRAS** — **designação administrativa/programática** do ciclo financiado de 2026 (candidatura/apoio da CCDR Algarve). Preservar **sem abreviar** em documentos administrativos/orçamentais.
3. **MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026** — **identificador público secundário** (editorial/programático). **Não** é logótipo, marca principal, parceiro institucional nem novo nome.
4. **Iniciativas de 2026** (duas, irmãs):
   - **«Entre Ruínas e Memórias»** — museu/exposição itinerante; nome próprio atribuído pela população; mantém identidade própria.
   - **Circuito Educativo** — segunda iniciativa; não deve ficar invisível quando se explica o ciclo financiado.

**Relação correcta:** Projecto Comunitário de Milreu → *enquadramento financiado 2026* «Projecto Comunitário de Milreu / Museus sem Fronteiras» → *iniciativas* «Entre Ruínas e Memórias» + Circuito Educativo.

**Museu do Lyceu:** referência **factual e contextual** — enquadramento associativo da candidatura de 2026. **Não** apresentar como autor, proprietário ou titular do Projecto Comunitário de Milreu. Formulação administrativa, quando necessária: «Enquadramento associativo da candidatura de 2026: Museu do Lyceu.» Se a documentação oficial da CCDR exigir formulação diferente, prevalece a oficial.

## 2. Copy canónica (usar literalmente)

- **A. Forma administrativa:** `PROJECTO COMUNITÁRIO DE MILREU / MUSEUS SEM FRONTEIRAS`
- **B. Identificador público:** `MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026`
- **C. Linha das duas iniciativas:** `Museu itinerante «Entre Ruínas e Memórias» · Circuito Educativo`
- **D. Frase curta:** «Entre Ruínas e Memórias» integra, juntamente com o Circuito Educativo, as iniciativas de 2026 apoiadas no âmbito de «Projecto Comunitário de Milreu / Museus sem Fronteiras».
- **E. Frase explicativa:** Em 2026, duas iniciativas do Projecto Comunitário de Milreu — o museu itinerante «Entre Ruínas e Memórias» e o Circuito Educativo — são desenvolvidas no âmbito da candidatura «Projecto Comunitário de Milreu / Museus sem Fronteiras», apoiada pela CCDR Algarve. Esta designação identifica o enquadramento das iniciativas de 2026 e não substitui a identidade permanente do projecto.
- **F. Nota com Museu do Lyceu (só quando necessário):** A candidatura das iniciativas de 2026 foi enquadrada associativamente através do Museu do Lyceu.
- **G. Copy da exposição:** «Entre Ruínas e Memórias» é o nome atribuído pela população ao museu/exposição itinerante do Projecto Comunitário de Milreu. Em 2026, a sua circulação integra, juntamente com o Circuito Educativo, as iniciativas enquadradas por «Projecto Comunitário de Milreu / Museus sem Fronteiras».

## 3. Composição do identificador (só Design System existente)

- **Tipografia:** linha principal em **Archivo** (família *interface*), versalete/maiúsculas com espaçamento; 2.ª linha (C) em **Spectral** itálico (família *editorial*). **Sem** ficheiros de fonte distribuídos.
- **Cor (tokens v0.2):** texto em `ink.900`; o separador «·» e/ou um fio curto podem usar `red.500` (assinatura, uso mínimo); 2.ª linha em `stone.700`; fios/separadores em `stone.500`. **Vermelho não** é fundo de leitura.
- **Proibido:** novo logótipo, ícone, brasão, símbolo, monograma ou marca gráfica independente; caixa que o faça parecer logótipo; entrar na fila de parceiros.
- **Variantes:** *plena* (2 linhas) e *compacta* (1 linha) para peças pequenas.
- **Excepção do poster (2026-10-04):** só o poster (Item 4) usa o identificador em **tom neutro KEY** e em **duas** posições (abaixo do título + rodapé). Ver §5, Item 4. A regra geral de cor (`ink.900`) e de colocação (rodapé único) mantém-se para os restantes itens.
- **Grafia:** «Projecto» (pré-AO90) nos materiais de disseminação e neste enquadramento.

## 4. Hierarquia nas peças

1. título da peça/iniciativa (em peças centradas numa iniciativa, **«Entre Ruínas e Memórias»** ou **Circuito Educativo** continua a ser o título principal);
2. Projecto Comunitário de Milreu;
3. identificador «Museus sem Fronteiras · Iniciativas 2026»;
4. bloco de apoio institucional e parcerias (logótipos).

O identificador 2026 fica **fora** da fila de logótipos.

## 5. Aplicação por item (resumo)

| Item | Regra |
|---|---|
| 1 — Painéis | **não alterar** (fechados) |
| 2 — Website | relação explícita Projecto → MSF 2026 → 2 iniciativas; identificador em área institucional/Media-Press; não renomear o portal — **APLICADO** (PR #73) |
| 3 — Orçamento | forma administrativa completa (A) + subtítulo das 2 iniciativas — **APLICADO** (regenerado do pipeline 2026-10-03). Âmbito alargado por decisão humana **GOV-MSF-2026 v3** (`allowed_paths` += `docs/procurement/`, base = `main` após #72/#73) |
| 4 — Poster | **EXCEPÇÃO registada (decisão humana 2026-10-04):** identificador em **duas** posições — (i) **abaixo do título** (sob o subtítulo) e (ii) **rodapé institucional** com a sublinha das iniciativas (copy C) — em **tom neutro KEY** (não `ink.900`), fora da fila de logótipos. Diverge do padrão geral (rodapé único; cor §3) e aplica-se **apenas ao poster**. Regenerado do gerador canónico com a composição aprovada preservada — **APLICADO** (PR #87 produção/CMYK/SVG + PR #88 vetor editável; anterior PR #74). |
| 5 — Flyer/Marcador | selo compacto em futura exportação |
| 6 — Convite | identificador no bloco institucional inferior; **não tocar CTA/QR** |
| 7 — Dossiê | enquadramento 2026 na página final, na próxima revisão/prepress |
| 8 — Cartaz local | slot opcional `[MUSEUS_SEM_FRONTEIRAS_2026]` quando houver evento real |
| 9 — Kit/Media-Press | bloco «Enquadramento das iniciativas 2026» (README, nota-base, copy; identidade pública) |
| 10 — Folha de Sala | baquear a arquitectura na criação (frente/texto/verso/rodapé) |
| 11 — Manual Expositor | pré-registar a mesma arquitectura |

## 6. QA (rejeitar / confirmar)

**Rejeitar** se: o projecto inteiro for chamado «Museus sem Fronteiras»; «Projecto Comunitário de Milreu» perder a posição de marca permanente; «Entre Ruínas e Memórias» for renomeado; o Circuito Educativo desaparecer da explicação do ciclo financiado; o identificador for tratado como parceiro/logótipo; os painéis forem reabertos; o orçamento ligado à CCDR não usar a designação administrativa completa; o poster apresentar o ciclo 2026 como o projecto inteiro; o Museu do Lyceu for apresentado como proprietário/autor sem base documental; o identificador 2026 for aplicado automaticamente a anos futuros.

**Confirmar** que: projecto permanente ≠ ciclo financiado 2026; as duas iniciativas de 2026 estão explícitas; «Entre Ruínas e Memórias» mantém nome próprio; o Circuito Educativo aparece como iniciativa-irmã; a designação oficial completa é preservada nos materiais administrativos.
