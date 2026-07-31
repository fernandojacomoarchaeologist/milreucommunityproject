-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.
-- Pacote 09C — Oportunidades públicas e candidaturas.
-- Tabelas + RLS. Público lê apenas oportunidades public+published. Candidatos privados
-- (só o próprio e quem tem opportunities.manage). Menores bloqueados até política.
-- Sem service_role no browser; escrita apenas via RPCs security definer (migration seguinte).

create table if not exists public.collab_opportunities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  slug text not null,
  title text not null,
  summary text,
  opportunity_type text not null default 'other'
    constraint collab_opp_type_check check (opportunity_type in
      ('course','event','volunteering','fieldwork','workshop','documentation-support','community-activity','research-participation','other')),
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  location_text text,
  duration_text text,
  effort_text text,
  requirements text,
  accessibility_text text,
  cost_text text,
  remuneration_text text,
  organizer_text text,
  public_contact text,
  visibility text not null default 'private-draft'
    constraint collab_opp_visibility_check check (visibility in ('public','members-only','private-draft')),
  status text not null default 'draft'
    constraint collab_opp_status_check check (status in ('draft','published','closed','cancelled','archived')),
  capacity_mode text not null default 'undefined'
    constraint collab_opp_capacity_mode_check check (capacity_mode in ('unlimited','limited','undefined')),
  capacity_limit integer constraint collab_opp_capacity_limit_check check (capacity_limit is null or capacity_limit > 0),
  application_deadline timestamptz,
  -- Menores: campos preparados, mas participação de menores bloqueada até política institucional.
  min_age integer,
  minors_allowed boolean not null default false,
  owner_user_id uuid,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_opp_slug_unique unique (project_id, slug)
);

create table if not exists public.collab_opportunity_applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  opportunity_id uuid not null references public.collab_opportunities(id) on delete cascade,
  applicant_user_id uuid not null,
  status text not null default 'submitted'
    constraint collab_opp_app_status_check check (status in ('submitted','accepted','not-selected','withdrawn','removed')),
  applicant_note text,
  internal_note text,
  added_manually boolean not null default false,
  decided_by uuid,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Uma candidatura por pessoa/oportunidade.
  constraint collab_opp_app_unique unique (opportunity_id, applicant_user_id)
);

create index if not exists collab_opportunities_idx on public.collab_opportunities(project_id, visibility, status);
create index if not exists collab_opportunity_applications_idx on public.collab_opportunity_applications(opportunity_id, status);
create index if not exists collab_opportunity_applications_applicant_idx on public.collab_opportunity_applications(applicant_user_id);

alter table public.collab_opportunities enable row level security;
alter table public.collab_opportunity_applications enable row level security;

grant select on public.collab_opportunities to authenticated, anon;
-- Candidaturas NUNCA são legíveis por anon.
grant select on public.collab_opportunity_applications to authenticated;

-- Oportunidades: público vê apenas public+published; membros veem members-only publicadas;
-- quem gere vê tudo (incl. rascunhos).
drop policy if exists collab_opportunities_public on public.collab_opportunities;
create policy collab_opportunities_public on public.collab_opportunities for select to anon
using (visibility='public' and status='published');

drop policy if exists collab_opportunities_select on public.collab_opportunities;
create policy collab_opportunities_select on public.collab_opportunities for select to authenticated
using (
  (visibility='public' and status='published')
  or (visibility='members-only' and status='published' and public.collab_has_permission('opportunities.view', project_id))
  or public.collab_has_permission('opportunities.manage', project_id)
);

-- Candidaturas: o próprio vê a sua; quem gere vê todas; mais ninguém.
drop policy if exists collab_opportunity_applications_select on public.collab_opportunity_applications;
create policy collab_opportunity_applications_select on public.collab_opportunity_applications for select to authenticated
using (applicant_user_id = auth.uid() or public.collab_has_permission('opportunities.manage', project_id));

-- Catálogo: permissões, módulo e atribuições por papel (09C). Master="*" via role_permissions.
insert into public.collab_permissions(code,name,description) values
  ('opportunities.view','Ver oportunidades','Aceder a oportunidades de membros e à área de oportunidades.'),
  ('opportunities.apply','Candidatar-se','Submeter e retirar a própria candidatura a uma oportunidade.'),
  ('opportunities.manage','Gerir oportunidades','Criar, publicar, decidir candidaturas e gerir participantes (dono do projeto).')
on conflict (code) do nothing;

insert into public.collab_modules(code,name,route,description,status,required_permission,sort_order) values (
  'opportunities','Oportunidades','/area-colaborativa/oportunidades',
  'Oportunidades públicas e de membros, candidaturas e gestão (decisão do dono do projeto).',
  'active','opportunities.view',107)
on conflict (code) do update
  set name=excluded.name, route=excluded.route, description=excluded.description,
      status=excluded.status, required_permission=excluded.required_permission, sort_order=excluded.sort_order;

insert into public.collab_role_permissions(role_code,permission_code)
select 'master', code from public.collab_permissions where code like 'opportunities.%'
on conflict do nothing;
insert into public.collab_role_permissions(role_code,permission_code)
select 'coordinator', code from public.collab_permissions where code like 'opportunities.%'
on conflict do nothing;
insert into public.collab_role_permissions(role_code,permission_code) values
  ('volunteer','opportunities.view'),('volunteer','opportunities.apply'),
  ('reviewer','opportunities.view'),('reviewer','opportunities.apply'),
  ('researcher','opportunities.view'),('researcher','opportunities.apply'),
  ('translator','opportunities.view'),('translator','opportunities.apply'),
  ('partner','opportunities.view'),('partner','opportunities.apply'),
  ('observer','opportunities.view'),('observer','opportunities.apply')
on conflict do nothing;
