# Handoff — CE001 · Pedido de suporte do Circuito Educativo

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md`.

**O que é.** O primeiro item da numeração **CE** (Circuito Educativo). É um relatório contextual, em Word e em PT-PT pré-AO90, que pede ao museu suporte para o Circuito Educativo de Milreu. Inclui o enquadramento, a origem e a motivação, a fundamentação, as fases, a primeira entrega (Museu de Memórias), as actividades com blueprint, o cronograma, os materiais, os custos por actividade e por categoria, e os orçamentos em anexo.

**Estado (2026-11-18):** ANÁLISE E PLANEAMENTO CONCLUÍDOS · plano v0.2 com decisões de 18-11 · escrita **não iniciada** · sem commit (HUMAN GATE).

## Onde está a informação
- `docs/circuito-educativo/README.md`: numeração CE e **condição financeira faseada**.
- `docs/circuito-educativo/fontes/`: os 6 documentos de 18-11-2026 (arquivo, não editar) e `MANIFESTO.md` com os SHA-256.
- `docs/circuito-educativo/imagens/INDEX_IMAGENS.md`: blueprints CE-BP-02a…05, candidatas e CE-BP-01, que está em falta.
- `docs/circuito-educativo/CE001_pedido_suporte/`:
  - `analise/A1_AUDITORIA_BIBLIOGRAFICA.md`
  - `analise/A2_COERENCIA_VIABILIDADE_E_LACUNAS.md`
  - `analise/A3_MATERIAIS_POR_ACTIVIDADE.md`
  - `PLANO_DOCUMENTO_CE001.md`
  - `CONTROLO_ESCRITA_CE001.md`
  - `LACUNAS_E_PERGUNTAS.md`
  - `_private/` (gitignored): orçamentos, folha de custos e DOCX.
- Guia de escrita: `docs/governance/escrita/ANEXO_GUIA_SINAIS_DE_TEXTO_GERADO_POR_IA.md`, base da futura skill.
- Relacionado: **Item 19** (candidatura do Município, prazo 08-12-2026), **Item 13** (CCDR 2026, componente Circuito e impressora) e **Item 17** (bustos 3D).

## Pontos principais
- Projecto **faseado**, com recursos próprios do investigador. O reembolso não acelera a entrega. Com a AAMLF avaliam-se apoios directos (serviço, produto, pagamento ao fornecedor). Houve apoios pontuais da Gráfica Ossónoba (impressos gratuitos) e um auxílio de 50 € no Museu de Memórias, por confirmar. Os materiais também são montados em oficinas com voluntários.
- **Bloqueantes:** destinatário e relação com o Item 19 (duplo financiamento); destino dos bens; impressora e componente Circuito já apoiadas pela CCDR; lotação da escavação (5 caixas ou 1 em rotação); preparação dos mosaicos em Dez.–Jan.; volume do kit de mosaico oferecido; o enchimento sem lote de orçamento; seguro e local das oficinas de voluntários.
- **Bibliografia:** todas as obras existem e nenhuma revista tem perfil predatório. Há usos excessivos a corrigir, 13 obras fora da lista canónica e lacunas temáticas.
- O DOCX é viável com python-docx (testado). A paginação final é revista no Word.

## Próximas actividades (não iniciadas)
a. Pedidos de orçamento por empresa, em nome do museu · b. Soma dos custos, absorvido versus pedido · c. Skill de escrita e redacção do DOCX com anexos, revisões previstas.

## Registo incremental (append-only)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`.

- 2026-11-18 · NOVO · Item CE001 criado. Fontes e imagens arquivadas com SHA-256, análises A1–A3 por agentes, plano de 13 capítulos, controlo de escrita PT-PT pré-AO90, lacunas e perguntas (A1–E4). Sem commit. · responsável + esta sessão
- 2026-11-18 · NOVO · Novos dados do responsável: os três modelos de caixa de escavação; as legendas da estratigrafia; areia de gato biodegradável, a mais barata; granulado de cortiça com granulometria separável e consumível; faltam tecido para sacos, caixas organizadoras de cerca de 50 cm, verniz e tintas; montagem em oficinas com voluntários; apoios Ossónoba e 50 €. · responsável
- 2026-11-18 · PENDENTE · CE-BP-01 (três modelos de caixa) não recebido. A ordem de abertura chegou com dois ficheiros duplicados em Downloads (`exec-a3a1b16b…` = estratigrafia; `Tríptico técnico…` = villa). · esta sessão
- 2026-11-18 · PENDENTE · Na execução CCDR 2026, a impressora 3D e os filamentos estão registados como acção do Circuito (ACAO-04), e o orçamento CCDR tem uma componente Circuito. Isto contradiz «impressora pessoal» nos documentos de 18-11 e tem de ser decidido antes do capítulo de custos. · esta sessão
- 2026-11-18 · DECISÃO · Respostas do responsável:
  - a impressora 3D é um recurso existente do projecto, fora do pedido;
  - sem kit de mosaico para levar para casa, só uma reserva;
  - tecido, tintas, granulado de cortiça, caixas organizadoras e verniz no escopo;
  - seguro e local das oficinas de voluntários a definir com o Museu Arqueológico de Faro, a AAMLF e a Junta de Estoi;
  - arranque na 1.ª semana de Fevereiro pelos mosaicos;
  - os modelos de caixa são caixas organizadoras de plástico pretas, por isso CE-BP-01 deixa de ser necessário;
  - a bibliografia vai em anexo, com as lacunas declaradas.
  Parecer crítico da bibliografia arquivado em `fontes/` e adoptado. Plano v0.2. · responsável
