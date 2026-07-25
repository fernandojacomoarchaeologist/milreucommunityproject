-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- RPCs do Pacote 08G.

create or replace function public.collab_upsert_deployment_environment_08g(
  p_code text,
  p_name text,
  p_status text,
  p_site_url text,
  p_supabase_project_ref text,
  p_auth_callback_url text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('deployment.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_code not in ('local','staging','production') then raise exception 'invalid_environment'; end if;
  if p_status not in ('unconfigured','configured','testing','blocked','homologated','retired') then
    raise exception 'invalid_environment_status';
  end if;
  if p_code<>'local' and nullif(trim(p_site_url),'') is not null and p_site_url not like 'https://%' then
    raise exception 'https_required';
  end if;
  if p_code<>'local' and nullif(trim(p_auth_callback_url),'') is not null and p_auth_callback_url not like 'https://%' then
    raise exception 'https_callback_required';
  end if;

  insert into public.collab_deployment_environments(
    project_id,code,name,status,site_url,supabase_project_ref,
    auth_callback_url,is_production,allows_reset,allows_demo,
    metadata,created_by,updated_by
  ) values (
    project_uuid,p_code,trim(p_name),p_status,nullif(trim(p_site_url),''),
    nullif(trim(p_supabase_project_ref),''),nullif(trim(p_auth_callback_url),''),
    p_code='production',p_code<>'production',p_code='local',
    coalesce(p_metadata,'{}'::jsonb),auth.uid(),auth.uid()
  )
  on conflict(project_id,code) do update set
    name=excluded.name,
    status=excluded.status,
    site_url=excluded.site_url,
    supabase_project_ref=excluded.supabase_project_ref,
    auth_callback_url=excluded.auth_callback_url,
    metadata=excluded.metadata,
    updated_by=auth.uid(),
    updated_at=now()
  returning to_jsonb(collab_deployment_environments) into result;

  perform public.collab_record_audit(
    'deployment.environment.updated','deployment_environment',
    result->>'id',null,result,jsonb_build_object('environment',p_code)
  );
  return result;
end;
$$;

create or replace function public.collab_upsert_auth_policy_08g(
  p_google_enabled boolean,
  p_allowed_email_domains text[],
  p_session_expiry_minutes integer,
  p_policy_status text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  domains text[];
  result jsonb;
begin
  if not public.collab_has_permission('auth.policy.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_policy_status not in ('draft','testing','approved','suspended') then
    raise exception 'invalid_policy_status';
  end if;
  if p_session_expiry_minutes<15 or p_session_expiry_minutes>1440 then
    raise exception 'invalid_session_expiry';
  end if;

  select coalesce(array_agg(distinct lower(trim(domain))) filter(where trim(domain)<>''),'{}'::text[])
  into domains
  from unnest(coalesce(p_allowed_email_domains,'{}'::text[])) domain;

  insert into public.collab_auth_policies(
    project_id,provider,google_enabled,require_preauthorization,
    allowed_email_domains,store_provider_tokens,minimum_active_masters,
    session_expiry_minutes,policy_status,reviewed_at,reviewed_by,updated_by
  ) values (
    project_uuid,'google',p_google_enabled,true,domains,false,1,
    p_session_expiry_minutes,p_policy_status,
    case when p_policy_status='approved' then now() else null end,
    case when p_policy_status='approved' then auth.uid() else null end,
    auth.uid()
  )
  on conflict(project_id) do update set
    google_enabled=excluded.google_enabled,
    allowed_email_domains=excluded.allowed_email_domains,
    session_expiry_minutes=excluded.session_expiry_minutes,
    policy_status=excluded.policy_status,
    reviewed_at=excluded.reviewed_at,
    reviewed_by=excluded.reviewed_by,
    updated_by=auth.uid(),
    updated_at=now()
  returning to_jsonb(collab_auth_policies) into result;

  perform public.collab_record_audit(
    'auth.policy.updated','auth_policy',project_uuid::text,
    null,result,jsonb_build_object('provider','google')
  );
  return result;
end;
$$;

create or replace function public.collab_start_homologation_08g(
  p_environment_code text,
  p_version text,
  p_commit_sha text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  environment_uuid uuid;
  run_uuid uuid;
  result jsonb;
begin
  if not public.collab_has_permission('homologation.run',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_version),'') is null then raise exception 'version_required'; end if;
  if p_commit_sha is not null and p_commit_sha !~ '^[0-9a-fA-F]{7,64}$' then
    raise exception 'invalid_commit_sha';
  end if;

  select id into environment_uuid
  from public.collab_deployment_environments
  where project_id=project_uuid and code=p_environment_code and status<>'retired';
  if environment_uuid is null then raise exception 'environment_not_found'; end if;

  if exists(
    select 1 from public.collab_homologation_runs
    where project_id=project_uuid and environment_id=environment_uuid
      and status in ('planned','in-progress','blocked')
  ) then raise exception 'active_homologation_run_exists'; end if;

  insert into public.collab_homologation_runs(
    project_id,environment_id,version,commit_sha,status,started_by,started_at
  ) values (
    project_uuid,environment_uuid,trim(p_version),nullif(trim(p_commit_sha),''),
    'in-progress',auth.uid(),now()
  ) returning id into run_uuid;

  insert into public.collab_homologation_checks(
    project_id,run_id,check_code,category,title,blocking,status
  )
  select project_uuid,run_uuid,catalog.code,catalog.category,catalog.title,
    catalog.blocking,'pending'
  from public.collab_homologation_check_catalog catalog
  where catalog.active
  order by catalog.sort_order;

  update public.collab_deployment_environments
  set status='testing',updated_by=auth.uid(),updated_at=now()
  where id=environment_uuid;

  select jsonb_build_object(
    'runId',run_uuid,
    'environmentCode',p_environment_code,
    'checkCount',(select count(*) from public.collab_homologation_checks where run_id=run_uuid),
    'status','in-progress'
  ) into result;

  perform public.collab_record_audit(
    'homologation.run.started','homologation_run',run_uuid::text,
    null,result,jsonb_build_object('environment',p_environment_code)
  );
  return result;
end;
$$;

create or replace function public.collab_record_homologation_check_08g(
  p_run_id uuid,
  p_check_code text,
  p_status text,
  p_evidence text default null,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('homologation.check',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status not in ('pending','running','passed','failed','blocked','not-applicable') then
    raise exception 'invalid_check_status';
  end if;
  if not exists(
    select 1 from public.collab_homologation_runs
    where id=p_run_id and project_id=project_uuid and status in ('in-progress','blocked')
  ) then raise exception 'run_not_editable'; end if;

  update public.collab_homologation_checks
  set status=p_status,
      evidence=nullif(trim(p_evidence),''),
      note=nullif(trim(p_note),''),
      checked_by=auth.uid(),
      checked_at=case when p_status in ('passed','failed','blocked','not-applicable') then now() else null end,
      updated_at=now()
  where project_id=project_uuid and run_id=p_run_id and check_code=p_check_code
  returning to_jsonb(collab_homologation_checks) into result;

  if result is null then raise exception 'check_not_found'; end if;

  update public.collab_homologation_runs run
  set status=case
      when exists(
        select 1 from public.collab_homologation_checks check_row
        where check_row.run_id=run.id and check_row.blocking
          and check_row.status in ('failed','blocked')
      ) then 'blocked'
      else 'in-progress'
    end,
    updated_at=now()
  where run.id=p_run_id;

  return result;
end;
$$;

create or replace function public.collab_complete_homologation_08g(
  p_run_id uuid,
  p_summary text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  open_blocking integer;
  failed_blocking integer;
  next_status text;
  result jsonb;
begin
  if not public.collab_has_permission('homologation.run',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_summary),'') is null then raise exception 'summary_required'; end if;

  select count(*) into open_blocking
  from public.collab_homologation_checks
  where run_id=p_run_id and project_id=project_uuid and blocking
    and status in ('pending','running');

  select count(*) into failed_blocking
  from public.collab_homologation_checks
  where run_id=p_run_id and project_id=project_uuid and blocking
    and status in ('failed','blocked');

  if open_blocking>0 then raise exception 'blocking_checks_open:%',open_blocking; end if;
  next_status:=case when failed_blocking>0 then 'failed' else 'passed' end;

  update public.collab_homologation_runs
  set status=next_status,summary=trim(p_summary),completed_by=auth.uid(),
      completed_at=now(),updated_at=now()
  where id=p_run_id and project_id=project_uuid and status in ('in-progress','blocked')
  returning to_jsonb(collab_homologation_runs) into result;

  if result is null then raise exception 'run_not_completable'; end if;
  return result;
end;
$$;

create or replace function public.collab_approve_homologation_08g(
  p_run_id uuid,
  p_confirmation text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  run_row public.collab_homologation_runs%rowtype;
  environment_row public.collab_deployment_environments%rowtype;
  result jsonb;
begin
  if not public.collab_has_permission('homologation.approve',project_uuid) then
    raise exception 'permission_denied';
  end if;

  select * into run_row
  from public.collab_homologation_runs
  where id=p_run_id and project_id=project_uuid
  for update;
  if run_row.id is null or run_row.status<>'passed' then
    raise exception 'passed_run_required';
  end if;

  select * into environment_row
  from public.collab_deployment_environments
  where id=run_row.environment_id and project_id=project_uuid;

  if environment_row.code='production' then
    if p_confirmation<>'APPROVE_MILREU_PRODUCTION_RELEASE' then
      raise exception 'literal_production_confirmation_required';
    end if;
    if not exists(
      select 1
      from public.collab_homologation_runs staging_run
      join public.collab_deployment_environments staging_environment
        on staging_environment.id=staging_run.environment_id
      where staging_run.project_id=project_uuid
        and staging_environment.code='staging'
        and staging_run.version=run_row.version
        and staging_run.status='approved'
    ) then raise exception 'approved_staging_run_required'; end if;
  elsif p_confirmation<>'APPROVE_MILREU_HOMOLOGATION' then
    raise exception 'literal_confirmation_required';
  end if;

  update public.collab_homologation_runs
  set status='approved',approved_by=auth.uid(),approved_at=now(),updated_at=now()
  where id=p_run_id
  returning to_jsonb(collab_homologation_runs) into result;

  update public.collab_deployment_environments
  set status='homologated',last_verified_at=now(),updated_by=auth.uid(),updated_at=now()
  where id=run_row.environment_id;

  perform public.collab_record_audit(
    'homologation.run.approved','homologation_run',p_run_id::text,
    to_jsonb(run_row),result,jsonb_build_object('environment',environment_row.code)
  );
  return result;
end;
$$;

create or replace function public.collab_cancel_homologation_08g(
  p_run_id uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('homologation.cancel',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_reason),'') is null then raise exception 'reason_required'; end if;

  update public.collab_homologation_runs
  set status='cancelled',summary=trim(p_reason),cancelled_at=now(),updated_at=now()
  where id=p_run_id and project_id=project_uuid
    and status in ('planned','in-progress','blocked','passed')
  returning to_jsonb(collab_homologation_runs) into result;

  if result is null then raise exception 'run_not_cancellable'; end if;
  return result;
end;
$$;

create or replace function public.collab_deployment_readiness_08g()
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  master_count integer;
begin
  if not public.collab_has_permission('deployment.view',project_uuid)
     and not public.collab_has_permission('homologation.view',project_uuid)
  then raise exception 'permission_denied'; end if;

  select public.collab_active_master_count() into master_count;

  return jsonb_build_object(
    'masterCount',master_count,
    'masterReady',master_count>=1,
    'authPolicy',(select to_jsonb(policy) from public.collab_auth_policies policy where policy.project_id=project_uuid),
    'environments',coalesce((
      select jsonb_agg(to_jsonb(environment) order by environment.code)
      from public.collab_deployment_environments environment
      where environment.project_id=project_uuid
    ),'[]'::jsonb),
    'latestRuns',coalesce((
      select jsonb_agg(to_jsonb(latest))
      from (
        select distinct on(environment_id) *
        from public.collab_homologation_runs
        where project_id=project_uuid
        order by environment_id,created_at desc
      ) latest
    ),'[]'::jsonb)
  );
end;
$$;

revoke all on function public.collab_upsert_deployment_environment_08g(text,text,text,text,text,text,jsonb) from public;
revoke all on function public.collab_upsert_auth_policy_08g(boolean,text[],integer,text) from public;
revoke all on function public.collab_start_homologation_08g(text,text,text) from public;
revoke all on function public.collab_record_homologation_check_08g(uuid,text,text,text,text) from public;
revoke all on function public.collab_complete_homologation_08g(uuid,text) from public;
revoke all on function public.collab_approve_homologation_08g(uuid,text) from public;
revoke all on function public.collab_cancel_homologation_08g(uuid,text) from public;
revoke all on function public.collab_deployment_readiness_08g() from public;

grant execute on function public.collab_upsert_deployment_environment_08g(text,text,text,text,text,text,jsonb) to authenticated;
grant execute on function public.collab_upsert_auth_policy_08g(boolean,text[],integer,text) to authenticated;
grant execute on function public.collab_start_homologation_08g(text,text,text) to authenticated;
grant execute on function public.collab_record_homologation_check_08g(uuid,text,text,text,text) to authenticated;
grant execute on function public.collab_complete_homologation_08g(uuid,text) to authenticated;
grant execute on function public.collab_approve_homologation_08g(uuid,text) to authenticated;
grant execute on function public.collab_cancel_homologation_08g(uuid,text) to authenticated;
grant execute on function public.collab_deployment_readiness_08g() to authenticated;
