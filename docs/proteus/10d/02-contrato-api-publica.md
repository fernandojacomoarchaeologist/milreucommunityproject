<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 02 — Contrato da API pública v1

## Transporte e raiz

- transporte: JSON estático publicado com o site;
- raiz: `/api/proteus/v1/`;
- sem servidor, base de dados, autenticação, escrita ou execução;
- exports **gerados**, nunca editados à mão (o validador deteta *drift* por regeneração determinista).

## Recursos autorizados

- `index.json` — índice, raiz canónica, recursos e contagens;
- `works.json`, `authors.json`, `assertions.json`, `entities.json`, `relations.json`.

Nenhum outro recurso é criado no 10D (sem pesquisa conversacional, objetos 3D, datasets, visita
virtual ou MCP).

## Envelope uniforme

Cada resposta declara: `contractVersion` (`1.0`), `apiVersion` (`v1`), `repositoryVersion`,
`status` (`ok`/`empty`), `items`/`resources`, `pagination` determinista, `sources` públicas,
`rights` (`default: deny`), `lastReviewed` (quando houver conteúdo elegível), `warnings`,
`generatedBy` e `notice`. Os schemas estão em `contracts/10d/`.

Uma coleção vazia é **sucesso honesto**, não *fixture*. O envelope **nunca** expõe contagem,
título ou identificador de itens filtrados por direitos ou estado editorial.

## Determinismo

O gerador (`scripts/10d/build-public-api.mjs`) não usa relógio nem aleatoriedade: ordena por `id`
(e `slug`), pagina de forma estável e serializa com indentação fixa. Duas execuções produzem bytes
idênticos; o validador confirma que o ficheiro em disco é exatamente a regeneração.

## Estado inicial

`works: []`, `authors: []`, `assertions: []`, `entities: []`, `relations: []`. O catálogo humano
existente não é apagado nem reduzido; ele e a API têm *gates* de direitos diferentes.

© 2026 Fernando Rodrigues de Jácomo.
