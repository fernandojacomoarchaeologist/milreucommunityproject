-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.
-- Pacote 09C — RPCs das oportunidades (security definer). Escrita só por aqui.
-- Decisão do dono do projeto; candidatos privados; menores bloqueados até política;
-- remoção exige razão interna; tudo auditado. Sem lista de espera automática.

-- Criar/editar oportunidade (gestão).
create or replace function public.collab_opportunity_upsert(p_id uuid, p_payload jsonb)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_opportunities;
  v_slug text := nullif(trim(p_payload->>'slug'),'');
begin
  if not public.collab_has_permission('opportunities.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if nullif(trim(p_payload->>'title'),'') is null then raise exception 'title_required'; end if;
  if v_slug is null then raise exception 'slug_required'; end if;
  if p_id is null then
    insert into public.collab_opportunities(
      project_id, slug, title, summary, opportunity_type, description, starts_at, ends_at,
      location_text, duration_text, effort_text, requirements, accessibility_text, cost_text,
      remuneration_text, organizer_text, public_contact, visibility, capacity_mode, capacity_limit,
      application_deadline, min_age, minors_allowed, owner_user_id, created_by)
    values(
      project_uuid, v_slug, p_payload->>'title', p_payload->>'summary', coalesce(p_payload->>'type','other'),
      p_payload->>'description', (p_payload->>'startsAt')::timestamptz, (p_payload->>'endsAt')::timestamptz,
      p_payload->>'locationText', p_payload->>'durationText', p_payload->>'effortText', p_payload->>'requirements',
      p_payload->>'accessibilityText', p_payload->>'costText', p_payload->>'remunerationText', p_payload->>'organizerText',
      p_payload->>'publicContact', coalesce(p_payload->>'visibility','private-draft'),
      coalesce(p_payload->>'capacityMode','undefined'), (p_payload->>'capacityLimit')::integer,
      (p_payload->>'applicationDeadline')::timestamptz, (p_payload->>'minAge')::integer,
      false, -- 09C: participação de menores bloqueada até política institucional.
      auth.uid(), auth.uid())
    returning * into result_row;
  else
    update public.collab_opportunities set
      slug=v_slug, title=p_payload->>'title', summary=p_payload->>'summary',
      opportunity_type=coalesce(p_payload->>'type',opportunity_type), description=p_payload->>'description',
      starts_at=(p_payload->>'startsAt')::timestamptz, ends_at=(p_payload->>'endsAt')::timestamptz,
      location_text=p_payload->>'locationText', duration_text=p_payload->>'durationText', effort_text=p_payload->>'effortText',
      requirements=p_payload->>'requirements', accessibility_text=p_payload->>'accessibilityText', cost_text=p_payload->>'costText',
      remuneration_text=p_payload->>'remunerationText', organizer_text=p_payload->>'organizerText', public_contact=p_payload->>'publicContact',
      visibility=coalesce(p_payload->>'visibility',visibility), capacity_mode=coalesce(p_payload->>'capacityMode',capacity_mode),
      capacity_limit=(p_payload->>'capacityLimit')::integer, application_deadline=(p_payload->>'applicationDeadline')::timestamptz,
      min_age=(p_payload->>'minAge')::integer, minors_allowed=false, updated_at=now()
    where id=p_id and project_id=project_uuid
    returning * into result_row;
    if result_row.id is null then raise exception 'not_found'; end if;
  end if;
  perform public.collab_record_audit('opportunity.upserted','opportunity',result_row.id::text,null,jsonb_build_object('slug',v_slug,'visibility',result_row.visibility));
  return to_jsonb(result_row);
end;
$$;
revoke all on function public.collab_opportunity_upsert(uuid,jsonb) from public;
grant execute on function public.collab_opportunity_upsert(uuid,jsonb) to authenticated;

-- Publicar/encerrar/cancelar/arquivar (gestão). Publicar exige campos obrigatórios.
create or replace function public.collab_opportunity_set_status(p_id uuid, p_status text)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_opportunities;
begin
  if not public.collab_has_permission('opportunities.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_status not in ('draft','published','closed','cancelled','archived') then raise exception 'invalid_status'; end if;
  select * into result_row from public.collab_opportunities where id=p_id and project_id=project_uuid;
  if result_row.id is null then raise exception 'not_found'; end if;
  if p_status='published' then
    if nullif(trim(result_row.title),'') is null or nullif(trim(coalesce(result_row.description,result_row.summary,'')),'') is null then
      raise exception 'missing_required_fields';
    end if;
    if result_row.visibility='private-draft' then raise exception 'cannot_publish_private_draft'; end if;
  end if;
  update public.collab_opportunities set status=p_status, updated_at=now() where id=p_id returning * into result_row;
  perform public.collab_record_audit('opportunity.status.set','opportunity',p_id::text,null,jsonb_build_object('status',p_status));
  return to_jsonb(result_row);
end;
$$;
revoke all on function public.collab_opportunity_set_status(uuid,text) from public;
grant execute on function public.collab_opportunity_set_status(uuid,text) to authenticated;

-- Candidatar-se (membro). Uma por pessoa/oportunidade; menores bloqueados.
create or replace function public.collab_opportunity_apply(p_opportunity_id uuid, p_note text)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  opp public.collab_opportunities;
  result_row public.collab_opportunity_applications;
begin
  if not public.collab_has_permission('opportunities.apply', project_uuid) then raise exception 'permission_denied'; end if;
  select * into opp from public.collab_opportunities where id=p_opportunity_id and project_id=project_uuid;
  if opp.id is null then raise exception 'not_found'; end if;
  if opp.status <> 'published' or opp.visibility not in ('public','members-only') then raise exception 'not_open'; end if;
  -- 09C: participação de menores bloqueada até política institucional.
  if opp.minors_allowed then raise exception 'minors_policy_pending'; end if;
  if opp.application_deadline is not null and opp.application_deadline < now() then raise exception 'applications_closed'; end if;
  insert into public.collab_opportunity_applications(project_id, opportunity_id, applicant_user_id, status, applicant_note)
  values(project_uuid, p_opportunity_id, auth.uid(), 'submitted', nullif(trim(p_note),''))
  on conflict (opportunity_id, applicant_user_id) do update set
    status = case when public.collab_opportunity_applications.status in ('withdrawn','removed','not-selected') then 'submitted' else public.collab_opportunity_applications.status end,
    applicant_note = nullif(trim(p_note),''), updated_at=now()
  returning * into result_row;
  perform public.collab_record_audit('opportunity.application.submitted','opportunity_application',result_row.id::text,null,jsonb_build_object('opportunityId',p_opportunity_id));
  return to_jsonb(result_row);
end;
$$;
revoke all on function public.collab_opportunity_apply(uuid,text) from public;
grant execute on function public.collab_opportunity_apply(uuid,text) to authenticated;

-- Retirar a própria candidatura.
create or replace function public.collab_opportunity_withdraw(p_application_id uuid)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  result_row public.collab_opportunity_applications;
begin
  update public.collab_opportunity_applications set status='withdrawn', updated_at=now()
  where id=p_application_id and applicant_user_id=auth.uid() and status not in ('removed')
  returning * into result_row;
  if result_row.id is null then raise exception 'not_found'; end if;
  perform public.collab_record_audit('opportunity.application.withdrawn','opportunity_application',p_application_id::text,null,'{}'::jsonb);
  return to_jsonb(result_row);
end;
$$;
revoke all on function public.collab_opportunity_withdraw(uuid) from public;
grant execute on function public.collab_opportunity_withdraw(uuid) to authenticated;

-- Decidir (gestão): aceitar ou não selecionar. Gera evento de auditoria (notificação interna).
create or replace function public.collab_opportunity_decide(p_application_id uuid, p_decision text)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_opportunity_applications;
begin
  if not public.collab_has_permission('opportunities.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if p_decision not in ('accepted','not-selected') then raise exception 'invalid_decision'; end if;
  update public.collab_opportunity_applications set status=p_decision, decided_by=auth.uid(), decided_at=now(), updated_at=now()
  where id=p_application_id and project_id=project_uuid and status in ('submitted','accepted','not-selected')
  returning * into result_row;
  if result_row.id is null then raise exception 'not_found'; end if;
  perform public.collab_record_audit('opportunity.application.decided','opportunity_application',p_application_id::text,null,jsonb_build_object('decision',p_decision));
  return to_jsonb(result_row);
end;
$$;
revoke all on function public.collab_opportunity_decide(uuid,text) from public;
grant execute on function public.collab_opportunity_decide(uuid,text) to authenticated;

-- Adicionar participante manualmente (gestão). Exige perfil de membro válido.
create or replace function public.collab_opportunity_add_participant(p_opportunity_id uuid, p_user_id uuid, p_note text)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_opportunity_applications;
begin
  if not public.collab_has_permission('opportunities.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if not exists (select 1 from public.collab_project_memberships where user_id=p_user_id and project_id=project_uuid and status='active') then
    raise exception 'invalid_member';
  end if;
  insert into public.collab_opportunity_applications(project_id, opportunity_id, applicant_user_id, status, added_manually, internal_note, decided_by, decided_at)
  values(project_uuid, p_opportunity_id, p_user_id, 'accepted', true, nullif(trim(p_note),''), auth.uid(), now())
  on conflict (opportunity_id, applicant_user_id) do update set status='accepted', added_manually=true, decided_by=auth.uid(), decided_at=now(), updated_at=now()
  returning * into result_row;
  perform public.collab_record_audit('opportunity.participant.added','opportunity_application',result_row.id::text,null,jsonb_build_object('opportunityId',p_opportunity_id,'userId',p_user_id));
  return to_jsonb(result_row);
end;
$$;
revoke all on function public.collab_opportunity_add_participant(uuid,uuid,text) from public;
grant execute on function public.collab_opportunity_add_participant(uuid,uuid,text) to authenticated;

-- Remover participante (gestão). Exige razão interna. Não apaga o histórico.
create or replace function public.collab_opportunity_remove_participant(p_application_id uuid, p_reason text)
returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result_row public.collab_opportunity_applications;
begin
  if not public.collab_has_permission('opportunities.manage', project_uuid) then raise exception 'permission_denied'; end if;
  if nullif(trim(p_reason),'') is null then raise exception 'reason_required'; end if;
  update public.collab_opportunity_applications set status='removed', internal_note=p_reason, decided_by=auth.uid(), decided_at=now(), updated_at=now()
  where id=p_application_id and project_id=project_uuid
  returning * into result_row;
  if result_row.id is null then raise exception 'not_found'; end if;
  perform public.collab_record_audit('opportunity.participant.removed','opportunity_application',p_application_id::text,null,jsonb_build_object('reason',p_reason));
  return to_jsonb(result_row);
end;
$$;
revoke all on function public.collab_opportunity_remove_participant(uuid,text) from public;
grant execute on function public.collab_opportunity_remove_participant(uuid,text) to authenticated;
