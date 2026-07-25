-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08E — contributos comunitários e moderação.

create table if not exists public.collab_consent_versions (
  code text primary key,
  title text not null,
  body text not null,
  active boolean not null default false,
  effective_at timestamptz not null default now(),
  retired_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.collab_contribution_submitters (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  email text not null,
  phone text,
  locality text,
  preferred_contact text not null default 'email',
  contact_allowed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_contribution_submitters_email_lower check (email=lower(email)),
  constraint collab_contribution_submitters_contact_check check (
    preferred_contact in ('email','phone','none')
  )
);

create index if not exists collab_contribution_submitters_user_idx
on public.collab_contribution_submitters(project_id,user_id);

create index if not exists collab_contribution_submitters_email_idx
on public.collab_contribution_submitters(project_id,email);

create table if not exists public.collab_contributions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  submitter_id uuid not null references public.collab_contribution_submitters(id) on delete restrict,
  submitter_user_id uuid references auth.users(id) on delete set null,
  contribution_type text not null,
  title text not null,
  summary text,
  content text not null,
  historical_context text,
  place_text text,
  date_text text,
  source_context text,
  attribution_preference text not null default 'discuss',
  requested_usage_scope text not null default 'review-only',
  rights_declaration text not null,
  status text not null default 'submitted',
  priority text not null default 'normal',
  tracking_token_hash text not null unique,
  public_reference text not null unique,
  public_message text,
  assigned_to uuid references auth.users(id) on delete set null,
  submitted_at timestamptz not null default now(),
  triaged_at timestamptz,
  reviewed_at timestamptz,
  decided_at timestamptz,
  incorporated_at timestamptz,
  withdrawn_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_contributions_type_check check (
    contribution_type in (
      'photograph','testimony','correction','document',
      'reference','rights-credit','other'
    )
  ),
  constraint collab_contributions_status_check check (
    status in (
      'draft','submitted','triage','needs-info','under-review',
      'accepted','partially-accepted','rejected','withdrawn',
      'incorporated','archived'
    )
  ),
  constraint collab_contributions_priority_check check (
    priority in ('low','normal','high','urgent')
  ),
  constraint collab_contributions_attribution_check check (
    attribution_preference in ('full-name','first-name','anonymous','discuss')
  ),
  constraint collab_contributions_usage_check check (
    requested_usage_scope in (
      'review-only','digital-project','exhibition','research','all-project'
    )
  )
);

create index if not exists collab_contributions_queue_idx
on public.collab_contributions(project_id,status,priority,submitted_at);

create index if not exists collab_contributions_submitter_idx
on public.collab_contributions(project_id,submitter_user_id,submitted_at desc);

create index if not exists collab_contributions_assignee_idx
on public.collab_contributions(project_id,assigned_to,status);

create table if not exists public.collab_contribution_consents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  contribution_id uuid not null references public.collab_contributions(id) on delete cascade,
  consent_version text not null references public.collab_consent_versions(code),
  privacy_accepted boolean not null,
  rights_confirmed boolean not null,
  project_use_authorised boolean not null,
  contact_authorised boolean not null default true,
  public_attribution_authorised boolean not null default false,
  accepted_at timestamptz not null default now(),
  acceptance_metadata jsonb not null default '{}'::jsonb,
  unique(contribution_id,consent_version)
);

create table if not exists public.collab_contribution_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  contribution_id uuid not null references public.collab_contributions(id) on delete cascade,
  storage_bucket text not null default 'community-contributions-private',
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  size_bytes bigint not null,
  sha256 text,
  status text not null default 'upload-pending',
  rights_note text,
  technical_note text,
  uploaded_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_contribution_files_size_check check (
    size_bytes>0 and size_bytes<=26214400
  ),
  constraint collab_contribution_files_status_check check (
    status in (
      'declared','upload-pending','uploaded','scan-pending',
      'accepted','rejected','deleted'
    )
  )
);

create index if not exists collab_contribution_files_contribution_idx
on public.collab_contribution_files(contribution_id,status);

create table if not exists public.collab_contribution_targets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  contribution_id uuid not null references public.collab_contributions(id) on delete cascade,
  target_type text not null default 'general',
  target_identifier text,
  relation_type text not null default 'supports',
  note text,
  created_at timestamptz not null default now(),
  constraint collab_contribution_targets_type_check check (
    target_type in (
      'general','museum-memory','initiative','proteus-record',
      'exhibition','portal-page'
    )
  ),
  constraint collab_contribution_targets_relation_check check (
    relation_type in (
      'supports','corrects','identifies','questions','rights','contextualises'
    )
  )
);

create index if not exists collab_contribution_targets_contribution_idx
on public.collab_contribution_targets(contribution_id);

