-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08K — RPCs auditadas do piloto controlado.
--
-- Toda a escrita passa por estas funções security definer, que verificam
-- autenticação, vínculo ativo, permissão, estado e relação membro↔ciclo,
-- e registam auditoria. Nenhuma escrita direta nas tabelas do piloto.

-- Criar/atualizar ciclo (staging obrigatório)
create or replace function public.collab_pilot_upsert_cycle(
  p_cycle_id uuid,
  p_code text,
  p_title text,
  p_objective text,
  p_baseline_release text,
  p_scope text default null,
  p_homologation_run_id uuid default null,
  p_starts_at timestamptz default null,
  p_ends_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_pilot_cycles;
begin
  if not public.collab_has_permission('pilot.manage', project_uuid) then
    raise exception 'permission_denied';
  end if;

  if p_cycle_id is null then
    insert into public.collab_pilot_cycles(
      project_id, environment, homologation_run_id, code, title, objective, scope,
      baseline_release, status, phase, starts_at, ends_at, owner_user_id, created_by
    ) values (
      project_uuid, 'staging', p_homologation_run_id, p_code, p_title, p_objective, nullif(trim(p_scope),''),
      p_baseline_release, 'draft', 'preparation', p_starts_at, p_ends_at, auth.uid(), auth.uid()
    )
    returning * into result_row;
    perform public.collab_record_audit('pilot.cycle.created','pilot_cycle',result_row.id::text,null,to_jsonb(result_row));
  else
    update public.collab_pilot_cycles
    set code=p_code, title=p_title, objective=p_objective, scope=nullif(trim(p_scope),''),
        baseline_release=p_baseline_release, homologation_run_id=p_homologation_run_id,
        starts_at=p_starts_at, ends_at=p_ends_at, updated_at=now()
    where id=p_cycle_id and project_id=project_uuid
    returning * into result_row;
    if result_row.id is null then raise exception 'cycle_not_found'; end if;
    perform public.collab_record_audit('pilot.cycle.updated','pilot_cycle',result_row.id::text,null,to_jsonb(result_row));
  end if;

  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_upsert_cycle(uuid,text,text,text,text,text,uuid,timestamptz,timestamptz) from public;
grant execute on function public.collab_pilot_upsert_cycle(uuid,text,text,text,text,text,uuid,timestamptz,timestamptz) to authenticated;

-- Transição de estado do ciclo (validação de transições permitidas)
create or replace function public.collab_pilot_transition_cycle(
  p_cycle_id uuid,
  p_status text,
  p_phase text default null,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  previous public.collab_pilot_cycles;
  result_row public.collab_pilot_cycles;
  allowed boolean := false;
begin
  if not public.collab_has_permission('pilot.manage', project_uuid) then
    raise exception 'permission_denied';
  end if;

  select * into previous from public.collab_pilot_cycles
  where id=p_cycle_id and project_id=project_uuid;
  if previous.id is null then raise exception 'cycle_not_found'; end if;

  if p_status not in ('draft','preparing','ready','running','paused','evaluating','completed','blocked','cancelled') then
    raise exception 'invalid_status';
  end if;

  -- staging-only e produção nunca escrita permanecem invariantes
  allowed := case
    when previous.status='draft' and p_status in ('preparing','cancelled') then true
    when previous.status='preparing' and p_status in ('ready','blocked','cancelled') then true
    when previous.status='ready' and p_status in ('running','preparing','blocked','cancelled') then true
    when previous.status='running' and p_status in ('paused','evaluating','blocked') then true
    when previous.status='paused' and p_status in ('running','blocked','cancelled') then true
    when previous.status='evaluating' and p_status in ('running','completed','blocked') then true
    when previous.status='blocked' and p_status in ('preparing','running','cancelled') then true
    when p_status=previous.status then true
    else false
  end;
  if not allowed then raise exception 'invalid_transition'; end if;

  update public.collab_pilot_cycles
  set status=p_status,
      phase=coalesce(p_phase, phase),
      updated_at=now()
  where id=p_cycle_id
  returning * into result_row;

  perform public.collab_record_audit(
    'pilot.cycle.transitioned','pilot_cycle',p_cycle_id::text,
    to_jsonb(previous), to_jsonb(result_row),
    jsonb_build_object('reason', nullif(trim(p_reason),''))
  );
  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_transition_cycle(uuid,text,text,text) from public;
grant execute on function public.collab_pilot_transition_cycle(uuid,text,text,text) to authenticated;

-- Inscrever participante (membro ativo; nunca auto-inscrição)
create or replace function public.collab_pilot_enrol_participant(
  p_cycle_id uuid,
  p_user_id uuid,
  p_participant_role text default 'participant',
  p_target_profile_type text default 'volunteer'
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_pilot_participants;
begin
  if not public.collab_has_permission('pilot.participants.manage', project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'self_enrolment_forbidden';
  end if;
  if not exists(
    select 1 from public.collab_project_memberships m
    where m.project_id=project_uuid and m.user_id=p_user_id and m.status='active'
  ) then
    raise exception 'member_not_active';
  end if;
  if p_participant_role not in ('participant','facilitator','observer') then
    raise exception 'invalid_participant_role';
  end if;

  insert into public.collab_pilot_participants(
    cycle_id, user_id, participant_role, target_profile_type, status, onboarding_status, invited_by
  ) values (
    p_cycle_id, p_user_id, p_participant_role, p_target_profile_type, 'invited', 'pending', auth.uid()
  )
  on conflict (cycle_id, user_id) do update
    set participant_role=excluded.participant_role,
        target_profile_type=excluded.target_profile_type,
        updated_at=now()
  returning * into result_row;

  perform public.collab_record_audit('pilot.participant.enrolled','pilot_participant',result_row.id::text,null,
    jsonb_build_object('cycleId',p_cycle_id,'role',p_participant_role));
  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_enrol_participant(uuid,uuid,text,text) from public;
grant execute on function public.collab_pilot_enrol_participant(uuid,uuid,text,text) to authenticated;

-- Confirmar a própria participação (self, com aceitação do notice)
create or replace function public.collab_pilot_confirm_participation(
  p_cycle_id uuid,
  p_notice_version text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  result_row public.collab_pilot_participants;
begin
  update public.collab_pilot_participants
  set status='confirmed',
      onboarding_status=case when onboarding_status='pending' then 'in-progress' else onboarding_status end,
      privacy_notice_version=p_notice_version,
      privacy_accepted_at=now(),
      confirmed_at=now(),
      updated_at=now()
  where cycle_id=p_cycle_id and user_id=auth.uid() and status in ('invited','confirmed')
  returning * into result_row;
  if result_row.id is null then raise exception 'participation_not_found'; end if;
  perform public.collab_record_audit('pilot.participant.confirmed','pilot_participant',result_row.id::text,null,
    jsonb_build_object('noticeVersion',p_notice_version));
  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_confirm_participation(uuid,text) from public;
grant execute on function public.collab_pilot_confirm_participation(uuid,text) to authenticated;

-- Retirada da própria participação (preserva histórico/auditoria)
create or replace function public.collab_pilot_withdraw_participation(
  p_cycle_id uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  result_row public.collab_pilot_participants;
begin
  update public.collab_pilot_participants
  set status='withdrawn', withdrawn_at=now(), updated_at=now()
  where cycle_id=p_cycle_id and user_id=auth.uid() and status in ('invited','confirmed','active')
  returning * into result_row;
  if result_row.id is null then raise exception 'participation_not_found'; end if;
  perform public.collab_record_audit('pilot.participant.withdrawn','pilot_participant',result_row.id::text,null,
    jsonb_build_object('reason', nullif(trim(p_reason),'')));
  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_withdraw_participation(uuid,text) from public;
grant execute on function public.collab_pilot_withdraw_participation(uuid,text) to authenticated;

-- Criar/atualizar cenário
create or replace function public.collab_pilot_upsert_scenario(
  p_scenario_id uuid,
  p_cycle_id uuid,
  p_code text,
  p_title text,
  p_description text,
  p_module_code text,
  p_expected_outcome text,
  p_route text default null,
  p_target_profile_type text default null,
  p_risk_level text default 'low',
  p_required boolean default true,
  p_sort_order integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_pilot_scenarios;
begin
  if not public.collab_has_permission('pilot.manage', project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_risk_level not in ('info','low','medium','high','critical') then
    raise exception 'invalid_risk_level';
  end if;

  if p_scenario_id is null then
    insert into public.collab_pilot_scenarios(
      cycle_id, code, title, description, module_code, route, target_profile_type,
      expected_outcome, risk_level, required, sort_order, created_by
    ) values (
      p_cycle_id, p_code, p_title, p_description, p_module_code, p_route, p_target_profile_type,
      p_expected_outcome, p_risk_level, p_required, p_sort_order, auth.uid()
    )
    on conflict (cycle_id, code) do update
      set title=excluded.title, description=excluded.description, module_code=excluded.module_code,
          route=excluded.route, target_profile_type=excluded.target_profile_type,
          expected_outcome=excluded.expected_outcome, risk_level=excluded.risk_level,
          required=excluded.required, sort_order=excluded.sort_order, updated_at=now()
    returning * into result_row;
  else
    update public.collab_pilot_scenarios
    set code=p_code, title=p_title, description=p_description, module_code=p_module_code,
        route=p_route, target_profile_type=p_target_profile_type, expected_outcome=p_expected_outcome,
        risk_level=p_risk_level, required=p_required, sort_order=p_sort_order, updated_at=now()
    where id=p_scenario_id
    returning * into result_row;
    if result_row.id is null then raise exception 'scenario_not_found'; end if;
  end if;

  perform public.collab_record_audit('pilot.scenario.upserted','pilot_scenario',result_row.id::text,null,
    jsonb_build_object('cycleId',p_cycle_id,'code',p_code));
  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_upsert_scenario(uuid,uuid,text,text,text,text,text,text,text,text,boolean,integer) from public;
grant execute on function public.collab_pilot_upsert_scenario(uuid,uuid,text,text,text,text,text,text,text,text,boolean,integer) to authenticated;

-- Agendar sessão
create or replace function public.collab_pilot_schedule_session(
  p_cycle_id uuid,
  p_scenario_id uuid,
  p_facilitator_user_id uuid default null,
  p_scheduled_start timestamptz default null,
  p_scheduled_end timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_pilot_sessions;
begin
  if not public.collab_has_permission('pilot.sessions.manage', project_uuid) then
    raise exception 'permission_denied';
  end if;
  insert into public.collab_pilot_sessions(
    cycle_id, scenario_id, facilitator_user_id, status, scheduled_start, scheduled_end, environment, created_by
  ) values (
    p_cycle_id, p_scenario_id, p_facilitator_user_id, 'scheduled', p_scheduled_start, p_scheduled_end, 'staging', auth.uid()
  )
  returning * into result_row;
  perform public.collab_record_audit('pilot.session.scheduled','pilot_session',result_row.id::text,null,
    jsonb_build_object('cycleId',p_cycle_id,'scenarioId',p_scenario_id));
  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_schedule_session(uuid,uuid,uuid,timestamptz,timestamptz) from public;
grant execute on function public.collab_pilot_schedule_session(uuid,uuid,uuid,timestamptz,timestamptz) to authenticated;

-- Concluir/bloquear sessão (a repetição cria nova sessão; nunca apaga histórico)
create or replace function public.collab_pilot_close_session(
  p_session_id uuid,
  p_status text,
  p_summary text default null,
  p_blocker_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  previous public.collab_pilot_sessions;
  result_row public.collab_pilot_sessions;
begin
  if not public.collab_has_permission('pilot.sessions.manage', project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status not in ('in-progress','completed','blocked','cancelled') then
    raise exception 'invalid_status';
  end if;
  select * into previous from public.collab_pilot_sessions where id=p_session_id;
  if previous.id is null then raise exception 'session_not_found'; end if;

  update public.collab_pilot_sessions
  set status=p_status,
      actual_start=case when p_status='in-progress' and actual_start is null then now() else actual_start end,
      actual_end=case when p_status in ('completed','blocked','cancelled') then now() else actual_end end,
      summary=coalesce(nullif(trim(p_summary),''), summary),
      blocker_reason=case when p_status='blocked' then nullif(trim(p_blocker_reason),'') else blocker_reason end,
      updated_at=now()
  where id=p_session_id
  returning * into result_row;

  perform public.collab_record_audit('pilot.session.closed','pilot_session',p_session_id::text,
    to_jsonb(previous), to_jsonb(result_row), jsonb_build_object('status',p_status));
  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_close_session(uuid,text,text,text) from public;
grant execute on function public.collab_pilot_close_session(uuid,text,text,text) to authenticated;

-- Submeter observação/feedback (participante; reported_by é sempre o próprio)
create or replace function public.collab_pilot_submit_observation(
  p_cycle_id uuid,
  p_observation_type text,
  p_summary text,
  p_description text,
  p_session_id uuid default null,
  p_severity text default 'info',
  p_module_code text default null,
  p_route text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  my_participant uuid;
  result_row public.collab_pilot_observations;
begin
  if not public.collab_has_permission('pilot.feedback.submit', project_uuid) then
    raise exception 'permission_denied';
  end if;
  -- Deve estar inscrito no ciclo para submeter feedback do piloto.
  select id into my_participant from public.collab_pilot_participants
  where cycle_id=p_cycle_id and user_id=auth.uid() and status in ('invited','confirmed','active','completed')
  limit 1;
  if my_participant is null and not public.collab_has_permission('pilot.feedback.manage', project_uuid) then
    raise exception 'not_in_cohort';
  end if;
  if p_observation_type not in ('functional','usability','accessibility','content','rights','privacy','performance','support','security','other') then
    raise exception 'invalid_observation_type';
  end if;
  if p_severity not in ('info','low','medium','high','critical') then
    raise exception 'invalid_severity';
  end if;

  insert into public.collab_pilot_observations(
    cycle_id, session_id, participant_id, reported_by, observation_type, severity, status,
    module_code, route, summary, description
  ) values (
    p_cycle_id, p_session_id, my_participant, auth.uid(), p_observation_type, p_severity, 'new',
    p_module_code, p_route, p_summary, p_description
  )
  returning * into result_row;

  perform public.collab_record_audit('pilot.observation.submitted','pilot_observation',result_row.id::text,null,
    jsonb_build_object('cycleId',p_cycle_id,'type',p_observation_type,'severity',p_severity));
  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_submit_observation(uuid,text,text,text,uuid,text,text,text) from public;
grant execute on function public.collab_pilot_submit_observation(uuid,text,text,text,uuid,text,text,text) to authenticated;

-- Triagem de observação (liga a tarefa/incidente; observação crítica bloqueia)
create or replace function public.collab_pilot_triage_observation(
  p_observation_id uuid,
  p_status text,
  p_assigned_to uuid default null,
  p_linked_task_id uuid default null,
  p_linked_incident_id uuid default null,
  p_resolution_summary text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  previous public.collab_pilot_observations;
  result_row public.collab_pilot_observations;
begin
  if not public.collab_has_permission('pilot.feedback.manage', project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status not in ('new','triaged','accepted','planned','resolved','rejected','duplicate') then
    raise exception 'invalid_status';
  end if;
  select * into previous from public.collab_pilot_observations where id=p_observation_id;
  if previous.id is null then raise exception 'observation_not_found'; end if;

  update public.collab_pilot_observations
  set status=p_status,
      assigned_to=coalesce(p_assigned_to, assigned_to),
      linked_task_id=coalesce(p_linked_task_id, linked_task_id),
      linked_incident_id=coalesce(p_linked_incident_id, linked_incident_id),
      resolution_summary=coalesce(nullif(trim(p_resolution_summary),''), resolution_summary),
      resolved_at=case when p_status='resolved' then now() else resolved_at end,
      updated_at=now()
  where id=p_observation_id
  returning * into result_row;

  perform public.collab_record_audit('pilot.observation.triaged','pilot_observation',p_observation_id::text,
    to_jsonb(previous), to_jsonb(result_row), jsonb_build_object('status',p_status));
  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_triage_observation(uuid,text,uuid,uuid,uuid,text) from public;
grant execute on function public.collab_pilot_triage_observation(uuid,text,uuid,uuid,uuid,text) to authenticated;

-- Registar evidência (referência privada; nunca conteúdo binário)
create or replace function public.collab_pilot_register_evidence(
  p_cycle_id uuid,
  p_evidence_type text,
  p_description text,
  p_session_id uuid default null,
  p_observation_id uuid default null,
  p_storage_path text default null,
  p_external_reference text default null,
  p_checksum text default null,
  p_sensitivity text default 'internal'
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_pilot_evidence;
begin
  if not public.collab_has_permission('pilot.evidence.manage', project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_evidence_type not in ('screenshot','log','document','export','approval','metric','video','audio','other') then
    raise exception 'invalid_evidence_type';
  end if;
  if p_sensitivity not in ('internal','restricted','personal') then
    raise exception 'invalid_sensitivity';
  end if;

  insert into public.collab_pilot_evidence(
    cycle_id, session_id, observation_id, evidence_type, storage_path, external_reference,
    checksum, sensitivity, redaction_status, description, captured_by
  ) values (
    p_cycle_id, p_session_id, p_observation_id, p_evidence_type, p_storage_path, p_external_reference,
    p_checksum, p_sensitivity,
    case when p_sensitivity in ('restricted','personal') then 'pending' else 'not-required' end,
    p_description, auth.uid()
  )
  returning * into result_row;

  -- Auditoria sem expor a referência bruta.
  perform public.collab_record_audit('pilot.evidence.registered','pilot_evidence',result_row.id::text,null,
    jsonb_build_object('cycleId',p_cycle_id,'type',p_evidence_type,'sensitivity',p_sensitivity));
  return jsonb_build_object('id',result_row.id,'evidenceType',result_row.evidence_type,'sensitivity',result_row.sensitivity,'redactionStatus',result_row.redaction_status);
end;
$$;

revoke all on function public.collab_pilot_register_evidence(uuid,text,text,uuid,uuid,text,text,text,text) from public;
grant execute on function public.collab_pilot_register_evidence(uuid,text,text,uuid,uuid,text,text,text,text) to authenticated;

-- Gerar snapshot de métricas internas do ciclo
create or replace function public.collab_pilot_generate_metric_snapshot(
  p_cycle_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  metrics jsonb;
begin
  if not public.collab_has_permission('pilot.manage', project_uuid) then
    raise exception 'permission_denied';
  end if;

  with counts as (
    select
      (select count(*) from public.collab_pilot_participants where cycle_id=p_cycle_id) as participants_total,
      (select count(*) from public.collab_pilot_participants where cycle_id=p_cycle_id and status='confirmed') as participants_confirmed,
      (select count(*) from public.collab_pilot_participants where cycle_id=p_cycle_id and status='withdrawn') as participants_withdrawn,
      (select count(*) from public.collab_pilot_sessions where cycle_id=p_cycle_id and status='completed') as sessions_completed,
      (select count(*) from public.collab_pilot_observations where cycle_id=p_cycle_id and severity='critical' and status not in ('resolved','rejected','duplicate')) as critical_open,
      (select count(*) from public.collab_pilot_gate_results where cycle_id=p_cycle_id and status='passed') as gates_passed
  )
  select to_jsonb(counts) into metrics from counts;

  insert into public.collab_pilot_metric_snapshots(cycle_id, metric_code, value_numeric, unit, scope, source, generated_by)
  values (p_cycle_id, 'pilot.summary', null, 'json', metrics, 'system', auth.uid());

  perform public.collab_record_audit('pilot.metrics.snapshot','pilot_cycle',p_cycle_id::text,null,metrics);
  return metrics;
end;
$$;

revoke all on function public.collab_pilot_generate_metric_snapshot(uuid) from public;
grant execute on function public.collab_pilot_generate_metric_snapshot(uuid) to authenticated;

-- Avaliar/registar resultado de um gate
create or replace function public.collab_pilot_set_gate_result(
  p_cycle_id uuid,
  p_gate_code text,
  p_status text,
  p_blocking boolean default true,
  p_evidence_summary text default null,
  p_waiver_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_pilot_gate_results;
begin
  if not public.collab_has_permission('pilot.gates.evaluate', project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status not in ('pending','passed','failed','blocked','waived','not-applicable') then
    raise exception 'invalid_status';
  end if;
  -- Um gate bloqueador não pode ser dispensado sem justificação registada.
  if p_status='waived' and p_blocking and nullif(trim(p_waiver_reason),'') is null then
    raise exception 'waiver_reason_required';
  end if;

  insert into public.collab_pilot_gate_results(
    cycle_id, gate_code, status, blocking, evidence_summary, waiver_reason, decided_by, decided_at
  ) values (
    p_cycle_id, p_gate_code, p_status, p_blocking, nullif(trim(p_evidence_summary),''),
    nullif(trim(p_waiver_reason),''), auth.uid(), now()
  )
  on conflict (cycle_id, gate_code) do update
    set status=excluded.status, blocking=excluded.blocking,
        evidence_summary=excluded.evidence_summary, waiver_reason=excluded.waiver_reason,
        decided_by=auth.uid(), decided_at=now(), updated_at=now()
  returning * into result_row;

  perform public.collab_record_audit('pilot.gate.evaluated','pilot_gate',result_row.id::text,null,
    jsonb_build_object('cycleId',p_cycle_id,'gate',p_gate_code,'status',p_status));
  return to_jsonb(result_row);
end;
$$;

revoke all on function public.collab_pilot_set_gate_result(uuid,text,text,boolean,text,text) from public;
grant execute on function public.collab_pilot_set_gate_result(uuid,text,text,boolean,text,text) to authenticated;

-- Aprovar homologação de staging: exige literal + zero gates bloqueadores por resolver
create or replace function public.collab_pilot_approve_staging_homologation(
  p_cycle_id uuid,
  p_confirmation text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  cycle_row public.collab_pilot_cycles;
  blocking_open integer;
  critical_open integer;
begin
  -- Apenas quem tem pilot.approve (o master, via '*') pode aprovar.
  if not public.collab_has_permission('pilot.approve', project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_confirmation <> 'APPROVE_MILREU_STAGING_HOMOLOGATION' then
    raise exception 'confirmation_required';
  end if;

  select * into cycle_row from public.collab_pilot_cycles
  where id=p_cycle_id and project_id=project_uuid;
  if cycle_row.id is null then raise exception 'cycle_not_found'; end if;

  -- A confirmação nunca substitui os gates: bloqueadores têm de estar aprovados.
  select count(*) into blocking_open
  from public.collab_pilot_gate_results
  where cycle_id=p_cycle_id and blocking and status not in ('passed','not-applicable','waived');
  if blocking_open > 0 then raise exception 'blocking_gates_pending'; end if;

  -- Observações críticas abertas impedem homologação.
  select count(*) into critical_open
  from public.collab_pilot_observations
  where cycle_id=p_cycle_id and severity='critical' and status not in ('resolved','rejected','duplicate');
  if critical_open > 0 then raise exception 'critical_observations_open'; end if;

  update public.collab_pilot_cycles
  set status='completed', phase='closure', approved_by=auth.uid(), approved_at=now(), updated_at=now()
  where id=p_cycle_id
  returning * into cycle_row;

  perform public.collab_record_audit('pilot.staging.homologated','pilot_cycle',p_cycle_id::text,null,
    jsonb_build_object('approvedBy',auth.uid()));

  -- Produção permanece bloqueada: a homologação de staging não a altera.
  return jsonb_build_object(
    'cycleId', p_cycle_id,
    'pilotCycle', 'completed',
    'stagingHomologation', 'approved',
    'productionApproval', 'blocked'
  );
end;
$$;

revoke all on function public.collab_pilot_approve_staging_homologation(uuid,text) from public;
grant execute on function public.collab_pilot_approve_staging_homologation(uuid,text) to authenticated;

-- Workspace agregado do piloto (leitura conforme permissão/inscrição)
create or replace function public.collab_pilot_workspace(
  p_cycle_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  can_manage boolean := public.collab_has_permission('pilot.manage', project_uuid);
  can_view boolean := public.collab_has_permission('pilot.view', project_uuid);
  result jsonb;
begin
  if auth.uid() is null then
    return jsonb_build_object('authenticated', false);
  end if;

  select jsonb_build_object(
    'authenticated', true,
    'canManage', can_manage,
    'productionWrites', false,
    'publicEffects', false,
    'cycles', coalesce((
      select jsonb_agg(to_jsonb(c) order by c.created_at desc)
      from public.collab_pilot_cycles c
      where c.project_id=project_uuid
        and (can_manage or can_view or public.collab_pilot_is_participant(c.id))
    ), '[]'::jsonb),
    'myParticipation', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.created_at desc)
      from public.collab_pilot_participants p
      where p.user_id=auth.uid()
        and (p_cycle_id is null or p.cycle_id=p_cycle_id)
    ), '[]'::jsonb),
    'myObservations', coalesce((
      select jsonb_agg(to_jsonb(o) order by o.created_at desc)
      from public.collab_pilot_observations o
      where o.reported_by=auth.uid()
        and (p_cycle_id is null or o.cycle_id=p_cycle_id)
    ), '[]'::jsonb),
    'gates', case when can_manage or public.collab_has_permission('pilot.gates.evaluate',project_uuid) then coalesce((
      select jsonb_agg(to_jsonb(g) order by g.gate_code)
      from public.collab_pilot_gate_results g
      where p_cycle_id is not null and g.cycle_id=p_cycle_id
    ), '[]'::jsonb) else '[]'::jsonb end
  ) into result;

  return result;
end;
$$;

revoke all on function public.collab_pilot_workspace(uuid) from public;
grant execute on function public.collab_pilot_workspace(uuid) to authenticated;
