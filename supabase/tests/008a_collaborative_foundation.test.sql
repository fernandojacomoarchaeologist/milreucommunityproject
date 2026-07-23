begin;

do $$
begin
  if to_regclass('public.collab_profiles') is null then raise exception 'collab_profiles missing'; end if;
  if to_regclass('public.collab_project_memberships') is null then raise exception 'collab_project_memberships missing'; end if;
  if to_regclass('public.collab_roles') is null then raise exception 'collab_roles missing'; end if;
  if to_regclass('public.collab_permissions') is null then raise exception 'collab_permissions missing'; end if;
  if to_regclass('public.collab_tasks') is null then raise exception 'collab_tasks missing'; end if;
  if to_regclass('public.collab_exhibition_schedule') is null then raise exception 'collab_exhibition_schedule missing'; end if;

  if not exists(select 1 from public.collab_roles where code='master') then
    raise exception 'master role missing';
  end if;
  if not exists(select 1 from public.collab_profile_types where code='volunteer') then
    raise exception 'volunteer profile type missing';
  end if;
  if not exists(select 1 from public.collab_modules where code='museum-review') then
    raise exception 'museum review module missing';
  end if;
  if not exists(
    select 1 from pg_class c
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='collab_profiles' and c.relrowsecurity
  ) then
    raise exception 'RLS missing on collab_profiles';
  end if;
end
$$;

rollback;
