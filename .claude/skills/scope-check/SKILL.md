---
name: "scope-check"
description: "Verificar se uma tarefa pertence ao projeto, a qual iniciativa e a qual produto, evitando extrapolação."
version: "0.1.0"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Skill — Scope check

## Procedimento

1. Ler:
   - `docs/project/PROJECT.md`;
   - `docs/project/PROJECT_IS_IS_NOT.md`;
   - `docs/initiatives/INITIATIVE_REGISTRY.md`.
2. Identificar:
   - iniciativa principal;
   - iniciativas relacionadas;
   - produto de destino;
   - pacote previsto no roadmap.
3. Verificar se a tarefa:
   - está dentro do âmbito;
   - necessita de nova iniciativa;
   - necessita de nova spec;
   - depende de decisão pendente;
   - tenta antecipar um pacote futuro.
4. Produzir uma resposta curta com:
   - classificação;
   - documentos aplicáveis;
   - bloqueios;
   - próxima ação permitida.

## Resultado possível

- `IN_SCOPE_READY`
- `IN_SCOPE_NEEDS_SPEC`
- `IN_SCOPE_BLOCKED_BY_DECISION`
- `FUTURE_PACKAGE`
- `OUT_OF_SCOPE`
- `AMBIGUOUS_ASK_OWNER`
