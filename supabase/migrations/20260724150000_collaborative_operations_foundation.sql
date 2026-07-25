-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08I — administração, auditoria, retenção e continuidade.

-- Auditoria: redacção, classificação, correlação e cadeia de integridade.

alter table public.collab_audit_log
  add column if not exists event_category text not null default 'other',
  add column if not exists severity text not null default 'info',
  add column if not exists request_id text,
  add column if not exists correlation_id uuid,
  add column if not exists previous_hash text,
  add column if not exists event_hash text,
  add column if not exists redaction_version integer not null default 1;

do $$
begin
  if not exists(
    select 1 from pg_constraint
    where conname='collab_audit_category_check'
  ) then
    alter table public.collab_audit_log
      add constraint collab_audit_category_check check (
        event_category in (
          'access','members','tasks','agenda','exhibitions','contributions',
          'museum','training','deployment','notifications','operations',
          'retention','incidents','backups','security','other'
        )
      );
  end if;
  if not exists(
    select 1 from pg_constraint
    where conname='collab_audit_severity_check'
  ) then
    alter table public.collab_audit_log
      add constraint collab_audit_severity_check check (
        severity in ('info','warning','critical')
      );
  end if;
  if not exists(
    select 1 from pg_constraint
    where conname='collab_audit_redaction_version_check'
  ) then
    alter table public.collab_audit_log
      add constraint collab_audit_redaction_version_check check (
        redaction_version>=1
      );
  end if;
end
$$;

create index if not exists collab_audit_project_created_idx
on public.collab_audit_log(project_id,created_at desc,id desc);

create index if not exists collab_audit_entity_idx
on public.collab_audit_log(project_id,entity_type,entity_id,created_at desc);

create index if not exists collab_audit_category_idx
on public.collab_audit_log(project_id,event_category,severity,created_at desc);

create or replace function public.collab_audit_category_08i(p_action text)
returns text
language sql
immutable
as $$
  select case
    when p_action like 'access%' or p_action like 'auth%' then 'access'
    when p_action like 'member%' or p_action like 'membership%' or p_action like 'role%' then 'members'
    when p_action like 'task%' or p_action like 'availability%' then 'tasks'
    when p_action like 'agenda%' or p_action like 'event%' then 'agenda'
    when p_action like 'exhibition%' or p_action like 'venue%' then 'exhibitions'
    when p_action like 'contribution%' or p_action like 'withdrawal%' then 'contributions'
    when p_action like 'museum%' then 'museum'
    when p_action like 'training%' or p_action like 'library%' then 'training'
    when p_action like 'deployment%' or p_action like 'homologation%' then 'deployment'
    when p_action like 'notification%' then 'notifications'
    when p_action like 'retention%' or p_action like 'legal-hold%' then 'retention'
    when p_action like 'incident%' or p_action like 'continuity%' then 'incidents'
    when p_action like 'backup%' then 'backups'
    when p_action like 'security%' or p_action like 'master%' then 'security'
    when p_action like 'operation%' or p_action like 'health%' or p_action like 'setting%' then 'operations'
    else 'other'
  end
$$;

create or replace function public.collab_audit_severity_08i(p_action text)
returns text
language sql
immutable
as $$
  select case
    when p_action like '%deleted%'
      or p_action like '%suspended%'
      or p_action like '%withdrawal%'
      or p_action like '%incident.opened%'
      or p_action like '%production%'
      or p_action like '%retention.applied%'
      then 'critical'
    when p_action like '%rejected%'
      or p_action like '%cancelled%'
      or p_action like '%failed%'
      or p_action like '%blocked%'
      or p_action like '%approved%'
      then 'warning'
    else 'info'
  end
$$;

create or replace function public.collab_redact_json_08i(p_value jsonb)
returns jsonb
language plpgsql
immutable
as $$
declare
  result jsonb;
