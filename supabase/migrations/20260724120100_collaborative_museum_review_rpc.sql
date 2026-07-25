-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- RPCs do Pacote 08F.

create or replace function public.collab_training_completed_08f(
  p_user_id uuid,
  p_trail_code text,
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
    from public.collab_training_enrolments enrolment
    where enrolment.project_id=p_project_id
      and enrolment.user_id=p_user_id
      and enrolment.trail_code=p_trail_code
      and enrolment.status='completed'
      and (enrolment.expires_at is null or enrolment.expires_at>now())
  )
$$;

create or replace function public.collab_require_training_08f(
  p_action text,
  p_user_id uuid default auth.uid(),
  p_project_id uuid default public.collab_project_id()
)
returns void
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  required_trails text[];
  trail text;
begin
  required_trails := case p_action
    when 'edit' then array['project-foundations','museum-editorial-evidence']
    when 'editorial-approve' then array['project-foundations','museum-editorial-evidence','accessible-public-writing']
    when 'rights-approve' then array['project-foundations','rights-credits-ai']
    when 'publication-approve' then array['project-foundations','museum-editorial-evidence','rights-credits-ai','accessible-public-writing']
    when 'translate' then array['project-foundations','translation-localisation']
    else array[]::text[]
  end;

  foreach trail in array required_trails
  loop
    if not public.collab_training_completed_08f(p_user_id,trail,p_project_id) then
      raise exception 'training_required:%',trail;
    end if;
  end loop;
end;
$$;

