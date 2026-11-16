# Handoff — Item 18 · Template de apresentação do Projecto (PowerPoint)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`. A atribuição não transfere direitos de terceiros.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md`.

**O que é.** Template `.pptx` (16:9, 19 slides) para apresentar o Projecto Comunitário de Milreu em encontros, aulas e reuniões institucionais. Tem campos `[entre parênteses rectos]` para preencher, usa o design system oficial (tokens v0.2), inclui os parceiros (Faixa de Logos canónica) nos slides-chave e traz um banco de imagens sugeridas, recortadas a partir de imagens que o projecto já apresentou.

**Estado:** `DRAFT v0.1 — HUMAN GATE` (revisão visual do responsável pendente; sem commit).

## 1. Local dos arquivos
- **Template:** `docs/dissemination/template-apresentacao/TEMPLATE_Apresentacao_Projecto_Milreu_v0.1.pptx`
- **Imagens sugeridas:** `docs/dissemination/template-apresentacao/imagens-sugeridas/` (16 JPG + `IMAGENS_SUGERIDAS.csv` com fonte canónica, crédito obrigatório, aviso, transformação e SHA-256).
- **Geradores (versionáveis):** `source/generators/prepare_images.py` (recortes + logótipos medidos) e `source/generators/build_template.js` (pptxgenjs).
- **Intermédios:** `_private/build/` (logótipos recortados, JSON) — gitignored, regenerável.

## 2. Pontos mais importantes
- **Layouts (editáveis no PowerPoint → Novo diapositivo):** `MIL_CAPA`, `MIL_DIVISOR`, `MIL_TEXTO_IMAGEM`, `MIL_TITULO`, `MIL_IMAGEM_INTEIRA`, `MIL_DESTAQUE`, `MIL_CITACAO`, `MIL_FECHO`. Cada um tem marcadores de texto e de imagem com nome, e um campo de **crédito** sempre que há imagem.
- **Parceiros em slides-chave:** capa (Faixa modo B compacta), slide 17 «Apoio institucional e parcerias» (modo A distribuída + ficha técnica canónica) e fecho (modo A). A Faixa está **no layout** (não se apaga por engano). Ordem fixa, intervalo único = 0,6 × altura do trio, trio indivisível, alturas ópticas da `FAIXA_DE_LOGOS_CANONICA.md` §3. Menção «Apoiado pela CCDR Algarve, I.P.» (art. 16.º) na linha do cabeçalho da Faixa.
- **Identificador «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026»** abaixo do Projecto (capa e fecho), fora da fila de parceiros. Apagar em apresentações fora do ciclo 2026.
- **Ficha técnica** (slide 17) = créditos canónicos (Jácomo · Meira Pinto/AAMLF · voluntários), ordem fixa, pesos iguais.
- **Conteúdo pré-preenchido só com factos canónicos:** definição do projecto (CLAUDE.md §1), 3 pilares (regra 07D.1), 2 iniciativas MSF 2026, títulos/datas/créditos do índice do Museu, legendas das fotografias de eventos (PROVENIENCIA.txt), `projectomilreu.pt`. Tudo o resto fica em `[ ]`.
- **Sem números, citações nem e-mails inventados.** O slide «Em números» exige fonte + estado; a cronologia traz as datas documentadas **só nas notas do orador**.
- Imagem do Circuito Educativo = IA → aviso **«Representação conceptual · não documental»** obrigatório no slide.

## 3. Como se estruturou a arte
Tokens v0.2 lidos de `packages/design-tokens/v0.2/primitives.json` (sem hex novos): fundo `paper.50`, texto `ink.950`, divisores em `ink.950` (superfície inversa), vermelho `red.500/700` só como assinatura (números, rótulos, círculos de ícone). Fraunces (títulos) · Spectral (texto) · Archivo (rótulos, créditos, Faixa). Tema do PPT com estes nomes de fonte; sem ficheiros de fontes no pacote. Sem gradientes, barras ou faixas decorativas. Ícones Phosphor (`react-icons/pi`) em branco sobre círculo vermelho, 24×24 de origem.