begin
  if p_value is null then return null; end if;
  if jsonb_typeof(p_value)='object' then
    select coalesce(
      jsonb_object_agg(
        key,
        case
          when lower(key) in (
            'email','requester_email','recipient_email','phone','address',
            'password','secret','token','access_token','refresh_token',
            'service_role','private_key','tracking_token_hash',
            'body','content','rights_declaration'
          )
          or lower(key) like '%secret%'
          or lower(key) like '%password%'
          or lower(key) like '%token%'
          then '"[REDACTED]"'::jsonb
          else public.collab_redact_json_08i(value)
        end
      ),
      '{}'::jsonb
    ) into result
    from jsonb_each(p_value);
    return result;
  elsif jsonb_typeof(p_value)='array' then
    select coalesce(jsonb_agg(public.collab_redact_json_08i(value)),'[]'::jsonb)
    into result
    from jsonb_array_elements(p_value);
    return result;
  end if;
  return p_value;
end;
$$;

-- Deterministic project-by-project reconciliation of historical audit rows.
do $$
declare
  project_row record;
  audit_row record;
  previous_value text;
  computed_value text;
begin
  for project_row in
    select distinct project_id from public.collab_audit_log
  loop
    previous_value:=null;
    for audit_row in
      select *
      from public.collab_audit_log
      where project_id is not distinct from project_row.project_id
      order by id
    loop
      computed_value:=encode(
        digest(
          concat_ws('|',
            audit_row.id::text,
            coalesce(audit_row.project_id::text,''),
            coalesce(audit_row.actor_user_id::text,''),
            audit_row.action,
            audit_row.entity_type,
            coalesce(audit_row.entity_id,''),
            public.collab_redact_json_08i(audit_row.before_data)::text,
            public.collab_redact_json_08i(audit_row.after_data)::text,
            public.collab_redact_json_08i(audit_row.metadata)::text,
            audit_row.created_at::text,
            coalesce(previous_value,'')
          ),
          'sha256'
        ),
        'hex'
      );
      update public.collab_audit_log
      set previous_hash=previous_value,event_hash=computed_value
      where id=audit_row.id;
      previous_value:=computed_value;
    end loop;
  end loop;
end
$$;

create or replace function public.collab_audit_hash_before_insert_08i()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  previous_value text;
begin
  perform pg_advisory_xact_lock(hashtext(coalesce(new.project_id::text,'milreu-audit')));
  new.event_category:=coalesce(nullif(new.event_category,'other'),public.collab_audit_category_08i(new.action));
  if new.event_category='other' then
    new.event_category:=public.collab_audit_category_08i(new.action);
  end if;
  new.severity:=coalesce(nullif(new.severity,'info'),public.collab_audit_severity_08i(new.action));
  if new.severity='info' then
    new.severity:=public.collab_audit_severity_08i(new.action);
  end if;
  new.before_data:=public.collab_redact_json_08i(new.before_data);
  new.after_data:=public.collab_redact_json_08i(new.after_data);
  new.metadata:=coalesce(public.collab_redact_json_08i(new.metadata),'{}'::jsonb);
  new.redaction_version:=1;

  select event_hash into previous_value
  from public.collab_audit_log
  where project_id is not distinct from new.project_id
  order by id desc limit 1;

  new.previous_hash:=previous_value;
  new.event_hash:=encode(
    digest(
      concat_ws('|',
        coalesce(new.id::text,'pending'),
        coalesce(new.project_id::text,''),
        coalesce(new.actor_user_id::text,''),
        new.action,
        new.entity_type,
        coalesce(new.entity_id,''),
        new.before_data::text,
        new.after_data::text,
        new.metadata::text,
        new.created_at::text,
        coalesce(previous_value,'')
      ),
      'sha256'
    ),
    'hex'
  );
  return new;
end;
$$;

drop trigger if exists collab_audit_hash_before_insert_08i on public.collab_audit_log;
create trigger collab_audit_hash_before_insert_08i
before insert on public.collab_audit_log
for each row execute function public.collab_audit_hash_before_insert_08i();

