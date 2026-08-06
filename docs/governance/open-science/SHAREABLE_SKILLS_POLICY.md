<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Política de skills partilháveis

Requisitos para uma skill do Milreu se tornar partilhável como **software** (§7.2). Enquanto não cumpridos, a skill permanece **interna** ao repositório; o gate `shareable-skill` bloqueia a distribuição (HD-03/HD-07).

## 1. Separação obrigatória
- **Núcleo genérico** (reutilizável): instruções, verificador, modelos.
- **Configuração por projeto**: valores canónicos (`docs/governance/PROJECT_IDENTITY.md`) — **não** distribuir.
- **Exemplos**: apenas **sintéticos** (`project-a`, `project-b`); nunca nomear projetos reais do operador.

## 2. Requisitos antes de distribuir
- **Segurança confirmada**: testes adversariais verdes (path/limites/hash/scope) e revisão fechada (`security_hardening_confirmed: true` em `OPEN_SCIENCE_DECISIONS.json`).
- **Autoria e versão** declaradas; **licença** de software escolhida (HD-03); **proveniência** e `CITATION.cff`/`codemeta.json` oficiais (só após decisão humana).
- **Testes** incluídos e determinísticos; **sem rede**.

## 3. Materiais proibidos na distribuição
- `.git`, segredos, tokens, caminhos pessoais; dados de investigação, imagens do acervo, PDFs; configuração específica do Milreu; qualquer nome de projeto real do operador.

## 4. Candidatas identificadas (não criadas)
`guard-development-packages`, `package-intake`, `context-ledger/recover-project-context`, `scope-check`, `public-snapshot-guard`, `open-science-release-gate`. Cada uma exige decisão de autoria/licença antes de partilhar.
