-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08D — agenda, locais e exposição itinerante.

create extension if not exists btree_gist;

alter table public.collab_venues
  add column if not exists slug text,
  add column if not exists country_code text not null default 'PT',
  add column if not exists postal_code text,
  add column if not exists public_email text,
  add column if not exists public_phone text,
  add column if not exists public_url text,
  add column if not exists opening_hours text,
  add column if not exists public_description text,
  add column if not exists accessibility_summary text,
  add column if not exists status text not null default 'draft',
  add column if not exists public_visibility boolean not null default false,
  add column if not exists archived_at timestamptz;

alter table public.collab_venues
  drop constraint if exists collab_venues_status_check;

alter table public.collab_venues
  add constraint collab_venues_status_check
  check (status in ('draft','active','archived'));

create unique index if not exists collab_venues_project_slug_unique
on public.collab_venues(project_id,slug)
where slug is not null;

alter table public.collab_exhibitions
  add column if not exists slug text,
  add column if not exists subtitle text,
  add column if not exists public_summary text,
  add column if not exists internal_objectives text,
  add column if not exists default_duration_days integer,
  add column if not exists public_visibility boolean not null default false,
  add column if not exists published_at timestamptz,
  add column if not exists archived_at timestamptz;

alter table public.collab_exhibitions
  drop constraint if exists collab_exhibitions_status_check;

alter table public.collab_exhibitions
  add constraint collab_exhibitions_status_check
  check (status in ('planning','ready','active','paused','completed','cancelled','archived'));

alter table public.collab_exhibitions
  drop constraint if exists collab_exhibitions_default_duration_check;

alter table public.collab_exhibitions
  add constraint collab_exhibitions_default_duration_check
  check (default_duration_days is null or default_duration_days > 0);

create unique index if not exists collab_exhibitions_project_slug_unique
on public.collab_exhibitions(project_id,slug)
where slug is not null;

alter table public.collab_exhibition_schedule
  add column if not exists slug text,
  add column if not exists public_title text,
  add column if not exists public_summary text,
  add column if not exists public_visibility boolean not null default false,
  add column if not exists published_at timestamptz,
  add column if not exists opening_hours text,
  add column if not exists public_contact text,
  add column if not exists registration_url text,
  add column if not exists installation_status text not null default 'not-started',
  add column if not exists logistics_status text not null default 'not-started',
  add column if not exists transport_notes text,
  add column if not exists condition_report_before text,
  add column if not exists condition_report_after text,
  add column if not exists archived_at timestamptz;

alter table public.collab_exhibition_schedule
  drop constraint if exists collab_exhibition_schedule_installation_status_check;

alter table public.collab_exhibition_schedule
  add constraint collab_exhibition_schedule_installation_status_check
  check (installation_status in ('not-started','preparing','installed','checked','dismantled'));

alter table public.collab_exhibition_schedule
  drop constraint if exists collab_exhibition_schedule_logistics_status_check;

alter table public.collab_exhibition_schedule
  add constraint collab_exhibition_schedule_logistics_status_check
  check (logistics_status in ('not-started','in-progress','ready','completed','blocked'));

create unique index if not exists collab_exhibition_schedule_project_slug_unique
on public.collab_exhibition_schedule(project_id,slug)
where slug is not null;

alter table public.collab_exhibition_schedule
  drop constraint if exists collab_exhibition_schedule_no_overlap;

alter table public.collab_exhibition_schedule
  add constraint collab_exhibition_schedule_no_overlap
  exclude using gist (
    exhibition_id with =,
    daterange(starts_on,ends_on,'[]') with &&
  )
  where (status <> 'cancelled');

alter table public.collab_tasks
  add column if not exists source_entity_type text,
  add column if not exists source_entity_id uuid;

create unique index if not exists collab_tasks_source_unique
on public.collab_tasks(project_id,source_entity_type,source_entity_id,title)
where source_entity_type is not null and source_entity_id is not null;

create table if not exists public.collab_agenda_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  exhibition_schedule_id uuid references public.collab_exhibition_schedule(id) on delete cascade,
  task_id uuid references public.collab_tasks(id) on delete set null,
  venue_id uuid references public.collab_venues(id) on delete set null,
  title text not null,
  description text,
  event_type text not null default 'other',
  status text not null default 'draft',
  visibility text not null default 'members',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location_text text,
  capacity integer,
  registration_required boolean not null default false,
  registration_url text,
  public_contact text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_agenda_events_dates check (ends_at > starts_at),
  constraint collab_agenda_events_capacity check (capacity is null or capacity > 0),
  constraint collab_agenda_events_type_check check (
    event_type in (
      'meeting','workshop','visit','talk','collection-session',
      'installation','dismantling','opening','volunteer-action','other'
    )
  ),
  constraint collab_agenda_events_status_check check (
    status in ('draft','planned','confirmed','completed','cancelled')
  ),
  constraint collab_agenda_events_visibility_check check (
    visibility in ('internal','members','public')
  )
);

