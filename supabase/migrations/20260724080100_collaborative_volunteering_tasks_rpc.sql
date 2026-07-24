-- MILREU-DESTRUCTIVE-REVIEWED (revisão de integração 2026-07-24):
-- Os `delete from ...` são redefinição de skills exigidas por tarefa e substituição da própria disponibilidade do voluntário, scoped sob RLS: apagam apenas as linhas do alvo e reinserem
-- as novas. Não é exclusão massiva, não altera schema, é reversível e não
-- toca dados canónicos do Museu. Marcador aposto após revisão manual.

-- 08C — RPCs transacionais e auditadas para tarefas e disponibilidade.

create or replace function public.collab_task_active_assignment_count(p_task_id uuid)
returns integer
language sql
stable
security definer
set search_path=public
as $$
  select count(*)::integer
  from public.collab_task_assignments
  where task_id=p_task_id
    and status in ('accepted','in-progress','submitted','completed')
$$;

create or replace function public.collab_task_can_manage(p_task_id uuid)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1 from public.collab_tasks t
    where t.id=p_task_id
      and (public.collab_has_permission('tasks.manage',t.project_id)
        or public.collab_has_permission('tasks.assign',t.project_id)
        or public.collab_has_permission('tasks.verify',t.project_id))
  )
$$;

create or replace function public.collab_task_add_update(
  p_task_id uuid,
  p_update_type text,
  p_note text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_user_id uuid default auth.uid()
)
returns void
language plpgsql
security definer
set search_path=public
as $$
begin
  insert into public.collab_task_updates(project_id,task_id,user_id,update_type,note,metadata)
  values(public.collab_project_id(),p_task_id,p_user_id,p_update_type,nullif(trim(p_note),''),coalesce(p_metadata,'{}'::jsonb));
end;
$$;

