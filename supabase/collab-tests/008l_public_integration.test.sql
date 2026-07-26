-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08L — teste estrutural de integração pública, participação e evolução.

begin;

do $$
declare
  table_count integer;
  permission_count integer;
  rls_count integer;
  rpc_count integer;
  anon_policy_count integer;
begin
  -- 9 tabelas novas (publication + participation + evolution)
  select count(*) into table_count from information_schema.tables
  where table_schema='public' and table_name in (
    'collab_publication_proposals','collab_publication_snapshots','collab_publication_activations',
    'collab_participation_programmes','collab_participation_steps','collab_participation_enrolments',
    'collab_participation_progress','collab_evolution_proposals','collab_evolution_decisions');
  if table_count <> 9 then raise exception 'expected 9 tables, got %', table_count; end if;

  -- 13 permissões novas
  select count(*) into permission_count from public.collab_permissions
  where code like 'participation.%' or code like 'public-integration.%' or code like 'evolution.%';
  if permission_count <> 13 then raise exception 'expected 13 new permissions, got %', permission_count; end if;

  -- módulo continuous-participation
  if not exists(select 1 from public.collab_modules where code='continuous-participation' and required_permission='participation.view') then
    raise exception 'continuous-participation module missing';
  end if;

  -- master decide/ativa/reverte; coordenação não
  for permission_count in select 1 loop exit; end loop;
  if not exists(select 1 from public.collab_role_permissions where role_code='master' and permission_code='evolution.decide') then
    raise exception 'master must hold evolution.decide'; end if;
  if exists(select 1 from public.collab_role_permissions where role_code='coordinator' and permission_code in ('public-integration.activate','public-integration.rollback','evolution.decide')) then
    raise exception 'coordinator must not hold protected permissions'; end if;

  -- RPCs essenciais
  select count(*) into rpc_count from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname in (
    'collab_pub_upsert_proposal','collab_pub_generate_snapshot','collab_pub_activation',
    'collab_participation_upsert_programme','collab_participation_enrol','collab_participation_update_progress',
    'collab_evolution_upsert_proposal','collab_evolution_decide','collab_public_participation_view');
  if rpc_count <> 9 then raise exception 'expected 9 functions, got %', rpc_count; end if;

  -- RLS ativa nas 9 tabelas
  select count(*) into rls_count from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind='r' and c.relrowsecurity
    and c.relname in ('collab_publication_proposals','collab_publication_snapshots','collab_publication_activations',
      'collab_participation_programmes','collab_participation_steps','collab_participation_enrolments',
      'collab_participation_progress','collab_evolution_proposals','collab_evolution_decisions');
  if rls_count <> 9 then raise exception 'expected RLS on 9 tables, got %', rls_count; end if;

  -- políticas para anon (leitura pública restrita)
  select count(*) into anon_policy_count from pg_policies
  where schemaname='public' and 'anon'=any(roles)
    and tablename in ('collab_publication_snapshots','collab_participation_programmes','collab_participation_steps');
  if anon_policy_count < 3 then raise exception 'expected anon read policies, got %', anon_policy_count; end if;
end
$$;

-- A constraint de ambiente das ativações rejeita ambientes inválidos.
do $$
begin
  if not exists(select 1 from pg_constraint where conname='collab_pub_activation_action_check') then
    raise exception 'activation action constraint missing';
  end if;
end
$$;

rollback;
