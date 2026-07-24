-- 08C — Voluntariado, disponibilidade e modelo operacional de tarefas.

insert into public.collab_permissions(code,name,description) values
('availability.self.manage','Gerir disponibilidade própria','Registar disponibilidade semanal e preferências de colaboração.'),
('tasks.apply','Candidatar-se a tarefas','Aderir a oportunidades abertas ou enviar candidatura.'),
('tasks.progress','Atualizar progresso','Iniciar, submeter ou desistir de tarefas próprias.'),
('tasks.time-log','Registar tempo','Registar tempo dedicado a tarefas próprias.'),
('tasks.assign','Atribuir tarefas','Convidar, aceitar ou recusar membros em tarefas.'),
('tasks.verify','Validar conclusão','Validar entregas e registos de tempo.'),
('tasks.cancel','Cancelar tarefas','Cancelar ou arquivar tarefas.'),
('tasks.audit.view','Consultar histórico de tarefas','Consultar atividade e decisões associadas às tarefas.')
on conflict(code) do update set name=excluded.name,description=excluded.description;

insert into public.collab_role_permissions(role_code,permission_code)
select 'master',code from public.collab_permissions
on conflict do nothing;

insert into public.collab_role_permissions(role_code,permission_code) values
('coordinator','availability.self.manage'),('coordinator','tasks.apply'),
('coordinator','tasks.progress'),('coordinator','tasks.time-log'),
('coordinator','tasks.assign'),('coordinator','tasks.verify'),
('coordinator','tasks.cancel'),('coordinator','tasks.audit.view'),
('volunteer','availability.self.manage'),('volunteer','tasks.apply'),
('volunteer','tasks.progress'),('volunteer','tasks.time-log'),
('researcher','availability.self.manage'),('researcher','tasks.apply'),
('researcher','tasks.progress'),('researcher','tasks.time-log'),
('translator','availability.self.manage'),('translator','tasks.apply'),
('translator','tasks.progress'),('translator','tasks.time-log'),
('reviewer','availability.self.manage'),('reviewer','tasks.apply'),
('reviewer','tasks.progress'),('reviewer','tasks.time-log')
on conflict do nothing;

create table if not exists public.collab_task_categories (
  code text primary key,
  name text not null,
  description text,
  active boolean not null default true,
  sort_order integer not null default 0
);

insert into public.collab_task_categories(code,name,description,sort_order) values
('digitisation','Fotografia e digitalização','Digitalização, organização e verificação técnica de imagens.',10),
('transcription','Transcrição','Transcrição e revisão de entrevistas, testemunhos e documentos.',20),
('oral-history','História oral','Preparação, apoio e documentação de recolhas orais.',30),
('historical-research','Pesquisa histórica','Pesquisa de fontes, referências, cronologias e proveniência.',40),
('cataloguing','Catalogação','Descrição, metadados, relações e normalização de registos.',50),
('translation','Tradução','Tradução e revisão linguística de conteúdos aprovados.',60),
('communication','Comunicação','Preparação de materiais, divulgação e apoio editorial.',70),
('survey','Inquéritos e dados','Apoio a inquéritos, tratamento e verificação de dados.',80),
('event-support','Apoio a eventos','Receção, orientação, registo e apoio ao público.',90),
('exhibition-setup','Montagem de exposição','Montagem, desmontagem, acondicionamento e verificação.',100),
('logistics','Apoio logístico','Transporte, materiais, organização e coordenação prática.',110),
('accessibility','Acessibilidade','Revisão de acessibilidade digital, textual ou física.',120),
('other','Outra atividade','Atividade que não se enquadra nas categorias anteriores.',130)
on conflict(code) do update set name=excluded.name,description=excluded.description,sort_order=excluded.sort_order;

