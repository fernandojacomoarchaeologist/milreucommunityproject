---
name: "escrita-sem-sinais-ia"
description: "Escrever e rever qualquer texto do Projecto Comunitário de Milreu (candidaturas, relatórios, pedidos de orçamento, e-mails, painéis, DOCX, Markdown público) em português de Portugal, sem os sinais típicos de texto gerado por IA e sem afirmações sem fonte. Usar SEMPRE antes de redigir ou entregar texto destinado a terceiros, e antes de gerar um DOCX ou PDF. Inclui o verificador mecânico scripts/verificar_texto.py (grafia, PT-BR, expressões-sinal, resíduos de interface, limites de caracteres)."
version: "0.1.0"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projecto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Skill — Escrita sem sinais de texto gerado por IA

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

**Base:** `docs/governance/escrita/ANEXO_GUIA_SINAIS_DE_TEXTO_GERADO_POR_IA.md` (v1.0, 18-11-2026, 174 sinais numerados, checklist §11, sete passagens §12) e `docs/circuito-educativo/CE001_pedido_suporte/CONTROLO_ESCRITA_CE001.md` (léxico pré-AO90). Esta skill condensa as duas e torna-as obrigatórias para todo o texto que sai do projecto.

**Objectivo.** Texto fiel às fontes, claro e adequado ao leitor. Não é baixar uma pontuação de detector: o guia diz que os sinais não provam autoria. O que se corrige são os defeitos que esses sinais costumam esconder: afirmações sem base, elogio no lugar de facto, frases que não dizem quem faz o quê.

## 1. Regras críticas (corrigir sempre; bloqueiam a entrega)

1. **Nada inventado.** Nenhum facto, número, nome, data, instituição, apoio, resultado, página, DOI ou citação sem origem registada no repositório ou confirmada pelo responsável. Na falta, `[LACUNA: o que falta]` no rascunho; nunca no texto entregue. Regra do `CLAUDE.md` §2.
2. **Nada de trabalho fictício.** Não escrever «observou-se», «avaliámos», «os participantes mostraram» sobre o que não foi feito nem medido (sinais 28, 68, 115). O que é plano escreve-se no futuro ou no condicional, com o mecanismo de avaliação.
3. **Realizado / planeado / hipótese** sempre separados (sinais 80, 84, 146). Exemplo: o Museu de Memórias está realizado; o Circuito está planeado; o efeito nas escolas é hipótese a avaliar.
4. **Fontes que sustentam a frase exacta** (sinais 98–106). Só se cita o que a auditoria bibliográfica do item confirma, com página quando existe. Sem bibliografia ornamental.
5. **Apoios e parceiros** nunca dados como garantidos sem documento: «candidata», «está a avaliar», «a definir com».
6. **Imagens e reconstruções** identificadas: ilustração conceptual, modelo interpretativo assistido por IA, não à escala (sinal 160; regra `digital-intervention-disclosure`).
7. **Sem resíduos de interface** (sinais 127–134): placeholders, Markdown cru num DOCX, marcas `oaicite`/`turn0`/`【`, `utm_source`, instruções de edição, fechos de chatbot.

## 2. Variante e grafia

- **Português de Portugal, grafia pré-AO90** por decisão do responsável (memória «grafia pré-AO90»): projecto, actividade, acção, objectivo, colecção, direcção, arquitectura, colectivo, exacto, efectivo, actual.
- **Excepções:** nomes oficiais e títulos publicados ficam como estão («Património Cultural, I.P.», «Museus e Monumentos de Portugal», campos de um formulário oficial citados literalmente). O logótipo diz «PROJETO» e não se corrige.
- **PT-BR proibido:** equipe/time → equipa; registro → registo; contato → contacto; usuário → utilizador; tela → ecrã; celular → telemóvel; planejamento → planeamento; conosco → connosco; fato → facto; ensino fundamental → 1.º/2.º ciclo do ensino básico.
- **Formatos:** datas no corpo «18 de novembro de 2026»; em tabelas «18-11-2026»; valores «1 234,56 €»; unidades com espaço («50 cm», «1 m²»).

## 3. Estilo: o que evitar e o que pôr no lugar

