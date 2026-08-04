# Release — Pacote GOV-01 (Governança — Adoção do Guardião de Pacotes)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Pacote de **governança**, aplicado sobre `main@51e037b`. **Não altera `v0.38.0` nem `currentPackage 10C`**; não interfere na sequência funcional (10C.1 → 10D). Existe para impedir contaminação entre projetos (Milreu vs Compostela vs outros) antes de qualquer trabalho de pacote.

## Motivação
No intake do 10C.1 detetou-se: (1) ausência de `docs/governance/PROJECT_IDENTITY.md` no repositório; (2) inconsistência no `PACKAGE_IDENTITY.json` do 10C.1 (`repository_slug: "milreu"` vs repositório real `milreucommunityproject`). O gate bloqueou corretamente antes de qualquer alteração. O GOV-01 cria a base autoritativa de identidade para desbloquear com segurança.

## Conteúdo
- **`docs/governance/PROJECT_IDENTITY.md`** — contrato autoritativo com bloco JSON canónico: `project_id: milreu-public-archaeology`, `repository_slug: milreucommunityproject`, remote canónico, doc canónico (`CLAUDE.md`), raiz de código (`src`), rotas próprias e marcadores estrangeiros (Compostela, Godot, GDD).
- **Skill `.claude/skills/guard-development-packages/`** — `SKILL.md` + `scripts/verify_project_package.py` (verificador do gate: igualdade exata de `project_id`/`repository_slug`, base HEAD/ancestral, ≥3 sinais independentes, scan de marcadores estrangeiros; exit ≠ 0 = bloqueio) + `assets/` (templates `PROJECT_IDENTITY`/`PACKAGE_IDENTITY` e exemplos Milreu/Compostela).
- **`CLAUDE.md` secção 13** — o PROJECT GATE passa a ser instrução permanente antes de qualquer intake de pacote; nunca inferir identidade nem criar o contrato por inferência.

## Testes (locais)
- Milreu → Milreu: **`PROJECT GATE: PASS`** (exit 0; 4 sinais: remote, documento-canónico, raiz-de-código, rotas-próprias).
- Compostela → Milreu: **`PROJECT GATE: BLOCKED`** (exit 2; project_id/repository_slug divergem, base inválida, versão incoerente, marcador estrangeiro).
- Contrato ausente: **`PROJECT GATE: BLOCKED`** (exit 2; não cria por inferência).

## Invariantes
`v0.38.0` e `currentPackage 10C` inalterados; 0 módulos/permissões/migrations (26/152, 42 migrations); nenhuma superfície funcional nem efeito público. `validate` + 571 testes + build + validação estrutural verdes.

## Sequência a seguir
1. Merge do GOV-01.
2. **Regenerar o 10C.1** com `repository_slug: milreucommunityproject`.
3. Reprocessar o 10C.1 sob o gate (`PROJECT GATE: PASS`).
4. Só depois do merge do 10C.1 avançar para o **10D**.

## Base
`main@51e037b`. Sem bump de versão.
