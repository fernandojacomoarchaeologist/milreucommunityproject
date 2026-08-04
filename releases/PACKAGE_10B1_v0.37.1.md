# Release — Pacote 10B.1 v0.37.1 (Série 10 — Piloto catalográfico controlado)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Primeiro piloto da Biblioteca Proteus com **obras, autores e direitos reais**, sob controlo estrito. Não aloja texto integral, não processa (sem OCR/embeddings/RAG/API/MCP), não infere direitos e não publica registos privados. **Esta entrega não é feita merge** — aguarda decisão editorial.

## Dados editoriais (repo-internos, NÃO servidos)
`data/proteus/pilot-records.json` (6 registos) + `data/proteus/pilot-agents.json` (4 agentes). Todos com `full_text_hosted=false` e `processing_allowed_in_10b1=false`. O `source-manifest` com os nomes de ficheiro fornecidos **não** foi committado.

## Direitos e acesso (independentes, negação por defeito)
- **Hauschild 2008** — único **acesso aberto comprovado** (RUN, `run.unl.pt`), **CC BY** com **URI/versão por confirmar**.
- **Hauschild & Teichner 2002** (registo BNP) e **Teichner 2006** — **restritos**. A cópia externa do 2006 (ResearchGate) é **disponibilidade de licença desconhecida**, nunca "aberto".
- **Manuscrito Jácomo 2026** e **Anexo A** — **privados** (`public_metadata=false`), **fora do snapshot**. Perfil de Jácomo `public_profile=false` — nunca autor público.
- **Bilheteira (Património Cultural, I.P.)** — recurso institucional **dinâmico** com `verified_at` e aviso de atualidade.

## Snapshot público derivado
`scripts/10b1/build-public-catalog.mjs` → `public/data/proteus-catalog-public.json`: **3 obras publicadas** (1 aberta), **2 autores públicos** (sem bio/ORCID inventados), **1 recurso institucional**. Privados e Jácomo excluídos.

## Vista enriquecida (10B)
`accessBlock` distingue **acesso aberto** ("Aceder ao texto integral") de **disponibilidade externa de licença por confirmar** ("Ver página externa" + "a disponibilidade externa não implica direito de reutilização"); mostra a **licença de reutilização** com verificação pendente; lista **recursos institucionais** com aviso de conteúdo dinâmico.

## Validador/teste 10B superados
Deixam de exigir catálogo vazio e de proibir pessoas reais; passam a aceitar o piloto verificando publicados+fontes, **sem registos privados**, **sem Jácomo autor**, **sem texto integral**.

## Contratos / testes / validador / CI
Contratos `contracts/10b1/` (`pilot-record`, `public-entry`). `validate:10b1` (na cadeia `validate`). `tests/proteus-pilot-10b1.test.mjs` (7) + `tests/proteus-catalog-10b.test.mjs` atualizado; E2E `proteus-library-10b.spec.mjs` atualizado. `10b1-ci.yml`. **`validate` + 556 testes + build verdes**; render confirmado no browser interno (3 obras; detalhe aberto vs externo; privado→404).

## Invariantes
0 novos módulos/permissões/migrations (26/152). Sem afirmações históricas nem resumos gerados. Preserva 09D/09E/09F/10A/10B e o Museu/31 originais/Área Colaborativa.

## Decisões humanas pendentes (docs/proteus/10b1/03-decisoes-editoriais.md)
Estado/licença do manuscrito Jácomo; tratamento do Anexo A; autorização de guarda do livro digitalizado; **URI CC BY** exato do 2008; licença do PDF de 2006; se exibir cartão mínimo do manuscrito.

## Próximo
**10C** — modelo de conhecimento (afirmações, fontes localizadas, divergências, mapeamento inicial para CIDOC CRM); a aplicação das afirmações reais fica no 10C.1.

## Base
`main@4d9a16a`. Bump global 0.37.0 → 0.37.1.
