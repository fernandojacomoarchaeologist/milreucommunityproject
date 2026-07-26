-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08L — RPCs auditadas de integração pública, participação e evolução.
--
-- Toda a escrita passa por funções security definer com verificação de
-- permissão, estado e auditoria. Ativação e rollback públicos, e decisões
-- de evolução, exigem permissões protegidas (master). Produção bloqueada.

-- ===== Integração pública =====

create or replace function public.collab_pub_upsert_proposal(
  p_proposal_id uuid,
  p_code text,
  p_title text,
  p_purpose text,
  p_target_surface text,
  p_source_type text,
  p_target_slot text default null,
  p_payload_draft jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_publication_proposals;
begin
  if not public.collab_has_permission('public-integration.propose', project_uuid) then raise exception 'permission_denied'; end if;
  if p_target_surface not in ('portal','museum') then raise exception 'invalid_surface'; end if;
  if p_proposal_id is null then
    insert into public.collab_publication_proposals(project_id,code,title,purpose,target_surface,target_slot,source_type,payload_draft,status,owner_user_id,created_by)
    values(project_uuid,p_code,p_title,p_purpose,p_target_surface,p_target_slot,p_source_type,coalesce(p_payload_draft,'{}'::jsonb),'draft',auth.uid(),auth.uid())
    returning * into result_row;
  else
    update public.collab_publication_proposals
    set title=p_title,purpose=p_purpose,target_surface=p_target_surface,target_slot=p_target_slot,payload_draft=coalesce(p_payload_draft,payload_draft),updated_at=now()
    where id=p_proposal_id and project_id=project_uuid returning * into result_row;
    if result_row.id is null then raise exception 'proposal_not_found'; end if;
  end if;
  perform public.collab_record_audit('publication.proposal.upserted','publication_proposal',result_row.id::text,null,jsonb_build_object('code',p_code,'surface',p_target_surface));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_pub_upsert_proposal(uuid,text,text,text,text,text,text,jsonb) from public;
grant execute on function public.collab_pub_upsert_proposal(uuid,text,text,text,text,text,text,jsonb) to authenticated;

-- Registar decisão de uma dimensão de revisão (editorial/direitos/privacidade/acessibilidade/tradução).
create or replace function public.collab_pub_set_review(
  p_proposal_id uuid,
  p_dimension text,
  p_status text
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_publication_proposals;
begin
  if not public.collab_has_permission('public-integration.review', project_uuid) then raise exception 'permission_denied'; end if;
  if p_dimension not in ('editorial','rights','privacy','accessibility') then raise exception 'invalid_dimension'; end if;
  update public.collab_publication_proposals
  set editorial_status=case when p_dimension='editorial' then p_status else editorial_status end,
      rights_status=case when p_dimension='rights' then p_status else rights_status end,
      privacy_status=case when p_dimension='privacy' then p_status else privacy_status end,
      accessibility_status=case when p_dimension='accessibility' then p_status else accessibility_status end,
      status=case when status='draft' then 'under-review' else status end,
      updated_at=now()
  where id=p_proposal_id and project_id=project_uuid returning * into result_row;
  if result_row.id is null then raise exception 'proposal_not_found'; end if;
  perform public.collab_record_audit('publication.review.set','publication_proposal',p_proposal_id::text,null,jsonb_build_object('dimension',p_dimension,'status',p_status));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_pub_set_review(uuid,text,text) from public;
grant execute on function public.collab_pub_set_review(uuid,text,text) to authenticated;

-- Gerar snapshot imutável (payload + checksum fornecidos pelo backend/preview; sem PII).
create or replace function public.collab_pub_generate_snapshot(
  p_proposal_id uuid,
  p_schema_version text,
  p_payload jsonb,
  p_checksum text,
  p_languages jsonb default '{}'::jsonb,
  p_references jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  next_version integer;
  result_row public.collab_publication_snapshots;
begin
  if not public.collab_has_permission('public-integration.preview', project_uuid) then raise exception 'permission_denied'; end if;
  if nullif(trim(p_checksum),'') is null then raise exception 'checksum_required'; end if;
  if not exists(select 1 from public.collab_publication_proposals where id=p_proposal_id and project_id=project_uuid) then raise exception 'proposal_not_found'; end if;
  select coalesce(max(version),0)+1 into next_version from public.collab_publication_snapshots where proposal_id=p_proposal_id;
  insert into public.collab_publication_snapshots(proposal_id,version,schema_version,payload,checksum,snapshot_references,languages,status,generated_by)
  values(p_proposal_id,next_version,p_schema_version,p_payload,p_checksum,coalesce(p_references,'[]'::jsonb),coalesce(p_languages,'{}'::jsonb),'generated',auth.uid())
  returning * into result_row;
  perform public.collab_record_audit('publication.snapshot.generated','publication_snapshot',result_row.id::text,null,jsonb_build_object('proposalId',p_proposal_id,'version',next_version));
  return jsonb_build_object('id',result_row.id,'version',result_row.version,'status',result_row.status,'checksum',result_row.checksum);
end;$$;
revoke all on function public.collab_pub_generate_snapshot(uuid,text,jsonb,text,jsonb,jsonb) from public;
grant execute on function public.collab_pub_generate_snapshot(uuid,text,jsonb,text,jsonb,jsonb) to authenticated;

-- Ativação pública: preview/activate/suspend/expire/rollback.
-- preview/suspend/expire: public-integration.activate; activate/rollback exigem a mesma permissão protegida (master).
create or replace function public.collab_pub_activation(
  p_snapshot_id uuid,
  p_action text,
  p_reason text,
  p_confirmation text default null
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  snap public.collab_publication_snapshots;
  previous_active uuid;
begin
  if p_action not in ('preview','activate','suspend','expire','rollback') then raise exception 'invalid_action'; end if;
  if p_action='rollback' then
    if not public.collab_has_permission('public-integration.rollback', project_uuid) then raise exception 'permission_denied'; end if;
  elsif p_action='activate' then
    if not public.collab_has_permission('public-integration.activate', project_uuid) then raise exception 'permission_denied'; end if;
    if p_confirmation is distinct from 'ACTIVATE_MILREU_PUBLIC_EFFECT' then raise exception 'confirmation_required'; end if;
  else
    if not public.collab_has_permission('public-integration.activate', project_uuid) then raise exception 'permission_denied'; end if;
  end if;

  select * into snap from public.collab_publication_snapshots where id=p_snapshot_id;
  if snap.id is null then raise exception 'snapshot_not_found'; end if;

  if p_action='activate' then
    -- Só um snapshot ativo por proposta: desativar o anterior (rollback preserva histórico).
    select id into previous_active from public.collab_publication_snapshots where proposal_id=snap.proposal_id and status='active';
    update public.collab_publication_snapshots set status='inactive', deactivated_at=now(), deactivation_reason='superseded' where id=previous_active;
    update public.collab_publication_snapshots set status='active', activated_at=now() where id=p_snapshot_id;
  elsif p_action in ('suspend','expire') then
    update public.collab_publication_snapshots set status='inactive', deactivated_at=now(), deactivation_reason=p_action where id=p_snapshot_id;
  elsif p_action='rollback' then
    update public.collab_publication_snapshots set status='inactive', deactivated_at=now(), deactivation_reason='rolled-back' where id=p_snapshot_id;
  end if;

  insert into public.collab_publication_activations(snapshot_id,environment,action,status,executed_at,executed_by,previous_snapshot_id,reason)
  values(p_snapshot_id,'staging',p_action,'executed',now(),auth.uid(),previous_active,coalesce(nullif(trim(p_reason),''),p_action));

  perform public.collab_record_audit('publication.activation','publication_snapshot',p_snapshot_id::text,null,jsonb_build_object('action',p_action));
  return jsonb_build_object('snapshotId',p_snapshot_id,'action',p_action,'productionApproval','blocked');
end;$$;
revoke all on function public.collab_pub_activation(uuid,text,text,text) from public;
grant execute on function public.collab_pub_activation(uuid,text,text,text) to authenticated;

-- ===== Participação contínua =====

create or replace function public.collab_participation_upsert_programme(
  p_programme_id uuid,
  p_code text,
  p_title text,
  p_description text,
  p_objective text,
  p_visibility text default 'members',
  p_status text default 'draft'
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_participation_programmes;
begin
  if not public.collab_has_permission('participation.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_visibility not in ('public','members','restricted') then raise exception 'invalid_visibility'; end if;
  if p_programme_id is null then
    insert into public.collab_participation_programmes(project_id,code,title,description,objective,visibility,status,owner_user_id,created_by)
    values(project_uuid,p_code,p_title,p_description,p_objective,p_visibility,p_status,auth.uid(),auth.uid())
    returning * into result_row;
  else
    update public.collab_participation_programmes
    set title=p_title,description=p_description,objective=p_objective,visibility=p_visibility,status=p_status,updated_at=now()
    where id=p_programme_id and project_id=project_uuid returning * into result_row;
    if result_row.id is null then raise exception 'programme_not_found'; end if;
  end if;
  perform public.collab_record_audit('participation.programme.upserted','participation_programme',result_row.id::text,null,jsonb_build_object('code',p_code,'visibility',p_visibility));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_participation_upsert_programme(uuid,text,text,text,text,text,text) from public;
grant execute on function public.collab_participation_upsert_programme(uuid,text,text,text,text,text,text) to authenticated;

-- Inscrição: o próprio (participation.enrol) ou gestão. Sem concessão automática de função.
create or replace function public.collab_participation_enrol(
  p_programme_id uuid,
  p_user_id uuid default null
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  target uuid := coalesce(p_user_id, auth.uid());
  result_row public.collab_participation_enrolments;
begin
  if target = auth.uid() then
    if not public.collab_has_permission('participation.enrol', project_uuid) then raise exception 'permission_denied'; end if;
  else
    if not public.collab_has_permission('participation.manage', project_uuid) then raise exception 'permission_denied'; end if;
  end if;
  if not exists(select 1 from public.collab_project_memberships m where m.project_id=project_uuid and m.user_id=target and m.status='active') then
    raise exception 'member_not_active';
  end if;
  insert into public.collab_participation_enrolments(programme_id,user_id,status,enrolled_by)
  values(p_programme_id,target,'enrolled',auth.uid())
  on conflict (programme_id,user_id) do update set status='enrolled', updated_at=now()
  returning * into result_row;
  perform public.collab_record_audit('participation.enrolled','participation_enrolment',result_row.id::text,null,jsonb_build_object('programmeId',p_programme_id));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_participation_enrol(uuid,uuid) from public;
grant execute on function public.collab_participation_enrol(uuid,uuid) to authenticated;

-- Atualizar progresso próprio (declaração) ou por gestão (validação).
create or replace function public.collab_participation_update_progress(
  p_enrolment_id uuid,
  p_step_id uuid,
  p_status text,
  p_completion_source text default 'participant-declaration'
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  owns boolean;
  is_manager boolean := public.collab_has_permission('participation.manage', project_uuid);
  result_row public.collab_participation_progress;
begin
  select exists(select 1 from public.collab_participation_enrolments e where e.id=p_enrolment_id and e.user_id=auth.uid()) into owns;
  if not owns and not is_manager then raise exception 'permission_denied'; end if;
  if owns and not is_manager and not public.collab_has_permission('participation.progress.update', project_uuid) then raise exception 'permission_denied'; end if;
  if p_status not in ('not-started','available','in-progress','completed','blocked','skipped','not-applicable') then raise exception 'invalid_status'; end if;
  -- Participante não pode auto-validar quando a conclusão exige coordenação.
  if owns and not is_manager and p_completion_source in ('coordinator-confirmation','imported-evidence') then raise exception 'validation_requires_manager'; end if;

  insert into public.collab_participation_progress(enrolment_id,step_id,status,completion_source,declared_by,validated_by,started_at,completed_at)
  values(p_enrolment_id,p_step_id,p_status,p_completion_source,
    case when owns then auth.uid() else null end,
    case when is_manager then auth.uid() else null end,
    case when p_status='in-progress' then now() else null end,
    case when p_status='completed' then now() else null end)
  on conflict (enrolment_id,step_id) do update
    set status=excluded.status, completion_source=excluded.completion_source,
        validated_by=case when is_manager then auth.uid() else public.collab_participation_progress.validated_by end,
        completed_at=case when excluded.status='completed' then now() else public.collab_participation_progress.completed_at end,
        updated_at=now()
  returning * into result_row;
  perform public.collab_record_audit('participation.progress.updated','participation_progress',result_row.id::text,null,jsonb_build_object('status',p_status));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_participation_update_progress(uuid,uuid,text,text) from public;
grant execute on function public.collab_participation_update_progress(uuid,uuid,text,text) to authenticated;

-- Retirada da própria inscrição (invalida dependências; preserva histórico).
create or replace function public.collab_participation_withdraw(
  p_programme_id uuid,
  p_reason text default null
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare result_row public.collab_participation_enrolments;
begin
  update public.collab_participation_enrolments
  set status='withdrawn', withdrawn_at=now(), withdrawal_reason=nullif(trim(p_reason),''), updated_at=now()
  where programme_id=p_programme_id and user_id=auth.uid() and status in ('enrolled','active','paused')
  returning * into result_row;
  if result_row.id is null then raise exception 'enrolment_not_found'; end if;
  perform public.collab_record_audit('participation.withdrawn','participation_enrolment',result_row.id::text,null,jsonb_build_object('programmeId',p_programme_id));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_participation_withdraw(uuid,text) from public;
grant execute on function public.collab_participation_withdraw(uuid,text) to authenticated;

-- ===== Evolução =====

create or replace function public.collab_evolution_upsert_proposal(
  p_proposal_id uuid,
  p_code text,
  p_title text,
  p_finding_summary text,
  p_proposed_change text,
  p_no_action_alternative text,
  p_expected_impact text,
  p_risks text,
  p_verification_plan text,
  p_confidence text default 'medium',
  p_severity text default 'low'
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_evolution_proposals;
begin
  if not public.collab_has_permission('evolution.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_proposal_id is null then
    insert into public.collab_evolution_proposals(project_id,code,title,finding_summary,proposed_change,no_action_alternative,expected_impact,risks,verification_plan,confidence,severity,status,created_by)
    values(project_uuid,p_code,p_title,p_finding_summary,p_proposed_change,p_no_action_alternative,p_expected_impact,p_risks,p_verification_plan,p_confidence,p_severity,'draft',auth.uid())
    returning * into result_row;
  else
    update public.collab_evolution_proposals
    set title=p_title,finding_summary=p_finding_summary,proposed_change=p_proposed_change,no_action_alternative=p_no_action_alternative,expected_impact=p_expected_impact,risks=p_risks,verification_plan=p_verification_plan,confidence=p_confidence,severity=p_severity,updated_at=now()
    where id=p_proposal_id and project_id=project_uuid returning * into result_row;
    if result_row.id is null then raise exception 'proposal_not_found'; end if;
  end if;
  perform public.collab_record_audit('evolution.proposal.upserted','evolution_proposal',result_row.id::text,null,jsonb_build_object('code',p_code));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_evolution_upsert_proposal(uuid,text,text,text,text,text,text,text,text,text,text) from public;
grant execute on function public.collab_evolution_upsert_proposal(uuid,text,text,text,text,text,text,text,text,text,text) to authenticated;

-- Decisão de evolução: protegida (evolution.decide = master).
create or replace function public.collab_evolution_decide(
  p_proposal_id uuid,
  p_decision text,
  p_rationale text,
  p_conditions text default null
)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_evolution_decisions;
begin
  if not public.collab_has_permission('evolution.decide', project_uuid) then raise exception 'permission_denied'; end if;
  if p_decision not in ('accept','reject','defer','plan','request-changes') then raise exception 'invalid_decision'; end if;
  if nullif(trim(p_rationale),'') is null then raise exception 'rationale_required'; end if;
  insert into public.collab_evolution_decisions(proposal_id,decision,conditions,rationale,decided_by,verification_status)
  values(p_proposal_id,p_decision,nullif(trim(p_conditions),''),p_rationale,auth.uid(),'pending')
  returning * into result_row;
  update public.collab_evolution_proposals
  set status=case p_decision when 'accept' then 'accepted' when 'reject' then 'rejected' when 'defer' then 'deferred' when 'plan' then 'planned' else 'under-review' end, updated_at=now()
  where id=p_proposal_id;
  perform public.collab_record_audit('evolution.decided','evolution_proposal',p_proposal_id::text,null,jsonb_build_object('decision',p_decision));
  return to_jsonb(result_row);
end;$$;
revoke all on function public.collab_evolution_decide(uuid,text,text,text) from public;
grant execute on function public.collab_evolution_decide(uuid,text,text,text) to authenticated;

-- ===== Leitura pública (anon) de snapshots ativos e programas públicos =====
create or replace function public.collab_public_participation_view()
returns jsonb
language sql stable security definer set search_path=public
as $$
  select jsonb_build_object(
    'activeSnapshots', coalesce((
      select jsonb_agg(jsonb_build_object('id',s.id,'proposalId',s.proposal_id,'schemaVersion',s.schema_version,'payload',s.payload,'languages',s.languages) order by s.activated_at desc)
      from public.collab_publication_snapshots s where s.status='active'
    ), '[]'::jsonb),
    'publicProgrammes', coalesce((
      select jsonb_agg(jsonb_build_object('code',p.code,'title',p.title,'description',p.description,'objective',p.objective,'languages',p.languages) order by p.title)
      from public.collab_participation_programmes p where p.visibility='public' and p.status in ('available','active')
    ), '[]'::jsonb),
    'productionApproval','blocked'
  )
$$;
revoke all on function public.collab_public_participation_view() from public;
grant execute on function public.collab_public_participation_view() to anon, authenticated;

-- ===== Workspace autenticado de participação =====
create or replace function public.collab_participation_workspace()
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
begin
  if auth.uid() is null then return jsonb_build_object('authenticated',false); end if;
  return jsonb_build_object(
    'authenticated', true,
    'canManage', public.collab_has_permission('participation.manage', project_uuid),
    'programmes', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.title) from public.collab_participation_programmes p
      where p.project_id=project_uuid and (
        (p.visibility in ('public','members') and p.status in ('available','active'))
        or public.collab_participation_is_enrolled(p.id)
        or public.collab_has_permission('participation.manage', project_uuid))
    ), '[]'::jsonb),
    'myEnrolments', coalesce((
      select jsonb_agg(to_jsonb(e) order by e.enrolled_at desc) from public.collab_participation_enrolments e where e.user_id=auth.uid()
    ), '[]'::jsonb)
  );
end;$$;
revoke all on function public.collab_participation_workspace() from public;
grant execute on function public.collab_participation_workspace() to authenticated;
