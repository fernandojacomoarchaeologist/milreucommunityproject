# Release — Pacote 08K v0.22.0 (Piloto controlado e homologação operacional)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Cumulativo sobre o 08J v0.21.0. Implementa o sistema de piloto controlado da Área Colaborativa, restrito a **staging**. Não ativa infraestrutura remota, não aprova staging por teste local e não autoriza produção.

## Entregas
- Novo módulo `pilot` (rotas `/area-colaborativa/piloto` e `/area-colaborativa/gestao/piloto`).
- 10 permissões novas (total **127**); `pilot.approve` exclusivo do master.
- 3 migrations novas (`20260726080000/080100/080200`): 9 tabelas `collab_pilot_*` sob RLS, RPCs auditadas, seed de permissões/módulo (sem ciclos, participantes ou resultados).
- Vista de participação e de gestão; controller com `pilotWorkspace`, `loadRemotePilot` e `pilotAction`.
- 34 modelos de cenário (sem resultados nem participantes).
- Scripts `pilot:validate`, `pilot:readiness`, `pilot:scenario-matrix`, `pilot:gates`, `pilot:evidence-bundle`, `validate:08k`.
- Testes JS (7) e teste SQL `008k_pilot`; workflows `08k-ci` e `08k-database-tests` (Node 22).

## Invariantes e segurança
- Ambiente **staging-only** (check de BD); produção e efeitos públicos permanecem desativados; slots públicos vazios.
- Participante vê apenas o próprio contexto; **evidências privadas nunca são visíveis a participantes**.
- Auto-inscrição proibida; inscrição exige membership ativa.
- Homologação de staging exige gates bloqueadores aprovados, zero observações críticas abertas **e** a confirmação literal `APPROVE_MILREU_STAGING_HOMOLOGATION` — que nunca substitui a evidência.
- `service_role` fora do browser; e-mail e chat desativados; MM202617 continua bloqueada.

## Estado honesto
```
technicalCandidate: ready
pilotReadiness: blocked
stagingHomologation: blocked
productionApproval: blocked
```

A homologação real depende de recursos externos (Supabase staging/produção, Google OAuth, master, execução de migrations, backup/restauração) e de decisões humanas (coorte, datas, notice, revisão de acessibilidade), que este pacote representa como bloqueadas. O 08L não é antecipado.
