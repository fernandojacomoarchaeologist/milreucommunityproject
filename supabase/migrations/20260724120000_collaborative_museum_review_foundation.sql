-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08F — revisão editorial, formação e biblioteca.

create table if not exists public.collab_training_trails (
  code text primary key,
  version text not null,
  title text not null,
  summary text,
  estimated_minutes integer not null default 0,
  passing_score integer not null default 80,
  audience jsonb not null default '[]'::jsonb,
  required_for jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_training_trails_minutes_check check (estimated_minutes>=0),
  constraint collab_training_trails_score_check check (passing_score between 0 and 100)
);

create table if not exists public.collab_training_lessons (
  id uuid primary key default gen_random_uuid(),
  trail_code text not null references public.collab_training_trails(code) on delete cascade,
  lesson_code text not null,
  title text not null,
  resource_path text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(trail_code,lesson_code)
);

create table if not exists public.collab_training_enrolments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  trail_code text not null references public.collab_training_trails(code) on delete cascade,
  status text not null default 'not-started',
  progress_percent integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(project_id,user_id,trail_code),
  constraint collab_training_enrolments_status_check check (
    status in ('not-started','in-progress','assessment-pending','completed','expired')
  ),
  constraint collab_training_progress_check check (progress_percent between 0 and 100)
);

create table if not exists public.collab_training_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrolment_id uuid not null references public.collab_training_enrolments(id) on delete cascade,
  lesson_code text not null,
  status text not null default 'not-started',
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(enrolment_id,lesson_code),
  constraint collab_training_lesson_status_check check (
    status in ('not-started','in-progress','completed')
  )
);

create table if not exists public.collab_training_assessments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  trail_code text not null references public.collab_training_trails(code) on delete cascade,
  attempt_number integer not null,
  score integer not null,
  passed boolean not null,
  answers jsonb not null default '{}'::jsonb,
  assessed_at timestamptz not null default now(),
  assessed_by uuid references auth.users(id) on delete set null,
  unique(project_id,user_id,trail_code,attempt_number),
  constraint collab_training_assessment_score_check check (score between 0 and 100),
  constraint collab_training_assessment_attempt_check check (attempt_number>0)
);

create table if not exists public.collab_library_resources (
  code text primary key,
  version text not null,
  title text not null,
  category text not null,
  resource_path text not null,
  audience jsonb not null default '["all"]'::jsonb,
  status text not null default 'active',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_library_resources_status_check check (
    status in ('draft','active','archived')
  )
);

create table if not exists public.collab_museum_review_cycles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  title text not null,
  description text,
  status text not null default 'planned',
  source_dataset_version text not null,
  source_dataset_hash text not null,
  started_at timestamptz,
  target_at timestamptz,
  closed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id,code),
  constraint collab_museum_review_cycles_status_check check (
    status in ('planned','active','paused','ready-for-release','released','closed','cancelled')
  )
);

create table if not exists public.collab_museum_review_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  cycle_id uuid not null references public.collab_museum_review_cycles(id) on delete cascade,
  memory_id text not null,
  status text not null default 'not-started',
  source_record_hash text not null,
  source_editorial_status text,
  source_site_visible boolean not null default false,
  public_release_eligible boolean not null default false,
  requires_ai_disclosure boolean not null default false,
  assigned_editor uuid references auth.users(id) on delete set null,
  assigned_researcher uuid references auth.users(id) on delete set null,
  assigned_rights_reviewer uuid references auth.users(id) on delete set null,
  assigned_translator uuid references auth.users(id) on delete set null,
  blocking_comment_count integer not null default 0,
  accepted_proposal_count integer not null default 0,
  linked_contribution_count integer not null default 0,
  editorial_approved_at timestamptz,
  rights_approved_at timestamptz,
  publication_approved_at timestamptz,
  incorporated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cycle_id,memory_id),
  constraint collab_museum_review_records_status_check check (
    status in (
      'not-started','in-progress','needs-changes','ready-editorial',
      'editorial-approved','rights-approved','publication-approved',
      'incorporated','closed'
    )
  ),
  constraint collab_museum_review_counts_check check (
    blocking_comment_count>=0 and accepted_proposal_count>=0 and linked_contribution_count>=0
  )
);

create index if not exists collab_museum_review_records_queue_idx
on public.collab_museum_review_records(project_id,cycle_id,status,memory_id);

