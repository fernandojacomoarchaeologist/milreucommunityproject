> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# CE001: plano do documento «Pedido de suporte»

**Estado:** PLANO v0.2 (2026-11-18). A escrita ainda não começou. **Formato final:** Word (.docx), em português de Portugal pré-AO90, segundo `CONTROLO_ESCRITA_CE001.md`. **Destinatário:** o museu, para validação, com revisões previstas. Falta confirmar qual entidade: ver `LACUNAS_E_PERGUNTAS.md` A1.
**Análise de base:** `analise/A1_AUDITORIA_BIBLIOGRAFICA.md`, `analise/A2_COERENCIA_VIABILIDADE_E_LACUNAS.md`, `analise/A3_MATERIAIS_POR_ACTIVIDADE.md`.

## 0. Princípios de composição

- Abrir pelo **pedido**: o que se pede, a quem, quanto e em que condições. Depois justificar.
- Separar sempre o **realizado** (Museu de Memórias), o **planeado** (Circuito) e a **hipótese**.
- O documento tem dois leitores: a direcção ou o arqueólogo do museu, que valida conteúdo, e a parte administrativa, que lê custos e anexos. Os capítulos 1, 10 e 11 têm de se ler sozinhos.
- Uma ficha-tipo por actividade (cap. 7) dá comparabilidade sem repetir prosa.
- Os valores vivem numa **folha de cálculo privada** (`_private/CE001_custos.xlsx`, a criar na actividade b). O DOCX é gerado a partir dela, para que texto e tabelas não divirjam.
- Não pôr valores nem nomes de terceiros em ficheiros versionados. O DOCX final e os orçamentos ficam em `_private/`.

## 1. Estrutura por capítulo

| Cap. | Título provisório | Pergunta a que responde | Fontes no repo | Falta (bloqueia) | Figuras e tabelas | Ext. |
|---|---|---|---|---|---|---|
| — | Capa, ficha técnica, registo de versões, índice | Quem pede, a quem, versão | `IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md`; faixa de logos canónica | Entidade destinatária (A1); logótipos admitidos no documento | Faixa de logos (`build-logo-band`) | 2 p. |
| 1 | Sumário do pedido | O que se pede e quanto? | A3; folha de custos | **Todos os valores** (orçamentos) | Quadro-síntese: total pedido · absorvido pelo investigador · apoios em espécie | 1–2 p. |
| 2 | O Projecto Comunitário de Milreu e o lugar do Circuito | O que é o projecto e onde se situa o Circuito? | `docs/project/PROJECT.md`, `PANORAMA_DO_PROJECTO_E_ACOES.md`, memória MSF 2026; Item 19 | Formulação final da relação com a candidatura do Município (A2) | Esquema das iniciativas (texto, não ilustração) | 2 p. |
| 3 | Como surgiu e porquê | Que necessidade e que experiência anterior levaram ao Circuito? | REGISTO v0.2 §1; Item 13 (sessões); Item 19 (reunião de 17-11) | Relato do responsável sobre a origem, que **não está escrito** em nenhum documento (B3) | — | 1–1,5 p. |
| 4 | Fundamentação | Em que literatura e em que conhecimento de Milreu assenta? | CORRESPONDÊNCIA BIBLIOGRÁFICA; **A1** + adenda; **parecer crítico** (`fontes/…/MILREU_AUDITORIA_CRITICA_BIBLIOGRAFIA_CIRCUITO_v1.0.md`); `docs/research/HISTORIA_DA_VILLA_DE_MILREU.md` | — (decidido em 18-11: as lacunas declaram-se e não se resolvem) | Texto curto que parte do §6 do parecer. Matriz por estação (conteúdo / procedimento didáctico / situação) e bibliografia no **Anexo C** | 1–1,5 p. |
| 5 | Fases gerais (sem datas) | Por que ordem se constrói e o que desbloqueia cada fase? | CRONOGRAMA §1–2; nota financeira | Confirmar a ordem: mosaicos e bustos primeiro (B5) | Diagrama de fases (Fase 0 entregue → Fase 1 … → integração) | 1–2 p. |
| 6 | Primeira entrega realizada: Museu de Memórias | O que já foi feito e com que resultados? | Item 13 v1.5 (`docs/relatorio-execucao-ccdr-2026/data/sessoes.csv`, `acoes.csv`); Item 2 (site, n.º de registos e visitantes); Item 1 (painéis); Item 8 (Estoi) | Números actualizados a Nov-2026: visitas ao site, exposições depois de 10-10, peças no museu (B4); fotografias autorizadas | Quadro de sessões; 1–2 fotografias sem pessoas identificáveis | 2 p. |
| 7 | As actividades: funcionamento e blueprint | Como funciona cada estação, para quantas pessoas e com que limites? | FUNCIONAMENTO; REGISTO; `imagens/INDEX_IMAGENS.md`; A2 §2–3 | **CE-BP-01** (três modelos de caixa); decisão modalidade A/B na estratigrafia; lotações por estação (C2) | Uma ficha por actividade (9) + blueprint | 9 × 1–1,5 p. |
| 8 | Cronograma por actividade | Quando é que cada estação fica pronta, e de que depende? | CRONOGRAMA §2–5 | Decisão: meses de 2027 ou meses relativos (M1…M9) depois do financiamento (B6) | Gantt (tabela P/T/I/C) | 1–2 p. |
| 9 | Composição dos materiais por actividade | De que é feito cada módulo? | **A3**; GUIA §18–19 | Quantidades em aberto (C1–C6) | Tabela por actividade (sem preços) | 3–5 p. |
| 10 | Custo por actividade e o que não está incluído | Quanto custa cada módulo e o que fica fora? | Folha privada; GUIA §17 | **Orçamentos** (actividade a); decisões sobre o absorvido (B1–B2) | Tabela custo por actividade + caixa «não incluído, sem preço discriminado»: licença Claude, Photoshop, alojamento do site, impressora já existente, deslocações do investigador, horas de trabalho, com justificação geral | 2 p. |
| 11 | Custo por categoria | Quanto se gasta em impressão, madeira, filamento, etc.? | Folha privada; A3 (categorias) | Idem | Tabela por categoria + total; separação **pedido / absorvido pelo investigador / apoio em espécie** | 1–2 p. |
| 12 | Condições: financiamento faseado, apoios, destino dos bens | Como se executa sem pré-financiamento e de quem são os bens? | README §Condição financeira; Item 19; GUIA §1 | Destino dos bens versus candidatura do Município (A2); confirmar os apoios Ossónoba e 50 € (B2) | — | 1–1,5 p. |
| 13 | Riscos e próximos passos | O que pode falhar e o que se pede ao museu agora? | CRONOGRAMA §8; A2 §7 | — | Tabela de riscos (curta) | 1 p. |
| Anexos | A: orçamentos recebidos, um por fornecedor · B: blueprints em página inteira · C: bibliografia · D: lista de materiais completa (A3) · E: glossário curto (tessela, estratigrafia, crivagem…) | — | `_private/orcamentos/` | Orçamentos (actividade a) | — | — |

