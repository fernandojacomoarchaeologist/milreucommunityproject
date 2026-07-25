-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- RPCs e publicação da agenda/exposição — 08D.

create or replace function public.collab_slugify_08d(input_text text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(
    lower(
      translate(
        coalesce(input_text,''),
        'áàãâäéèêëíìîïóòõôöúùûüç',
        'aaaaaeeeeiiiiooooouuuuc'
      )
    ),
    '[^a-z0-9]+',
    '-',
    'g'
  ))
$$;

create or replace function public.collab_upsert_venue_08d(
  p_venue_id uuid,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  target_id uuid := coalesce(p_venue_id,gen_random_uuid());
  before_row jsonb;
  after_row jsonb;
  target_name text := nullif(trim(p_payload->>'name'),'');
  target_slug text;
begin
  if not public.collab_has_permission('venues.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if target_name is null then raise exception 'venue_name_required'; end if;
  if p_venue_id is not null and exists(
    select 1 from public.collab_venues
    where id=p_venue_id and project_id<>project_uuid
  ) then raise exception 'venue_project_mismatch'; end if;

  target_slug := coalesce(
    nullif(public.collab_slugify_08d(p_payload->>'slug'),''),
    public.collab_slugify_08d(target_name)
  );

  select to_jsonb(v) into before_row
  from public.collab_venues v
  where v.id=target_id and v.project_id=project_uuid;

  insert into public.collab_venues(
    id,project_id,name,slug,venue_type,municipality,locality,address_text,
    country_code,postal_code,contact_name,contact_email,public_email,public_phone,
    public_url,opening_hours,public_description,accessibility_notes,
    accessibility_summary,internal_notes,status,public_visibility,active,created_by
  ) values (
    target_id,project_uuid,target_name,target_slug,
    coalesce(nullif(p_payload->>'venueType',''),'other'),
    nullif(trim(p_payload->>'municipality'),''),
    nullif(trim(p_payload->>'locality'),''),
    nullif(trim(p_payload->>'addressText'),''),
    coalesce(nullif(upper(trim(p_payload->>'countryCode')),''),'PT'),
    nullif(trim(p_payload->>'postalCode'),''),
    nullif(trim(p_payload->>'contactName'),''),
    nullif(lower(trim(p_payload->>'contactEmail')),''),
    nullif(lower(trim(p_payload->>'publicEmail')),''),
    nullif(trim(p_payload->>'publicPhone'),''),
    nullif(trim(p_payload->>'publicUrl'),''),
    nullif(trim(p_payload->>'openingHours'),''),
    nullif(trim(p_payload->>'publicDescription'),''),
    nullif(trim(p_payload->>'accessibilityNotes'),''),
    nullif(trim(p_payload->>'accessibilitySummary'),''),
    nullif(trim(p_payload->>'internalNotes'),''),
    coalesce(nullif(p_payload->>'status',''),'draft'),
    coalesce((p_payload->>'publicVisibility')::boolean,false),
    coalesce(nullif(p_payload->>'status',''),'draft') <> 'archived',
    auth.uid()
  )
  on conflict(id) do update set
    name=excluded.name,
    slug=excluded.slug,
    venue_type=excluded.venue_type,
    municipality=excluded.municipality,
    locality=excluded.locality,
    address_text=excluded.address_text,
    country_code=excluded.country_code,
    postal_code=excluded.postal_code,
    contact_name=excluded.contact_name,
    contact_email=excluded.contact_email,
    public_email=excluded.public_email,
    public_phone=excluded.public_phone,
    public_url=excluded.public_url,
    opening_hours=excluded.opening_hours,
    public_description=excluded.public_description,
    accessibility_notes=excluded.accessibility_notes,
    accessibility_summary=excluded.accessibility_summary,
    internal_notes=excluded.internal_notes,
    status=excluded.status,
    public_visibility=excluded.public_visibility,
    active=excluded.active,
    archived_at=case when excluded.status='archived' then now() else null end,
    updated_at=now()
  returning to_jsonb(collab_venues) into after_row;

  perform public.collab_record_audit(
    case when before_row is null then 'venue.created' else 'venue.updated' end,
    'venue',target_id::text,before_row,after_row
  );

  return after_row;
end;
$$;

create or replace function public.collab_upsert_exhibition_08d(
  p_exhibition_id uuid,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  target_id uuid := coalesce(p_exhibition_id,gen_random_uuid());
  before_row jsonb;
  after_row jsonb;
  target_title text := nullif(trim(p_payload->>'title'),'');
  target_slug text;
  visibility boolean := coalesce((p_payload->>'publicVisibility')::boolean,false);
begin
  if not public.collab_has_permission('exhibitions.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if target_title is null then raise exception 'exhibition_title_required'; end if;
  if p_exhibition_id is not null and exists(
    select 1 from public.collab_exhibitions
    where id=p_exhibition_id and project_id<>project_uuid
  ) then raise exception 'exhibition_project_mismatch'; end if;

  target_slug := coalesce(
    nullif(public.collab_slugify_08d(p_payload->>'slug'),''),
    public.collab_slugify_08d(target_title)
  );

  select to_jsonb(e) into before_row
  from public.collab_exhibitions e
  where e.id=target_id and e.project_id=project_uuid;

  insert into public.collab_exhibitions(
    id,project_id,title,slug,subtitle,exhibition_type,description,public_summary,
    internal_objectives,status,default_duration_days,public_visibility,published_at,created_by
  ) values (
    target_id,project_uuid,target_title,target_slug,
    nullif(trim(p_payload->>'subtitle'),''),
    coalesce(nullif(p_payload->>'exhibitionType',''),'itinerant'),
    nullif(trim(p_payload->>'description'),''),
    nullif(trim(p_payload->>'publicSummary'),''),
    nullif(trim(p_payload->>'internalObjectives'),''),
    coalesce(nullif(p_payload->>'status',''),'planning'),
    nullif(p_payload->>'defaultDurationDays','')::integer,
    visibility,
    case when visibility and coalesce((p_payload->>'publishNow')::boolean,false) then now() else null end,
    auth.uid()
  )
  on conflict(id) do update set
    title=excluded.title,
    slug=excluded.slug,
    subtitle=excluded.subtitle,
    exhibition_type=excluded.exhibition_type,
    description=excluded.description,
    public_summary=excluded.public_summary,
    internal_objectives=excluded.internal_objectives,
    status=excluded.status,
    default_duration_days=excluded.default_duration_days,
    public_visibility=excluded.public_visibility,
    published_at=case
      when excluded.public_visibility=false then null
      when coalesce((p_payload->>'publishNow')::boolean,false) then coalesce(collab_exhibitions.published_at,now())
      else collab_exhibitions.published_at
    end,
    archived_at=case when excluded.status='archived' then now() else null end,
    updated_at=now()
  returning to_jsonb(collab_exhibitions) into after_row;

  perform public.collab_record_audit(
    case when before_row is null then 'exhibition.created' else 'exhibition.updated' end,
    'exhibition',target_id::text,before_row,after_row
  );

  return after_row;
end;
$$;

create or replace function public.collab_schedule_conflicts_08d(
  p_schedule_id uuid,
  p_exhibition_id uuid,
  p_venue_id uuid,
  p_starts_on date,
  p_ends_on date
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
  if not (
    public.collab_has_permission('agenda.view',project_uuid)
    or public.collab_has_permission('exhibitions.manage',project_uuid)
  ) then raise exception 'permission_denied'; end if;

  if p_exhibition_id is null or p_venue_id is null
     or p_starts_on is null or p_ends_on is null or p_ends_on<p_starts_on
  then raise exception 'invalid_conflict_request'; end if;

  select jsonb_build_object(
    'exhibitionOverlaps',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',schedule.id,
        'startsOn',schedule.starts_on,
        'endsOn',schedule.ends_on,
        'venueId',schedule.venue_id,
        'status',schedule.status
      ) order by schedule.starts_on)
      from public.collab_exhibition_schedule schedule
      where schedule.project_id=project_uuid
        and schedule.id is distinct from p_schedule_id
        and schedule.status<>'cancelled'
        and schedule.exhibition_id=p_exhibition_id
        and daterange(schedule.starts_on,schedule.ends_on,'[]')
            && daterange(p_starts_on,p_ends_on,'[]')
    ),'[]'::jsonb),
    'venueWarnings',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',schedule.id,
        'startsOn',schedule.starts_on,
        'endsOn',schedule.ends_on,
        'exhibitionId',schedule.exhibition_id,
        'status',schedule.status
      ) order by schedule.starts_on)
      from public.collab_exhibition_schedule schedule
      where schedule.project_id=project_uuid
        and schedule.id is distinct from p_schedule_id
        and schedule.status<>'cancelled'
        and schedule.venue_id=p_venue_id
        and daterange(schedule.starts_on,schedule.ends_on,'[]')
            && daterange(p_starts_on,p_ends_on,'[]')
    ),'[]'::jsonb)
  ) into result;

  return result;
