---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08K"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Modelo de dados e segurança

## Migrations propostas

```text
20260726080000_collaborative_pilot_foundation.sql
20260726080100_collaborative_pilot_rpc.sql
20260726080200_collaborative_pilot_seed.sql
```

Os timestamps podem ser ajustados para evitar colisão no repositório. Não reescrever migrations já aplicadas.

## Tabelas

### `collab_pilot_cycles`

- `id uuid primary key`
- `project_id uuid not null`
- `environment_id uuid not null`
- `homologation_run_id uuid null`
- `code text not null`
- `title text not null`
- `objective text not null`
- `scope text null`
- `baseline_release text not null`
- `status text not null`
- `phase text not null`
- `starts_at timestamptz null`
- `ends_at timestamptz null`
- `owner_user_id uuid not null`
- `approved_by uuid null`
- `approved_at timestamptz null`
- `closure_summary text null`
- `created_by uuid not null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

Restrições:

- ambiente deve ser `staging`;
- código único por projeto;
- produção proibida;
- aprovação só após gates bloqueadores.

### `collab_pilot_participants`

- `id uuid primary key`
- `cycle_id uuid not null`
- `user_id uuid not null`
- `participant_role text not null`
- `target_profile_type text not null`
- `status text not null`
- `onboarding_status text not null`
- `privacy_notice_version text null`
- `privacy_accepted_at timestamptz null`
- `support_needs text null`
- `invited_by uuid not null`
- `invited_at timestamptz not null`
- `confirmed_at timestamptz null`
- `withdrawn_at timestamptz null`
- `completed_at timestamptz null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

Restrições:

- membro precisa estar ativo;
- unicidade `cycle_id + user_id`;
- inscrição não pode ser criada pelo próprio participante;
- retirada deve ser preservada e auditada.

### `collab_pilot_scenarios`

- `id uuid primary key`
- `cycle_id uuid not null`
- `code text not null`
- `title text not null`
- `description text not null`
- `module_code text not null`
- `route text null`
- `target_profile_type text null`
- `preconditions jsonb not null`
- `instructions jsonb not null`
- `expected_outcome text not null`
- `evidence_requirements jsonb not null`
- `risk_level text not null`
- `required boolean not null`
- `sort_order integer not null`
- `active boolean not null`
- `created_by uuid not null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

Unicidade `cycle_id + code`.

### `collab_pilot_sessions`

- `id uuid primary key`
- `cycle_id uuid not null`
- `scenario_id uuid not null`
- `facilitator_user_id uuid null`
- `status text not null`
- `scheduled_start timestamptz null`
- `scheduled_end timestamptz null`
- `actual_start timestamptz null`
- `actual_end timestamptz null`
- `environment_id uuid not null`
- `summary text null`
- `blocker_reason text null`
- `created_by uuid not null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `collab_pilot_session_participants`

- `session_id uuid not null`
- `participant_id uuid not null`
- `attendance_status text not null`
- `completion_status text not null`
- `support_level text not null`
- `participant_notes text null`
- `facilitator_notes text null`
- `started_at timestamptz null`
- `completed_at timestamptz null`
- primary key composto `session_id + participant_id`

### `collab_pilot_observations`

- `id uuid primary key`
- `cycle_id uuid not null`
- `session_id uuid null`
- `participant_id uuid null`
- `reported_by uuid not null`
- `observation_type text not null`
- `severity text not null`
- `status text not null`
- `module_code text null`
- `route text null`
- `summary text not null`
- `description text not null`
- `reproduction_steps text null`
- `expected_result text null`
- `actual_result text null`
- `assigned_to uuid null`
- `linked_task_id uuid null`
- `linked_incident_id uuid null`
- `resolution_summary text null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`
- `resolved_at timestamptz null`

### `collab_pilot_evidence`

