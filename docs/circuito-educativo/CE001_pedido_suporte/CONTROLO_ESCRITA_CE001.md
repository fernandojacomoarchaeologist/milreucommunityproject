> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# CE001: controlo de escrita

**Estado:** preparado em 2026-11-18. A **skill canónica de escrita** será criada num segundo momento, antes de se redigir o documento (actividade futura c). Até lá, este ficheiro serve de contrato de escrita do CE001.
**Base:** `docs/governance/escrita/ANEXO_GUIA_SINAIS_DE_TEXTO_GERADO_POR_IA.md`, v1.0 de 18-11-2026, com 172 sinais numerados, a checklist do §11 e o método de sete passagens do §12. O guia diz que os sinais **não provam** autoria por IA. O objectivo é um texto fiel às fontes e claro, não baixar uma pontuação de detector.

## 1. Variante e grafia

O documento é escrito em **português de Portugal, com grafia tradicional pré-AO90**, por decisão do responsável. É a mesma convenção dos painéis, ver a memória «grafia pré-AO90». O logótipo oficial diz «PROJETO»: preserva-se tal como está e não se «corrige».

| Usar | Não usar (AO90 ou PT-BR) |
|---|---|
| Projecto, projectar | Projeto, projetar |
| actividade, activo, actual, actualmente, efectivo | atividade, ativo, atual, efetivo |
| objectivo, objecto, colecção, selecção, protecção, direcção, recepção, acção | objetivo, objeto, coleção, seleção, proteção, direção, receção, ação |
| arquitectura, arquitectónico, director, colectivo, exacto | arquitetura, diretor, coletivo, exato |
| connosco, convosco | conosco |
| equipa | time, equipe |
| planeamento, planear | planejamento, planejar |
| registo, registar | registro, registrar |
| facto (acontecimento) | fato |
| contacto, contactar | contato |
| utilizador, ecrã, telemóvel, sítio arqueológico | usuário, tela, celular |
| orçamento, fornecedor, factura | cotação (no sentido PT-BR), nota fiscal, fatura |
| crianças do 1.º ciclo do ensino básico | ensino fundamental, «primário» (o registo v0.2 usa a referência brasileira; não a transpor) |
| voluntários, mediadores | colaboradores (quando se quer dizer voluntários) |

**Excepções:** nomes oficiais e títulos de obras ficam como foram publicados, por exemplo «Património Cultural, I.P.», títulos de artigos e citações literais. Não normalizar testemunhos.

**Formatos:** datas em `18 de novembro de 2026` no corpo e `18-11-2026` nas tabelas. Os meses vão com minúscula, segundo a norma PT, e a escolha fica registada como decisão de estilo. Valores no formato `1 234,56 €`. Unidades com espaço: `50 cm`, `1 m²`.

## 2. Regras de conteúdo (criticidade «corrigir sempre»)

1. Nenhum facto, número, fonte, página, pessoa, instituição ou apoio sem origem registada. Se faltar, fica `[LACUNA: …]` no rascunho e nunca no documento enviado.
2. Distinguir sempre o **realizado** (Museu de Memórias, com dados do Item 13 v1.5), o **planeado** (Circuito) e a **hipótese** (variantes em estudo).
3. Nenhum apoio institucional se dá como garantido. A AAMLF «está a avaliar», o museu «é destinatário mediante aceitação» e o Município, no Item 19, «candidata».
4. Os blueprints são **ilustrações conceptuais, não à escala**. As plantas e os mosaicos desenhados não são documentos de Milreu. Se a origem for confirmada, declara-se o uso de IA (ver `../imagens/INDEX_IMAGENS.md`).
5. Os preços do jogo de numismática são regras de jogo e não preços romanos.
6. Cada referência bibliográfica só sustenta aquilo que a auditoria `analise/A1_AUDITORIA_BIBLIOGRAFICA.md` confirma.
7. A **condição financeira faseada** aparece uma única vez, num lugar claro (cap. 1 e cap. 10). Não se repete com outras palavras em cada capítulo, o que seria o sinal 41.

## 3. Regras de estilo (sinais mais prováveis neste tipo de documento)

