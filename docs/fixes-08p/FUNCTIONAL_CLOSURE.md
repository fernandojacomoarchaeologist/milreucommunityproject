# Fecho funcional transversal da Área Colaborativa — Pacote 08P

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Auditoria por inspeção do código real sobre o `main` (08O mergeado). Fontes estruturadas: [`reports/functional-closure-08p.json`](../../reports/functional-closure-08p.json) e [`reports/role-access-matrix-08p.json`](../../reports/role-access-matrix-08p.json). Contratos em `public/data/`.

**Resultado: 2 `fixed`, 7 `passed`, 1 `blocked` (humano).** Sem novos módulos, permissões ou migrations (25 módulos, 149 permissões).

## Áreas

| # | Área | Estado | Evidência (resumo) |
|---|------|--------|--------------------|
| 1 | Primeiro acesso | `fixed` | Router exige sessão + membership active; onboarding distingue sem-membership/pendente/suspenso/removido/recusado. |
| 2 | Perfil e membership | `passed` | Campos editáveis; função visível não editável; suspensão preserva dados. |
| 3 | Notificações e deep links | `passed` | Centro gated por `notifications.view`; link passa pelo gate + `hasPermission`; entidade removida tratada; e-mail off. |
| 4 | Disponibilidade | `passed` | Indicação, não obrigação; do próprio; sem pontuação. |
| 5 | Tarefas | `passed` | Instruções/estado/prazo; transições auditadas por RPC. |
| 6 | Agenda | `passed` | RSVP com privacidade; capacidade transacional. |
| 7 | Biblioteca | `fixed` | Cartões mostram finalidade, `Fonte:` e audiência/estado. |
| 8 | Matriz por perfil | `passed` | Derivada de permissões reais; não-ativos veem 0 módulos. |
| 9 | Acessibilidade humana | `blocked` | `pending-human-review`; automação não promove. |
| 10 | Fronteira técnica/operação | `passed` | Produção bloqueada; bloqueadores externos listados. |

## Matriz de acesso por perfil (menu, derivada de permissões reais)

| Perfil | Mapeado a | Gate | Módulos no menu |
|--------|-----------|------|-----------------|
| anonymous | — | login | 0 |
| authenticated-without-membership | — | onboarding-request | 0 |
| pending | membership:pending | onboarding-pending | 0 |
| volunteer | role:volunteer | modules | 12 |
| reviewer | role:reviewer | modules | 14 |
| translator | role:translator | modules | 12 |
| researcher | role:researcher | modules | 15 |
| partner | role:partner | modules | 8 |
| coordinator | role:coordinator | modules | 25 |
| project-owner | role:master | modules | 25 |
| optional-validator | role:volunteer (+ parecer por atribuição) | modules | 12 |
| suspended | membership:suspended | blocked-suspended | 0 |
| removed | membership:archived | blocked-archived | 0 |

As camadas rota/ação/API/**RLS**/storage/deep-link/negação são a fonte final — a UI escondida não substitui RLS nem route guard.

## Acessibilidade humana

Gate independente, **pendente**. Sessões por registar: teclado, leitor de ecrã, zoom 200%, mobile, movimento reduzido. A automação (08J 12/12 + reduced-motion no E2E) não promove este gate.

## Bloqueadores exclusivamente externos

Supabase staging + produção separada; Google OAuth/callbacks/master real; migrations aplicadas + storage privado; backup/restauração; domínio de staging + observabilidade; responsáveis reais + coorte do piloto (08K); revisão humana de acessibilidade.
