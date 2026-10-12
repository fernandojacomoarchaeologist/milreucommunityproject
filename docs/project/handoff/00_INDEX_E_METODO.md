# Handoff por item — Índice e método · Projecto Comunitário de Milreu

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Objectivo deste conjunto.** Tornar **qualquer janela de contexto nova 100% apta** a retomar um item sem fazer perguntas que já têm resposta no projecto. Há **um ficheiro por item** (1–14) + Segurança (2B). Cada ficheiro é **autossuficiente** e tem sempre as mesmas **10 secções**:
> 1. Local dos arquivos · 2. Pontos mais importantes · 3. Como se estruturou a arte · 4. Como se trabalhou ponto a ponto · 5. O que NÃO fazer · 6. Resultado esperado · 7. Documentos necessários · 8. Pendências observadas · 9. Dossiê do modo de trabalhar · 10. Onde está cada informação · **11. Registo incremental (append-only, desde 2026-10-12)**.
>
> **REGRA DE MAPEAMENTO INCREMENTAL (decisão do responsável, 2026-10-12).** Cada novidade, decisão, acréscimo ou remoção num item é registada **no próprio momento**, como entrada nova, em **dois sítios**: (1) §11 «Registo incremental» do `handoff/HANDOFF_ITEM_XX_*.md` desse item; (2) secção «Registo incremental por item» no fim de `ESTADO_ITENS_1-5_2026-10-01.md`. **Append-only:** não reescrever nem apagar entradas antigas; uma correcção é uma entrada nova (`ALTERADO`/`REMOVIDO`). **Única excepção: privacidade** — por decisão do responsável, conteúdo que exponha pessoas pode ser redigido em entradas anteriores, registando-se uma entrada `DECISÃO` neutra. Formato `AAAA-MM-DD · TIPO · descrição · fonte`, TIPO ∈ NOVO · DECISÃO · ALTERADO · REMOVIDO · PENDENTE · RESOLVIDO. O estado-resumo (§2 / tabelas) é actualizado em paralelo.
> **Data:** 2026-10-12. **Fonte-de-verdade viva:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (consultar e atualizar a cada evolução).

---

## Índice dos ficheiros

