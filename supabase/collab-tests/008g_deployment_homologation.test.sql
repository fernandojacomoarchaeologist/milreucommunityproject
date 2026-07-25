begin;

do $$
declare
  check_count integer;
  environment_count integer;
begin
  if to_regclass('public.collab_deployment_environments') is null then raise exception 'deployment environments missing'; end if;
  if to_regclass('public.collab_auth_policies') is null then raise exception 'auth policies missing'; end if;
  if to_regclass('public.collab_homologation_runs') is null then raise exception 'homologation runs missing'; end if;
  if to_regclass('public.collab_homologation_checks') is null then raise exception 'homologation checks missing'; end if;

  select count(*) into environment_count
  from public.collab_deployment_environments
  where project_id=public.collab_project_id();
  if environment_count<>3 then raise exception 'expected 3 environments, got %',environment_count; end if;

  select count(*) into check_count
  from public.collab_homologation_check_catalog
  where active;
  if check_count<>24 then raise exception 'expected 24 checks, got %',check_count; end if;

  if not exists(
    select 1 from public.collab_modules
    where code='deployment-homologation' and status='active'
  ) then raise exception 'deployment module inactive'; end if;

  if not exists(
    select 1 from public.collab_role_permissions
    where role_code='master' and permission_code='homologation.approve'
  ) then raise exception 'master homologation approval missing'; end if;

  if not exists(
    select 1 from pg_class c
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public'
      and c.relname='collab_homologation_runs'
      and c.relrowsecurity
  ) then raise exception 'homologation RLS missing'; end if;

  if to_regprocedure('public.collab_upsert_deployment_environment_08g(text,text,text,text,text,text,jsonb)') is null then
    raise exception 'environment RPC missing';
  end if;
  if to_regprocedure('public.collab_start_homologation_08g(text,text,text)') is null then
    raise exception 'start homologation RPC missing';
  end if;
  if to_regprocedure('public.collab_record_homologation_check_08g(uuid,text,text,text,text)') is null then
    raise exception 'check RPC missing';
  end if;
  if to_regprocedure('public.collab_complete_homologation_08g(uuid,text)') is null then
    raise exception 'complete RPC missing';
  end if;
  if to_regprocedure('public.collab_approve_homologation_08g(uuid,text)') is null then
    raise exception 'approve RPC missing';
  end if;
  if to_regprocedure('public.collab_deployment_readiness_08g()') is null then
    raise exception 'readiness RPC missing';
  end if;

  if exists(
    select 1 from public.collab_deployment_environments
    where code='production' and (allows_reset or allows_demo or not is_production)
  ) then raise exception 'production safety contract invalid'; end if;

  if exists(
    select 1 from public.collab_auth_policies
    where store_provider_tokens or not require_preauthorization or minimum_active_masters<1
  ) then raise exception 'auth policy safety contract invalid'; end if;
end
$$;

rollback;