**Extensão estimada:** 30–40 páginas sem anexos. Se o museu pedir menos, os capítulos 1, 6, 7 (resumido), 10 e 11 formam uma versão curta de cerca de 12 páginas.

## 2. Ficha-tipo por actividade (cap. 7)

Campos fixos, em tabela: objectivo de aprendizagem · público e idades · modalidades (grupo pequeno / turma) · lotação activa e rotação · mediadores necessários · duração (ou «a testar») · espaço e condições (chuva, mesa, sombra) · limitações físicas e alternativas · materiais principais (remete para o cap. 9) · blueprint · ligação a outras estações · estado (concebida / protótipo / testada).
Depois da tabela vêm 2 a 4 parágrafos em prosa sobre o funcionamento, diferentes em cada estação.

**Escavação (estação 01): três modelos**, por decisão do responsável de 18-11-2026:
1. **Padrão:** caixa de madeira de 1 m², com duas camadas de enchimento, objectos e lona por baixo.
2. **Simplificada:** quadriculagem com barbantes, para eventos menores.
3. **Integrada no solo:** só onde a intervenção seja autorizada. A escavação não passa de **10 cm** e serve para ensinar técnicas, como manter o corte aprumado ou decapar por camadas. Há mais descarte e usa-se **só material biodegradável que possa voltar ao solo**.

Materiais de enchimento: **areia de gato biodegradável, de certificação ecológica, a opção mais barata**, misturada com **granulado de cortiça**. O nome técnico está a confirmar em A2. As duas granulometrias são **diferentes** para se separarem na crivagem. Os dois são **consumíveis recorrentes**.

**Estratigrafia (estação 03):**
- **Legenda 1:** estação com materiais naturais ou pré-preparados (cascalho, arenito, terra queimada, vestígio de solo), montada com o público, com identificação e datação.
- **Legenda 2:** estação montável com peças impressas em 3D e pintura manual, o que exige tintas e verniz.

**Actualização de 18-11 (decisão do responsável):** os modelos de caixa são **caixas organizadoras de plástico padrão, potencialmente pretas**, e não é preciso o blueprint CE-BP-01. Falta confirmar se isto substitui a caixa de madeira de 1 m² do guia §18.1 e do CE-BP-02a.

## 3. Itens acrescentados pelo responsável (18-11-2026) a reflectir no cap. 9–11