create or replace function public.collab_audit_immutable_08i()
returns trigger
language plpgsql
as $$
begin
  if current_user not in ('postgres','supabase_admin') then
    raise exception 'audit_log_is_immutable';
  end if;
  return case when tg_op='DELETE' then old else new end;
end;
$$;

drop trigger if exists collab_audit_immutable_08i on public.collab_audit_log;
create trigger collab_audit_immutable_08i
before update or delete on public.collab_audit_log
for each row execute function public.collab_audit_immutable_08i();

alter table public.collab_audit_log
  alter column event_hash set not null;

revoke select on public.collab_audit_log from authenticated;


alter table public.collab_notification_event_types
  drop constraint if exists collab_notification_event_category_check;

alter table public.collab_notification_event_types
  add constraint collab_notification_event_category_check check (
    category in (
      'membership','tasks','contributions','museum-review','training',
      'agenda','exhibitions','withdrawals','security','operations',
      'incidents','backups','governance'
    )
  );

-- Administração e configurações não sensíveis.

create table if not exists public.collab_operational_settings (
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  category text not null,
  value_json jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  description text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key(project_id,code),
  constraint collab_operational_settings_category_check check (
    category in ('environment','maintenance','audit','retention','backup','continuity','privacy','other')
  ),
  constraint collab_operational_settings_status_check check (
    status in ('draft','active','deprecated')
  ),
  constraint collab_operational_settings_no_secrets_check check (
    value_json::text !~* '(service[_-]?role|secret|password|access[_-]?token|refresh[_-]?token|private[_-]?key|webhook[_-]?token)'
  )
);

create table if not exists public.collab_retention_policies (
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  resource_type text not null,
  name text not null,
  retention_days integer not null,
  action text not null,
  automatic_allowed boolean not null default false,
  legal_hold_supported boolean not null default true,
  risk text not null default 'medium',
  scope_description text not null,
  status text not null default 'draft',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key(project_id,code),
  constraint collab_retention_days_check check (retention_days>=0 and retention_days<=36500),
  constraint collab_retention_action_check check (
    action in ('delete','anonymize','export-only','manual-review')
  ),
  constraint collab_retention_risk_check check (
    risk in ('low','medium','high','critical')
  ),
  constraint collab_retention_status_check check (
    status in ('draft','active','paused','retired')
  ),
  constraint collab_retention_no_auto_critical_check check (
    not (risk='critical' and automatic_allowed)
  )
);

create table if not exists public.collab_legal_holds (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  resource_type text not null,
  entity_id text,
  reason text not null,
  status text not null default 'active',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  released_by uuid references auth.users(id) on delete set null,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  constraint collab_legal_hold_status_check check (
    status in ('active','released','expired','cancelled')
  ),
  constraint collab_legal_hold_dates_check check (
    ends_at is null or ends_at>starts_at
  )
);

create unique index if not exists collab_legal_holds_active_unique
on public.collab_legal_holds(project_id,resource_type,coalesce(entity_id,'*'))
where status='active';

create table if not exists public.collab_lifecycle_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  policy_code text not null,
  environment text not null default 'local',
  mode text not null default 'preview',
  status text not null default 'previewed',
  cutoff_at timestamptz not null,
  candidate_count integer not null default 0,
  affected_count integer not null default 0,
  excluded_by_hold_count integer not null default 0,
  candidate_hash text not null,
  summary jsonb not null default '{}'::jsonb,
  previewed_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  applied_by text,
  previewed_at timestamptz not null default now(),
  approved_at timestamptz,
  applied_at timestamptz,
  completed_at timestamptz,
  error_message text,
  constraint collab_lifecycle_environment_check check (
    environment in ('local','staging','production')
  ),
  constraint collab_lifecycle_mode_check check (
    mode in ('preview','apply')
  ),
  constraint collab_lifecycle_status_check check (
    status in ('previewed','awaiting-approval','approved','applying','completed','failed','cancelled')
  ),
  constraint collab_lifecycle_counts_check check (
    candidate_count>=0 and affected_count>=0 and excluded_by_hold_count>=0
  )
);

