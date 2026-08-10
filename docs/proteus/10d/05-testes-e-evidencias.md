<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 05 — Testes e evidências

## Comandos

```bash
npm run proteus:build-api
npm run validate:10d
node --test tests/proteus-public-api-10d.test.mjs tests/proteus-routes-10d.test.mjs
npx playwright test tests/e2e/portal/proteus-api-10d.spec.mjs
npm run validate
node --test
npm run build
npm run smoke
python3 -m unittest discover -s tests/governance -p 'test_*.py'
python3 scripts/governance/open_science_gate.py --profile baseline
python3 scripts/governance/open_science_gate.py --profile public-git-content
```

## Cobertura

- **Núcleo puro** (`tests/proteus-public-api-10d.test.mjs`): elegibilidade *fail-closed*;
  allowlist de campos e descarte de chaves privadas; envelope `ok`/`empty`; **não-revelação** de
  itens excluídos; ordenação/paginação deterministas; os seis exports reais começam vazios; o
  catálogo humano tem obras publicadas mas `works.json` fica vazio; ausência de texto integral/OCR.
- **Rotas e vista** (`tests/proteus-routes-10d.test.mjs`): `/conhecimento/api` resolve; rotas
  Proteus preexistentes não regridem; o render despacha `proteus-api`; os três estados
  (carregamento/erro/disponível) são distintos; a Biblioteca liga à API.
- **E2E** (`tests/e2e/portal/proteus-api-10d.spec.mjs`): a página carrega com estado disponível e
  coleções a zero; tabela com 5 recursos a `0`; sem *overflow* horizontal; navegação a partir da
  Biblioteca.
- **Validador** (`scripts/10d/validate-10d.mjs`): contratos, exports vazios e deterministas,
  *fail-closed*, rota ligada, catálogo humano `3/2/1`, conhecimento `0/0/0`, 16 afirmações
  `in_review`, campo legado classificado, sem migrations/papéis/dependências, predecessores
  preservados.

## Verificações negativas obrigatórias

- zero itens reais nos cinco exports;
- catálogo humano preservado (exceto a ligação de UI autorizada);
- nenhum identificador/título de item excluído nos exports;
- sem URLs privadas, texto integral, notas internas, dados pessoais ou segredos;
- sem endpoint de escrita, backend ou MCP;
- versão/pacote canónicos permanecem `0.38.1 / 10C.1` neste PR.

© 2026 Fernando Rodrigues de Jácomo.
