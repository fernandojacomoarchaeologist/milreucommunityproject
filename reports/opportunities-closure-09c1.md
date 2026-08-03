<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Matriz de evidências — Pacote 09C.1 (fecho funcional das oportunidades)

**Versão:** 0.33.0 · **Base:** 09C (#39) e 09D (#40) integrados no `main` (`0688e36`), CI verde.

## Rótulos de evidência (linguagem honesta)

- **local-demo** — implementado e verificado na interface em **modo de demonstração** (localStorage), no browser interno.
- **unit** — provado por teste unitário do módulo puro `src/collab/opportunities-demo.js` (16 testes).
- **backend-sql** — verificado no backend real por teste Postgres/RLS (`supabase/collab-tests/009c1_*`, corre no CI).
- **e2e-demo** — Playwright a atravessar a interface em modo demo (`tests/e2e/portal/opportunities-journey.spec.mjs`, corre no CI).
- **bloqueado-config** — depende de staging + Google OAuth (bloqueador humano desde o 08G); **não** homologado contra backend real através da UI.

> Não se declara "homologado em produção/staging real". A jornada foi comprovada na **interface em demonstração** e as regras/privacidade no **backend por SQL/RLS**. O E2E UI↔backend-real continua **bloqueado-config**.

## Matriz C1–C18

| ID | Critério | Implementação | Evidência |
|---|---|---|---|
| C1 | #39 e #40 integrados na ordem correta | — | histórico git (`faff6a9`→`87ca736`→`0688e36`); **CONFIRMADO** |
| C2 | master cria, pré-visualiza e publica | `opportunities-collab.js` + controller | local-demo (browser: pill "Publicada"); unit |
| C3 | anónimo encontra e lê oportunidade publicada | `mergedPublicOpportunities()` (demo) | local-demo (página pública mostra a oportunidade); e2e-demo |
| C4 | login retorna à oportunidade original | CTA `#/entrar?intent=opportunity:slug`; retorno a `/area-colaborativa/oportunidades` | local-demo (parcial: intenção preservada) |
| C5 | perfil mínimo pede apenas dados ausentes | `minimumProfileForm` + `saveMinimumProfile` | local-demo; consentimento não pré-marcado |
| C6 | candidatura submetida uma única vez | `applyToOpportunity` (`already_applied`) | unit; backend-sql (unicidade); e2e-demo |
| C7 | master aceita e não seleciona | `decideApplication` | unit; local-demo (browser: "Aceite") |
| C8 | candidato consulta resultado e retira | `visibleApplications` + `withdrawApplication` | unit; e2e-demo |
| C9 | encerrar, cancelar, remover, capacidade | módulo puro + UI | unit; backend-sql; local-demo |
| C10 | candidatos não públicos nem visíveis entre si | `visibleApplications`; RLS | unit; **backend-sql** (sem grant/política anon) |
| C11 | menor permanece bloqueado | `minors_policy_pending`; `minors_allowed default false` | unit; **backend-sql** |
| C12 | rotas e textos respeitam o 09D | `validate-09c1`; seletor preservado | validador; e2e-demo |
| C13 | EN/ES/FR não aparentam tradução publicada | 09D preservado; nenhuma tradução criada | validador (registo/estados intactos) |
| C14 | Formação sem dados demonstrativos | controller: enrolments `not-started`/0%, sem notas | validador anti-regressão |
| C15 | zero módulos/permissões/migrations novos | 26 módulos / 152 permissões; 0 migrations | validador + diff |
| C16 | estado vazio continua honesto | snapshot público vazio; nota de demo rotulada | local-demo; teste 09C |
| C17 | mobile, teclado, foco, erros | formulários HTML com `label`, foco nativo | **parcial** (local-demo); a11y exaustiva pendente de revisão humana |
| C18 | nenhuma evidência com dados pessoais | dados sintéticos (`*.invalid`, "demonstração") | **CONFIRMADO** |

## Correção de fecho funcional relevante

A rota `collab-opportunities` existia no router e na vista do 09C, mas **não constava do switch principal de render** em `src/main.js` → a página colaborativa de oportunidades era uma **rota morta** (mostrava "Página não encontrada"). Corrigido (adicionada ao grupo que despacha `renderCollaborativeRoute`).

Verificação subsequente (a pedido do responsável) encontrou o **mesmo defeito** em `collab-participation`, `collab-pilot`, `collab-pilot-management`, `collab-public-integration` e `collab-operations-governance`: existiam no router e na vista (e no switch interno de `renderCollaborativeRoute`) mas **estavam ausentes do switch principal** → rotas mortas. Como o único bloqueio era essa ausência (sem necessidade de recriar páginas, módulos ou permissões), foram **corrigidas no mesmo PR** e cobertas por **testes de render** (`tests/e2e/portal/collab-routes-render.spec.mjs` + verificação anti-regressão em `validate-09c1`). Confirmado no browser (master): renderizam "Participação contínua", "Piloto controlado", "Gestão do piloto", "Integração pública e evolução", "Operação e governação". As **ações** destes módulos continuam a operar apenas em staging real (padrão do 08L/08M); a homologação real permanece **pendência humana** (staging + OAuth).

## Bloqueadores humanos / decisões abertas (reportados, não simulados)

- E2E UI↔**backend real**: requer staging + Google OAuth (bloqueado-config).
- Política de participação de menores; nova candidatura após retirada (mantida bloqueada); lista de espera; comunicações transacionais; produção — **fora de escopo**, sem solução provisória.

## Ambientes

- **local**: validate (58 passos) + 517 testes JS + build + smoke + jornada no browser interno — verde.
- **CI**: Playwright (e2e-demo) + Postgres/RLS (009c1) — nos workflows `09c1-ci.yml`.
- **staging/produção**: **bloqueado** (sem OAuth/Supabase ligados).