create table if not exists public.collab_contribution_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  contribution_id uuid not null references public.collab_contributions(id) on delete cascade,
  reviewer_user_id uuid not null references auth.users(id) on delete cascade,
  assignment_role text not null default 'reviewer',
  status text not null default 'active',
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint collab_contribution_assignments_role_check check (
    assignment_role in ('triage','reviewer','rights','editorial','research')
  ),
  constraint collab_contribution_assignments_status_check check (
    status in ('active','completed','cancelled')
  )
);

create unique index if not exists collab_contribution_assignments_active_unique
on public.collab_contribution_assignments(contribution_id,reviewer_user_id,assignment_role)
where status='active';

create table if not exists public.collab_contribution_events (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  contribution_id uuid not null references public.collab_contributions(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  from_status text,
  to_status text,
  note text,
  visible_to_submitter boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists collab_contribution_events_idx
on public.collab_contribution_events(contribution_id,created_at desc);

create table if not exists public.collab_contribution_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  contribution_id uuid not null references public.collab_contributions(id) on delete cascade,
  decision_type text not null,
  rationale text not null,
  public_message text,
  decided_by uuid not null references auth.users(id) on delete restrict,
  decided_at timestamptz not null default now(),
  supersedes_id uuid references public.collab_contribution_decisions(id),
  constraint collab_contribution_decisions_type_check check (
    decision_type in (
      'accept','partial','reject','request-info','withdraw','incorporate'
    )
  )
);

create index if not exists collab_contribution_decisions_idx
on public.collab_contribution_decisions(contribution_id,decided_at desc);

create table if not exists public.collab_contribution_incorporation_proposals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  contribution_id uuid not null references public.collab_contributions(id) on delete cascade,
  destination text not null,
  target_identifier text,
  proposal_summary text not null,
  status text not null default 'draft',
  proposed_by uuid not null references auth.users(id) on delete restrict,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint collab_incorporation_destination_check check (
    destination in ('museum','proteus','portal','research','exhibition','archive')
  ),
  constraint collab_incorporation_status_check check (
    status in ('draft','pending','approved','rejected','implemented','cancelled')
  )
);

create index if not exists collab_incorporation_proposals_idx
on public.collab_contribution_incorporation_proposals(contribution_id,status);

create table if not exists public.collab_withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  contribution_id uuid references public.collab_contributions(id) on delete set null,
  public_reference text,
  requester_user_id uuid references auth.users(id) on delete set null,
  requester_name text not null,
  requester_email text not null,
  reason text not null,
  status text not null default 'submitted',
  reviewer_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  completed_at timestamptz,
  constraint collab_withdrawal_email_lower check (requester_email=lower(requester_email)),
  constraint collab_withdrawal_status_check check (
    status in ('submitted','under-review','approved','rejected','completed')
  )
);

create index if not exists collab_withdrawal_queue_idx
on public.collab_withdrawal_requests(project_id,status,submitted_at);

create table if not exists public.collab_public_submission_rate_limits (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  fingerprint_hash text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 1,
  updated_at timestamptz not null default now(),
  unique(project_id,fingerprint_hash,window_started_at)
);

drop trigger if exists collab_contribution_submitters_touch_updated_at
on public.collab_contribution_submitters;
create trigger collab_contribution_submitters_touch_updated_at
before update on public.collab_contribution_submitters
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_contributions_touch_updated_at
on public.collab_contributions;
create trigger collab_contributions_touch_updated_at
before update on public.collab_contributions
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_contribution_files_touch_updated_at
on public.collab_contribution_files;
create trigger collab_contribution_files_touch_updated_at
before update on public.collab_contribution_files
for each row execute function public.collab_touch_updated_at();

alter table public.collab_consent_versions enable row level security;
alter table public.collab_contribution_submitters enable row level security;
alter table public.collab_contributions enable row level security;
alter table public.collab_contribution_consents enable row level security;
alter table public.collab_contribution_files enable row level security;
alter table public.collab_contribution_targets enable row level security;
alter table public.collab_contribution_assignments enable row level security;
alter table public.collab_contribution_events enable row level security;
alter table public.collab_contribution_decisions enable row level security;
alter table public.collab_contribution_incorporation_proposals enable row level security;
alter table public.collab_withdrawal_requests enable row level security;
alter table public.collab_public_submission_rate_limits enable row level security;

grant select on public.collab_consent_versions to anon,authenticated;
grant select on public.collab_contribution_submitters to authenticated;
grant select on public.collab_contributions to authenticated;
grant select on public.collab_contribution_consents to authenticated;
grant select on public.collab_contribution_files to authenticated;
grant select on public.collab_contribution_targets to authenticated;
grant select on public.collab_contribution_assignments to authenticated;
grant select on public.collab_contribution_events to authenticated;
grant select on public.collab_contribution_decisions to authenticated;
grant select on public.collab_contribution_incorporation_proposals to authenticated;
grant select on public.collab_withdrawal_requests to authenticated;