create index if not exists collab_lifecycle_runs_idx
on public.collab_lifecycle_runs(project_id,previewed_at desc);

-- Incidentes e ações corretivas.

create table if not exists public.collab_incidents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  reference text not null,
  title text not null,
  description text not null,
  category text not null,
  severity text not null,
  status text not null default 'open',
  environment text not null default 'local',
  impact_summary text,
  detected_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  mitigated_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  owner_user_id uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete restrict,
  closed_by uuid references auth.users(id) on delete set null,
  public_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id,reference),
  constraint collab_incident_category_check check (
    category in (
      'authentication','availability','data','privacy','security',
      'storage','notifications','publication','integration','content','other'
    )
  ),
  constraint collab_incident_severity_check check (
    severity in ('sev-1','sev-2','sev-3','sev-4')
  ),
  constraint collab_incident_status_check check (
    status in ('open','investigating','mitigating','monitoring','resolved','closed','cancelled')
  ),
  constraint collab_incident_environment_check check (
    environment in ('local','staging','production','external')
  )
);

create index if not exists collab_incidents_status_idx
on public.collab_incidents(project_id,status,severity,detected_at desc);

create table if not exists public.collab_incident_updates (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.collab_incidents(id) on delete cascade,
  update_type text not null,
  body text not null,
  status_after text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint collab_incident_update_type_check check (
    update_type in ('status','analysis','mitigation','communication','resolution','postmortem')
  ),
  constraint collab_incident_update_status_check check (
    status_after is null or status_after in (
      'open','investigating','mitigating','monitoring','resolved','closed','cancelled'
    )
  )
);

create table if not exists public.collab_incident_actions (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.collab_incidents(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending',
  priority text not null default 'normal',
  assigned_to uuid references auth.users(id) on delete set null,
  due_at timestamptz,
  completed_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_incident_action_status_check check (
    status in ('pending','in-progress','completed','cancelled')
  ),
  constraint collab_incident_action_priority_check check (
    priority in ('low','normal','high','urgent')
  )
);

-- Backups, verificações e exercícios.

create table if not exists public.collab_backup_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  code text not null,
  name text not null,
  backup_type text not null,
  provider text not null default 'unconfigured',
  frequency text not null default 'manual',
  retention_days integer not null default 30,
  target_rpo_minutes integer,
  target_rto_minutes integer,
  status text not null default 'draft',
  instructions_reference text,
  responsible_user_id uuid references auth.users(id) on delete set null,
  secondary_user_id uuid references auth.users(id) on delete set null,
  last_successful_at timestamptz,
  next_due_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id,code),
  constraint collab_backup_type_check check (
    backup_type in ('database','storage','code','configuration','audit-export')
  ),
  constraint collab_backup_provider_check check (
    provider in ('managed','github','manual-export','external','unconfigured')
  ),
  constraint collab_backup_frequency_check check (
    frequency in ('daily','weekly','monthly','quarterly','manual')
  ),
  constraint collab_backup_status_check check (
    status in ('draft','active','paused','retired')
  ),
  constraint collab_backup_retention_check check (
    retention_days between 1 and 3650
  )
);

create table if not exists public.collab_backup_verifications (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.collab_backup_plans(id) on delete cascade,
  status text not null default 'pending',
  backup_observed_at timestamptz,
  verified_at timestamptz not null default now(),
  restore_tested boolean not null default false,
  evidence_reference text,
  notes text,
  verified_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint collab_backup_verification_status_check check (
    status in ('pending','passed','partial','failed','expired')
  )
);

create index if not exists collab_backup_verifications_plan_idx
on public.collab_backup_verifications(plan_id,verified_at desc);

