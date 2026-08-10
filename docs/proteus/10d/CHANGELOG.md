<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# CHANGELOG — 10D

## 10D (PR funcional) — base `main@9386e98`

Mantém `v0.38.1 / currentPackage 10C.1` (o *bump* `0.39.0 / 10D` é um pacote de fecho separado).

### Adicionado

- núcleo puro da API pública `src/proteus/public-api.mjs` (elegibilidade *fail-closed*, allowlist,
  ordenação/paginação deterministas, envelopes uniformes);
- gerador estático `scripts/10d/build-public-api.mjs` (`npm run proteus:build-api`);
- validador `scripts/10d/validate-10d.mjs` (`npm run validate:10d`), ligado à cadeia `validate`;
- contratos `contracts/10d/` (índice, coleção, envelope, readiness);
- exports `public/api/proteus/v1/` (`index`, `works`, `authors`, `assertions`, `entities`,
  `relations`) — todos **vazios**;
- rota `/conhecimento/api` (router + render) e vista `src/views/proteus-api.js`;
- ligação discreta a partir da Biblioteca (`src/views/proteus-library.js`);
- testes `tests/proteus-public-api-10d.test.mjs`, `tests/proteus-routes-10d.test.mjs`,
  `tests/e2e/portal/proteus-api-10d.spec.mjs`;
- documentação `docs/proteus/10d/`.

### Não alterado (deliberadamente)

- `public/data/proteus-overview.json` (ver decisão D-10D-01);
- `package.json.currentPackage` legado (ver decisão D-10D-02);
- dados do piloto, estados editoriais, direitos, fontes e localizadores;
- `.github/workflows/`, `releases/`, `PROJECT_CONTEXT_LEDGER.md`,
  `public/data/package-impact-registry.json`, `docs/governance/PROJECT_IDENTITY.md`.

© 2026 Fernando Rodrigues de Jácomo.
