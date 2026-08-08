<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Pacote 10C.1 — Piloto de afirmações verificáveis

Aplica o modelo 10C a um corpus pequeno e controlado: **16 propostas editoriais** (15 paráfrases localizadas no artigo de Hauschild 2008 + 1 observação institucional datada sobre a bilheteira do Património Cultural, I.P.), **10 entidades** e **16 localizadores**. Admitido sobre `main@1e6016e` após `PROJECT GATE: PASS` (base exata, sidecar) e `public-git-content: PASS`.

## Estatuto (HD-01 / HD-02)
- **Público em Git** sob **CC BY 4.0** — apenas a **camada original** (afirmações, entidades, mapeamentos e metadados próprios). A licença **não** se estende a artigos, imagens, documentos ou outros materiais de **terceiros**.
- Todos os registos permanecem **`in_review`** (entidades `draft`). Público em Git **não** é `published`, validação científica nem autorização para o snapshot servido.

## Onde vivem os dados
- Dados editoriais repo-internos: `data/proteus/knowledge-assertions.json` (16 + 10 entidades), `knowledge-evidence-locators.json` (16), `knowledge-review-queue.json`, `knowledge-source-scope.json`.
- Snapshot **servido** `public/data/proteus-knowledge-public.json` **permanece VAZIO** (o derivador só publica `published`).
- Modelo editorial **puro**: `src/proteus/knowledge-review.mjs` (filtros por classe/fonte/estado/prioridade; transições que **exigem revisor humano** e **nunca publicam**; índice editorial **não servido**).

## Regras honradas
- Zero publicação automática; `reviewerId`/`reviewedBy`/`approvedBy`/`publishedAt` nunca preenchidos por pessoa ausente.
- Dupla paginação preservada no `label` dos 15 localizadores do artigo (`PDF n / artigo p. n`).
- Recurso institucional com URL, data de consulta e aviso de volatilidade (reverificar antes de exibir como atual).
- Sem citações textuais, sem ficheiros-fonte, sem OCR/embeddings/RAG/API/MCP, sem migrations/papéis/permissões, sem fontes excluídas (`Milreu: ruínas`, Teichner 2006, manuscrito, Anexo A).
- Classes epistémicas, confiança (níveis + razões, nunca percentagem) e limitações preservadas; hipóteses/incerteza não convertidas em facto.

## Limitações declaradas
- **UI e persistência servidas** da revisão editorial (fila humana com ações de devolver/pedir alteração/aprovar/rejeitar) dependem da futura fundação Supabase com RLS — não comprovável em CI estático. Nesta fase entrega-se um **adaptador puro demonstrável** + testes.
- **Bump de versão diferido:** este PR mantém `v0.38.0 / currentPackage 10C` (admite os dados dentro dos `allowed_paths`). O bump para `v0.38.1 / currentPackage 10C.1` exige uma cascata global (≈186 ficheiros, ≥61 fora dos `allowed_paths`) e será feito num **PR de fecho** de âmbito alargado, por decisão do responsável.

## Decisões humanas ainda pendentes
HD-03 a HD-07 (licenças por camada, autoria/PID, PGD/preservação, parceiros/financiamento, partilha da skill) permanecem `PENDING-HUMAN` e **bloqueiam release/depósito/partilha externa**, não a admissão deste piloto.