create table if not exists public.collab_continuity_exercises (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  title text not null,
  scenario text not null,
  status text not null default 'planned',
  objectives text not null,
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  target_rto_minutes integer,
  target_rpo_minutes integer,
  actual_recovery_minutes integer,
  result_summary text,
  evidence_reference text,
  coordinator_user_id uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_continuity_scenario_check check (
    scenario in (
      'database-loss','storage-loss','auth-outage','provider-outage',
      'credential-compromise','accidental-publication','data-withdrawal','other'
    )
  ),
  constraint collab_continuity_status_check check (
    status in ('planned','running','completed','cancelled')
  ),
  constraint collab_continuity_metrics_check check (
    (target_rto_minutes is null or target_rto_minutes>0)
    and (target_rpo_minutes is null or target_rpo_minutes>=0)
    and (actual_recovery_minutes is null or actual_recovery_minutes>=0)
  )
);

-- Saúde operacional.

create table if not exists public.collab_operational_check_catalog (
  code text primary key,
  category text not null,
  name text not null,
  blocking boolean not null default false,
  evidence_required boolean not null default true,
  frequency text not null default 'release',
  active boolean not null default true,
  sort_order integer not null default 0,
  constraint collab_operational_check_frequency_check check (
    frequency in ('daily','weekly','monthly','quarterly','release','manual')
  )
);

create table if not exists public.collab_operational_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  environment text not null default 'local',
  version text,
  commit_sha text,
  status text not null default 'running',
  summary text,
  started_by uuid references auth.users(id) on delete set null,
  completed_by uuid references auth.users(id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint collab_operational_run_environment_check check (
    environment in ('local','staging','production')
  ),
  constraint collab_operational_run_status_check check (
    status in ('running','passed','failed','blocked','cancelled')
  ),
  constraint collab_operational_run_commit_check check (
    commit_sha is null or commit_sha ~ '^[0-9a-fA-F]{7,64}$'
  )
);

create table if not exists public.collab_operational_results (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.collab_operational_runs(id) on delete cascade,
  check_code text not null references public.collab_operational_check_catalog(code) on delete restrict,
  status text not null default 'pending',
  evidence_reference text,
  notes text,
  checked_by uuid references auth.users(id) on delete set null,
  checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(run_id,check_code),
  constraint collab_operational_result_status_check check (
    status in ('pending','running','passed','failed','blocked','not-applicable')
  )
);

-- Updated-at triggers.

drop trigger if exists collab_operational_settings_touch_updated_at on public.collab_operational_settings;
create trigger collab_operational_settings_touch_updated_at
before update on public.collab_operational_settings
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_retention_policies_touch_updated_at on public.collab_retention_policies;
create trigger collab_retention_policies_touch_updated_at
before update on public.collab_retention_policies
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_incidents_touch_updated_at on public.collab_incidents;
create trigger collab_incidents_touch_updated_at
before update on public.collab_incidents
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_incident_actions_touch_updated_at on public.collab_incident_actions;
create trigger collab_incident_actions_touch_updated_at
before update on public.collab_incident_actions
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_backup_plans_touch_updated_at on public.collab_backup_plans;
create trigger collab_backup_plans_touch_updated_at
before update on public.collab_backup_plans
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_continuity_exercises_touch_updated_at on public.collab_continuity_exercises;
create trigger collab_continuity_exercises_touch_updated_at
before update on public.collab_continuity_exercises
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_operational_results_touch_updated_at on public.collab_operational_results;
create trigger collab_operational_results_touch_updated_at
before update on public.collab_operational_results
for each row execute function public.collab_touch_updated_at();

-- RLS.

alter table public.collab_operational_settings enable row level security;
alter table public.collab_retention_policies enable row level security;
alter table public.collab_legal_holds enable row level security;
alter table public.collab_lifecycle_runs enable row level security;
alter table public.collab_incidents enable row level security;
alter table public.collab_incident_updates enable row level security;
alter table public.collab_incident_actions enable row level security;
alter table public.collab_backup_plans enable row level security;
alter table public.collab_backup_verifications enable row level security;
alter table public.collab_continuity_exercises enable row level security;
alter table public.collab_operational_check_catalog enable row level security;
alter table public.collab_operational_runs enable row level security;
alter table public.collab_operational_results enable row level security;

