-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08M — operação pública, governação, monitorização e sustentabilidade (fundação).
--
-- Nenhum ciclo operacional real, responsável ou indicador é semeado. A
-- transparência pública está desativada por omissão; o público (anon) lê
-- apenas snapshots de indicadores com publicação 'published', sem dados
-- individuais nem contactos. Toda a escrita passa por RPC auditada.

-- 1. Ciclos de operação
create table if not exists public.collab_operating_cycles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  title text not null,
  cycle_type text not null default 'operations',
  status text not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  review_summary text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_opcycle_status_check check (status in ('draft','preparing','ready','active','paused','reviewing','completed','blocked','cancelled')),
  constraint collab_opcycle_code_unique unique (project_id, code)
);

-- 2. Responsabilidades operacionais (internas; risco de pessoa única)
create table if not exists public.collab_operational_responsibilities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  domain text not null,
  role_type text not null,
  person_user_id uuid references auth.users(id) on delete set null,
  substitute_user_id uuid references auth.users(id) on delete set null,
  authority_scope text,
  status text not null default 'draft',
  accepted_at timestamptz,
  valid_until timestamptz,
  single_person_risk boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_resp_status_check check (status in ('draft','proposed','accepted','active','lapsed','revoked'))
);

-- 3. Pedidos de suporte (o próprio vê os seus; terceiros privados)
create table if not exists public.collab_service_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  public_reference text not null,
  category text not null,
  priority text not null default 'normal',
  status text not null default 'new',
  summary text not null,
  description text not null,
  requested_by uuid references auth.users(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  linked_task_id uuid,
  linked_incident_id uuid,
  resolution_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_support_status_check check (status in ('new','triaged','in-progress','waiting-user','waiting-external','resolved','closed','cancelled'))
);

-- 4. Casos de moderação (restritos; sujeito não recebe acesso administrativo)
create table if not exists public.collab_moderation_cases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  category text not null,
  priority text not null default 'normal',
  status text not null default 'reported',
  source text not null default 'internal',
  source_reference text,
  reported_by uuid references auth.users(id) on delete set null,
  subject_reference text,
  description text not null,
  action text,
  appeal_notes text,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_moderation_status_check check (status in ('reported','triaged','under-review','action-required','resolved','appealed','closed')),
  constraint collab_moderation_code_unique unique (project_id, code)
);

-- 5. Ciclos de revisão periódica de conteúdo
create table if not exists public.collab_content_review_cycles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  entity_type text not null,
  entity_reference text not null,
  review_types jsonb not null default '[]'::jsonb,
  status text not null default 'not-started',
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  expires_at timestamptz,
  owner_user_id uuid references auth.users(id) on delete set null,
  outcome text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_contentreview_status_check check (status in ('not-started','scheduled','in-review','completed','overdue','blocked'))
);

-- 6. Decisões de governação
create table if not exists public.collab_governance_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  decision_type text not null,
  title text not null,
  context text not null,
  options jsonb not null default '[]'::jsonb,
  consultation text,
  authority text not null,
  conflict_of_interest text,
  decision text,
  rationale text,
  conditions text,
  review_at timestamptz,
  superseded_by uuid references public.collab_governance_decisions(id) on delete set null,
  status text not null default 'draft',
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_gov_status_check check (status in ('draft','consultation','ready-for-decision','decided','deferred','rejected','superseded'))
);

-- 7. Indicadores (definição, fonte, metodologia; sem dados individuais)
create table if not exists public.collab_impact_indicators (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  name text not null,
  indicator_type text not null,
  definition text not null,
  formula text,
  unit text not null default 'count',
  source text not null,
  population text,
  periodicity text,
  limitations text,
  quality_status text not null default 'unknown',
  publication_status text not null default 'internal',
  owner_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_indicator_type_check check (indicator_type in ('operational','participation','impact')),
  constraint collab_indicator_quality_check check (quality_status in ('unknown','draft','reviewed','approved','rejected')),
  constraint collab_indicator_publication_check check (publication_status in ('internal','candidate','approved','published','suspended','archived')),
  constraint collab_indicator_code_unique unique (project_id, code)
);

-- 8. Snapshots de indicadores (público lê apenas 'published')
create table if not exists public.collab_impact_snapshots (
  id uuid primary key default gen_random_uuid(),
  indicator_id uuid not null references public.collab_impact_indicators(id) on delete cascade,
  period_start timestamptz,
  period_end timestamptz,
  value_numeric numeric,
  numerator numeric,
  denominator numeric,
  methodology_version text not null,
  sources jsonb not null default '[]'::jsonb,
  quality_status text not null default 'unknown',
  privacy_status text not null default 'pending',
  publication_status text not null default 'internal',
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  generated_by uuid not null references auth.users(id) on delete restrict,
  generated_at timestamptz not null default now(),
  constraint collab_snapshot_quality_check check (quality_status in ('unknown','draft','reviewed','approved','rejected')),
  constraint collab_snapshot_privacy_check check (privacy_status in ('pending','approved','blocked')),
  constraint collab_snapshot_publication_check check (publication_status in ('internal','candidate','approved','published','suspended','archived'))
);

