-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08K — piloto controlado e homologação operacional (fundação).
--
-- Piloto restrito a staging. Nenhuma escrita de produção, nenhum efeito
-- público, nenhuma publicação automática. Participantes veem apenas o
-- próprio contexto; evidências privadas nunca são expostas a participantes.
-- Todas as mutações ocorrem por RPC auditada (ver migration ...080100).

-- 1. Ciclos de piloto
create table if not exists public.collab_pilot_cycles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  environment text not null default 'staging',
  homologation_run_id uuid references public.collab_homologation_runs(id) on delete set null,
  code text not null,
  title text not null,
  objective text not null,
  scope text,
  baseline_release text not null,
  status text not null default 'draft',
  phase text not null default 'preparation',
  starts_at timestamptz,
  ends_at timestamptz,
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  closure_summary text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_pilot_cycle_env_check check (environment = 'staging'),
  constraint collab_pilot_cycle_status_check check (
    status in ('draft','preparing','ready','running','paused','evaluating','completed','blocked','cancelled')
  ),
  constraint collab_pilot_cycle_phase_check check (
    phase in ('preparation','staging-activation','internal-smoke','role-based-pilot','assisted-community-pilot','evaluation','closure')
  ),
  constraint collab_pilot_cycle_code_unique unique (project_id, code)
);

-- 2. Coorte (participantes explicitamente inscritos)
create table if not exists public.collab_pilot_participants (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.collab_pilot_cycles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  participant_role text not null default 'participant',
  target_profile_type text not null,
  status text not null default 'invited',
  onboarding_status text not null default 'pending',
  privacy_notice_version text,
  privacy_accepted_at timestamptz,
  support_needs text,
  invited_by uuid not null references auth.users(id) on delete restrict,
  invited_at timestamptz not null default now(),
  confirmed_at timestamptz,
  withdrawn_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_pilot_participant_role_check check (
    participant_role in ('participant','facilitator','observer')
  ),
  constraint collab_pilot_participant_status_check check (
    status in ('invited','confirmed','active','withdrawn','completed','removed')
  ),
  constraint collab_pilot_participant_onboarding_check check (
    onboarding_status in ('pending','in-progress','completed','blocked','not-applicable')
  ),
  constraint collab_pilot_participant_unique unique (cycle_id, user_id)
);

-- 3. Cenários (modelos de validação por ciclo, sem resultados)
create table if not exists public.collab_pilot_scenarios (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.collab_pilot_cycles(id) on delete cascade,
  code text not null,
  title text not null,
  description text not null,
  module_code text not null,
  route text,
  target_profile_type text,
  preconditions jsonb not null default '[]'::jsonb,
  instructions jsonb not null default '[]'::jsonb,
  expected_outcome text not null,
  evidence_requirements jsonb not null default '[]'::jsonb,
  risk_level text not null default 'low',
  required boolean not null default true,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_pilot_scenario_risk_check check (
    risk_level in ('info','low','medium','high','critical')
  ),
  constraint collab_pilot_scenario_code_unique unique (cycle_id, code)
);

-- 4. Sessões (execução concreta de cenários)
create table if not exists public.collab_pilot_sessions (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.collab_pilot_cycles(id) on delete cascade,
  scenario_id uuid not null references public.collab_pilot_scenarios(id) on delete cascade,
  facilitator_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'scheduled',
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  actual_start timestamptz,
  actual_end timestamptz,
  environment text not null default 'staging',
  summary text,
  blocker_reason text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_pilot_session_env_check check (environment = 'staging'),
  constraint collab_pilot_session_status_check check (
    status in ('scheduled','in-progress','completed','blocked','cancelled')
  )
);

-- 5. Participação por sessão
create table if not exists public.collab_pilot_session_participants (
  session_id uuid not null references public.collab_pilot_sessions(id) on delete cascade,
  participant_id uuid not null references public.collab_pilot_participants(id) on delete cascade,
  attendance_status text not null default 'pending',
  completion_status text not null default 'pending',
  support_level text not null default 'independent',
  participant_notes text,
  facilitator_notes text,
  started_at timestamptz,
  completed_at timestamptz,
  constraint collab_pilot_session_completion_check check (
    completion_status in ('pending','passed','failed','blocked','not-applicable')
  ),
  constraint collab_pilot_session_support_check check (
    support_level in ('independent','assisted','facilitated')
  ),
  primary key (session_id, participant_id)
);