- 2026-11-18 · PENDENTE · Confirmar: ano do arranque (o responsável escreveu «Fevereiro de 2026», provavelmente 2027); se as caixas de plástico substituem a caixa de madeira de 1 m² em todos os modelos; destinatário formal e relação com o Item 19 (A1–A3). · esta sessão
- 2026-11-18 · DECISÃO · As caixas de plástico padrão substituem a caixa de madeira de 1 m² **nos três modelos**. Saem do pedido madeira, ferragens e verniz de madeira; o verniz fica para as peças pintadas; CE-BP-02a deixa de mostrar a estrutura. Falta a dimensão e o modelo da caixa (volume e peso do enchimento). Continua pendente o ano do arranque. · responsável
- 2026-11-18 · DECISÃO · Arranque confirmado na 1.ª semana de Fevereiro de **2027**, pelos mosaicos; preparação em Dez. 2026–Jan. 2027. Pendentes que restam: destinatário formal e relação com o Item 19 (A1–A3), B1–B4, B6, C1–C3, C6, C8, medidas da caixa de plástico. · responsável
- 2026-11-18 · DECISÃO · Destinatário: **Município de Faro (NIPC 506 579 425), Museu Municipal de Faro**, Largo Dom Afonso III, 14. Verificado: o «Museu Arqueológico de Faro» é o Museu Municipal. O CE001 é distinto do Item 19 (separar rubricas no cap. 12). Outras respostas:
  - absorvido: CCDR, licenças, alimentação e deslocações do investigador, salvo casos extraordinários;
  - Ossónoba: desconto nos painéis e adesivos;
  - origem: entrevistas de 2024 (3 problemas);
  - caixa de plástico reciclado de 32 × 40 × 50 cm, 45 L (cerca de 7–20 kg de enchimento por caixa, estimativa);
  - plástico bolha.
  Pendentes: o número de cerca de 5000 (não encontrado no repo), a origem dos 50 €, o interlocutor, C1, C2, C6, C8 e B6. · responsável
- 2026-11-18 · RESOLVIDO · O «cerca de 5000» é o custo do Museu de Memórias: orçamento de 5 486 €, apoio CCDR de 2 200 € (não 2300) e o restante absorvido pelo investigador, em apuração. Dados no relatório CCDR do repo. · responsável + repo
- 2026-11-18 · RESOLVIDO · Os 50 € são o desconto da Gráfica Ossónoba (painéis e adesivos), já reflectido na fatura. B2 fechado. · responsável
- 2026-11-19 · NOVO · Documento de adaptações etárias, acessibilidade e materiais (v1.0) arquivado em `fontes/2026-11-19_adaptacoes/`, com SHA-256 no MANIFESTO.
  - **Os públicos têm idades diversas:** 5 grupos (6–8, 9–10, 11–14, 15–17, 18+) com níveis flexíveis; o caderno único é para 6–10 anos.
  - Texto e pictogramas são obrigatórios; o táctil fica em piloto; peças maiores só pontualmente; as mesas acessíveis são do anfitrião.
  - C2 fechado; C1 avança (5 caixas em paralelo se houver espaço e equipa).
  - Três contradições com 18-11 (mosaicos para levar, «impressora pessoal», «Museu Arqueológico»), registadas em LACUNAS; prevalecem as decisões de 18-11.
  · responsável
