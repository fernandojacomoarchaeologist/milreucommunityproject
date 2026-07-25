-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08G — ambientes, autenticação e homologação.

create table if not exists public.collab_deployment_environments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  name text not null,
  status text not null default 'unconfigured',
  site_url text,
  supabase_project_ref text,
  auth_callback_url text,
  is_production boolean not null default false,
  allows_reset boolean not null default false,
  allows_demo boolean not null default false,
  last_verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id,code),
  constraint collab_deployment_environment_code_check check (
    code in ('local','staging','production')
  ),
  constraint collab_deployment_environment_status_check check (
    status in ('unconfigured','configured','testing','blocked','homologated','retired')
  ),
  constraint collab_deployment_environment_prod_check check (
    (code='production' and is_production) or (code<>'production' and not is_production)
  ),
  constraint collab_deployment_environment_demo_check check (
    code='local' or not allows_demo
  )
);

create index if not exists collab_deployment_environments_status_idx
on public.collab_deployment_environments(project_id,status,code);

create table if not exists public.collab_auth_policies (
  project_id uuid primary key references public.collab_projects(id) on delete cascade,
  provider text not null default 'google',
  google_enabled boolean not null default false,
  require_preauthorization boolean not null default true,
  allowed_email_domains text[] not null default '{}'::text[],
  store_provider_tokens boolean not null default false,
  minimum_active_masters integer not null default 1,
  session_expiry_minutes integer not null default 60,
  policy_status text not null default 'draft',
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint collab_auth_policy_provider_check check (provider='google'),
  constraint collab_auth_policy_tokens_check check (not store_provider_tokens),
  constraint collab_auth_policy_masters_check check (minimum_active_masters>=1),
  constraint collab_auth_policy_expiry_check check (session_expiry_minutes between 15 and 1440),
  constraint collab_auth_policy_status_check check (
    policy_status in ('draft','testing','approved','suspended')
  )
);

create table if not exists public.collab_homologation_check_catalog (
  code text primary key,
  category text not null,
  title text not null,
  blocking boolean not null default true,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint collab_homologation_check_category_check check (
    category in (
      'environment','database','auth','master','rls','storage',
      'functional','accessibility','performance','recovery','privacy'
    )
  )
);

create table if not exists public.collab_homologation_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  environment_id uuid not null references public.collab_deployment_environments(id) on delete restrict,
  version text not null,
  commit_sha text,
  status text not null default 'planned',
  summary text,
  started_by uuid references auth.users(id) on delete set null,
  completed_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  approved_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_homologation_run_status_check check (
    status in ('planned','in-progress','blocked','failed','passed','approved','cancelled')
  ),
  constraint collab_homologation_commit_sha_check check (
    commit_sha is null or commit_sha ~ '^[0-9a-fA-F]{7,64}$'
  )
);

create index if not exists collab_homologation_runs_environment_idx
on public.collab_homologation_runs(project_id,environment_id,created_at desc);

create table if not exists public.collab_homologation_checks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  run_id uuid not null references public.collab_homologation_runs(id) on delete cascade,
  check_code text not null references public.collab_homologation_check_catalog(code) on delete restrict,
  category text not null,
  title text not null,
  blocking boolean not null default true,
  status text not null default 'pending',
  evidence text,
  note text,
  checked_by uuid references auth.users(id) on delete set null,
  checked_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(run_id,check_code),
  constraint collab_homologation_check_status_check check (
    status in ('pending','running','passed','failed','blocked','not-applicable')
  )
);

create index if not exists collab_homologation_checks_run_idx
on public.collab_homologation_checks(run_id,blocking,status,check_code);

drop trigger if exists collab_deployment_environments_touch_updated_at on public.collab_deployment_environments;
create trigger collab_deployment_environments_touch_updated_at
before update on public.collab_deployment_environments
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_homologation_runs_touch_updated_at on public.collab_homologation_runs;
create trigger collab_homologation_runs_touch_updated_at
before update on public.collab_homologation_runs
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_homologation_checks_touch_updated_at on public.collab_homologation_checks;
create trigger collab_homologation_checks_touch_updated_at
before update on public.collab_homologation_checks
for each row execute function public.collab_touch_updated_at();

alter table public.collab_deployment_environments enable row level security;
alter table public.collab_auth_policies enable row level security;
alter table public.collab_homologation_check_catalog enable row level security;
alter table public.collab_homologation_runs enable row level security;
alter table public.collab_homologation_checks enable row level security;

grant select on public.collab_deployment_environments to authenticated;
grant select on public.collab_auth_policies to authenticated;
grant select on public.collab_homologation_check_catalog to authenticated;
grant select on public.collab_homologation_runs to authenticated;
grant select on public.collab_homologation_checks to authenticated;

drop policy if exists collab_deployment_environments_read on public.collab_deployment_environments;
create policy collab_deployment_environments_read
on public.collab_deployment_environments for select to authenticated
using (
  public.collab_has_permission('deployment.view',project_id)
  or public.collab_has_permission('homologation.view',project_id)
);

drop policy if exists collab_auth_policies_read on public.collab_auth_policies;
create policy collab_auth_policies_read
on public.collab_auth_policies for select to authenticated
using (
  public.collab_has_permission('auth.policy.view',project_id)
  or public.collab_has_permission('auth.policy.manage',project_id)
);

drop policy if exists collab_homologation_catalog_read on public.collab_homologation_check_catalog;
create policy collab_homologation_catalog_read
on public.collab_homologation_check_catalog for select to authenticated
using (
  public.collab_has_permission('homologation.view')
  or public.collab_has_permission('homologation.run')
);

drop policy if exists collab_homologation_runs_read on public.collab_homologation_runs;
create policy collab_homologation_runs_read
on public.collab_homologation_runs for select to authenticated
using (
  public.collab_has_permission('homologation.view',project_id)
  or public.collab_has_permission('homologation.run',project_id)
);

drop policy if exists collab_homologation_checks_read on public.collab_homologation_checks;
create policy collab_homologation_checks_read
on public.collab_homologation_checks for select to authenticated
using (
  public.collab_has_permission('homologation.view',project_id)
  or public.collab_has_permission('homologation.check',project_id)
);