**Actualização de 18-11:** tecido, tintas, granulado de cortiça, caixas organizadoras e verniz entram **todos no escopo, a adquirir**. A impressora é um recurso existente e fica **fora do pedido**. **Sem kit de mosaico para levar para casa**: fica só uma reserva de tesselas. Seguro e local das oficinas com voluntários: **a definir com o Museu Arqueológico de Faro, a AAMLF e a Junta de Freguesia de Estoi**. Arranque **na primeira semana de Fevereiro**, pelos mosaicos (ano a confirmar, provavelmente 2027).


- Tecido para sacos: sacos de pano para os painéis dobrados, bolsas de moedas e sacos de achados.
- Caixas organizadoras de **cerca de 50 cm** para armazenamento.
- **Verniz** para as caixas de madeira.
- **Tintas** para as caixas e peças estratigráficas.
- Oficinas de montagem **com voluntários**: ferramentas, EPI, espaço, lanche e água, e seguro (ver A2).
- Os consumíveis de enchimento repõem-se a cada ciclo de acções.

## 4. Processo de produção do DOCX (actividade c)

1. Skill canónica de escrita criada a partir do guia e de `CONTROLO_ESCRITA_CE001.md`.
2. Rascunho por capítulo em `redaccao/*.md`, com `[LACUNA]` explícitas.
3. Gerador `source/build_ce001_docx.py` (python-docx). Lê os MD, a folha de custos privada e as imagens, e grava em `_private/CE001_v0.X.docx`.
4. Verificação mecânica (`CONTROLO_ESCRITA_CE001.md` §5) e pré-visualização no QuickLook. A paginação final é revista no Word.
5. Revisão do responsável → envio ao museu → revisões numeradas, com registo de alterações no próprio documento.

## 5. Actividades futuras (não realizadas agora)

- **a.** Consolidar os pedidos de orçamento por empresa: listagem de produtos, em nome do museu, contexto, expectativas e observações gerais. A base é o GUIA §19–20 e A3. Fica em `_private/orcamentos/pedidos/`.
- **b.** Somar os valores e calcular o custo geral por actividade e por categoria, indicando o que o investigador absorve e o que não. Fica em `_private/CE001_custos.xlsx`.
- **c.** Escrever o DOCX com anexos para envio ao museu, com revisões futuras previstas.

## 6. Registo incremental (append-only)

- 2026-11-18 · NOVO · Plano v0.1 criado: estrutura de 13 capítulos e anexos, ficha-tipo, processo DOCX. · responsável + esta sessão
- 2026-11-18 · ALTERADO · Plano v0.2: cap. 4 reduzido (lacunas declaradas, bibliografia no Anexo C, segundo o parecer crítico); kit de oferta retirado; impressora fora do pedido; caixas de plástico padrão; itens de escopo confirmados; arranque na 1.ª semana de Fevereiro. · responsável
- 2026-11-18 · DECISÃO · As caixas de plástico padrão substituem a caixa de madeira de 1 m² **nos três modelos** de escavação. A descrição do modelo 1 na §2 («caixa de madeira de 1 m²») fica superada; a ficha da estação 01 descreve as caixas de plástico. No cap. 9–11 saem madeira, ferragens e verniz de madeira; o verniz fica só para peças pintadas. · responsável
- 2026-11-18 · DECISÃO · Arranque confirmado na 1.ª semana de Fevereiro de **2027**, pelos mosaicos. · responsável
- 2026-11-18 · DECISÃO · Respostas recebidas:
  - destinatário: Município de Faro (NIPC 506 579 425) / Museu Municipal de Faro, verificado; o CE001 é um documento próprio, distinto do Item 19;
  - o que o investigador absorve (B1);
  - Ossónoba: desconto nos painéis e adesivos;
  - origem nas entrevistas de 2024, o que desbloqueia o cap. 3;
  - caixa de plástico de 32 × 40 × 50 cm;
  - plástico bolha.
  Falta: o número de cerca de 5000 do relatório CCDR (não encontrado no repo), a origem dos 50 € e o interlocutor no museu. · responsável
- 2026-11-19 · ALTERADO · Recebido o documento de adaptações etárias e de acessibilidade (v1.0, 19-11). Muda o seguinte:
  - na **ficha-tipo do cap. 7**, o campo «público e idades» passa a uma linha por grupo (6–8, 9–10, 11–14, 15–17, 18+) e entra o campo «níveis (descoberta, investigação, interpretação)»;
  - o campo «limitações físicas e alternativas» remete para o §12 da fonte;
  - o **cap. 2** diz que os públicos são de várias idades, das crianças aos adultos;
  - o **cap. 9** acrescenta pictogramas, o piloto táctil e as peças ampliadas pontuais;
  - o **cap. 10** põe as mesas acessíveis na lista do que fica fora do pedido, a cargo do anfitrião;
  - o **cap. 13** junta o risco de as adaptações tácteis não funcionarem.
  As contradições com 18-11 estão em LACUNAS. · responsável
