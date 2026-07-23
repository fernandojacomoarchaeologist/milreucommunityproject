-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Consultar RIGHTS.md no repositório principal.

create schema if not exists proteus_poc;

create table if not exists proteus_poc.facts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  record_kind text not null default 'demonstration'
    check (record_kind in ('demonstration')),
  title jsonb not null,
  summary jsonb,
  editorial_status text not null default 'draft'
    check (editorial_status in ('draft', 'review', 'approved', 'published', 'withdrawn')),
  publication_status text not null default 'not-public'
    check (publication_status in ('not-public', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table proteus_poc.facts enable row level security;

revoke all on schema proteus_poc from public;
revoke all on all tables in schema proteus_poc from public;

grant usage on schema proteus_poc to anon, authenticated;
grant select on proteus_poc.facts to anon, authenticated;

create policy "poc_public_read_published"
on proteus_poc.facts
for select
to anon, authenticated
using (
  editorial_status = 'published'
  and publication_status = 'public'
);

comment on schema proteus_poc is
'POC removível do Pacote 05F. Não contém o modelo final do Milreu Proteus.';

comment on table proteus_poc.facts is
'Registos exclusivamente demonstrativos. Não inserir conteúdo real.';
