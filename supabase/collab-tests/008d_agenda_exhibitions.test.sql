begin;

do $$
begin
  if to_regclass('public.collab_agenda_events') is null then
    raise exception 'collab_agenda_events missing';
  end if;
  if to_regclass('public.collab_event_participants') is null then
    raise exception 'collab_event_participants missing';
  end if;
  if to_regclass('public.collab_exhibition_logistics_checklist') is null then
    raise exception 'collab_exhibition_logistics_checklist missing';
  end if;

  if not exists(
    select 1 from public.collab_permissions where code='agenda.manage'
  ) then raise exception 'agenda.manage missing'; end if;

  if not exists(
    select 1 from public.collab_permissions where code='exhibitions.publish'
  ) then raise exception 'exhibitions.publish missing'; end if;

  if not exists(
    select 1 from public.collab_role_permissions
    where role_code='master' and permission_code='exhibitions.publish'
  ) then raise exception 'master exhibitions.publish permission missing'; end if;

  if not exists(
    select 1 from public.collab_modules
    where code='agenda' and status='active'
  ) then raise exception 'agenda module not active'; end if;

  if not exists(
    select 1 from public.collab_modules
    where code='venue-management' and status='active'
  ) then raise exception 'venue management module not active'; end if;

  if not exists(
    select 1
    from pg_class table_class
    join pg_namespace namespace on namespace.oid=table_class.relnamespace
    where namespace.nspname='public'
      and table_class.relname='collab_agenda_events'
      and table_class.relrowsecurity
  ) then raise exception 'RLS missing on collab_agenda_events'; end if;

  if to_regprocedure('public.collab_upsert_venue_08d(uuid,jsonb)') is null then
    raise exception 'collab_upsert_venue_08d missing';
  end if;
  if to_regprocedure('public.collab_upsert_schedule_08d(uuid,jsonb)') is null then
    raise exception 'collab_upsert_schedule_08d missing';
  end if;
  if to_regprocedure('public.collab_rsvp_event_08d(uuid,text,text)') is null then
    raise exception 'collab_rsvp_event_08d missing';
  end if;
  if to_regprocedure('public.collab_generate_logistics_tasks_08d(uuid)') is null then
    raise exception 'collab_generate_logistics_tasks_08d missing';
  end if;
  if to_regprocedure('public.collab_public_exhibition_snapshot_08d()') is null then
    raise exception 'collab_public_exhibition_snapshot_08d missing';
  end if;
end
$$;

select public.collab_public_exhibition_snapshot_08d();

rollback;
