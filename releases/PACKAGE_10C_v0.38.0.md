# Release — Pacote 10C v0.38.0 (Série 10 — Modelo de conhecimento: afirmações, evidências, divergências e CIDOC CRM)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Cria a **gramática do conhecimento** do Proteus, em **static-first**, sobre a Biblioteca 10B/10B.1. Não inventa afirmações, autores, páginas, citações, datas ou entidades reais; não lê documentos; não faz OCR/embeddings/RAG/chat/API/MCP; não cria migrations, papéis ou permissões. A aplicação a fontes reais é o **10C.1**.

## Contratos (contracts/10c/)
`assertion`, `evidence-locator`, `knowledge-entity`, `assertion-relation`, `editorial-review`, `cidoc-mapping`, `package-10c-readiness`.

## Núcleo puro e testável (src/proteus/knowledge-model.mjs)
- 6 classes epistémicas; estados `draft→in_review→approved→published→superseded/withdrawn` (só `published` é público).
- **Sem evidência não supera `insufficient`.** Publicação exige aprovado + evidência válida + revisão humana aprovada (checks + sem conflito de interesse) + direitos compatíveis.
- **Confiança explicável** (níveis + razões), **nunca percentagem/probabilidade de verdade**.
- Relações `supports`/`complements`/`qualifies`/`contradicts`/`supersedes`/`withdraws` com justificação e **deteção de ciclos de substituição**; conflitos permanecem visíveis (sem votação).
- Localizadores por tipo; recurso paginado exige página; recurso dinâmico exige data de acesso; citação exige direitos.

## CIDOC CRM (camada separada)
`src/proteus/cidoc-mapping.mjs` — interoperabilidade **parcial, não certificada**. Crosswalk repo-interno `data/proteus/cidoc-mappings.json` (12 mapeamentos do vocabulário do modelo, todos `draft`) exportado validado para `reports/cidoc-crosswalk-10c.json`. Não é um formulário editorial; mapeamentos ambíguos ficam pendentes.

## Experiência pública (vazia e honesta)
Snapshot `public/data/proteus-knowledge-public.json` **vazio** (0 afirmações/entidades/relações). Vistas `src/views/proteus-knowledge.js` com estados vazio/zero/404 honestos, exibindo classe epistémica, evidência localizada, revisão e divergências. Rotas `/conhecimento/afirmacoes[/:id]` e `/conhecimento/entidades/:slug`, ligadas de `/conhecimento`. Rascunhos/retirados/privados nunca em snapshot/SEO/JSON-LD.

## Testes / validador / CI
`validate:10c`; `tests/proteus-knowledge-10c.test.mjs` (15, incl. testes negativos) + E2E `proteus-knowledge-10c.spec.mjs`; `10c-ci.yml`. **`validate` + 571 testes + build verdes**; render confirmado no browser interno.

## Invariantes
0 novos módulos/permissões/migrations (26/152, 42 migrations). Preserva 09D/09E/09F/10A/10B/10B.1 e o Museu/31 originais/Área Colaborativa.

## Decisões humanas abertas (docs/proteus/10c/09-decisoes-abertas.md)
Conselho editorial e quem propõe/revê/aprova/publica/retira; autoaprovação e conflitos; licença de metadados/afirmações/mapeamentos; vocabulários controlados; perfil/versão CIDOC e extensões; política jurídica de citações; persistência Supabase + RLS.

## Próximo
**10C.1** — piloto de afirmações verificáveis: aplicar o modelo às fontes reais com referências exatas e revisão humana.

## Base
`main@0ceda77`. Bump global 0.37.1 → 0.38.0.
