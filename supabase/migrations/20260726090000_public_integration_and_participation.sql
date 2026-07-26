-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08L — integração pública, participação contínua e evolução (fundação).
--
-- Nenhum efeito público está ativo por omissão. A leitura pública (anon)
-- é restrita a snapshots aprovados/ativos e a programas com visibilidade
-- pública, sem PII nem dados de inscrição. Toda a escrita passa por RPC
-- auditada. Produção permanece bloqueada; slots públicos começam vazios.

-- 1. Propostas de publicação (rascunho de efeito público, sujeito a revisão)
create table if not exists public.collab_publication_proposals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  title text not null,
  purpose text not null,
  target_surface text not null,
  target_slot text,
  source_type text not null,
  source_id uuid,
  source_reference text,
  payload_draft jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  language_status jsonb not null default '{}'::jsonb,
  editorial_status text not null default 'pending',
  rights_status text not null default 'pending',
  privacy_status text not null default 'pending',
  accessibility_status text not null default 'pending',
  valid_from timestamptz,
  valid_until timestamptz,
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_pub_proposal_surface_check check (target_surface in ('portal','museum')),
  constraint collab_pub_proposal_status_check check (
    status in ('draft','under-review','changes-requested','approved-for-preview','previewed','approved-for-activation','active','rejected','suspended','expired','rolled-back','withdrawn')
  ),
  constraint collab_pub_proposal_code_unique unique (project_id, code)
);

-- 2. Snapshots de publicação (payload imutável validado, sem PII)
create table if not exists public.collab_publication_snapshots (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.collab_publication_proposals(id) on delete cascade,
  version integer not null,
  schema_version text not null,
  payload jsonb not null,
  checksum text not null,
  snapshot_references jsonb not null default '[]'::jsonb,
  languages jsonb not null default '{}'::jsonb,
  status text not null default 'generated',
  generated_by uuid not null references auth.users(id) on delete restrict,
  generated_at timestamptz not null default now(),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  activated_at timestamptz,
  deactivated_at timestamptz,
  deactivation_reason text,
  constraint collab_pub_snapshot_status_check check (
    status in ('generated','approved','active','inactive','superseded','rejected')
  ),
  constraint collab_pub_snapshot_version_unique unique (proposal_id, version),
  constraint collab_pub_snapshot_checksum_unique unique (checksum)
);

-- 3. Ativações de publicação (preview/activate/suspend/expire/rollback)
create table if not exists public.collab_publication_activations (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references public.collab_publication_snapshots(id) on delete cascade,
  environment text not null default 'staging',
  action text not null,
  status text not null default 'pending',
  scheduled_for timestamptz,
  executed_at timestamptz,
  executed_by uuid references auth.users(id) on delete set null,
  previous_snapshot_id uuid references public.collab_publication_snapshots(id) on delete set null,
  reason text not null,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint collab_pub_activation_env_check check (environment in ('staging','production')),
  constraint collab_pub_activation_action_check check (action in ('preview','activate','suspend','expire','rollback')),
  constraint collab_pub_activation_status_check check (status in ('pending','executed','failed','cancelled'))
);

-- 4. Programas de participação contínua
create table if not exists public.collab_participation_programmes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  title text not null,
  description text not null,
  objective text not null,
  audience jsonb not null default '[]'::jsonb,
  visibility text not null default 'members',
  status text not null default 'draft',
  requirements jsonb not null default '[]'::jsonb,
  completion_rule jsonb not null default '{}'::jsonb,
  languages jsonb not null default '{}'::jsonb,
  starts_at timestamptz,
  ends_at timestamptz,
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_prog_visibility_check check (visibility in ('public','members','restricted')),
  constraint collab_prog_status_check check (status in ('draft','available','active','paused','completed','archived','withdrawn')),
  constraint collab_prog_code_unique unique (project_id, code)
);

-- 5. Passos do programa
create table if not exists public.collab_participation_steps (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.collab_participation_programmes(id) on delete cascade,
  code text not null,
  step_type text not null,
  source_type text not null,
  source_id uuid,
  source_reference text,
  title_override text,
  instructions text,
  required boolean not null default true,
  prerequisites jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_step_type_check check (
    step_type in ('training','opportunity','task','event','contribution','review','reading','orientation','custom-reference')
  ),
  constraint collab_step_code_unique unique (programme_id, code)
);