create table if not exists public.collab_museum_review_field_proposals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  review_record_id uuid not null references public.collab_museum_review_records(id) on delete cascade,
  field_path text not null,
  base_value jsonb,
  proposed_value jsonb,
  rationale text not null,
  source_ids jsonb not null default '[]'::jsonb,
  contribution_ids jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  proposed_by uuid not null references auth.users(id) on delete restrict,
  proposed_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  supersedes_id uuid references public.collab_museum_review_field_proposals(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_museum_review_proposals_status_check check (
    status in ('draft','submitted','accepted','rejected','superseded','incorporated')
  ),
  constraint collab_museum_review_field_path_check check (field_path like '/%')
);

create index if not exists collab_museum_review_proposals_record_idx
on public.collab_museum_review_field_proposals(review_record_id,status,field_path);

create unique index if not exists collab_museum_review_active_field_proposal_unique
on public.collab_museum_review_field_proposals(review_record_id,field_path)
where status in ('draft','submitted','accepted');

create table if not exists public.collab_museum_review_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  review_record_id uuid not null references public.collab_museum_review_records(id) on delete cascade,
  field_path text,
  comment_type text not null default 'note',
  body text not null,
  blocking boolean not null default false,
  resolved boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  constraint collab_museum_review_comment_type_check check (
    comment_type in (
      'note','question','blocking','source-request','rights-request',
      'translation-request','accessibility-request'
    )
  )
);

create index if not exists collab_museum_review_comments_record_idx
on public.collab_museum_review_comments(review_record_id,resolved,blocking,created_at);

create table if not exists public.collab_museum_review_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  review_record_id uuid not null references public.collab_museum_review_records(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  assignment_role text not null,
  status text not null default 'active',
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint collab_museum_review_assignment_role_check check (
    assignment_role in ('editorial','research','rights','translation','accessibility','publication')
  ),
  constraint collab_museum_review_assignment_status_check check (
    status in ('active','completed','cancelled')
  )
);

create unique index if not exists collab_museum_review_assignments_active_unique
on public.collab_museum_review_assignments(review_record_id,user_id,assignment_role)
where status='active';

create table if not exists public.collab_museum_review_checks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  review_record_id uuid not null references public.collab_museum_review_records(id) on delete cascade,
  check_type text not null,
  status text not null default 'pending',
  note text,
  checked_by uuid references auth.users(id) on delete set null,
  checked_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(review_record_id,check_type),
  constraint collab_museum_review_check_type_check check (
    check_type in (
      'editorial','source','rights','digital-intervention','accessibility',
      'translation','relations','publication'
    )
  ),
  constraint collab_museum_review_check_status_check check (
    status in ('pending','in-progress','passed','failed','not-applicable')
  )
);

create table if not exists public.collab_museum_review_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  review_record_id uuid not null references public.collab_museum_review_records(id) on delete cascade,
  decision_type text not null,
  rationale text not null,
  decision_data jsonb not null default '{}'::jsonb,
  decided_by uuid not null references auth.users(id) on delete restrict,
  decided_at timestamptz not null default now(),
  supersedes_id uuid references public.collab_museum_review_decisions(id),
  constraint collab_museum_review_decision_type_check check (
    decision_type in (
      'editorial-approve','rights-approve','publication-approve',
      'request-changes','reopen','incorporate'
    )
  )
);

create index if not exists collab_museum_review_decisions_record_idx
on public.collab_museum_review_decisions(review_record_id,decided_at desc);

create table if not exists public.collab_museum_review_contribution_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  review_record_id uuid not null references public.collab_museum_review_records(id) on delete cascade,
  contribution_id uuid not null references public.collab_contributions(id) on delete cascade,
  link_type text not null default 'supports',
  note text,
  linked_by uuid not null references auth.users(id) on delete restrict,
  linked_at timestamptz not null default now(),
  unique(review_record_id,contribution_id,link_type),
  constraint collab_museum_review_contribution_link_type_check check (
    link_type in ('supports','corrects','identifies','rights','source','contextualises')
  )
);

create table if not exists public.collab_museum_review_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  cycle_id uuid not null references public.collab_museum_review_cycles(id) on delete cascade,
  version text not null,
  source_dataset_hash text not null,
  payload jsonb not null,
  payload_hash text not null,
  status text not null default 'draft',
  generated_by uuid references auth.users(id) on delete set null,
  generated_at timestamptz not null default now(),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  applied_at timestamptz,
  constraint collab_museum_review_snapshots_status_check check (
    status in ('draft','validated','approved','applied','rejected','superseded')
  )
);

create index if not exists collab_museum_review_snapshots_cycle_idx
on public.collab_museum_review_snapshots(cycle_id,status,generated_at desc);