Sequência: Capa → Sumário → 01 O Projecto (divisor, texto+imagem, pilares) → 02 Iniciativas 2026 (divisor, duas iniciativas, cronologia, fotografia inteira, números) → 03 Museu de Memórias (divisor, grelha de 4 memórias, memória em destaque com **narrativa comunitária antes do contexto institucional**, citação) → 04 Parcerias e próximos passos (divisor, próximos passos, parcerias) → Fecho com QR → Anexo «Banco de imagens sugeridas» (apagar antes de apresentar).

## 4. Como se trabalhou ponto a ponto
1. `python3 docs/dissemination/template-apresentacao/source/generators/prepare_images.py` — recorta a margem branca das digitalizações, enquadra na proporção de cada slide, redimensiona (≤1920 px), grava sem EXIF; mede os logótipos.
2. `NODE_PATH=<node_modules> PPTX_SKILL=<skill pptx> node .../build_template.js` — gera o `.pptx` e aplica o tema (cores dos tokens). Requer `pptxgenjs`, `react`, `react-dom`, `react-icons`, `sharp` (node instalado localmente; ver memória de ferramentas).
3. QA visual: exportação PDF pelo Keynote + revisão slide a slide (sobreposições, alinhamentos, créditos). XML de todas as partes validado.

## 5. O que NÃO fazer
- Não usar MM202617 nem registos com retoque por IA sem o aviso respectivo (o gerador recusa-os).
- Não alterar tonalidade/cor das imagens nem «melhorar» com IA: os derivados são só recortes.
- Não apagar créditos nem o aviso do Circuito; não separar o trio; não acrescentar/remover parceiros sem decisão.
- Não gerar QR sem URL real e público; não pôr números de público sem validação (Item 13).
- Não «corrigir» o «PROJETO» do logótipo (asset oficial). Corpo em grafia pré-AO90 («Projecto»).

## 6. Resultado esperado
Template pronto a duplicar e preencher pelo responsável, com aparência coerente com os restantes materiais do ciclo 2026.

## 7. Documentos necessários
Tokens v0.2; `FAIXA_DE_LOGOS_CANONICA.md`; `IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md` §7; `public/data/museum-index.json`; `public/media/events/PROVENIENCIA.txt`; `_SOURCES_SHARED/assets/RIGHTS.md`.

## 8. Pendências observadas
- Revisão visual humana do template (HUMAN GATE).
- Fontes Fraunces/Spectral/Archivo têm de estar instaladas no computador que apresenta; caso contrário o PowerPoint substitui-as (recomendação: exportar PDF para apresentar fora do computador do responsável).
- Ficheiro com 17 MB (logótipos em alta resolução repetidos em 3 faixas); reduzir se necessário.
- E-mail de contacto do fecho por confirmar (não pré-preenchido).
- Trio Milreu só existe a 613×90 px (pendência herdada da Faixa).
- Herdadas: autorização da Junta de Estoi por registar em `PROVENIENCIA.txt`; SVG oficial do logótipo.

## 9. Dossiê do modo de trabalhar
Ver método comum (`00_INDEX_E_METODO.md`). Imagens: preferir sempre as do banco (já publicadas) e copiar o crédito do CSV.

## 10. Onde está cada informação
Layouts e regras de composição → `build_template.js`; imagens, créditos e transformações → `IMAGENS_SUGERIDAS.csv`; orientações de preenchimento → notas do orador de cada slide.