| # | Ficheiro | Item | Estado resumido (2026-10-12) |
|---|---|---|---|
| 1 | [`HANDOFF_ITEM_01_paineis.md`](HANDOFF_ITEM_01_paineis.md) | Painéis da exposição «Entre Ruínas e Memórias» | PRODUCTION LOCKED / IN PRINT (edição 2026 fechada) — **reabertura só do último painel Q12 por decisão humana** · **1.º uso público 10-10-2026** (QA físico formal pendente) · **gráfica imprimiu só Q01–Q06; Q12 FINAL aprovado/gerado (ficha técnica + CCDR) — falta substituir no Drive** |
| 2 | [`HANDOFF_ITEM_02_website.md`](HANDOFF_ITEM_02_website.md) | Website `projectomilreu.pt` | LIVE · `noindex` · gate editorial humano |
| 2B | [`HANDOFF_ITEM_02B_seguranca.md`](HANDOFF_ITEM_02B_seguranca.md) | Segurança do sistema | **P0 AUDIT COMPLETE / NO PATCHES APPLIED** · **L1 PHASE 1 APPLIED / ADMINISTRATIVE VERIFIED** (L1-01…06b) · **L2 em desenvolvimento** (branch, sem push/PR) — aguarda revisão |
| 3 | [`HANDOFF_ITEM_03_orcamento3d.md`](HANDOFF_ITEM_03_orcamento3d.md) | Orçamento impressora 3D (consulta de mercado) | VERSÃO FINAL · falta adjudicação (humana) |
| 4 | [`HANDOFF_ITEM_04_poster.md`](HANDOFF_ITEM_04_poster.md) | Poster de congresso A0 (académico) | EDITORIAL FROZEN / HUMAN DESIGN PASS · gate prepress |
| 5 | [`HANDOFF_ITEM_05_flyer_marcador.md`](HANDOFF_ITEM_05_flyer_marcador.md) | Flyer + Marcador (+ reconciliação A5) | FINAL (v6.4) + reconciliação A5 em HUMAN GATE · gate CMYK |
| 6 | [`HANDOFF_ITEM_06_convite_inquerito.md`](HANDOFF_ITEM_06_convite_inquerito.md) | Convite ao Inquérito 2026 | DONE / PRODUCTION GATE PENDING (QR físico + prepress) |
| 7 | [`HANDOFF_ITEM_07_dossie.md`](HANDOFF_ITEM_07_dossie.md) | Dossiê «convite ao convite» (A5 4 pág.) | FINAL ART DELIVERED (SVG vetorial) · gate prepress · **P3 v2 + P4 (Quero expor/contactos/ficha técnica) integradas 2026-10-12 — PDFs regenerados, sem commit** |
| 8 | [`HANDOFF_ITEM_08_cartaz_local.md`](HANDOFF_ITEM_08_cartaz_local.md) | Cartaz local (master A3/A4) | TEMPLATE READY / STAND BY |
| 9 | [`HANDOFF_ITEM_09_kit_press.md`](HANDOFF_ITEM_09_kit_press.md) | Kit Digital + Press Kit | PRESS PACKAGE READY · redistribuição genérica/anfitrião BLOQUEADA |
| 10 | [`HANDOFF_ITEM_10_folha_sala.md`](HANDOFF_ITEM_10_folha_sala.md) | Folha de Sala / Guia breve A4 | FINAL ART READY · gate prepress (ICC) |
| 11 | [`HANDOFF_ITEM_11_manual_expositor.md`](HANDOFF_ITEM_11_manual_expositor.md) | Manual do Expositor | CONTENT/DESIGN PASS · bloqueado por validação física |
| 12 | [`HANDOFF_ITEM_12_poster2.md`](HANDOFF_ITEM_12_poster2.md) | Poster de Congresso 2 (adaptação legada) | CONTENT PASS · falta correcção PSD (externo) |
| 14 | [`HANDOFF_ITEM_14_banner.md`](HANDOFF_ITEM_14_banner.md) | Banner institucional (lona 850×2000) | v0.6b FINAL ART READY · PREPRESS PENDING |
| 15 | [`HANDOFF_ITEM_15_adesivo.md`](HANDOFF_ITEM_15_adesivo.md) | Adesivo do logótipo (Ø50 mm) | Item novo — print + CMYK + prova (APROVADO) |

**Estados da sessão 2026-10-08→12 (Itens 13, 14, 5-reconc, 2B):** tudo em **HUMAN GATE — sem commit, sem PR** (árvore untracked). Itens 1–12 (exceto reconc. do 5) já estão em `main`.

---

## Método comum (dossiê transversal — vale para todos os itens)

### Regras de ouro (não negociáveis)
1. **Nunca inventar** nomes, datas, locais, memórias, direitos, consentimentos, fontes, identificadores ou relações. Em falta → marcar lacuna, manter vazio/`null`/pendente e **perguntar ao responsável**. (CLAUDE.md §2; regras `content-integrity`, `museum-data-integrity`.)
2. **HUMAN GATE.** Não fazer `commit` nem abrir PR sem pedido explícito do responsável (Fernando Rodrigues de Jácomo). «Deployment técnico ≠ aprovação editorial» (`public-release-gated`).
3. **Grafia pré-AO90** nos materiais da exposição e no corpo/rodapé/copyright: **«Projecto Comunitário de Milreu»** (com c). O **logótipo** é um asset oficial e diz «PROJETO» (pós-AO90) — **preservar o asset tal como está**, não o «corrigir». EN e citações literais ficam intactos.
4. **Direitos de imagem:** autor ≠ coleção ≠ fonte digital ≠ proveniência. «Aldeia de Estói – Cultura e Património» (Luís Barriga) é **só fonte digital**, não autor. Muitas fotos do acervo têm **autoria DESCONHECIDA**. Preservar créditos/termos da fonte (ex.: Torre do Tombo para a Festa da Pinha).
5. **Privacidade:** dados fiscais/pessoais (NIF, IBAN, faturas, e-mails, cartão) **nunca** no Git público → pastas `_private/` (gitignored: `_private/`, `**/_private/`) + cofre externo `/Users/fernandojacomo/Desktop/Milreudocs`.
6. **PROJECT GATE** antes de inspecionar/aplicar qualquer pacote externo (skill `guard-development-packages`): confirmar identidade Milreu (`docs/governance/PROJECT_IDENTITY.md`), nunca confundir com o projecto **Compostela** (outro repo, em `~/dev/compostela`).
7. **Copyright** em todo MD/código novo: «© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.» + apontar `RIGHTS.md`. A atribuição **não** transfere direitos de terceiros.