create index if not exists collab_agenda_events_dates_idx
on public.collab_agenda_events(project_id,starts_at,ends_at);

create index if not exists collab_agenda_events_schedule_idx
on public.collab_agenda_events(exhibition_schedule_id);

create table if not exists public.collab_event_participants (
  event_id uuid not null references public.collab_agenda_events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'interested',
  notes text,
  responded_at timestamptz not null default now(),
  checked_in_at timestamptz,
  primary key (event_id,user_id),
  constraint collab_event_participants_status_check check (
    status in ('interested','attending','not-attending','waitlist','attended','cancelled')
  )
);

create index if not exists collab_event_participants_user_idx
on public.collab_event_participants(user_id,status);

create table if not exists public.collab_exhibition_logistics_checklist (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  schedule_id uuid not null references public.collab_exhibition_schedule(id) on delete cascade,
  category text not null default 'other',
  title text not null,
  description text,
  status text not null default 'pending',
  assigned_to uuid references auth.users(id) on delete set null,
  due_at timestamptz,
  completed_at timestamptz,
  completed_by uuid references auth.users(id) on delete set null,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_exhibition_checklist_category_check check (
    category in ('transport','installation','materials','accessibility','communication','insurance','condition','other')
  ),
  constraint collab_exhibition_checklist_status_check check (
    status in ('pending','in-progress','completed','blocked','cancelled')
  )
);

create index if not exists collab_exhibition_checklist_schedule_idx
on public.collab_exhibition_logistics_checklist(schedule_id,status,sort_order);

drop trigger if exists collab_agenda_events_touch_updated_at on public.collab_agenda_events;
create trigger collab_agenda_events_touch_updated_at
before update on public.collab_agenda_events
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_exhibition_checklist_touch_updated_at on public.collab_exhibition_logistics_checklist;
create trigger collab_exhibition_checklist_touch_updated_at
before update on public.collab_exhibition_logistics_checklist
for each row execute function public.collab_touch_updated_at();

alter table public.collab_agenda_events enable row level security;
alter table public.collab_event_participants enable row level security;
alter table public.collab_exhibition_logistics_checklist enable row level security;

grant select on public.collab_venues to anon,authenticated;
grant select on public.collab_exhibitions to anon,authenticated;
grant select on public.collab_exhibition_schedule to anon,authenticated;
grant select on public.collab_agenda_events to anon,authenticated;

grant insert,update,delete on public.collab_venues to authenticated;
grant insert,update,delete on public.collab_exhibitions to authenticated;
grant insert,update,delete on public.collab_exhibition_schedule to authenticated;
grant insert,update,delete on public.collab_agenda_events to authenticated;
grant select,insert,update,delete on public.collab_event_participants to authenticated;
grant select,insert,update,delete on public.collab_exhibition_logistics_checklist to authenticated;

drop policy if exists collab_venues_public_read on public.collab_venues;
create policy collab_venues_public_read
on public.collab_venues for select to anon,authenticated
using (
  public_visibility
  and status='active'
);

drop policy if exists collab_venues_internal_read_08d on public.collab_venues;
create policy collab_venues_internal_read_08d
on public.collab_venues for select to authenticated
using (
  project_id=public.collab_project_id()
  and (
    public.collab_has_permission('agenda.view',project_id)
    or public.collab_has_permission('venues.manage',project_id)
    or public.collab_has_permission('exhibitions.manage',project_id)
  )
);

drop policy if exists collab_venues_manage_08d on public.collab_venues;
create policy collab_venues_manage_08d
on public.collab_venues for all to authenticated
using (public.collab_has_permission('venues.manage',project_id))
with check (public.collab_has_permission('venues.manage',project_id));

drop policy if exists collab_exhibitions_public_read on public.collab_exhibitions;
create policy collab_exhibitions_public_read
on public.collab_exhibitions for select to anon,authenticated
using (
  public_visibility
  and published_at is not null
  and status in ('ready','active','completed')
);

drop policy if exists collab_exhibitions_internal_read_08d on public.collab_exhibitions;
create policy collab_exhibitions_internal_read_08d
on public.collab_exhibitions for select to authenticated
using (
  project_id=public.collab_project_id()
  and (
    public.collab_has_permission('agenda.view',project_id)
    or public.collab_has_permission('exhibitions.view-internal',project_id)
    or public.collab_has_permission('exhibitions.manage',project_id)
  )
);