- 2026-11-19 · ALTERADO · O **cap. 8 passa a ter dois cenários**. O autofinanciado leva 2 meses por acção, sem numismática, sem cadernos e sem oficina de montar, e o digital só corre em computador do local; o responsável assume o risco. O cenário com apoio tem o conjunto completo. O **cap. 13** junta o risco do financiamento pessoal. Tablets (2, no mínimo) no pedido. · responsável
- 2026-11-19 · CORRIGIDO · A estrutura de escavação continua a ser de **1 m × 1 m, montável**: o §2 original estava certo, e as notas de 18-11 e 19-11 sobre a substituição ficam anuladas. Guarda-se em sacos próprios, ou na lona do fundo usada como saco. As caixas de plástico de 32 × 40 × 50 cm são para arrumação. Os **dois cenários** do cap. 8 incluem **todas as estações**. A diferença entre eles está no ritmo (2 meses por acção; moedas, cadernos e villa com duração própria) e em exclusões pontuais de materiais, mão-de-obra ou equipamento, sempre declaradas. · responsável
- 2026-11-19 · CORRIGIDO · **Precisão da descrição da estrutura de escavação** (substitui «montável» nas entradas de hoje): moldura **sem fundo rígido**, de 4 tábuas laterais com cerca de 1 m e 20 cm de altura, **articuladas por dobradiças metálicas reforçadas**, uma por canto (4 por caixa). Pelo menos uma união desacopla-se para a moldura **dobrar**. Tem fechos para ficar aberta em uso e **lona inferior amovível** de cerca de 1,30 × 1,30 m. **Guarda-se dobrada**, num saco próprio ou na própria lona do fundo usada como saco (guia §18.1; CE-BP-02a: painéis com dobradiças → painéis dobrados + lona → saco). · responsável + guia §18.1
- 2026-11-19 · DECISÃO · **Limite de peso (decisão do responsável):** nenhuma caixa de escavação pode passar de **20–30 kg** de enchimento. A estimativa de 35–100 kg por caixa (1 m² a 10–15 cm, densidade de 0,35–0,65 kg/L de A2) **não é aceitável**. Com essa densidade, 20–30 kg em 1 m² dão uma camada de cerca de **3–9 cm**. As alternativas, a decidir com a medição real da mistura, são:
  - uma mistura mais leve, com mais granulado de cortiça;
  - uma camada menos espessa;
  - menos área enchida.
  Até lá, o pedido de orçamento e os capítulos 7 e 9 usam o tecto de 20–30 kg e não a estimativa anterior. · responsável
- 2026-11-19 · CORRIGIDO · **CORRECÇÃO do limite de peso:** os **20–30 kg aplicam-se a cada volume transportado**, não ao enchimento total da caixa de 1 m². O enchimento de uma caixa reparte-se por vários contentores, e se um contentor ficar pesado demais **usa-se um mais pequeno para esses materiais**. Com a estimativa de A2 (35–100 kg por caixa a 10–15 cm) são cerca de **2 a 5 contentores por caixa**, ou cerca de 10–25 para 5 caixas. Exemplo: a caixa organizadora de 45 L, cheia com a densidade estimada (0,35–0,65 kg/L), dá cerca de 16–29 kg, dentro do limite; com mistura mais densa enche-se só em parte ou usa-se uma caixa menor. Quantidade e tamanho dos contentores por definir com a mistura medida. A moldura de 1 m² **nunca se transporta cheia** (não tem fundo rígido). · responsável
- 2026-11-21 · ALTERADO · Brief de 21-11:
  - a ficha-tipo do cap. 7 passa a ter quatro blocos fixos (componente funcional, embasamento teórico, estratégia de aplicação, limitações de idade, funcionais e físicas) e passa de 9 para 14 fichas (A livro, B passaporte, C quebra-cabeças, D adolescentes, E acessibilidade);
  - cap. 4 e Anexo C com A4;
  - cap. 9 com A6, organizado por componente e por tipo de fornecedor;
  - cap. 13 com os riscos de menores, autorizações, tutelas e prazos longos.
  Ver A5 §«Impacto nos capítulos». · responsável
- 2026-11-21 · DECISÃO · F1–F9 respondidas:
  - política de menores com a base de Brito et al. e os acrescentos aprovados;
  - livro de 50 pp., 500 ex.: desenhos das crianças, texto e legendas adaptados pelo investigador;
  - passaporte de 500 livretos de 20 pp.;
  - 10 quebra-cabeças diferentes; A0 com peças de 10–15 cm (expectativa);
  - braille para deficiência visual;
  - checkpoints com adolescentes em 2027;
  - no cenário sem financiamento, só a mediação e o livro digital, sem passaporte nem quebra-cabeças;
  - passaporte a definir com o museu;
  - Guardado e Corsaro citados de forma geral.
  · responsável