-- 6. Observações e feedback
create table if not exists public.collab_pilot_observations (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.collab_pilot_cycles(id) on delete cascade,
  session_id uuid references public.collab_pilot_sessions(id) on delete set null,
  participant_id uuid references public.collab_pilot_participants(id) on delete set null,
  reported_by uuid not null references auth.users(id) on delete restrict,
  observation_type text not null,
  severity text not null default 'info',
  status text not null default 'new',
  module_code text,
  route text,
  summary text not null,
  description text not null,
  reproduction_steps text,
  expected_result text,
  actual_result text,
  assigned_to uuid references auth.users(id) on delete set null,
  linked_task_id uuid,
  linked_incident_id uuid,
  resolution_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint collab_pilot_observation_type_check check (
    observation_type in ('functional','usability','accessibility','content','rights','privacy','performance','support','security','other')
  ),
  constraint collab_pilot_observation_severity_check check (
    severity in ('info','low','medium','high','critical')
  ),
  constraint collab_pilot_observation_status_check check (
    status in ('new','triaged','accepted','planned','resolved','rejected','duplicate')
  )
);

-- 7. Evidências (referência, nunca conteúdo binário)
create table if not exists public.collab_pilot_evidence (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.collab_pilot_cycles(id) on delete cascade,
  session_id uuid references public.collab_pilot_sessions(id) on delete set null,
  observation_id uuid references public.collab_pilot_observations(id) on delete set null,
  evidence_type text not null,
  storage_path text,
  external_reference text,
  checksum text,
  sensitivity text not null default 'internal',
  redaction_status text not null default 'not-required',
  description text not null,
  captured_by uuid not null references auth.users(id) on delete restrict,
  captured_at timestamptz not null default now(),
  retention_until timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint collab_pilot_evidence_type_check check (
    evidence_type in ('screenshot','log','document','export','approval','metric','video','audio','other')
  ),
  constraint collab_pilot_evidence_sensitivity_check check (
    sensitivity in ('internal','restricted','personal')
  ),
  constraint collab_pilot_evidence_redaction_check check (
    redaction_status in ('not-required','pending','redacted','rejected')
  )
);

-- 8. Snapshots internos de métricas (sem ranking público de pessoas)
create table if not exists public.collab_pilot_metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.collab_pilot_cycles(id) on delete cascade,
  metric_code text not null,
  value_numeric numeric,
  numerator numeric,
  denominator numeric,
  unit text not null default 'count',
  scope jsonb not null default '{}'::jsonb,
  source text not null default 'system',
  period_start timestamptz,
  period_end timestamptz,
  generated_by uuid references auth.users(id) on delete set null,
  generated_at timestamptz not null default now()
);

-- 9. Resultados de gates
create table if not exists public.collab_pilot_gate_results (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.collab_pilot_cycles(id) on delete cascade,
  gate_code text not null,
  status text not null default 'pending',
  blocking boolean not null default true,
  evidence_summary text,
  evidence_ids uuid[] not null default '{}',
  decided_by uuid references auth.users(id) on delete set null,
  decided_at timestamptz,
  waiver_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_pilot_gate_status_check check (
    status in ('pending','passed','failed','blocked','waived','not-applicable')
  ),
  constraint collab_pilot_gate_code_unique unique (cycle_id, gate_code)
);

-- Índices de acesso
create index if not exists collab_pilot_cycles_project_idx
  on public.collab_pilot_cycles(project_id, created_at desc);
create index if not exists collab_pilot_participants_cycle_idx
  on public.collab_pilot_participants(cycle_id, user_id);
create index if not exists collab_pilot_scenarios_cycle_idx
  on public.collab_pilot_scenarios(cycle_id, sort_order);
create index if not exists collab_pilot_sessions_cycle_idx
  on public.collab_pilot_sessions(cycle_id, scenario_id, created_at desc);
create index if not exists collab_pilot_observations_cycle_idx
  on public.collab_pilot_observations(cycle_id, status, severity, created_at desc);
create index if not exists collab_pilot_evidence_cycle_idx
  on public.collab_pilot_evidence(cycle_id, created_at desc);
create index if not exists collab_pilot_metric_snapshots_cycle_idx
  on public.collab_pilot_metric_snapshots(cycle_id, metric_code, generated_at desc);
create index if not exists collab_pilot_gate_results_cycle_idx
  on public.collab_pilot_gate_results(cycle_id, gate_code);

-- Helpers de RLS
create or replace function public.collab_pilot_is_participant(p_cycle uuid)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1 from public.collab_pilot_participants p
    where p.cycle_id=p_cycle
      and p.user_id=auth.uid()
      and p.status in ('invited','confirmed','active','completed')
  )
$$;

create or replace function public.collab_pilot_facilitates_session(p_session uuid)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1 from public.collab_pilot_sessions s
    where s.id=p_session and s.facilitator_user_id=auth.uid()
  )
$$;

grant execute on function public.collab_pilot_is_participant(uuid) to authenticated;
grant execute on function public.collab_pilot_facilitates_session(uuid) to authenticated;