### Hierarquia de marca (canónica — fonte: `docs/governance/IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md`)
- **Projecto Comunitário de Milreu** = marca **principal e permanente** (fica **em cima**).
- **MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026** = **identificador público secundário** (editorial), só tipografia **Archivo maiúsculas** + cores do DS; **não** é logótipo/marca/parceiro; fica **fora** da fila de parceiros e **em baixo** do Projecto.
- **PROJECTO COMUNITÁRIO DE MILREU / MUSEUS SEM FRONTEIRAS** = designação **administrativa** do ciclo financiado 2026 (candidatura CCDR); forma completa só em documentos de verba.
- **2 iniciativas 2026:** museu itinerante **«Entre Ruínas e Memórias»** + **Circuito Educativo**. («Documentando Milreu» e a investigação são **frentes do projecto**, não iniciativas MSF 2026.)
- **Milreu Proteus** = camada técnica de dados; **não** entra no logótipo nem é nome público.

### Conjunto canónico de parcerias (ordem fixa — Itens 4, 5, 6, 7, 10, 14)
> **⚠️ SUBSTITUÍDO em 2026-10-12 pela «Faixa de Logos» canónica:** `docs/governance/FAIXA_DE_LOGOS_CANONICA.md` (autoritativo) + skill `.claude/skills/build-logo-band/` + regra `.claude/rules/logo-band-canonical.md`. Nova ordem: 1 Projecto · 2 CCDR · 3 AAMLF · **4 Junta de Freguesia de Estoi** (`logo-junta-freguesia-estoi.png`) · 5 trio Milreu (indivisível) · 6 UAlg. **Intervalo igual entre todos = intervalo interno do trio.** A lista abaixo é o histórico de 2026-10-02.
Ficheiros em `public/media/exhibition/updated/logos/`:
1. **Projecto Comunitário de Milreu** (`logo-projeto-comunitario-milreu.png`)
2. **CCDR Algarve — RGB** (`logo-ccdr-algarve.png`)
3. **Associação dos Amigos do Museu do Lyceu de Faro — AAMLF** (`logo-associacao-amigos-museu-lyceu-faro.png`)
4. **Milreu policromático** (`Milreu_policromatico.png`) — composição **INDIVISÍVEL**: República Portuguesa (Cultura, Juventude e Desporto) + Património Cultural, I.P. + Milreu («sempre juntos»)
5. **Universidade do Algarve — completo** (`logo-ualg-completo.png`)
- Cabeçalho bilingue: «APOIO INSTITUCIONAL E PARCERIAS · INSTITUTIONAL SUPPORT AND PARTNERSHIPS».
- Alinhado à esquerda; espaçamento = **0,6 × altura**.
- **Direitos dos logótipos:** autorizados para uso institucional **pelo Projecto**; **não** autoriza redistribuição autónoma por terceiros (`PROVENIENCIA.txt`).
- Obsoletos (não reutilizar): `logo-ualg.png`, `logo-museu-lyceu.png`, `logo-republica-portuguesa-cultura.png`, `logo-patrimonio-cultural-DGPC.png`.

### Pessoas e entidades recorrentes
- **Fernando Rodrigues de Jácomo** = responsável do projecto / autor / doutorando na UAlg. E-mail académico institucional do projecto: **a78190@ualg.pt** (e também `fernando.jacomo@yahoo.com`).
- **AAMLF** = Associação dos Amigos do Museu do Lyceu de Faro — **entidade beneficiária** da candidatura CCDR e **parceiro institucional/de acompanhamento**. E-mail: **museu.lyceu@aejdfaro.pt**; morada: Av. 5 de Outubro, Liceu de Faro, 8004-069 Faro.
- **Créditos canónicos das iniciativas 2026 (decisão humana 2026-10-12):** (1) Investigação, design e produção — **Fernando Rodrigues de Jácomo**; (2) Coordenação institucional — **Meira Pinto** (Associação dos Amigos do Museu do Lyceu de Faro; **sem cargo**); (3) Curadoria — **Grupo de voluntários do Projecto Comunitário de Milreu**. Ordem fixa, pesos tipográficos iguais (Meira ao lado, nunca abaixo); + «Apoiado pela CCDR Algarve, I.P.» (art. 16.º). Fonte: `docs/governance/IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md` §7.
- **Meira Pinto** = **interlocutor da AAMLF** (é assim que aparece, de forma consistente, no repositório: Itens 7 e 9). ⚠️ O responsável referiu-o também como «Curador do Museu do Lyceu / Fundador da AAMLF» — **o título exacto a imprimir numa peça deve ser confirmado com o responsável** (não inferir cargo). Contacto institucional: `museu.lyceu@aejdfaro.pt`.
- **CCDR Algarve, I.P.** = Comissão de Coordenação e Desenvolvimento Regional do Algarve (financiador 2026; NIPC **517638827**).
- **Museu do Lyceu de Faro** = enquadramento associativo factual da candidatura (não autor/proprietário dos conteúdos).