| Evitar (sinais do guia) | Pôr no lugar |
|---|---|
| Relevância proclamada: «papel fundamental», «crucial», «inovador», «rico património», «é importante salientar» (02, 06, 09, 11) | O facto que a justificaria: n.º de sessões, de participantes, de peças, uma data, um lugar |
| Abstracções e jargão: «sinergias», «ecossistema», «jornada», «dinâmica», «potencial», «holístico» (07, 08) | Quem faz o quê, onde, com que material, para quem |
| Verbos inflacionados e nominalização: «potenciar», «alavancar», «fomentar», «proceder à realização de» (15, 19) | Verbo simples: permitir, aumentar, comprar, montar, avaliar |
| «Não é X, é Y», «não apenas… mas também», «mais do que X» (31–34) | Dizer o que acontece. No máximo um contraste deliberado por documento |
| Tríades automáticas: «compreender, valorizar e transformar» (36) | Listar só as coisas que existem, quantas forem |
| Conectivos por hábito: «além disso», «nesse sentido», «dessa forma», «por conseguinte», «em suma» (01, 03) | Ligar as frases pela ordem lógica; conectivo só quando há relação real |
| Abertura genérica e fecho sentencioso (45, 46, 58, 59) | Abrir pelo que se pede ou pelo problema; fechar com o próximo passo, o prazo ou o limite |
| Intensificadores sem escala: «significativamente», «profundamente» (18) | A medida ou nada |
| Promessas de impacto: «transformará», «garantirá a inclusão» (85, 165) | O efeito esperado + como será verificado |
| Parágrafos e frases todos do mesmo molde (37–39) | Variar conforme a ideia: um parágrafo pode ter uma frase ou seis |
| Negrito em todo o lado, listas com rótulo a negrito, separadores (116, 121, 123) | Negrito só em termos definidos e totais; listas só quando há enumeração real |
| Fórmulas de e-mail: «venho por este meio», «agradeço antecipadamente», «não hesite» (168) | Directo e cortês: quem é, o que pede, até quando, como responder |

**Texto persuasivo (candidaturas, pedidos).** Vender bem é mostrar o que existe e o que muda, com números e nomes verificáveis, e dizer os limites antes que o avaliador os encontre. O elogio próprio não convence um júri; um facto concreto convence. Usar a voz activa e a primeira pessoa do plural quando o candidato fala de si («o Museu acolhe», «a equipa montará»).

## 4. Procedimento (sete passagens do guia §12)

1. **Finalidade:** leitor, género, variante, limite de extensão ou de caracteres.
2. **Afirmações:** marcar cada frase como facto (com fonte), plano, hipótese ou opinião. Cortar o que não tem base.
3. **Fontes:** conferir autor, título, ano, página, DOI. Citação só do que a fonte diz.
4. **Argumento:** ordenar por importância para o leitor; tirar secções de enchimento.
5. **Estilo:** aplicar o §3 desta skill.
6. **Edição:** formato de destino (DOCX, formulário, e-mail), títulos, tabelas, legendas, créditos.
7. **Verificação mecânica + leitura final:** correr o verificador (§5), corrigir à mão (nunca substituição cega), reler em voz alta, conferir números contra as tabelas.

## 5. Verificador mecânico

```bash
python3 .claude/skills/escrita-sem-sinais-ia/scripts/verificar_texto.py <ficheiro.md|.docx|.txt> [--json]
```

Relata por linha (ou parágrafo do DOCX):
- grafia AO90 onde o projecto usa pré-AO90, e formas PT-BR;
- expressões-sinal do §3, com contagem;
- resíduos de interface e de Markdown;
- densidade de travessões e de negrito;
- **limites de caracteres:** num Markdown, uma linha `<!-- limite: 1000 -->` logo abaixo de um título conta os caracteres (com espaços) do texto até ao título seguinte e assinala o excesso. Serve para formulários de candidatura.

O relatório é uma lista para rever, não uma ordem de substituição: algumas ocorrências são legítimas (nomes oficiais, citações, um «além disso» com função). O código de saída é 0 sem ocorrências críticas (resíduos, placeholders, limite excedido) e 2 com ocorrências críticas.

## 6. Checklist mínima antes de entregar

- [ ] Sem `[LACUNA` nem placeholders no texto entregue.
- [ ] Cada número bate com a sua tabela ou fonte; totais conferidos.
- [ ] Cada citação existe na bibliografia e vice-versa; páginas conferidas.
- [ ] Realizado / planeado / hipótese distinguidos.
- [ ] Apoios, parceiros e autorizações com o estado verdadeiro.
- [ ] Verificador sem ocorrências críticas; restantes revistas uma a uma.
- [ ] Limites de caracteres cumpridos (formulários).
- [ ] Linha de copyright do projecto nos ficheiros novos (regra `copyright-and-attribution`), sem reclamar direitos de terceiros.

## 7. Registo

- 2026-11-21 · NOVO · Skill criada a pedido do responsável (passo 0 do pedido de 21-11), a partir do guia de 18-11 e do controlo de escrita do CE001. · responsável + esta sessão