-- RLS: leitura apenas; toda a escrita passa por RPC (security definer).
alter table public.collab_pilot_cycles enable row level security;
alter table public.collab_pilot_participants enable row level security;
alter table public.collab_pilot_scenarios enable row level security;
alter table public.collab_pilot_sessions enable row level security;
alter table public.collab_pilot_session_participants enable row level security;
alter table public.collab_pilot_observations enable row level security;
alter table public.collab_pilot_evidence enable row level security;
alter table public.collab_pilot_metric_snapshots enable row level security;
alter table public.collab_pilot_gate_results enable row level security;

grant select on public.collab_pilot_cycles to authenticated;
grant select on public.collab_pilot_participants to authenticated;
grant select on public.collab_pilot_scenarios to authenticated;
grant select on public.collab_pilot_sessions to authenticated;
grant select on public.collab_pilot_session_participants to authenticated;
grant select on public.collab_pilot_observations to authenticated;
grant select on public.collab_pilot_evidence to authenticated;
grant select on public.collab_pilot_metric_snapshots to authenticated;
grant select on public.collab_pilot_gate_results to authenticated;

drop policy if exists collab_pilot_cycles_select on public.collab_pilot_cycles;
create policy collab_pilot_cycles_select
on public.collab_pilot_cycles for select to authenticated
using (
  public.collab_pilot_is_participant(id)
  or public.collab_has_permission('pilot.view', project_id)
  or public.collab_has_permission('pilot.manage', project_id)
);

drop policy if exists collab_pilot_participants_select on public.collab_pilot_participants;
create policy collab_pilot_participants_select
on public.collab_pilot_participants for select to authenticated
using (
  user_id=auth.uid()
  or public.collab_has_permission('pilot.participants.manage')
  or public.collab_has_permission('pilot.manage')
);

drop policy if exists collab_pilot_scenarios_select on public.collab_pilot_scenarios;
create policy collab_pilot_scenarios_select
on public.collab_pilot_scenarios for select to authenticated
using (
  public.collab_pilot_is_participant(cycle_id)
  or public.collab_has_permission('pilot.view')
  or public.collab_has_permission('pilot.manage')
);

drop policy if exists collab_pilot_sessions_select on public.collab_pilot_sessions;
create policy collab_pilot_sessions_select
on public.collab_pilot_sessions for select to authenticated
using (
  public.collab_pilot_facilitates_session(id)
  or exists(
    select 1
    from public.collab_pilot_session_participants sp
    join public.collab_pilot_participants p on p.id=sp.participant_id
    where sp.session_id=collab_pilot_sessions.id and p.user_id=auth.uid()
  )
  or public.collab_has_permission('pilot.sessions.manage')
  or public.collab_has_permission('pilot.manage')
);

drop policy if exists collab_pilot_session_participants_select on public.collab_pilot_session_participants;
create policy collab_pilot_session_participants_select
on public.collab_pilot_session_participants for select to authenticated
using (
  exists(
    select 1 from public.collab_pilot_participants p
    where p.id=participant_id and p.user_id=auth.uid()
  )
  or public.collab_pilot_facilitates_session(session_id)
  or public.collab_has_permission('pilot.sessions.manage')
  or public.collab_has_permission('pilot.manage')
);

drop policy if exists collab_pilot_observations_select on public.collab_pilot_observations;
create policy collab_pilot_observations_select
on public.collab_pilot_observations for select to authenticated
using (
  reported_by=auth.uid()
  or public.collab_has_permission('pilot.feedback.manage')
  or public.collab_has_permission('pilot.manage')
);

-- Evidências privadas: nunca visíveis a participantes.
drop policy if exists collab_pilot_evidence_select on public.collab_pilot_evidence;
create policy collab_pilot_evidence_select
on public.collab_pilot_evidence for select to authenticated
using (
  public.collab_has_permission('pilot.evidence.manage')
  or public.collab_has_permission('pilot.manage')
);

drop policy if exists collab_pilot_metric_snapshots_select on public.collab_pilot_metric_snapshots;
create policy collab_pilot_metric_snapshots_select
on public.collab_pilot_metric_snapshots for select to authenticated
using (
  public.collab_has_permission('pilot.metrics.view')
  or public.collab_has_permission('pilot.manage')
);

drop policy if exists collab_pilot_gate_results_select on public.collab_pilot_gate_results;
create policy collab_pilot_gate_results_select
on public.collab_pilot_gate_results for select to authenticated
using (
  public.collab_has_permission('pilot.gates.evaluate')
  or public.collab_has_permission('pilot.approve')
  or public.collab_has_permission('pilot.manage')
);
