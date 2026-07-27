# Auditoria pós-merge da Área Colaborativa — Pacote 08O

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Auditoria por inspeção do código real sobre o `main` (08N mergeado). Fonte estruturada: [`reports/collaborative-audit-08o.json`](../../reports/collaborative-audit-08o.json). Contrato: [`public/data/collaborative-post-merge-audit.json`](../../public/data/collaborative-post-merge-audit.json). Estados permitidos: `passed`, `fixed`, `blocked`, `not-applicable`.

**Resultado: 10/10 `passed`, 0 bloqueados.** Sem novos módulos, permissões ou migrations. Módulos 25, permissões 149 (inalterados). O refino do 08N mantém-se correto; nenhuma correção de regressão foi necessária.

| # | Item | Estado | Evidência (resumo) | Fonte dos dados |
|---|------|--------|--------------------|-----------------|
| 1 | Participação contínua | `passed` | Rota `collab-participation` com guarda `participation.view`; criação recusada em demo (staging real). | `participationWorkspace` via RPC Supabase. |
| 2 | Revisão do Museu (guard + RLS) | `passed` | View exige `museum.review.view`/`museum.review`; migration ativa RLS (16 tabelas), 0 grants `anon`. | RPC autenticada; sem leitura pública. |
| 3 | Suporte | `passed` | `data-support-submit-form` → RPC `collab_support_submit` (`support.submit`); privado, não é chat. | `operationalWorkspace`/RPC. |
| 4 | Menu lateral | `passed` | `<nav aria-label>`, `aria-current="page"`, foco visível, responsivo (nav horizontal com scroll em ≤64rem). | `context.modules` filtrado por permissão. |
| 5 | Formação (1 percurso visível) | `passed` | `VOLUNTEER_VISIBLE_TRAINING_CODES=["project-foundations"]`; 4 percursos no backend, sem vazar para home/recomendações/pendências. A evidência de "5 percursos" é anterior ao 08N. | `context.trainingTrails` (5 reais). |
| 6 | Contributos (upload) | `passed` | 10 MB (cliente + config + constraint CHECK 10485760); URL assinada para bucket privado; `service_role` recusado no browser. | `contributionWorkspace` + Storage privado. |
| 7 | Proposta de atividade | `passed` | Fluxo rascunho→revisão→decisão; decisão reservada ao master/dono (`governance.decide`, `public-integration.activate`); validador emite parecer; sem conversão automática. | `publicIntegrationWorkspace`/`participationWorkspace`. |
| 8 | Home e pendências | `passed` | `homePendingActions` deriva de dados reais (acesso pendente, notificações, perfil); fallback positivo; sem fixtures. | `context.accessRequest`, `notificationWorkspace`, `profile`. |
| 9 | Estados transversais | `passed` | `forbidden()`, empty-states, feedback `aria-live`, gate de login para sessão não autenticada. | Derivado do `context`. |
| 10 | Fontes reais vs fixtures | `passed` | Modo demo explícito; superfícies sensíveis recusam demo; sem fallback silencioso; demonstração marcada e assinalada na UI. | Supabase = RPC canónicas; demo = `collaborative-demo.json` marcado. |

## Notas

- **Menu em mobile:** a navegação principal é acessível por scroll horizontal; a secção de gestão (`.collab-sidebar__admin`) é ocultada em ecrãs estreitos por opção de layout — as rotas de gestão continuam acessíveis por permissão/deep link. Não constitui bloqueio.
- **Sem expansão arquitetural:** não foram criados módulo, menu de pareceres, workflow sequencial, sistema paralelo de suporte nem tabela de pendências materializada.
