-- MILREU-DESTRUCTIVE-REVIEWED (revisão de integração 2026-07-25):
-- Os `delete from collab_notifications/outbox` são RETENÇÃO de dados operacionais efémeros (expirados/entregues), sob RLS.
-- Não altera schema nem toca dados canónicos do Museu. Marcador após revisão.

-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08H — RPCs, triggers e operação segura das notificações.

create or replace function public.collab_user_has_permission_08h(
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

create or replace function public.collab_notification_template_tokens_valid_08h(
  p_subject text,
  p_title text,
  p_body text,
  p_allowed_tokens text[]
)
returns boolean
language sql
immutable
as $$
  with tokens as (
    select m[1] as token
    from regexp_matches(
      coalesce(p_subject,'')||' '||coalesce(p_title,'')||' '||coalesce(p_body,''),
      '\{\{([a-z_][a-z0-9_]*)\}\}',
      'g'
    ) m
  )
  select not exists(
    select 1 from tokens where not (token=any(coalesce(p_allowed_tokens,'{}'::text[])))
  )
$$;

create or replace function public.collab_notification_available_at_08h(
  p_project_id uuid,
  p_user_id uuid,
  p_event_type text
)
returns timestamptz
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  preference public.collab_notification_preferences%rowtype;
  local_now timestamp;
  local_time time;
  local_date date;
  target_local timestamp;
begin
  select * into preference
  from public.collab_notification_preferences
  where project_id=p_project_id
    and user_id=p_user_id
    and event_type=p_event_type;

  if preference.user_id is null
     or preference.quiet_hours_start is null
     or preference.quiet_hours_end is null
  then return now(); end if;

  begin
    local_now:=now() at time zone preference.timezone;
  exception when invalid_parameter_value then
    local_now:=now() at time zone 'Europe/Lisbon';
  end;

  local_time:=local_now::time;
  local_date:=local_now::date;

  if preference.quiet_hours_start<preference.quiet_hours_end then
    if local_time>=preference.quiet_hours_start
       and local_time<preference.quiet_hours_end
    then
      target_local:=local_date+preference.quiet_hours_end;
      return target_local at time zone preference.timezone;
    end if;
  else
    if local_time>=preference.quiet_hours_start then
      target_local:=(local_date+1)+preference.quiet_hours_end;
      return target_local at time zone preference.timezone;
    elsif local_time<preference.quiet_hours_end then
      target_local:=local_date+preference.quiet_hours_end;
      return target_local at time zone preference.timezone;
    end if;
  end if;

  return now();
end;
$$;

create or replace function public.collab_create_notification_08h(
  p_project_id uuid,
  p_user_id uuid,
  p_event_type text,
  p_entity_type text,
  p_entity_id text,
  p_title text,
  p_body text,
  p_action_url text,
  p_severity text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_dedupe_key text default null
)
returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare
  event_row public.collab_notification_event_types%rowtype;
  preference public.collab_notification_preferences%rowtype;
  channel_row public.collab_notification_channels%rowtype;
  template_row public.collab_notification_templates%rowtype;
  notification_uuid uuid;
  allow_in_app boolean;
  allow_email boolean;
  language_code text := 'pt-PT';
  available_time timestamptz := now();
begin
  select * into event_row
  from public.collab_notification_event_types
  where code=p_event_type and active;
  if event_row.code is null then raise exception 'notification_event_not_found'; end if;

  if not exists(
    select 1 from public.collab_project_memberships membership
    where membership.project_id=p_project_id
      and membership.user_id=p_user_id
      and membership.status in ('pending','active','suspended','rejected')
  ) then return null; end if;

  select * into preference
  from public.collab_notification_preferences
  where project_id=p_project_id and user_id=p_user_id and event_type=p_event_type;

  allow_in_app:=event_row.mandatory_in_app
    or coalesce(preference.in_app_enabled,true);
  allow_email:=event_row.email_allowed
    and coalesce(preference.email_enabled,event_row.default_email);
  language_code:=coalesce(preference.language,'pt-PT');

  if allow_in_app then
    insert into public.collab_notifications(
      project_id,user_id,event_type,entity_type,entity_id,title,body,
      action_url,severity,metadata,dedupe_key,expires_at
    ) values (
      p_project_id,p_user_id,p_event_type,nullif(trim(p_entity_type),''),
      nullif(trim(p_entity_id),''),trim(p_title),trim(p_body),
      nullif(trim(p_action_url),''),
      coalesce(nullif(trim(p_severity),''),event_row.severity),
      coalesce(p_metadata,'{}'::jsonb),nullif(trim(p_dedupe_key),''),
      now()+make_interval(days=>event_row.retention_days)
    )
    on conflict(project_id,user_id,dedupe_key)
      where dedupe_key is not null
    do nothing
    returning id into notification_uuid;

    if notification_uuid is null and p_dedupe_key is not null then
      select id into notification_uuid
      from public.collab_notifications
      where project_id=p_project_id
        and user_id=p_user_id
        and dedupe_key=p_dedupe_key;
    end if;
  end if;

  if allow_email then
    select * into channel_row
    from public.collab_notification_channels
    where project_id=p_project_id and channel='email';

    if channel_row.status='active' and channel_row.provider<>'disabled' then
      select * into template_row
      from public.collab_notification_templates
      where event_type=p_event_type
        and channel='email'
        and language in (language_code,'pt-PT')
        and status='approved'
      order by case when language=language_code then 0 else 1 end,version desc
      limit 1;

      if template_row.id is not null then
        available_time:=public.collab_notification_available_at_08h(
          p_project_id,p_user_id,p_event_type
        );

        insert into public.collab_notification_outbox(
          project_id,notification_id,event_type,template_id,
          recipient_kind,recipient_user_id,payload,dedupe_key,
          status,available_at,max_attempts
        ) values (
          p_project_id,notification_uuid,p_event_type,template_row.id,
          'user',p_user_id,
          coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object(
            'title',p_title,
            'status',coalesce(p_metadata->>'status',''),
            'reference',coalesce(p_metadata->>'reference',p_entity_id),
            'action_url',p_action_url,
            'project_name','Projeto Comunitário de Milreu'
          ),
          case when p_dedupe_key is null then null else 'email:'||p_dedupe_key end,
          'pending',available_time,5
        )
        on conflict(project_id,dedupe_key)
          where dedupe_key is not null
        do nothing;
      end if;
    end if;
  end if;

  return notification_uuid;
end;
$$;

create or replace function public.collab_notify_permission_08h(
  p_project_id uuid,
  p_permission text,
  p_event_type text,
  p_entity_type text,
  p_entity_id text,
  p_title text,
  p_body text,
  p_action_url text,
  p_severity text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_dedupe_prefix text default null
)
returns integer
language plpgsql
security definer
set search_path=public
as $$
declare
  recipient record;
  created_count integer:=0;
begin
  for recipient in
    select distinct membership.user_id
    from public.collab_project_memberships membership
    join public.collab_member_roles member_role
      on member_role.project_id=membership.project_id
     and member_role.user_id=membership.user_id
    join public.collab_role_permissions role_permission
      on role_permission.role_code=member_role.role_code
    where membership.project_id=p_project_id
      and membership.status='active'
      and role_permission.permission_code=p_permission
  loop
    perform public.collab_create_notification_08h(
      p_project_id,recipient.user_id,p_event_type,p_entity_type,p_entity_id,
      p_title,p_body,p_action_url,p_severity,p_metadata,
      case when p_dedupe_prefix is null then null
        else p_dedupe_prefix||':'||recipient.user_id::text end
    );
    created_count:=created_count+1;
  end loop;
  return created_count;
end;
$$;

create or replace function public.collab_mark_notification_08h(
  p_notification_id uuid,
  p_action text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  before_row jsonb;
  result jsonb;
begin
  if p_action not in ('read','unread','archive') then
    raise exception 'invalid_notification_action';
  end if;

  select to_jsonb(notification) into before_row
  from public.collab_notifications notification
  where notification.id=p_notification_id
    and notification.user_id=auth.uid();

  if before_row is null then raise exception 'notification_not_found'; end if;

  update public.collab_notifications
  set status=case
      when p_action='read' then 'read'
      when p_action='unread' then 'unread'
      else 'archived'
    end,
    read_at=case
      when p_action='read' then coalesce(read_at,now())
      when p_action='unread' then null
      else read_at
    end,
    archived_at=case when p_action='archive' then now() else null end
  where id=p_notification_id and user_id=auth.uid()
  returning to_jsonb(collab_notifications) into result;

  perform public.collab_record_audit(
    'notification.'||p_action,'notification',p_notification_id::text,
    before_row,result,'{}'::jsonb
  );
  return result;
end;
$$;

create or replace function public.collab_mark_all_notifications_read_08h()
returns integer
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  affected integer;
begin
  if not public.collab_has_permission('notifications.mark',project_uuid) then
    raise exception 'permission_denied';
  end if;

  update public.collab_notifications
  set status='read',read_at=now()
  where project_id=project_uuid
    and user_id=auth.uid()
    and status='unread';
  get diagnostics affected=row_count;
  return affected;
end;
$$;

create or replace function public.collab_update_notification_preference_08h(
  p_event_type text,
  p_in_app_enabled boolean,
  p_email_enabled boolean,
  p_quiet_hours_start time default null,
  p_quiet_hours_end time default null,
  p_timezone text default 'Europe/Lisbon',
  p_language text default 'pt-PT'
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  event_row public.collab_notification_event_types%rowtype;
  result jsonb;
begin
  if not public.collab_has_permission('notifications.preferences',project_uuid) then
    raise exception 'permission_denied';
  end if;

  select * into event_row
  from public.collab_notification_event_types
  where code=p_event_type and active;
  if event_row.code is null then raise exception 'notification_event_not_found'; end if;

  if event_row.mandatory_in_app and not p_in_app_enabled then
    raise exception 'mandatory_in_app_cannot_be_disabled';
  end if;
  if p_email_enabled and not event_row.email_allowed then
    raise exception 'email_not_allowed_for_event';
  end if;
  if (p_quiet_hours_start is null)<>(p_quiet_hours_end is null) then
    raise exception 'quiet_hours_pair_required';
  end if;
  if not exists(select 1 from pg_timezone_names where name=p_timezone) then
    raise exception 'invalid_timezone';
  end if;

  insert into public.collab_notification_preferences(
    project_id,user_id,event_type,in_app_enabled,email_enabled,
    quiet_hours_start,quiet_hours_end,timezone,language
  ) values (
    project_uuid,auth.uid(),p_event_type,
    case when event_row.mandatory_in_app then true else p_in_app_enabled end,
    p_email_enabled,p_quiet_hours_start,p_quiet_hours_end,
    coalesce(nullif(trim(p_timezone),''),'Europe/Lisbon'),
    coalesce(nullif(trim(p_language),''),'pt-PT')
  )
  on conflict(project_id,user_id,event_type) do update set
    in_app_enabled=excluded.in_app_enabled,
    email_enabled=excluded.email_enabled,
    quiet_hours_start=excluded.quiet_hours_start,
    quiet_hours_end=excluded.quiet_hours_end,
    timezone=excluded.timezone,
    language=excluded.language,
    updated_at=now()
  returning to_jsonb(collab_notification_preferences) into result;

  return result;
end;
$$;

create or replace function public.collab_notification_summary_08h()
returns jsonb
language sql
stable
security definer
set search_path=public
as $$
  select case
    when public.collab_has_permission('notifications.view') then jsonb_build_object(
    'unreadCount',(
      select count(*) from public.collab_notifications
      where project_id=public.collab_project_id()
        and user_id=auth.uid() and status='unread'
    ),
    'criticalUnreadCount',(
      select count(*) from public.collab_notifications
      where project_id=public.collab_project_id()
        and user_id=auth.uid() and status='unread' and severity='critical'
    ),
    'byCategory',coalesce((
      select jsonb_object_agg(event.category,count_value)
      from (
        select event.category,count(*) count_value
        from public.collab_notifications notification
        join public.collab_notification_event_types event
          on event.code=notification.event_type
        where notification.project_id=public.collab_project_id()
          and notification.user_id=auth.uid()
          and notification.status='unread'
        group by event.category
      ) event
    ),'{}'::jsonb)
  )
    else jsonb_build_object('unreadCount',0,'criticalUnreadCount',0,'byCategory','{}'::jsonb)
  end
$$;

create or replace function public.collab_upsert_notification_template_08h(
  p_template_id uuid,
  p_event_type text,
  p_language text,
  p_subject_template text,
  p_title_template text,
  p_body_text_template text,
  p_allowed_tokens text[],
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
  next_version integer;
begin
  if not public.collab_has_permission('notifications.templates.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_status not in ('draft','review','approved','retired') then
    raise exception 'invalid_template_status';
  end if;
  if not exists(
    select 1 from public.collab_notification_event_types
    where code=p_event_type and active and email_allowed
  ) then raise exception 'notification_event_not_found'; end if;
  if not public.collab_notification_template_tokens_valid_08h(
    p_subject_template,p_title_template,p_body_text_template,p_allowed_tokens
  ) then raise exception 'template_contains_unknown_tokens'; end if;

  if p_template_id is null then
    select coalesce(max(version),0)+1 into next_version
    from public.collab_notification_templates
    where event_type=p_event_type and channel='email' and language=p_language;

    if p_status='approved' then
      update public.collab_notification_templates
      set status='retired',updated_at=now()
      where event_type=p_event_type and channel='email'
        and language=p_language and status='approved';
    end if;

    insert into public.collab_notification_templates(
      event_type,channel,language,version,status,subject_template,
      title_template,body_text_template,allowed_tokens,created_by,
      approved_by,approved_at
    ) values (
      p_event_type,'email',coalesce(nullif(trim(p_language),''),'pt-PT'),
      next_version,p_status,trim(p_subject_template),trim(p_title_template),
      trim(p_body_text_template),coalesce(p_allowed_tokens,'{}'::text[]),
      auth.uid(),case when p_status='approved' then auth.uid() else null end,
      case when p_status='approved' then now() else null end
    )
    returning to_jsonb(collab_notification_templates) into result;
  else
    if exists(
      select 1 from public.collab_notification_templates
      where id=p_template_id and status in ('approved','retired')
    ) then raise exception 'published_template_is_immutable'; end if;

    if p_status='approved' then
      update public.collab_notification_templates
      set status='retired',updated_at=now()
      where event_type=p_event_type and channel='email'
        and language=p_language and status='approved';
    end if;

    update public.collab_notification_templates
    set subject_template=trim(p_subject_template),
        title_template=trim(p_title_template),
        body_text_template=trim(p_body_text_template),
        allowed_tokens=coalesce(p_allowed_tokens,'{}'::text[]),
        status=p_status,
        approved_by=case when p_status='approved' then auth.uid() else null end,
        approved_at=case when p_status='approved' then now() else null end,
        updated_at=now()
    where id=p_template_id and event_type=p_event_type
    returning to_jsonb(collab_notification_templates) into result;
  end if;

  if result is null then raise exception 'template_not_found'; end if;
  perform public.collab_record_audit(
    'notification.template.updated','notification_template',
    result->>'id',null,result,jsonb_build_object('eventType',p_event_type)
  );
  return result;
end;
$$;

create or replace function public.collab_update_notification_channel_08h(
  p_channel text,
  p_status text,
  p_provider text,
  p_from_name text,
  p_from_email text,
  p_settings jsonb default '{}'::jsonb,
  p_confirmation text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('notifications.channel.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if p_channel not in ('in-app','email') then raise exception 'invalid_channel'; end if;
  if p_status not in ('disabled','testing','active','paused') then raise exception 'invalid_channel_status'; end if;
  if p_provider not in ('disabled','webhook') then raise exception 'invalid_provider'; end if;
  if p_channel='in-app' and p_provider<>'disabled' then raise exception 'provider_not_allowed'; end if;
  if p_channel='email' and p_status='active' then
    if p_provider='disabled' then raise exception 'email_provider_required'; end if;
    if nullif(trim(p_from_email),'') is null then raise exception 'from_email_required'; end if;
    if p_confirmation<>'ACTIVATE_MILREU_TRANSACTIONAL_EMAIL' then
      raise exception 'literal_email_activation_required';
    end if;
  end if;

  insert into public.collab_notification_channels(
    project_id,channel,status,provider,from_name,from_email,settings,updated_by
  ) values (
    project_uuid,p_channel,p_status,p_provider,nullif(trim(p_from_name),''),
    case when p_from_email is null then null else lower(trim(p_from_email)) end,
    coalesce(p_settings,'{}'::jsonb),auth.uid()
  )
  on conflict(project_id,channel) do update set
    status=excluded.status,
    provider=excluded.provider,
    from_name=excluded.from_name,
    from_email=excluded.from_email,
    settings=excluded.settings,
    updated_by=auth.uid(),
    updated_at=now()
  returning to_jsonb(collab_notification_channels) into result;

  perform public.collab_record_audit(
    'notification.channel.updated','notification_channel',p_channel,
    null,result,jsonb_build_object('status',p_status,'provider',p_provider)
  );
  return result;
end;
$$;

create or replace function public.collab_send_test_notification_08h(
  p_target_user_id uuid,
  p_event_type text default 'task.assigned',
  p_include_email boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  notification_uuid uuid;
  event_row public.collab_notification_event_types%rowtype;
begin
  if not public.collab_has_permission('notifications.test',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if not exists(
    select 1 from public.collab_project_memberships
    where project_id=project_uuid and user_id=p_target_user_id and status='active'
  ) then raise exception 'target_member_not_active'; end if;

  select * into event_row
  from public.collab_notification_event_types
  where code=p_event_type and active;
  if event_row.code is null then raise exception 'notification_event_not_found'; end if;

  if p_include_email then
    notification_uuid:=public.collab_create_notification_08h(
      project_uuid,p_target_user_id,p_event_type,'test','08H',
      'Notificação de teste',
      'Esta notificação confirma o funcionamento do centro interno.',
      '#/area-colaborativa/notificacoes','info',
      jsonb_build_object(
        'title','Notificação de teste',
        'reference','08H',
        'action_url','#/area-colaborativa/notificacoes',
        'display_name','Membro'
      ),
      'test:'||p_event_type||':'||extract(epoch from clock_timestamp())::bigint
    );
  else
    insert into public.collab_notifications(
      project_id,user_id,event_type,entity_type,entity_id,title,body,
      action_url,severity,metadata,dedupe_key,expires_at
    ) values (
      project_uuid,p_target_user_id,p_event_type,'test','08H',
      'Notificação de teste',
      'Esta notificação confirma o funcionamento do centro interno.',
      '#/area-colaborativa/notificacoes','info',
      '{"test":true}'::jsonb,
      'test-in-app:'||p_event_type||':'||extract(epoch from clock_timestamp())::bigint,
      now()+make_interval(days=>event_row.retention_days)
    ) returning id into notification_uuid;
  end if;

  return jsonb_build_object(
    'notificationId',notification_uuid,
    'emailRequested',p_include_email
  );
end;
$$;

create or replace function public.collab_queue_invitation_email_08h(
  p_invitation_id uuid
)
returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  invitation public.collab_access_invitations%rowtype;
  channel_row public.collab_notification_channels%rowtype;
  template_row public.collab_notification_templates%rowtype;
  outbox_uuid uuid;
begin
  if not public.collab_has_permission('notifications.invitation-email',project_uuid) then
    raise exception 'permission_denied';
  end if;

  select * into invitation
  from public.collab_access_invitations
  where id=p_invitation_id and project_id=project_uuid and status='pending';
  if invitation.id is null then raise exception 'pending_invitation_not_found'; end if;

  select * into channel_row
  from public.collab_notification_channels
  where project_id=project_uuid and channel='email';
  if channel_row.status<>'active' or channel_row.provider='disabled' then
    raise exception 'email_channel_not_active';
  end if;

  select * into template_row
  from public.collab_notification_templates
  where event_type='invitation.created'
    and channel='email' and language='pt-PT' and status='approved'
  order by version desc limit 1;
  if template_row.id is null then raise exception 'approved_template_required'; end if;

  insert into public.collab_notification_outbox(
    project_id,event_type,template_id,recipient_kind,recipient_email,
    payload,dedupe_key,status,available_at,max_attempts,created_by
  ) values (
    project_uuid,'invitation.created',template_row.id,'email',invitation.email,
    jsonb_build_object(
      'project_name','Projeto Comunitário de Milreu',
      'role',invitation.intended_profile_type,
      'action_url','#/area-colaborativa',
      'reference',invitation.id::text
    ),
    'invitation:'||invitation.id::text,'pending',now(),5,auth.uid()
  )
  on conflict(project_id,dedupe_key)
    where dedupe_key is not null
  do nothing
  returning id into outbox_uuid;

  if outbox_uuid is null then
    select id into outbox_uuid
    from public.collab_notification_outbox
    where project_id=project_uuid and dedupe_key='invitation:'||invitation.id::text;
  end if;

  perform public.collab_record_audit(
    'notification.invitation-email.queued','notification_outbox',
    outbox_uuid::text,null,null,jsonb_build_object('invitationId',invitation.id)
  );
  return outbox_uuid;
end;
$$;

create or replace function public.collab_notification_operations_08h(
  p_limit integer default 50
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
begin
  if not public.collab_has_permission('notifications.manage',project_uuid)
     and not public.collab_has_permission('notifications.outbox.view',project_uuid)
  then raise exception 'permission_denied'; end if;

  return jsonb_build_object(
    'channels',coalesce((
      select jsonb_agg(
        to_jsonb(channel_row)-'from_email'
        ||jsonb_build_object(
          'fromEmailConfigured',channel_row.from_email is not null
        )
        order by channel_row.channel
      )
      from public.collab_notification_channels channel_row
      where channel_row.project_id=project_uuid
    ),'[]'::jsonb),
    'outboxCounts',coalesce((
      select jsonb_object_agg(status,count_value)
      from (
        select status,count(*) count_value
        from public.collab_notification_outbox
        where project_id=project_uuid
        group by status
      ) counts
    ),'{}'::jsonb),
    'recentOutbox',coalesce((
      select jsonb_agg(row_data order by created_at desc)
      from (
        select outbox.created_at,
          jsonb_build_object(
            'id',outbox.id,
            'eventType',outbox.event_type,
            'recipientKind',outbox.recipient_kind,
            'recipient',case
              when outbox.recipient_kind='user' then 'membro:'||left(outbox.recipient_user_id::text,8)
              else regexp_replace(outbox.recipient_email,'(^.).*(@.*$)','\1***\2')
            end,
            'status',outbox.status,
            'attempts',outbox.attempts,
            'maxAttempts',outbox.max_attempts,
            'availableAt',outbox.available_at,
            'lastError',case when outbox.last_error is null then null else left(outbox.last_error,240) end,
            'createdAt',outbox.created_at
          ) row_data
        from public.collab_notification_outbox outbox
        where outbox.project_id=project_uuid
        order by outbox.created_at desc
        limit greatest(1,least(coalesce(p_limit,50),200))
      ) recent
    ),'[]'::jsonb),
    'deliveryCounts',coalesce((
      select jsonb_object_agg(status,count_value)
      from (
        select delivery.status,count(*) count_value
        from public.collab_notification_deliveries delivery
        join public.collab_notification_outbox outbox on outbox.id=delivery.outbox_id
        where outbox.project_id=project_uuid
        group by delivery.status
      ) counts
    ),'{}'::jsonb),
    'templates',coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',template.id,
          'eventType',template.event_type,
          'language',template.language,
          'version',template.version,
          'status',template.status,
          'subjectTemplate',template.subject_template,
          'titleTemplate',template.title_template,
          'bodyTextTemplate',template.body_text_template,
          'allowedTokens',template.allowed_tokens,
          'updatedAt',template.updated_at
        )
        order by template.event_type,template.language,template.version desc
      )
      from public.collab_notification_templates template
      where template.channel='email'
    ),'[]'::jsonb)
  );
end;
$$;

create or replace function public.collab_retry_notification_outbox_08h(
  p_outbox_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('notifications.outbox.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;

  update public.collab_notification_outbox
  set status='pending',available_at=now(),claimed_at=null,claimed_by=null,
      last_error=null,updated_at=now()
  where id=p_outbox_id and project_id=project_uuid
    and status in ('failed','dead-letter')
  returning to_jsonb(collab_notification_outbox)-'recipient_email'-'payload' into result;

  if result is null then raise exception 'outbox_not_retryable'; end if;
  return result;
end;
$$;

create or replace function public.collab_cancel_notification_outbox_08h(
  p_outbox_id uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid:=public.collab_project_id();
  result jsonb;
begin
  if not public.collab_has_permission('notifications.outbox.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;
  if nullif(trim(p_reason),'') is null then raise exception 'reason_required'; end if;

  update public.collab_notification_outbox
  set status='cancelled',last_error='Cancelado: '||trim(p_reason),
      claimed_at=null,claimed_by=null,updated_at=now()
  where id=p_outbox_id and project_id=project_uuid
    and status in ('pending','claimed','failed','dead-letter')
  returning to_jsonb(collab_notification_outbox)-'recipient_email'-'payload' into result;

  if result is null then raise exception 'outbox_not_cancellable'; end if;
  return result;
end;
$$;

create or replace function public.collab_claim_notification_outbox_08h(
  p_worker_id text,
  p_batch_size integer default 25
)
returns table(
  outbox_id uuid,
  recipient_kind text,
  recipient_user_id uuid,
  recipient_email text,
  event_type text,
  subject_template text,
  title_template text,
  body_text_template text,
  payload jsonb,
  attempt_number integer,
  max_attempts integer
)
language plpgsql
security definer
set search_path=public
as $$
begin
  if current_user not in ('postgres','service_role','supabase_admin') then
    raise exception 'service_role_required';
  end if;
  if nullif(trim(p_worker_id),'') is null then raise exception 'worker_id_required'; end if;

  return query
  with candidates as (
    select outbox.id
    from public.collab_notification_outbox outbox
    join public.collab_notification_channels channel_row
      on channel_row.project_id=outbox.project_id and channel_row.channel='email'
    where channel_row.status='active'
      and channel_row.provider<>'disabled'
      and outbox.attempts<outbox.max_attempts
      and (
        (outbox.status in ('pending','failed') and outbox.available_at<=now())
        or (outbox.status='claimed' and outbox.claimed_at<now()-interval '10 minutes')
      )
    order by outbox.available_at,outbox.created_at
    for update of outbox skip locked
    limit greatest(1,least(coalesce(p_batch_size,25),100))
  ),
  claimed as (
    update public.collab_notification_outbox outbox
    set status='claimed',claimed_at=now(),claimed_by=trim(p_worker_id),
        attempts=attempts+1,updated_at=now()
    where outbox.id in (select id from candidates)
    returning outbox.*
  )
  select claimed.id,claimed.recipient_kind,claimed.recipient_user_id,
    claimed.recipient_email,claimed.event_type,template.subject_template,
    template.title_template,template.body_text_template,claimed.payload,
    claimed.attempts,claimed.max_attempts
  from claimed
  join public.collab_notification_templates template on template.id=claimed.template_id;
end;
$$;

create or replace function public.collab_finish_notification_delivery_08h(
  p_outbox_id uuid,
  p_status text,
  p_provider text,
  p_external_id text default null,
  p_provider_status_code integer default null,
  p_response_excerpt text default null,
  p_error_code text default null,
  p_error_message text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  outbox_row public.collab_notification_outbox%rowtype;
  final_status text;
  retry_at timestamptz;
  result jsonb;
begin
  if current_user not in ('postgres','service_role','supabase_admin') then
    raise exception 'service_role_required';
  end if;
  if p_status not in ('delivered','failed','skipped') then
    raise exception 'invalid_delivery_status';
  end if;

  select * into outbox_row
  from public.collab_notification_outbox
  where id=p_outbox_id and status='claimed'
  for update;
  if outbox_row.id is null then raise exception 'claimed_outbox_not_found'; end if;

  if p_status='delivered' then
    final_status:='delivered';
    retry_at:=outbox_row.available_at;
  elsif p_status='skipped' then
    final_status:='cancelled';
    retry_at:=outbox_row.available_at;
  elsif outbox_row.attempts>=outbox_row.max_attempts then
    final_status:='dead-letter';
    retry_at:=outbox_row.available_at;
  else
    final_status:='failed';
    retry_at:=now()+case outbox_row.attempts
      when 1 then interval '5 minutes'
      when 2 then interval '30 minutes'
      when 3 then interval '2 hours'
      when 4 then interval '12 hours'
      else interval '1 day'
    end;
  end if;

  insert into public.collab_notification_deliveries(
    outbox_id,attempt_number,status,provider,provider_status_code,
    external_id,response_excerpt,error_code,error_message,finished_at
  ) values (
    p_outbox_id,outbox_row.attempts,p_status,trim(p_provider),
    p_provider_status_code,nullif(trim(p_external_id),''),
    case when p_response_excerpt is null then null else left(p_response_excerpt,1000) end,
    nullif(trim(p_error_code),''),
    case when p_error_message is null then null else left(p_error_message,1000) end,
    now()
  );

  update public.collab_notification_outbox
  set status=final_status,
      available_at=retry_at,
      claimed_at=null,
      claimed_by=null,
      last_error=case when p_status='failed' then left(coalesce(p_error_message,'Falha de entrega'),1000) else null end,
      delivered_at=case when p_status='delivered' then now() else delivered_at end,
      external_id=case when p_status='delivered' then nullif(trim(p_external_id),'') else external_id end,
      updated_at=now()
  where id=p_outbox_id
  returning to_jsonb(collab_notification_outbox)-'recipient_email'-'payload' into result;

  return result;
end;
$$;

create or replace function public.collab_cleanup_notifications_08h()
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  notifications_deleted integer;
  outbox_deleted integer;
begin
  if current_user not in ('postgres','service_role','supabase_admin') then
    raise exception 'service_role_required';
  end if;

  delete from public.collab_notifications
  where expires_at is not null and expires_at<now();
  get diagnostics notifications_deleted=row_count;

  delete from public.collab_notification_outbox
  where status in ('delivered','cancelled')
    and updated_at<now()-interval '180 days';
  get diagnostics outbox_deleted=row_count;

  return jsonb_build_object(
    'notificationsDeleted',notifications_deleted,
    'outboxDeleted',outbox_deleted
  );
end;
$$;

create or replace function public.collab_queue_upcoming_agenda_notifications_08h(
  p_hours integer default 24
)
returns integer
language plpgsql
security definer
set search_path=public
as $$
declare
  row_data record;
  created_count integer:=0;
begin
  if current_user not in ('postgres','service_role','supabase_admin') then
    raise exception 'service_role_required';
  end if;
  if p_hours<1 or p_hours>168 then raise exception 'invalid_hours'; end if;

  for row_data in
    select event.id,event.project_id,event.title,event.starts_at,participant.user_id
    from public.collab_agenda_events event
    join public.collab_event_participants participant on participant.event_id=event.id
    where event.status='confirmed'
      and participant.status in ('interested','attending')
      and event.starts_at>now()
      and event.starts_at<=now()+make_interval(hours=>p_hours)
  loop
    perform public.collab_create_notification_08h(
      row_data.project_id,row_data.user_id,'agenda.upcoming',
      'agenda-event',row_data.id::text,
      'Atividade próxima: '||row_data.title,
      'A atividade começa em '||to_char(row_data.starts_at at time zone 'Europe/Lisbon','DD/MM/YYYY HH24:MI')||'.',
      '#/area-colaborativa/agenda','info',
      jsonb_build_object(
        'title',row_data.title,
        'starts_at',row_data.starts_at,
        'action_url','#/area-colaborativa/agenda'
      ),
      'agenda-upcoming:'||row_data.id::text||':'||row_data.user_id::text||':'||to_char(row_data.starts_at,'YYYYMMDDHH24')
    );
    created_count:=created_count+1;
  end loop;

  return created_count;
end;
$$;

-- Triggers de eventos operacionais.

create or replace function public.collab_notify_membership_change_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if tg_op='UPDATE' and new.status is distinct from old.status then
    if new.status='active' then
      perform public.collab_create_notification_08h(
        new.project_id,new.user_id,'membership.approved','membership',
        new.project_id::text,'Acesso aprovado',
        'O seu acesso à Área Colaborativa foi aprovado.',
        '#/area-colaborativa','success',
        jsonb_build_object('status',new.status,'action_url','#/area-colaborativa'),
        'membership:'||new.project_id::text||':'||new.user_id::text||':active'
      );
    elsif new.status='rejected' then
      perform public.collab_create_notification_08h(
        new.project_id,new.user_id,'membership.rejected','membership',
        new.project_id::text,'Pedido de acesso atualizado',
        'O seu pedido de acesso foi recusado.',
        '#/area-colaborativa','warning',
        jsonb_build_object('status',new.status,'action_url','#/area-colaborativa'),
        'membership:'||new.project_id::text||':'||new.user_id::text||':rejected'
      );
    elsif new.status='suspended' then
      perform public.collab_create_notification_08h(
        new.project_id,new.user_id,'membership.suspended','membership',
        new.project_id::text,'Acesso suspenso',
        'O seu acesso à Área Colaborativa foi suspenso.',
        '#/area-colaborativa','critical',
        jsonb_build_object('status',new.status),
        'membership:'||new.project_id::text||':'||new.user_id::text||':suspended:'||extract(epoch from now())::bigint
      );
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists collab_notify_membership_change_08h on public.collab_project_memberships;
create trigger collab_notify_membership_change_08h
after update of status on public.collab_project_memberships
for each row execute function public.collab_notify_membership_change_08h();

create or replace function public.collab_notify_task_assignment_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  task_row public.collab_tasks%rowtype;
  event_code text;
begin
  select * into task_row from public.collab_tasks where id=new.task_id;
  if task_row.id is null then return new; end if;

  if tg_op='INSERT' or (tg_op='UPDATE' and new.status is distinct from old.status) then
    event_code:=case when new.status='assigned' then 'task.assigned' else 'task.status-changed' end;
    perform public.collab_create_notification_08h(
      task_row.project_id,new.user_id,event_code,'task',task_row.id::text,
      case when new.status='assigned' then 'Nova tarefa atribuída' else 'Tarefa atualizada' end,
      'A tarefa “'||task_row.title||'” está agora no estado '||new.status||'.',
      '#/area-colaborativa/tarefas',
      case when task_row.priority='urgent' then 'warning' else 'info' end,
      jsonb_build_object(
        'title',task_row.title,'status',new.status,'due_at',task_row.due_at,
        'action_url','#/area-colaborativa/tarefas'
      ),
      'task:'||task_row.id::text||':'||new.user_id::text||':'||new.status
    );
  end if;
  return new;
end;
$$;

drop trigger if exists collab_notify_task_assignment_08h on public.collab_task_assignments;
create trigger collab_notify_task_assignment_08h
after insert or update of status on public.collab_task_assignments
for each row execute function public.collab_notify_task_assignment_08h();

create or replace function public.collab_notify_contribution_assignment_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  contribution_row public.collab_contributions%rowtype;
begin
  if new.status<>'active' then return new; end if;
  select * into contribution_row
  from public.collab_contributions where id=new.contribution_id;
  if contribution_row.id is null then return new; end if;

  perform public.collab_create_notification_08h(
    new.project_id,new.reviewer_user_id,'contribution.assigned',
    'contribution',new.contribution_id::text,
    'Contributo atribuído',
    'O contributo '||contribution_row.public_reference||' foi-lhe atribuído.',
    '#/area-colaborativa/gestao/contributos','info',
    jsonb_build_object(
      'reference',contribution_row.public_reference,
      'title',contribution_row.title,
      'role',new.assignment_role,
      'action_url','#/area-colaborativa/gestao/contributos'
    ),
    'contribution-assignment:'||new.id::text
  );
  return new;
end;
$$;

drop trigger if exists collab_notify_contribution_assignment_08h on public.collab_contribution_assignments;
create trigger collab_notify_contribution_assignment_08h
after insert on public.collab_contribution_assignments
for each row execute function public.collab_notify_contribution_assignment_08h();

create or replace function public.collab_notify_contribution_status_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  event_code text;
begin
  if new.status is not distinct from old.status or new.submitter_user_id is null then
    return new;
  end if;

  if new.status='needs-info' then
    event_code:='contribution.needs-info';
  elsif new.status in ('accepted','partially-accepted','rejected','incorporated','withdrawn') then
    event_code:='contribution.decision';
  else
    return new;
  end if;

  perform public.collab_create_notification_08h(
    new.project_id,new.submitter_user_id,event_code,'contribution',new.id::text,
    case when event_code='contribution.needs-info'
      then 'Informação adicional necessária'
      else 'Contributo atualizado' end,
    'O contributo '||new.public_reference||' está agora no estado '||new.status||'.',
    '#/area-colaborativa/contributos',
    case when new.status='rejected' then 'warning' else 'info' end,
    jsonb_build_object(
      'reference',new.public_reference,'title',new.title,'status',new.status,
      'action_url','#/area-colaborativa/contributos'
    ),
    'contribution-status:'||new.id::text||':'||new.status
  );
  return new;
end;
$$;

drop trigger if exists collab_notify_contribution_status_08h on public.collab_contributions;
create trigger collab_notify_contribution_status_08h
after update of status on public.collab_contributions
for each row execute function public.collab_notify_contribution_status_08h();

create or replace function public.collab_notify_museum_assignment_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  record_row public.collab_museum_review_records%rowtype;
begin
  if new.status<>'active' then return new; end if;
  select * into record_row
  from public.collab_museum_review_records where id=new.review_record_id;
  if record_row.id is null then return new; end if;

  perform public.collab_create_notification_08h(
    new.project_id,new.user_id,'museum-review.assigned',
    'museum-memory',record_row.memory_id,
    'Revisão do Museu atribuída',
    'A memória '||record_row.memory_id||' foi-lhe atribuída para '||new.assignment_role||'.',
    '#/area-colaborativa/revisao-museu/'||record_row.memory_id,
    'info',
    jsonb_build_object(
      'reference',record_row.memory_id,'role',new.assignment_role,
      'action_url','#/area-colaborativa/revisao-museu/'||record_row.memory_id
    ),
    'museum-assignment:'||new.id::text
  );
  return new;
end;
$$;

drop trigger if exists collab_notify_museum_assignment_08h on public.collab_museum_review_assignments;
create trigger collab_notify_museum_assignment_08h
after insert on public.collab_museum_review_assignments
for each row execute function public.collab_notify_museum_assignment_08h();

create or replace function public.collab_notify_museum_blocking_comment_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  record_row public.collab_museum_review_records%rowtype;
  assignment record;
begin
  if not new.blocking then return new; end if;
  select * into record_row
  from public.collab_museum_review_records where id=new.review_record_id;
  if record_row.id is null then return new; end if;

  for assignment in
    select distinct user_id
    from public.collab_museum_review_assignments
    where review_record_id=new.review_record_id and status='active'
  loop
    if assignment.user_id<>new.created_by then
      perform public.collab_create_notification_08h(
        new.project_id,assignment.user_id,'museum-review.blocking-comment',
        'museum-memory',record_row.memory_id,
        'Comentário editorial bloqueante',
        'A memória '||record_row.memory_id||' possui um comentário bloqueante.',
        '#/area-colaborativa/revisao-museu/'||record_row.memory_id,
        'warning',
        jsonb_build_object(
          'reference',record_row.memory_id,
          'action_url','#/area-colaborativa/revisao-museu/'||record_row.memory_id
        ),
        'museum-blocking-comment:'||new.id::text||':'||assignment.user_id::text
      );
    end if;
  end loop;
  return new;
end;
$$;

drop trigger if exists collab_notify_museum_blocking_comment_08h on public.collab_museum_review_comments;
create trigger collab_notify_museum_blocking_comment_08h
after insert on public.collab_museum_review_comments
for each row execute function public.collab_notify_museum_blocking_comment_08h();

create or replace function public.collab_notify_training_status_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  trail_title text;
  event_code text;
begin
  if tg_op='UPDATE' and new.status is not distinct from old.status then return new; end if;
  if new.status='assessment-pending' then
    event_code:='training.assessment-pending';
  elsif new.status='completed' then
    event_code:='training.completed';
  else
    return new;
  end if;

  select title into trail_title
  from public.collab_training_trails where code=new.trail_code;

  perform public.collab_create_notification_08h(
    new.project_id,new.user_id,event_code,'training',new.trail_code,
    case when new.status='completed' then 'Formação concluída' else 'Avaliação pendente' end,
    'O percurso “'||coalesce(trail_title,new.trail_code)||'” está agora no estado '||new.status||'.',
    '#/area-colaborativa/formacao/'||new.trail_code,
    case when new.status='completed' then 'success' else 'warning' end,
    jsonb_build_object(
      'title',coalesce(trail_title,new.trail_code),'status',new.status,
      'action_url','#/area-colaborativa/formacao/'||new.trail_code
    ),
    'training:'||new.user_id::text||':'||new.trail_code||':'||new.status
  );
  return new;
end;
$$;

drop trigger if exists collab_notify_training_status_08h on public.collab_training_enrolments;
create trigger collab_notify_training_status_08h
after insert or update of status on public.collab_training_enrolments
for each row execute function public.collab_notify_training_status_08h();

create or replace function public.collab_notify_agenda_change_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  participant record;
  event_code text;
begin
  if tg_op<>'UPDATE' then return new; end if;
  if not (
    new.status is distinct from old.status
    or new.starts_at is distinct from old.starts_at
    or new.ends_at is distinct from old.ends_at
    or new.location_text is distinct from old.location_text
  ) then return new; end if;

  event_code:=case when new.status='cancelled' then 'agenda.cancelled' else 'agenda.changed' end;

  for participant in
    select user_id from public.collab_event_participants
    where event_id=new.id and status in ('interested','attending','waitlist')
  loop
    perform public.collab_create_notification_08h(
      new.project_id,participant.user_id,event_code,'agenda-event',new.id::text,
      case when event_code='agenda.cancelled' then 'Atividade cancelada' else 'Atividade atualizada' end,
      'A atividade “'||new.title||'” foi atualizada.',
      '#/area-colaborativa/agenda',
      case when event_code='agenda.cancelled' then 'warning' else 'info' end,
      jsonb_build_object(
        'title',new.title,'status',new.status,'starts_at',new.starts_at,
        'action_url','#/area-colaborativa/agenda'
      ),
      'agenda:'||new.id::text||':'||participant.user_id::text||':'||
        extract(epoch from new.updated_at)::bigint
    );
  end loop;
  return new;
end;
$$;

drop trigger if exists collab_notify_agenda_change_08h on public.collab_agenda_events;
create trigger collab_notify_agenda_change_08h
after update on public.collab_agenda_events
for each row execute function public.collab_notify_agenda_change_08h();

create or replace function public.collab_notify_exhibition_logistics_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if new.assigned_to is null then return new; end if;
  if tg_op='UPDATE' and new.assigned_to is not distinct from old.assigned_to then return new; end if;

  perform public.collab_create_notification_08h(
    new.project_id,new.assigned_to,'exhibition.logistics-assigned',
    'exhibition-logistics',new.id::text,
    'Ação logística atribuída',
    'Foi-lhe atribuída a ação “'||new.title||'”.',
    '#/area-colaborativa/agenda','info',
    jsonb_build_object(
      'title',new.title,'due_at',new.due_at,
      'action_url','#/area-colaborativa/agenda'
    ),
    'exhibition-logistics:'||new.id::text||':'||new.assigned_to::text
  );
  return new;
end;
$$;

drop trigger if exists collab_notify_exhibition_logistics_08h on public.collab_exhibition_logistics_checklist;
create trigger collab_notify_exhibition_logistics_08h
after insert or update of assigned_to on public.collab_exhibition_logistics_checklist
for each row execute function public.collab_notify_exhibition_logistics_08h();

create or replace function public.collab_notify_withdrawal_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if tg_op='INSERT' then
    perform public.collab_notify_permission_08h(
      new.project_id,'withdrawals.manage','withdrawal.submitted',
      'withdrawal-request',new.id::text,
      'Novo pedido de retirada',
      'Foi recebido um pedido de retirada que requer tratamento prioritário.',
      '#/area-colaborativa/gestao/contributos','critical',
      jsonb_build_object(
        'reference',coalesce(new.public_reference,new.id::text),
        'action_url','#/area-colaborativa/gestao/contributos'
      ),
      'withdrawal-submitted:'||new.id::text
    );
  elsif new.status is distinct from old.status and new.requester_user_id is not null then
    perform public.collab_create_notification_08h(
      new.project_id,new.requester_user_id,'withdrawal.status-changed',
      'withdrawal-request',new.id::text,
      'Pedido de retirada atualizado',
      'O pedido de retirada está agora no estado '||new.status||'.',
      '#/area-colaborativa/contributos','critical',
      jsonb_build_object(
        'reference',coalesce(new.public_reference,new.id::text),
        'status',new.status,'action_url','#/area-colaborativa/contributos'
      ),
      'withdrawal-status:'||new.id::text||':'||new.status
    );
  end if;
  return new;
end;
$$;

drop trigger if exists collab_notify_withdrawal_08h on public.collab_withdrawal_requests;
create trigger collab_notify_withdrawal_08h
after insert or update of status on public.collab_withdrawal_requests
for each row execute function public.collab_notify_withdrawal_08h();

create or replace function public.collab_notify_homologation_blocked_08h()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  environment_row public.collab_deployment_environments%rowtype;
begin
  if tg_op='UPDATE'
     and new.status is distinct from old.status
     and new.status in ('blocked','failed')
  then
    select * into environment_row
    from public.collab_deployment_environments where id=new.environment_id;

    perform public.collab_notify_permission_08h(
      new.project_id,'homologation.view','homologation.blocked',
      'homologation-run',new.id::text,
      'Homologação bloqueada',
      'A homologação do ambiente '||coalesce(environment_row.name,'desconhecido')||
        ' está no estado '||new.status||'.',
      '#/area-colaborativa/gestao/homologacao/'||new.id::text,
      'critical',
      jsonb_build_object(
        'environment',environment_row.code,'status',new.status,
        'action_url','#/area-colaborativa/gestao/homologacao/'||new.id::text
      ),
      'homologation:'||new.id::text||':'||new.status
    );
  end if;
  return new;
end;
$$;

drop trigger if exists collab_notify_homologation_blocked_08h on public.collab_homologation_runs;
create trigger collab_notify_homologation_blocked_08h
after update of status on public.collab_homologation_runs
for each row execute function public.collab_notify_homologation_blocked_08h();

-- Fronteiras de execução.

revoke all on function public.collab_user_has_permission_08h(uuid,text,uuid) from public;
revoke all on function public.collab_notification_template_tokens_valid_08h(text,text,text,text[]) from public;
revoke all on function public.collab_notification_available_at_08h(uuid,uuid,text) from public;
revoke all on function public.collab_create_notification_08h(uuid,uuid,text,text,text,text,text,text,text,jsonb,text) from public;
revoke all on function public.collab_notify_permission_08h(uuid,text,text,text,text,text,text,text,text,jsonb,text) from public;

revoke all on function public.collab_mark_notification_08h(uuid,text) from public;
revoke all on function public.collab_mark_all_notifications_read_08h() from public;
revoke all on function public.collab_update_notification_preference_08h(text,boolean,boolean,time,time,text,text) from public;
revoke all on function public.collab_notification_summary_08h() from public;
revoke all on function public.collab_upsert_notification_template_08h(uuid,text,text,text,text,text,text[],text) from public;
revoke all on function public.collab_update_notification_channel_08h(text,text,text,text,text,jsonb,text) from public;
revoke all on function public.collab_send_test_notification_08h(uuid,text,boolean) from public;
revoke all on function public.collab_queue_invitation_email_08h(uuid) from public;
revoke all on function public.collab_notification_operations_08h(integer) from public;
revoke all on function public.collab_retry_notification_outbox_08h(uuid) from public;
revoke all on function public.collab_cancel_notification_outbox_08h(uuid,text) from public;

revoke all on function public.collab_claim_notification_outbox_08h(text,integer) from public;
revoke all on function public.collab_finish_notification_delivery_08h(uuid,text,text,text,integer,text,text,text) from public;
revoke all on function public.collab_cleanup_notifications_08h() from public;
revoke all on function public.collab_queue_upcoming_agenda_notifications_08h(integer) from public;

grant execute on function public.collab_mark_notification_08h(uuid,text) to authenticated;
grant execute on function public.collab_mark_all_notifications_read_08h() to authenticated;
grant execute on function public.collab_update_notification_preference_08h(text,boolean,boolean,time,time,text,text) to authenticated;
grant execute on function public.collab_notification_summary_08h() to authenticated;
grant execute on function public.collab_upsert_notification_template_08h(uuid,text,text,text,text,text,text[],text) to authenticated;
grant execute on function public.collab_update_notification_channel_08h(text,text,text,text,text,jsonb,text) to authenticated;
grant execute on function public.collab_send_test_notification_08h(uuid,text,boolean) to authenticated;
grant execute on function public.collab_queue_invitation_email_08h(uuid) to authenticated;
grant execute on function public.collab_notification_operations_08h(integer) to authenticated;
grant execute on function public.collab_retry_notification_outbox_08h(uuid) to authenticated;
grant execute on function public.collab_cancel_notification_outbox_08h(uuid,text) to authenticated;

grant execute on function public.collab_claim_notification_outbox_08h(text,integer) to service_role;
grant execute on function public.collab_finish_notification_delivery_08h(uuid,text,text,text,integer,text,text,text) to service_role;
grant execute on function public.collab_cleanup_notifications_08h() to service_role;
grant execute on function public.collab_queue_upcoming_agenda_notifications_08h(integer) to service_role;