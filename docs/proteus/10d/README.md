<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Pacote 10D — Biblioteca amadurecida e API pública (somente leitura)

O 10D é a etapa **biblioteca/API pública** da Série 10 — Experiência Proteus. Entrega um contrato
público **v1**, uniforme, versionado e **somente de leitura**, materializado como **exports JSON
estáticos e deterministas** em `public/api/proteus/v1/`, com uma rota humana de documentação
(`/conhecimento/api`) e uma política de direitos *fail-closed*.

Não é ingestão/revisão editorial (**10E**), consulta assistida (**10F**), aprendizagem (**10G**)
nem MCP público/editorial (**10H/10I**).

## Estado nesta entrega

- API pública v1 estática, sem servidor, base de dados, autenticação, escrita ou execução;
- as **cinco coleções começam vazias** (`works`, `authors`, `assertions`, `entities`, `relations`),
  porque nenhum registo tem, na base atual, permissão explícita de exposição por API — e as 16
  afirmações permanecem `in_review`;
- a **Biblioteca humana** existente (3 obras, 2 autores, 1 recurso institucional) é preservada e
  passa a ligar-se à documentação da API;
- o *snapshot* de conhecimento servido permanece **0/0/0**;
- **PR funcional** mantém `v0.38.1 / currentPackage 10C.1`; o *bump* global `0.39.0 / 10D` é um
  **pacote de fecho separado**.

## Ordem de leitura

1. `01-escopo-e-fronteira.md`
2. `02-contrato-api-publica.md`
3. `03-direitos-e-elegibilidade.md`
4. `04-experiencia-biblioteca-e-api.md`
5. `05-testes-e-evidencias.md`
6. `06-decisoes-abertas.md`
7. `07-criterios-de-aceitacao.md`
8. `CHANGELOG.md`, `PROMPT-CLAUDE.md`

## Ficheiros

- núcleo puro: `src/proteus/public-api.mjs`;
- gerador: `scripts/10d/build-public-api.mjs` (`npm run proteus:build-api`);
- validador: `scripts/10d/validate-10d.mjs` (`npm run validate:10d`, ligado à cadeia `validate`);
- contratos: `contracts/10d/`;
- exports: `public/api/proteus/v1/`;
- vista: `src/views/proteus-api.js`; rota em `src/lib/router.js`; despacho em `src/main.js`;
- testes: `tests/proteus-public-api-10d.test.mjs`, `tests/proteus-routes-10d.test.mjs`,
  `tests/e2e/portal/proteus-api-10d.spec.mjs`.

© 2026 Fernando Rodrigues de Jácomo.
