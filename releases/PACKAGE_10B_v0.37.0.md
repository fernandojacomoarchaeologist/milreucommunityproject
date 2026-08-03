# Release — Pacote 10B v0.37.0 (Série 10 — Catálogo bibliográfico, autores, direitos e páginas públicas iniciais)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Primeira **Biblioteca Proteus** funcional (páginas públicas iniciais), sobre o 10A, em **static-first**. Não inventa obras/autores; um catálogo vazio é resultado válido. Não inclui PDFs/OCR/texto integral/resumos automáticos/claims/embeddings/RAG/chat/API/MCP; não cria papéis/permissões.

## Contratos (contracts/10b/)
`work`, `author`, `work-author`, `rights-record`, `doi-import-draft`, `public-catalog-entry` — estados editorial e de acesso, direitos multidimensionais, negação por defeito.

## Biblioteca pública
Rotas `/conhecimento/biblioteca`, `/conhecimento/biblioteca/:slug`, `/conhecimento/autores/:slug`. Pesquisa (título/autor/ano/DOI/publicação) + filtros (tipo/acesso/idioma). Só mostra `published`. Estados vazio/zero-resultados/404 honestos. Não mostra texto integral, notas internas nem URLs privadas. Snapshot público começa **vazio**.

## Importação DOI (adaptador puro, sem rede embutida)
`normalizeDoi`, `normalizeOrcid` (checksum), `mapCrossrefToDraft` → **ImportDraft** com `publicationApproved:false` e `rights_not_evaluated`; `detectDuplicateCandidates` conservador (nunca funde). Testes com mocks; CI não depende da rede DOI.

## SEO
Apenas entidades `published` teriam canonical/JSON-LD/sitemap; com catálogo vazio, nada é emitido; rotas noindex (09F preview).

## Testes / validador / CI
`validate:10b`; `tests/proteus-catalog-10b.test.mjs` (9) + E2E `proteus-library-10b.spec.mjs`; `10b-ci.yml`. `validate` (67 passos) + 549 testes + build verdes.

## Pendência condicional (backend/RLS)
A persistência real + RLS não foi implementada: a app é static-first (Supabase não ligado) e uma migration quebraria os validadores anteriores. Mantidos adapter + contratos; bloqueio relatado — a implementar quando a fundação Supabase do Proteus for autorizada (com testes RLS no CI).

## Invariantes
0 novos módulos/permissões/migrations (26/152). Preserva 09D/09E/09F/10A e o Museu/31 originais/Área Colaborativa.

## Base
`main@0430da5`. Bump 0.36.0 → 0.37.0.
