-- RLS, helpers e operações seguras da Área Colaborativa.

create or replace function public.collab_is_active_member(
  target_project uuid default public.collab_project_id()
)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1
    from public.collab_project_memberships m
    where m.project_id=target_project
      and m.user_id=auth.uid()
      and m.status='active'
  )
$$;

create or replace function public.collab_has_permission(
  target_permission text,
  target_project uuid default public.collab_project_id()
)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1
    from public.collab_project_memberships m
    join public.collab_member_roles mr
      on mr.project_id=m.project_id and mr.user_id=m.user_id
    join public.collab_role_permissions rp
      on rp.role_code=mr.role_code
    where m.project_id=target_project
      and m.user_id=auth.uid()
      and m.status='active'
      and rp.permission_code=target_permission
  )
$$;

grant execute on function public.collab_project_id() to authenticated;
grant execute on function public.collab_is_active_member(uuid) to authenticated;
grant execute on function public.collab_has_permission(text,uuid) to authenticated;

grant select on public.collab_projects to authenticated;
grant select on public.collab_profile_types to authenticated;
grant select on public.collab_roles to authenticated;
grant select on public.collab_permissions to authenticated;
grant select on public.collab_role_permissions to authenticated;
grant select on public.collab_modules to authenticated;

grant select,insert on public.collab_profiles to authenticated;
grant update(display_name,avatar_url,primary_profile_type,locale,bio,phone,public_recognition_opt_in)
on public.collab_profiles to authenticated;

grant select on public.collab_project_memberships to authenticated;
grant select,insert on public.collab_access_requests to authenticated;
grant update(requested_profile_type,motivation,status,submitted_at) on public.collab_access_requests to authenticated;
grant select on public.collab_member_roles to authenticated;
grant select on public.collab_audit_log to authenticated;

drop policy if exists collab_projects_authenticated_read on public.collab_projects;
create policy collab_projects_authenticated_read
on public.collab_projects for select to authenticated
using (status='active');

drop policy if exists collab_profile_types_authenticated_read on public.collab_profile_types;
create policy collab_profile_types_authenticated_read
on public.collab_profile_types for select to authenticated
using (active);

drop policy if exists collab_roles_authenticated_read on public.collab_roles;
create policy collab_roles_authenticated_read
on public.collab_roles for select to authenticated
using (public.collab_is_active_member());

drop policy if exists collab_permissions_authenticated_read on public.collab_permissions;
create policy collab_permissions_authenticated_read
on public.collab_permissions for select to authenticated
using (public.collab_is_active_member());

drop policy if exists collab_role_permissions_authenticated_read on public.collab_role_permissions;
create policy collab_role_permissions_authenticated_read
on public.collab_role_permissions for select to authenticated
using (public.collab_is_active_member());

drop policy if exists collab_modules_authenticated_read on public.collab_modules;
create policy collab_modules_authenticated_read
on public.collab_modules for select to authenticated
using (public.collab_is_active_member());

drop policy if exists collab_profiles_select on public.collab_profiles;
create policy collab_profiles_select
on public.collab_profiles for select to authenticated
using (
  user_id=auth.uid()
  or public.collab_has_permission('memberships.view')
  or public.collab_has_permission('memberships.manage')
);

drop policy if exists collab_profiles_insert_self on public.collab_profiles;
create policy collab_profiles_insert_self
on public.collab_profiles for insert to authenticated
with check (
  user_id=auth.uid()
  and email=lower(coalesce(auth.jwt()->>'email',''))
);

drop policy if exists collab_profiles_update_self_or_manager on public.collab_profiles;
create policy collab_profiles_update_self_or_manager
on public.collab_profiles for update to authenticated
using (
  user_id=auth.uid()
  or public.collab_has_permission('memberships.manage')
)
with check (
  user_id=auth.uid()
  or public.collab_has_permission('memberships.manage')
);

drop policy if exists collab_memberships_select on public.collab_project_memberships;
create policy collab_memberships_select
on public.collab_project_memberships for select to authenticated
using (
  user_id=auth.uid()
  or public.collab_has_permission('memberships.view',project_id)
  or public.collab_has_permission('memberships.manage',project_id)
);

drop policy if exists collab_member_roles_select on public.collab_member_roles;
create policy collab_member_roles_select
on public.collab_member_roles for select to authenticated
using (
  user_id=auth.uid()
  or public.collab_has_permission('memberships.view',project_id)
  or public.collab_has_permission('roles.manage',project_id)
);

drop policy if exists collab_access_requests_select on public.collab_access_requests;
create policy collab_access_requests_select
on public.collab_access_requests for select to authenticated
using (
  user_id=auth.uid()
  or public.collab_has_permission('memberships.view',project_id)
  or public.collab_has_permission('memberships.manage',project_id)
);

drop policy if exists collab_access_requests_insert_self on public.collab_access_requests;
create policy collab_access_requests_insert_self
on public.collab_access_requests for insert to authenticated
with check (user_id=auth.uid());