create table if not exists public.collab_public_content_effects (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  cycle_id uuid references public.collab_museum_review_cycles(id) on delete set null,
  effect_code text not null,
  slot_code text not null,
  effect_type text not null default 'memory-highlight',
  title jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  memory_ids jsonb not null default '[]'::jsonb,
  enabled boolean not null default false,
  status text not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(project_id,effect_code),
  constraint collab_public_effect_slot_check check (
    slot_code in ('portal.home.after-featured','museum.home.after-opening')
  ),
  constraint collab_public_effect_type_check check (
    effect_type in ('memory-highlight','editorial-update','participation-callout')
  ),
  constraint collab_public_effect_status_check check (
    status in ('draft','review','approved','published','paused','archived')
  )
);

create index if not exists collab_public_content_effects_slot_idx
on public.collab_public_content_effects(project_id,slot_code,status,enabled);

drop trigger if exists collab_training_trails_touch_updated_at on public.collab_training_trails;
create trigger collab_training_trails_touch_updated_at
before update on public.collab_training_trails
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_library_resources_touch_updated_at on public.collab_library_resources;
create trigger collab_library_resources_touch_updated_at
before update on public.collab_library_resources
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_museum_review_cycles_touch_updated_at on public.collab_museum_review_cycles;
create trigger collab_museum_review_cycles_touch_updated_at
before update on public.collab_museum_review_cycles
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_museum_review_records_touch_updated_at on public.collab_museum_review_records;
create trigger collab_museum_review_records_touch_updated_at
before update on public.collab_museum_review_records
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_museum_review_field_proposals_touch_updated_at on public.collab_museum_review_field_proposals;
create trigger collab_museum_review_field_proposals_touch_updated_at
before update on public.collab_museum_review_field_proposals
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_public_content_effects_touch_updated_at on public.collab_public_content_effects;
create trigger collab_public_content_effects_touch_updated_at
before update on public.collab_public_content_effects
for each row execute function public.collab_touch_updated_at();

alter table public.collab_training_trails enable row level security;
alter table public.collab_training_lessons enable row level security;
alter table public.collab_training_enrolments enable row level security;
alter table public.collab_training_lesson_progress enable row level security;
alter table public.collab_training_assessments enable row level security;
alter table public.collab_library_resources enable row level security;
alter table public.collab_museum_review_cycles enable row level security;
alter table public.collab_museum_review_records enable row level security;
alter table public.collab_museum_review_field_proposals enable row level security;
alter table public.collab_museum_review_comments enable row level security;
alter table public.collab_museum_review_assignments enable row level security;
alter table public.collab_museum_review_checks enable row level security;
alter table public.collab_museum_review_decisions enable row level security;
alter table public.collab_museum_review_contribution_links enable row level security;
alter table public.collab_museum_review_snapshots enable row level security;
alter table public.collab_public_content_effects enable row level security;

grant select on public.collab_training_trails to authenticated;
grant select on public.collab_training_lessons to authenticated;
grant select on public.collab_training_enrolments to authenticated;
grant select on public.collab_training_lesson_progress to authenticated;
grant select on public.collab_training_assessments to authenticated;
grant select on public.collab_library_resources to authenticated;
grant select on public.collab_museum_review_cycles to authenticated;
grant select on public.collab_museum_review_records to authenticated;
grant select on public.collab_museum_review_field_proposals to authenticated;
grant select on public.collab_museum_review_comments to authenticated;
grant select on public.collab_museum_review_assignments to authenticated;
grant select on public.collab_museum_review_checks to authenticated;
grant select on public.collab_museum_review_decisions to authenticated;
grant select on public.collab_museum_review_contribution_links to authenticated;
grant select on public.collab_museum_review_snapshots to authenticated;
grant select on public.collab_public_content_effects to authenticated;

drop policy if exists collab_training_catalogue_read on public.collab_training_trails;
create policy collab_training_catalogue_read
on public.collab_training_trails for select to authenticated
using (
  active and (
    public.collab_has_permission('training.view')
    or public.collab_has_permission('training.manage')
  )
);

drop policy if exists collab_training_lessons_read on public.collab_training_lessons;
create policy collab_training_lessons_read
on public.collab_training_lessons for select to authenticated
using (
  active and (
    public.collab_has_permission('training.view')
    or public.collab_has_permission('training.manage')
  )
);

drop policy if exists collab_training_enrolments_read on public.collab_training_enrolments;
create policy collab_training_enrolments_read
on public.collab_training_enrolments for select to authenticated
using (
  user_id=auth.uid()
  or public.collab_has_permission('training.manage',project_id)
  or public.collab_has_permission('training.audit.view',project_id)
);