alter table public.collab_tasks
  add column if not exists summary text,
  add column if not exists instructions text,
  add column if not exists category_code text references public.collab_task_categories(code),
  add column if not exists assignment_mode text not null default 'approval',
  add column if not exists location_mode text not null default 'flexible',
  add column if not exists location_name text,
  add column if not exists municipality text,
  add column if not exists starts_at timestamptz,
  add column if not exists application_deadline timestamptz,
  add column if not exists estimated_minutes integer,
  add column if not exists minimum_participants integer not null default 1,
  add column if not exists visibility text not null default 'members',
  add column if not exists recognition_eligible boolean not null default false,
  add column if not exists updated_by uuid references auth.users(id),
  add column if not exists archived_at timestamptz;

update public.collab_tasks
set category_code=case
  when category in ('digitisation','transcription','oral-history','historical-research','cataloguing','translation','communication','survey','event-support','exhibition-setup','logistics','accessibility','other') then category
  else 'other'
end
where category_code is null;

alter table public.collab_tasks alter column category_code set default 'other';
alter table public.collab_tasks alter column category_code set not null;
alter table public.collab_tasks drop constraint if exists collab_tasks_status_check;
alter table public.collab_tasks add constraint collab_tasks_status_check
  check(status in ('draft','open','in-progress','completed','cancelled','archived'));
alter table public.collab_tasks drop constraint if exists collab_tasks_assignment_mode_check;
alter table public.collab_tasks add constraint collab_tasks_assignment_mode_check
  check(assignment_mode in ('open','approval','direct'));
alter table public.collab_tasks drop constraint if exists collab_tasks_location_mode_check;
alter table public.collab_tasks add constraint collab_tasks_location_mode_check
  check(location_mode in ('remote','on-site','hybrid','flexible'));
alter table public.collab_tasks drop constraint if exists collab_tasks_visibility_check;
alter table public.collab_tasks add constraint collab_tasks_visibility_check
  check(visibility in ('members','targeted'));
alter table public.collab_tasks drop constraint if exists collab_tasks_estimated_minutes_check;
alter table public.collab_tasks add constraint collab_tasks_estimated_minutes_check
  check(estimated_minutes is null or estimated_minutes > 0);
alter table public.collab_tasks drop constraint if exists collab_tasks_participants_check;
alter table public.collab_tasks add constraint collab_tasks_participants_check
  check(minimum_participants > 0 and (capacity is null or capacity >= minimum_participants));
alter table public.collab_tasks drop constraint if exists collab_tasks_dates_check;
alter table public.collab_tasks add constraint collab_tasks_dates_check
  check(
    (starts_at is null or due_at is null or due_at >= starts_at)
    and (application_deadline is null or due_at is null or application_deadline <= due_at)
  );

alter table public.collab_task_assignments drop constraint if exists collab_task_assignments_status_check;
update public.collab_task_assignments set status='invited' where status='assigned';
alter table public.collab_task_assignments alter column status set default 'invited';
alter table public.collab_task_assignments add constraint collab_task_assignments_status_check
  check(status in ('invited','applied','accepted','declined','in-progress','submitted','completed','withdrawn','cancelled'));
alter table public.collab_task_assignments
  add column if not exists assigned_by uuid references auth.users(id),
  add column if not exists applied_at timestamptz,
  add column if not exists declined_at timestamptz,
  add column if not exists started_at timestamptz,
  add column if not exists submitted_at timestamptz,
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid references auth.users(id),
  add column if not exists withdrawn_at timestamptz,
  add column if not exists application_note text,
  add column if not exists manager_note text,
  add column if not exists completion_note text,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.collab_task_required_skills (
  task_id uuid not null references public.collab_tasks(id) on delete cascade,
  skill_code text not null references public.collab_skill_catalog(code) on delete cascade,
  required boolean not null default false,
  created_at timestamptz not null default now(),
  primary key(task_id,skill_code)
);