create or replace function public.collab_complete_training_lesson_08f(
  p_trail_code text,
  p_lesson_code text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  enrolment_uuid uuid;
  lesson_total integer;
  lesson_completed integer;
  progress integer;
  result jsonb;
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  if not public.collab_has_permission('training.complete',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if not exists(
    select 1 from public.collab_training_lessons
    where trail_code=p_trail_code and lesson_code=p_lesson_code and active
  ) then raise exception 'lesson_not_found'; end if;

  insert into public.collab_training_enrolments(
    project_id,user_id,trail_code,status,progress_percent,started_at
  ) values (
    project_uuid,auth.uid(),p_trail_code,'in-progress',0,now()
  )
  on conflict(project_id,user_id,trail_code)
  do update set
    status=case
      when collab_training_enrolments.status='completed' then 'completed'
      else 'in-progress'
    end,
    started_at=coalesce(collab_training_enrolments.started_at,now()),
    updated_at=now()
  returning id into enrolment_uuid;

  insert into public.collab_training_lesson_progress(
    enrolment_id,lesson_code,status,completed_at
  ) values (
    enrolment_uuid,p_lesson_code,'completed',now()
  )
  on conflict(enrolment_id,lesson_code)
  do update set status='completed',completed_at=now(),updated_at=now();

  select count(*) into lesson_total
  from public.collab_training_lessons
  where trail_code=p_trail_code and active;

  select count(*) into lesson_completed
  from public.collab_training_lesson_progress
  where enrolment_id=enrolment_uuid and status='completed';

  progress := case when lesson_total=0 then 0 else floor(lesson_completed*100.0/lesson_total)::integer end;

  update public.collab_training_enrolments enrolment
  set progress_percent=progress,
      status=case when progress=100 then 'assessment-pending' else 'in-progress' end,
      updated_at=now()
  where enrolment.id=enrolment_uuid
  returning to_jsonb(enrolment) into result;

  perform public.collab_record_audit(
    'training.lesson.completed','training_enrolment',enrolment_uuid::text,
    null,result,jsonb_build_object('trailCode',p_trail_code,'lessonCode',p_lesson_code)
  );

  return result;
end;
$$;

create or replace function public.collab_record_training_assessment_08f(
  p_user_id uuid,
  p_trail_code text,
  p_score integer,
  p_answers jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  passing integer;
  attempt integer;
  passed_value boolean;
  result jsonb;
begin
  if not (
    public.collab_has_permission('training.assess',project_uuid)
    or public.collab_has_permission('training.manage',project_uuid)
  ) then raise exception 'permission_denied'; end if;
  if p_score<0 or p_score>100 then raise exception 'invalid_score'; end if;

  select passing_score into passing
  from public.collab_training_trails
  where code=p_trail_code and active;
  if passing is null then raise exception 'trail_not_found'; end if;

  if not exists(
    select 1 from public.collab_training_enrolments
    where project_id=project_uuid and user_id=p_user_id
      and trail_code=p_trail_code and progress_percent=100
  ) then raise exception 'lessons_not_completed'; end if;

  select coalesce(max(attempt_number),0)+1 into attempt
  from public.collab_training_assessments
  where project_id=project_uuid and user_id=p_user_id and trail_code=p_trail_code;

  passed_value := p_score>=passing;

  insert into public.collab_training_assessments(
    project_id,user_id,trail_code,attempt_number,score,passed,answers,assessed_by
  ) values (
    project_uuid,p_user_id,p_trail_code,attempt,p_score,passed_value,
    coalesce(p_answers,'{}'::jsonb),auth.uid()
  ) returning to_jsonb(collab_training_assessments) into result;

  update public.collab_training_enrolments
  set status=case when passed_value then 'completed' else 'assessment-pending' end,
      completed_at=case when passed_value then now() else null end,
      updated_at=now()
  where project_id=project_uuid and user_id=p_user_id and trail_code=p_trail_code;

  perform public.collab_record_audit(
    'training.assessment.recorded','training_assessment',
    result->>'id',null,result,
    jsonb_build_object('trailCode',p_trail_code,'passed',passed_value)
  );

  return result;
end;
$$;

create or replace function public.collab_bootstrap_museum_review_08f(
  p_cycle jsonb,
  p_records jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  cycle_uuid uuid;
  row jsonb;
  record_count integer := 0;
begin
  if not public.collab_has_permission('museum.review.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if jsonb_typeof(p_records)<>'array' then raise exception 'records_must_be_array'; end if;
  if jsonb_array_length(p_records)<>31 then raise exception 'expected_31_records'; end if;
  if nullif(trim(p_cycle->>'code'),'') is null
     or nullif(trim(p_cycle->>'title'),'') is null
     or nullif(trim(p_cycle->>'sourceDatasetHash'),'') is null
  then raise exception 'invalid_cycle'; end if;

  insert into public.collab_museum_review_cycles(
    project_id,code,title,description,status,source_dataset_version,
    source_dataset_hash,started_at,created_by
  ) values (
    project_uuid,trim(p_cycle->>'code'),trim(p_cycle->>'title'),
    nullif(trim(p_cycle->>'description'),''),
    coalesce(nullif(p_cycle->>'status',''),'planned'),
    coalesce(nullif(p_cycle->>'sourceDatasetVersion',''),'unknown'),
    trim(p_cycle->>'sourceDatasetHash'),
    case when coalesce(p_cycle->>'status','planned')='active' then now() else null end,
    auth.uid()
  )
  on conflict(project_id,code)
  do update set
    title=excluded.title,
    description=excluded.description,
    source_dataset_version=excluded.source_dataset_version,
    source_dataset_hash=excluded.source_dataset_hash,
    updated_at=now()
  returning id into cycle_uuid;

  for row in select value from jsonb_array_elements(p_records)
  loop
    if nullif(row->>'memoryId','') is null
       or nullif(row->>'baseHash','') is null
    then raise exception 'invalid_review_record'; end if;

    insert into public.collab_museum_review_records(
      project_id,cycle_id,memory_id,status,source_record_hash,
      source_editorial_status,source_site_visible,public_release_eligible,
      requires_ai_disclosure,linked_contribution_count
    ) values (
      project_uuid,cycle_uuid,row->>'memoryId','not-started',
      row->>'baseHash',row->>'sourceEditorialStatus',
      coalesce((row->>'siteVisible')::boolean,false),
      coalesce((row->>'publicReleaseEligible')::boolean,false),
      coalesce((row->>'requiresAiDisclosure')::boolean,false),
      coalesce((row->>'linkedContributionCount')::integer,0)
    )
    on conflict(cycle_id,memory_id)
    do update set
      source_record_hash=excluded.source_record_hash,
      source_editorial_status=excluded.source_editorial_status,
      source_site_visible=excluded.source_site_visible,
      public_release_eligible=excluded.public_release_eligible,
      requires_ai_disclosure=excluded.requires_ai_disclosure,
      updated_at=now();

    record_count := record_count+1;
  end loop;

  perform public.collab_record_audit(
    'museum_review.cycle.bootstrapped','museum_review_cycle',cycle_uuid::text,
    null,jsonb_build_object('recordCount',record_count,'cycle',p_cycle)
  );

  return jsonb_build_object('cycleId',cycle_uuid,'recordCount',record_count);
end;
$$;


create or replace function public.collab_museum_review_field_allowed_08f(
  p_field_path text
)
returns boolean
language sql
immutable
as $$
  select p_field_path=any(array[
    '/title/pt-PT',
    '/description/short/pt-PT',
    '/description/objective/pt-PT',
    '/description/community/pt-PT',
    '/description/historicalContext/pt-PT',
    '/description/institutionalContext/pt-PT',
    '/date/display/pt-PT',
    '/date/start',
    '/date/end',
    '/date/precision',
    '/classification/primaryType',
    '/classification/secondaryTypes',
    '/classification/period/pt-PT',
    '/classification/tags',
    '/places',
    '/media/credit',
    '/media/digitalInterventions',
    '/rights',
    '/sources',
    '/relations',
    '/publication',
    '/localisationStatus'
  ])
$$;

create or replace function public.collab_upsert_museum_review_proposal_08f(
  p_proposal_id uuid,
  p_review_record_id uuid,
  p_field_path text,
  p_base_value jsonb,
  p_proposed_value jsonb,
  p_rationale text,
  p_source_ids jsonb default '[]'::jsonb,
  p_contribution_ids jsonb default '[]'::jsonb,
  p_submit boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  target_id uuid := coalesce(p_proposal_id,gen_random_uuid());
  before_row jsonb;
  after_row jsonb;
  record_row public.collab_museum_review_records%rowtype;
  contribution_id_text text;
  contribution_uuid uuid;
begin
  if not public.collab_has_permission('museum.review.edit',project_uuid) then
    raise exception 'permission_denied';
  end if;
  perform public.collab_require_training_08f('edit',auth.uid(),project_uuid);
  if not public.collab_museum_review_field_allowed_08f(p_field_path) then
    raise exception 'field_path_not_allowed';
  end if;
  if jsonb_typeof(coalesce(p_source_ids,'[]'::jsonb))<>'array'
     or jsonb_typeof(coalesce(p_contribution_ids,'[]'::jsonb))<>'array'
  then raise exception 'proposal_links_must_be_arrays'; end if;
  if nullif(trim(p_rationale),'') is null then raise exception 'rationale_required'; end if;

  select * into record_row
  from public.collab_museum_review_records
  where id=p_review_record_id and project_id=project_uuid
  for update;
  if record_row.id is null then raise exception 'review_record_not_found'; end if;
  if record_row.status in ('incorporated','closed') then raise exception 'review_record_closed'; end if;

  for contribution_id_text in
    select jsonb_array_elements_text(coalesce(p_contribution_ids,'[]'::jsonb))
  loop
    begin
      contribution_uuid := contribution_id_text::uuid;
    exception when invalid_text_representation then
      raise exception 'invalid_contribution_id:%',contribution_id_text;
    end;

    if not exists(
      select 1
      from public.collab_contributions contribution
      where contribution.id=contribution_uuid
        and contribution.project_id=project_uuid
        and contribution.status in ('accepted','partially-accepted','incorporated')
    ) then
      raise exception 'contribution_not_eligible:%',contribution_id_text;
    end if;
  end loop;


  select to_jsonb(proposal) into before_row
  from public.collab_museum_review_field_proposals proposal
  where proposal.id=target_id and proposal.project_id=project_uuid;

  if p_proposal_id is not null and before_row is null then
    raise exception 'proposal_not_found';
  end if;
  if coalesce(before_row->>'status','') in ('accepted','incorporated') then
    raise exception 'proposal_locked';
  end if;

  insert into public.collab_museum_review_field_proposals(
    id,project_id,review_record_id,field_path,base_value,proposed_value,
    rationale,source_ids,contribution_ids,status,proposed_by
  ) values (
    target_id,project_uuid,p_review_record_id,p_field_path,p_base_value,
    p_proposed_value,trim(p_rationale),coalesce(p_source_ids,'[]'::jsonb),
    coalesce(p_contribution_ids,'[]'::jsonb),
    case when p_submit then 'submitted' else 'draft' end,
    auth.uid()
  )
  on conflict(id) do update set
    field_path=excluded.field_path,
    base_value=excluded.base_value,
    proposed_value=excluded.proposed_value,
    rationale=excluded.rationale,
    source_ids=excluded.source_ids,
    contribution_ids=excluded.contribution_ids,
    status=case
      when collab_museum_review_field_proposals.status in ('accepted','incorporated')
      then collab_museum_review_field_proposals.status
      else excluded.status
    end,
    updated_at=now()
  returning to_jsonb(collab_museum_review_field_proposals) into after_row;

  update public.collab_museum_review_records
  set status=case when status='not-started' then 'in-progress' else status end,
      updated_at=now()
  where id=p_review_record_id;

  perform public.collab_record_audit(
    case when before_row is null then 'museum_review.proposal.created' else 'museum_review.proposal.updated' end,
    'museum_review_proposal',target_id::text,before_row,after_row
  );

  return after_row;
end;
$$;

create or replace function public.collab_review_museum_proposal_08f(
  p_proposal_id uuid,
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
  result jsonb;
  review_uuid uuid;
begin
  if not public.collab_has_permission('museum.review.check',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status not in ('accepted','rejected') then raise exception 'invalid_proposal_status'; end if;
  if nullif(trim(p_note),'') is null then raise exception 'review_note_required'; end if;

  update public.collab_museum_review_field_proposals proposal
  set status=p_status,reviewed_by=auth.uid(),reviewed_at=now(),updated_at=now()
  where proposal.id=p_proposal_id
    and proposal.project_id=project_uuid
    and proposal.status='submitted'
  returning proposal.review_record_id,to_jsonb(proposal) into review_uuid,result;

  if result is null then raise exception 'proposal_not_reviewable'; end if;

  update public.collab_museum_review_records record
  set accepted_proposal_count=(
    select count(*) from public.collab_museum_review_field_proposals proposal
    where proposal.review_record_id=record.id and proposal.status='accepted'
  ),
  updated_at=now()
  where record.id=review_uuid;

  insert into public.collab_museum_review_comments(
    project_id,review_record_id,field_path,comment_type,body,blocking,created_by
  )
  select project_uuid,proposal.review_record_id,proposal.field_path,'note',
    trim(p_note),false,auth.uid()
  from public.collab_museum_review_field_proposals proposal
  where proposal.id=p_proposal_id;

  return result;
end;
$$;


create or replace function public.collab_supersede_museum_proposal_08f(
  p_proposal_id uuid,
  p_rationale text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  review_uuid uuid;
  result jsonb;
begin
  if not public.collab_has_permission('museum.review.check',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_rationale),'') is null then raise exception 'rationale_required'; end if;

  update public.collab_museum_review_field_proposals proposal
  set status='superseded',reviewed_by=auth.uid(),reviewed_at=now(),updated_at=now()
  where proposal.id=p_proposal_id
    and proposal.project_id=project_uuid
    and proposal.status='accepted'
  returning proposal.review_record_id,to_jsonb(proposal) into review_uuid,result;

  if result is null then raise exception 'accepted_proposal_not_found'; end if;

  insert into public.collab_museum_review_comments(
    project_id,review_record_id,field_path,comment_type,body,blocking,created_by
  )
  select project_uuid,proposal.review_record_id,proposal.field_path,'note',
    'Proposta substituída: '||trim(p_rationale),false,auth.uid()
  from public.collab_museum_review_field_proposals proposal
  where proposal.id=p_proposal_id;

  update public.collab_museum_review_records record
  set accepted_proposal_count=(
    select count(*) from public.collab_museum_review_field_proposals proposal
    where proposal.review_record_id=record.id and proposal.status='accepted'
  ),
  status=case when status in ('editorial-approved','rights-approved','publication-approved') then 'needs-changes' else status end,
  editorial_approved_at=case when status in ('editorial-approved','rights-approved','publication-approved') then null else editorial_approved_at end,
  rights_approved_at=case when status in ('editorial-approved','rights-approved','publication-approved') then null else rights_approved_at end,
  publication_approved_at=case when status in ('editorial-approved','rights-approved','publication-approved') then null else publication_approved_at end,
  updated_at=now()
  where record.id=review_uuid;

  perform public.collab_record_audit(
    'museum_review.proposal.superseded','museum_review_proposal',
    p_proposal_id::text,null,result,jsonb_build_object('rationale',trim(p_rationale))
  );

  return result;
end;
$$;

create or replace function public.collab_add_museum_review_comment_08f(
  p_review_record_id uuid,
  p_field_path text,
  p_comment_type text,
  p_body text,
  p_blocking boolean default false
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
  if not public.collab_has_permission('museum.review.comment',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_body),'') is null then raise exception 'comment_required'; end if;
  if p_comment_type not in (
    'note','question','blocking','source-request','rights-request',
    'translation-request','accessibility-request'
  ) then raise exception 'invalid_comment_type'; end if;
  if not exists(
    select 1 from public.collab_museum_review_records
    where id=p_review_record_id and project_id=project_uuid
  ) then raise exception 'review_record_not_found'; end if;

  insert into public.collab_museum_review_comments(
    project_id,review_record_id,field_path,comment_type,body,blocking,created_by
  ) values (
    project_uuid,p_review_record_id,nullif(trim(p_field_path),''),
    p_comment_type,trim(p_body),p_blocking or p_comment_type='blocking',auth.uid()
  ) returning to_jsonb(collab_museum_review_comments) into result;

  update public.collab_museum_review_records record
  set blocking_comment_count=(
    select count(*) from public.collab_museum_review_comments comment
    where comment.review_record_id=record.id and comment.blocking and not comment.resolved
  ),
  status=case when p_blocking or p_comment_type='blocking' then 'needs-changes' else record.status end,
  updated_at=now()
  where record.id=p_review_record_id;

  return result;
end;
$$;

create or replace function public.collab_resolve_museum_review_comment_08f(
  p_comment_id uuid,
  p_resolution text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  review_uuid uuid;
  result jsonb;
begin
  if not public.collab_has_permission('museum.review.comment',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_resolution),'') is null then raise exception 'resolution_required'; end if;

  update public.collab_museum_review_comments comment
  set resolved=true,resolved_by=auth.uid(),resolved_at=now(),
      body=comment.body||E'\n\nResolução: '||trim(p_resolution)
  where comment.id=p_comment_id and comment.project_id=project_uuid and not comment.resolved
  returning comment.review_record_id,to_jsonb(comment) into review_uuid,result;

  if result is null then raise exception 'comment_not_resolvable'; end if;

  update public.collab_museum_review_records record
  set blocking_comment_count=(
    select count(*) from public.collab_museum_review_comments comment
    where comment.review_record_id=record.id and comment.blocking and not comment.resolved
  ),
  updated_at=now()
  where record.id=review_uuid;

  return result;
end;
$$;

create or replace function public.collab_assign_museum_review_08f(
  p_review_record_id uuid,
  p_user_id uuid,
  p_assignment_role text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  required_permission text;
  assignment_uuid uuid;
begin
  if not public.collab_has_permission('museum.review.assign',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_assignment_role not in (
    'editorial','research','rights','translation','accessibility','publication'
  ) then raise exception 'invalid_assignment_role'; end if;

  required_permission := case p_assignment_role
    when 'rights' then 'museum.review.rights-approve'
    when 'publication' then 'museum.review.publication-approve'
    else 'museum.review.edit'
  end;

  if not public.collab_user_has_permission_08e(p_user_id,required_permission,project_uuid)
     and not public.collab_user_has_permission_08e(p_user_id,'museum.review.view',project_uuid)
  then raise exception 'assignee_not_authorised'; end if;

  if not exists(
    select 1 from public.collab_museum_review_records
    where id=p_review_record_id and project_id=project_uuid
  ) then raise exception 'review_record_not_found'; end if;

  insert into public.collab_museum_review_assignments(
    project_id,review_record_id,user_id,assignment_role,status,assigned_by
  ) values (
    project_uuid,p_review_record_id,p_user_id,p_assignment_role,'active',auth.uid()
  )
  on conflict(review_record_id,user_id,assignment_role)
  where status='active'
  do update set assigned_at=now(),assigned_by=auth.uid()
  returning id into assignment_uuid;

  update public.collab_museum_review_records
  set assigned_editor=case when p_assignment_role='editorial' then p_user_id else assigned_editor end,
      assigned_researcher=case when p_assignment_role='research' then p_user_id else assigned_researcher end,
      assigned_rights_reviewer=case when p_assignment_role='rights' then p_user_id else assigned_rights_reviewer end,
      assigned_translator=case when p_assignment_role='translation' then p_user_id else assigned_translator end,
      status=case when status='not-started' then 'in-progress' else status end,
      updated_at=now()
  where id=p_review_record_id;

  return jsonb_build_object('assignmentId',assignment_uuid,'status','active');
end;
$$;

create or replace function public.collab_set_museum_review_check_08f(
  p_review_record_id uuid,
  p_check_type text,
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
  if not public.collab_has_permission('museum.review.check',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_check_type not in (
    'editorial','source','rights','digital-intervention','accessibility',
    'translation','relations','publication'
  ) then raise exception 'invalid_check_type'; end if;
  if p_status not in ('pending','in-progress','passed','failed','not-applicable') then
    raise exception 'invalid_check_status';
  end if;

  insert into public.collab_museum_review_checks(
    project_id,review_record_id,check_type,status,note,checked_by,checked_at
  ) values (
    project_uuid,p_review_record_id,p_check_type,p_status,
    nullif(trim(p_note),''),auth.uid(),
    case when p_status in ('passed','failed','not-applicable') then now() else null end
  )
  on conflict(review_record_id,check_type)
  do update set
    status=excluded.status,
    note=excluded.note,
    checked_by=excluded.checked_by,
    checked_at=excluded.checked_at,
    updated_at=now()
  returning to_jsonb(collab_museum_review_checks) into result;

  if result is null then raise exception 'check_not_saved'; end if;
  return result;
end;
$$;

create or replace function public.collab_museum_review_gates_08f(
  p_review_record_id uuid,
  p_decision_type text
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  required_checks text[];
  missing_checks jsonb;
  blockers integer;
  proposals integer;
begin
  required_checks := case p_decision_type
    when 'editorial-approve' then array['editorial','source','relations','accessibility']
    when 'rights-approve' then array['rights','digital-intervention']
    when 'publication-approve' then array['publication','translation']
    else array[]::text[]
  end;

  select coalesce(jsonb_agg(check_code),'[]'::jsonb)
  into missing_checks
  from unnest(required_checks) check_code
  where not exists(
    select 1 from public.collab_museum_review_checks check_row
    where check_row.review_record_id=p_review_record_id
      and check_row.check_type=check_code
      and check_row.status in ('passed','not-applicable')
  );

  select count(*) into blockers
  from public.collab_museum_review_comments
  where review_record_id=p_review_record_id and blocking and not resolved;

  select count(*) into proposals
  from public.collab_museum_review_field_proposals
  where review_record_id=p_review_record_id and status in ('draft','submitted');

  return jsonb_build_object(
    'missingChecks',missing_checks,
    'blockingComments',blockers,
    'openProposals',proposals,
    'passed',
      jsonb_array_length(missing_checks)=0
      and blockers=0
      and proposals=0
  );
end;
$$;


create or replace function public.collab_museum_review_publication_eligibility_08f(
  p_review_record_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  record_row public.collab_museum_review_records%rowtype;
  publication_value jsonb;
  eligible boolean;
  disclosure_ok boolean;
begin
  select * into record_row
  from public.collab_museum_review_records
  where id=p_review_record_id and project_id=public.collab_project_id();
  if record_row.id is null then raise exception 'review_record_not_found'; end if;

  select proposal.proposed_value into publication_value
  from public.collab_museum_review_field_proposals proposal
  where proposal.review_record_id=p_review_record_id
    and proposal.field_path='/publication'
    and proposal.status='accepted'
  order by proposal.reviewed_at desc nulls last
  limit 1;

  eligible := record_row.public_release_eligible
    or coalesce((publication_value->>'publicReleaseEligible')::boolean,false);

  disclosure_ok := not record_row.requires_ai_disclosure
    or (
      publication_value is not null
      and publication_value->>'reviewNotice'='ai-substantive-intervention'
      and coalesce((publication_value->>'publicReleaseEligible')::boolean,false)
    );

  return jsonb_build_object(
    'eligible',eligible,
    'requiresAiDisclosure',record_row.requires_ai_disclosure,
    'aiDisclosurePreserved',disclosure_ok,
    'passed',eligible and disclosure_ok
  );
end;
$$;

create or replace function public.collab_decide_museum_review_08f(
  p_review_record_id uuid,
  p_decision_type text,
  p_rationale text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  record_row public.collab_museum_review_records%rowtype;
  gates jsonb;
  next_status text;
  result jsonb;
begin
  if nullif(trim(p_rationale),'') is null then raise exception 'rationale_required'; end if;
  if p_decision_type not in (
    'editorial-approve','rights-approve','publication-approve',
    'request-changes','reopen','incorporate'
  ) then raise exception 'invalid_decision_type'; end if;

  if p_decision_type='editorial-approve' then
    if not public.collab_has_permission('museum.review.editorial-approve',project_uuid) then raise exception 'permission_denied'; end if;
    perform public.collab_require_training_08f('editorial-approve',auth.uid(),project_uuid);
  elsif p_decision_type='rights-approve' then
    if not public.collab_has_permission('museum.review.rights-approve',project_uuid) then raise exception 'permission_denied'; end if;
    perform public.collab_require_training_08f('rights-approve',auth.uid(),project_uuid);
  elsif p_decision_type='publication-approve' then
    if not public.collab_has_permission('museum.review.publication-approve',project_uuid) then raise exception 'permission_denied'; end if;
    perform public.collab_require_training_08f('publication-approve',auth.uid(),project_uuid);
  elsif p_decision_type='incorporate' then
    if not public.collab_has_permission('museum.review.apply',project_uuid) then raise exception 'permission_denied'; end if;
  elsif not public.collab_has_permission('museum.review.check',project_uuid) then
    raise exception 'permission_denied';
  end if;

  select * into record_row
  from public.collab_museum_review_records
  where id=p_review_record_id and project_id=project_uuid
  for update;
  if record_row.id is null then raise exception 'review_record_not_found'; end if;

  if p_decision_type in ('editorial-approve','rights-approve','publication-approve') then
    gates := public.collab_museum_review_gates_08f(p_review_record_id,p_decision_type);
    if coalesce((gates->>'passed')::boolean,false) is not true then
      raise exception 'review_gates_failed:%',gates::text;
    end if;
  end if;

  if p_decision_type='editorial-approve' and record_row.status not in ('ready-editorial','in-progress','needs-changes') then
    raise exception 'invalid_editorial_state';
  end if;
  if p_decision_type='rights-approve' and record_row.editorial_approved_at is null then
    raise exception 'editorial_approval_required';
  end if;
  if p_decision_type='publication-approve' and record_row.rights_approved_at is null then
    raise exception 'rights_approval_required';
  end if;
  if p_decision_type='publication-approve'
     and coalesce((public.collab_museum_review_publication_eligibility_08f(p_review_record_id)->>'passed')::boolean,false) is not true
  then raise exception 'public_release_eligibility_required'; end if;
  if p_decision_type='incorporate' and record_row.publication_approved_at is null then
    raise exception 'publication_approval_required';
  end if;

  next_status := case p_decision_type
    when 'editorial-approve' then 'editorial-approved'
    when 'rights-approve' then 'rights-approved'
    when 'publication-approve' then 'publication-approved'
    when 'request-changes' then 'needs-changes'
    when 'reopen' then 'in-progress'
    when 'incorporate' then 'incorporated'
  end;

  update public.collab_museum_review_records record
  set status=next_status,
      editorial_approved_at=case when p_decision_type='editorial-approve' then now() else record.editorial_approved_at end,
      rights_approved_at=case when p_decision_type='rights-approve' then now() else record.rights_approved_at end,
      publication_approved_at=case when p_decision_type='publication-approve' then now() else record.publication_approved_at end,
      incorporated_at=case when p_decision_type='incorporate' then now() else record.incorporated_at end,
      updated_at=now()
  where record.id=p_review_record_id
  returning to_jsonb(record) into result;

  insert into public.collab_museum_review_decisions(
    project_id,review_record_id,decision_type,rationale,decision_data,decided_by
  ) values (
    project_uuid,p_review_record_id,p_decision_type,trim(p_rationale),
    coalesce(gates,'{}'::jsonb),auth.uid()
  );

  perform public.collab_record_audit(
    'museum_review.decision.recorded','museum_review_record',
    p_review_record_id::text,to_jsonb(record_row),result,
    jsonb_build_object('decisionType',p_decision_type,'gates',gates)
  );

  return result;
end;
$$;

create or replace function public.collab_link_contribution_to_museum_review_08f(
  p_review_record_id uuid,
  p_contribution_id uuid,
  p_link_type text,
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
  if not public.collab_has_permission('museum.review.link-contribution',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_link_type not in ('supports','corrects','identifies','rights','source','contextualises') then
    raise exception 'invalid_link_type';
  end if;
  if not exists(
    select 1 from public.collab_contributions
    where id=p_contribution_id and project_id=project_uuid
      and status in ('accepted','partially-accepted','incorporated')
  ) then raise exception 'contribution_not_eligible'; end if;

  insert into public.collab_museum_review_contribution_links(
    project_id,review_record_id,contribution_id,link_type,note,linked_by
  ) values (
    project_uuid,p_review_record_id,p_contribution_id,p_link_type,
    nullif(trim(p_note),''),auth.uid()
  )
  on conflict(review_record_id,contribution_id,link_type)
  do update set note=excluded.note,linked_by=auth.uid(),linked_at=now()
  returning to_jsonb(collab_museum_review_contribution_links) into result;

  update public.collab_museum_review_records record
  set linked_contribution_count=(
    select count(*) from public.collab_museum_review_contribution_links link
    where link.review_record_id=record.id
  ),
  updated_at=now()
  where record.id=p_review_record_id;

  return result;
end;
$$;

create or replace function public.collab_upsert_public_content_effect_08f(
  p_effect_id uuid,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  target_id uuid := coalesce(p_effect_id,gen_random_uuid());
  memory_ids jsonb := coalesce(p_payload->'memoryIds','[]'::jsonb);
  memory_id text;
  result jsonb;
begin
  if not public.collab_has_permission('museum.review.effects.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if coalesce(p_payload->>'slotCode','') not in (
    'portal.home.after-featured','museum.home.after-opening'
  ) then raise exception 'invalid_effect_slot'; end if;
  if jsonb_typeof(memory_ids)<>'array' or jsonb_array_length(memory_ids)>3 then
    raise exception 'invalid_memory_ids';
  end if;
  if coalesce((p_payload->>'enabled')::boolean,false)
     and coalesce(p_payload->>'status','draft') not in ('approved','published')
  then raise exception 'effect_approval_required'; end if;

  for memory_id in select jsonb_array_elements_text(memory_ids)
  loop
    if not exists(
      select 1 from public.collab_museum_review_records record
      where record.project_id=project_uuid
        and record.memory_id=memory_id
        and record.publication_approved_at is not null
    ) then raise exception 'memory_not_publication_approved:%',memory_id; end if;
  end loop;

  insert into public.collab_public_content_effects(
    id,project_id,cycle_id,effect_code,slot_code,effect_type,title,
    description,memory_ids,enabled,status,starts_at,ends_at,created_by,
    approved_by,approved_at
  ) values (
    target_id,project_uuid,nullif(p_payload->>'cycleId','')::uuid,
    trim(p_payload->>'effectCode'),p_payload->>'slotCode',
    coalesce(nullif(p_payload->>'effectType',''),'memory-highlight'),
    coalesce(p_payload->'title','{}'::jsonb),
    coalesce(p_payload->'description','{}'::jsonb),
    memory_ids,coalesce((p_payload->>'enabled')::boolean,false),
    coalesce(nullif(p_payload->>'status',''),'draft'),
    nullif(p_payload->>'startsAt','')::timestamptz,
    nullif(p_payload->>'endsAt','')::timestamptz,
    auth.uid(),
    case when coalesce(p_payload->>'status','draft') in ('approved','published') then auth.uid() else null end,
    case when coalesce(p_payload->>'status','draft') in ('approved','published') then now() else null end
  )
  on conflict(id) do update set
    cycle_id=excluded.cycle_id,
    effect_code=excluded.effect_code,
    slot_code=excluded.slot_code,
    effect_type=excluded.effect_type,
    title=excluded.title,
    description=excluded.description,
    memory_ids=excluded.memory_ids,
    enabled=excluded.enabled,
    status=excluded.status,
    starts_at=excluded.starts_at,
    ends_at=excluded.ends_at,
    approved_by=excluded.approved_by,
    approved_at=excluded.approved_at,
    updated_at=now()
  returning to_jsonb(collab_public_content_effects) into result;

  return result;
end;
$$;

create or replace function public.collab_generate_museum_review_snapshot_08f(
  p_cycle_id uuid,
  p_version text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  cycle_row public.collab_museum_review_cycles%rowtype;
  payload_value jsonb;
  payload_hash_value text;
  snapshot_uuid uuid;
  incomplete integer;
begin
  if not public.collab_has_permission('museum.review.export',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_version),'') is null then raise exception 'version_required'; end if;

  select * into cycle_row
  from public.collab_museum_review_cycles
  where id=p_cycle_id and project_id=project_uuid
  for update;
  if cycle_row.id is null then raise exception 'cycle_not_found'; end if;

  select count(*) into incomplete
  from public.collab_museum_review_records
  where cycle_id=p_cycle_id
    and status not in ('publication-approved','incorporated','closed');

  payload_value := jsonb_build_object(
    'version',trim(p_version),
    'cycleCode',cycle_row.code,
    'generatedAt',now(),
    'sourceDatasetVersion',cycle_row.source_dataset_version,
    'sourceDatasetHash',cycle_row.source_dataset_hash,
    'completeCycle',incomplete=0,
    'records',coalesce((
      select jsonb_agg(jsonb_build_object(
        'memoryId',record.memory_id,
        'baseHash',record.source_record_hash,
        'status',record.status,
        'patches',coalesce((
          select jsonb_agg(jsonb_build_object(
            'path',proposal.field_path,
            'value',proposal.proposed_value,
            'rationale',proposal.rationale,
            'sourceIds',proposal.source_ids,
            'contributionIds',proposal.contribution_ids
          ) order by proposal.field_path)
          from public.collab_museum_review_field_proposals proposal
          where proposal.review_record_id=record.id
            and proposal.status='accepted'
        ),'[]'::jsonb),
        'approvals',jsonb_build_object(
          'editorialApprovedAt',record.editorial_approved_at,
          'rightsApprovedAt',record.rights_approved_at,
          'publicationApprovedAt',record.publication_approved_at
        )
      ) order by record.memory_id)
      from public.collab_museum_review_records record
      where record.cycle_id=p_cycle_id
        and record.publication_approved_at is not null
    ),'[]'::jsonb),
    'effects',coalesce((
      select jsonb_agg(jsonb_build_object(
        'effectCode',effect.effect_code,
        'slotCode',effect.slot_code,
        'effectType',effect.effect_type,
        'title',effect.title,
        'description',effect.description,
        'memoryIds',effect.memory_ids,
        'enabled',effect.enabled,
        'status',effect.status,
        'startsAt',effect.starts_at,
        'endsAt',effect.ends_at
      ) order by effect.effect_code)
      from public.collab_public_content_effects effect
      where effect.project_id=project_uuid
        and effect.cycle_id=p_cycle_id
        and effect.status in ('approved','published')
    ),'[]'::jsonb)
  );

  payload_hash_value := encode(digest(payload_value::text,'sha256'),'hex');

  insert into public.collab_museum_review_snapshots(
    project_id,cycle_id,version,source_dataset_hash,payload,payload_hash,
    status,generated_by
  ) values (
    project_uuid,p_cycle_id,trim(p_version),cycle_row.source_dataset_hash,
    payload_value,payload_hash_value,'validated',auth.uid()
  ) returning id into snapshot_uuid;

  perform public.collab_record_audit(
    'museum_review.snapshot.generated','museum_review_snapshot',snapshot_uuid::text,
    null,jsonb_build_object('payloadHash',payload_hash_value,'recordCount',jsonb_array_length(payload_value->'records'))
  );

  return jsonb_build_object(
    'snapshotId',snapshot_uuid,
    'payloadHash',payload_hash_value,
    'payload',payload_value
  );
end;
$$;

create or replace function public.collab_approve_museum_review_snapshot_08f(
  p_snapshot_id uuid,
  p_confirmation text
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
  if not public.collab_has_permission('museum.review.apply',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_confirmation<>'APPROVE_MUSEUM_EDITORIAL_SNAPSHOT' then
    raise exception 'literal_confirmation_required';
  end if;

  update public.collab_museum_review_snapshots snapshot
  set status='approved',approved_by=auth.uid(),approved_at=now()
  where snapshot.id=p_snapshot_id
    and snapshot.project_id=project_uuid
    and snapshot.status='validated'
  returning to_jsonb(snapshot) into result;

  if result is null then raise exception 'snapshot_not_approvable'; end if;

  update public.collab_museum_review_cycles
  set status='ready-for-release',updated_at=now()
  where id=(result->>'cycle_id')::uuid;

  return result;
end;
$$;

create or replace function public.collab_export_museum_review_snapshot_08f(
  p_snapshot_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('museum.review.export',project_uuid) then
    raise exception 'permission_denied';
  end if;

  select jsonb_build_object(
    'snapshotId',snapshot.id,
    'version',snapshot.version,
    'sourceDatasetHash',snapshot.source_dataset_hash,
    'payloadHash',snapshot.payload_hash,
    'status',snapshot.status,
    'approvedAt',snapshot.approved_at,
    'payload',snapshot.payload
  ) into result
  from public.collab_museum_review_snapshots snapshot
  where snapshot.id=p_snapshot_id
    and snapshot.project_id=project_uuid
    and snapshot.status='approved';

  if result is null then raise exception 'approved_snapshot_not_found'; end if;
  return result;
end;
$$;

revoke all on function public.collab_museum_review_field_allowed_08f(text) from public;
revoke all on function public.collab_training_completed_08f(uuid,text,uuid) from public;
revoke all on function public.collab_require_training_08f(text,uuid,uuid) from public;
revoke all on function public.collab_complete_training_lesson_08f(text,text) from public;
revoke all on function public.collab_record_training_assessment_08f(uuid,text,integer,jsonb) from public;
revoke all on function public.collab_bootstrap_museum_review_08f(jsonb,jsonb) from public;
revoke all on function public.collab_upsert_museum_review_proposal_08f(uuid,uuid,text,jsonb,jsonb,text,jsonb,jsonb,boolean) from public;
revoke all on function public.collab_review_museum_proposal_08f(uuid,text,text) from public;
revoke all on function public.collab_supersede_museum_proposal_08f(uuid,text) from public;
revoke all on function public.collab_add_museum_review_comment_08f(uuid,text,text,text,boolean) from public;
revoke all on function public.collab_resolve_museum_review_comment_08f(uuid,text) from public;
revoke all on function public.collab_assign_museum_review_08f(uuid,uuid,text) from public;
revoke all on function public.collab_set_museum_review_check_08f(uuid,text,text,text) from public;
revoke all on function public.collab_museum_review_gates_08f(uuid,text) from public;
revoke all on function public.collab_museum_review_publication_eligibility_08f(uuid) from public;
revoke all on function public.collab_decide_museum_review_08f(uuid,text,text) from public;
revoke all on function public.collab_link_contribution_to_museum_review_08f(uuid,uuid,text,text) from public;
revoke all on function public.collab_upsert_public_content_effect_08f(uuid,jsonb) from public;
revoke all on function public.collab_generate_museum_review_snapshot_08f(uuid,text) from public;
revoke all on function public.collab_approve_museum_review_snapshot_08f(uuid,text) from public;
revoke all on function public.collab_export_museum_review_snapshot_08f(uuid) from public;

grant execute on function public.collab_training_completed_08f(uuid,text,uuid) to authenticated;
grant execute on function public.collab_complete_training_lesson_08f(text,text) to authenticated;
grant execute on function public.collab_record_training_assessment_08f(uuid,text,integer,jsonb) to authenticated;
grant execute on function public.collab_bootstrap_museum_review_08f(jsonb,jsonb) to authenticated;
grant execute on function public.collab_upsert_museum_review_proposal_08f(uuid,uuid,text,jsonb,jsonb,text,jsonb,jsonb,boolean) to authenticated;
grant execute on function public.collab_review_museum_proposal_08f(uuid,text,text) to authenticated;
grant execute on function public.collab_supersede_museum_proposal_08f(uuid,text) to authenticated;
grant execute on function public.collab_add_museum_review_comment_08f(uuid,text,text,text,boolean) to authenticated;
grant execute on function public.collab_resolve_museum_review_comment_08f(uuid,text) to authenticated;
grant execute on function public.collab_assign_museum_review_08f(uuid,uuid,text) to authenticated;
grant execute on function public.collab_set_museum_review_check_08f(uuid,text,text,text) to authenticated;
grant execute on function public.collab_museum_review_gates_08f(uuid,text) to authenticated;
grant execute on function public.collab_museum_review_publication_eligibility_08f(uuid) to authenticated;
grant execute on function public.collab_decide_museum_review_08f(uuid,text,text) to authenticated;
grant execute on function public.collab_link_contribution_to_museum_review_08f(uuid,uuid,text,text) to authenticated;
grant execute on function public.collab_upsert_public_content_effect_08f(uuid,jsonb) to authenticated;
grant execute on function public.collab_generate_museum_review_snapshot_08f(uuid,text) to authenticated;
grant execute on function public.collab_approve_museum_review_snapshot_08f(uuid,text) to authenticated;
grant execute on function public.collab_export_museum_review_snapshot_08f(uuid) to authenticated;