- `id uuid primary key`
- `cycle_id uuid not null`
- `session_id uuid null`
- `observation_id uuid null`
- `evidence_type text not null`
- `storage_path text null`
- `external_reference text null`
- `checksum text null`
- `sensitivity text not null`
- `redaction_status text not null`
- `description text not null`
- `captured_by uuid not null`
- `captured_at timestamptz not null`
- `retention_until timestamptz null`
- `metadata jsonb not null`
- `created_at timestamptz not null`

A tabela guarda referência, não conteúdo binário.

### `collab_pilot_metric_snapshots`

- `id uuid primary key`
- `cycle_id uuid not null`
- `metric_code text not null`
- `value_numeric numeric null`
- `numerator numeric null`
- `denominator numeric null`
- `unit text not null`
- `scope jsonb not null`
- `source text not null`
- `period_start timestamptz null`
- `period_end timestamptz null`
- `generated_by uuid null`
- `generated_at timestamptz not null`

### `collab_pilot_gate_results`

- `id uuid primary key`
- `cycle_id uuid not null`
- `gate_code text not null`
- `status text not null`
- `blocking boolean not null`
- `evidence_summary text null`
- `evidence_ids uuid[] not null`
- `decided_by uuid null`
- `decided_at timestamptz null`
- `waiver_reason text null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

Unicidade `cycle_id + gate_code`.

## Estados canónicos

- ciclo: `draft`, `preparing`, `ready`, `running`, `paused`, `evaluating`, `completed`, `blocked`, `cancelled`;
- fase: `preparation`, `staging-activation`, `internal-smoke`, `role-based-pilot`, `assisted-community-pilot`, `evaluation`, `closure`;
- participante: `invited`, `confirmed`, `active`, `withdrawn`, `completed`, `removed`;
- onboarding: `pending`, `in-progress`, `completed`, `blocked`, `not-applicable`;
- sessão: `scheduled`, `in-progress`, `completed`, `blocked`, `cancelled`;
- conclusão: `pending`, `passed`, `failed`, `blocked`, `not-applicable`;
- apoio: `independent`, `assisted`, `facilitated`;
- observação: `new`, `triaged`, `accepted`, `planned`, `resolved`, `rejected`, `duplicate`;
- severidade: `info`, `low`, `medium`, `high`, `critical`;
- gate: `pending`, `passed`, `failed`, `blocked`, `waived`, `not-applicable`;
- sensibilidade: `internal`, `restricted`, `personal`;
- redação: `not-required`, `pending`, `redacted`, `rejected`.

## RLS

### Participante

Pode:

- ver o ciclo em que está inscrito;
- ver cenários atribuídos ou ativos para o seu perfil;
- ver as próprias sessões;
- atualizar notas próprias permitidas;
- submeter feedback;
- ver o próprio feedback.

Não pode:

- listar a coorte;
- ver dados ou feedback de outra pessoa;
- ver evidências privadas;
- alterar gates;
- alterar cenários;
- aprovar o ciclo.

### Facilitador

Pode ver apenas sessões em que está atribuído e os participantes dessas sessões.

### Coordenação

Pode gerir ciclo, coorte, cenários, sessões, observações, métricas e evidências conforme permissões.

### Master

Tem poderes de aprovação, preservando a proteção do último master e auditoria.

## Storage

Bucket privado recomendado: `collab-pilot-evidence`.

Regras:

- sem leitura pública;
- sem URL persistente;
- URL assinada com duração curta;
- limite de tipo e tamanho configurável;
- checksum;
- metadados sem segredos;
- ficheiros com dados pessoais marcados como `personal`;
- eliminação apenas por workflow protegido e retenção aprovada.

## RPCs mínimas

- criar/atualizar ciclo;
- transicionar ciclo com validação;
- inscrever/remover participante;
- confirmar participação;
- criar/atualizar cenário;
- agendar/concluir sessão;
- submeter/triagem de observação;
- registar evidência;
- gerar snapshot de métricas;
- avaliar gates;
- aprovar homologação de staging;
- exportar bundle redigido de evidências.

Todas as mutações devem produzir auditoria.
