# Release — Pacote 10C.1 v0.38.1 (Fecho formal de versão do piloto de afirmações verificáveis)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Fecho **formal e mecânico** de versão sobre `main@4b62a3c254000cc2cc5d56e9be4c670b48aca004` (base exata). Não introduz mudança funcional: apenas aplica o rótulo de versão diferido `v0.38.0 → v0.38.1` e `currentPackage 10C → 10C.1`. Predecessor formal: **10C**. A implementação do piloto 10C.1 já foi integrada pelo **PR #52**.

## Gates executados (resultados reais)
- `PROJECT GATE: PASS` — base exata `4b62a3c…`, sidecar SHA-256 verificado, 190/190 blobs do inventário conferidos.
- Open Science Gate: `baseline` **PASS**; `public-git-content` **PASS** (snapshot servido permanece vazio).
- `npm run validate` + `node --test` (**582/582**) + `npm run build` + `npm run smoke` + `python3 -m unittest discover -s tests/governance` — **verdes** a `0.38.1 / 10C.1`.

## Categorias de ficheiros alterados
- **Versão `0.38.0→0.38.1`** na lista fechada: 87 ficheiros de estado atual (package.json, public/data autorados, public/config, contracts, src) + 71 validadores/testes.
- **`currentPackage 10C→10C.1`** em 7 locais + bloco canónico de `docs/governance/PROJECT_IDENTITY.md` (`current_version`/`current_package`).
- **28 gerados** atualizados para a versão (regeneração/rebump), sem alterações espúrias de conteúdo.
- **Ledger** (append) + este registo de fecho.
- **Não tocados:** `.github/workflows/`, `releases/PACKAGE_10C_v0.38.0.md`, `releases/PACKAGE_GOV01_v0.38.0.md`, `releases/PACKAGE_GOV02_v0.38.0.md`, `scripts/10c1/validate-10c1.mjs`, `src/proteus/knowledge-review.mjs`, `data/proteus/knowledge-*.json`.

## Estado preservado
- **16 afirmações `in_review`** (entidades `draft`); nenhuma `published`.
- **Snapshot servido `0/0/0`**.
- 0 migrations, papéis, permissões; sem OCR/embeddings/RAG/API/MCP; sem licença nova, DOI, depósito, tag ou release externa.

## Limitações e pendências
- **HD-03 a HD-07** continuam `PENDING-HUMAN` (bloqueiam release/depósito/partilha externa, não este fecho).
- Sucessor **10D** apenas planeado; **não** iniciado.

## Base
`main@4b62a3c254000cc2cc5d56e9be4c670b48aca004`. Bump global `0.38.0 → 0.38.1` / `currentPackage 10C → 10C.1`.