## 11. Registo incremental (append-only)
- 2026-10-20 · NOVO · Item 18 aberto: template PPT com marcadores, design system v0.2, Faixa de Logos nos slides-chave (capa, parcerias, fecho) e 16 imagens sugeridas (recortes de imagens já publicadas). v0.1 gerado e revisto visualmente (Keynote). Sem commit. · esta sessão
- 2026-10-20 · NOVO · Item 18: 1.ª derivação do template — comunicação «O arqueólogo e a manutenção da memória» (`derivacoes/comunicacao-arqueologo-memoria/`): 11 slides (capa + 8 cronometrados + bibliografia + fecho), talking points e bibliografia RPA do responsável nas notas, referências autor–data no rodapé, 12 imagens recortadas com CSV de créditos, QR validado para projectomilreu.pt. Template inalterado (layouts exportados por `build_template.js`, saída verificada idêntica). Sem commit. · esta sessão
- 2026-10-20 · ALTERADO · Item 18 / derivação «arqueólogo e memória» v0.2 (v0.1 mantida): texto afinado para não sobre-afirmar (slides 1, 7, 8), legenda de certeza ligada ao vocabulário da ficha (slide 6), Estácio da Veiga vs foto de 1897 clarificado (slide 2), ortografia pré-AO90 coerente nas notas, nota de ritmo no slide 1 (~170 palavras/min). Bibliografia revista (RPA, itálicos) e verificada: DOIs Moser/Tully (Crossref), Thomas pp. 14–30 e Introdução de Moshenska pp. 1–13 (substitui a entrada do livro), Pinho & Freitas 2.ª ed. revista, Teichner 2001 (vol. 19, edit. 2003). PENDENTE: co-autoria de Virgílio Correia em «Arqueologia: normas gerais» (catálogo consultado só indica Raposo e Martins). Sem commit. · esta sessão
- 2026-10-20 · NOVO · Item 18 / derivação «arqueólogo e memória»: `NOTA_DE_CORRECAO_v0.2.md` com o que não foi encontrado ou diverge da fonte, e sugestões (não aplicadas): (1) Hauschild & Teichner 2002, p. 13 dá início das escavações sistemáticas em 1971, sob IAA + FA-UTL + Museu Monográfico de Conímbriga, sem nomear Hauschild → corrigir slide 2; (2) co-autoria de V. Correia em «Arqueologia: normas gerais» não encontrada; (3) números 19 / 6–7 sem registo no repositório (Anexo D); (4–5) páginas citadas não conferidas no texto; (6–7) opcionais Teichner [2003] e handle da dissertação. · esta sessão
- 2026-10-20 · ALTERADO · Item 18 / derivação ENEP v0.3 (v0.1/v0.2 mantidas), conforme `NOTA_DE_RESOLUCAO_v0.3.md`: capa com título oficial do Programa do III ENEP (5-11-2026, 15h45, Painel 2); slide 2 «desde 1971» (Hauschild & Teichner 2002, p. 13) mantendo a direcção de Hauschild (Teichner 1997, p. 107, dossiê RPA); slide 4 Anexo D p. 2 (19 membros até Junho/2026; média 6–7 por etapa); slide 6 com o vocabulário e exemplos da ficha MM202613 (Anexo C), sem a data 1981; bibliografia com Teichner 1997 e o handle da dissertação; Anexos C/D à parte como dados primários. Co-autoria de V. Correia mantida. PENDENTE: data da MM202613 no índice do Museu diverge do Anexo C (revisão de registo); confirmar arquivo da autorização da MM202614. Sem commit. · responsável + esta sessão
- 2026-10-21 · DECISÃO · Museu / MM202613: responsável escolheu a **alternativa B — manter «ca. 1981, segundo hipótese de Cristina Farias»**. Proposta fechada; registo canónico, derivados e materiais inalterados. Ficam por tratar: Anexo C (ficha MM202613 diz «ca. 1970s») a corrigir na próxima versão; slide 6 do ENEP v0.3 («ca. década de 1970 · possível») diverge agora do registo — decidir no Item 18; referência do testemunho de C. Farias para a MM202613 a acrescentar às fontes quando indicada. Sem commit. · responsável
- 2026-10-21 · ALTERADO · Item 18 / derivação ENEP v0.4 (v0.1–v0.3 mantidas), conforme `NOTA_DE_RESOLUCAO_v0.4.md`: ligação ao tema «Patrimónios rurais» nas notas (slides 3 e 9); legenda MM202606 «posterior a Estácio da Veiga (década de 1870)»; diagnóstico 2024 com 532 respostas + 9 entrevistas (dados canónicos de 06-10); catalogação reformulada (fichas inspiradas nas Normas; CIDOC CRM como referencial conceptual; «testemunhos orais»); MM202613 «facultada por» (não «cedida»), certeza por afirmação, decisão de 21-10 sobre 1981 nas notas; discussão como leitura do caso; bibliografia em 2 páginas legíveis com DOI de capítulo (Moshenska, Thomas). Co-autoria de V. Correia confirmada na ficha técnica do IPM (encerrada). PENDENTE: papéis na proveniência da MM202613, âmbito das autorizações (gravação/publicação), fac-símile de Teichner 1997 p. 107, evento de 31-10. Sem commit. · responsável + esta sessão
- 2026-10-21 · ALTERADO · Item 18 / derivação ENEP v0.5 (v0.1–v0.4 mantidas), por indicação do responsável: slide 3 com três quadrantes iguais (século XIX · segunda metade do século XX · actualmente — diagnóstico 2024 + roda de conversas de 07-02-2026, com hipótese); «Anexo C/D» retirado de todos os slides (substituído por «inventário do Museu de Memórias / registos de curadoria, em preparação»; mantém-se só nas notas do orador); slide 9 simplificado em três frases curtas; slide 4 «uma das iniciativas» + «exemplos do acervo · 2 de 31 fotografias». Sem commit. · responsável
- 2026-10-22 · ALTERADO · Item 18 / derivação ENEP v0.6 (v0.1–v0.5 mantidas), por pedido do responsável: novo slide 2 «Milreu e o Projecto Comunitário de Milreu» — sítio (villa romana em Estoi; pars urbana, pars rustica e edifício religioso; ocupação romana, paleocristã e islâmica; casa rural até meados do séc. XX — Hauschild & Teichner 2002, pp. 8–9, 12; Monumento Nacional sob tutela do Património Cultural, I.P.) e projecto (definição canónica; iniciativas Museu de Memórias, «Entre Ruínas e Memórias», Circuito Educativo; 3 pilares); imagem MM202608 (recorte de margem). Fala ~30 s → total ~10 min. Datas de classificação (1910/1932 divergem entre fontes) e distância a Faro omitidas. Sem commit. · responsável
- 2026-11-14 · NOVO · Item 18: 2.ª derivação do template — comunicação 7.13 do **V CAAP** (Braga, 20-11-2026, Aud. B2, Bloco 7, 15 min) «Desafio da integração comunitária: o caso das Ruínas Romanas de Milreu (Estoi, Faro)» (`derivacoes/comunicacao-caap-2026/`): 8 slides cronometrados (capa · contexto de Milreu · problemática · contexto do projecto · referências · primeira entrega · dificuldades I e II) + bibliografia + fecho; poucas palavras, fala e fontes com página nas notas a partir do texto publicado; 10 recortes de imagens já publicadas (CSV de créditos; MM202631 recusada por intervenção IA declarada); PDF Keynote de salvaguarda; QR validado. Template inalterado. PENDENTE: título singular/plural, número actual do Inquérito 2026, realização da paragem de Estoi, editora das actas. Sem commit. · responsável + esta sessão
- 2026-11-14 · ALTERADO · Item 18 / derivação V CAAP v0.2 (v0.1 mantida), por pedido do responsável: slide 3 (problemática) troca a MM202609 («Pessoas em frente ao edifício de cultos», ano desconhecido — dúvidas do responsável) pela **MM202602** («Memórias de juventude — Estoi, década de 1950»; índice: jovens raparigas junto ao edifício de cultos de Milreu, possivelmente num passeio), que ilustra o uso quotidiano antes da musealização. Legenda sem repetição da data; nota do orador actualizada. Sem commit. · responsável
- 2026-11-14 · ALTERADO · Item 18 / derivação V CAAP v0.3 (v0.1–v0.2 mantidas), por indicação do responsável: «& alii» → **«et al.»** em todos os slides e notas (Brodie et al., 2011; Moser et al., 2002), como no texto publicado; bibliografia com a lista completa dos 9 autores de Moser (2002), como no texto. A derivação ENEP mantém «& alii» (já apresentada; não alterada). Sem commit. · responsável
- 2026-11-14 · ALTERADO · Item 18 / derivação V CAAP v0.4 (v0.1–v0.3 mantidas), por indicação do responsável («ninguém sabe disso»): revisão contextual para quem não leu o artigo — retiradas as referências ao «texto» (slide 8: «Apoio da CCDR Algarve só em Julho de 2026, através dos Amigos do Museu do Lyceu de Faro», deliberação de 6-07-2026; slide 7: «em Julho», data exacta da contagem não registada); legendas sem códigos MM2026 (ficam nas notas); AAMLF por extenso; «Diagnóstico de 2024 · 532 respostas a inquérito e 9 entrevistas»; «Exposição itinerante e online»; WhatsApp explícito; Fevereiro de 2026 explícito. Sem commit. · responsável
