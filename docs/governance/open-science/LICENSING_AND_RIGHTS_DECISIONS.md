<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Decisões de licenciamento e direitos (por camada)

Este documento **não escolhe** licenças. Separa camadas e mantém cada escolha `PENDING-HUMAN` até confirmação, confrontando a política UAlg (§5.2, §7.1, §7.2) com titularidade, acordos e direitos de terceiros. Não usar uma licença única por conveniência.

| Camada | Âmbito | Decisão | Estado | Nota |
|---|---|---|---|---|
| Software da aplicação | `src/`, `scripts/` | licença de software (ex.: MIT/GPL — §7.2) | `PENDING-HUMAN` (HD-03) | hoje só copyright, sem SPDX |
| Código da skill Guardião | `.claude/skills/guard-development-packages/` | licença de software | `PENDING-HUMAN` (HD-03/HD-07) | interna até decisão |
| Metadados próprios | catálogo, afirmações, entidades, mapeamentos | licença de metadados (ex.: CC-BY — §5.2.b) | `PENDING-HUMAN` (HD-01) | bloqueia exposição pública de novos metadados |
| Documentação / REA | `docs/`, guia de design | licença aberta (§7.1) | `PENDING-HUMAN` (HD-03) | — |
| Fotografias, memórias, conteúdos de terceiros | acervo do Museu | **não** licenciar por inferência | `PENDING-HUMAN` | RIGHTS.md: autorizadas para publicação **sem cessão**; reutilização externa não autorizada |

**Regras:**
- confirmar titularidade e compatibilidade antes de qualquer licença;
- metadados podem ter licença própria distinta do conteúdo (§5.2.b);
- conteúdos de terceiros nunca herdam automaticamente uma licença aberta do projeto;
- ficheiros oficiais (`LICENSE`, `CITATION.cff`, `codemeta.json`) só após decisão humana. Até lá, apenas modelos com sufixo `.template` e marca de rascunho — o gate `baseline` **bloqueia** se um ficheiro oficial existir enquanto HD-03 estiver pendente.
