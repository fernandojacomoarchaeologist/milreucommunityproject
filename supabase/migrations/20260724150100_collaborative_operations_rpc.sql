-- MILREU-DESTRUCTIVE-REVIEWED (revisão de integração 2026-07-25):
-- Os `delete from` são funções de RETENÇÃO triplamente gated (APPROVE_MILREU_RETENTION_RUN/APPLY_MILREU_RETENTION_POLICY/APPLY_MILREU_PRODUCTION_RETENTION); só removem dados operacionais efémeros (notificações/outbox/deliveries/resultados). Auditoria, incidentes e contributos NÃO são eliminados automaticamente. Sob service_role via workflow protegido, nunca pelo browser.
-- Não altera schema nem toca dados canónicos do Museu. Marcador após revisão.

-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08I — RPCs de administração, auditoria, retenção e continuidade.

-- Compatibilidade: todas as chamadas anteriores continuam a usar esta assinatura.
create or replace function public.collab_record_audit(
  action_name text,
  entity_name text,
  entity_identifier text,
  previous_data jsonb default null,
  next_data jsonb default null,
  extra_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  request_value text:=nullif(current_setting('request.headers',true),'');
  correlation_value uuid;
begin
  begin
    correlation_value:=nullif(extra_metadata->>'correlationId','')::uuid;
  exception when invalid_text_representation then
    correlation_value:=null;
  end;

  insert into public.collab_audit_log(
    project_id,actor_user_id,action,entity_type,entity_id,
    before_data,after_data,metadata,event_category,severity,
    request_id,correlation_id,redaction_version
  ) values (
    public.collab_project_id(),auth.uid(),action_name,entity_name,entity_identifier,
    public.collab_redact_json_08i(previous_data),
    public.collab_redact_json_08i(next_data),
    coalesce(public.collab_redact_json_08i(extra_metadata),'{}'::jsonb),
    public.collab_audit_category_08i(action_name),
    public.collab_audit_severity_08i(action_name),
    case when request_value is null then null
      else encode(digest(request_value,'sha256'),'hex') end,
    correlation_value,1
  );
end;
$$;

revoke all on function public.collab_record_audit(text,text,text,jsonb,jsonb,jsonb) from public;

create or replace function public.collab_audit_changed_keys_08i(
  p_before jsonb,
  p_after jsonb
)
returns text[]
language sql
immutable
as $$
  with keys as (
    select key from jsonb_object_keys(coalesce(p_before,'{}'::jsonb)) key
    union
    select key from jsonb_object_keys(coalesce(p_after,'{}'::jsonb)) key
  )
  select coalesce(array_agg(key order by key),'{}'::text[]) from keys
$$;

create or replace function public.collab_search_audit_08i(
  p_query text default null,
  p_action text default null,
  p_entity_type text default null,
  p_severity text default null,
  p_category text default null,
  p_actor_user_id uuid default null,
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_limit integer default 100,
  p_offset integer default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  bounded_limit integer;
  bounded_offset integer:=greatest(0,coalesce(p_offset,0));
  result jsonb;
begin
  if not public.collab_has_permission('audit.search',project_uuid)
     and not public.collab_has_permission('audit.view',project_uuid)
  then raise exception 'permission_denied'; end if;

  bounded_limit:=greatest(
    1,
    least(
      coalesce(p_limit,100),
      case when public.collab_has_permission('audit.export',project_uuid) then 5000 else 200 end
    )
  );

  with filtered as (
    select audit.*,profile.display_name actor_name
    from public.collab_audit_log audit
    left join public.collab_profiles profile on profile.user_id=audit.actor_user_id
    where audit.project_id=project_uuid
      and (p_query is null or concat_ws(' ',audit.action,audit.entity_type,audit.entity_id,profile.display_name) ilike '%'||trim(p_query)||'%')
      and (p_action is null or audit.action=p_action)
      and (p_entity_type is null or audit.entity_type=p_entity_type)
      and (p_severity is null or audit.severity=p_severity)
      and (p_category is null or audit.event_category=p_category)
      and (p_actor_user_id is null or audit.actor_user_id=p_actor_user_id)
      and (p_from is null or audit.created_at>=p_from)
      and (p_to is null or audit.created_at<=p_to)
  ),
  page as (
    select *
    from filtered
    order by created_at desc,id desc
    limit bounded_limit offset bounded_offset
  )
  select jsonb_build_object(
    'total',(select count(*) from filtered),
    'limit',bounded_limit,
    'offset',bounded_offset,
    'rows',coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',id,
          'actorUserId',actor_user_id,
          'actorName',coalesce(actor_name,'Sistema'),
          'action',action,
          'entityType',entity_type,
          'entityId',entity_id,
          'category',event_category,
          'severity',severity,
          'changedKeys',public.collab_audit_changed_keys_08i(before_data,after_data),
          'metadata',coalesce(metadata,'{}'::jsonb),
          'correlationId',correlation_id,
          'eventHash',event_hash,
          'previousHash',previous_hash,
          'createdAt',created_at
        )
        order by created_at desc,id desc
      ) from page
    ),'[]'::jsonb)
  ) into result;

  return result;
end;
$$;

