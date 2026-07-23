-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Fundação da Área Colaborativa — 08A.

create extension if not exists pgcrypto;
create schema if not exists proteus_poc;

create table if not exists public.collab_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now()
);

insert into public.collab_projects (slug,name)
values ('milreu','Projeto Comunitário de Milreu')
on conflict (slug) do nothing;

create table if not exists public.collab_profile_types (
  code text primary key,
  name text not null,
  description text,
  active boolean not null default true,
  sort_order integer not null default 0
);

insert into public.collab_profile_types (code,name,description,sort_order) values
('coordinator','Coordenação','Coordenação geral, curadoria e decisões do projeto.',10),
('volunteer','Voluntário','Participação em tarefas, eventos, recolha, digitalização e apoio.',20),
('researcher','Investigador','Investigação, análise, documentação e produção de conhecimento.',30),
('community-collaborator','Colaborador comunitário','Contributos de memória, conhecimento local e ligação à comunidade.',40),
('institutional-partner','Parceiro institucional','Representação ou colaboração de instituição parceira.',50),
('reviewer','Revisor','Revisão editorial, histórica, museológica ou documental.',60),
('translator','Tradutor','Tradução e revisão linguística dos conteúdos aprovados.',70),
('observer','Observador','Acesso de consulta sem responsabilidades operacionais.',80)
on conflict (code) do update
set name=excluded.name, description=excluded.description, sort_order=excluded.sort_order;

create table if not exists public.collab_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  primary_profile_type text references public.collab_profile_types(code),
  locale text not null default 'pt-PT',
  bio text,
  phone text,
  public_recognition_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_profiles_email_lower check (email = lower(email))
);

create table if not exists public.collab_project_memberships (
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','active','suspended','archived','rejected')),
  primary_profile_type text references public.collab_profile_types(code),
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id),
  suspended_at timestamptz,
  notes text,
  primary key (project_id,user_id)
);

create table if not exists public.collab_roles (
  code text primary key,
  name text not null,
  description text,
  system_role boolean not null default true
);

create table if not exists public.collab_permissions (
  code text primary key,
  name text not null,
  description text
);

create table if not exists public.collab_role_permissions (
  role_code text not null references public.collab_roles(code) on delete cascade,
  permission_code text not null references public.collab_permissions(code) on delete cascade,
  primary key (role_code,permission_code)
);

create table if not exists public.collab_member_roles (
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_code text not null references public.collab_roles(code) on delete cascade,
  assigned_at timestamptz not null default now(),
  assigned_by uuid references auth.users(id),
  primary key (project_id,user_id,role_code)
);

create table if not exists public.collab_access_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collab_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  requested_profile_type text references public.collab_profile_types(code),
  motivation text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  reviewer_notes text
);

create unique index if not exists collab_access_requests_one_pending
on public.collab_access_requests(project_id,user_id)
where status='pending';

create table if not exists public.collab_modules (
  code text primary key,
  name text not null,
  route text not null unique,
  description text,
  status text not null default 'skeleton' check (status in ('active','foundation','skeleton','disabled')),
  required_permission text references public.collab_permissions(code),
  sort_order integer not null default 0
);

create table if not exists public.collab_audit_log (
  id bigint generated always as identity primary key,
  project_id uuid references public.collab_projects(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists collab_memberships_status_idx
on public.collab_project_memberships(status);

create index if not exists collab_access_requests_user_idx
on public.collab_access_requests(user_id,status);

create index if not exists collab_audit_actor_idx
on public.collab_audit_log(actor_user_id,created_at desc);

create or replace function public.collab_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at=now();
  return new;
end;
$$;

drop trigger if exists collab_profiles_touch_updated_at on public.collab_profiles;
create trigger collab_profiles_touch_updated_at
before update on public.collab_profiles
for each row execute function public.collab_touch_updated_at();

create or replace function public.collab_project_id()
returns uuid
language sql
stable
security definer
set search_path=public
as $$
  select id from public.collab_projects where slug='milreu' limit 1
$$;

create or replace function public.collab_handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid;
  inferred_name text;
begin
  project_uuid := public.collab_project_id();
  inferred_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(coalesce(new.email,''),'@',1)
  );

  insert into public.collab_profiles(user_id,email,display_name,avatar_url)
  values (
    new.id,
    lower(coalesce(new.email,'')),
    inferred_name,
    coalesce(new.raw_user_meta_data->>'avatar_url',new.raw_user_meta_data->>'picture')
  )
  on conflict (user_id) do nothing;

  insert into public.collab_project_memberships(project_id,user_id,status)
  values (project_uuid,new.id,'pending')
  on conflict (project_id,user_id) do nothing;

  insert into public.collab_access_requests(project_id,user_id,status)
  values (project_uuid,new.id,'pending')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists collab_on_auth_user_created on auth.users;
create trigger collab_on_auth_user_created
after insert on auth.users
for each row execute function public.collab_handle_new_auth_user();

insert into public.collab_profiles(user_id,email,display_name,avatar_url)
select
  u.id,
  lower(coalesce(u.email,'')),
  coalesce(u.raw_user_meta_data->>'full_name',u.raw_user_meta_data->>'name',split_part(coalesce(u.email,''),'@',1)),
  coalesce(u.raw_user_meta_data->>'avatar_url',u.raw_user_meta_data->>'picture')
from auth.users u
on conflict (user_id) do nothing;

insert into public.collab_project_memberships(project_id,user_id,status)
select public.collab_project_id(),u.id,'pending'
from auth.users u
on conflict (project_id,user_id) do nothing;

alter table public.collab_profiles enable row level security;
alter table public.collab_project_memberships enable row level security;
alter table public.collab_roles enable row level security;
alter table public.collab_permissions enable row level security;
alter table public.collab_role_permissions enable row level security;
alter table public.collab_member_roles enable row level security;
alter table public.collab_access_requests enable row level security;
alter table public.collab_modules enable row level security;
alter table public.collab_audit_log enable row level security;
alter table public.collab_profile_types enable row level security;
alter table public.collab_projects enable row level security;