end;
$$;

create or replace function public.collab_upsert_schedule_08d(
  p_schedule_id uuid,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  target_id uuid := coalesce(p_schedule_id,gen_random_uuid());
  exhibition_uuid uuid := (p_payload->>'exhibitionId')::uuid;
  venue_uuid uuid := (p_payload->>'venueId')::uuid;
  start_date date := (p_payload->>'startsOn')::date;
  end_date date := (p_payload->>'endsOn')::date;
  before_row jsonb;
  after_row jsonb;
  conflict_report jsonb;
  exhibition_title text;
  venue_name text;
  target_slug text;
  visibility boolean := coalesce((p_payload->>'publicVisibility')::boolean,false);
begin
  if not public.collab_has_permission('exhibitions.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if exhibition_uuid is null or venue_uuid is null then raise exception 'exhibition_and_venue_required'; end if;
  if p_schedule_id is not null and exists(
    select 1 from public.collab_exhibition_schedule
    where id=p_schedule_id and project_id<>project_uuid
  ) then raise exception 'schedule_project_mismatch'; end if;
  if start_date is null or end_date is null or end_date<start_date then raise exception 'invalid_schedule_dates'; end if;

  select title into exhibition_title from public.collab_exhibitions
  where id=exhibition_uuid and project_id=project_uuid;
  select name into venue_name from public.collab_venues
  where id=venue_uuid and project_id=project_uuid;
  if exhibition_title is null or venue_name is null then raise exception 'exhibition_or_venue_not_found'; end if;

  conflict_report := public.collab_schedule_conflicts_08d(
    target_id,exhibition_uuid,venue_uuid,start_date,end_date
  );
  if jsonb_array_length(conflict_report->'exhibitionOverlaps')>0 then
    raise exception 'exhibition_schedule_overlap';
  end if;

  target_slug := coalesce(
    nullif(public.collab_slugify_08d(p_payload->>'slug'),''),
    public.collab_slugify_08d(
      exhibition_title||'-'||venue_name||'-'||to_char(start_date,'YYYY-MM-DD')
    )
  );

  select to_jsonb(s) into before_row
  from public.collab_exhibition_schedule s
  where s.id=target_id and s.project_id=project_uuid;

  insert into public.collab_exhibition_schedule(
    id,project_id,exhibition_id,venue_id,slug,starts_on,ends_on,status,
    installation_at,dismantling_at,public_title,public_summary,public_notes,
    internal_notes,public_visibility,published_at,opening_hours,public_contact,
    registration_url,installation_status,logistics_status,transport_notes,
    condition_report_before,condition_report_after,created_by
  ) values (
    target_id,project_uuid,exhibition_uuid,venue_uuid,target_slug,start_date,end_date,
    coalesce(nullif(p_payload->>'status',''),'planned'),
    nullif(p_payload->>'installationAt','')::timestamptz,
    nullif(p_payload->>'dismantlingAt','')::timestamptz,
    nullif(trim(p_payload->>'publicTitle'),''),
    nullif(trim(p_payload->>'publicSummary'),''),
    nullif(trim(p_payload->>'publicNotes'),''),
    nullif(trim(p_payload->>'internalNotes'),''),
    visibility,
    case when visibility and coalesce((p_payload->>'publishNow')::boolean,false) then now() else null end,
    nullif(trim(p_payload->>'openingHours'),''),
    nullif(trim(p_payload->>'publicContact'),''),
    nullif(trim(p_payload->>'registrationUrl'),''),
    coalesce(nullif(p_payload->>'installationStatus',''),'not-started'),
    coalesce(nullif(p_payload->>'logisticsStatus',''),'not-started'),
    nullif(trim(p_payload->>'transportNotes'),''),
    nullif(trim(p_payload->>'conditionReportBefore'),''),
    nullif(trim(p_payload->>'conditionReportAfter'),''),
    auth.uid()
  )
  on conflict(id) do update set
    exhibition_id=excluded.exhibition_id,
    venue_id=excluded.venue_id,
    slug=excluded.slug,
    starts_on=excluded.starts_on,
    ends_on=excluded.ends_on,
    status=excluded.status,
    installation_at=excluded.installation_at,
    dismantling_at=excluded.dismantling_at,
    public_title=excluded.public_title,
    public_summary=excluded.public_summary,
    public_notes=excluded.public_notes,
    internal_notes=excluded.internal_notes,
    public_visibility=excluded.public_visibility,
    published_at=case
      when excluded.public_visibility=false then null
      when coalesce((p_payload->>'publishNow')::boolean,false) then coalesce(collab_exhibition_schedule.published_at,now())
      else collab_exhibition_schedule.published_at
    end,
    opening_hours=excluded.opening_hours,
    public_contact=excluded.public_contact,
    registration_url=excluded.registration_url,
    installation_status=excluded.installation_status,
    logistics_status=excluded.logistics_status,
    transport_notes=excluded.transport_notes,
    condition_report_before=excluded.condition_report_before,
    condition_report_after=excluded.condition_report_after,
    archived_at=case when excluded.status='cancelled' then now() else null end,
    updated_at=now()
  returning to_jsonb(collab_exhibition_schedule) into after_row;

  perform public.collab_record_audit(
    case when before_row is null then 'exhibition_schedule.created' else 'exhibition_schedule.updated' end,
    'exhibition_schedule',target_id::text,before_row,after_row,
    jsonb_build_object('venueWarnings',conflict_report->'venueWarnings')
  );

  return after_row||jsonb_build_object('conflicts',conflict_report);
end;
$$;

create or replace function public.collab_publish_schedule_08d(
  p_schedule_id uuid,
  p_publish boolean
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
  if not public.collab_has_permission('exhibitions.publish',project_uuid) then
    raise exception 'permission_denied';
  end if;

  update public.collab_exhibition_schedule schedule
  set public_visibility=p_publish,
      published_at=case when p_publish then coalesce(schedule.published_at,now()) else null end,
      updated_at=now()
  where schedule.id=p_schedule_id
    and schedule.project_id=project_uuid
    and schedule.status in ('confirmed','installed','open','closed')
  returning to_jsonb(schedule) into result;

  if result is null then raise exception 'schedule_not_publishable'; end if;

  perform public.collab_record_audit(
    case when p_publish then 'exhibition_schedule.published' else 'exhibition_schedule.unpublished' end,
    'exhibition_schedule',p_schedule_id::text,null,result
  );

  return result;
end;
$$;

create or replace function public.collab_upsert_agenda_event_08d(
  p_event_id uuid,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  target_id uuid := coalesce(p_event_id,gen_random_uuid());
  before_row jsonb;
  after_row jsonb;
  title_value text := nullif(trim(p_payload->>'title'),'');
  start_value timestamptz := (p_payload->>'startsAt')::timestamptz;
  end_value timestamptz := (p_payload->>'endsAt')::timestamptz;
begin
  if not public.collab_has_permission('agenda.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if title_value is null then raise exception 'event_title_required'; end if;
  if p_event_id is not null and exists(
    select 1 from public.collab_agenda_events
    where id=p_event_id and project_id<>project_uuid
  ) then raise exception 'event_project_mismatch'; end if;
  if start_value is null or end_value is null or end_value<=start_value then raise exception 'invalid_event_dates'; end if;

  if nullif(p_payload->>'exhibitionScheduleId','') is not null and not exists(
    select 1 from public.collab_exhibition_schedule
    where id=(p_payload->>'exhibitionScheduleId')::uuid and project_id=project_uuid
  ) then raise exception 'event_schedule_project_mismatch'; end if;

  if nullif(p_payload->>'taskId','') is not null and not exists(
    select 1 from public.collab_tasks
    where id=(p_payload->>'taskId')::uuid and project_id=project_uuid
  ) then raise exception 'event_task_project_mismatch'; end if;

  if nullif(p_payload->>'venueId','') is not null and not exists(
    select 1 from public.collab_venues
    where id=(p_payload->>'venueId')::uuid and project_id=project_uuid
  ) then raise exception 'event_venue_project_mismatch'; end if;

  select to_jsonb(event) into before_row
  from public.collab_agenda_events event
  where event.id=target_id and event.project_id=project_uuid;

  insert into public.collab_agenda_events(
    id,project_id,exhibition_schedule_id,task_id,venue_id,title,description,
    event_type,status,visibility,starts_at,ends_at,location_text,capacity,
    registration_required,registration_url,public_contact,created_by
  ) values (
    target_id,project_uuid,
    nullif(p_payload->>'exhibitionScheduleId','')::uuid,
    nullif(p_payload->>'taskId','')::uuid,
    nullif(p_payload->>'venueId','')::uuid,
    title_value,
    nullif(trim(p_payload->>'description'),''),
    coalesce(nullif(p_payload->>'eventType',''),'other'),
    coalesce(nullif(p_payload->>'status',''),'draft'),
    coalesce(nullif(p_payload->>'visibility',''),'members'),
    start_value,end_value,
    nullif(trim(p_payload->>'locationText'),''),
    nullif(p_payload->>'capacity','')::integer,
    coalesce((p_payload->>'registrationRequired')::boolean,false),
    nullif(trim(p_payload->>'registrationUrl'),''),
    nullif(trim(p_payload->>'publicContact'),''),
    auth.uid()
  )
  on conflict(id) do update set
    exhibition_schedule_id=excluded.exhibition_schedule_id,
    task_id=excluded.task_id,
    venue_id=excluded.venue_id,
    title=excluded.title,
    description=excluded.description,
    event_type=excluded.event_type,
    status=excluded.status,
    visibility=excluded.visibility,
    starts_at=excluded.starts_at,
    ends_at=excluded.ends_at,
    location_text=excluded.location_text,
    capacity=excluded.capacity,
    registration_required=excluded.registration_required,
    registration_url=excluded.registration_url,
    public_contact=excluded.public_contact,
    updated_at=now()
  returning to_jsonb(collab_agenda_events) into after_row;

  perform public.collab_record_audit(
    case when before_row is null then 'agenda_event.created' else 'agenda_event.updated' end,
    'agenda_event',target_id::text,before_row,after_row
  );

  return after_row;
end;
$$;

create or replace function public.collab_rsvp_event_08d(
  p_event_id uuid,
  p_status text,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  event_row public.collab_agenda_events%rowtype;
  attending_count integer;
  result jsonb;
begin
  if not public.collab_has_permission('agenda.rsvp',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status not in ('interested','attending','not-attending','cancelled') then
    raise exception 'invalid_rsvp_status';
  end if;

  select * into event_row
  from public.collab_agenda_events
  where id=p_event_id
    and project_id=project_uuid
    and status='confirmed'
    and visibility in ('members','public')
  for update;

  if event_row.id is null then raise exception 'event_not_available'; end if;

  if p_status='attending' and event_row.capacity is not null then
    select count(*) into attending_count
    from public.collab_event_participants
    where event_id=p_event_id and status in ('attending','attended');

    if attending_count>=event_row.capacity
       and not exists(
         select 1 from public.collab_event_participants
         where event_id=p_event_id and user_id=auth.uid() and status in ('attending','attended')
       )
    then
      p_status := 'waitlist';
    end if;
  end if;

  insert into public.collab_event_participants(event_id,user_id,status,notes,responded_at)
  values(p_event_id,auth.uid(),p_status,nullif(trim(p_notes),''),now())
  on conflict(event_id,user_id) do update set
    status=excluded.status,
    notes=excluded.notes,
    responded_at=now()
  returning to_jsonb(collab_event_participants) into result;

  perform public.collab_record_audit(
    'agenda_event.rsvp','agenda_event',p_event_id::text,null,result
  );

  return result;
end;
$$;

create or replace function public.collab_upsert_checklist_item_08d(
  p_item_id uuid,
  p_schedule_id uuid,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  target_id uuid := coalesce(p_item_id,gen_random_uuid());
  before_row jsonb;
  after_row jsonb;
  target_status text := coalesce(nullif(p_payload->>'status',''),'pending');
  target_title text := nullif(trim(p_payload->>'title'),'');
begin
  if not (
    public.collab_has_permission('exhibitions.logistics',project_uuid)
    or public.collab_has_permission('exhibitions.manage',project_uuid)
  ) then raise exception 'permission_denied'; end if;
  if target_title is null then raise exception 'checklist_title_required'; end if;
  if p_item_id is not null and exists(
    select 1 from public.collab_exhibition_logistics_checklist
    where id=p_item_id and project_id<>project_uuid
  ) then raise exception 'checklist_project_mismatch'; end if;

  if not exists(
    select 1 from public.collab_exhibition_schedule
    where id=p_schedule_id and project_id=project_uuid
  ) then raise exception 'schedule_not_found'; end if;

  select to_jsonb(item) into before_row
  from public.collab_exhibition_logistics_checklist item
  where item.id=target_id and item.project_id=project_uuid;

  insert into public.collab_exhibition_logistics_checklist(
    id,project_id,schedule_id,category,title,description,status,assigned_to,
    due_at,completed_at,completed_by,sort_order,created_by
  ) values (
    target_id,project_uuid,p_schedule_id,
    coalesce(nullif(p_payload->>'category',''),'other'),
    target_title,
    nullif(trim(p_payload->>'description'),''),
    target_status,
    nullif(p_payload->>'assignedTo','')::uuid,
    nullif(p_payload->>'dueAt','')::timestamptz,
    case when target_status='completed' then now() else null end,
    case when target_status='completed' then auth.uid() else null end,
    coalesce(nullif(p_payload->>'sortOrder','')::integer,0),
    auth.uid()
  )
  on conflict(id) do update set
    category=excluded.category,
    title=excluded.title,
    description=excluded.description,
    status=excluded.status,
    assigned_to=excluded.assigned_to,
    due_at=excluded.due_at,
    completed_at=case
      when excluded.status='completed' then coalesce(collab_exhibition_logistics_checklist.completed_at,now())
      else null
    end,
    completed_by=case when excluded.status='completed' then auth.uid() else null end,
    sort_order=excluded.sort_order,
    updated_at=now()
  returning to_jsonb(collab_exhibition_logistics_checklist) into after_row;

  perform public.collab_record_audit(
    case when before_row is null then 'exhibition_checklist.created' else 'exhibition_checklist.updated' end,
    'exhibition_checklist',target_id::text,before_row,after_row
  );

  return after_row;
end;
$$;

create or replace function public.collab_generate_logistics_tasks_08d(
  p_schedule_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  schedule_row public.collab_exhibition_schedule%rowtype;
  exhibition_title text;
  venue_name text;
  installation_task uuid;
  dismantling_task uuid;
begin
  if not public.collab_has_permission('exhibitions.logistics',project_uuid)
     or not public.collab_has_permission('tasks.manage',project_uuid)
  then raise exception 'permission_denied'; end if;

  select * into schedule_row
  from public.collab_exhibition_schedule
  where id=p_schedule_id and project_id=project_uuid;
  if schedule_row.id is null then raise exception 'schedule_not_found'; end if;

  select title into exhibition_title from public.collab_exhibitions where id=schedule_row.exhibition_id;
  select name into venue_name from public.collab_venues where id=schedule_row.venue_id;

  insert into public.collab_tasks(
    project_id,title,summary,description,category,category_code,status,priority,
    assignment_mode,location_mode,location_name,starts_at,due_at,estimated_minutes,
    source_entity_type,source_entity_id,created_by
  ) values (
    project_uuid,
    'Montagem — '||exhibition_title,
    'Preparar e instalar a exposição em '||venue_name||'.',
    'Tarefa gerada a partir do agendamento da exposição. Confirmar transporte, materiais, instalação e verificação.',
    'exhibition-setup','exhibition-setup','draft','high',
    'approval','on-site',venue_name,
    coalesce(schedule_row.installation_at,schedule_row.starts_on::timestamptz),
    coalesce(schedule_row.installation_at,schedule_row.starts_on::timestamptz),
    180,'exhibition_schedule',p_schedule_id,auth.uid()
  )
  on conflict(project_id,source_entity_type,source_entity_id,title)
  where source_entity_type is not null and source_entity_id is not null
  do update set
    location_name=excluded.location_name,
    starts_at=excluded.starts_at,
    due_at=excluded.due_at,
    updated_at=now()
  returning id into installation_task;

  insert into public.collab_tasks(
    project_id,title,summary,description,category,category_code,status,priority,
    assignment_mode,location_mode,location_name,starts_at,due_at,estimated_minutes,
    source_entity_type,source_entity_id,created_by
  ) values (
    project_uuid,
    'Desmontagem — '||exhibition_title,
    'Desmontar, verificar e acondicionar a exposição em '||venue_name||'.',
    'Tarefa gerada a partir do agendamento da exposição. Confirmar estado, acondicionamento, inventário e transporte.',
    'exhibition-setup','exhibition-setup','draft','high',
    'approval','on-site',venue_name,
    coalesce(schedule_row.dismantling_at,(schedule_row.ends_on+1)::timestamptz),
    coalesce(schedule_row.dismantling_at,(schedule_row.ends_on+1)::timestamptz),
    180,'exhibition_schedule',p_schedule_id,auth.uid()
  )
  on conflict(project_id,source_entity_type,source_entity_id,title)
  where source_entity_type is not null and source_entity_id is not null
  do update set
    location_name=excluded.location_name,
    starts_at=excluded.starts_at,
    due_at=excluded.due_at,
    updated_at=now()
  returning id into dismantling_task;

  perform public.collab_record_audit(
    'exhibition_schedule.logistics_tasks_generated',
    'exhibition_schedule',p_schedule_id::text,null,
    jsonb_build_object('installationTask',installation_task,'dismantlingTask',dismantling_task)
  );

  return jsonb_build_object(
    'installationTaskId',installation_task,
    'dismantlingTaskId',dismantling_task
  );
end;
$$;

create or replace function public.collab_public_exhibition_snapshot_08d()
returns jsonb
language sql
stable
security definer
set search_path=public
as $$
  with schedule_rows as (
    select
      schedule.id,
      schedule.slug,
      schedule.starts_on,
      schedule.ends_on,
      schedule.status,
      schedule.public_title,
      schedule.public_summary,
      schedule.public_notes,
      schedule.opening_hours,
      schedule.public_contact,
      schedule.registration_url,
      exhibition.id as exhibition_id,
      exhibition.slug as exhibition_slug,
      exhibition.title as exhibition_title,
      exhibition.subtitle as exhibition_subtitle,
      exhibition.public_summary as exhibition_summary,
      exhibition.exhibition_type,
      venue.id as venue_id,
      venue.slug as venue_slug,
      venue.name as venue_name,
      venue.venue_type,
      venue.municipality,
      venue.locality,
      venue.address_text,
      venue.postal_code,
      venue.country_code,
      venue.public_url,
      venue.opening_hours as venue_opening_hours,
      venue.accessibility_summary
    from public.collab_exhibition_schedule schedule
    join public.collab_exhibitions exhibition on exhibition.id=schedule.exhibition_id
    join public.collab_venues venue on venue.id=schedule.venue_id
    where schedule.public_visibility
      and schedule.published_at is not null
      and schedule.status in ('confirmed','installed','open','closed')
      and exhibition.public_visibility
      and exhibition.published_at is not null
      and venue.public_visibility
      and venue.status='active'
  ),
  event_rows as (
    select jsonb_build_object(
      'id',event.id,
      'title',event.title,
      'description',event.description,
      'eventType',event.event_type,
      'status',event.status,
      'startsAt',event.starts_at,
      'endsAt',event.ends_at,
      'locationText',coalesce(event.location_text,venue.name),
      'venueName',venue.name,
      'municipality',venue.municipality,
      'registrationRequired',event.registration_required,
      'registrationUrl',event.registration_url,
      'publicContact',event.public_contact
    ) as item
    from public.collab_agenda_events event
    left join public.collab_venues venue on venue.id=event.venue_id
    where event.visibility='public'
      and event.status in ('confirmed','completed')
  )
  select jsonb_build_object(
    'version','0.15.0',
    'generatedAt',now(),
    'source','supabase-public-rpc',
    'current',coalesce((
      select jsonb_agg(to_jsonb(row) order by row.starts_on)
      from schedule_rows row
      where current_date between row.starts_on and row.ends_on
    ),'[]'::jsonb),
    'upcoming',coalesce((
      select jsonb_agg(to_jsonb(row) order by row.starts_on)
      from schedule_rows row
      where row.starts_on>current_date
    ),'[]'::jsonb),
    'past',coalesce((
      select jsonb_agg(to_jsonb(row) order by row.ends_on desc)
      from schedule_rows row
      where row.ends_on<current_date
    ),'[]'::jsonb),
    'events',coalesce((
      select jsonb_agg(item order by item->>'startsAt')
      from event_rows
    ),'[]'::jsonb)
  )
$$;

revoke all on function public.collab_upsert_venue_08d(uuid,jsonb) from public;
revoke all on function public.collab_upsert_exhibition_08d(uuid,jsonb) from public;
revoke all on function public.collab_schedule_conflicts_08d(uuid,uuid,uuid,date,date) from public;
revoke all on function public.collab_upsert_schedule_08d(uuid,jsonb) from public;
revoke all on function public.collab_publish_schedule_08d(uuid,boolean) from public;
revoke all on function public.collab_upsert_agenda_event_08d(uuid,jsonb) from public;
revoke all on function public.collab_rsvp_event_08d(uuid,text,text) from public;
revoke all on function public.collab_upsert_checklist_item_08d(uuid,uuid,jsonb) from public;
revoke all on function public.collab_generate_logistics_tasks_08d(uuid) from public;
revoke all on function public.collab_public_exhibition_snapshot_08d() from public;

grant execute on function public.collab_upsert_venue_08d(uuid,jsonb) to authenticated;
grant execute on function public.collab_upsert_exhibition_08d(uuid,jsonb) to authenticated;
grant execute on function public.collab_schedule_conflicts_08d(uuid,uuid,uuid,date,date) to authenticated;
grant execute on function public.collab_upsert_schedule_08d(uuid,jsonb) to authenticated;
grant execute on function public.collab_publish_schedule_08d(uuid,boolean) to authenticated;
grant execute on function public.collab_upsert_agenda_event_08d(uuid,jsonb) to authenticated;
grant execute on function public.collab_rsvp_event_08d(uuid,text,text) to authenticated;
grant execute on function public.collab_upsert_checklist_item_08d(uuid,uuid,jsonb) to authenticated;
grant execute on function public.collab_generate_logistics_tasks_08d(uuid) to authenticated;
grant execute on function public.collab_public_exhibition_snapshot_08d() to anon,authenticated;
