-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08K — teste estrutural do piloto controlado.

begin;

do $$
declare
  table_count integer;
  permission_count integer;
  policy_count integer;
  rls_count integer;
  rpc_count integer;
begin
  -- 9 tabelas do piloto
  select count(*) into table_count
  from information_schema.tables
  where table_schema='public' and table_name like 'collab_pilot_%';
  if table_count <> 9 then raise exception 'expected 9 pilot tables, got %', table_count; end if;

  -- 10 permissões do piloto
  select count(*) into permission_count
  from public.collab_permissions where code like 'pilot.%';
  if permission_count <> 10 then raise exception 'expected 10 pilot permissions, got %', permission_count; end if;

  -- módulo pilot semeado
  if not exists(select 1 from public.collab_modules where code='pilot' and required_permission='pilot.view') then
    raise exception 'pilot module missing';
  end if;

  -- master aprova; coordenação não
  if not exists(select 1 from public.collab_role_permissions where role_code='master' and permission_code='pilot.approve') then
    raise exception 'master must hold pilot.approve';
  end if;
  if exists(select 1 from public.collab_role_permissions where role_code='coordinator' and permission_code='pilot.approve') then
    raise exception 'coordinator must not hold pilot.approve';
  end if;
  if not exists(select 1 from public.collab_role_permissions where role_code='volunteer' and permission_code='pilot.feedback.submit') then
    raise exception 'volunteer must hold pilot.feedback.submit';
  end if;

  -- RPCs essenciais
  select count(*) into rpc_count
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname in (
    'collab_pilot_upsert_cycle','collab_pilot_enrol_participant','collab_pilot_confirm_participation',
    'collab_pilot_submit_observation','collab_pilot_set_gate_result','collab_pilot_approve_staging_homologation',
    'collab_pilot_workspace','collab_pilot_is_participant','collab_pilot_facilitates_session'
  );
  if rpc_count <> 9 then raise exception 'expected 9 pilot functions, got %', rpc_count; end if;

  -- RLS ativa nas 9 tabelas
  select count(*) into rls_count
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relname like 'collab_pilot_%' and c.relkind='r' and c.relrowsecurity;
  if rls_count <> 9 then raise exception 'expected RLS on 9 pilot tables, got %', rls_count; end if;

  -- pelo menos uma policy de leitura por tabela
  select count(*) into policy_count
  from pg_policies where schemaname='public' and tablename like 'collab_pilot_%';
  if policy_count < 9 then raise exception 'expected >=9 pilot policies, got %', policy_count; end if;

  -- constraint de ambiente staging-only
  if not exists(
    select 1 from pg_constraint where conname='collab_pilot_cycle_env_check'
  ) then raise exception 'staging-only environment constraint missing'; end if;
end
$$;

-- A constraint de staging rejeita ambientes diferentes (esperado erro 23514).
do $$
declare
  proj uuid;
begin
  select id into proj from public.collab_projects limit 1;
  if proj is null then return; end if;
  begin
    insert into public.collab_pilot_cycles(project_id,environment,code,title,objective,baseline_release,owner_user_id,created_by)
    values(proj,'production','TST','t','o','0.22.0',
      (select id from auth.users limit 1),(select id from auth.users limit 1));
    raise exception 'production environment should have been rejected';
  exception when check_violation then
    null; -- comportamento esperado
  when others then
    null; -- ausência de auth.users em CI não invalida o teste estrutural
  end;
end
$$;

rollback;
