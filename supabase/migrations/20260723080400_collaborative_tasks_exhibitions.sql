-- Esqueletos de tarefas, locais e agenda de exposições.
-- As tabelas são funcionais, mas os módulos completos serão entregues em pacotes posteriores.

create table if not exists public.collab_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  title text not null,
  description text,
  category text,
  status text not null default 'draft' check (status in ('draft','open','in-progress','completed','cancelled')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  due_at timestamptz,
  capacity integer check (capacity is null or capacity > 0),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collab_task_assignments (
  task_id uuid not null references public.collab_tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'assigned' check (status in ('assigned','accepted','declined','completed','cancelled')),
  assigned_at timestamptz not null default now(),
  accepted_at timestamptz,
  completed_at timestamptz,
  notes text,
  primary key (task_id,user_id)
);

create table if not exists public.collab_venues (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  name text not null,
  venue_type text not null default 'other' check (venue_type in ('museum','school','library','cultural-centre','public-space','university','other')),
  municipality text,
  locality text,
  address_text text,
  contact_name text,
  contact_email text,
  accessibility_notes text,
  internal_notes text,
  active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collab_exhibitions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  title text not null,
  exhibition_type text not null default 'itinerant' check (exhibition_type in ('fixed','itinerant','temporary','digital')),
  description text,
  status text not null default 'planning' check (status in ('planning','ready','active','paused','completed','cancelled')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collab_exhibition_schedule (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  exhibition_id uuid not null references public.collab_exhibitions(id) on delete cascade,
  venue_id uuid not null references public.collab_venues(id) on delete restrict,
  starts_on date not null,
  ends_on date not null,
  status text not null default 'planned' check (status in ('planned','confirmed','installed','open','closed','cancelled')),
  installation_at timestamptz,
  dismantling_at timestamptz,
  public_notes text,
  internal_notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_exhibition_schedule_dates check (ends_on >= starts_on)
);

create index if not exists collab_tasks_status_due_idx
on public.collab_tasks(project_id,status,due_at);

create index if not exists collab_exhibition_schedule_dates_idx
on public.collab_exhibition_schedule(project_id,starts_on,ends_on);

drop trigger if exists collab_tasks_touch_updated_at on public.collab_tasks;
create trigger collab_tasks_touch_updated_at
before update on public.collab_tasks
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_venues_touch_updated_at on public.collab_venues;
create trigger collab_venues_touch_updated_at
before update on public.collab_venues
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_exhibitions_touch_updated_at on public.collab_exhibitions;
create trigger collab_exhibitions_touch_updated_at
before update on public.collab_exhibitions
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_exhibition_schedule_touch_updated_at on public.collab_exhibition_schedule;
create trigger collab_exhibition_schedule_touch_updated_at
before update on public.collab_exhibition_schedule
for each row execute function public.collab_touch_updated_at();

alter table public.collab_tasks enable row level security;
alter table public.collab_task_assignments enable row level security;
alter table public.collab_venues enable row level security;
alter table public.collab_exhibitions enable row level security;
alter table public.collab_exhibition_schedule enable row level security;

grant select on public.collab_tasks to authenticated;
grant select,insert,update on public.collab_task_assignments to authenticated;
grant select on public.collab_venues to authenticated;
grant select on public.collab_exhibitions to authenticated;
grant select on public.collab_exhibition_schedule to authenticated;

grant insert,update,delete on public.collab_tasks to authenticated;
grant insert,update,delete on public.collab_venues to authenticated;
grant insert,update,delete on public.collab_exhibitions to authenticated;
grant insert,update,delete on public.collab_exhibition_schedule to authenticated;

drop policy if exists collab_tasks_read on public.collab_tasks;
create policy collab_tasks_read
on public.collab_tasks for select to authenticated
using (
  project_id=public.collab_project_id()
  and public.collab_has_permission('tasks.view',project_id)
);

drop policy if exists collab_tasks_manage on public.collab_tasks;
create policy collab_tasks_manage
on public.collab_tasks for all to authenticated
using (public.collab_has_permission('tasks.manage',project_id))
with check (public.collab_has_permission('tasks.manage',project_id));

drop policy if exists collab_task_assignments_read on public.collab_task_assignments;
create policy collab_task_assignments_read
on public.collab_task_assignments for select to authenticated
using (
  user_id=auth.uid()
  or exists(
    select 1 from public.collab_tasks t
    where t.id=task_id and public.collab_has_permission('tasks.manage',t.project_id)
  )
);

drop policy if exists collab_task_assignments_self_update on public.collab_task_assignments;
create policy collab_task_assignments_self_update
on public.collab_task_assignments for update to authenticated
using (
  user_id=auth.uid()
  or exists(
    select 1 from public.collab_tasks t
    where t.id=task_id and public.collab_has_permission('tasks.manage',t.project_id)
  )
)
with check (
  user_id=auth.uid()
  or exists(
    select 1 from public.collab_tasks t
    where t.id=task_id and public.collab_has_permission('tasks.manage',t.project_id)
  )
);

drop policy if exists collab_task_assignments_manage_insert on public.collab_task_assignments;
create policy collab_task_assignments_manage_insert
on public.collab_task_assignments for insert to authenticated
with check (
  exists(
    select 1 from public.collab_tasks t
    where t.id=task_id and public.collab_has_permission('tasks.manage',t.project_id)
  )
);

drop policy if exists collab_venues_read on public.collab_venues;
create policy collab_venues_read
on public.collab_venues for select to authenticated
using (
  project_id=public.collab_project_id()
  and public.collab_has_permission('agenda.view',project_id)
);

drop policy if exists collab_venues_manage on public.collab_venues;
create policy collab_venues_manage
on public.collab_venues for all to authenticated
using (public.collab_has_permission('exhibitions.manage',project_id))
with check (public.collab_has_permission('exhibitions.manage',project_id));

drop policy if exists collab_exhibitions_read on public.collab_exhibitions;
create policy collab_exhibitions_read
on public.collab_exhibitions for select to authenticated
using (
  project_id=public.collab_project_id()
  and public.collab_has_permission('agenda.view',project_id)
);

drop policy if exists collab_exhibitions_manage on public.collab_exhibitions;
create policy collab_exhibitions_manage
on public.collab_exhibitions for all to authenticated
using (public.collab_has_permission('exhibitions.manage',project_id))
with check (public.collab_has_permission('exhibitions.manage',project_id));

drop policy if exists collab_exhibition_schedule_read on public.collab_exhibition_schedule;
create policy collab_exhibition_schedule_read
on public.collab_exhibition_schedule for select to authenticated
using (
  project_id=public.collab_project_id()
  and public.collab_has_permission('agenda.view',project_id)
);

drop policy if exists collab_exhibition_schedule_manage on public.collab_exhibition_schedule;
create policy collab_exhibition_schedule_manage
on public.collab_exhibition_schedule for all to authenticated
using (public.collab_has_permission('exhibitions.manage',project_id))
with check (public.collab_has_permission('exhibitions.manage',project_id));
