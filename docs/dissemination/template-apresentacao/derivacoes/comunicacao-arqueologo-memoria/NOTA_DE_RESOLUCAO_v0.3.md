<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Nota de resolução — v0.3 («O processo de construção do Museu de Memórias de Milreu», III ENEP)

> **Data:** 2026-10-20 · **Base:** `NOTA_DE_CORRECAO_v0.2.md` + parecer de revisão do responsável (2026-10-20).
> **Regra seguida:** só se implementou o que ficou **pacificado**, isto é, apoiado por um documento que foi conferido. O que depende de decisão ou de evidência ainda não vista fica marcado como pendente.
> **Resultado:** `APRESENTACAO_Arqueologo_Manutencao_Memoria_v0.3.pptx`. A v0.1 e a v0.2 mantêm-se para comparação.

## Pontos da nota v0.2

| # | Ponto | Decisão | Evidência conferida | Implementado na v0.3 |
|---|---|---|---|---|
| 1 | Campanhas alemãs / Hauschild | **Revisto parcialmente:** 1971 corrigido; Hauschild mantido | Hauschild & Teichner 2002, p. 13 (1971; responsabilidade do IAA, da FA-UTL e do Museu Monográfico de Conímbriga). Teichner 1997, p. 107 (direcção de Hauschild), segundo o mapa de fontes do dossiê bibliográfico (`06_MAPA_DE_FONTES_E_EVIDENCIAS.md`) | Slide 2: «DESDE 1971 · Instituto Arqueológico Alemão · direcção de Theodor Hauschild»; talking point reescrito com as três instituições e as duas citações; Teichner 1997 no rodapé e na bibliografia |
| 2 | Autoria das *Normas de Inventário — Arqueologia* | **Manter os três autores** | Catálogo da biblioteca do Património Cultural e ficha técnica da obra, segundo o parecer do responsável. Esta sessão não conseguiu aceder ao catálogo (HTTP 403) | Sem alteração; pendência retirada das notas |
| 3 | 19 membros; 6–7 participantes | **Validado** | Anexo D, p. 2: o grupo tinha 19 membros até Junho de 2026; cada etapa teve uma participação média de 6 a 7 pessoas | Slide 4: rótulos precisados («até Junho de 2026»; «em média, por etapa de consulta»); rodapé «Anexo D, p. 2»; sem número de consultas inventado |
| 4 | Páginas das referências | **Resolvido pelo dossiê** | `06_MAPA_DE_FONTES_E_EVIDENCIAS.md` regista as páginas utilizadas de cada obra | Sem alteração. Ver as observações abaixo |
| 5 | Teichner 2001, pp. 189–194 | **Manter** | O mapa de fontes do dossiê regista pp. 189–194 | Sem alteração; passa a sustentar a frase sobre Estácio da Veiga |
| 6 | Teichner 2001 [2003] | **Sem alteração** | — | Mantém-se 2001 |
| 7 | Handle da dissertação | **Aceite** | Sapientia: http://hdl.handle.net/10400.1/27405 | Acrescentado à referência |

## Pontos novos do parecer

| Ponto | Decisão | Evidência | Implementado na v0.3 |
|---|---|---|---|
| A. Slide 6: data «ca. 1981» atribuída à MM202613 | **Corrigido no slide** | Anexo C, ficha MM202613: datação «ca. 1970s», grau *possible*. O testemunho de Cristina Farias sobre 1981 está na ficha **MM202614** | O slide deixa de mostrar 1981 para a MM202613 e mostra «Datação: ca. década de 1970 · POSSÍVEL» |
| B. Graus de certeza | **Adoptado o vocabulário da ficha**, só nesta apresentação | Anexo C: grau de certeza *certain / probable / possible* e um campo separado *Interpretative hypotheses* | Slide 6: CERTO (suporte, 12,5 × 17,5 cm) · PROVÁVEL (proveniência) · POSSÍVEL (datação), com exemplos reais da ficha; hipóteses interpretativas indicadas como campo separado; etiquetas neutras, sem as cores de certeza do design system |
| C. Autorização da MM202614 (capa) | **Verificado no registo canónico** | `public/data/memories.json`, MM202614: `rights.status = authorized-for-project-publication`, `confirmation = project-owner-confirmed-2026-07-23`, posterior ao Anexo C preliminar, que dizia «não reproduzir até confirmação» | Imagem mantida. Falta só confirmar que o documento de autorização está arquivado (ver pendentes) |
| D. Capa: título oficial | **Corrigido** | `Programa_ENEP_2026.pdf`: III Encontro Nacional de Estudantes de Património; 5 de Novembro de 2026, 15h45, Painel 2 — Comunidades locais na gestão do património rural | Título oficial completo; subtítulo «O arqueólogo e a manutenção da memória»; meta «Fernando Rodrigues de Jácomo · III ENEP · Faro · 5-11-2026» |
| E. Anexos C e D na bibliografia | **Corrigido** | — | Bloco separado da lista: «Dados primários da investigação — documentação interna em desenvolvimento» |
| F. Encurtar a introdução | **Mantido como opção** | — | A versão curta continua nas notas do slide 1; talking points não reescritos; total cronometrado ~9 min 30 s |

## Observações do mapa de páginas (ponto 4) — para o autor, não aplicadas

Nos talking points, três intervalos são mais largos do que as páginas que o dossiê regista como utilizadas:

| Talking points | Dossiê | Onde aparece |
|---|---|---|
| Tully 2007, pp. 155–160 | pp. 155, 158–160 e 170 | Slides 1 e 5 |
| Moser & alii 2002, pp. 229–233 | pp. 229 e 231–233 | Slides 3, 5, 6 e 7 |
| Jácomo 2024, pp. 71–95 | pp. 71–72, 76–79, 81–88 e 94–95 | Slide 3 |

Se os intervalos largos foram intencionais (leitura contínua), mantêm-se. Se não, ajustar ao mapa. No slide nada muda, porque o rodapé usa só autor e ano.

## Pendentes (não pacificados)

1. **Divergência no registo do Museu.** No índice público, a MM202613 tem a data «ca. 1981, segundo hipótese de Cristina Farias». Mas o próprio texto desse registo fala em «anos 1970 e início dos anos 1980», e o Anexo C associa o testemunho de 1981 à MM202614. É preciso rever o registo do Museu, com nova revisão editorial; não se altera por esta apresentação (regras `museum-revisions` e `museum-data-integrity`).
2. **Arquivo da autorização da MM202614.** O registo canónico indica autorização confirmada pelo responsável a 2026-07-23. Falta confirmar que o documento ou e-mail de autorização está arquivado e qual é o seu âmbito de divulgação pública.
3. **Co-autoria de Virgílio Correia.** Aceite com base no parecer do responsável. Se possível, guardar no dossiê o registo do catálogo do Património Cultural, para rastreabilidade.
