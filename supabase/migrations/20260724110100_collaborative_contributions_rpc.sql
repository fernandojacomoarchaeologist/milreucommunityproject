-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- RPCs do Pacote 08E.

create or replace function public.collab_user_has_permission_08e(
  p_user_id uuid,
  p_permission text,
  p_project_id uuid default public.collab_project_id()
)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1
    from public.collab_project_memberships membership
    join public.collab_member_roles member_role
      on member_role.project_id=membership.project_id
      and member_role.user_id=membership.user_id
    join public.collab_role_permissions role_permission
      on role_permission.role_code=member_role.role_code
    where membership.project_id=p_project_id
      and membership.user_id=p_user_id
      and membership.status='active'
      and role_permission.permission_code=p_permission
  )
$$;

create or replace function public.collab_contribution_status_for_action_08e(
  p_action text
)
returns text
language sql
immutable
as $$
  select case p_action
    when 'triage' then 'triage'
    when 'review' then 'under-review'
    when 'request-info' then 'needs-info'
    when 'accept' then 'accepted'
    when 'partial' then 'partially-accepted'
    when 'reject' then 'rejected'
    when 'withdraw' then 'withdrawn'
    when 'incorporate' then 'incorporated'
    when 'archive' then 'archived'
    else null
  end
$$;