drop policy if exists collab_access_requests_update_self_pending on public.collab_access_requests;
create policy collab_access_requests_update_self_pending
on public.collab_access_requests for update to authenticated
using (
  (user_id=auth.uid() and status='pending')
  or public.collab_has_permission('memberships.manage',project_id)
)
with check (
  (user_id=auth.uid() and status in ('pending','cancelled'))
  or public.collab_has_permission('memberships.manage',project_id)
);

drop policy if exists collab_audit_select on public.collab_audit_log;
create policy collab_audit_select
on public.collab_audit_log for select to authenticated
using (public.collab_has_permission('audit.view',project_id));

create or replace function public.collab_record_audit(
  action_name text,
  entity_name text,
  entity_identifier text,
  previous_data jsonb default null,
  next_data jsonb default null,
  extra_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path=public
as $$
begin
  insert into public.collab_audit_log(
    project_id,actor_user_id,action,entity_type,entity_id,before_data,after_data,metadata
  ) values (
    public.collab_project_id(),auth.uid(),action_name,entity_name,entity_identifier,
    previous_data,next_data,coalesce(extra_metadata,'{}'::jsonb)
  );
end;
$$;

revoke all on function public.collab_record_audit(text,text,text,jsonb,jsonb,jsonb) from public;

create or replace function public.collab_submit_access_request(
  p_display_name text,
  p_primary_profile_type text,
  p_motivation text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  request_uuid uuid;
begin
  if auth.uid() is null then
    raise exception 'authentication_required';
  end if;

  if not exists(select 1 from public.collab_profile_types where code=p_primary_profile_type and active) then
    raise exception 'invalid_profile_type';
  end if;

  update public.collab_profiles
  set display_name=nullif(trim(p_display_name),''),
      primary_profile_type=p_primary_profile_type,
      updated_at=now()
  where user_id=auth.uid();

  insert into public.collab_project_memberships(project_id,user_id,status,primary_profile_type,requested_at)
  values(project_uuid,auth.uid(),'pending',p_primary_profile_type,now())
  on conflict(project_id,user_id) do update
  set primary_profile_type=excluded.primary_profile_type,
      status=case
        when public.collab_project_memberships.status in ('active','suspended') then public.collab_project_memberships.status
        else 'pending'
      end,
      requested_at=now();

  select id into request_uuid
  from public.collab_access_requests
  where project_id=project_uuid and user_id=auth.uid() and status='pending'
  order by submitted_at desc limit 1;

  if request_uuid is null then
    insert into public.collab_access_requests(
      project_id,user_id,requested_profile_type,motivation,status
    ) values (
      project_uuid,auth.uid(),p_primary_profile_type,nullif(trim(p_motivation),''),'pending'
    ) returning id into request_uuid;
  else
    update public.collab_access_requests
    set requested_profile_type=p_primary_profile_type,
        motivation=nullif(trim(p_motivation),''),
        submitted_at=now()
    where id=request_uuid;
  end if;

  perform public.collab_record_audit(
    'access_request.submitted','access_request',request_uuid::text,null,
    jsonb_build_object('profileType',p_primary_profile_type)
  );

  return jsonb_build_object('requestId',request_uuid,'status','pending');
end;
$$;

revoke all on function public.collab_submit_access_request(text,text,text) from public;
grant execute on function public.collab_submit_access_request(text,text,text) to authenticated;

create or replace function public.collab_update_my_profile(
  p_display_name text,
  p_primary_profile_type text,
  p_locale text default 'pt-PT',
  p_bio text default null,
  p_phone text default null,
  p_public_recognition_opt_in boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  previous_row jsonb;
  next_row jsonb;
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;

  if p_primary_profile_type is not null
     and not exists(select 1 from public.collab_profile_types where code=p_primary_profile_type and active)
  then
    raise exception 'invalid_profile_type';
  end if;

  select to_jsonb(p) into previous_row
  from public.collab_profiles p where p.user_id=auth.uid();

  update public.collab_profiles
  set display_name=nullif(trim(p_display_name),''),
      primary_profile_type=p_primary_profile_type,
      locale=coalesce(nullif(trim(p_locale),''),'pt-PT'),
      bio=nullif(trim(p_bio),''),
      phone=nullif(trim(p_phone),''),
      public_recognition_opt_in=coalesce(p_public_recognition_opt_in,false),
      updated_at=now()
  where user_id=auth.uid()
  returning to_jsonb(collab_profiles) into next_row;

  perform public.collab_record_audit(
    'profile.updated','profile',auth.uid()::text,previous_row,next_row
  );

  return next_row;
end;
$$;

revoke all on function public.collab_update_my_profile(text,text,text,text,text,boolean) from public;
grant execute on function public.collab_update_my_profile(text,text,text,text,text,boolean) to authenticated;