-- 9. Revisões de continuidade (risco de pessoa única; internas)
create table if not exists public.collab_continuity_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  review_type text not null,
  status text not null default 'not-started',
  dimensions jsonb not null default '[]'::jsonb,
  single_person_risk boolean not null default false,
  findings text,
  actions jsonb not null default '[]'::jsonb,
  responsible_user_id uuid references auth.users(id) on delete set null,
  next_review_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_continuity_status_check check (status in ('not-started','in-review','at-risk','adequate','blocked','completed'))
);

-- Índices
create index if not exists collab_opcycles_idx on public.collab_operating_cycles(project_id, status, created_at desc);
create index if not exists collab_resp_idx on public.collab_operational_responsibilities(project_id, domain);
create index if not exists collab_support_idx on public.collab_service_requests(project_id, status, created_at desc);
create index if not exists collab_support_mine_idx on public.collab_service_requests(requested_by, created_at desc);
create index if not exists collab_moderation_idx on public.collab_moderation_cases(project_id, status, created_at desc);
create index if not exists collab_contentreview_idx on public.collab_content_review_cycles(project_id, next_review_at);
create index if not exists collab_gov_idx on public.collab_governance_decisions(project_id, status, created_at desc);
create index if not exists collab_indicators_idx on public.collab_impact_indicators(project_id, indicator_type);
create index if not exists collab_snapshots_idx on public.collab_impact_snapshots(indicator_id, generated_at desc);
create index if not exists collab_snapshots_public_idx on public.collab_impact_snapshots(publication_status) where publication_status='published';
create index if not exists collab_continuity_idx on public.collab_continuity_reviews(project_id, status);

-- RLS
alter table public.collab_operating_cycles enable row level security;
alter table public.collab_operational_responsibilities enable row level security;
alter table public.collab_service_requests enable row level security;
alter table public.collab_moderation_cases enable row level security;
alter table public.collab_content_review_cycles enable row level security;
alter table public.collab_governance_decisions enable row level security;
alter table public.collab_impact_indicators enable row level security;
alter table public.collab_impact_snapshots enable row level security;
alter table public.collab_continuity_reviews enable row level security;

grant select on public.collab_operating_cycles to authenticated;
grant select on public.collab_operational_responsibilities to authenticated;
grant select on public.collab_service_requests to authenticated;
grant select on public.collab_moderation_cases to authenticated;
grant select on public.collab_content_review_cycles to authenticated;
grant select on public.collab_governance_decisions to authenticated;
grant select on public.collab_impact_indicators to authenticated;
grant select on public.collab_impact_snapshots to authenticated, anon;
grant select on public.collab_continuity_reviews to authenticated;

drop policy if exists collab_opcycles_select on public.collab_operating_cycles;
create policy collab_opcycles_select on public.collab_operating_cycles for select to authenticated
using (public.collab_has_permission('operations.view', project_id) or public.collab_has_permission('operations.manage', project_id));

drop policy if exists collab_resp_select on public.collab_operational_responsibilities;
create policy collab_resp_select on public.collab_operational_responsibilities for select to authenticated
using (public.collab_has_permission('operations.view', project_id) or public.collab_has_permission('responsibilities.manage', project_id));

-- Suporte: o próprio vê os seus; terceiros só com support.manage.
drop policy if exists collab_support_select on public.collab_service_requests;
create policy collab_support_select on public.collab_service_requests for select to authenticated
using (requested_by=auth.uid() or public.collab_has_permission('support.manage', project_id));

-- Moderação: restrita a quem gere; o sujeito não recebe acesso.
drop policy if exists collab_moderation_select on public.collab_moderation_cases;
create policy collab_moderation_select on public.collab_moderation_cases for select to authenticated
using (public.collab_has_permission('moderation.manage', project_id));

drop policy if exists collab_contentreview_select on public.collab_content_review_cycles;
create policy collab_contentreview_select on public.collab_content_review_cycles for select to authenticated
using (public.collab_has_permission('content-review.manage', project_id) or public.collab_has_permission('operations.view', project_id));

drop policy if exists collab_gov_select on public.collab_governance_decisions;
create policy collab_gov_select on public.collab_governance_decisions for select to authenticated
using (public.collab_has_permission('governance.view', project_id) or public.collab_has_permission('governance.manage', project_id));

drop policy if exists collab_indicators_select on public.collab_impact_indicators;
create policy collab_indicators_select on public.collab_impact_indicators for select to authenticated
using (public.collab_has_permission('impact.manage', project_id) or public.collab_has_permission('operations.view', project_id));

-- Snapshots: público lê apenas 'published'; autenticado com permissão vê todos.
drop policy if exists collab_snapshots_public on public.collab_impact_snapshots;
create policy collab_snapshots_public on public.collab_impact_snapshots for select to anon
using (publication_status='published');
drop policy if exists collab_snapshots_select on public.collab_impact_snapshots;
create policy collab_snapshots_select on public.collab_impact_snapshots for select to authenticated
using (publication_status='published' or public.collab_has_permission('impact.manage') or public.collab_has_permission('operations.view'));

drop policy if exists collab_continuity_select on public.collab_continuity_reviews;
create policy collab_continuity_select on public.collab_continuity_reviews for select to authenticated
using (public.collab_has_permission('continuity.manage', project_id) or public.collab_has_permission('operations.view', project_id));
