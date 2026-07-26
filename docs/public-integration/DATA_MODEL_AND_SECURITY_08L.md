---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08L"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Modelo de dados e segurança

## Migrations propostas

```text
20260726090000_public_integration_and_participation.sql
20260726090100_public_integration_rpc_and_rls.sql
20260726090200_public_integration_seed.sql
```

Ajustar timestamps para evitar colisão. Não reescrever migrations anteriores.

## Tabelas propostas

### `collab_publication_proposals`

Campos principais:

- `id uuid primary key`
- `project_id uuid not null`
- `code text not null`
- `title text not null`
- `purpose text not null`
- `target_surface text not null`
- `target_slot text null`
- `source_type text not null`
- `source_id uuid null`
- `source_reference text null`
- `payload_draft jsonb not null`
- `status text not null`
- `language_status jsonb not null`
- `editorial_status text not null`
- `rights_status text not null`
- `privacy_status text not null`
- `accessibility_status text not null`
- `valid_from timestamptz null`
- `valid_until timestamptz null`
- `owner_user_id uuid not null`
- `created_by uuid not null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `collab_publication_snapshots`

- `id uuid primary key`
- `proposal_id uuid not null`
- `version integer not null`
- `schema_version text not null`
- `payload jsonb not null`
- `checksum text not null`
- `references jsonb not null`
- `languages jsonb not null`
- `status text not null`
- `generated_by uuid not null`
- `generated_at timestamptz not null`
- `approved_by uuid null`
- `approved_at timestamptz null`
- `activated_at timestamptz null`
- `deactivated_at timestamptz null`
- `deactivation_reason text null`

Unicidade `proposal_id + version` e `checksum`.

### `collab_publication_activations`

- `id uuid primary key`
- `snapshot_id uuid not null`
- `environment_id uuid not null`
- `action text not null`
- `status text not null`
- `scheduled_for timestamptz null`
- `executed_at timestamptz null`
- `executed_by uuid null`
- `previous_snapshot_id uuid null`
- `reason text not null`
- `evidence jsonb not null`
- `created_at timestamptz not null`

Ação: `preview`, `activate`, `suspend`, `expire`, `rollback`.

### `collab_participation_programmes`

- `id uuid primary key`
- `project_id uuid not null`
- `code text not null`
- `title text not null`
- `description text not null`
- `objective text not null`
- `audience jsonb not null`
- `visibility text not null`
- `status text not null`
- `requirements jsonb not null`
- `completion_rule jsonb not null`
- `languages jsonb not null`
- `starts_at timestamptz null`
- `ends_at timestamptz null`
- `owner_user_id uuid not null`
- `created_by uuid not null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `collab_participation_steps`

- `id uuid primary key`
- `programme_id uuid not null`
- `code text not null`
- `step_type text not null`
- `source_type text not null`
- `source_id uuid null`
- `source_reference text null`
- `title_override text null`
- `instructions text null`
- `required boolean not null`
- `prerequisites jsonb not null`
- `sort_order integer not null`
- `active boolean not null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `collab_participation_enrolments`

- `id uuid primary key`
- `programme_id uuid not null`
- `user_id uuid not null`
- `status text not null`
- `enrolled_by uuid not null`
- `enrolled_at timestamptz not null`
- `started_at timestamptz null`
- `paused_at timestamptz null`
- `completed_at timestamptz null`
- `withdrawn_at timestamptz null`
- `withdrawal_reason text null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

Unicidade `programme_id + user_id`.

### `collab_participation_progress`

- `id uuid primary key`
- `enrolment_id uuid not null`
- `step_id uuid not null`
- `status text not null`
- `completion_source text null`
- `source_event_reference text null`
- `declared_by uuid null`
- `validated_by uuid null`
- `started_at timestamptz null`
- `completed_at timestamptz null`
- `validation_notes text null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

Unicidade `enrolment_id + step_id`.

### `collab_evolution_proposals`

- `id uuid primary key`
- `project_id uuid not null`
- `code text not null`
- `title text not null`
- `finding_summary text not null`
- `evidence_references jsonb not null`
- `affected_modules jsonb not null`
- `affected_profiles jsonb not null`
- `confidence text not null`
- `severity text not null`
- `limitations text null`
- `proposed_change text not null`
- `no_action_alternative text not null`
- `expected_impact text not null`
- `risks text not null`
- `effort_band text not null`
- `verification_plan text not null`
- `status text not null`
- `linked_task_id uuid null`
- `linked_incident_id uuid null`
- `target_release text null`
- `created_by uuid not null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `collab_evolution_decisions`

- `id uuid primary key`
- `proposal_id uuid not null`
- `decision text not null`
- `conditions text null`
- `rationale text not null`
- `decided_by uuid not null`
- `decided_at timestamptz not null`
- `verification_status text not null`
- `verification_summary text null`
- `verified_by uuid null`
- `verified_at timestamptz null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

## RLS

### Público

Pode ler apenas:

- snapshot ativo;
- payload público;
- programas com `visibility=public` e `status=available|active`;
- passos publicamente elegíveis, sem dados de inscrição.

### Participante

Pode:

- ver programas internos para os quais é elegível;
- criar inscrição própria quando permitido;
- ver e atualizar apenas o próprio progresso permitido;
- pausar ou retirar a própria inscrição.

Não pode:

- validar o próprio progresso quando a regra exige coordenação;
- ver inscrições de terceiros;
- gerir propostas públicas;
- ver decisões internas sem permissão.

### Coordenação

Pode gerir programas, passos, inscrições, progresso, propostas e evolução, conforme permissões.

### Master

Pode aprovar ativação, rollback e decisões protegidas.

## Segurança

- snapshots não contêm PII;
- references públicas usam identificadores seguros;
- payload é validado por schema;
- checksum é obrigatório;
- ativação de produção usa backend protegido;
- `service_role` ausente do frontend;
- rollback não elimina histórico;
- retirada invalida dependências;
- export público deve falhar quando encontra campos proibidos;
- todas as mutações produzem auditoria.
