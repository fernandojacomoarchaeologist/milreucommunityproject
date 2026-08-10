<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 01 — Escopo e fronteira

## No escopo do 10D

- contrato público **v1** somente de leitura, uniforme e versionado;
- **exports JSON estáticos e deterministas** em `public/api/proteus/v1/`;
- rota humana `/conhecimento/api` com documentação honesta do estado, versão, recursos e direitos;
- filtro de elegibilidade **fail-closed** (ver `03-direitos-e-elegibilidade.md`);
- ligação discreta entre a Biblioteca existente e a documentação da API;
- correção **apenas** de afirmações de disponibilidade que ficaram desatualizadas — quando isso
  for possível sem quebrar validadores fora do âmbito (ver `06-decisoes-abertas.md`).

## Fora do escopo (fronteira com sucessores)

| Pacote | Responsabilidade | Não é 10D |
|---|---|---|
| **10E** | ingestão documental e fluxo de revisão editorial (escrita) | o 10D não ingere nem altera estados |
| **10F** | «Pergunte ao Proteus» (consulta assistida) | o 10D não tem pesquisa conversacional |
| **10G** | aprendizagem (percursos, quizzes) | — |
| **10H** | MCP público (adaptador sobre esta API) | o 10D não cria servidor MCP |
| **10I** | MCP editorial condicionado | — |

## Proibições

Sem API dinâmica, servidor, função edge, base de dados, migration, tabela, login, papel, permissão,
ingestão, fila editorial, OCR, embeddings, RAG, chat, MCP, OAuth ou chamada de LLM. Sem alterar
dados do piloto, estados editoriais, direitos, fontes, localizadores, licenças ou DOI/ORCID. Sem
tocar em qualquer caminho fora do `allowed_paths` do pacote.

## Transporte

Na arquitetura SPA *static-first*, a API pública inicial é um conjunto de exports JSON gerados
deterministicamente a partir dos *snapshots* públicos. O futuro MCP (10H) será um adaptador sobre
esta API; não faz parte do 10D.

© 2026 Fernando Rodrigues de Jácomo.