create or replace function public.collab_verify_audit_chain_08i(
  p_from_id bigint default null,
  p_to_id bigint default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  audit_row record;
  previous_value text:=null;
  computed_value text;
  checked_count integer:=0;
  first_break bigint:=null;
begin
  if not public.collab_has_permission('audit.integrity',project_uuid) then
    raise exception 'permission_denied';
  end if;

  if p_from_id is not null then
    select event_hash into previous_value
    from public.collab_audit_log
    where project_id=project_uuid and id<p_from_id
    order by id desc limit 1;
  end if;

  for audit_row in
    select *
    from public.collab_audit_log
    where project_id=project_uuid
      and (p_from_id is null or id>=p_from_id)
      and (p_to_id is null or id<=p_to_id)
    order by id
  loop
    computed_value:=encode(
      digest(
        concat_ws('|',
          audit_row.id::text,
          coalesce(audit_row.project_id::text,''),
          coalesce(audit_row.actor_user_id::text,''),
          audit_row.action,
          audit_row.entity_type,
          coalesce(audit_row.entity_id,''),
          audit_row.before_data::text,
          audit_row.after_data::text,
          audit_row.metadata::text,
          audit_row.created_at::text,
          coalesce(previous_value,'')
        ),
        'sha256'
      ),
      'hex'
    );
    checked_count:=checked_count+1;
    if audit_row.previous_hash is distinct from previous_value
       or audit_row.event_hash is distinct from computed_value
    then
      first_break:=audit_row.id;
      exit;
    end if;
    previous_value:=audit_row.event_hash;
  end loop;

  return jsonb_build_object(
    'valid',first_break is null,
    'checkedCount',checked_count,
    'firstBreakId',first_break,
    'lastHash',previous_value,
    'verifiedAt',now()
  );
end;
$$;

create or replace function public.collab_operations_workspace_08i()
returns jsonb
language plpgsql
stable
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  can_operations boolean:=public.collab_has_permission('operations.view',project_uuid);
  can_retention boolean:=public.collab_has_permission('retention.view',project_uuid);
  can_incidents boolean:=public.collab_has_permission('incidents.view',project_uuid);
  can_backups boolean:=public.collab_has_permission('backups.view',project_uuid);
  can_continuity boolean:=public.collab_has_permission('continuity.view',project_uuid);
  can_health boolean:=public.collab_has_permission('health.view',project_uuid);
  can_audit boolean:=public.collab_has_permission('audit.search',project_uuid)
    or public.collab_has_permission('audit.view',project_uuid);
begin
  if not (can_operations or can_retention or can_incidents or can_backups or can_continuity or can_health or can_audit) then
    raise exception 'permission_denied';
  end if;

  return jsonb_build_object(
    'settings',case when can_operations then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'code',code,'category',category,'value',value_json,
          'status',status,'description',description,'updatedAt',updated_at
        ) order by category,code
      )
      from public.collab_operational_settings
      where project_id=project_uuid
    ),'[]'::jsonb) else '[]'::jsonb end,
    'retentionPolicies',case when can_retention then coalesce((
      select jsonb_agg(to_jsonb(policy)-'project_id'-'updated_by' order by code)
      from public.collab_retention_policies policy
      where project_id=project_uuid
    ),'[]'::jsonb) else '[]'::jsonb end,
    'legalHolds',case when can_retention then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',hold.id,'resourceType',hold.resource_type,'entityId',hold.entity_id,
          'reason',hold.reason,'status',hold.status,'startsAt',hold.starts_at,
          'endsAt',hold.ends_at,'createdAt',hold.created_at
        ) order by hold.created_at desc
      )
      from public.collab_legal_holds hold
      where hold.project_id=project_uuid
    ),'[]'::jsonb) else '[]'::jsonb end,
    'lifecycleRuns',case when can_retention then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',run.id,'policyCode',run.policy_code,'environment',run.environment,
          'mode',run.mode,'status',run.status,'cutoffAt',run.cutoff_at,
          'candidateCount',run.candidate_count,'affectedCount',run.affected_count,
          'excludedByHoldCount',run.excluded_by_hold_count,
          'candidateHash',run.candidate_hash,'summary',run.summary,
          'previewedAt',run.previewed_at,'approvedAt',run.approved_at,
          'completedAt',run.completed_at,'errorMessage',run.error_message
        ) order by run.previewed_at desc
      )
      from (
        select * from public.collab_lifecycle_runs
        where project_id=project_uuid
        order by previewed_at desc limit 100
      ) run
    ),'[]'::jsonb) else '[]'::jsonb end,
    'incidents',case when can_incidents then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',incident.id,'reference',incident.reference,'title',incident.title,
          'description',incident.description,'category',incident.category,
          'severity',incident.severity,'status',incident.status,
          'environment',incident.environment,'impactSummary',incident.impact_summary,
          'detectedAt',incident.detected_at,'acknowledgedAt',incident.acknowledged_at,
          'mitigatedAt',incident.mitigated_at,'resolvedAt',incident.resolved_at,
          'closedAt',incident.closed_at,'ownerUserId',incident.owner_user_id,
          'publicSummary',incident.public_summary,'updatedAt',incident.updated_at
        ) order by incident.detected_at desc
      )
      from public.collab_incidents incident
      where incident.project_id=project_uuid
    ),'[]'::jsonb) else '[]'::jsonb end,
    'incidentUpdates',case when can_incidents then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',update_row.id,'incidentId',update_row.incident_id,
          'updateType',update_row.update_type,'body',update_row.body,
          'statusAfter',update_row.status_after,'createdBy',update_row.created_by,
          'createdAt',update_row.created_at
        ) order by update_row.created_at desc
      )
      from public.collab_incident_updates update_row
      join public.collab_incidents incident on incident.id=update_row.incident_id
      where incident.project_id=project_uuid
    ),'[]'::jsonb) else '[]'::jsonb end,
    'incidentActions',case when can_incidents then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',action_row.id,'incidentId',action_row.incident_id,
          'title',action_row.title,'description',action_row.description,
          'status',action_row.status,'priority',action_row.priority,
          'assignedTo',action_row.assigned_to,'dueAt',action_row.due_at,
          'completedAt',action_row.completed_at,'updatedAt',action_row.updated_at
        ) order by action_row.created_at desc
      )
      from public.collab_incident_actions action_row
      join public.collab_incidents incident on incident.id=action_row.incident_id
      where incident.project_id=project_uuid
    ),'[]'::jsonb) else '[]'::jsonb end,
    'backupPlans',case when can_backups then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',plan.id,'code',plan.code,'name',plan.name,
          'backupType',plan.backup_type,'provider',plan.provider,
          'frequency',plan.frequency,'retentionDays',plan.retention_days,
          'targetRpoMinutes',plan.target_rpo_minutes,
          'targetRtoMinutes',plan.target_rto_minutes,'status',plan.status,
          'instructionsReference',plan.instructions_reference,
          'responsibleUserId',plan.responsible_user_id,
          'secondaryUserId',plan.secondary_user_id,
          'lastSuccessfulAt',plan.last_successful_at,
          'nextDueAt',plan.next_due_at,'updatedAt',plan.updated_at
        ) order by plan.code
      )
      from public.collab_backup_plans plan
      where plan.project_id=project_uuid
    ),'[]'::jsonb) else '[]'::jsonb end,
    'backupVerifications',case when can_backups then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',verification.id,'planId',verification.plan_id,
          'status',verification.status,
          'backupObservedAt',verification.backup_observed_at,
          'verifiedAt',verification.verified_at,
          'restoreTested',verification.restore_tested,
          'evidenceReference',verification.evidence_reference,
          'notes',verification.notes,'verifiedBy',verification.verified_by
        ) order by verification.verified_at desc
      )
      from public.collab_backup_verifications verification
      join public.collab_backup_plans plan on plan.id=verification.plan_id
      where plan.project_id=project_uuid
    ),'[]'::jsonb) else '[]'::jsonb end,
    'continuityExercises',case when can_continuity then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',exercise.id,'title',exercise.title,'scenario',exercise.scenario,
          'status',exercise.status,'objectives',exercise.objectives,
          'scheduledAt',exercise.scheduled_at,'startedAt',exercise.started_at,
          'completedAt',exercise.completed_at,
          'targetRtoMinutes',exercise.target_rto_minutes,
          'targetRpoMinutes',exercise.target_rpo_minutes,
          'actualRecoveryMinutes',exercise.actual_recovery_minutes,
          'resultSummary',exercise.result_summary,
          'evidenceReference',exercise.evidence_reference,
          'coordinatorUserId',exercise.coordinator_user_id,
          'updatedAt',exercise.updated_at
        ) order by coalesce(exercise.scheduled_at,exercise.created_at) desc
      )
      from public.collab_continuity_exercises exercise
      where exercise.project_id=project_uuid
    ),'[]'::jsonb) else '[]'::jsonb end,
    'checkCatalog',case when can_health then coalesce((
      select jsonb_agg(to_jsonb(check_row) order by sort_order,code)
      from public.collab_operational_check_catalog check_row
      where active
    ),'[]'::jsonb) else '[]'::jsonb end,
    'operationalRuns',case when can_health then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',run.id,'environment',run.environment,'version',run.version,
          'commitSha',run.commit_sha,'status',run.status,'summary',run.summary,
          'startedAt',run.started_at,'completedAt',run.completed_at
        ) order by run.started_at desc
      )
      from (
        select * from public.collab_operational_runs
        where project_id=project_uuid order by started_at desc limit 50
      ) run
    ),'[]'::jsonb) else '[]'::jsonb end,
    'operationalResults',case when can_health then coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',result.id,'runId',result.run_id,'checkCode',result.check_code,
          'status',result.status,'evidenceReference',result.evidence_reference,
          'notes',result.notes,'checkedAt',result.checked_at
        ) order by result.created_at
      )
      from public.collab_operational_results result
      join public.collab_operational_runs run on run.id=result.run_id
      where run.project_id=project_uuid
        and run.id in (
          select id from public.collab_operational_runs
          where project_id=project_uuid order by started_at desc limit 10
        )
    ),'[]'::jsonb) else '[]'::jsonb end,
    'summary',jsonb_build_object(
      'openCriticalIncidents',case when can_incidents then (
        select count(*) from public.collab_incidents
        where project_id=project_uuid
          and severity in ('sev-1','sev-2')
          and status not in ('resolved','closed','cancelled')
      ) else 0 end,
      'activeLegalHolds',case when can_retention then (
        select count(*) from public.collab_legal_holds
        where project_id=project_uuid and status='active'
      ) else 0 end,
      'failedBackupVerifications',case when can_backups then (
        select count(*) from public.collab_backup_verifications verification
        join public.collab_backup_plans plan on plan.id=verification.plan_id
        where plan.project_id=project_uuid and verification.status='failed'
          and verification.verified_at>=now()-interval '30 days'
      ) else 0 end,
      'latestOperationalStatus',case when can_health then coalesce((
        select status from public.collab_operational_runs
        where project_id=project_uuid order by started_at desc limit 1
      ),'not-run') else 'hidden' end,
      'auditEvents30Days',case when can_audit then (
        select count(*) from public.collab_audit_log
        where project_id=project_uuid and created_at>=now()-interval '30 days'
      ) else 0 end
    )
  );
