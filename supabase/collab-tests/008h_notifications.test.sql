begin;

do $$
declare
  event_count integer;
  template_count integer;
  trigger_count integer;
begin
  if to_regclass('public.collab_notifications') is null then raise exception 'notifications table missing'; end if;
  if to_regclass('public.collab_notification_preferences') is null then raise exception 'preferences table missing'; end if;
  if to_regclass('public.collab_notification_outbox') is null then raise exception 'outbox table missing'; end if;
  if to_regclass('public.collab_notification_deliveries') is null then raise exception 'deliveries table missing'; end if;

  select count(*) into event_count
  from public.collab_notification_event_types where active;
  if event_count<>20 then raise exception 'expected 20 event types, got %',event_count; end if;

  select count(*) into template_count
  from public.collab_notification_templates
  where channel='email' and language='pt-PT' and status='approved';
  if template_count<>20 then raise exception 'expected 20 approved templates, got %',template_count; end if;

  if not exists(
    select 1 from public.collab_notification_channels
    where project_id=public.collab_project_id()
      and channel='in-app' and status='active'
  ) then raise exception 'in-app channel inactive'; end if;

  if not exists(
    select 1 from public.collab_notification_channels
    where project_id=public.collab_project_id()
      and channel='email' and status='disabled' and provider='disabled'
  ) then raise exception 'email channel must start disabled'; end if;

  if exists(
    select 1 from public.collab_notification_event_types
    where code in (
      'membership.suspended','withdrawal.submitted',
      'withdrawal.status-changed','homologation.blocked'
    ) and not mandatory_in_app
  ) then raise exception 'mandatory event configuration invalid'; end if;

  if not exists(
    select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='collab_notifications' and c.relrowsecurity
  ) then raise exception 'notifications RLS missing'; end if;

  if not exists(
    select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='collab_notification_outbox' and c.relrowsecurity
  ) then raise exception 'outbox RLS missing'; end if;

  if to_regprocedure('public.collab_mark_notification_08h(uuid,text)') is null then raise exception 'mark RPC missing'; end if;
  if to_regprocedure('public.collab_notification_summary_08h()') is null then raise exception 'summary RPC missing'; end if;
  if to_regprocedure('public.collab_queue_invitation_email_08h(uuid)') is null then raise exception 'invitation RPC missing'; end if;
  if to_regprocedure('public.collab_claim_notification_outbox_08h(text,integer)') is null then raise exception 'claim RPC missing'; end if;
  if to_regprocedure('public.collab_finish_notification_delivery_08h(uuid,text,text,text,integer,text,text,text)') is null then raise exception 'finish RPC missing'; end if;

  if has_function_privilege('authenticated','public.collab_claim_notification_outbox_08h(text,integer)','EXECUTE') then
    raise exception 'authenticated role can claim outbox';
  end if;
  if not has_function_privilege('service_role','public.collab_claim_notification_outbox_08h(text,integer)','EXECUTE') then
    raise exception 'service role cannot claim outbox';
  end if;

  select count(*) into trigger_count
  from pg_trigger
  where not tgisinternal and tgname in (
    'collab_notify_membership_change_08h',
    'collab_notify_task_assignment_08h',
    'collab_notify_contribution_assignment_08h',
    'collab_notify_contribution_status_08h',
    'collab_notify_museum_assignment_08h',
    'collab_notify_museum_blocking_comment_08h',
    'collab_notify_training_status_08h',
    'collab_notify_agenda_change_08h',
    'collab_notify_exhibition_logistics_08h',
    'collab_notify_withdrawal_08h',
    'collab_notify_homologation_blocked_08h'
  );
  if trigger_count<>11 then raise exception 'expected 11 triggers, got %',trigger_count; end if;

  if not exists(
    select 1 from public.collab_modules
    where code='notifications' and status='active'
  ) then raise exception 'notifications module inactive'; end if;

  if not exists(
    select 1 from public.collab_modules
    where code='notification-management' and status='active'
  ) then raise exception 'notification management module inactive'; end if;
end
$$;

rollback;