drop policy if exists collab_consent_versions_public_read
on public.collab_consent_versions;
create policy collab_consent_versions_public_read
on public.collab_consent_versions for select to anon,authenticated
using (active);

drop policy if exists collab_contribution_submitters_read
on public.collab_contribution_submitters;
create policy collab_contribution_submitters_read
on public.collab_contribution_submitters for select to authenticated
using (
  user_id=auth.uid()
  or public.collab_has_permission('contributions.view-all',project_id)
  or public.collab_has_permission('contributions.moderate',project_id)
);

drop policy if exists collab_contributions_read
on public.collab_contributions;
create policy collab_contributions_read
on public.collab_contributions for select to authenticated
using (
  submitter_user_id=auth.uid()
  or public.collab_has_permission('contributions.view-all',project_id)
  or public.collab_has_permission('contributions.moderate',project_id)
);

drop policy if exists collab_contribution_consents_read
on public.collab_contribution_consents;
create policy collab_contribution_consents_read
on public.collab_contribution_consents for select to authenticated
using (
  exists(
    select 1 from public.collab_contributions contribution
    where contribution.id=contribution_id
      and (
        contribution.submitter_user_id=auth.uid()
        or public.collab_has_permission('contributions.view-all',contribution.project_id)
        or public.collab_has_permission('contributions.moderate',contribution.project_id)
      )
  )
);

drop policy if exists collab_contribution_files_read
on public.collab_contribution_files;
create policy collab_contribution_files_read
on public.collab_contribution_files for select to authenticated
using (
  exists(
    select 1 from public.collab_contributions contribution
    where contribution.id=contribution_id
      and (
        contribution.submitter_user_id=auth.uid()
        or public.collab_has_permission('contributions.files.review',contribution.project_id)
        or public.collab_has_permission('contributions.moderate',contribution.project_id)
      )
  )
);

drop policy if exists collab_contribution_targets_read
on public.collab_contribution_targets;
create policy collab_contribution_targets_read
on public.collab_contribution_targets for select to authenticated
using (
  exists(
    select 1 from public.collab_contributions contribution
    where contribution.id=contribution_id
      and (
        contribution.submitter_user_id=auth.uid()
        or public.collab_has_permission('contributions.view-all',contribution.project_id)
        or public.collab_has_permission('contributions.moderate',contribution.project_id)
      )
  )
);

drop policy if exists collab_contribution_assignments_read
on public.collab_contribution_assignments;
create policy collab_contribution_assignments_read
on public.collab_contribution_assignments for select to authenticated
using (
  reviewer_user_id=auth.uid()
  or public.collab_has_permission('contributions.assign',project_id)
  or public.collab_has_permission('contributions.moderate',project_id)
);

drop policy if exists collab_contribution_events_read
on public.collab_contribution_events;
create policy collab_contribution_events_read
on public.collab_contribution_events for select to authenticated
using (
  (
    visible_to_submitter
    and exists(
      select 1 from public.collab_contributions contribution
      where contribution.id=contribution_id
        and contribution.submitter_user_id=auth.uid()
    )
  )
  or public.collab_has_permission('contributions.view-all',project_id)
  or public.collab_has_permission('contributions.moderate',project_id)
);

drop policy if exists collab_contribution_decisions_read
on public.collab_contribution_decisions;
create policy collab_contribution_decisions_read
on public.collab_contribution_decisions for select to authenticated
using (
  exists(
    select 1 from public.collab_contributions contribution
    where contribution.id=contribution_id
      and (
        contribution.submitter_user_id=auth.uid()
        or public.collab_has_permission('contributions.view-all',contribution.project_id)
        or public.collab_has_permission('contributions.moderate',contribution.project_id)
      )
  )
);

drop policy if exists collab_incorporation_proposals_read
on public.collab_contribution_incorporation_proposals;
create policy collab_incorporation_proposals_read
on public.collab_contribution_incorporation_proposals for select to authenticated
using (
  public.collab_has_permission('contributions.review',project_id)
  or public.collab_has_permission('contributions.moderate',project_id)
);

drop policy if exists collab_withdrawal_requests_read
on public.collab_withdrawal_requests;
create policy collab_withdrawal_requests_read
on public.collab_withdrawal_requests for select to authenticated
using (
  requester_user_id=auth.uid()
  or public.collab_has_permission('withdrawals.manage',project_id)
  or public.collab_has_permission('contributions.moderate',project_id)
);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values(
  'community-contributions-private',
  'community-contributions-private',
  false,
  26214400,
  array[
    'image/jpeg','image/png','image/webp','image/tiff',
    'application/pdf','text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict(id) do update set
  public=false,
  file_size_limit=excluded.file_size_limit,
  allowed_mime_types=excluded.allowed_mime_types;
