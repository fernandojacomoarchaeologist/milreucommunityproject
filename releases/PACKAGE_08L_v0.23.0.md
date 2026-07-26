# Release — Pacote 08L v0.23.0 (Integração pública, participação contínua e evolução)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Cumulativo sobre o 08K v0.22.0. Implementa integração pública por slot, participação contínua e evolução orientada pelo piloto. Nenhum efeito público ativo por omissão; leitura pública apenas de snapshots aprovados; produção bloqueada.

## Entregas
- Novo módulo `continuous-participation`; 2 rotas internas + integração na rota pública existente `/participar` por slots (vazios).
- 13 permissões novas (total **140**); `public-integration.activate`, `public-integration.rollback` e `evolution.decide` exclusivas do master.
- 3 migrations (9 tabelas: publicação/participação/evolução) sob RLS, com **leitura pública (anon) restrita a snapshots ativos e programas públicos**, RPCs auditadas, seed sem propostas/resultados.
- 3 vistas + 3 serviços + fio (router, main, layout, controller com `participationWorkspace`/`publicIntegrationWorkspace`).
- 6 scripts `public-integration:*` + `evolution:report`; `validate:08l`.
- 8 testes JS + teste SQL `008l`; workflows `08l-ci` e `08l-database-tests` (Node 22). Docs em `docs/public-integration/`.

## Segurança e invariantes
- `publicReadsSnapshotsOnly=true`; **0 efeitos públicos ativos por omissão**; slots começam vazios.
- Snapshots sem PII; export/preview público falha ao encontrar campos proibidos (guarda reutilizável).
- Ativação exige proposta revista (editorial/direitos/privacidade/tradução/acessibilidade/técnica), snapshot com checksum e a confirmação literal `ACTIVATE_MILREU_PUBLIC_EFFECT`.
- Participação sem ranking, gamificação nem concessão automática de função; participante vê só o próprio progresso; não pode auto-validar quando a regra exige coordenação.
- `service_role` fora do browser; e-mail/chat off; MM202617 inelegível; Portal e Museu sem regressão; dataset canónico preservado em 0.11.3.

## Estado honesto
```
technicalCandidate: ready
pilotEvidence: blocked
publicIntegrationCandidate: blocked
stagingPreview: blocked
productionApproval: blocked
activePublicEffects: 0
```