end;
$$;

create or replace function public.collab_upsert_operational_setting_08i(
  p_code text,
  p_category text,
  p_value jsonb,
  p_status text,
  p_description text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('operations.settings.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_value::text ~* '(service[_-]?role|secret|password|access[_-]?token|refresh[_-]?token|private[_-]?key|webhook[_-]?token)' then
    raise exception 'sensitive_setting_not_allowed';
  end if;

  insert into public.collab_operational_settings(
    project_id,code,category,value_json,status,description,updated_by
  ) values (
    project_uuid,trim(p_code),p_category,coalesce(p_value,'{}'::jsonb),
    p_status,nullif(trim(p_description),''),auth.uid()
  )
  on conflict(project_id,code) do update set
    category=excluded.category,value_json=excluded.value_json,
    status=excluded.status,description=excluded.description,
    updated_by=auth.uid(),updated_at=now()
  returning to_jsonb(collab_operational_settings)-'project_id'-'updated_by' into result;

  perform public.collab_record_audit(
    'setting.updated','operational_setting',p_code,null,
    jsonb_build_object('code',p_code,'category',p_category,'status',p_status),
    '{}'::jsonb
  );
  return result;
end;
$$;

create or replace function public.collab_start_operational_run_08i(
  p_environment text,
  p_version text default null,
  p_commit_sha text default null
)
returns uuid
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  run_uuid uuid;
begin
  if not public.collab_has_permission('health.run',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if exists(
    select 1 from public.collab_operational_runs
    where project_id=project_uuid and environment=p_environment and status='running'
  ) then raise exception 'operational_run_already_active'; end if;

  insert into public.collab_operational_runs(
    project_id,environment,version,commit_sha,status,started_by
  ) values (
    project_uuid,p_environment,nullif(trim(p_version),''),
    nullif(trim(p_commit_sha),''),'running',auth.uid()
  ) returning id into run_uuid;

  insert into public.collab_operational_results(run_id,check_code,status)
  select run_uuid,code,'pending'
  from public.collab_operational_check_catalog
  where active
  on conflict do nothing;

  perform public.collab_record_audit(
    'health.run.started','operational_run',run_uuid::text,null,
    jsonb_build_object('environment',p_environment,'version',p_version),
    '{}'::jsonb
  );
  return run_uuid;
end;
$$;

create or replace function public.collab_record_operational_result_08i(
  p_run_id uuid,
  p_check_code text,
  p_status text,
  p_evidence_reference text default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  catalog_row public.collab_operational_check_catalog%rowtype;
  result jsonb;
begin
  if not public.collab_has_permission('health.check',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if not exists(
    select 1 from public.collab_operational_runs
    where id=p_run_id and project_id=project_uuid and status='running'
  ) then raise exception 'active_operational_run_not_found'; end if;

  select * into catalog_row
  from public.collab_operational_check_catalog
  where code=p_check_code and active;
  if catalog_row.code is null then raise exception 'operational_check_not_found'; end if;
  if p_status not in ('pending','running','passed','failed','blocked','not-applicable') then
    raise exception 'invalid_operational_result_status';
  end if;
  if catalog_row.evidence_required
     and p_status in ('passed','failed','blocked')
     and nullif(trim(p_evidence_reference),'') is null
  then raise exception 'evidence_required'; end if;

  update public.collab_operational_results
  set status=p_status,evidence_reference=nullif(trim(p_evidence_reference),''),
      notes=nullif(trim(p_notes),''),checked_by=auth.uid(),
      checked_at=case when p_status in ('passed','failed','blocked','not-applicable') then now() else null end,
      updated_at=now()
  where run_id=p_run_id and check_code=p_check_code
  returning to_jsonb(collab_operational_results) into result;

  if result is null then raise exception 'operational_result_not_found'; end if;
  return result;
end;
$$;

create or replace function public.collab_complete_operational_run_08i(
  p_run_id uuid,
  p_summary text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  open_count integer;
  blocked_count integer;
  failed_count integer;
  result jsonb;
begin
  if not public.collab_has_permission('health.run',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if not exists(
    select 1 from public.collab_operational_runs
    where id=p_run_id and project_id=project_uuid and status='running'
  ) then raise exception 'active_operational_run_not_found'; end if;

  select
    count(*) filter(where result.status in ('pending','running')),
    count(*) filter(where result.status='blocked' or (catalog.blocking and result.status='failed')),
    count(*) filter(where result.status='failed')
  into open_count,blocked_count,failed_count
  from public.collab_operational_results result
  join public.collab_operational_check_catalog catalog on catalog.code=result.check_code
  where result.run_id=p_run_id;

  if open_count>0 then raise exception 'operational_checks_open'; end if;

  update public.collab_operational_runs
  set status=case
      when blocked_count>0 then 'blocked'
      when failed_count>0 then 'failed'
      else 'passed'
    end,
    summary=nullif(trim(p_summary),''),
    completed_by=auth.uid(),completed_at=now()
  where id=p_run_id
  returning to_jsonb(collab_operational_runs) into result;

  perform public.collab_record_audit(
    'health.run.completed','operational_run',p_run_id::text,null,
    jsonb_build_object('status',result->>'status','summary',p_summary),
    '{}'::jsonb
  );
  return result;
end;
$$;

-- Retenção e legal holds.

create or replace function public.collab_upsert_retention_policy_08i(
  p_code text,
  p_resource_type text,
  p_name text,
  p_retention_days integer,
  p_action text,
  p_automatic_allowed boolean,
  p_legal_hold_supported boolean,
  p_risk text,
  p_scope_description text,
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('retention.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_risk='critical' and p_automatic_allowed then
    raise exception 'critical_policy_cannot_be_automatic';
  end if;
  if p_automatic_allowed then
    raise exception 'automatic_retention_not_supported';
  end if;

  insert into public.collab_retention_policies(
    project_id,code,resource_type,name,retention_days,action,
    automatic_allowed,legal_hold_supported,risk,scope_description,status,updated_by
  ) values (
    project_uuid,trim(p_code),trim(p_resource_type),trim(p_name),
    p_retention_days,p_action,false,p_legal_hold_supported,p_risk,
    trim(p_scope_description),p_status,auth.uid()
  )
  on conflict(project_id,code) do update set
    resource_type=excluded.resource_type,name=excluded.name,
    retention_days=excluded.retention_days,action=excluded.action,
    automatic_allowed=false,legal_hold_supported=excluded.legal_hold_supported,
    risk=excluded.risk,scope_description=excluded.scope_description,
    status=excluded.status,updated_by=auth.uid(),updated_at=now()
  returning to_jsonb(collab_retention_policies)-'project_id'-'updated_by' into result;

  perform public.collab_record_audit(
    'retention.policy.updated','retention_policy',p_code,null,
    jsonb_build_object('code',p_code,'resourceType',p_resource_type,'action',p_action,'status',p_status),
    '{}'::jsonb
  );
  return result;
end;
$$;

create or replace function public.collab_create_legal_hold_08i(
  p_resource_type text,
  p_entity_id text,
  p_reason text,
  p_ends_at timestamptz default null
)
returns uuid
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  hold_uuid uuid;
begin
  if not public.collab_has_permission('legal-holds.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_reason),'') is null then raise exception 'reason_required'; end if;

  insert into public.collab_legal_holds(
    project_id,resource_type,entity_id,reason,ends_at,created_by
  ) values (
    project_uuid,trim(p_resource_type),nullif(trim(p_entity_id),''),
    trim(p_reason),p_ends_at,auth.uid()
  ) returning id into hold_uuid;

  perform public.collab_record_audit(
    'legal-hold.created','legal_hold',hold_uuid::text,null,
    jsonb_build_object('resourceType',p_resource_type,'entityId',p_entity_id,'endsAt',p_ends_at),
    '{}'::jsonb
  );
  return hold_uuid;
end;
$$;

create or replace function public.collab_release_legal_hold_08i(
  p_hold_id uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('legal-holds.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_reason),'') is null then raise exception 'reason_required'; end if;

  update public.collab_legal_holds
  set status='released',released_by=auth.uid(),released_at=now(),
      reason=reason||E'\nLibertação: '||trim(p_reason)
  where id=p_hold_id and project_id=project_uuid and status='active'
  returning to_jsonb(collab_legal_holds) into result;

  if result is null then raise exception 'active_legal_hold_not_found'; end if;
  perform public.collab_record_audit(
    'legal-hold.released','legal_hold',p_hold_id::text,null,
    jsonb_build_object('status','released','reason',p_reason),
    '{}'::jsonb
  );
  return result;
end;
$$;

create or replace function public.collab_retention_candidates_08i(
  p_policy_code text,
  p_cutoff_at timestamptz
)
returns table(entity_id text)
language plpgsql
stable
security definer
set search_path=public,extensions
as $$
begin
  if p_policy_code='expired-notifications' then
    return query
    select notification.id::text
    from public.collab_notifications notification
    where notification.project_id=public.collab_project_id()
      and notification.expires_at is not null
      and notification.expires_at<p_cutoff_at;
  elsif p_policy_code='notification-outbox-delivered' then
    return query
    select outbox.id::text
    from public.collab_notification_outbox outbox
    where outbox.project_id=public.collab_project_id()
      and outbox.status in ('delivered','cancelled')
      and outbox.updated_at<p_cutoff_at;
  elsif p_policy_code='notification-deliveries' then
    return query
    select delivery.id::text
    from public.collab_notification_deliveries delivery
    join public.collab_notification_outbox outbox on outbox.id=delivery.outbox_id
    where outbox.project_id=public.collab_project_id()
      and delivery.finished_at is not null
      and delivery.finished_at<p_cutoff_at;
  elsif p_policy_code='operational-results' then
    return query
    select result.id::text
    from public.collab_operational_results result
    join public.collab_operational_runs run on run.id=result.run_id
    where run.project_id=public.collab_project_id()
      and run.completed_at is not null
      and run.completed_at<p_cutoff_at
      and result.status in ('passed','not-applicable');
  else
    return;
  end if;
end;
$$;

create or replace function public.collab_preview_retention_run_08i(
  p_policy_code text,
  p_environment text
)
returns uuid
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  policy_row public.collab_retention_policies%rowtype;
  cutoff_value timestamptz;
  candidate_count_value integer;
  held_count_value integer;
  candidate_hash_value text;
  run_uuid uuid;
begin
  if not public.collab_has_permission('retention.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;

  select * into policy_row
  from public.collab_retention_policies
  where project_id=project_uuid and code=p_policy_code and status='active';
  if policy_row.code is null then raise exception 'active_retention_policy_not_found'; end if;
  if policy_row.action not in ('delete','anonymize') then
    raise exception 'policy_requires_manual_review';
  end if;

  cutoff_value:=now()-make_interval(days=>policy_row.retention_days);

  with candidates as (
    select entity_id from public.collab_retention_candidates_08i(p_policy_code,cutoff_value)
  ),
  classified as (
    select candidate.entity_id,
      exists(
        select 1 from public.collab_legal_holds hold
        where hold.project_id=project_uuid
          and hold.status='active'
          and hold.resource_type=policy_row.resource_type
          and (hold.entity_id is null or hold.entity_id=candidate.entity_id)
          and (hold.ends_at is null or hold.ends_at>now())
      ) held
    from candidates candidate
  )
  select count(*),count(*) filter(where held),
    encode(digest(coalesce(string_agg(entity_id,',' order by entity_id),''),'sha256'),'hex')
  into candidate_count_value,held_count_value,candidate_hash_value
  from classified;

  insert into public.collab_lifecycle_runs(
    project_id,policy_code,environment,mode,status,cutoff_at,
    candidate_count,excluded_by_hold_count,candidate_hash,
    summary,previewed_by
  ) values (
    project_uuid,p_policy_code,p_environment,'preview','previewed',cutoff_value,
    candidate_count_value,held_count_value,candidate_hash_value,
    jsonb_build_object(
      'resourceType',policy_row.resource_type,
      'action',policy_row.action,
      'retentionDays',policy_row.retention_days,
      'eligibleCount',candidate_count_value-held_count_value
    ),
    auth.uid()
  ) returning id into run_uuid;

  perform public.collab_record_audit(
    'retention.preview.created','lifecycle_run',run_uuid::text,null,
    jsonb_build_object(
      'policyCode',p_policy_code,'environment',p_environment,
      'candidateCount',candidate_count_value,'heldCount',held_count_value
    ),
    '{}'::jsonb
  );
  return run_uuid;
end;
$$;

create or replace function public.collab_approve_retention_run_08i(
  p_run_id uuid,
  p_confirmation text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('retention.approve',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_confirmation<>'APPROVE_MILREU_RETENTION_RUN' then
    raise exception 'literal_retention_approval_required';
  end if;

  update public.collab_lifecycle_runs
  set status='approved',approved_by=auth.uid(),approved_at=now()
  where id=p_run_id and project_id=project_uuid and status='previewed'
  returning to_jsonb(collab_lifecycle_runs) into result;

  if result is null then raise exception 'retention_run_not_approvable'; end if;

  perform public.collab_notify_permission_08h(
    project_uuid,'retention.manage','retention.run-approved',
    'lifecycle-run',p_run_id::text,
    'Execução de retenção aprovada',
    'Uma execução de retenção foi aprovada e aguarda aplicação protegida.',
    '#/area-colaborativa/gestao/auditoria','warning',
    jsonb_build_object('reference',p_run_id::text,'status','approved'),
    'retention-approved:'||p_run_id::text
  );

  perform public.collab_record_audit(
    'retention.run.approved','lifecycle_run',p_run_id::text,null,
    jsonb_build_object('status','approved'), '{}'::jsonb
  );
  return result;
end;
$$;

create or replace function public.collab_cancel_retention_run_08i(
  p_run_id uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('retention.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_reason),'') is null then raise exception 'reason_required'; end if;

  update public.collab_lifecycle_runs
  set status='cancelled',error_message='Cancelado: '||trim(p_reason),completed_at=now()
  where id=p_run_id and project_id=project_uuid
    and status in ('previewed','awaiting-approval','approved')
  returning to_jsonb(collab_lifecycle_runs) into result;

  if result is null then raise exception 'retention_run_not_cancellable'; end if;
  perform public.collab_record_audit(
    'retention.run.cancelled','lifecycle_run',p_run_id::text,null,
    jsonb_build_object('status','cancelled','reason',p_reason), '{}'::jsonb
  );
  return result;
end;
$$;

create or replace function public.collab_apply_retention_run_08i(
  p_run_id uuid,
  p_confirmation text,
  p_production_confirmation text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  run_row public.collab_lifecycle_runs%rowtype;
  policy_row public.collab_retention_policies%rowtype;
  current_hash text;
  held_count integer;
  affected integer:=0;
begin
  if current_user not in ('postgres','service_role','supabase_admin') then
    raise exception 'service_role_required';
  end if;
  if p_confirmation<>'APPLY_MILREU_RETENTION_POLICY' then
    raise exception 'literal_retention_apply_required';
  end if;

  select * into run_row
  from public.collab_lifecycle_runs
  where id=p_run_id and status='approved'
  for update;
  if run_row.id is null then raise exception 'approved_retention_run_not_found'; end if;

  if run_row.environment='production'
     and p_production_confirmation<>'APPLY_MILREU_PRODUCTION_RETENTION'
  then raise exception 'literal_production_retention_required'; end if;

  select * into policy_row
  from public.collab_retention_policies
  where project_id=run_row.project_id and code=run_row.policy_code and status='active';
  if policy_row.code is null then raise exception 'active_retention_policy_not_found'; end if;
  if policy_row.action<>'delete' then raise exception 'retention_action_not_supported'; end if;

  select
    encode(digest(coalesce(string_agg(candidate.entity_id,',' order by candidate.entity_id),''),'sha256'),'hex'),
    count(*) filter(where exists(
      select 1 from public.collab_legal_holds hold
      where hold.project_id=run_row.project_id
        and hold.status='active'
        and hold.resource_type=policy_row.resource_type
        and (hold.entity_id is null or hold.entity_id=candidate.entity_id)
        and (hold.ends_at is null or hold.ends_at>now())
    ))
  into current_hash,held_count
  from public.collab_retention_candidates_08i(run_row.policy_code,run_row.cutoff_at) candidate;

  if current_hash is distinct from run_row.candidate_hash then
    raise exception 'candidate_set_changed';
  end if;
  if held_count<>run_row.excluded_by_hold_count then
    raise exception 'legal_hold_set_changed';
  end if;

  update public.collab_lifecycle_runs
  set status='applying',mode='apply',applied_by=current_user,applied_at=now()
  where id=p_run_id;

  if run_row.policy_code='expired-notifications' then
    delete from public.collab_notifications target
    where target.id::text in (
      select candidate.entity_id
      from public.collab_retention_candidates_08i(run_row.policy_code,run_row.cutoff_at) candidate
      where not exists(
        select 1 from public.collab_legal_holds hold
        where hold.project_id=run_row.project_id and hold.status='active'
          and hold.resource_type=policy_row.resource_type
          and (hold.entity_id is null or hold.entity_id=candidate.entity_id)
          and (hold.ends_at is null or hold.ends_at>now())
      )
    );
    get diagnostics affected=row_count;
  elsif run_row.policy_code='notification-outbox-delivered' then
    delete from public.collab_notification_outbox target
    where target.id::text in (
      select candidate.entity_id
      from public.collab_retention_candidates_08i(run_row.policy_code,run_row.cutoff_at) candidate
      where not exists(
        select 1 from public.collab_legal_holds hold
        where hold.project_id=run_row.project_id and hold.status='active'
          and hold.resource_type=policy_row.resource_type
          and (hold.entity_id is null or hold.entity_id=candidate.entity_id)
          and (hold.ends_at is null or hold.ends_at>now())
      )
    );
    get diagnostics affected=row_count;
  elsif run_row.policy_code='notification-deliveries' then
    delete from public.collab_notification_deliveries target
    where target.id::text in (
      select candidate.entity_id
      from public.collab_retention_candidates_08i(run_row.policy_code,run_row.cutoff_at) candidate
      where not exists(
        select 1 from public.collab_legal_holds hold
        where hold.project_id=run_row.project_id and hold.status='active'
          and hold.resource_type=policy_row.resource_type
          and (hold.entity_id is null or hold.entity_id=candidate.entity_id)
          and (hold.ends_at is null or hold.ends_at>now())
      )
    );
    get diagnostics affected=row_count;
  elsif run_row.policy_code='operational-results' then
    delete from public.collab_operational_results target
    where target.id::text in (
      select candidate.entity_id
      from public.collab_retention_candidates_08i(run_row.policy_code,run_row.cutoff_at) candidate
      where not exists(
        select 1 from public.collab_legal_holds hold
        where hold.project_id=run_row.project_id and hold.status='active'
          and hold.resource_type=policy_row.resource_type
          and (hold.entity_id is null or hold.entity_id=candidate.entity_id)
          and (hold.ends_at is null or hold.ends_at>now())
      )
    );
    get diagnostics affected=row_count;
  else
    raise exception 'retention_policy_not_applicable';
  end if;

  update public.collab_lifecycle_runs
  set status='completed',affected_count=affected,completed_at=now(),error_message=null
  where id=p_run_id;

  insert into public.collab_audit_log(
    project_id,actor_user_id,action,entity_type,entity_id,
    before_data,after_data,metadata,event_category,severity
  ) values (
    run_row.project_id,null,'retention.applied','lifecycle_run',p_run_id::text,
    null,jsonb_build_object('affectedCount',affected),
    jsonb_build_object('policyCode',run_row.policy_code,'environment',run_row.environment),
    'retention','critical'
  );

  return jsonb_build_object(
    'runId',p_run_id,'status','completed','affectedCount',affected,
    'environment',run_row.environment
  );
exception when others then
  update public.collab_lifecycle_runs
  set status='failed',error_message=left(sqlerrm,1000),completed_at=now()
  where id=p_run_id and status='applying';
  raise;
end;
$$;

-- Incidentes.

create or replace function public.collab_create_incident_08i(
  p_title text,
  p_description text,
  p_category text,
  p_severity text,
  p_environment text,
  p_impact_summary text default null,
  p_owner_user_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  incident_uuid uuid;
  reference_value text;
begin
  if not public.collab_has_permission('incidents.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  perform pg_advisory_xact_lock(hashtext('milreu-incidents-'||extract(year from now())::text));
  reference_value:='INC-'||to_char(now(),'YYYY')||'-'||
    lpad((
      select (count(*)+1)::text from public.collab_incidents
      where project_id=project_uuid and reference like 'INC-'||to_char(now(),'YYYY')||'-%'
    ),3,'0');

  insert into public.collab_incidents(
    project_id,reference,title,description,category,severity,status,
    environment,impact_summary,owner_user_id,created_by
  ) values (
    project_uuid,reference_value,trim(p_title),trim(p_description),
    p_category,p_severity,'open',p_environment,
    nullif(trim(p_impact_summary),''),p_owner_user_id,auth.uid()
  ) returning id into incident_uuid;

  insert into public.collab_incident_updates(
    incident_id,update_type,body,status_after,created_by
  ) values (
    incident_uuid,'status','Incidente aberto.','open',auth.uid()
  );

  perform public.collab_notify_permission_08h(
    project_uuid,'incidents.manage','incident.opened',
    'incident',incident_uuid::text,
    'Incidente aberto: '||trim(p_title),
    'Foi aberto o incidente '||reference_value||'.',
    '#/area-colaborativa/gestao/incidentes/'||incident_uuid::text,
    'critical',
    jsonb_build_object(
      'title',p_title,'status','open','reference',reference_value,
      'action_url','#/area-colaborativa/gestao/incidentes/'||incident_uuid::text
    ),
    'incident-opened:'||incident_uuid::text
  );

  if p_owner_user_id is not null then
    perform public.collab_create_notification_08h(
      project_uuid,p_owner_user_id,'incident.assigned','incident',incident_uuid::text,
      'Incidente atribuído: '||trim(p_title),
      'O incidente '||reference_value||' foi-lhe atribuído.',
      '#/area-colaborativa/gestao/incidentes/'||incident_uuid::text,
      'warning',
      jsonb_build_object(
        'title',p_title,'role','responsável','reference',reference_value,
        'action_url','#/area-colaborativa/gestao/incidentes/'||incident_uuid::text
      ),
      'incident-assigned:'||incident_uuid::text||':'||p_owner_user_id::text
    );
  end if;

  perform public.collab_record_audit(
    'incident.opened','incident',incident_uuid::text,null,
    jsonb_build_object(
      'reference',reference_value,'title',p_title,'category',p_category,
      'severity',p_severity,'environment',p_environment
    ),
    '{}'::jsonb
  );
  return incident_uuid;
end;
$$;

create or replace function public.collab_update_incident_08i(
  p_incident_id uuid,
  p_status text,
  p_owner_user_id uuid,
  p_impact_summary text,
  p_public_summary text,
  p_update_body text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  before_row public.collab_incidents%rowtype;
  result jsonb;
begin
  if not public.collab_has_permission('incidents.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status in ('resolved','closed') and not public.collab_has_permission('incidents.close',project_uuid) then
    raise exception 'close_permission_required';
  end if;
  if nullif(trim(p_update_body),'') is null then raise exception 'incident_update_required'; end if;

  select * into before_row
  from public.collab_incidents
  where id=p_incident_id and project_id=project_uuid
  for update;
  if before_row.id is null then raise exception 'incident_not_found'; end if;

  update public.collab_incidents
  set status=p_status,owner_user_id=p_owner_user_id,
      impact_summary=nullif(trim(p_impact_summary),''),
      public_summary=nullif(trim(p_public_summary),''),
      acknowledged_at=case
        when p_status in ('investigating','mitigating','monitoring','resolved','closed')
          then coalesce(acknowledged_at,now()) else acknowledged_at end,
      mitigated_at=case
        when p_status in ('monitoring','resolved','closed')
          then coalesce(mitigated_at,now()) else mitigated_at end,
      resolved_at=case
        when p_status in ('resolved','closed')
          then coalesce(resolved_at,now()) else resolved_at end,
      closed_at=case when p_status='closed' then now() else closed_at end,
      closed_by=case when p_status='closed' then auth.uid() else closed_by end,
      updated_at=now()
  where id=p_incident_id
  returning to_jsonb(collab_incidents) into result;

  insert into public.collab_incident_updates(
    incident_id,update_type,body,status_after,created_by
  ) values (
    p_incident_id,
    case when p_status in ('resolved','closed') then 'resolution' else 'status' end,
    trim(p_update_body),p_status,auth.uid()
  );

  if p_owner_user_id is distinct from before_row.owner_user_id and p_owner_user_id is not null then
    perform public.collab_create_notification_08h(
      project_uuid,p_owner_user_id,'incident.assigned','incident',p_incident_id::text,
      'Incidente atribuído: '||before_row.title,
      'O incidente '||before_row.reference||' foi-lhe atribuído.',
      '#/area-colaborativa/gestao/incidentes/'||p_incident_id::text,
      'warning',
      jsonb_build_object(
        'title',before_row.title,'role','responsável','reference',before_row.reference,
        'action_url','#/area-colaborativa/gestao/incidentes/'||p_incident_id::text
      ),
      'incident-assigned:'||p_incident_id::text||':'||p_owner_user_id::text
    );
  end if;

  if p_status='resolved' and before_row.status<>'resolved' then
    perform public.collab_notify_permission_08h(
      project_uuid,'incidents.view','incident.resolved',
      'incident',p_incident_id::text,
      'Incidente resolvido: '||before_row.title,
      'O incidente '||before_row.reference||' foi resolvido.',
      '#/area-colaborativa/gestao/incidentes/'||p_incident_id::text,
      'success',
      jsonb_build_object(
        'title',before_row.title,'status','resolved','reference',before_row.reference,
        'action_url','#/area-colaborativa/gestao/incidentes/'||p_incident_id::text
      ),
      'incident-resolved:'||p_incident_id::text
    );
  end if;

  perform public.collab_record_audit(
    'incident.updated','incident',p_incident_id::text,
    jsonb_build_object('status',before_row.status,'ownerUserId',before_row.owner_user_id),
    jsonb_build_object('status',p_status,'ownerUserId',p_owner_user_id),
    '{}'::jsonb
  );
  return result;
end;
$$;

create or replace function public.collab_add_incident_update_08i(
  p_incident_id uuid,
  p_update_type text,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  update_uuid uuid;
begin
  if not public.collab_has_permission('incidents.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if not exists(
    select 1 from public.collab_incidents where id=p_incident_id and project_id=project_uuid
  ) then raise exception 'incident_not_found'; end if;

  insert into public.collab_incident_updates(
    incident_id,update_type,body,created_by
  ) values (
    p_incident_id,p_update_type,trim(p_body),auth.uid()
  ) returning id into update_uuid;

  perform public.collab_record_audit(
    'incident.note.added','incident_update',update_uuid::text,null,
    jsonb_build_object('incidentId',p_incident_id,'updateType',p_update_type),
    '{}'::jsonb
  );
  return update_uuid;
end;
$$;

create or replace function public.collab_upsert_incident_action_08i(
  p_action_id uuid,
  p_incident_id uuid,
  p_title text,
  p_description text,
  p_status text,
  p_priority text,
  p_assigned_to uuid,
  p_due_at timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  before_assignee uuid;
  result jsonb;
  incident_row public.collab_incidents%rowtype;
begin
  if not public.collab_has_permission('incidents.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  select * into incident_row
  from public.collab_incidents where id=p_incident_id and project_id=project_uuid;
  if incident_row.id is null then raise exception 'incident_not_found'; end if;

  if p_action_id is null then
    insert into public.collab_incident_actions(
      incident_id,title,description,status,priority,assigned_to,due_at,created_by
    ) values (
      p_incident_id,trim(p_title),nullif(trim(p_description),''),
      p_status,p_priority,p_assigned_to,p_due_at,auth.uid()
    ) returning to_jsonb(collab_incident_actions) into result;
  else
    select assigned_to into before_assignee
    from public.collab_incident_actions
    where id=p_action_id and incident_id=p_incident_id;

    update public.collab_incident_actions
    set title=trim(p_title),description=nullif(trim(p_description),''),
        status=p_status,priority=p_priority,assigned_to=p_assigned_to,
        due_at=p_due_at,
        completed_at=case when p_status='completed' then coalesce(completed_at,now()) else null end,
        updated_at=now()
    where id=p_action_id and incident_id=p_incident_id
    returning to_jsonb(collab_incident_actions) into result;
  end if;

  if result is null then raise exception 'incident_action_not_found'; end if;
  if p_assigned_to is not null and p_assigned_to is distinct from before_assignee then
    perform public.collab_create_notification_08h(
      project_uuid,p_assigned_to,'incident.assigned','incident-action',result->>'id',
      'Ação de incidente atribuída: '||trim(p_title),
      'Foi-lhe atribuída uma ação do incidente '||incident_row.reference||'.',
      '#/area-colaborativa/gestao/incidentes/'||p_incident_id::text,
      'warning',
      jsonb_build_object(
        'title',p_title,'role','ação corretiva','reference',incident_row.reference,
        'action_url','#/area-colaborativa/gestao/incidentes/'||p_incident_id::text
      ),
      'incident-action-assigned:'||(result->>'id')||':'||p_assigned_to::text
    );
  end if;
  return result;
end;
$$;

-- Backups e continuidade.

create or replace function public.collab_upsert_backup_plan_08i(
  p_plan_id uuid,
  p_code text,
  p_name text,
  p_backup_type text,
  p_provider text,
  p_frequency text,
  p_retention_days integer,
  p_target_rpo_minutes integer,
  p_target_rto_minutes integer,
  p_status text,
  p_instructions_reference text,
  p_responsible_user_id uuid,
  p_secondary_user_id uuid,
  p_next_due_at timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('backups.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_responsible_user_id is not null and p_responsible_user_id=p_secondary_user_id then
    raise exception 'backup_secondary_must_differ';
  end if;

  if p_plan_id is null then
    insert into public.collab_backup_plans(
      project_id,code,name,backup_type,provider,frequency,retention_days,
      target_rpo_minutes,target_rto_minutes,status,instructions_reference,
      responsible_user_id,secondary_user_id,next_due_at,created_by,updated_by
    ) values (
      project_uuid,trim(p_code),trim(p_name),p_backup_type,p_provider,
      p_frequency,p_retention_days,p_target_rpo_minutes,p_target_rto_minutes,
      p_status,nullif(trim(p_instructions_reference),''),
      p_responsible_user_id,p_secondary_user_id,p_next_due_at,auth.uid(),auth.uid()
    ) returning to_jsonb(collab_backup_plans) into result;
  else
    update public.collab_backup_plans
    set code=trim(p_code),name=trim(p_name),backup_type=p_backup_type,
        provider=p_provider,frequency=p_frequency,retention_days=p_retention_days,
        target_rpo_minutes=p_target_rpo_minutes,target_rto_minutes=p_target_rto_minutes,
        status=p_status,instructions_reference=nullif(trim(p_instructions_reference),''),
        responsible_user_id=p_responsible_user_id,secondary_user_id=p_secondary_user_id,
        next_due_at=p_next_due_at,updated_by=auth.uid(),updated_at=now()
    where id=p_plan_id and project_id=project_uuid
    returning to_jsonb(collab_backup_plans) into result;
  end if;

  if result is null then raise exception 'backup_plan_not_found'; end if;
  perform public.collab_record_audit(
    'backup.plan.updated','backup_plan',result->>'id',null,
    jsonb_build_object(
      'code',p_code,'backupType',p_backup_type,'provider',p_provider,
      'frequency',p_frequency,'status',p_status
    ),
    '{}'::jsonb
  );
  return result;
end;
$$;

create or replace function public.collab_record_backup_verification_08i(
  p_plan_id uuid,
  p_status text,
  p_backup_observed_at timestamptz,
  p_restore_tested boolean,
  p_evidence_reference text,
  p_notes text
)
returns uuid
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  verification_uuid uuid;
  plan_row public.collab_backup_plans%rowtype;
begin
  if not public.collab_has_permission('backups.verify',project_uuid) then
    raise exception 'permission_denied';
  end if;
  select * into plan_row
  from public.collab_backup_plans
  where id=p_plan_id and project_id=project_uuid;
  if plan_row.id is null then raise exception 'backup_plan_not_found'; end if;
  if p_status in ('passed','partial','failed') and nullif(trim(p_evidence_reference),'') is null then
    raise exception 'backup_evidence_required';
  end if;

  insert into public.collab_backup_verifications(
    plan_id,status,backup_observed_at,restore_tested,
    evidence_reference,notes,verified_by
  ) values (
    p_plan_id,p_status,p_backup_observed_at,p_restore_tested,
    nullif(trim(p_evidence_reference),''),nullif(trim(p_notes),''),auth.uid()
  ) returning id into verification_uuid;

  if p_status='passed' then
    update public.collab_backup_plans
    set last_successful_at=coalesce(p_backup_observed_at,now()),updated_at=now()
    where id=p_plan_id;
  elsif p_status='failed' then
    perform public.collab_notify_permission_08h(
      project_uuid,'backups.manage','backup.verification-failed',
      'backup-verification',verification_uuid::text,
      'Verificação de backup falhou: '||plan_row.name,
      'A verificação do plano '||plan_row.code||' falhou.',
      '#/area-colaborativa/gestao/sistema',
      'critical',
      jsonb_build_object(
        'title',plan_row.name,'status','failed','reference',plan_row.code,
        'action_url','#/area-colaborativa/gestao/sistema'
      ),
      'backup-verification-failed:'||verification_uuid::text
    );
  end if;

  perform public.collab_record_audit(
    'backup.verification.recorded','backup_verification',verification_uuid::text,null,
    jsonb_build_object(
      'planId',p_plan_id,'status',p_status,'restoreTested',p_restore_tested,
      'evidenceReference',p_evidence_reference
    ),
    '{}'::jsonb
  );
  return verification_uuid;
end;
$$;

create or replace function public.collab_upsert_continuity_exercise_08i(
  p_exercise_id uuid,
  p_title text,
  p_scenario text,
  p_status text,
  p_objectives text,
  p_scheduled_at timestamptz,
  p_target_rto_minutes integer,
  p_target_rpo_minutes integer,
  p_actual_recovery_minutes integer,
  p_result_summary text,
  p_evidence_reference text,
  p_coordinator_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('continuity.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status='completed'
     and (nullif(trim(p_result_summary),'') is null or nullif(trim(p_evidence_reference),'') is null)
  then raise exception 'completed_exercise_requires_evidence'; end if;

  if p_exercise_id is null then
    insert into public.collab_continuity_exercises(
      project_id,title,scenario,status,objectives,scheduled_at,
      target_rto_minutes,target_rpo_minutes,actual_recovery_minutes,
      result_summary,evidence_reference,coordinator_user_id,created_by,
      started_at,completed_at
    ) values (
      project_uuid,trim(p_title),p_scenario,p_status,trim(p_objectives),
      p_scheduled_at,p_target_rto_minutes,p_target_rpo_minutes,
      p_actual_recovery_minutes,nullif(trim(p_result_summary),''),
      nullif(trim(p_evidence_reference),''),p_coordinator_user_id,auth.uid(),
      case when p_status='running' then now() else null end,
      case when p_status='completed' then now() else null end
    ) returning to_jsonb(collab_continuity_exercises) into result;
  else
    update public.collab_continuity_exercises
    set title=trim(p_title),scenario=p_scenario,status=p_status,
        objectives=trim(p_objectives),scheduled_at=p_scheduled_at,
        target_rto_minutes=p_target_rto_minutes,target_rpo_minutes=p_target_rpo_minutes,
        actual_recovery_minutes=p_actual_recovery_minutes,
        result_summary=nullif(trim(p_result_summary),''),
        evidence_reference=nullif(trim(p_evidence_reference),''),
        coordinator_user_id=p_coordinator_user_id,
        started_at=case when p_status='running' then coalesce(started_at,now()) else started_at end,
        completed_at=case when p_status='completed' then coalesce(completed_at,now()) else null end,
        updated_at=now()
    where id=p_exercise_id and project_id=project_uuid
    returning to_jsonb(collab_continuity_exercises) into result;
  end if;

  if result is null then raise exception 'continuity_exercise_not_found'; end if;
  perform public.collab_record_audit(
    'continuity.exercise.updated','continuity_exercise',result->>'id',null,
    jsonb_build_object(
      'title',p_title,'scenario',p_scenario,'status',p_status,
      'actualRecoveryMinutes',p_actual_recovery_minutes
    ),
    '{}'::jsonb
  );
  return result;
end;
$$;

-- Execução e fronteiras.

revoke all on function public.collab_search_audit_08i(text,text,text,text,text,uuid,timestamptz,timestamptz,integer,integer) from public;
revoke all on function public.collab_verify_audit_chain_08i(bigint,bigint) from public;
revoke all on function public.collab_operations_workspace_08i() from public;
revoke all on function public.collab_upsert_operational_setting_08i(text,text,jsonb,text,text) from public;
revoke all on function public.collab_start_operational_run_08i(text,text,text) from public;
revoke all on function public.collab_record_operational_result_08i(uuid,text,text,text,text) from public;
revoke all on function public.collab_complete_operational_run_08i(uuid,text) from public;
revoke all on function public.collab_upsert_retention_policy_08i(text,text,text,integer,text,boolean,boolean,text,text,text) from public;
revoke all on function public.collab_create_legal_hold_08i(text,text,text,timestamptz) from public;
revoke all on function public.collab_release_legal_hold_08i(uuid,text) from public;
revoke all on function public.collab_preview_retention_run_08i(text,text) from public;
revoke all on function public.collab_approve_retention_run_08i(uuid,text) from public;
revoke all on function public.collab_cancel_retention_run_08i(uuid,text) from public;
revoke all on function public.collab_apply_retention_run_08i(uuid,text,text) from public;
revoke all on function public.collab_create_incident_08i(text,text,text,text,text,text,uuid) from public;
revoke all on function public.collab_update_incident_08i(uuid,text,uuid,text,text,text) from public;
revoke all on function public.collab_add_incident_update_08i(uuid,text,text) from public;
revoke all on function public.collab_upsert_incident_action_08i(uuid,uuid,text,text,text,text,uuid,timestamptz) from public;
revoke all on function public.collab_upsert_backup_plan_08i(uuid,text,text,text,text,text,integer,integer,integer,text,text,uuid,uuid,timestamptz) from public;
revoke all on function public.collab_record_backup_verification_08i(uuid,text,timestamptz,boolean,text,text) from public;
revoke all on function public.collab_upsert_continuity_exercise_08i(uuid,text,text,text,text,timestamptz,integer,integer,integer,text,text,uuid) from public;

grant execute on function public.collab_search_audit_08i(text,text,text,text,text,uuid,timestamptz,timestamptz,integer,integer) to authenticated;
grant execute on function public.collab_verify_audit_chain_08i(bigint,bigint) to authenticated;
grant execute on function public.collab_operations_workspace_08i() to authenticated;
grant execute on function public.collab_upsert_operational_setting_08i(text,text,jsonb,text,text) to authenticated;
grant execute on function public.collab_start_operational_run_08i(text,text,text) to authenticated;
grant execute on function public.collab_record_operational_result_08i(uuid,text,text,text,text) to authenticated;
grant execute on function public.collab_complete_operational_run_08i(uuid,text) to authenticated;
grant execute on function public.collab_upsert_retention_policy_08i(text,text,text,integer,text,boolean,boolean,text,text,text) to authenticated;
grant execute on function public.collab_create_legal_hold_08i(text,text,text,timestamptz) to authenticated;
grant execute on function public.collab_release_legal_hold_08i(uuid,text) to authenticated;
grant execute on function public.collab_preview_retention_run_08i(text,text) to authenticated;
grant execute on function public.collab_approve_retention_run_08i(uuid,text) to authenticated;
grant execute on function public.collab_cancel_retention_run_08i(uuid,text) to authenticated;
grant execute on function public.collab_create_incident_08i(text,text,text,text,text,text,uuid) to authenticated;
grant execute on function public.collab_update_incident_08i(uuid,text,uuid,text,text,text) to authenticated;
grant execute on function public.collab_add_incident_update_08i(uuid,text,text) to authenticated;
grant execute on function public.collab_upsert_incident_action_08i(uuid,uuid,text,text,text,text,uuid,timestamptz) to authenticated;
grant execute on function public.collab_upsert_backup_plan_08i(uuid,text,text,text,text,text,integer,integer,integer,text,text,uuid,uuid,timestamptz) to authenticated;
grant execute on function public.collab_record_backup_verification_08i(uuid,text,timestamptz,boolean,text,text) to authenticated;
grant execute on function public.collab_upsert_continuity_exercise_08i(uuid,text,text,text,text,timestamptz,integer,integer,integer,text,text,uuid) to authenticated;

grant execute on function public.collab_apply_retention_run_08i(uuid,text,text) to service_role;