### Ambiente e ferramentas (idêntico para todos os itens gráficos)
- **SO:** macOS (Darwin 23.6). **Repo:** `/Users/fernandojacomo/Desktop/Milreu community Project` (git, branch `main`).
- **Geradores:** Python + **PIL/Pillow** (PNG→PDF; muitos PDFs são **image-based**, não extraíveis como texto). Vários itens têm também **backend SVG vetorial editável** (texto vivo).
- **Fontes do Design System** (instaladas em `~/Library/Fonts/`, **não** versionadas): **Fraunces** (display/títulos), **Spectral** (corpo/leitura), **Archivo** (eyebrows/UI/maiúsculas).
- **Paleta DS v0.2:** papel MARF `#FFFCF7` · tinta INK `#1E1A17` (preto aquecido `ink.950`) · vermelho de assinatura RED `#A83227` (nunca fundo de leitura longa) · terracota/castanho `#964A2D` (restrito à moldura institucional/rodapé). Tokens em `packages/design-tokens/v0.2/`.
- **Dependências Python** no scratchpad (`pydeps`): `pikepdf`, `pdfminer.six`, `qrcode`, `xlrd`, `openpyxl`, `cairosvg`. ⚠️ **`cairosvg` não funciona** (falta libcairo) → renderizar SVG com **`qlmanage -t -s <px> -o <dir> ficheiro.svg`** (QuickLook; escala pela largura e corta o fundo — recortar com cuidado).
- **Scratchpad (efémero, isolado, não versionado):** `/private/tmp/claude-501/-Users-fernandojacomo-Desktop-Milreu-community-Project/<session>/scratchpad`. ⚠️ **Os geradores de muitos itens antigos (1, 4, 5, 6, 7, 8) viveram no scratchpad e podem já não existir** — ver cada item. Os itens mais recentes (10, 11, 13, 14 e o 5-reconc) têm o gerador versionado em `source/generators/`.
- **Sem node/gh/brew nativos** garantidos — instalar localmente de forma efémera se necessário; GitHub autenticado no keychain.

### Modo de trabalhar ponto a ponto (padrão de todas as peças gráficas)
1. **Ler o brief/pacote** + correr PROJECT GATE se vier de ZIP externo.
2. **Fundamentar** cada facto (nenhuma data/número/nome inventado); marcar MEDIDO / DOCUMENTADO / INFERIDO quando aplicável.
3. **Gerar preview** (PNG de baixa resolução) → apresentar ao responsável → **iterar** com as correções humanas (muitas vezes vários resets totais).
4. **Congelar a arquitectura** quando o responsável aprova a direcção; só então gerar **arte-final** (dual PIL + SVG quando possível) com sangria 3 mm + marcas de corte.
5. **QA** (legibilidade, safe area, logos, PPI, zero overlap, QR real) → **QA_REPORT.md**.
6. **HUMAN GATE** → só com pedido explícito: `commit`/PR (uma branch por item; mergear em `main`).
7. **Gates de produção** (fora do nosso controlo): **CMYK/ICC da gráfica**, incorporação de fontes, **teste físico do QR**. Nenhum item fica `DONE` enquanto estes não forem resolvidos com o responsável.

> **Onde confirmar qualquer coisa deste índice:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (estado vivo), `docs/governance/IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md` (marca), `.claude/rules/*.md` (regras), `CLAUDE.md` (instruções permanentes).
