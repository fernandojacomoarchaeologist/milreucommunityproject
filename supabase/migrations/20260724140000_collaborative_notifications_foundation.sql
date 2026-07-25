-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08H — notificações, comunicação transacional e operação.

create table if not exists public.collab_notification_channels (
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  channel text not null,
  status text not null default 'disabled',
  provider text not null default 'disabled',
  from_name text,
  from_email text,
  settings jsonb not null default '{}'::jsonb,
  tested_at timestamptz,
  tested_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key(project_id,channel),
  constraint collab_notification_channel_check check (
    channel in ('in-app','email')
  ),
  constraint collab_notification_channel_status_check check (
    status in ('disabled','testing','active','paused')
  ),
  constraint collab_notification_provider_check check (
    provider in ('disabled','webhook')
  ),
  constraint collab_notification_email_provider_check check (
    channel='email' or provider='disabled'
  )
);

create table if not exists public.collab_notification_event_types (
  code text primary key,
  category text not null,
  name text not null,
  severity text not null default 'info',
  mandatory_in_app boolean not null default false,
  email_allowed boolean not null default true,
  default_email boolean not null default false,
  retention_days integer not null default 365,
  route_template text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint collab_notification_event_category_check check (
    category in (
      'membership','tasks','contributions','museum-review','training',
      'agenda','exhibitions','withdrawals','security','operations'
    )
  ),
  constraint collab_notification_event_severity_check check (
    severity in ('info','success','warning','critical')
  ),
  constraint collab_notification_retention_check check (
    retention_days between 30 and 3650
  )
);

create table if not exists public.collab_notification_templates (
  id uuid primary key default gen_random_uuid(),
  event_type text not null references public.collab_notification_event_types(code) on delete cascade,
  channel text not null,
  language text not null default 'pt-PT',
  version integer not null default 1,
  status text not null default 'draft',
  subject_template text,
  title_template text not null,
  body_text_template text not null,
  allowed_tokens text[] not null default '{}'::text[],
  created_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_type,channel,language,version),
  constraint collab_notification_template_channel_check check (
    channel in ('in-app','email')
  ),
  constraint collab_notification_template_status_check check (
    status in ('draft','review','approved','retired')
  ),
  constraint collab_notification_template_version_check check (version>0),
  constraint collab_notification_template_email_subject_check check (
    channel<>'email' or nullif(trim(subject_template),'') is not null
  )
);

create unique index if not exists collab_notification_template_approved_unique
on public.collab_notification_templates(event_type,channel,language)
where status='approved';

create table if not exists public.collab_notification_preferences (
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null references public.collab_notification_event_types(code) on delete cascade,
  in_app_enabled boolean not null default true,
  email_enabled boolean not null default false,
  quiet_hours_start time,
  quiet_hours_end time,
  timezone text not null default 'Europe/Lisbon',
  language text not null default 'pt-PT',
  updated_at timestamptz not null default now(),
  primary key(project_id,user_id,event_type),
  constraint collab_notification_quiet_hours_pair_check check (
    (quiet_hours_start is null and quiet_hours_end is null)
    or (quiet_hours_start is not null and quiet_hours_end is not null)
  )
);

create index if not exists collab_notification_preferences_user_idx
on public.collab_notification_preferences(user_id,event_type);

create table if not exists public.collab_notifications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null references public.collab_notification_event_types(code) on delete restrict,
  entity_type text,
  entity_id text,
  title text not null,
  body text not null,
  action_url text,
  severity text not null default 'info',
  status text not null default 'unread',
  metadata jsonb not null default '{}'::jsonb,
  dedupe_key text,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  archived_at timestamptz,
  expires_at timestamptz,
  constraint collab_notifications_severity_check check (
    severity in ('info','success','warning','critical')
  ),
  constraint collab_notifications_status_check check (
    status in ('unread','read','archived')
  ),
  constraint collab_notifications_read_check check (
    (status='unread' and read_at is null and archived_at is null)
    or (status='read' and read_at is not null and archived_at is null)
    or (status='archived' and archived_at is not null)
  )
);

create unique index if not exists collab_notifications_dedupe_unique
on public.collab_notifications(project_id,user_id,dedupe_key)
where dedupe_key is not null;

create index if not exists collab_notifications_inbox_idx
on public.collab_notifications(user_id,status,created_at desc);

create index if not exists collab_notifications_expiry_idx
on public.collab_notifications(expires_at)
where expires_at is not null;