-- 6. Inscrições
create table if not exists public.collab_participation_enrolments (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.collab_participation_programmes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'enrolled',
  enrolled_by uuid not null references auth.users(id) on delete restrict,
  enrolled_at timestamptz not null default now(),
  started_at timestamptz,
  paused_at timestamptz,
  completed_at timestamptz,
  withdrawn_at timestamptz,
  withdrawal_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_enrol_status_check check (status in ('enrolled','active','paused','completed','withdrawn','removed')),
  constraint collab_enrol_unique unique (programme_id, user_id)
);

-- 7. Progresso por passo
create table if not exists public.collab_participation_progress (
  id uuid primary key default gen_random_uuid(),
  enrolment_id uuid not null references public.collab_participation_enrolments(id) on delete cascade,
  step_id uuid not null references public.collab_participation_steps(id) on delete cascade,
  status text not null default 'not-started',
  completion_source text,
  source_event_reference text,
  declared_by uuid references auth.users(id) on delete set null,
  validated_by uuid references auth.users(id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  validation_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_progress_status_check check (status in ('not-started','available','in-progress','completed','blocked','skipped','not-applicable')),
  constraint collab_progress_source_check check (completion_source is null or completion_source in ('system-event','coordinator-confirmation','participant-declaration','imported-evidence')),
  constraint collab_progress_unique unique (enrolment_id, step_id)
);

-- 8. Propostas de evolução (orientadas pelo piloto)
create table if not exists public.collab_evolution_proposals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  title text not null,
  finding_summary text not null,
  evidence_references jsonb not null default '[]'::jsonb,
  affected_modules jsonb not null default '[]'::jsonb,
  affected_profiles jsonb not null default '[]'::jsonb,
  confidence text not null default 'medium',
  severity text not null default 'low',
  limitations text,
  proposed_change text not null,
  no_action_alternative text not null,
  expected_impact text not null,
  risks text not null,
  effort_band text not null default 'unknown',
  verification_plan text not null,
  status text not null default 'draft',
  linked_task_id uuid,
  linked_incident_id uuid,
  target_release text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_evo_confidence_check check (confidence in ('low','medium','high')),
  constraint collab_evo_severity_check check (severity in ('info','low','medium','high','critical')),
  constraint collab_evo_status_check check (status in ('draft','under-review','accepted','planned','rejected','deferred','implemented','verified')),
  constraint collab_evo_code_unique unique (project_id, code)
);

-- 9. Decisões de evolução
create table if not exists public.collab_evolution_decisions (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.collab_evolution_proposals(id) on delete cascade,
  decision text not null,
  conditions text,
  rationale text not null,
  decided_by uuid not null references auth.users(id) on delete restrict,
  decided_at timestamptz not null default now(),
  verification_status text not null default 'pending',
  verification_summary text,
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_evo_decision_check check (decision in ('accept','reject','defer','plan','request-changes')),
  constraint collab_evo_verification_check check (verification_status in ('pending','in-progress','verified','failed','not-applicable'))
);

-- Índices
create index if not exists collab_pub_proposals_idx on public.collab_publication_proposals(project_id, status, created_at desc);
create index if not exists collab_pub_snapshots_idx on public.collab_publication_snapshots(proposal_id, version desc);
create index if not exists collab_pub_snapshots_active_idx on public.collab_publication_snapshots(status) where status='active';
create index if not exists collab_pub_activations_idx on public.collab_publication_activations(snapshot_id, created_at desc);
create index if not exists collab_prog_idx on public.collab_participation_programmes(project_id, visibility, status);
create index if not exists collab_steps_idx on public.collab_participation_steps(programme_id, sort_order);
create index if not exists collab_enrol_idx on public.collab_participation_enrolments(programme_id, user_id);
create index if not exists collab_progress_idx on public.collab_participation_progress(enrolment_id, step_id);
create index if not exists collab_evo_proposals_idx on public.collab_evolution_proposals(project_id, status, created_at desc);
create index if not exists collab_evo_decisions_idx on public.collab_evolution_decisions(proposal_id, decided_at desc);

-- Helper: inscrição própria
create or replace function public.collab_participation_is_enrolled(p_programme uuid)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1 from public.collab_participation_enrolments e
    where e.programme_id=p_programme and e.user_id=auth.uid()
      and e.status in ('enrolled','active','paused','completed')
  )
$$;
grant execute on function public.collab_participation_is_enrolled(uuid) to authenticated;

