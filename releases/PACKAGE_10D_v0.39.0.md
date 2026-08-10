# Release — Pacote 10D v0.39.0 (Fecho formal de versão: Biblioteca amadurecida e API pública)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Fecho **formal e mecânico** de versão sobre `main@6b1559bf406410610a522c685e76997ddabcbba5` (base exata). Não introduz mudança funcional, editorial ou de publicação: aplica o rótulo diferido **`v0.38.1 / 10C.1 → v0.39.0 / 10D`**. Predecessor formal: **10C.1**. A implementação funcional do 10D (biblioteca amadurecida + API pública estática somente de leitura) já foi integrada pelo **PR #54** (merge `6b1559b`).

## Gates executados (resultados reais)
- `PROJECT GATE: PASS` — base exata `6b1559b…`, sidecar SHA-256 verificado, manifesto 7/7, inventário 204 pins de versão + 43 refs de `currentPackage` conferido contra `CLOSURE_INVENTORY.json`.
- `npm run validate` + `node --test` (**610/610**) + `npm run validate:10d` + SEO 09F (**8/8**) + `npm run build` + `npm run smoke` + governança (**50/50**) + Open Science `baseline` **PASS** + `public-git-content` **PASS** — verdes a `0.39.0 / 10D`.

## Decisões de fecho incorporadas (D-10D-CLOSE-01..05)
- **overview:** `public/data/proteus-overview.json` recebe **apenas** o *bump* de versão; estados `em-preparacao`, `availabilityNotice` e invariantes de `scripts/10a/validate-10a.mjs` preservados.
- **pin legado:** `package.json.currentPackage` permanece **`"10B"`**; `scripts/09d/validate-09d.mjs` continua a exigir `"10B"`. A fonte canónica de pacote é o *impact registry* (`10D`).
- **readiness/validador 10D:** `contracts/10d/package-10d-readiness.json` preserva `base` (`9386e98`/`0.38.1`/`10C.1`) e `thisPr*` (`0.38.1`/`10C.1`); `scripts/10d/validate-10d.mjs` passou a correlacionar `deferredClosure{Version,CurrentPackage}` com o estado canónico atual.
- **história:** 25 documentos `doc-current` e 3 releases históricos (`PACKAGE_10C1_v0.38.1`, `PACKAGE_GOV01_v0.38.0`, `PACKAGE_GOV02_v0.38.0`) **byte-idênticos**; ledger apenas *append*.
- **Ciência Aberta/conteúdo:** HD-03..07 pendentes; nenhuma afirmação/entidade muda de estado; nenhum `apiExposure: allow`.

## Categorias de ficheiros alterados (193)
- **Canónicos (3):** `package.json` (version → `0.39.0`, `currentPackage` mantém `10B`), `public/data/package-impact-registry.json` (topo `version 0.39.0` / `currentPackage 10D`, notas históricas preservadas), `docs/governance/PROJECT_IDENTITY.md` (`current_version 0.39.0` / `current_package 10D`).
- **Estado atual (88)** e **validadores/testes (72):** literal de versão `0.38.1 → 0.39.0`; `currentPackage 10C.1 → 10D` em 5 guardas + `tests/pilot-integration-08k.test.mjs`.
- **Gerados (28):** regenerados/rebumpados (API `repositoryVersion 0.39.0`, ainda **5×0**; catálogo/conhecimento/inventários SEO/media/fontes/desempenho). *Drift* de timestamp/medição revertido.
- **Ledger (1, append)** + este **release novo**.
- **Não tocados:** `.github/workflows/`, os 3 releases históricos, os 25 `doc-current`, `scripts/10c1/validate-10c1.mjs` (version-agnostic, referências históricas), `data/proteus/*` (dados editoriais).

## Estado preservado
- Biblioteca humana **3/2/1**; API pública **5 × 0**; conhecimento servido **0/0/0**; **16 afirmações `in_review`**; nenhuma exposição de `draft`/`in_review`.
- 26 módulos, 152 permissões, 42 migrations (0 novas); 93 rotas SEO (`/conhecimento/api` `blocked`/noindex).
- 0 backend/API dinâmica/ingestão/OCR/embeddings/RAG/chat/MCP; sem licença, DOI, depósito, tag ou release externa.

## Limitações e pendências
- **HD-03 a HD-07** continuam `PENDING-HUMAN` (bloqueiam release/depósito/partilha externa, não este fecho).
- Divergências **documentadas, não resolvidas**: reconciliação `proteus-overview.json`↔`validate-10a`; pin legado `package.json.currentPackage="10B"`↔`validate-09d`.
- Sucessor **10E** (ingestão e revisão) apenas planeado; **não** iniciado.

## Base
`main@6b1559bf406410610a522c685e76997ddabcbba5`. Bump global `0.38.1 → 0.39.0` / `currentPackage 10C.1 → 10D` (registo canónico).