create table if not exists public.collab_notification_outbox (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  notification_id uuid references public.collab_notifications(id) on delete set null,
  event_type text not null references public.collab_notification_event_types(code) on delete restrict,
  template_id uuid not null references public.collab_notification_templates(id) on delete restrict,
  recipient_kind text not null,
  recipient_user_id uuid references auth.users(id) on delete cascade,
  recipient_email text,
  payload jsonb not null default '{}'::jsonb,
  dedupe_key text,
  status text not null default 'pending',
  available_at timestamptz not null default now(),
  claimed_at timestamptz,
  claimed_by text,
  attempts integer not null default 0,
  max_attempts integer not null default 5,
  last_error text,
  delivered_at timestamptz,
  external_id text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_notification_outbox_recipient_kind_check check (
    recipient_kind in ('user','email')
  ),
  constraint collab_notification_outbox_recipient_check check (
    (recipient_kind='user' and recipient_user_id is not null and recipient_email is null)
    or (recipient_kind='email' and recipient_user_id is null and recipient_email is not null)
  ),
  constraint collab_notification_outbox_status_check check (
    status in ('pending','claimed','delivered','failed','cancelled','dead-letter')
  ),
  constraint collab_notification_outbox_attempts_check check (
    attempts>=0 and max_attempts between 1 and 20 and attempts<=max_attempts
  ),
  constraint collab_notification_outbox_email_lower check (
    recipient_email is null or recipient_email=lower(recipient_email)
  )
);

create unique index if not exists collab_notification_outbox_dedupe_unique
on public.collab_notification_outbox(project_id,dedupe_key)
where dedupe_key is not null;

create index if not exists collab_notification_outbox_queue_idx
on public.collab_notification_outbox(status,available_at,created_at)
where status in ('pending','failed','claimed');

create table if not exists public.collab_notification_deliveries (
  id bigint generated always as identity primary key,
  outbox_id uuid not null references public.collab_notification_outbox(id) on delete cascade,
  attempt_number integer not null,
  status text not null,
  provider text not null,
  provider_status_code integer,
  external_id text,
  response_excerpt text,
  error_code text,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  constraint collab_notification_delivery_status_check check (
    status in ('started','delivered','failed','skipped')
  ),
  constraint collab_notification_delivery_attempt_check check (attempt_number>0)
);

create index if not exists collab_notification_deliveries_outbox_idx
on public.collab_notification_deliveries(outbox_id,attempt_number desc);

drop trigger if exists collab_notification_channels_touch_updated_at on public.collab_notification_channels;
create trigger collab_notification_channels_touch_updated_at
before update on public.collab_notification_channels
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_notification_templates_touch_updated_at on public.collab_notification_templates;
create trigger collab_notification_templates_touch_updated_at
before update on public.collab_notification_templates
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_notification_preferences_touch_updated_at on public.collab_notification_preferences;
create trigger collab_notification_preferences_touch_updated_at
before update on public.collab_notification_preferences
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_notification_outbox_touch_updated_at on public.collab_notification_outbox;
create trigger collab_notification_outbox_touch_updated_at
before update on public.collab_notification_outbox
for each row execute function public.collab_touch_updated_at();

alter table public.collab_notification_channels enable row level security;
alter table public.collab_notification_event_types enable row level security;
alter table public.collab_notification_templates enable row level security;
alter table public.collab_notification_preferences enable row level security;
alter table public.collab_notifications enable row level security;
alter table public.collab_notification_outbox enable row level security;
alter table public.collab_notification_deliveries enable row level security;

grant select on public.collab_notification_channels to authenticated;
grant select on public.collab_notification_event_types to authenticated;
grant select on public.collab_notification_templates to authenticated;
grant select on public.collab_notification_preferences to authenticated;
grant select on public.collab_notifications to authenticated;

drop policy if exists collab_notification_channels_read on public.collab_notification_channels;
create policy collab_notification_channels_read
on public.collab_notification_channels for select to authenticated
using (
  public.collab_has_permission('notifications.view',project_id)
  or public.collab_has_permission('notifications.manage',project_id)
);

drop policy if exists collab_notification_event_types_read on public.collab_notification_event_types;
create policy collab_notification_event_types_read
on public.collab_notification_event_types for select to authenticated
using (public.collab_has_permission('notifications.view'));

drop policy if exists collab_notification_templates_read on public.collab_notification_templates;
create policy collab_notification_templates_read
on public.collab_notification_templates for select to authenticated
using (
  (status='approved' and public.collab_has_permission('notifications.view'))
  or public.collab_has_permission('notifications.templates.manage')
);

drop policy if exists collab_notification_preferences_read on public.collab_notification_preferences;
create policy collab_notification_preferences_read
on public.collab_notification_preferences for select to authenticated
using (user_id=auth.uid());

drop policy if exists collab_notifications_read on public.collab_notifications;
create policy collab_notifications_read
on public.collab_notifications for select to authenticated
using (user_id=auth.uid());
