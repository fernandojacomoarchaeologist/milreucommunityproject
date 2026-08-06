# Release — Pacote GOV-02 (Governança — Segurança do intake e Ciência Aberta)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Pacote de **governança** sobre `main@99d6123` (base **exata**). **Não altera `v0.38.0` nem `currentPackage 10C`**; 0 módulos/permissões/migrations; nenhuma superfície funcional. Corrige as fragilidades da revisão independente do GOV-01 e cria a base determinística de Ciência Aberta alinhada com o Despacho RT.82/2025. **Sem merge automático.**

## PROJECT GATE de entrada
`PROJECT GATE: PASS` — identidade exata, base = HEAD `99d6123` (política `exact`), 4 sinais.

## Endurecimento do Guardião (verify_project_package.py)
- **Exit codes distintos:** 0 PASS · 2 BLOCKED · 3 uso · 4 interno.
- **Caminhos:** rejeita traversal, absolutos/UNC/backslash, `..`, symlinks, hardlinks, arquivos aninhados, executáveis, colisões NFKC+casefold.
- **Limites:** entradas, tamanho por ficheiro/total, rácio de compressão, profundidade/nós de JSON, comprimento de caminho.
- **Hash/TOCTOU:** sidecar SHA-256 obrigatório para ZIP; recibo determinístico (pacote/manifesto/HEAD/UTC).
- **Âmbito real:** `allowed_paths` por fronteira de segmento, `control_paths` (lista fechada), `forbidden_scopes`, `base_commit_policy` `exact`.
- **Identidade/Git:** remote por `owner/repo` exato (HTTPS+SSH) sem credenciais; árvore suja bloqueia por predefinição; branch/detached/submodules declarados.
- **Não confiável:** documentos do pacote são dados; nunca instruções; nunca executa conteúdo recebido.
- Exemplos reais substituídos por `project-a`/`project-b` sintéticos.

## Testes e CI
- `tests/governance/test_project_gate.py` — 39 testes adversariais (A–G).
- `tests/governance/test_open_science_gate.py` — 9 testes (H).
- `gov-ci.yml` — corre a suite + `baseline` de Ciência Aberta + confirma que os perfis dependentes bloqueiam.
- Não-regressão: `npm run validate` + **571 testes** + build verdes; `v0.38.0 / 10C` inalterados.

## Base de Ciência Aberta (docs/governance/open-science/)
`RT82_COMPLIANCE_MATRIX.md`, `RESEARCH_OUTPUTS_REGISTER.json`, `DATA_MANAGEMENT_PLAN_DRAFT.md`, `LICENSING_AND_RIGHTS_DECISIONS.md`, `DEPOSIT_AND_PRESERVATION_PLAN_DRAFT.md`, `SHAREABLE_SKILLS_POLICY.md`, `OPEN_SCIENCE_DECISIONS.json`. **Nada** de licença/DOI/ORCID/classificação/acordo por inferência; decisões `PENDING-HUMAN`.

## Gate de Ciência Aberta (scripts/governance/open_science_gate.py)
Perfis `baseline` (passa), `public-git-content`, `release-or-deposit`, `shareable-skill` (bloqueiam pelas decisões pendentes). O `public-git-content` bloqueia exposição de conteúdo `in_review`/restrito em Git público enquanto HD-01/HD-02 pendem — **protege o 10C.1**.

## Decisões humanas pendentes (bloqueiam o 10C.1)
- **HD-01** — licença dos metadados/afirmações/entidades/mapeamentos (§5.2.b).
- **HD-02** — classificação `public`/`restricted`/`controlled` das 16 propostas `in_review` (§6.d).
E, antes de release/depósito/partilha: HD-03 (licenças por camada), HD-04 (autoria/PID), HD-05 (PGD/preservação ≥10 anos), HD-06 (parceiros/financiamento), HD-07 (partilha da skill).

## Sequência
GOV-02 → decisões humanas (HD-01, HD-02) → 10C.1 corrigido → 10D.

## Base
`main@99d6123`. Sem bump de versão.
