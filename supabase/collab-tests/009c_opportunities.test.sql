-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 09C — teste estrutural de oportunidades e candidaturas (tabelas, RLS, permissões, RPCs).

begin;

do $$
declare
  table_count integer;
  permission_count integer;
  rls_count integer;
  rpc_count integer;
  anon_opp_policy integer;
  app_anon_grant integer;
begin
  -- 2 tabelas novas.
  select count(*) into table_count from information_schema.tables
  where table_schema='public' and table_name in ('collab_opportunities','collab_opportunity_applications');
  if table_count <> 2 then raise exception 'expected 2 tables, got %', table_count; end if;

  -- 3 permissões novas no catálogo da BD.
  select count(*) into permission_count from public.collab_permissions where code like 'opportunities.%';
  if permission_count <> 3 then raise exception 'expected 3 opportunities permissions, got %', permission_count; end if;

  -- RLS ativa em ambas as tabelas.
  select count(*) into rls_count from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relname in ('collab_opportunities','collab_opportunity_applications') and c.relrowsecurity;
  if rls_count <> 2 then raise exception 'RLS not enabled on both tables (got %)', rls_count; end if;

  -- Política anon nas oportunidades (público lê apenas public+published).
  select count(*) into anon_opp_policy from pg_policies
  where schemaname='public' and tablename='collab_opportunities' and 'anon' = any(roles);
  if anon_opp_policy < 1 then raise exception 'missing anon select policy on opportunities'; end if;

  -- Candidaturas NUNCA são concedidas a anon.
  select count(*) into app_anon_grant from information_schema.role_table_grants
  where table_schema='public' and table_name='collab_opportunity_applications' and grantee='anon' and privilege_type='SELECT';
  if app_anon_grant <> 0 then raise exception 'applications must not be selectable by anon'; end if;

  -- RPCs existem.
  select count(*) into rpc_count from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname in (
    'collab_opportunity_upsert','collab_opportunity_set_status','collab_opportunity_apply',
    'collab_opportunity_withdraw','collab_opportunity_decide','collab_opportunity_add_participant','collab_opportunity_remove_participant');
  if rpc_count <> 7 then raise exception 'expected 7 opportunity RPCs, got %', rpc_count; end if;

  raise notice '009C opportunities: OK (tables, RLS, anon-published, private applicants, RPCs).';
end;
$$;

rollback;
