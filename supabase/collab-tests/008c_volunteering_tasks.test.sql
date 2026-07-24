begin;

do $$
begin
  if to_regclass('public.collab_task_categories') is null then raise exception 'collab_task_categories missing'; end if;
  if to_regclass('public.collab_task_required_skills') is null then raise exception 'collab_task_required_skills missing'; end if;
  if to_regclass('public.collab_volunteer_preferences') is null then raise exception 'collab_volunteer_preferences missing'; end if;
  if to_regclass('public.collab_member_availability') is null then raise exception 'collab_member_availability missing'; end if;
  if to_regclass('public.collab_task_time_entries') is null then raise exception 'collab_task_time_entries missing'; end if;
  if to_regclass('public.collab_task_updates') is null then raise exception 'collab_task_updates missing'; end if;
  if not exists(select 1 from public.collab_permissions where code='tasks.verify') then raise exception 'tasks.verify missing'; end if;
  if not exists(select 1 from public.collab_modules where code='tasks' and status='active') then raise exception 'tasks module not active'; end if;
  if not exists(select 1 from public.collab_modules where code='availability' and status='active') then raise exception 'availability module not active'; end if;
  if not exists(select 1 from public.collab_modules where code='task-management' and status='active') then raise exception 'task management module not active'; end if;
  if not exists(select 1 from pg_proc where proname='collab_create_task_08c') then raise exception 'collab_create_task_08c missing'; end if;
  if not exists(select 1 from pg_proc where proname='collab_join_task_08c') then raise exception 'collab_join_task_08c missing'; end if;
  if not exists(select 1 from pg_proc where proname='collab_set_my_availability_08c') then raise exception 'collab_set_my_availability_08c missing'; end if;
  if not exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='collab_task_time_entries' and c.relrowsecurity) then raise exception 'RLS missing on time entries'; end if;
end
$$;

rollback;