drop policy if exists collab_exhibitions_manage_08d on public.collab_exhibitions;
create policy collab_exhibitions_manage_08d
on public.collab_exhibitions for all to authenticated
using (public.collab_has_permission('exhibitions.manage',project_id))
with check (public.collab_has_permission('exhibitions.manage',project_id));

drop policy if exists collab_exhibition_schedule_public_read on public.collab_exhibition_schedule;
create policy collab_exhibition_schedule_public_read
on public.collab_exhibition_schedule for select to anon,authenticated
using (
  public_visibility
  and published_at is not null
  and status in ('confirmed','installed','open','closed')
);

drop policy if exists collab_exhibition_schedule_internal_read_08d on public.collab_exhibition_schedule;
create policy collab_exhibition_schedule_internal_read_08d
on public.collab_exhibition_schedule for select to authenticated
using (
  project_id=public.collab_project_id()
  and (
    public.collab_has_permission('agenda.view',project_id)
    or public.collab_has_permission('exhibitions.view-internal',project_id)
    or public.collab_has_permission('exhibitions.manage',project_id)
  )
);

drop policy if exists collab_exhibition_schedule_manage_08d on public.collab_exhibition_schedule;
create policy collab_exhibition_schedule_manage_08d
on public.collab_exhibition_schedule for all to authenticated
using (public.collab_has_permission('exhibitions.manage',project_id))
with check (public.collab_has_permission('exhibitions.manage',project_id));

drop policy if exists collab_agenda_events_public_read on public.collab_agenda_events;
create policy collab_agenda_events_public_read
on public.collab_agenda_events for select to anon,authenticated
using (
  visibility='public'
  and status in ('confirmed','completed')
);

drop policy if exists collab_agenda_events_member_read on public.collab_agenda_events;
create policy collab_agenda_events_member_read
on public.collab_agenda_events for select to authenticated
using (
  project_id=public.collab_project_id()
  and (
    (visibility in ('members','public') and public.collab_has_permission('agenda.view',project_id))
    or public.collab_has_permission('agenda.manage',project_id)
  )
);

drop policy if exists collab_agenda_events_manage on public.collab_agenda_events;
create policy collab_agenda_events_manage
on public.collab_agenda_events for all to authenticated
using (public.collab_has_permission('agenda.manage',project_id))
with check (public.collab_has_permission('agenda.manage',project_id));

drop policy if exists collab_event_participants_read on public.collab_event_participants;
create policy collab_event_participants_read
on public.collab_event_participants for select to authenticated
using (
  user_id=auth.uid()
  or exists(
    select 1 from public.collab_agenda_events event
    where event.id=event_id
      and public.collab_has_permission('agenda.manage',event.project_id)
  )
);

drop policy if exists collab_event_participants_self_write on public.collab_event_participants;
create policy collab_event_participants_self_write
on public.collab_event_participants for all to authenticated
using (user_id=auth.uid())
with check (
  user_id=auth.uid()
  and exists(
    select 1 from public.collab_agenda_events event
    where event.id=event_id
      and event.status='confirmed'
      and event.visibility in ('members','public')
      and public.collab_has_permission('agenda.rsvp',event.project_id)
  )
);

drop policy if exists collab_event_participants_manage on public.collab_event_participants;
create policy collab_event_participants_manage
on public.collab_event_participants for all to authenticated
using (
  exists(
    select 1 from public.collab_agenda_events event
    where event.id=event_id
      and public.collab_has_permission('agenda.manage',event.project_id)
  )
)
with check (
  exists(
    select 1 from public.collab_agenda_events event
    where event.id=event_id
      and public.collab_has_permission('agenda.manage',event.project_id)
  )
);

drop policy if exists collab_exhibition_checklist_read on public.collab_exhibition_logistics_checklist;
create policy collab_exhibition_checklist_read
on public.collab_exhibition_logistics_checklist for select to authenticated
using (
  project_id=public.collab_project_id()
  and (
    public.collab_has_permission('exhibitions.logistics',project_id)
    or public.collab_has_permission('exhibitions.manage',project_id)
  )
);

drop policy if exists collab_exhibition_checklist_manage on public.collab_exhibition_logistics_checklist;
create policy collab_exhibition_checklist_manage
on public.collab_exhibition_logistics_checklist for all to authenticated
using (
  public.collab_has_permission('exhibitions.logistics',project_id)
  or public.collab_has_permission('exhibitions.manage',project_id)
)
with check (
  public.collab_has_permission('exhibitions.logistics',project_id)
  or public.collab_has_permission('exhibitions.manage',project_id)
);
