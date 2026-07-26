-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08M — RPCs auditadas de operação, governação, monitorização e sustentabilidade.
--
-- Toda a escrita passa por funções security definer com verificação de
-- permissão e auditoria. A decisão de governação é reservada (master). A
-- publicação de transparência exige confirmação literal. Produção bloqueada.

-- Submeter pedido de suporte (o próprio; requested_by é sempre auth.uid()).
create or replace function public.collab_support_submit(
  p_category text,
  p_summary text,
  p_description text,
  p_priority text default 'normal'
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_service_requests;
  ref text := 'SUP-' || to_char(now(),'YYYY') || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,8);
begin
  if not public.collab_has_permission('support.submit', project_uuid) then raise exception 'permission_denied'; end if;
  insert into public.collab_service_requests(project_id,public_reference,category,priority,status,summary,description,requested_by)
  values(project_uuid,ref,p_category,p_priority,'new',p_summary,p_description,auth.uid())
  returning * into result_row;
  perform public.collab_record_audit('support.submitted','service_request',result_row.id::text,null,jsonb_build_object('reference',ref,'category',p_category));
  return jsonb_build_object('id',result_row.id,'reference',ref,'status',result_row.status);
end;$$;
revoke all on function public.collab_support_submit(text,text,text,text) from public;
grant execute on function public.collab_support_submit(text,text,text,text) to authenticated;

