# Piloto controlado e homologação operacional (08K)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Esta pasta documenta o sistema de piloto controlado da Área Colaborativa, implementado pelo Pacote 08K. O piloto opera exclusivamente em **staging** e transforma a release candidate técnica do 08J numa operação acompanhada, com coorte restrita, cenários, sessões, feedback, evidências privadas, métricas internas e gates de homologação.

## Ordem de leitura
1. `DECISIONS_08K.md`
2. `SYSTEM_DEFINITION_08K.md`
3. `DATA_MODEL_AND_SECURITY_08K.md`
4. `UI_ROUTES_AND_PERMISSIONS_08K.md`
5. `PILOT_WORKFLOW_AND_STATES_08K.md`
6. `STAGING_ACTIVATION_RUNBOOK_08K.md`
7. `HOMOLOGATION_AND_RLS_MATRIX_08K.md`
8. `PILOT_SCENARIO_MATRIX_08K.md`
9. `PILOT_METRICS_AND_EVIDENCE_08K.md`
10. `EXIT_GATES_08K.md`
11. `EXTERNAL_INPUTS_AND_OPEN_DECISIONS_08K.md`

## Princípios
- Staging-only; produção e efeitos públicos desativados.
- Participante vê apenas o próprio contexto; evidências privadas nunca expostas a participantes.
- Nada do piloto altera o conteúdo canónico do Museu nem os slots públicos.
- A homologação de staging exige gates com evidência real e a confirmação literal `APPROVE_MILREU_STAGING_HOMOLOGATION`.
- Coorte, datas, participantes e resultados não são inventados; lacunas são representadas como bloqueadas ou a decidir.
