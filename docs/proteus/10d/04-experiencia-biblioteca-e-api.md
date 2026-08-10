<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 04 — Experiência: Biblioteca e API

## Rota humana `/conhecimento/api`

A vista `src/views/proteus-api.js` consome o `index.json` público e apresenta:

- versão do contrato, versão da API, versão do repositório, raiz e transporte (somente leitura);
- a tabela de **recursos** com o respetivo caminho e contagem;
- a **política de direitos** (`default: deny`);
- uma nota honesta quando as coleções estão vazias.

### Três estados distintos

- **carregamento** — o índice ainda não chegou (`role="status"`, «A carregar…»);
- **erro** — o índice não pôde ser carregado (`role="alert"`, «Documentação indisponível»);
- **disponível** — o índice carregou, ainda que com coleções vazias.

O índice é carregado no arranque (`loadProteusApiIndex()` em `src/main.js`), de forma resiliente:
uma falha devolve `null` e a vista mostra o estado de erro, sem quebrar a aplicação.

## Ligação a partir da Biblioteca

A Biblioteca (`/conhecimento/biblioteca`) ganha uma ligação **discreta** para a documentação da
API. Nenhum registo é retirado, reclassificado ou reescrito; os *gates* de direitos da Biblioteca
e da API permanecem distintos.

## Acessibilidade e responsividade

A vista usa o cabeçalho/rodapé do Portal, título de página, tabela com cabeçalhos de coluna e
estados anunciáveis (`role=status`/`role=alert`). Os testes E2E confirmam ausência de *overflow*
horizontal em *mobile* e *desktop*.

## O que a experiência NÃO faz

Não cria contagens falsas, demonstrações, traduções automáticas nem um *design system* paralelo.
Não altera `proteus-overview.json` de forma que contradiga o validador 10A (ver
`06-decisoes-abertas.md`).

© 2026 Fernando Rodrigues de Jácomo.
