-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Consultar RIGHTS.md no repositório principal.

begin;

select plan(10);

select has_schema('proteus_poc', 'schema POC existe');
select has_table('proteus_poc', 'facts', 'tabela facts existe');
select has_table('proteus_poc', 'audit_events', 'tabela audit existe');
select has_view('public', 'proteus_poc_published_facts', 'view pública existe');
select has_pk('proteus_poc', 'facts', 'facts possui PK');
select has_column('proteus_poc', 'facts', 'editorial_status', 'estado editorial existe');
select has_column('proteus_poc', 'facts', 'publication_status', 'estado público existe');

select ok(
  (select relrowsecurity from pg_class c
   join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'proteus_poc' and c.relname = 'facts'),
  'RLS ativa em facts'
);

select is(
  (select count(*)::integer from public.proteus_poc_published_facts),
  0,
  'seed demonstrativo não é público'
);

select is(
  (select count(*)::integer from proteus_poc.facts where record_kind <> 'demonstration'),
  0,
  'POC contém somente demonstração'
);

select * from finish();
rollback;