create or replace function public.collab_create_contribution_internal_08e(
  p_payload jsonb,
  p_user_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,storage
as $$
declare
  project_uuid uuid := public.collab_project_id();
  submitter_uuid uuid := gen_random_uuid();
  contribution_uuid uuid := gen_random_uuid();
  file_uuid uuid;
  consent_code text;
  tracking_code text;
  public_ref text;
  email_value text := lower(trim(coalesce(p_payload->>'email','')));
  display_name_value text := nullif(trim(p_payload->>'displayName'),'');
  contribution_type_value text := nullif(p_payload->>'contributionType','');
  title_value text := nullif(trim(p_payload->>'title'),'');
  content_value text := nullif(trim(p_payload->>'content'),'');
  files_value jsonb := coalesce(p_payload->'files','[]'::jsonb);
  file_value jsonb;
  file_path text;
  clean_filename text;
  file_results jsonb := '[]'::jsonb;
  target_value jsonb := coalesce(p_payload->'target','{}'::jsonb);
begin
  if project_uuid is null then raise exception 'project_not_found'; end if;
  if display_name_value is null then raise exception 'display_name_required'; end if;
  if email_value='' or position('@' in email_value)=0 then raise exception 'valid_email_required'; end if;
  if contribution_type_value not in (
    'photograph','testimony','correction','document',
    'reference','rights-credit','other'
  ) then raise exception 'invalid_contribution_type'; end if;
  if title_value is null then raise exception 'title_required'; end if;
  if content_value is null then raise exception 'content_required'; end if;
  if nullif(trim(p_payload->>'rightsDeclaration'),'') is null then
    raise exception 'rights_declaration_required';
  end if;
  if coalesce((p_payload->>'privacyAccepted')::boolean,false) is not true then
    raise exception 'privacy_consent_required';
  end if;
  if coalesce((p_payload->>'rightsConfirmed')::boolean,false) is not true then
    raise exception 'rights_confirmation_required';
  end if;
  if coalesce((p_payload->>'projectUseAuthorised')::boolean,false) is not true then
    raise exception 'project_use_authorisation_required';
  end if;
  if jsonb_typeof(files_value)<>'array' then raise exception 'files_must_be_array'; end if;
  if jsonb_array_length(files_value)>5 then raise exception 'too_many_files'; end if;

  select code into consent_code
  from public.collab_consent_versions
  where active
  order by effective_at desc
  limit 1;
  if consent_code is null then raise exception 'active_consent_version_missing'; end if;

  tracking_code := upper(substr(encode(gen_random_bytes(18),'hex'),1,24));
  public_ref := 'MILREU-'||to_char(now(),'YYYY')||'-'||upper(substr(encode(gen_random_bytes(8),'hex'),1,12));

  insert into public.collab_contribution_submitters(
    id,project_id,user_id,display_name,email,phone,locality,
    preferred_contact,contact_allowed
  ) values (
    submitter_uuid,project_uuid,p_user_id,display_name_value,email_value,
    nullif(trim(p_payload->>'phone'),''),
    nullif(trim(p_payload->>'locality'),''),
    coalesce(nullif(p_payload->>'preferredContact',''),'email'),
    coalesce((p_payload->>'contactAllowed')::boolean,true)
  );

  insert into public.collab_contributions(
    id,project_id,submitter_id,submitter_user_id,contribution_type,title,
    summary,content,historical_context,place_text,date_text,source_context,
    attribution_preference,requested_usage_scope,rights_declaration,status,
    priority,tracking_token_hash,public_reference,public_message,submitted_at
  ) values (
    contribution_uuid,project_uuid,submitter_uuid,p_user_id,contribution_type_value,
    title_value,nullif(trim(p_payload->>'summary'),''),content_value,
    nullif(trim(p_payload->>'historicalContext'),''),
    nullif(trim(p_payload->>'placeText'),''),
    nullif(trim(p_payload->>'dateText'),''),
    nullif(trim(p_payload->>'sourceContext'),''),
    coalesce(nullif(p_payload->>'attributionPreference',''),'discuss'),
    coalesce(nullif(p_payload->>'requestedUsageScope',''),'review-only'),
    trim(p_payload->>'rightsDeclaration'),
    'submitted',
    'normal',
    encode(digest(tracking_code,'sha256'),'hex'),
    public_ref,
    'Contributo recebido. Será analisado pela equipa do projeto.',
    now()
  );

  insert into public.collab_contribution_consents(
    project_id,contribution_id,consent_version,privacy_accepted,
    rights_confirmed,project_use_authorised,contact_authorised,
    public_attribution_authorised,acceptance_metadata
  ) values (
    project_uuid,contribution_uuid,consent_code,true,true,true,
    coalesce((p_payload->>'contactAllowed')::boolean,true),
    coalesce((p_payload->>'publicAttributionAuthorised')::boolean,false),
    jsonb_build_object(
      'source',coalesce(p_payload->>'submissionSource','web'),
      'language',coalesce(p_payload->>'language','pt-PT')
    )
  );

  if coalesce(target_value->>'targetType','')<>'' then
    insert into public.collab_contribution_targets(
      project_id,contribution_id,target_type,target_identifier,relation_type,note
    ) values (
      project_uuid,contribution_uuid,
      coalesce(nullif(target_value->>'targetType',''),'general'),
      nullif(trim(target_value->>'targetIdentifier'),''),
      coalesce(nullif(target_value->>'relationType',''),'supports'),
      nullif(trim(target_value->>'note'),'')
    );
  end if;

  for file_value in select value from jsonb_array_elements(files_value)
  loop
    if coalesce((file_value->>'sizeBytes')::bigint,0)<=0
       or (file_value->>'sizeBytes')::bigint>26214400
    then raise exception 'invalid_file_size'; end if;

    if coalesce(file_value->>'mimeType','') not in (
      'image/jpeg','image/png','image/webp','image/tiff',
      'application/pdf','text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) then raise exception 'invalid_file_type'; end if;

    file_uuid := gen_random_uuid();
    clean_filename := regexp_replace(
      coalesce(nullif(file_value->>'name',''),'ficheiro'),
      '[^A-Za-z0-9._-]+','-','g'
    );
    file_path := contribution_uuid::text||'/'||file_uuid::text||'/'||clean_filename;

    insert into public.collab_contribution_files(
      id,project_id,contribution_id,storage_path,original_filename,
      mime_type,size_bytes,status,rights_note
    ) values (
      file_uuid,project_uuid,contribution_uuid,file_path,
      coalesce(nullif(file_value->>'name',''),'ficheiro'),
      file_value->>'mimeType',(file_value->>'sizeBytes')::bigint,
      'upload-pending',nullif(trim(file_value->>'rightsNote'),'')
    );

    file_results := file_results||jsonb_build_array(jsonb_build_object(
      'fileId',file_uuid,
      'path',file_path,
      'name',file_value->>'name',
      'mimeType',file_value->>'mimeType'
    ));
  end loop;

  insert into public.collab_contribution_events(
    project_id,contribution_id,actor_user_id,event_type,to_status,
    note,visible_to_submitter,metadata
  ) values (
    project_uuid,contribution_uuid,p_user_id,'contribution.submitted','submitted',
    'Contributo submetido.',true,
    jsonb_build_object('publicReference',public_ref,'fileCount',jsonb_array_length(files_value))
  );

  perform public.collab_record_audit(
    'contribution.submitted','contribution',contribution_uuid::text,null,
    jsonb_build_object(
      'publicReference',public_ref,
      'contributionType',contribution_type_value,
      'authenticated',p_user_id is not null
    )
  );

  return jsonb_build_object(
    'contributionId',contribution_uuid,
    'publicReference',public_ref,
    'trackingCode',tracking_code,
    'status','submitted',
    'files',file_results
  );
end;
$$;


create or replace function public.collab_consume_public_rate_limit_08e(
  p_fingerprint_hash text,
  p_window_started_at timestamptz,
  p_limit integer
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  next_count integer;
begin
  if current_user not in ('service_role','postgres','supabase_admin') then
    raise exception 'service_role_required';
  end if;
  if nullif(trim(p_fingerprint_hash),'') is null
     or p_window_started_at is null
     or p_limit<1
  then raise exception 'invalid_rate_limit_request'; end if;

  insert into public.collab_public_submission_rate_limits(
    project_id,fingerprint_hash,window_started_at,request_count,updated_at
  ) values (
    project_uuid,trim(p_fingerprint_hash),p_window_started_at,1,now()
  )
  on conflict(project_id,fingerprint_hash,window_started_at)
  do update set
    request_count=public.collab_public_submission_rate_limits.request_count+1,
    updated_at=now()
  returning request_count into next_count;

  return jsonb_build_object(
    'allowed',next_count<=p_limit,
    'count',next_count,
    'limit',p_limit
  );
end;
$$;

create or replace function public.collab_create_public_contribution_08e(
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
begin
  if current_user not in ('service_role','postgres','supabase_admin') then
    raise exception 'service_role_required';
  end if;
  return public.collab_create_contribution_internal_08e(p_payload,null);
end;
$$;

create or replace function public.collab_create_member_contribution_08e(
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  user_email text;
  user_name text;
  enriched jsonb;
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  if not public.collab_has_permission('contributions.submit') then
    raise exception 'permission_denied';
  end if;

  select lower(email),coalesce(
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    split_part(email,'@',1)
  ) into user_email,user_name
  from auth.users where id=auth.uid();

  enriched := p_payload
    ||jsonb_build_object(
      'email',coalesce(nullif(p_payload->>'email',''),user_email),
      'displayName',coalesce(nullif(p_payload->>'displayName',''),user_name),
      'submissionSource','member-area'
    );

  return public.collab_create_contribution_internal_08e(enriched,auth.uid());
end;
$$;

create or replace function public.collab_mark_contribution_file_uploaded_08e(
  p_file_id uuid,
  p_sha256 text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  result jsonb;
begin
  if current_user not in ('service_role','postgres','supabase_admin') then
    raise exception 'service_role_required';
  end if;

  update public.collab_contribution_files file
  set status='scan-pending',
      sha256=nullif(trim(p_sha256),''),
      uploaded_at=now(),
      updated_at=now()
  where file.id=p_file_id and file.status='upload-pending'
  returning to_jsonb(file) into result;

  if result is null then raise exception 'file_not_pending'; end if;
  return result;
end;
$$;

create or replace function public.collab_track_public_contribution_08e(
  p_tracking_code text,
  p_email text
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'publicReference',contribution.public_reference,
    'contributionType',contribution.contribution_type,
    'title',contribution.title,
    'status',contribution.status,
    'publicMessage',contribution.public_message,
    'submittedAt',contribution.submitted_at,
    'updatedAt',contribution.updated_at,
    'withdrawalStatus',(
      select request.status
      from public.collab_withdrawal_requests request
      where request.contribution_id=contribution.id
      order by request.submitted_at desc limit 1
    )
  ) into result
  from public.collab_contributions contribution
  join public.collab_contribution_submitters submitter
    on submitter.id=contribution.submitter_id
  where contribution.tracking_token_hash=encode(
      digest(upper(trim(p_tracking_code)),'sha256'),'hex'
    )
    and submitter.email=lower(trim(p_email));

  if result is null then raise exception 'tracking_not_found'; end if;
  return result;
end;
$$;

create or replace function public.collab_submit_withdrawal_request_08e(
  p_tracking_code text,
  p_email text,
  p_name text,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  contribution_uuid uuid;
  public_ref text;
  request_uuid uuid;
begin
  if nullif(trim(p_reason),'') is null then raise exception 'reason_required'; end if;

  select contribution.id,contribution.public_reference
  into contribution_uuid,public_ref
  from public.collab_contributions contribution
  join public.collab_contribution_submitters submitter
    on submitter.id=contribution.submitter_id
  where contribution.tracking_token_hash=encode(
      digest(upper(trim(p_tracking_code)),'sha256'),'hex'
    )
    and submitter.email=lower(trim(p_email));

  if contribution_uuid is null then raise exception 'tracking_not_found'; end if;

  if exists(
    select 1 from public.collab_withdrawal_requests
    where contribution_id=contribution_uuid
      and status in ('submitted','under-review','approved')
  ) then raise exception 'withdrawal_already_open'; end if;

  insert into public.collab_withdrawal_requests(
    project_id,contribution_id,public_reference,requester_user_id,
    requester_name,requester_email,reason,status
  ) values (
    project_uuid,contribution_uuid,public_ref,auth.uid(),
    coalesce(nullif(trim(p_name),''),'Titular do contributo'),
    lower(trim(p_email)),trim(p_reason),'submitted'
  ) returning id into request_uuid;

  insert into public.collab_contribution_events(
    project_id,contribution_id,actor_user_id,event_type,note,
    visible_to_submitter,metadata
  ) values (
    project_uuid,contribution_uuid,auth.uid(),'withdrawal.requested',
    'Pedido de retirada submetido.',true,
    jsonb_build_object('withdrawalRequestId',request_uuid)
  );

  return jsonb_build_object(
    'requestId',request_uuid,
    'publicReference',public_ref,
    'status','submitted'
  );
end;
$$;

create or replace function public.collab_assign_contribution_08e(
  p_contribution_id uuid,
  p_reviewer_user_id uuid,
  p_assignment_role text default 'reviewer',
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  assignment_uuid uuid;
begin
  if not public.collab_has_permission('contributions.assign',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_assignment_role not in ('triage','reviewer','rights','editorial','research') then
    raise exception 'invalid_assignment_role';
  end if;
  if not exists(
    select 1 from public.collab_contributions
    where id=p_contribution_id and project_id=project_uuid
  ) then raise exception 'contribution_not_found'; end if;
  if not public.collab_user_has_permission_08e(
    p_reviewer_user_id,
    case when p_assignment_role='rights' then 'rights.review' else 'contributions.review' end,
    project_uuid
  ) then raise exception 'reviewer_not_authorised'; end if;

  insert into public.collab_contribution_assignments(
    project_id,contribution_id,reviewer_user_id,assignment_role,
    status,assigned_by
  ) values (
    project_uuid,p_contribution_id,p_reviewer_user_id,
    p_assignment_role,'active',auth.uid()
  )
  on conflict(contribution_id,reviewer_user_id,assignment_role)
  where status='active'
  do update set assigned_at=now(),assigned_by=auth.uid()
  returning id into assignment_uuid;

  update public.collab_contributions
  set assigned_to=p_reviewer_user_id,
      status=case when status='submitted' then 'triage' else status end,
      triaged_at=coalesce(triaged_at,now())
  where id=p_contribution_id and project_id=project_uuid;

  insert into public.collab_contribution_events(
    project_id,contribution_id,actor_user_id,event_type,note,
    visible_to_submitter,metadata
  ) values (
    project_uuid,p_contribution_id,auth.uid(),'contribution.assigned',
    nullif(trim(p_note),''),false,
    jsonb_build_object(
      'assignmentId',assignment_uuid,
      'reviewerUserId',p_reviewer_user_id,
      'assignmentRole',p_assignment_role
    )
  );

  return jsonb_build_object('assignmentId',assignment_uuid,'status','active');
end;
$$;

create or replace function public.collab_moderate_contribution_08e(
  p_contribution_id uuid,
  p_action text,
  p_rationale text,
  p_public_message text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  previous_row jsonb;
  next_row jsonb;
  old_status text;
  new_status text := public.collab_contribution_status_for_action_08e(p_action);
  decision_type text;
begin
  if new_status is null then raise exception 'invalid_moderation_action'; end if;
  if nullif(trim(p_rationale),'') is null then raise exception 'rationale_required'; end if;

  if p_action in ('accept','partial','reject','withdraw','incorporate','archive') then
    if not public.collab_has_permission('contributions.decide',project_uuid) then
      raise exception 'decision_permission_required';
    end if;
  elsif p_action='request-info' then
    if not public.collab_has_permission('contributions.request-info',project_uuid) then
      raise exception 'request_info_permission_required';
    end if;
  elsif not public.collab_has_permission('contributions.moderate',project_uuid) then
    raise exception 'permission_denied';
  end if;

  select status,to_jsonb(contribution) into old_status,previous_row
  from public.collab_contributions contribution
  where contribution.id=p_contribution_id
    and contribution.project_id=project_uuid
  for update;

  if old_status is null then raise exception 'contribution_not_found'; end if;
  if old_status in ('withdrawn','archived') and p_action not in ('archive') then
    raise exception 'contribution_closed';
  end if;

  update public.collab_contributions contribution
  set status=new_status,
      public_message=coalesce(nullif(trim(p_public_message),''),contribution.public_message),
      triaged_at=case when new_status='triage' then coalesce(contribution.triaged_at,now()) else contribution.triaged_at end,
      reviewed_at=case when new_status in ('under-review','accepted','partially-accepted','rejected') then now() else contribution.reviewed_at end,
      decided_at=case when new_status in ('accepted','partially-accepted','rejected','withdrawn') then now() else contribution.decided_at end,
      incorporated_at=case when new_status='incorporated' then now() else contribution.incorporated_at end,
      withdrawn_at=case when new_status='withdrawn' then now() else contribution.withdrawn_at end,
      archived_at=case when new_status='archived' then now() else contribution.archived_at end,
      updated_at=now()
  where contribution.id=p_contribution_id
  returning to_jsonb(contribution) into next_row;

  decision_type := case p_action
    when 'accept' then 'accept'
    when 'partial' then 'partial'
    when 'reject' then 'reject'
    when 'request-info' then 'request-info'
    when 'withdraw' then 'withdraw'
    when 'incorporate' then 'incorporate'
    else null
  end;

  if decision_type is not null then
    insert into public.collab_contribution_decisions(
      project_id,contribution_id,decision_type,rationale,
      public_message,decided_by
    ) values (
      project_uuid,p_contribution_id,decision_type,trim(p_rationale),
      nullif(trim(p_public_message),''),auth.uid()
    );
  end if;

  insert into public.collab_contribution_events(
    project_id,contribution_id,actor_user_id,event_type,from_status,to_status,
    note,visible_to_submitter,metadata
  ) values (
    project_uuid,p_contribution_id,auth.uid(),'contribution.moderated',
    old_status,new_status,trim(p_rationale),
    p_action in ('request-info','accept','partial','reject','withdraw','incorporate'),
    jsonb_build_object('action',p_action,'publicMessage',nullif(trim(p_public_message),''))
  );

  perform public.collab_record_audit(
    'contribution.moderated','contribution',p_contribution_id::text,
    previous_row,next_row,jsonb_build_object('action',p_action)
  );

  return next_row;
end;
$$;

create or replace function public.collab_create_incorporation_proposal_08e(
  p_contribution_id uuid,
  p_destination text,
  p_target_identifier text,
  p_summary text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  proposal_uuid uuid;
begin
  if not public.collab_has_permission('contributions.review',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_destination not in ('museum','proteus','portal','research','exhibition','archive') then
    raise exception 'invalid_destination';
  end if;
  if nullif(trim(p_summary),'') is null then raise exception 'summary_required'; end if;
  if not exists(
    select 1 from public.collab_contributions
    where id=p_contribution_id and project_id=project_uuid
      and status in ('accepted','partially-accepted')
  ) then raise exception 'contribution_not_accepted'; end if;

  insert into public.collab_contribution_incorporation_proposals(
    project_id,contribution_id,destination,target_identifier,
    proposal_summary,status,proposed_by
  ) values (
    project_uuid,p_contribution_id,p_destination,
    nullif(trim(p_target_identifier),''),trim(p_summary),'pending',auth.uid()
  ) returning id into proposal_uuid;

  insert into public.collab_contribution_events(
    project_id,contribution_id,actor_user_id,event_type,note,
    visible_to_submitter,metadata
  ) values (
    project_uuid,p_contribution_id,auth.uid(),'incorporation.proposed',
    trim(p_summary),false,
    jsonb_build_object(
      'proposalId',proposal_uuid,
      'destination',p_destination,
      'targetIdentifier',nullif(trim(p_target_identifier),'')
    )
  );

  return jsonb_build_object('proposalId',proposal_uuid,'status','pending');
end;
$$;

create or replace function public.collab_review_contribution_file_08e(
  p_file_id uuid,
  p_status text,
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
  if not public.collab_has_permission('contributions.files.review',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status not in ('accepted','rejected','deleted','scan-pending') then
    raise exception 'invalid_file_status';
  end if;

  update public.collab_contribution_files file
  set status=p_status,
      technical_note=nullif(trim(p_note),''),
      reviewed_at=now(),
      reviewed_by=auth.uid(),
      deleted_at=case when p_status='deleted' then now() else file.deleted_at end,
      updated_at=now()
  where file.id=p_file_id and file.project_id=project_uuid
  returning to_jsonb(file) into result;

  if result is null then raise exception 'file_not_found'; end if;
  return result;
end;
$$;

create or replace function public.collab_can_access_contribution_file_08e(
  p_file_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'allowed',true,
    'bucket',file.storage_bucket,
    'path',file.storage_path,
    'filename',file.original_filename,
    'mimeType',file.mime_type
  ) into result
  from public.collab_contribution_files file
  join public.collab_contributions contribution
    on contribution.id=file.contribution_id
  where file.id=p_file_id
    and file.status<>'deleted'
    and (
      contribution.submitter_user_id=auth.uid()
      or public.collab_has_permission('contributions.files.review',file.project_id)
      or public.collab_has_permission('contributions.moderate',file.project_id)
    );

  if result is null then raise exception 'file_access_denied'; end if;
  return result;
end;
$$;

create or replace function public.collab_resolve_withdrawal_request_08e(
  p_request_id uuid,
  p_status text,
  p_note text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  request_row public.collab_withdrawal_requests%rowtype;
  result jsonb;
begin
  if not public.collab_has_permission('withdrawals.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status not in ('under-review','approved','rejected','completed') then
    raise exception 'invalid_withdrawal_status';
  end if;

  select * into request_row
  from public.collab_withdrawal_requests
  where id=p_request_id and project_id=project_uuid
  for update;

  if request_row.id is null then raise exception 'withdrawal_not_found'; end if;

  update public.collab_withdrawal_requests request
  set status=p_status,
      reviewer_note=nullif(trim(p_note),''),
      reviewed_by=auth.uid(),
      reviewed_at=case when p_status in ('under-review','approved','rejected','completed') then now() else request.reviewed_at end,
      completed_at=case when p_status='completed' then now() else request.completed_at end
  where request.id=p_request_id
  returning to_jsonb(request) into result;

  if p_status in ('approved','completed') and request_row.contribution_id is not null then
    update public.collab_contributions
    set status='withdrawn',withdrawn_at=now(),updated_at=now(),
        public_message='O pedido de retirada foi aprovado.'
    where id=request_row.contribution_id and project_id=project_uuid;

    insert into public.collab_contribution_events(
      project_id,contribution_id,actor_user_id,event_type,to_status,
      note,visible_to_submitter,metadata
    ) values (
      project_uuid,request_row.contribution_id,auth.uid(),
      'withdrawal.resolved','withdrawn',nullif(trim(p_note),''),true,
      jsonb_build_object('requestId',p_request_id,'status',p_status)
    );
  end if;

  return result;
end;
$$;

revoke all on function public.collab_user_has_permission_08e(uuid,text,uuid) from public;
revoke all on function public.collab_create_contribution_internal_08e(jsonb,uuid) from public;
revoke all on function public.collab_consume_public_rate_limit_08e(text,timestamptz,integer) from public;
revoke all on function public.collab_create_public_contribution_08e(jsonb) from public;
revoke all on function public.collab_create_member_contribution_08e(jsonb) from public;
revoke all on function public.collab_mark_contribution_file_uploaded_08e(uuid,text) from public;
revoke all on function public.collab_track_public_contribution_08e(text,text) from public;
revoke all on function public.collab_submit_withdrawal_request_08e(text,text,text,text) from public;
revoke all on function public.collab_assign_contribution_08e(uuid,uuid,text,text) from public;
revoke all on function public.collab_moderate_contribution_08e(uuid,text,text,text) from public;
revoke all on function public.collab_create_incorporation_proposal_08e(uuid,text,text,text) from public;
revoke all on function public.collab_review_contribution_file_08e(uuid,text,text) from public;
revoke all on function public.collab_can_access_contribution_file_08e(uuid) from public;
revoke all on function public.collab_resolve_withdrawal_request_08e(uuid,text,text) from public;

grant execute on function public.collab_consume_public_rate_limit_08e(text,timestamptz,integer) to service_role;
grant execute on function public.collab_create_public_contribution_08e(jsonb) to service_role;
grant execute on function public.collab_mark_contribution_file_uploaded_08e(uuid,text) to service_role;
grant execute on function public.collab_create_member_contribution_08e(jsonb) to authenticated;
grant execute on function public.collab_track_public_contribution_08e(text,text) to service_role;
grant execute on function public.collab_submit_withdrawal_request_08e(text,text,text,text) to service_role;
grant execute on function public.collab_assign_contribution_08e(uuid,uuid,text,text) to authenticated;
grant execute on function public.collab_moderate_contribution_08e(uuid,text,text,text) to authenticated;
grant execute on function public.collab_create_incorporation_proposal_08e(uuid,text,text,text) to authenticated;
grant execute on function public.collab_review_contribution_file_08e(uuid,text,text) to authenticated;
grant execute on function public.collab_can_access_contribution_file_08e(uuid) to authenticated;
grant execute on function public.collab_resolve_withdrawal_request_08e(uuid,text,text) to authenticated;