create or replace function public.collab_create_task_08c(p_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  task_uuid uuid;
  skill jsonb;
  title_value text:=nullif(trim(p_payload->>'title'),'');
  category_value text:=coalesce(nullif(p_payload->>'categoryCode',''),'other');
  capacity_value integer:=nullif(p_payload->>'capacity','')::integer;
  minimum_value integer:=coalesce(nullif(p_payload->>'minimumParticipants','')::integer,1);
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  if not public.collab_has_permission('tasks.manage',project_uuid) then raise exception 'permission_denied'; end if;
  if title_value is null then raise exception 'title_required'; end if;
  if not exists(select 1 from public.collab_task_categories where code=category_value and active) then raise exception 'invalid_category'; end if;
  if capacity_value is not null and capacity_value < minimum_value then raise exception 'capacity_below_minimum'; end if;

  insert into public.collab_tasks(
    project_id,title,summary,description,instructions,category,category_code,status,priority,
    assignment_mode,location_mode,location_name,municipality,starts_at,due_at,application_deadline,
    estimated_minutes,capacity,minimum_participants,visibility,recognition_eligible,created_by,updated_by
  ) values (
    project_uuid,title_value,nullif(trim(p_payload->>'summary'),''),nullif(trim(p_payload->>'description'),''),
    nullif(trim(p_payload->>'instructions'),''),category_value,category_value,'draft',
    coalesce(nullif(p_payload->>'priority',''),'normal'),coalesce(nullif(p_payload->>'assignmentMode',''),'approval'),
    coalesce(nullif(p_payload->>'locationMode',''),'flexible'),nullif(trim(p_payload->>'locationName'),''),
    nullif(trim(p_payload->>'municipality'),''),nullif(p_payload->>'startsAt','')::timestamptz,
    nullif(p_payload->>'dueAt','')::timestamptz,nullif(p_payload->>'applicationDeadline','')::timestamptz,
    nullif(p_payload->>'estimatedMinutes','')::integer,capacity_value,minimum_value,
    coalesce(nullif(p_payload->>'visibility',''),'members'),coalesce((p_payload->>'recognitionEligible')::boolean,false),
    auth.uid(),auth.uid()
  ) returning id into task_uuid;

  for skill in select * from jsonb_array_elements(coalesce(p_payload->'skills','[]'::jsonb)) loop
    if exists(select 1 from public.collab_skill_catalog where code=skill->>'code' and active) then
      insert into public.collab_task_required_skills(task_id,skill_code,required)
      values(task_uuid,skill->>'code',coalesce((skill->>'required')::boolean,false))
      on conflict do nothing;
    end if;
  end loop;

  perform public.collab_record_audit('task.created','task',task_uuid::text,null,
    jsonb_build_object('title',title_value,'status','draft','category',category_value));
  return task_uuid;
end;
$$;

create or replace function public.collab_update_task_08c(p_task_id uuid,p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  previous_row jsonb;
  next_row jsonb;
  skill jsonb;
  current_status text;
begin
  if not public.collab_has_permission('tasks.manage',project_uuid) then raise exception 'permission_denied'; end if;
  select to_jsonb(t),t.status into previous_row,current_status from public.collab_tasks t where t.id=p_task_id and t.project_id=project_uuid;
  if previous_row is null then raise exception 'task_not_found'; end if;
  if current_status in ('completed','cancelled','archived') then raise exception 'task_locked'; end if;

  update public.collab_tasks set
    title=coalesce(nullif(trim(p_payload->>'title'),''),title),
    summary=case when p_payload ? 'summary' then nullif(trim(p_payload->>'summary'),'') else summary end,
    description=case when p_payload ? 'description' then nullif(trim(p_payload->>'description'),'') else description end,
    instructions=case when p_payload ? 'instructions' then nullif(trim(p_payload->>'instructions'),'') else instructions end,
    category_code=coalesce(nullif(p_payload->>'categoryCode',''),category_code),
    category=coalesce(nullif(p_payload->>'categoryCode',''),category),
    priority=coalesce(nullif(p_payload->>'priority',''),priority),
    assignment_mode=coalesce(nullif(p_payload->>'assignmentMode',''),assignment_mode),
    location_mode=coalesce(nullif(p_payload->>'locationMode',''),location_mode),
    location_name=case when p_payload ? 'locationName' then nullif(trim(p_payload->>'locationName'),'') else location_name end,
    municipality=case when p_payload ? 'municipality' then nullif(trim(p_payload->>'municipality'),'') else municipality end,
    starts_at=case when p_payload ? 'startsAt' then nullif(p_payload->>'startsAt','')::timestamptz else starts_at end,
    due_at=case when p_payload ? 'dueAt' then nullif(p_payload->>'dueAt','')::timestamptz else due_at end,
    application_deadline=case when p_payload ? 'applicationDeadline' then nullif(p_payload->>'applicationDeadline','')::timestamptz else application_deadline end,
    estimated_minutes=case when p_payload ? 'estimatedMinutes' then nullif(p_payload->>'estimatedMinutes','')::integer else estimated_minutes end,
    capacity=case when p_payload ? 'capacity' then nullif(p_payload->>'capacity','')::integer else capacity end,
    minimum_participants=case when p_payload ? 'minimumParticipants' then coalesce(nullif(p_payload->>'minimumParticipants','')::integer,1) else minimum_participants end,
    visibility=coalesce(nullif(p_payload->>'visibility',''),visibility),
    recognition_eligible=case when p_payload ? 'recognitionEligible' then coalesce((p_payload->>'recognitionEligible')::boolean,false) else recognition_eligible end,
    updated_by=auth.uid(),updated_at=now()
  where id=p_task_id
  returning to_jsonb(collab_tasks) into next_row;

  if p_payload ? 'skills' then
    delete from public.collab_task_required_skills where task_id=p_task_id;
    for skill in select * from jsonb_array_elements(coalesce(p_payload->'skills','[]'::jsonb)) loop
      if exists(select 1 from public.collab_skill_catalog where code=skill->>'code' and active) then
        insert into public.collab_task_required_skills(task_id,skill_code,required)
        values(p_task_id,skill->>'code',coalesce((skill->>'required')::boolean,false));
      end if;
    end loop;
  end if;

  perform public.collab_record_audit('task.updated','task',p_task_id::text,previous_row,next_row);
  return next_row;
end;
$$;

create or replace function public.collab_publish_task_08c(p_task_id uuid)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare result jsonb;
begin
  if not public.collab_has_permission('tasks.manage') then raise exception 'permission_denied'; end if;
  update public.collab_tasks
  set status='open',updated_by=auth.uid(),updated_at=now()
  where id=p_task_id and project_id=public.collab_project_id() and status='draft'
  returning to_jsonb(collab_tasks) into result;
  if result is null then raise exception 'task_not_publishable'; end if;
  perform public.collab_record_audit('task.published','task',p_task_id::text,null,result);
  return result;
end;
$$;

create or replace function public.collab_cancel_task_08c(p_task_id uuid,p_reason text default null)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare result jsonb;
begin
  if not (public.collab_has_permission('tasks.cancel') or public.collab_has_permission('tasks.manage')) then raise exception 'permission_denied'; end if;
  update public.collab_tasks set status='cancelled',updated_by=auth.uid(),updated_at=now()
  where id=p_task_id and project_id=public.collab_project_id() and status not in ('completed','cancelled','archived')
  returning to_jsonb(collab_tasks) into result;
  if result is null then raise exception 'task_not_cancellable'; end if;
  update public.collab_task_assignments set status='cancelled',manager_note=nullif(trim(p_reason),''),updated_at=now()
  where task_id=p_task_id and status not in ('completed','declined','withdrawn','cancelled');
  perform public.collab_task_add_update(p_task_id,'cancelled',p_reason,jsonb_build_object('actor','manager'));
  perform public.collab_record_audit('task.cancelled','task',p_task_id::text,null,result,jsonb_build_object('reason',p_reason));
  return result;
end;
$$;

create or replace function public.collab_complete_task_08c(p_task_id uuid,p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare result jsonb;
begin
  if not (public.collab_has_permission('tasks.verify') or public.collab_has_permission('tasks.manage')) then raise exception 'permission_denied'; end if;
  if exists(select 1 from public.collab_task_assignments where task_id=p_task_id and status in ('accepted','in-progress','submitted')) then
    raise exception 'assignments_still_open';
  end if;
  update public.collab_tasks set status='completed',updated_by=auth.uid(),updated_at=now()
  where id=p_task_id and project_id=public.collab_project_id() and status in ('open','in-progress')
  returning to_jsonb(collab_tasks) into result;
  if result is null then raise exception 'task_not_completable'; end if;
  update public.collab_task_assignments set status='cancelled',manager_note=coalesce(nullif(trim(p_note),''),'Tarefa encerrada.'),updated_at=now()
  where task_id=p_task_id and status in ('invited','applied');
  perform public.collab_task_add_update(p_task_id,'verified',p_note,jsonb_build_object('taskStatus','completed'));
  perform public.collab_record_audit('task.completed','task',p_task_id::text,null,result,jsonb_build_object('note',p_note));
  return result;
end;
$$;

create or replace function public.collab_join_task_08c(p_task_id uuid,p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  task_row public.collab_tasks%rowtype;
  target_status text;
  result jsonb;
begin
  if not public.collab_is_active_member() or not (public.collab_has_permission('tasks.apply') or public.collab_has_permission('tasks.accept')) then raise exception 'permission_denied'; end if;
  select * into task_row from public.collab_tasks where id=p_task_id and project_id=public.collab_project_id() for update;
  if not found or task_row.status<>'open' then raise exception 'task_not_open'; end if;
  if task_row.assignment_mode='direct' then raise exception 'task_requires_invitation'; end if;
  if task_row.application_deadline is not null and task_row.application_deadline<now() then raise exception 'application_closed'; end if;
  if task_row.assignment_mode='open' and task_row.capacity is not null and public.collab_task_active_assignment_count(p_task_id)>=task_row.capacity then raise exception 'task_capacity_reached'; end if;
  target_status:=case when task_row.assignment_mode='open' then 'accepted' else 'applied' end;

  insert into public.collab_task_assignments(task_id,user_id,status,applied_at,accepted_at,application_note,updated_at)
  values(p_task_id,auth.uid(),target_status,now(),case when target_status='accepted' then now() else null end,nullif(trim(p_note),''),now())
  on conflict(task_id,user_id) do update set
    status=excluded.status,applied_at=excluded.applied_at,accepted_at=excluded.accepted_at,
    application_note=excluded.application_note,declined_at=null,withdrawn_at=null,updated_at=now()
  where collab_task_assignments.status in ('declined','withdrawn','cancelled')
  returning to_jsonb(collab_task_assignments) into result;
  if result is null then raise exception 'assignment_already_exists'; end if;
  perform public.collab_task_add_update(p_task_id,case when target_status='accepted' then 'accepted' else 'application' end,p_note,jsonb_build_object('status',target_status));
  perform public.collab_record_audit('task.joined','task_assignment',p_task_id::text||':'||auth.uid()::text,null,result);
  return result;
end;
$$;

create or replace function public.collab_invite_task_member_08c(p_task_id uuid,p_user_id uuid,p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare task_row public.collab_tasks%rowtype; result jsonb;
begin
  if not (public.collab_has_permission('tasks.assign') or public.collab_has_permission('tasks.manage')) then raise exception 'permission_denied'; end if;
  select * into task_row from public.collab_tasks where id=p_task_id and project_id=public.collab_project_id();
  if not found or task_row.status not in ('open','in-progress') then raise exception 'task_not_assignable'; end if;
  if not exists(select 1 from public.collab_project_memberships where project_id=task_row.project_id and user_id=p_user_id and status='active') then raise exception 'member_not_active'; end if;
  insert into public.collab_task_assignments(task_id,user_id,status,assigned_by,assigned_at,manager_note,updated_at)
  values(p_task_id,p_user_id,'invited',auth.uid(),now(),nullif(trim(p_note),''),now())
  on conflict(task_id,user_id) do update set status='invited',assigned_by=auth.uid(),assigned_at=now(),manager_note=excluded.manager_note,updated_at=now()
  where collab_task_assignments.status in ('declined','withdrawn','cancelled')
  returning to_jsonb(collab_task_assignments) into result;
  if result is null then raise exception 'assignment_already_exists'; end if;
  perform public.collab_task_add_update(p_task_id,'invitation',p_note,jsonb_build_object('targetUserId',p_user_id),p_user_id);
  perform public.collab_record_audit('task.member_invited','task_assignment',p_task_id::text||':'||p_user_id::text,null,result);
  return result;
end;
$$;

create or replace function public.collab_respond_task_invitation_08c(p_task_id uuid,p_accept boolean,p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare task_row public.collab_tasks%rowtype; result jsonb; next_status text;
begin
  select * into task_row from public.collab_tasks where id=p_task_id and project_id=public.collab_project_id() for update;
  if not found then raise exception 'task_not_found'; end if;
  if p_accept and task_row.capacity is not null and public.collab_task_active_assignment_count(p_task_id)>=task_row.capacity then raise exception 'task_capacity_reached'; end if;
  next_status:=case when p_accept then 'accepted' else 'declined' end;
  update public.collab_task_assignments set status=next_status,
    accepted_at=case when p_accept then now() else accepted_at end,
    declined_at=case when not p_accept then now() else null end,
    application_note=coalesce(nullif(trim(p_note),''),application_note),updated_at=now()
  where task_id=p_task_id and user_id=auth.uid() and status='invited'
  returning to_jsonb(collab_task_assignments) into result;
  if result is null then raise exception 'invitation_not_found'; end if;
  perform public.collab_task_add_update(p_task_id,case when p_accept then 'accepted' else 'declined' end,p_note,jsonb_build_object('response',next_status));
  perform public.collab_record_audit('task.invitation_responded','task_assignment',p_task_id::text||':'||auth.uid()::text,null,result);
  return result;
end;
$$;

create or replace function public.collab_review_task_application_08c(p_task_id uuid,p_user_id uuid,p_accept boolean,p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare task_row public.collab_tasks%rowtype; result jsonb; next_status text;
begin
  if not (public.collab_has_permission('tasks.assign') or public.collab_has_permission('tasks.manage')) then raise exception 'permission_denied'; end if;
  select * into task_row from public.collab_tasks where id=p_task_id and project_id=public.collab_project_id() for update;
  if not found then raise exception 'task_not_found'; end if;
  if p_accept and task_row.capacity is not null and public.collab_task_active_assignment_count(p_task_id)>=task_row.capacity then raise exception 'task_capacity_reached'; end if;
  next_status:=case when p_accept then 'accepted' else 'declined' end;
  update public.collab_task_assignments set status=next_status,
    accepted_at=case when p_accept then now() else accepted_at end,
    declined_at=case when not p_accept then now() else null end,
    manager_note=nullif(trim(p_note),''),assigned_by=auth.uid(),updated_at=now()
  where task_id=p_task_id and user_id=p_user_id and status='applied'
  returning to_jsonb(collab_task_assignments) into result;
  if result is null then raise exception 'application_not_found'; end if;
  perform public.collab_task_add_update(p_task_id,case when p_accept then 'accepted' else 'declined' end,p_note,jsonb_build_object('targetUserId',p_user_id),p_user_id);
  perform public.collab_record_audit('task.application_reviewed','task_assignment',p_task_id::text||':'||p_user_id::text,null,result);
  return result;
end;
$$;

create or replace function public.collab_start_task_08c(p_task_id uuid)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare result jsonb;
begin
  if not public.collab_has_permission('tasks.progress') then raise exception 'permission_denied'; end if;
  update public.collab_task_assignments set status='in-progress',started_at=coalesce(started_at,now()),updated_at=now()
  where task_id=p_task_id and user_id=auth.uid() and status='accepted'
  returning to_jsonb(collab_task_assignments) into result;
  if result is null then raise exception 'assignment_not_startable'; end if;
  update public.collab_tasks set status='in-progress',updated_at=now() where id=p_task_id and status='open';
  perform public.collab_task_add_update(p_task_id,'started',null,'{}'::jsonb);
  perform public.collab_record_audit('task.assignment_started','task_assignment',p_task_id::text||':'||auth.uid()::text,null,result);
  return result;
end;
$$;

create or replace function public.collab_submit_task_08c(p_task_id uuid,p_note text default null,p_minutes integer default null)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare result jsonb;
begin
  if not public.collab_has_permission('tasks.progress') then raise exception 'permission_denied'; end if;
  if p_minutes is not null and (p_minutes<=0 or p_minutes>1440) then raise exception 'invalid_minutes'; end if;
  update public.collab_task_assignments set status='submitted',submitted_at=now(),completion_note=nullif(trim(p_note),''),updated_at=now()
  where task_id=p_task_id and user_id=auth.uid() and status in ('accepted','in-progress')
  returning to_jsonb(collab_task_assignments) into result;
  if result is null then raise exception 'assignment_not_submittable'; end if;
  if p_minutes is not null then
    insert into public.collab_task_time_entries(project_id,task_id,user_id,activity_date,minutes,note,status)
    values(public.collab_project_id(),p_task_id,auth.uid(),current_date,p_minutes,nullif(trim(p_note),''),'pending');
  end if;
  perform public.collab_task_add_update(p_task_id,'submitted',p_note,jsonb_build_object('minutes',p_minutes));
  perform public.collab_record_audit('task.assignment_submitted','task_assignment',p_task_id::text||':'||auth.uid()::text,null,result);
  return result;
end;
$$;

create or replace function public.collab_verify_task_08c(p_task_id uuid,p_user_id uuid,p_accept boolean,p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare result jsonb; next_status text;
begin
  if not (public.collab_has_permission('tasks.verify') or public.collab_has_permission('tasks.manage')) then raise exception 'permission_denied'; end if;
  next_status:=case when p_accept then 'completed' else 'in-progress' end;
  update public.collab_task_assignments set status=next_status,
    verified_at=case when p_accept then now() else null end,verified_by=auth.uid(),
    manager_note=nullif(trim(p_note),''),updated_at=now()
  where task_id=p_task_id and user_id=p_user_id and status='submitted'
  returning to_jsonb(collab_task_assignments) into result;
  if result is null then raise exception 'submission_not_found'; end if;
  update public.collab_task_time_entries set status=case when p_accept then 'approved' else 'rejected' end,
    verified_at=now(),verified_by=auth.uid(),updated_at=now()
  where task_id=p_task_id and user_id=p_user_id and status='pending';
  perform public.collab_task_add_update(p_task_id,case when p_accept then 'verified' else 'reopened' end,p_note,jsonb_build_object('targetUserId',p_user_id),p_user_id);
  perform public.collab_record_audit('task.assignment_verified','task_assignment',p_task_id::text||':'||p_user_id::text,null,result);
  return result;
end;
$$;

create or replace function public.collab_withdraw_task_08c(p_task_id uuid,p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare result jsonb;
begin
  update public.collab_task_assignments set status='withdrawn',withdrawn_at=now(),completion_note=nullif(trim(p_note),''),updated_at=now()
  where task_id=p_task_id and user_id=auth.uid() and status in ('invited','applied','accepted','in-progress')
  returning to_jsonb(collab_task_assignments) into result;
  if result is null then raise exception 'assignment_not_withdrawable'; end if;
  perform public.collab_task_add_update(p_task_id,'withdrawn',p_note,'{}'::jsonb);
  perform public.collab_record_audit('task.assignment_withdrawn','task_assignment',p_task_id::text||':'||auth.uid()::text,null,result);
  return result;
end;
$$;

create or replace function public.collab_log_task_time_08c(p_task_id uuid,p_activity_date date,p_minutes integer,p_note text default null)
returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare entry_uuid uuid;
begin
  if not public.collab_has_permission('tasks.time-log') then raise exception 'permission_denied'; end if;
  if p_minutes<=0 or p_minutes>1440 then raise exception 'invalid_minutes'; end if;
  if not exists(select 1 from public.collab_task_assignments where task_id=p_task_id and user_id=auth.uid() and status in ('accepted','in-progress','submitted','completed')) then raise exception 'assignment_required'; end if;
  insert into public.collab_task_time_entries(project_id,task_id,user_id,activity_date,minutes,note,status)
  values(public.collab_project_id(),p_task_id,auth.uid(),coalesce(p_activity_date,current_date),p_minutes,nullif(trim(p_note),''),'pending')
  returning id into entry_uuid;
  perform public.collab_task_add_update(p_task_id,'time-log',p_note,jsonb_build_object('minutes',p_minutes,'entryId',entry_uuid));
  return entry_uuid;
end;
$$;

create or replace function public.collab_set_my_availability_08c(p_preferences jsonb,p_slots jsonb)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  slot jsonb;
  modes text[];
  result jsonb;
begin
  if not public.collab_has_permission('availability.self.manage',project_uuid) then raise exception 'permission_denied'; end if;
  select coalesce(array_agg(mode.value),array['remote','on-site']::text[]) into modes
  from jsonb_array_elements_text(coalesce(p_preferences->'preferredModes','["remote","on-site"]'::jsonb)) as mode(value);
  if not modes <@ array['remote','on-site','hybrid']::text[] then raise exception 'invalid_preferred_modes'; end if;

  insert into public.collab_volunteer_preferences(project_id,user_id,preferred_modes,maximum_weekly_minutes,availability_notes,timezone)
  values(project_uuid,auth.uid(),modes,nullif(p_preferences->>'maximumWeeklyMinutes','')::integer,
    nullif(trim(p_preferences->>'notes'),''),coalesce(nullif(p_preferences->>'timezone',''),'Europe/Lisbon'))
  on conflict(project_id,user_id) do update set
    preferred_modes=excluded.preferred_modes,maximum_weekly_minutes=excluded.maximum_weekly_minutes,
    availability_notes=excluded.availability_notes,timezone=excluded.timezone,updated_at=now();

  delete from public.collab_member_availability where project_id=project_uuid and user_id=auth.uid();
  for slot in select * from jsonb_array_elements(coalesce(p_slots,'[]'::jsonb)) loop
    if (slot->>'dayOfWeek')::integer not between 0 and 6 then raise exception 'invalid_day'; end if;
    if (slot->>'endsAt')::time <= (slot->>'startsAt')::time then raise exception 'invalid_time_range'; end if;
    insert into public.collab_member_availability(project_id,user_id,day_of_week,starts_at,ends_at,mode,active)
    values(project_uuid,auth.uid(),(slot->>'dayOfWeek')::integer,(slot->>'startsAt')::time,(slot->>'endsAt')::time,
      coalesce(nullif(slot->>'mode',''),'hybrid'),true);
  end loop;

  select jsonb_build_object(
    'preferences',(select to_jsonb(p) from public.collab_volunteer_preferences p where p.project_id=project_uuid and p.user_id=auth.uid()),
    'slots',coalesce((select jsonb_agg(to_jsonb(a) order by a.day_of_week,a.starts_at) from public.collab_member_availability a where a.project_id=project_uuid and a.user_id=auth.uid()),'[]'::jsonb)
  ) into result;
  perform public.collab_record_audit('availability.updated','profile',auth.uid()::text,null,result);
  return result;
end;
$$;

revoke all on function public.collab_task_active_assignment_count(uuid) from public;
revoke all on function public.collab_task_can_manage(uuid) from public;
revoke all on function public.collab_task_add_update(uuid,text,text,jsonb,uuid) from public;
revoke all on function public.collab_create_task_08c(jsonb) from public;
revoke all on function public.collab_update_task_08c(uuid,jsonb) from public;
revoke all on function public.collab_publish_task_08c(uuid) from public;
revoke all on function public.collab_cancel_task_08c(uuid,text) from public;
revoke all on function public.collab_complete_task_08c(uuid,text) from public;
revoke all on function public.collab_join_task_08c(uuid,text) from public;
revoke all on function public.collab_invite_task_member_08c(uuid,uuid,text) from public;
revoke all on function public.collab_respond_task_invitation_08c(uuid,boolean,text) from public;
revoke all on function public.collab_review_task_application_08c(uuid,uuid,boolean,text) from public;
revoke all on function public.collab_start_task_08c(uuid) from public;
revoke all on function public.collab_submit_task_08c(uuid,text,integer) from public;
revoke all on function public.collab_verify_task_08c(uuid,uuid,boolean,text) from public;
revoke all on function public.collab_withdraw_task_08c(uuid,text) from public;
revoke all on function public.collab_log_task_time_08c(uuid,date,integer,text) from public;
revoke all on function public.collab_set_my_availability_08c(jsonb,jsonb) from public;

grant execute on function public.collab_create_task_08c(jsonb) to authenticated;
grant execute on function public.collab_update_task_08c(uuid,jsonb) to authenticated;
grant execute on function public.collab_publish_task_08c(uuid) to authenticated;
grant execute on function public.collab_cancel_task_08c(uuid,text) to authenticated;
grant execute on function public.collab_complete_task_08c(uuid,text) to authenticated;
grant execute on function public.collab_join_task_08c(uuid,text) to authenticated;
grant execute on function public.collab_invite_task_member_08c(uuid,uuid,text) to authenticated;
grant execute on function public.collab_respond_task_invitation_08c(uuid,boolean,text) to authenticated;
grant execute on function public.collab_review_task_application_08c(uuid,uuid,boolean,text) to authenticated;
grant execute on function public.collab_start_task_08c(uuid) to authenticated;
grant execute on function public.collab_submit_task_08c(uuid,text,integer) to authenticated;
grant execute on function public.collab_verify_task_08c(uuid,uuid,boolean,text) to authenticated;
grant execute on function public.collab_withdraw_task_08c(uuid,text) to authenticated;
grant execute on function public.collab_log_task_time_08c(uuid,date,integer,text) to authenticated;
grant execute on function public.collab_set_my_availability_08c(jsonb,jsonb) to authenticated;