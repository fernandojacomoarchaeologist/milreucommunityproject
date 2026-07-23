-- Contexto do utilizador, gestão de membros e bootstrap do master.

create or replace function public.collab_get_my_context()
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  result jsonb;
begin
  if auth.uid() is null then
    return jsonb_build_object('authenticated',false);
  end if;

  select jsonb_build_object(
    'authenticated',true,
    'project',(
      select jsonb_build_object('id',p.id,'slug',p.slug,'name',p.name)
      from public.collab_projects p where p.id=project_uuid
    ),
    'profile',(
      select to_jsonb(p) from public.collab_profiles p where p.user_id=auth.uid()
    ),
    'membership',(
      select to_jsonb(m) from public.collab_project_memberships m
      where m.project_id=project_uuid and m.user_id=auth.uid()
    ),
    'accessRequest',(
      select to_jsonb(r) from public.collab_access_requests r
      where r.project_id=project_uuid and r.user_id=auth.uid()
      order by r.submitted_at desc limit 1
    ),
    'roles',coalesce((
      select jsonb_agg(mr.role_code order by mr.role_code)
      from public.collab_member_roles mr
      where mr.project_id=project_uuid and mr.user_id=auth.uid()
    ),'[]'::jsonb),
    'permissions',coalesce((
      select jsonb_agg(distinct rp.permission_code order by rp.permission_code)
      from public.collab_member_roles mr
      join public.collab_role_permissions rp on rp.role_code=mr.role_code
      where mr.project_id=project_uuid and mr.user_id=auth.uid()
    ),'[]'::jsonb),
    'modules',coalesce((
      select jsonb_agg(to_jsonb(mod) order by mod.sort_order)
      from public.collab_modules mod
      where exists(
        select 1
        from public.collab_member_roles mr
        join public.collab_role_permissions rp on rp.role_code=mr.role_code
        where mr.project_id=project_uuid
          and mr.user_id=auth.uid()
          and rp.permission_code=mod.required_permission
      )
    ),'[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.collab_get_my_context() from public;
grant execute on function public.collab_get_my_context() to authenticated;

create or replace function public.collab_approve_access_request(
  p_user_id uuid,
  p_role_codes text[] default array['volunteer']::text[],
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  role_code text;
  previous_membership jsonb;
  next_membership jsonb;
begin
  if not public.collab_has_permission('memberships.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;

  if p_role_codes is null or cardinality(p_role_codes)=0 then
    p_role_codes := array['volunteer']::text[];
  end if;

  if exists(
    select 1 from unnest(p_role_codes) requested(code)
    where not exists(select 1 from public.collab_roles r where r.code=requested.code)
  ) then
    raise exception 'invalid_role';
  end if;

  select to_jsonb(m) into previous_membership
  from public.collab_project_memberships m
  where m.project_id=project_uuid and m.user_id=p_user_id;

  update public.collab_project_memberships
  set status='active',
      approved_at=now(),
      approved_by=auth.uid(),
      notes=nullif(trim(p_notes),'')
  where project_id=project_uuid and user_id=p_user_id
  returning to_jsonb(collab_project_memberships) into next_membership;

  if next_membership is null then
    raise exception 'membership_not_found';
  end if;

  delete from public.collab_member_roles
  where project_id=project_uuid and user_id=p_user_id;

  foreach role_code in array p_role_codes loop
    insert into public.collab_member_roles(project_id,user_id,role_code,assigned_by)
    values(project_uuid,p_user_id,role_code,auth.uid());
  end loop;

  update public.collab_access_requests
  set status='approved',reviewed_at=now(),reviewed_by=auth.uid(),reviewer_notes=nullif(trim(p_notes),'')
  where project_id=project_uuid and user_id=p_user_id and status='pending';

  perform public.collab_record_audit(
    'membership.approved','membership',p_user_id::text,previous_membership,next_membership,
    jsonb_build_object('roles',to_jsonb(p_role_codes))
  );

  return jsonb_build_object('userId',p_user_id,'status','active','roles',to_jsonb(p_role_codes));
end;
$$;

revoke all on function public.collab_approve_access_request(uuid,text[],text) from public;
grant execute on function public.collab_approve_access_request(uuid,text[],text) to authenticated;

create or replace function public.collab_set_membership_status(
  p_user_id uuid,
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
  previous_membership jsonb;
  next_membership jsonb;
begin
  if not public.collab_has_permission('memberships.manage',project_uuid) then
    raise exception 'permission_denied';
  end if;

  if p_status not in ('pending','active','suspended','archived','rejected') then
    raise exception 'invalid_status';
  end if;

  select to_jsonb(m) into previous_membership
  from public.collab_project_memberships m
  where m.project_id=project_uuid and m.user_id=p_user_id;

  update public.collab_project_memberships
  set status=p_status,
      suspended_at=case when p_status='suspended' then now() else null end,
      notes=nullif(trim(p_notes),'')
  where project_id=project_uuid and user_id=p_user_id
  returning to_jsonb(collab_project_memberships) into next_membership;

  perform public.collab_record_audit(
    'membership.status_changed','membership',p_user_id::text,
    previous_membership,next_membership,jsonb_build_object('status',p_status)
  );

  return next_membership;
end;
$$;

revoke all on function public.collab_set_membership_status(uuid,text,text) from public;
grant execute on function public.collab_set_membership_status(uuid,text,text) to authenticated;

create or replace function public.collab_assign_member_roles(
  p_user_id uuid,
  p_role_codes text[]
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  project_uuid uuid := public.collab_project_id();
  role_code text;
begin
  if not public.collab_has_permission('roles.manage',project_uuid)
     and not exists(
       select 1 from public.collab_member_roles mr
       where mr.project_id=project_uuid and mr.user_id=auth.uid() and mr.role_code='master'
     )
  then
    raise exception 'permission_denied';
  end if;

  if p_role_codes is null or cardinality(p_role_codes)=0 then
    raise exception 'roles_required';
  end if;

  if exists(
    select 1 from unnest(p_role_codes) requested(code)
    where not exists(select 1 from public.collab_roles r where r.code=requested.code)
  ) then
    raise exception 'invalid_role';
  end if;

  delete from public.collab_member_roles
  where project_id=project_uuid and user_id=p_user_id;

  foreach role_code in array p_role_codes loop
    insert into public.collab_member_roles(project_id,user_id,role_code,assigned_by)
    values(project_uuid,p_user_id,role_code,auth.uid());
  end loop;

  perform public.collab_record_audit(
    'membership.roles_changed','membership',p_user_id::text,null,
    jsonb_build_object('roles',to_jsonb(p_role_codes))
  );

  return jsonb_build_object('userId',p_user_id,'roles',to_jsonb(p_role_codes));
end;
$$;

revoke all on function public.collab_assign_member_roles(uuid,text[]) from public;
grant execute on function public.collab_assign_member_roles(uuid,text[]) to authenticated;

create or replace function public.collab_bootstrap_master_by_email(
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path=public,auth
as $$
declare
  project_uuid uuid := public.collab_project_id();
  target_user uuid;
begin
  if current_user not in ('service_role','postgres','supabase_admin') then
    raise exception 'service_role_required';
  end if;

  select id into target_user
  from auth.users
  where lower(email)=lower(trim(p_email))
  order by created_at asc limit 1;

  if target_user is null then
    raise exception 'user_not_found';
  end if;

  update public.collab_profiles
  set primary_profile_type='coordinator',updated_at=now()
  where user_id=target_user;

  insert into public.collab_project_memberships(
    project_id,user_id,status,primary_profile_type,approved_at,notes
  )
  values(
    project_uuid,target_user,'active','coordinator',now(),'Bootstrap do master do sistema.'
  )
  on conflict(project_id,user_id) do update
  set status='active',
      primary_profile_type='coordinator',
      approved_at=now(),
      notes='Bootstrap do master do sistema.';

  insert into public.collab_member_roles(project_id,user_id,role_code)
  values(project_uuid,target_user,'master')
  on conflict do nothing;

  update public.collab_access_requests
  set status='approved',reviewed_at=now(),reviewer_notes='Aprovado durante bootstrap do master.'
  where project_id=project_uuid and user_id=target_user and status='pending';

  insert into public.collab_audit_log(
    project_id,actor_user_id,action,entity_type,entity_id,after_data,metadata
  ) values(
    project_uuid,target_user,'system.master_bootstrapped','membership',target_user::text,
    jsonb_build_object('role','master'),
    jsonb_build_object('emailHash',encode(digest(lower(trim(p_email)),'sha256'),'hex'))
  );

  return jsonb_build_object('userId',target_user,'status','active','role','master');
end;
$$;

revoke all on function public.collab_bootstrap_master_by_email(text) from public;
grant execute on function public.collab_bootstrap_master_by_email(text) to service_role;