grant select on public.collab_operational_settings to authenticated;
grant select on public.collab_retention_policies to authenticated;
grant select on public.collab_legal_holds to authenticated;
grant select on public.collab_lifecycle_runs to authenticated;
grant select on public.collab_incidents to authenticated;
grant select on public.collab_incident_updates to authenticated;
grant select on public.collab_incident_actions to authenticated;
grant select on public.collab_backup_plans to authenticated;
grant select on public.collab_backup_verifications to authenticated;
grant select on public.collab_continuity_exercises to authenticated;
grant select on public.collab_operational_check_catalog to authenticated;
grant select on public.collab_operational_runs to authenticated;
grant select on public.collab_operational_results to authenticated;

drop policy if exists collab_operational_settings_read on public.collab_operational_settings;
create policy collab_operational_settings_read
on public.collab_operational_settings for select to authenticated
using (
  public.collab_has_permission('operations.view',project_id)
  or public.collab_has_permission('operations.manage',project_id)
);

drop policy if exists collab_retention_policies_read on public.collab_retention_policies;
create policy collab_retention_policies_read
on public.collab_retention_policies for select to authenticated
using (public.collab_has_permission('retention.view',project_id));

drop policy if exists collab_legal_holds_read on public.collab_legal_holds;
create policy collab_legal_holds_read
on public.collab_legal_holds for select to authenticated
using (
  public.collab_has_permission('retention.view',project_id)
  or public.collab_has_permission('legal-holds.manage',project_id)
);

drop policy if exists collab_lifecycle_runs_read on public.collab_lifecycle_runs;
create policy collab_lifecycle_runs_read
on public.collab_lifecycle_runs for select to authenticated
using (public.collab_has_permission('retention.view',project_id));

drop policy if exists collab_incidents_read on public.collab_incidents;
create policy collab_incidents_read
on public.collab_incidents for select to authenticated
using (public.collab_has_permission('incidents.view',project_id));

drop policy if exists collab_incident_updates_read on public.collab_incident_updates;
create policy collab_incident_updates_read
on public.collab_incident_updates for select to authenticated
using (
  exists(
    select 1 from public.collab_incidents incident
    where incident.id=incident_id
      and public.collab_has_permission('incidents.view',incident.project_id)
  )
);

drop policy if exists collab_incident_actions_read on public.collab_incident_actions;
create policy collab_incident_actions_read
on public.collab_incident_actions for select to authenticated
using (
  exists(
    select 1 from public.collab_incidents incident
    where incident.id=incident_id
      and public.collab_has_permission('incidents.view',incident.project_id)
  )
);

drop policy if exists collab_backup_plans_read on public.collab_backup_plans;
create policy collab_backup_plans_read
on public.collab_backup_plans for select to authenticated
using (public.collab_has_permission('backups.view',project_id));

drop policy if exists collab_backup_verifications_read on public.collab_backup_verifications;
create policy collab_backup_verifications_read
on public.collab_backup_verifications for select to authenticated
using (
  exists(
    select 1 from public.collab_backup_plans plan
    where plan.id=plan_id
      and public.collab_has_permission('backups.view',plan.project_id)
  )
);

drop policy if exists collab_continuity_exercises_read on public.collab_continuity_exercises;
create policy collab_continuity_exercises_read
on public.collab_continuity_exercises for select to authenticated
using (public.collab_has_permission('continuity.view',project_id));

drop policy if exists collab_operational_check_catalog_read on public.collab_operational_check_catalog;
create policy collab_operational_check_catalog_read
on public.collab_operational_check_catalog for select to authenticated
using (public.collab_has_permission('health.view'));

drop policy if exists collab_operational_runs_read on public.collab_operational_runs;
create policy collab_operational_runs_read
on public.collab_operational_runs for select to authenticated
using (public.collab_has_permission('health.view',project_id));

drop policy if exists collab_operational_results_read on public.collab_operational_results;
create policy collab_operational_results_read
on public.collab_operational_results for select to authenticated
using (
  exists(
    select 1 from public.collab_operational_runs run
    where run.id=run_id
      and public.collab_has_permission('health.view',run.project_id)
  )
);