create table if not exists public.collab_volunteer_preferences (
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  preferred_modes text[] not null default array['remote','on-site']::text[],
  maximum_weekly_minutes integer,
  availability_notes text,
  timezone text not null default 'Europe/Lisbon',
  updated_at timestamptz not null default now(),
  primary key(project_id,user_id),
  constraint collab_volunteer_preferences_minutes_check check(maximum_weekly_minutes is null or maximum_weekly_minutes > 0),
  constraint collab_volunteer_preferences_modes_check check(preferred_modes <@ array['remote','on-site','hybrid']::text[])
);

create table if not exists public.collab_member_availability (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  day_of_week smallint not null check(day_of_week between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  mode text not null default 'hybrid' check(mode in ('remote','on-site','hybrid')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_member_availability_time_check check(ends_at > starts_at)
);

create unique index if not exists collab_member_availability_unique_slot
on public.collab_member_availability(project_id,user_id,day_of_week,starts_at,ends_at,mode)
where active;

create table if not exists public.collab_task_time_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  task_id uuid not null references public.collab_tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default current_date,
  minutes integer not null check(minutes > 0 and minutes <= 1440),
  note text,
  status text not null default 'pending' check(status in ('pending','approved','rejected')),
  verified_at timestamptz,
  verified_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collab_task_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  task_id uuid not null references public.collab_tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  update_type text not null check(update_type in ('application','invitation','accepted','declined','started','progress','submitted','verified','reopened','withdrawn','cancelled','time-log')),
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists collab_tasks_board_idx
on public.collab_tasks(project_id,status,application_deadline,due_at);
create index if not exists collab_task_assignments_user_status_idx
on public.collab_task_assignments(user_id,status,updated_at desc);
create index if not exists collab_task_time_entries_user_idx
on public.collab_task_time_entries(user_id,activity_date desc);
create index if not exists collab_task_updates_task_idx
on public.collab_task_updates(task_id,created_at desc);
create index if not exists collab_availability_user_idx
on public.collab_member_availability(user_id,day_of_week,starts_at);

drop trigger if exists collab_task_assignments_touch_updated_at on public.collab_task_assignments;
create trigger collab_task_assignments_touch_updated_at
before update on public.collab_task_assignments
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_volunteer_preferences_touch_updated_at on public.collab_volunteer_preferences;
create trigger collab_volunteer_preferences_touch_updated_at
before update on public.collab_volunteer_preferences
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_member_availability_touch_updated_at on public.collab_member_availability;
create trigger collab_member_availability_touch_updated_at
before update on public.collab_member_availability
for each row execute function public.collab_touch_updated_at();

drop trigger if exists collab_task_time_entries_touch_updated_at on public.collab_task_time_entries;
create trigger collab_task_time_entries_touch_updated_at
before update on public.collab_task_time_entries
for each row execute function public.collab_touch_updated_at();

alter table public.collab_task_categories enable row level security;
alter table public.collab_task_required_skills enable row level security;
alter table public.collab_volunteer_preferences enable row level security;
alter table public.collab_member_availability enable row level security;
alter table public.collab_task_time_entries enable row level security;
alter table public.collab_task_updates enable row level security;

drop policy if exists collab_task_categories_read on public.collab_task_categories;
create policy collab_task_categories_read on public.collab_task_categories
for select to authenticated using(active and public.collab_is_active_member());

drop policy if exists collab_tasks_read on public.collab_tasks;
create policy collab_tasks_read on public.collab_tasks
for select to authenticated using(
  project_id=public.collab_project_id()
  and (
    public.collab_has_permission('tasks.manage',project_id)
    or (
      public.collab_has_permission('tasks.view',project_id)
      and status in ('open','in-progress','completed')
      and visibility='members'
    )
    or exists(
      select 1 from public.collab_task_assignments a
      where a.task_id=collab_tasks.id and a.user_id=auth.uid()
    )
  )
);

drop policy if exists collab_tasks_manage on public.collab_tasks;
-- Escritas diretas são removidas; toda alteração passa por RPC auditada.

drop policy if exists collab_task_assignments_read on public.collab_task_assignments;
create policy collab_task_assignments_read on public.collab_task_assignments
for select to authenticated using(
  user_id=auth.uid()
  or exists(
    select 1 from public.collab_tasks t
    where t.id=task_id
      and (public.collab_has_permission('tasks.assign',t.project_id)
        or public.collab_has_permission('tasks.verify',t.project_id)
        or public.collab_has_permission('tasks.manage',t.project_id))
  )
);

drop policy if exists collab_task_assignments_self_update on public.collab_task_assignments;
drop policy if exists collab_task_assignments_manage_insert on public.collab_task_assignments;

drop policy if exists collab_task_required_skills_read on public.collab_task_required_skills;
create policy collab_task_required_skills_read on public.collab_task_required_skills
for select to authenticated using(
  exists(select 1 from public.collab_tasks t where t.id=task_id)
);

drop policy if exists collab_volunteer_preferences_read on public.collab_volunteer_preferences;
create policy collab_volunteer_preferences_read on public.collab_volunteer_preferences
for select to authenticated using(
  user_id=auth.uid()
  or public.collab_has_permission('tasks.assign',project_id)
  or public.collab_has_permission('tasks.manage',project_id)
);

drop policy if exists collab_member_availability_read on public.collab_member_availability;
create policy collab_member_availability_read on public.collab_member_availability
for select to authenticated using(
  user_id=auth.uid()
  or public.collab_has_permission('tasks.assign',project_id)
  or public.collab_has_permission('tasks.manage',project_id)
);

drop policy if exists collab_task_time_entries_read on public.collab_task_time_entries;
create policy collab_task_time_entries_read on public.collab_task_time_entries
for select to authenticated using(
  user_id=auth.uid()
  or public.collab_has_permission('tasks.verify',project_id)
  or public.collab_has_permission('tasks.manage',project_id)
);

drop policy if exists collab_task_updates_read on public.collab_task_updates;
create policy collab_task_updates_read on public.collab_task_updates
for select to authenticated using(
  user_id=auth.uid()
  or public.collab_has_permission('tasks.audit.view',project_id)
  or public.collab_has_permission('tasks.manage',project_id)
  or exists(select 1 from public.collab_task_assignments a where a.task_id=collab_task_updates.task_id and a.user_id=auth.uid())
);

revoke insert,update,delete on public.collab_tasks from authenticated;
revoke insert,update,delete on public.collab_task_assignments from authenticated;
revoke insert,update,delete on public.collab_task_required_skills from authenticated;
revoke insert,update,delete on public.collab_volunteer_preferences from authenticated;
revoke insert,update,delete on public.collab_member_availability from authenticated;
revoke insert,update,delete on public.collab_task_time_entries from authenticated;
revoke insert,update,delete on public.collab_task_updates from authenticated;

grant select on public.collab_task_categories to authenticated;
grant select on public.collab_tasks,public.collab_task_assignments,public.collab_task_required_skills to authenticated;
grant select on public.collab_volunteer_preferences,public.collab_member_availability to authenticated;
grant select on public.collab_task_time_entries,public.collab_task_updates to authenticated;

insert into public.collab_modules(code,name,route,description,status,required_permission,sort_order) values
('tasks','As minhas tarefas','/area-colaborativa/tarefas','Oportunidades disponíveis, tarefas próprias, progresso e horas registadas.','active','tasks.view',30),
('availability','Disponibilidade','/area-colaborativa/disponibilidade','Horários recorrentes, modos de colaboração e disponibilidade semanal.','active','availability.self.manage',25),
('task-management','Gestão de tarefas','/area-colaborativa/gestao/tarefas','Criar, publicar, atribuir, acompanhar e validar tarefas de voluntariado.','active','tasks.manage',85)
on conflict(code) do update set
name=excluded.name,route=excluded.route,description=excluded.description,status=excluded.status,
required_permission=excluded.required_permission,sort_order=excluded.sort_order;