| Sinal do guia | Risco no CE001 | Regra |
|---|---|---|
| 02, 06, 09, 11 (relevância proclamada, adjectivos grandiosos) | «papel fundamental», «rico património», «projecto inovador» | Trocar por factos: n.º de sessões, participantes, peças, datas |
| 07, 08 (abstracções, jargão da moda) | «sinergias», «ecossistema», «pilares», «jornada» | Dizer quem faz o quê, onde e com que material. «Pilares» só no sentido próprio do projecto (Comunicação, Mutualidade, Pertinência) |
| 15, 19 (verbos inflacionados, nominalização) | «potenciar», «alavancar», «proceder à aquisição» | «permitir», «comprar», «montar» |
| 31–36 (contrastes «não é X, é Y», tríades) | Frases de missão | No máximo um contraste deliberado no documento. Listas de três só quando há três coisas |
| 37–38 (paralelismo, parágrafos iguais) | Fichas de estação todas com o mesmo molde | A tabela-ficha uniformiza os dados. A prosa varia conforme a estação |
| 45–46 (abertura e fecho genéricos) | «Ao longo da história…», «O futuro dependerá…» | Abrir com o pedido e o que se pede. Fechar com o próximo passo e o prazo |
| 116, 121, 123 (negrito, listas com rótulo em negrito, separadores) | Herança dos MD de trabalho | No Word: negrito só em termos definidos e valores totais. Sem `---`. Listas só quando há sequência ou enumeração real |
| 119, 127–132 (Markdown cru, placeholders, marcas de interface) | Conversão MD→DOCX | Verificação automática antes de exportar (ver §5) |
| 140 (PT-PT/PT-BR misturado) | Fontes de origem brasileira | Tabela do §1 aplicada por pesquisa no ficheiro final |
| 153–161 (património: cronologia harmonizada, função sem base, reconstituição não assinalada) | Descrição da villa, réplicas e modelo 3D | Usar `docs/research/HISTORIA_DA_VILLA_DE_MILREU.md` com página. Usar «poderá» quando a fonte só o permite |
| 162, 165 (relatório celebratório, benefícios sem prova) | Capítulo «primeira entrega» | Números do Item 13 (sessões, participantes, peças), sem «enorme sucesso» |
| 168 (fórmulas de e-mail) | Carta de apresentação e pedidos de orçamento | Tom directo, cortês, sem «venho por este meio» |

## 4. Procedimento de escrita (por capítulo)

1. Ficha do capítulo do `PLANO_DOCUMENTO_CE001.md`: pergunta a que responde, leitor, fontes e dados em falta.
2. Rascunho em Markdown em `redaccao/` (pasta a criar na actividade c), com `[LACUNA]` explícitas.
3. Sete passagens do guia §12: finalidade → afirmações → fontes → argumento → estilo → edição → leitura em voz alta.
4. Checklist §11 do guia preenchida por capítulo, com registo em `redaccao/CHECKLIST_<cap>.md`.
5. Revisão do responsável. Só depois se gera o DOCX.

## 5. Verificação mecânica antes do DOCX (a implementar com a skill)

Pesquisa automática no texto final, com relatório e sem correcção cega:
- grafia AO90 e PT-BR proibida (lista do §1, com excepções para nomes próprios e citações);
- expressões-sinal de maior risco (§3), contadas por capítulo;
- resíduos: `[LACUNA`, `TODO`, `**`, `##`, `---`, `](`, `contentReference`, `oaicite`, `turn0`, `【`, `:::`;
- números: os totais do texto batem com as tabelas de custo e com a folha de cálculo privada;
- referências: cada citação do texto existe na bibliografia e vice-versa.

## 6. Viabilidade do DOCX

Foi testado em 2026-11-18. O `python-docx` instala-se com `pip --target` no scratchpad, gera títulos, tabelas, imagens e acentos PT, e o QuickLook (`qlmanage`) mostra a pré-visualização. **Limites:**
- não há Word nem LibreOffice nesta máquina, porque o `Pages.app` não é Word, e a verificação final da paginação tem de ser feita no Word do responsável ou do museu;
- as fontes do Design System (Fraunces, Spectral, Archivo) não se distribuem e só estão no Mac do responsável, por isso o DOCX deve indicar fontes de substituição ou usar fontes de sistema;
- os índices automáticos e a numeração de figuras e tabelas exigem campos que o Word actualiza ao abrir, o que tem de ser avisado na entrega;
- revisões futuras ficam como versões numeradas (`CE001_v0.1.docx`, …) com «Registo de alterações» no próprio documento. As alterações controladas do Word ficam para a revisão pelo museu.

## Registo
- 2026-11-21 · NOVO · Criada a skill canónica `.claude/skills/escrita-sem-sinais-ia/` (SKILL.md + `scripts/verificar_texto.py`), que implementa o §5 deste ficheiro e passa a reger toda a escrita do projecto. Este ficheiro mantém-se como contrato específico do CE001. · responsável + esta sessão
