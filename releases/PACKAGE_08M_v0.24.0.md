# Release — Pacote 08M v0.24.0 (Operação pública, governação, monitorização e sustentabilidade)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Cumulativo sobre o 08L v0.23.0. Implementa operação, governação, monitorização por indicadores, transparência pública por snapshot, continuidade e desativação segura — tudo bloqueado/off por omissão.

## Entregas
- Novo módulo `operations-governance`; 2 rotas internas + rota pública opcional `/transparencia`.
- **9 permissões genuinamente novas** (`operations.view/manage` e `continuity.manage` já existiam do 08I) → total **149**; `governance.decide` reservada ao master.
- 3 migrations (9 tabelas) sob RLS, com **leitura pública `anon` restrita a snapshots de indicadores `published`**; RPCs auditadas; seed sem ciclos, responsáveis nem indicadores reais.
- 3 vistas + 6 serviços + fio; 6 scripts `operations:*`; `validate:08m`.
- 8 testes JS + teste SQL `008m`; workflows `08m-ci` e `08m-database-tests` (Node 22). Docs em `docs/operations-governance/`.

## Segurança e invariantes
- 0 ciclos operacionais ativos; transparência pública off; `publishesIndividualData=false`; sem inferência automática de impacto; indicadores exigem definição/fonte/metodologia.
- Suporte próprio privado; moderação restrita (sujeito sem acesso administrativo); responsabilidades e continuidade internas; contactos não públicos.
- `governance.decide` reservada ao master; publicação de transparência exige literal `APPROVE_MILREU_PUBLIC_TRANSPARENCY` + privacidade e qualidade aprovadas; produção bloqueada.
- Desativação segura preserva histórico (modo somente leitura); `service_role` fora do browser; e-mail/chat off; MM202617 inelegível; Portal/Museu sem regressão; dataset canónico em 0.11.3.

## Estado honesto
```
technicalCandidate: ready
operationsCandidate: not-evaluated
activeOperatingCycles: 0
publicTransparency / continuity / productionApproval: blocked
```