-- Triagem/gestão de suporte.
create or replace function public.collab_support_manage(
  p_request_id uuid,
  p_status text,
  p_assigned_to uuid default null,
  p_resolution_summary text default null
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  previous public.collab_service_requests;
  result_row public.collab_service_requests;
begin
  if not public.collab_has_permission('support.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_status not in ('new','triaged','in-progress','waiting-user','waiting-external','resolved','closed','cancelled') then raise exception 'invalid_status'; end if;
  select * into previous from public.collab_service_requests where id=p_request_id and project_id=project_uuid;
  if previous.id is null then raise exception 'request_not_found'; end if;
  update public.collab_service_requests
  set status=p_status, assigned_to=coalesce(p_assigned_to,assigned_to), resolution_summary=coalesce(nullif(trim(p_resolution_summary),''),resolution_summary), updated_at=now()
  where id=p_request_id returning * into result_row;
  perform public.collab_record_audit('support.managed','service_request',p_request_id::text,to_jsonb(previous),to_jsonb(result_row),jsonb_build_object('status',p_status));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_support_manage(uuid,text,uuid,text) from public;
grant execute on function public.collab_support_manage(uuid,text,uuid,text) to authenticated;

-- Caso de moderação (restrito).
create or replace function public.collab_moderation_upsert(
  p_case_id uuid,
  p_code text,
  p_category text,
  p_description text,
  p_status text default 'reported',
  p_action text default null
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_moderation_cases;
begin
  if not public.collab_has_permission('moderation.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_status not in ('reported','triaged','under-review','action-required','resolved','appealed','closed') then raise exception 'invalid_status'; end if;
  if p_case_id is null then
    insert into public.collab_moderation_cases(project_id,code,category,status,source,description,action,reported_by,assigned_to)
    values(project_uuid,p_code,p_category,p_status,'internal',p_description,nullif(trim(p_action),''),auth.uid(),auth.uid())
    returning * into result_row;
  else
    update public.collab_moderation_cases set category=p_category,status=p_status,description=p_description,action=coalesce(nullif(trim(p_action),''),action),updated_at=now()
    where id=p_case_id and project_id=project_uuid returning * into result_row;
    if result_row.id is null then raise exception 'case_not_found'; end if;
  end if;
  perform public.collab_record_audit('moderation.upserted','moderation_case',result_row.id::text,null,jsonb_build_object('code',p_code,'status',p_status));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_moderation_upsert(uuid,text,text,text,text,text) from public;
grant execute on function public.collab_moderation_upsert(uuid,text,text,text,text,text) to authenticated;

-- Ciclo de operação.
create or replace function public.collab_operating_cycle_upsert(
  p_cycle_id uuid,
  p_code text,
  p_title text,
  p_cycle_type text default 'operations',
  p_status text default 'draft'
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_operating_cycles;
begin
  if not public.collab_has_permission('operations.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_status not in ('draft','preparing','ready','active','paused','reviewing','completed','blocked','cancelled') then raise exception 'invalid_status'; end if;
  if p_cycle_id is null then
    insert into public.collab_operating_cycles(project_id,code,title,cycle_type,status,owner_user_id,created_by)
    values(project_uuid,p_code,p_title,p_cycle_type,p_status,auth.uid(),auth.uid()) returning * into result_row;
  else
    update public.collab_operating_cycles set title=p_title,cycle_type=p_cycle_type,status=p_status,updated_at=now()
    where id=p_cycle_id and project_id=project_uuid returning * into result_row;
    if result_row.id is null then raise exception 'cycle_not_found'; end if;
  end if;
  perform public.collab_record_audit('operating_cycle.upserted','operating_cycle',result_row.id::text,null,jsonb_build_object('code',p_code,'status',p_status));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_operating_cycle_upsert(uuid,text,text,text,text) from public;
grant execute on function public.collab_operating_cycle_upsert(uuid,text,text,text,text) to authenticated;

-- Atribuir responsabilidade operacional.
create or replace function public.collab_responsibility_upsert(
  p_responsibility_id uuid,
  p_domain text,
  p_role_type text,
  p_person_user_id uuid default null,
  p_substitute_user_id uuid default null,
  p_single_person_risk boolean default false,
  p_status text default 'draft'
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_operational_responsibilities;
begin
  if not public.collab_has_permission('responsibilities.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_responsibility_id is null then
    insert into public.collab_operational_responsibilities(project_id,domain,role_type,person_user_id,substitute_user_id,single_person_risk,status,created_by)
    values(project_uuid,p_domain,p_role_type,p_person_user_id,p_substitute_user_id,p_single_person_risk,p_status,auth.uid()) returning * into result_row;
  else
    update public.collab_operational_responsibilities set domain=p_domain,role_type=p_role_type,person_user_id=p_person_user_id,substitute_user_id=p_substitute_user_id,single_person_risk=p_single_person_risk,status=p_status,updated_at=now()
    where id=p_responsibility_id and project_id=project_uuid returning * into result_row;
    if result_row.id is null then raise exception 'responsibility_not_found'; end if;
  end if;
  perform public.collab_record_audit('responsibility.upserted','operational_responsibility',result_row.id::text,null,jsonb_build_object('domain',p_domain));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_responsibility_upsert(uuid,text,text,uuid,uuid,boolean,text) from public;
grant execute on function public.collab_responsibility_upsert(uuid,text,text,uuid,uuid,boolean,text) to authenticated;

-- Registar decisão de governação (draft/gestão).
create or replace function public.collab_governance_upsert(
  p_decision_id uuid,
  p_decision_type text,
  p_title text,
  p_context text,
  p_authority text,
  p_status text default 'draft'
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_governance_decisions;
begin
  if not public.collab_has_permission('governance.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_decision_id is null then
    insert into public.collab_governance_decisions(project_id,decision_type,title,context,authority,status,created_by)
    values(project_uuid,p_decision_type,p_title,p_context,p_authority,p_status,auth.uid()) returning * into result_row;
  else
    update public.collab_governance_decisions set decision_type=p_decision_type,title=p_title,context=p_context,authority=p_authority,status=p_status,updated_at=now()
    where id=p_decision_id and project_id=project_uuid returning * into result_row;
    if result_row.id is null then raise exception 'decision_not_found'; end if;
  end if;
  perform public.collab_record_audit('governance.upserted','governance_decision',result_row.id::text,null,jsonb_build_object('type',p_decision_type));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_governance_upsert(uuid,text,text,text,text,text) from public;
grant execute on function public.collab_governance_upsert(uuid,text,text,text,text,text) to authenticated;

-- Decidir (reservado ao master via governance.decide).
create or replace function public.collab_governance_decide(
  p_decision_id uuid,
  p_decision text,
  p_rationale text,
  p_conditions text default null
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_governance_decisions;
begin
  if not public.collab_has_permission('governance.decide', project_uuid) then raise exception 'permission_denied'; end if;
  if nullif(trim(p_rationale),'') is null then raise exception 'rationale_required'; end if;
  update public.collab_governance_decisions
  set decision=p_decision, rationale=p_rationale, conditions=nullif(trim(p_conditions),''), status='decided', updated_at=now()
  where id=p_decision_id and project_id=project_uuid returning * into result_row;
  if result_row.id is null then raise exception 'decision_not_found'; end if;
  perform public.collab_record_audit('governance.decided','governance_decision',p_decision_id::text,null,jsonb_build_object('decision',p_decision));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_governance_decide(uuid,text,text,text) from public;
grant execute on function public.collab_governance_decide(uuid,text,text,text) to authenticated;

-- Indicador (definição, fonte, metodologia obrigatórias).
create or replace function public.collab_indicator_upsert(
  p_indicator_id uuid,
  p_code text,
  p_name text,
  p_indicator_type text,
  p_definition text,
  p_source text,
  p_unit text default 'count'
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_impact_indicators;
begin
  if not public.collab_has_permission('impact.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_indicator_type not in ('operational','participation','impact') then raise exception 'invalid_indicator_type'; end if;
  if nullif(trim(p_definition),'') is null or nullif(trim(p_source),'') is null then raise exception 'definition_and_source_required'; end if;
  if p_indicator_id is null then
    insert into public.collab_impact_indicators(project_id,code,name,indicator_type,definition,source,unit,owner_user_id)
    values(project_uuid,p_code,p_name,p_indicator_type,p_definition,p_source,p_unit,auth.uid()) returning * into result_row;
  else
    update public.collab_impact_indicators set name=p_name,indicator_type=p_indicator_type,definition=p_definition,source=p_source,unit=p_unit,updated_at=now()
    where id=p_indicator_id and project_id=project_uuid returning * into result_row;
    if result_row.id is null then raise exception 'indicator_not_found'; end if;
  end if;
  perform public.collab_record_audit('indicator.upserted','impact_indicator',result_row.id::text,null,jsonb_build_object('code',p_code,'type',p_indicator_type));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_indicator_upsert(uuid,text,text,text,text,text,text) from public;
grant execute on function public.collab_indicator_upsert(uuid,text,text,text,text,text,text) to authenticated;

-- Publicar snapshot de indicador na transparência pública (gated por literal + privacidade aprovada).
create or replace function public.collab_indicator_publish_snapshot(
  p_snapshot_id uuid,
  p_confirmation text
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  snap public.collab_impact_snapshots;
begin
  if not public.collab_has_permission('impact.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_confirmation is distinct from 'APPROVE_MILREU_PUBLIC_TRANSPARENCY' then raise exception 'confirmation_required'; end if;
  select * into snap from public.collab_impact_snapshots where id=p_snapshot_id;
  if snap.id is null then raise exception 'snapshot_not_found'; end if;
  if snap.privacy_status <> 'approved' then raise exception 'privacy_not_approved'; end if;
  if snap.quality_status <> 'approved' then raise exception 'quality_not_approved'; end if;
  update public.collab_impact_snapshots set publication_status='published', approved_by=auth.uid(), approved_at=now() where id=p_snapshot_id;
  perform public.collab_record_audit('indicator.snapshot.published','impact_snapshot',p_snapshot_id::text,null,jsonb_build_object('indicatorId',snap.indicator_id));
  return jsonb_build_object('snapshotId',p_snapshot_id,'publicationStatus','published','productionApproval','blocked');
end;$$;
revoke all on function public.collab_indicator_publish_snapshot(uuid,text) from public;
grant execute on function public.collab_indicator_publish_snapshot(uuid,text) to authenticated;

-- Revisão de continuidade.
create or replace function public.collab_continuity_upsert(
  p_review_id uuid,
  p_review_type text,
  p_status text,
  p_single_person_risk boolean default false,
  p_findings text default null
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_continuity_reviews;
begin
  if not public.collab_has_permission('continuity.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_status not in ('not-started','in-review','at-risk','adequate','blocked','completed') then raise exception 'invalid_status'; end if;
  if p_review_id is null then
    insert into public.collab_continuity_reviews(project_id,review_type,status,single_person_risk,findings,created_by)
    values(project_uuid,p_review_type,p_status,p_single_person_risk,nullif(trim(p_findings),''),auth.uid()) returning * into result_row;
  else
    update public.collab_continuity_reviews set review_type=p_review_type,status=p_status,single_person_risk=p_single_person_risk,findings=coalesce(nullif(trim(p_findings),''),findings),updated_at=now()
    where id=p_review_id and project_id=project_uuid returning * into result_row;
    if result_row.id is null then raise exception 'review_not_found'; end if;
  end if;
  perform public.collab_record_audit('continuity.upserted','continuity_review',result_row.id::text,null,jsonb_build_object('type',p_review_type,'status',p_status));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_continuity_upsert(uuid,text,text,boolean,text) from public;
grant execute on function public.collab_continuity_upsert(uuid,text,text,boolean,text) to authenticated;

-- Leitura pública (anon) de transparência: apenas snapshots publicados, sem PII.
create or replace function public.collab_public_transparency_view()
returns jsonb
language sql stable security definer set search_path=public
as $$
  select jsonb_build_object(
    'publishedIndicators', coalesce((
      select jsonb_agg(jsonb_build_object(
        'code', i.code, 'name', i.name, 'type', i.indicator_type, 'unit', i.unit,
        'definition', i.definition,
        'value', s.value_numeric, 'periodStart', s.period_start, 'periodEnd', s.period_end,
        'methodologyVersion', s.methodology_version
      ) order by s.period_end desc nulls last)
      from public.collab_impact_snapshots s
      join public.collab_impact_indicators i on i.id=s.indicator_id
      where s.publication_status='published'
    ), '[]'::jsonb),
    'productionApproval','blocked'
  )
$$;
revoke all on function public.collab_public_transparency_view() from public;
grant execute on function public.collab_public_transparency_view() to anon, authenticated;

-- Workspace autenticado de operação e governação.
create or replace function public.collab_operations_governance_workspace()
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare project_uuid uuid := public.collab_project_id();
begin
  if auth.uid() is null then return jsonb_build_object('authenticated',false); end if;
  return jsonb_build_object(
    'authenticated', true,
    'canManage', public.collab_has_permission('operations.manage', project_uuid),
    'operatingCycles', coalesce((select jsonb_agg(to_jsonb(c) order by c.created_at desc) from public.collab_operating_cycles c where c.project_id=project_uuid and public.collab_has_permission('operations.view',project_uuid)),'[]'::jsonb),
    'mySupport', coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.collab_service_requests r where r.requested_by=auth.uid()),'[]'::jsonb),
    'governanceDecisions', coalesce((select jsonb_agg(to_jsonb(d) order by d.created_at desc) from public.collab_governance_decisions d where d.project_id=project_uuid and public.collab_has_permission('governance.view',project_uuid)),'[]'::jsonb)
  );
end;$$;
revoke all on function public.collab_operations_governance_workspace() from public;
grant execute on function public.collab_operations_governance_workspace() to authenticated;
