# Release — Pacote 08P v0.27.0 (Fecho funcional transversal da Área Colaborativa)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Pacote de fecho funcional/auditoria transversal, cumulativo sobre 08A–08O. **Sem novos módulos, permissões, workflows ou migrations.** 25 módulos / 149 permissões inalterados; dataset canónico 0.11.3; produção bloqueada; sem piloto ativado.

## Auditoria das 10 áreas (`reports/functional-closure-08p.json`)

**2 `fixed`, 7 `passed`, 1 `blocked` (humano).**

| Área | Estado | Nota |
|------|--------|------|
| Primeiro acesso | **fixed** | Estados distintos: sem membership, pendente, **suspenso**, **removido/arquivado**, **recusado**. |
| Perfil e membership | passed | Função visível mas não editável; suspensão preserva dados. |
| Notificações e deep links | passed | Centro gated; link não concede acesso; entidade removida tratada; e-mail desativado. |
| Disponibilidade | passed | Indicação, não obrigação; sem publicação nem pontuação. |
| Tarefas | passed | Instruções/estado/prazo; transições auditadas por RPC. |
| Agenda | passed | RSVP com privacidade; capacidade transacional. |
| Biblioteca | **fixed** | Cartões passam a mostrar finalidade, fonte rotulada e audiência/estado. |
| Matriz por perfil | passed | `reports/role-access-matrix-08p.json` derivada de permissões reais. |
| Acessibilidade humana | **blocked** | `pending-human-review`; a automação não promove. |
| Fronteira técnica/operação | passed | Produção bloqueada; bloqueadores externos listados. |

## Fixes reais

- **Primeiro acesso** (`src/views/collaborative.js`): `collaborativeOnboardingView` distingue `suspended`/`archived`/`rejected` com um estado de bloqueio (`membershipBlockedView`) que oferece suporte neutro e **não expõe notas internas nem o motivo**; antes, um membro suspenso via o formulário de pedido de acesso.
- **Biblioteca** (`src/views/collaborative-museum-review.js`): os cartões mostram agora resumo (finalidade), `Fonte:` rotulada e pills de estado/audiência — sem inventar autoria (os recursos são documentos próprios do projeto).

## Matriz de acesso por perfil

`scripts/08p/build-role-access-matrix.mjs` gera `reports/role-access-matrix-08p.json` a partir de `collaborative-modules.json` + `collaborative-roles-permissions.json` (**permissões reais**): 13 perfis mapeados para estados/papéis reais; a visibilidade de menu deriva de o papel possuir a permissão do módulo; perfis não-ativos (anónimo, sem membership, pendente, suspenso, removido) veem **0 módulos**. Camadas documentadas: menu, rota, ação, API, RLS, storage, deep-link e mensagem de negação — com a nota de que a UI escondida **não** substitui RLS/route guard.

## Contratos, scripts e testes

- Contratos em `public/data/`: `collaborative-functional-closure.json`, `role-access-matrix.json`, `human-accessibility-gate.json`, `package-08p-readiness.json`.
- Scripts `scripts/08p/`: `build-role-access-matrix`, `audit-first-access`, `validate-deep-links`, `validate-no-runtime-fixtures`, `build-functional-closure-report`.
- Testes: `tests/functional-closure-08p.test.mjs`, `tests/role-access-matrix-08p.test.mjs`; asserções por perfil + `library-source-context` no runner Chromium.
- CI: `.github/workflows/08p-ci.yml` (validate + testes + build + smoke + E2E por perfil).

## Acessibilidade humana (gate independente)

Permanece **pendente de validação humana** (`human-accessibility-gate.json`: `automaticPromotionToPassed:false`). A baseline automática está verde (08J 12/12) e o E2E cobre movimento reduzido, mas as sessões humanas (teclado, leitor de ecrã, zoom 200%, mobile, movimento reduzido) continuam por registar.

## Bloqueadores externos (não resolvidos pelo código)

Supabase staging + produção separada; Google OAuth/callbacks/master real; migrations aplicadas + storage privado; backup/restauração verificados; domínio de staging + observabilidade; responsáveis reais + coorte do piloto (08K); revisão humana de acessibilidade.

## Módulos, permissões e migrations (antes → depois)

- Módulos **25 → 25** · Permissões **149 → 149** · Migrations **sem novas**.

## Validação executada

`npm run validate` (cadeia completa, incl. os 5 validadores 08P + contexto), `npm test` (475 testes), `npm run build`, `npm run smoke`. E2E por perfil (`e2e:08p`) em CI (`ubuntu-latest` com `google-chrome`).

> Este pacote **não** ativa produção nem piloto. A aprovação técnica não substitui a prontidão operacional nem a revisão humana de acessibilidade.