drop policy if exists collab_training_lesson_progress_read on public.collab_training_lesson_progress;
create policy collab_training_lesson_progress_read
on public.collab_training_lesson_progress for select to authenticated
using (
  exists(
    select 1 from public.collab_training_enrolments enrolment
    where enrolment.id=enrolment_id
      and (
        enrolment.user_id=auth.uid()
        or public.collab_has_permission('training.manage',enrolment.project_id)
        or public.collab_has_permission('training.audit.view',enrolment.project_id)
      )
  )
);

drop policy if exists collab_training_assessments_read on public.collab_training_assessments;
create policy collab_training_assessments_read
on public.collab_training_assessments for select to authenticated
using (
  user_id=auth.uid()
  or public.collab_has_permission('training.manage',project_id)
  or public.collab_has_permission('training.audit.view',project_id)
);

drop policy if exists collab_library_resources_read on public.collab_library_resources;
create policy collab_library_resources_read
on public.collab_library_resources for select to authenticated
using (
  status='active' and (
    public.collab_has_permission('library.view')
    or public.collab_has_permission('library.manage')
  )
);

drop policy if exists collab_museum_review_cycles_read on public.collab_museum_review_cycles;
create policy collab_museum_review_cycles_read
on public.collab_museum_review_cycles for select to authenticated
using (
  public.collab_has_permission('museum.review.view',project_id)
  or public.collab_has_permission('museum.review',project_id)
  or public.collab_has_permission('museum.review.manage',project_id)
);

drop policy if exists collab_museum_review_records_read on public.collab_museum_review_records;
create policy collab_museum_review_records_read
on public.collab_museum_review_records for select to authenticated
using (
  public.collab_has_permission('museum.review.view',project_id)
  or public.collab_has_permission('museum.review',project_id)
  or public.collab_has_permission('museum.review.manage',project_id)
);

drop policy if exists collab_museum_review_proposals_read on public.collab_museum_review_field_proposals;
create policy collab_museum_review_proposals_read
on public.collab_museum_review_field_proposals for select to authenticated
using (
  public.collab_has_permission('museum.review.view',project_id)
  or public.collab_has_permission('museum.review',project_id)
  or public.collab_has_permission('museum.review.manage',project_id)
);

drop policy if exists collab_museum_review_comments_read on public.collab_museum_review_comments;
create policy collab_museum_review_comments_read
on public.collab_museum_review_comments for select to authenticated
using (
  public.collab_has_permission('museum.review.view',project_id)
  or public.collab_has_permission('museum.review',project_id)
  or public.collab_has_permission('museum.review.manage',project_id)
);

drop policy if exists collab_museum_review_assignments_read on public.collab_museum_review_assignments;
create policy collab_museum_review_assignments_read
on public.collab_museum_review_assignments for select to authenticated
using (
  user_id=auth.uid()
  or public.collab_has_permission('museum.review.assign',project_id)
  or public.collab_has_permission('museum.review.manage',project_id)
);

drop policy if exists collab_museum_review_checks_read on public.collab_museum_review_checks;
create policy collab_museum_review_checks_read
on public.collab_museum_review_checks for select to authenticated
using (
  public.collab_has_permission('museum.review.view',project_id)
  or public.collab_has_permission('museum.review',project_id)
  or public.collab_has_permission('museum.review.manage',project_id)
);

drop policy if exists collab_museum_review_decisions_read on public.collab_museum_review_decisions;
create policy collab_museum_review_decisions_read
on public.collab_museum_review_decisions for select to authenticated
using (
  public.collab_has_permission('museum.review.view',project_id)
  or public.collab_has_permission('museum.review',project_id)
  or public.collab_has_permission('museum.review.manage',project_id)
);

drop policy if exists collab_museum_review_contribution_links_read on public.collab_museum_review_contribution_links;
create policy collab_museum_review_contribution_links_read
on public.collab_museum_review_contribution_links for select to authenticated
using (
  public.collab_has_permission('museum.review.view',project_id)
  or public.collab_has_permission('museum.review',project_id)
  or public.collab_has_permission('museum.review.manage',project_id)
);

drop policy if exists collab_museum_review_snapshots_read on public.collab_museum_review_snapshots;
create policy collab_museum_review_snapshots_read
on public.collab_museum_review_snapshots for select to authenticated
using (
  public.collab_has_permission('museum.review.export',project_id)
  or public.collab_has_permission('museum.review.manage',project_id)
);

drop policy if exists collab_public_content_effects_internal_read on public.collab_public_content_effects;
create policy collab_public_content_effects_internal_read
on public.collab_public_content_effects for select to authenticated
using (
  public.collab_has_permission('museum.review.preview',project_id)
  or public.collab_has_permission('museum.review.effects.manage',project_id)
  or public.collab_has_permission('museum.review.manage',project_id)
);
