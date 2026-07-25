begin;

do $$
declare
  table_count integer;
  permission_count integer;
  check_count integer;
  policy_count integer;
  event_count integer;
  template_count integer;
  audit_id bigint;
  audit_hash text;
begin
  select count(*) into table_count
  from (values
    ('collab_operational_settings'),
    ('collab_retention_policies'),
    ('collab_legal_holds'),
    ('collab_lifecycle_runs'),
    ('collab_incidents'),
    ('collab_incident_updates'),
    ('collab_incident_actions'),
    ('collab_backup_plans'),
    ('collab_backup_verifications'),
    ('collab_continuity_exercises'),
    ('collab_operational_check_catalog'),
    ('collab_operational_runs'),
    ('collab_operational_results')
  ) expected(name)
  where to_regclass('public.'||expected.name) is not null;
  if table_count<>13 then raise exception 'expected 13 operational tables, got %',table_count; end if;

  if not exists(
    select 1 from pg_class c
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='collab_incidents' and c.relrowsecurity
  ) then raise exception 'incident RLS missing'; end if;

  if not exists(
    select 1 from pg_class c
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='collab_lifecycle_runs' and c.relrowsecurity
  ) then raise exception 'retention RLS missing'; end if;

  select count(*) into permission_count
  from public.collab_permissions
  where code in (
    'operations.view','operations.manage','operations.settings.manage',
    'health.view','health.run','health.check',
    'audit.search','audit.export','audit.integrity',
    'retention.view','retention.manage','retention.approve','legal-holds.manage',
    'incidents.view','incidents.manage','incidents.assign','incidents.close',
    'backups.view','backups.manage','backups.verify',
    'continuity.view','continuity.manage','operations.audit.view'
  );
  if permission_count<>23 then raise exception 'expected 23 permissions, got %',permission_count; end if;

  select count(*) into check_count
  from public.collab_operational_check_catalog where active;
  if check_count<>20 then raise exception 'expected 20 operational checks, got %',check_count; end if;

  select count(*) into policy_count
  from public.collab_retention_policies
  where project_id=public.collab_project_id() and status='active';
  if policy_count<>7 then raise exception 'expected 7 retention policies, got %',policy_count; end if;

  if exists(
    select 1 from public.collab_retention_policies
    where project_id=public.collab_project_id() and automatic_allowed
  ) then raise exception 'automatic retention enabled'; end if;

  if not exists(
    select 1 from public.collab_operational_settings
    where project_id=public.collab_project_id()
      and code='backup-provider-state'
      and value_json->>'status'='unconfigured'
  ) then raise exception 'backup provider must start unconfigured'; end if;

  select count(*) into event_count
  from public.collab_notification_event_types
  where code in (
    'incident.opened','incident.assigned','incident.resolved',
    'backup.verification-failed','retention.run-approved'
  ) and active and mandatory_in_app and not default_email;
  if event_count<>5 then raise exception 'expected five protected 08I notification events, got %',event_count; end if;

  select count(*) into template_count
  from public.collab_notification_templates
  where event_type in (
    'incident.opened','incident.assigned','incident.resolved',
    'backup.verification-failed','retention.run-approved'
  ) and language='pt-PT' and status='approved';
  if template_count<>5 then raise exception 'expected five approved 08I templates, got %',template_count; end if;

  if has_table_privilege('authenticated','public.collab_audit_log','SELECT') then
    raise exception 'authenticated still has direct audit select';
  end if;

  if has_function_privilege(
    'authenticated',
    'public.collab_apply_retention_run_08i(uuid,text,text)',
    'EXECUTE'
  ) then raise exception 'authenticated can apply retention'; end if;

  if not has_function_privilege(
    'service_role',
    'public.collab_apply_retention_run_08i(uuid,text,text)',
    'EXECUTE'
  ) then raise exception 'service role cannot apply retention'; end if;

  if to_regprocedure('public.collab_search_audit_08i(text,text,text,text,text,uuid,timestamptz,timestamptz,integer,integer)') is null then
    raise exception 'audit search RPC missing';
  end if;
  if to_regprocedure('public.collab_verify_audit_chain_08i(bigint,bigint)') is null then
    raise exception 'audit integrity RPC missing';
  end if;
  if to_regprocedure('public.collab_preview_retention_run_08i(text,text)') is null then
    raise exception 'retention preview RPC missing';
  end if;
  if to_regprocedure('public.collab_create_incident_08i(text,text,text,text,text,text,uuid)') is null then
    raise exception 'incident RPC missing';
  end if;

  insert into public.collab_audit_log(
    project_id,actor_user_id,action,entity_type,entity_id,
    before_data,after_data,metadata
  ) values (
    public.collab_project_id(),null,'operation.tested','test','008i',
    '{"email":"private@example.invalid","status":"before"}'::jsonb,
    '{"token":"do-not-store","status":"after"}'::jsonb,
    '{"secret":"do-not-store","test":true}'::jsonb
  ) returning id,event_hash into audit_id,audit_hash;

  if audit_hash is null or length(audit_hash)<>64 then
    raise exception 'audit hash not generated';
  end if;

  if exists(
    select 1 from public.collab_audit_log
    where id=audit_id
      and (
        before_data->>'email'<>'[REDACTED]'
        or after_data->>'token'<>'[REDACTED]'
        or metadata->>'secret'<>'[REDACTED]'
      )
  ) then raise exception 'audit redaction failed'; end if;
end
$$;

rollback;
