# Release — Pacote 10A v0.36.0 (Série 10 — Experiência Proteus: política, direitos, confiança e contrato futuro do MCP)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Inaugura a **Série 10 — Experiência Proteus** como **fundação documental** sobre o 09F. Proteus é a infraestrutura pública de conhecimento sobre Milreu — a base vem **antes** do chat/API/MCP. Este pacote define políticas e contratos; **não** implementa biblioteca, ingestão, PDFs, embeddings, chat, API ou MCP, e **não** cria módulos/permissões/migrations.

## Contratos (contracts/10a/)
- **rights-access-policy** — 14 dimensões independentes, **negação por defeito**, `unknown`=`denied`, regra anti-substituição.
- **knowledge-assertion** — 6 classes: facto documentado, interpretação, hipótese, memória/testemunho, inferência do Proteus, desconhecido.
- **public-answer** — estados answered/limited/insufficient_evidence/rights_restricted/out_of_scope; recusa honesta.
- **external-resource** — fornecedor + direitos separados (Património Cultural 360).
- **future-mcp-contract** — **future-not-implemented**, público, só leitura, adaptador sobre futura API; sem acesso direto a BD/PDFs.

## Apresentação pública honesta
Rota preexistente `/conhecimento`: propósito, públicos, 6 experiências futuras **em preparação**, classes de conhecimento, direitos (default deny), recursos institucionais do Património Cultural 360 apenas **contextualizados** (URL/direitos/embed = decisão humana), MCP futuro. **Nada disponível** (sem consulta/API/chat).

## Regra de direitos
Posse/acesso lícito nunca implica armazenar, processar, indexar, sintetizar, citar, redistribuir, treinar ou expor a agentes. Obra restrita pode ser catalogada, nunca substituída. Sem parecer jurídico — dúvidas são bloqueadores humanos.

## Testes / validador / CI
`validate:10a` (contratos, honestidade, scans sem PDF/fulltext/embeddings/segredos, sem MCP/API/chat, 26/152, 0 migrations, preservação); `tests/proteus-10a.test.mjs` (8); `10a-ci.yml`.

## Continuidade
10B→10C→10D→10E→10F→10G→10H→10I (MCP editorial por último, condicionado). Decisões humanas registadas em `OPEN_DECISIONS_10A`.

## Base
Empilhado sobre o branch do 09F (base = merge real do 09F). Bump 0.35.0 → 0.36.0.