-- RLS
alter table public.collab_publication_proposals enable row level security;
alter table public.collab_publication_snapshots enable row level security;
alter table public.collab_publication_activations enable row level security;
alter table public.collab_participation_programmes enable row level security;
alter table public.collab_participation_steps enable row level security;
alter table public.collab_participation_enrolments enable row level security;
alter table public.collab_participation_progress enable row level security;
alter table public.collab_evolution_proposals enable row level security;
alter table public.collab_evolution_decisions enable row level security;

-- Grants: leitura autenticada; leitura anónima (pública) só onde permitido.
grant select on public.collab_publication_proposals to authenticated;
grant select on public.collab_publication_snapshots to authenticated, anon;
grant select on public.collab_publication_activations to authenticated;
grant select on public.collab_participation_programmes to authenticated, anon;
grant select on public.collab_participation_steps to authenticated, anon;
grant select on public.collab_participation_enrolments to authenticated;
grant select on public.collab_participation_progress to authenticated;
grant select on public.collab_evolution_proposals to authenticated;
grant select on public.collab_evolution_decisions to authenticated;

-- Propostas de publicação: gestão por permissão.
drop policy if exists collab_pub_proposals_select on public.collab_publication_proposals;
create policy collab_pub_proposals_select on public.collab_publication_proposals for select to authenticated
using (public.collab_has_permission('public-integration.view', project_id) or public.collab_has_permission('public-integration.propose', project_id));

-- Snapshots: público lê apenas snapshots ATIVOS; autenticado com permissão vê todos.
drop policy if exists collab_pub_snapshots_public on public.collab_publication_snapshots;
create policy collab_pub_snapshots_public on public.collab_publication_snapshots for select to anon
using (status='active');
drop policy if exists collab_pub_snapshots_select on public.collab_publication_snapshots;
create policy collab_pub_snapshots_select on public.collab_publication_snapshots for select to authenticated
using (status='active' or public.collab_has_permission('public-integration.view'));

drop policy if exists collab_pub_activations_select on public.collab_publication_activations;
create policy collab_pub_activations_select on public.collab_publication_activations for select to authenticated
using (public.collab_has_permission('public-integration.view'));

-- Programas: público vê apenas visibility=public e status available/active; membros veem internos.
drop policy if exists collab_prog_public on public.collab_participation_programmes;
create policy collab_prog_public on public.collab_participation_programmes for select to anon
using (visibility='public' and status in ('available','active'));
drop policy if exists collab_prog_select on public.collab_participation_programmes;
create policy collab_prog_select on public.collab_participation_programmes for select to authenticated
using (
  (visibility in ('public','members') and status in ('available','active'))
  or public.collab_participation_is_enrolled(id)
  or public.collab_has_permission('participation.manage', project_id)
);

-- Passos: público vê os de programas públicos; membros conforme acesso ao programa.
drop policy if exists collab_steps_public on public.collab_participation_steps;
create policy collab_steps_public on public.collab_participation_steps for select to anon
using (active and exists(
  select 1 from public.collab_participation_programmes p
  where p.id=programme_id and p.visibility='public' and p.status in ('available','active')
));
drop policy if exists collab_steps_select on public.collab_participation_steps;
create policy collab_steps_select on public.collab_participation_steps for select to authenticated
using (
  public.collab_has_permission('participation.view')
  or public.collab_participation_is_enrolled(programme_id)
  or public.collab_has_permission('participation.manage')
);

-- Inscrições: própria ou gestão. Nunca de terceiros.
drop policy if exists collab_enrol_select on public.collab_participation_enrolments;
create policy collab_enrol_select on public.collab_participation_enrolments for select to authenticated
using (user_id=auth.uid() or public.collab_has_permission('participation.manage'));

-- Progresso: próprio (via inscrição) ou gestão.
drop policy if exists collab_progress_select on public.collab_participation_progress;
create policy collab_progress_select on public.collab_participation_progress for select to authenticated
using (
  exists(select 1 from public.collab_participation_enrolments e where e.id=enrolment_id and e.user_id=auth.uid())
  or public.collab_has_permission('participation.manage')
);

-- Evolução: por permissão.
drop policy if exists collab_evo_proposals_select on public.collab_evolution_proposals;
create policy collab_evo_proposals_select on public.collab_evolution_proposals for select to authenticated
using (public.collab_has_permission('evolution.view', project_id) or public.collab_has_permission('evolution.manage', project_id));
drop policy if exists collab_evo_decisions_select on public.collab_evolution_decisions;
create policy collab_evo_decisions_select on public.collab_evolution_decisions for select to authenticated
using (public.collab_has_permission('evolution.view') or public.collab_has_permission('evolution.manage'));