- 2026-11-19 · DECISÃO · Os mosaicos não vão para casa. A impressora 3D é do investigador, fora do pedido (corrige 18-11; manter coerência com o DESP-002 do relatório CCDR). A designação oficial vai nos dados formais e «Museu Arqueológico de Faro» é aceite no texto corrente. As três contradições de 19-11 ficam fechadas. · responsável
- 2026-11-19 · DECISÃO · Tablets: não há, prevêem-se 2, no mínimo, no pedido. Bustos: uso académico, sem fim comercial, liberados para reprodução (falta citar a fonte de cada um). Cronograma autofinanciado: 2 meses por acção, sem numismática, cadernos e oficina de montar; online só em computador do local; o risco pessoal fica com o responsável. A esclarecer: «1 m × 1 m» nos mediadores por caixa (contraria a caixa de 32 × 40 × 50 cm?); se a «oficina de montar» é a villa; se a caça ao tesouro entra no autofinanciado. · responsável
- 2026-11-19 · CORRIGIDO · **Erro de leitura desta sessão, corrigido.**
  - A estrutura de escavação é de 1 × 1 m, montável, e **não** vai em caixas de plástico. Guarda-se em sacos próprios, e a lona do fundo pode servir de saco.
  - As caixas de plástico de 32 × 40 × 50 cm são organizadoras de arrumação.
  - A madeira, as ferragens e o verniz de madeira voltam ao pedido; o enchimento volta a cerca de 35–100 kg por caixa.
  - Um mediador por caixa de 1 m² (leitura a confirmar). «Oficina de montar» = villa.
  - **Todo o circuito entra** nos dois cenários. Sem financiamento são 2 meses por acção (moedas, cadernos e villa com duração própria); podem sair só materiais, mão-de-obra ou equipamento pontuais e declarados.
  · responsável
- 2026-11-19 · CORRIGIDO · Nas entradas de hoje, a estrutura de escavação aparecia como «montável»; a descrição certa é **dobrável, de 4 tábuas com dobradiças**, e guarda-se dobrada em saco ou na lona do fundo (guia §18.1, CE-BP-02a). · responsável
- 2026-11-19 · DECISÃO · Enchimento limitado a 20–30 kg por caixa (a estimativa de 35–100 kg fica rejeitada); com a densidade estimada, isso dá cerca de 3–9 cm em 1 m², ou uma mistura mais leve. · responsável
- 2026-11-19 · CORRIGIDO · O limite de 20–30 kg é **por volume transportado**, e não por caixa. O enchimento reparte-se por contentores (cerca de 2–5 por caixa); se um ficar pesado, usa-se um menor. · responsável
- 2026-11-21 · NOVO · Brief de novas componentes arquivado (`fontes/2026-11-21_ideias/`).
  - **A4** bibliografia: Brito et al., ARQUEOLAB e Blue Voices em grau A; Prout B+; Corsaro parcial; Darian-Smith C; Guardado N, sem pertinência; jogos digitais B/C.
  - **A5** fichas funcionais: 14 componentes, com os 4 blocos.
  - **A6** materiais: 224 linhas, 27 tipos de fornecedor; candidatos em `_private/`.
  - Locais do passaporte (5 tutelas) e ICArEHB verificados.
  - Perguntas F1–F9 em LACUNAS, com destaque para a política de menores e para o cronograma autofinanciado de cerca de 12 meses em sequência.
  · esta sessão + agentes
- 2026-11-21 · DECISÃO · F1–F9 fechadas (ver LACUNAS):
  - política de menores aprovada como base;
  - livro: 50 pp., 500 ex., adaptação de texto e legendas pelo investigador;
  - passaporte: 500 × 20 pp.;
  - 10 quebra-cabeças diferentes; A0 com peças de 10–15 cm (expectativa);
  - braille para deficiência visual;
  - checkpoints com adolescentes em 2027, com professores e assistentes operacionais presentes;
  - sem financiamento: só a mediação e o livro digital;
  - passaporte em aberto com o museu;
  - Guardado e Corsaro citados de forma geral.
  · responsável
- 2026-11-21 · NOVO · Passos pedidos pelo responsável.
  - **Passo 0:** skill canónica `.claude/skills/escrita-sem-sinais-ia/` (SKILL.md + `scripts/verificar_texto.py`).
  - **Passo 2:** 18 pedidos de orçamento por tipo de fornecedor, em nome do Município de Faro / Museu Municipal de Faro, só com o que não está absorvido. Estão em `_private/orcamentos/pedidos/`, por enviar, com o placeholder `[CONTACTO DE RESPOSTA]`.
  - **Passo 4:** Word v0.1. Rascunhos em `redaccao/` (14 capítulos e anexos A–E), gerador `source/build_ce001_docx.py`, DOCX em `_private/CE001_v0.1.docx` (cerca de 23 400 palavras, 22 lacunas a amarelo, listadas em `redaccao/00_LACUNAS_DO_RASCUNHO.md`).
  - Absorvido confirmado: impressora 3D e licenças de software.
  - Corrigido na revisão: impressora e filamento de 2026 «apresentados no relatório CCDR, a CCDR aprecia a elegibilidade», e não «já apoiados».
  · responsável + esta sessão + agentes
