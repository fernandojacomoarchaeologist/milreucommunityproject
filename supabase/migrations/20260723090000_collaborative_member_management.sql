-- 08B — dados para gestão de membros, competências e pré-autorizações.

alter table public.collab_profiles
  add column if not exists preferred_name text,
  add column if not exists organization_name text,
  add column if not exists languages text[] not null default array['pt-PT']::text[],
  add column if not exists profile_completed_at timestamptz;

create table if not exists public.collab_interest_areas (
  code text primary key,
  name text not null,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.collab_skill_catalog (
  code text primary key,
  name text not null,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.collab_member_interests (
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  interest_code text not null references public.collab_interest_areas(code) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(project_id,user_id,interest_code)
);

create table if not exists public.collab_member_skills (
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_code text not null references public.collab_skill_catalog(code) on delete cascade,
  level text not null default 'interested' check(level in ('interested','basic','experienced')),
  created_at timestamptz not null default now(),
  primary key(project_id,user_id,skill_code)
);

create table if not exists public.collab_access_invitations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  email text not null,
  intended_profile_type text not null references public.collab_profile_types(code),
  role_codes text[] not null default array['volunteer']::text[],
  status text not null default 'pending' check(status in ('pending','claimed','revoked','expired')),
  expires_at timestamptz,
  internal_notes text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  claimed_by uuid references auth.users(id),
  claimed_at timestamptz,
  revoked_by uuid references auth.users(id),
  revoked_at timestamptz,
  constraint collab_access_invitations_email_lower check(email=lower(email))
);

create unique index if not exists collab_access_invitations_pending_email
on public.collab_access_invitations(project_id,email)
where status='pending';

create table if not exists public.collab_membership_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  note text not null,
  visibility text not null default 'managers' check(visibility in ('managers','master-only')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

insert into public.collab_interest_areas(code,name,sort_order) values
('museum-memories','Museu de Memórias',10),('oral-history','História oral',20),
('photography','Fotografia e digitalização',30),('cataloguing','Catalogação',40),
('events','Eventos e exposições',50),('translation','Tradução',60),
('surveys','Inquéritos e dados',70),('communication','Comunicação',80),
('research','Investigação',90),('logistics','Apoio logístico',100)
on conflict(code) do update set name=excluded.name,sort_order=excluded.sort_order;

insert into public.collab_skill_catalog(code,name,sort_order) values
('community-listening','Escuta e relação comunitária',10),('photography','Fotografia',20),
('digitisation','Digitalização',30),('transcription','Transcrição',40),
('historical-research','Pesquisa histórica',50),('cataloguing','Catalogação',60),
('translation-en','Tradução — inglês',70),('translation-es','Tradução — espanhol',80),
('translation-fr','Tradução — francês',90),('event-support','Apoio a eventos',100),
('installation','Montagem de exposição',110),('accessibility','Acessibilidade',120)
on conflict(code) do update set name=excluded.name,sort_order=excluded.sort_order;

alter table public.collab_interest_areas enable row level security;
alter table public.collab_skill_catalog enable row level security;
alter table public.collab_member_interests enable row level security;
alter table public.collab_member_skills enable row level security;
alter table public.collab_access_invitations enable row level security;
alter table public.collab_membership_notes enable row level security;

create policy collab_interest_areas_read on public.collab_interest_areas for select to authenticated using(active);
create policy collab_skill_catalog_read on public.collab_skill_catalog for select to authenticated using(active);
create policy collab_member_interests_read on public.collab_member_interests for select to authenticated using(user_id=auth.uid() or public.collab_has_permission('memberships.view',project_id));
create policy collab_member_interests_self on public.collab_member_interests for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid() and project_id=public.collab_project_id());
create policy collab_member_skills_read on public.collab_member_skills for select to authenticated using(user_id=auth.uid() or public.collab_has_permission('memberships.view',project_id));
create policy collab_member_skills_self on public.collab_member_skills for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid() and project_id=public.collab_project_id());
create policy collab_access_invitations_manage on public.collab_access_invitations for all to authenticated using(public.collab_has_permission('invitations.manage',project_id)) with check(public.collab_has_permission('invitations.manage',project_id));
create policy collab_membership_notes_read on public.collab_membership_notes for select to authenticated using(public.collab_has_permission('member.notes.manage',project_id));
create policy collab_membership_notes_insert on public.collab_membership_notes for insert to authenticated with check(public.collab_has_permission('member.notes.manage',project_id) and created_by=auth.uid());

grant select on public.collab_interest_areas,public.collab_skill_catalog to authenticated;
grant select,insert,delete on public.collab_member_interests,public.collab_member_skills to authenticated;
grant select,insert,update on public.collab_access_invitations to authenticated;
grant select,insert on public.collab_membership_notes to authenticated;
