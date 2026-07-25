-- MILREU-DESTRUCTIVE-REVIEWED (revisão de integração 2026-07-25):
-- Os `delete from` são reatribuição scoped de funções/interesses/competências por membro sob RLS/RPC.
-- Não altera schema nem toca dados canónicos do Museu. Marcador após revisão.

-- 08B — operações transacionais e proteção do último master.

insert into public.collab_permissions(code,name,description) values
('memberships.reject','Recusar pedidos','Recusar pedidos de acesso.'),
('memberships.suspend','Suspender membros','Suspender ou reativar membros.'),
('memberships.archive','Arquivar membros','Arquivar membros sem apagar histórico.'),
('invitations.manage','Gerir pré-autorizações','Criar e revogar pré-autorizações por e-mail.'),
('member.audit.view','Consultar histórico do membro','Consultar auditoria relacionada com um membro.'),
('member.notes.manage','Gerir notas internas','Criar e consultar notas internas de gestão.')
on conflict(code) do update set name=excluded.name,description=excluded.description;

insert into public.collab_role_permissions(role_code,permission_code)
select 'master',code from public.collab_permissions
on conflict do nothing;

insert into public.collab_role_permissions(role_code,permission_code) values
('coordinator','memberships.reject'),('coordinator','memberships.suspend'),
('coordinator','memberships.archive'),('coordinator','invitations.manage'),
('coordinator','member.audit.view'),('coordinator','member.notes.manage')
on conflict do nothing;

update public.collab_modules set status='active',description='Pesquisar membros, rever pedidos, atribuir perfis e funções, suspender acessos e consultar histórico.' where code='profile-management';
insert into public.collab_modules(code,name,route,description,status,required_permission,sort_order)
values('member-invitations','Pré-autorizações','/area-colaborativa/gestao/convites','Pré-autorizar um e-mail Google com perfil e funções, sem enviar mensagem automaticamente.','active','memberships.manage',95)
on conflict(code) do update set name=excluded.name,route=excluded.route,description=excluded.description,status=excluded.status,required_permission=excluded.required_permission,sort_order=excluded.sort_order;

create or replace function public.collab_active_master_count()
returns integer language sql stable security definer set search_path=public as $$
  select count(*)::integer from public.collab_member_roles mr
  join public.collab_project_memberships m on m.project_id=mr.project_id and m.user_id=mr.user_id
  where mr.project_id=public.collab_project_id() and mr.role_code='master' and m.status='active'
$$;

grant execute on function public.collab_active_master_count() to authenticated;

create or replace function public.collab_manage_member(
  p_user_id uuid,
  p_primary_profile_type text,
  p_role_codes text[],
  p_status text,
  p_note text default null
) returns jsonb
language plpgsql security definer set search_path=public as $$
declare
  project_uuid uuid:=public.collab_project_id();
  actor_is_master boolean;
  target_is_master boolean;
  removing_master boolean;
  previous_data jsonb;
  next_data jsonb;
  role_code text;
begin
  if not public.collab_has_permission('memberships.manage',project_uuid) then raise exception 'permission_denied'; end if;
  if p_status not in ('pending','active','suspended','archived','rejected') then raise exception 'invalid_status'; end if;
  if not exists(select 1 from public.collab_profile_types where code=p_primary_profile_type and active) then raise exception 'invalid_profile_type'; end if;
  if p_role_codes is null then p_role_codes:=array[]::text[]; end if;
  if p_status='active' and cardinality(p_role_codes)=0 then raise exception 'active_member_requires_role'; end if;
  if exists(select 1 from unnest(p_role_codes) r(code) where not exists(select 1 from public.collab_roles cr where cr.code=r.code)) then raise exception 'invalid_role'; end if;

  actor_is_master:=exists(select 1 from public.collab_member_roles where project_id=project_uuid and user_id=auth.uid() and role_code='master');
  target_is_master:=exists(select 1 from public.collab_member_roles where project_id=project_uuid and user_id=p_user_id and role_code='master');
  removing_master:=target_is_master and not ('master'=any(p_role_codes));

  if ('master'=any(p_role_codes) or removing_master) and not actor_is_master then raise exception 'master_required'; end if;
  if target_is_master and (removing_master or p_status<>'active') and public.collab_active_master_count()<=1 then raise exception 'last_active_master_protected'; end if;

  select jsonb_build_object('membership',to_jsonb(m),'roles',coalesce((select jsonb_agg(role_code) from public.collab_member_roles where project_id=project_uuid and user_id=p_user_id),'[]'::jsonb)) into previous_data
  from public.collab_project_memberships m where m.project_id=project_uuid and m.user_id=p_user_id;
  if previous_data is null then raise exception 'membership_not_found'; end if;

  update public.collab_profiles set primary_profile_type=p_primary_profile_type,updated_at=now() where user_id=p_user_id;
  update public.collab_project_memberships set status=p_status,primary_profile_type=p_primary_profile_type,
    approved_at=case when p_status='active' and approved_at is null then now() else approved_at end,
    approved_by=case when p_status='active' and approved_by is null then auth.uid() else approved_by end,
    suspended_at=case when p_status='suspended' then now() else null end,
    notes=coalesce(nullif(trim(p_note),''),notes)
  where project_id=project_uuid and user_id=p_user_id;

  delete from public.collab_member_roles where project_id=project_uuid and user_id=p_user_id;
  foreach role_code in array p_role_codes loop
    insert into public.collab_member_roles(project_id,user_id,role_code,assigned_by) values(project_uuid,p_user_id,role_code,auth.uid());
  end loop;

  if p_status='active' then
    update public.collab_access_requests set status='approved',reviewed_at=now(),reviewed_by=auth.uid(),reviewer_notes=nullif(trim(p_note),'') where project_id=project_uuid and user_id=p_user_id and status='pending';
  elsif p_status='rejected' then
    update public.collab_access_requests set status='rejected',reviewed_at=now(),reviewed_by=auth.uid(),reviewer_notes=nullif(trim(p_note),'') where project_id=project_uuid and user_id=p_user_id and status='pending';
  end if;

  if nullif(trim(p_note),'') is not null then
    insert into public.collab_membership_notes(project_id,user_id,note,created_by) values(project_uuid,p_user_id,trim(p_note),auth.uid());
  end if;

  select jsonb_build_object('membership',to_jsonb(m),'roles',coalesce((select jsonb_agg(role_code) from public.collab_member_roles where project_id=project_uuid and user_id=p_user_id),'[]'::jsonb)) into next_data
  from public.collab_project_memberships m where m.project_id=project_uuid and m.user_id=p_user_id;

  insert into public.collab_audit_log(project_id,actor_user_id,action,entity_type,entity_id,before_data,after_data,metadata)
  values(project_uuid,auth.uid(),'membership.managed','membership',p_user_id::text,previous_data,next_data,jsonb_build_object('noteProvided',nullif(trim(p_note),'') is not null));
  return next_data;
end $$;
revoke all on function public.collab_manage_member(uuid,text,text[],text,text) from public;
grant execute on function public.collab_manage_member(uuid,text,text[],text,text) to authenticated;

create or replace function public.collab_create_access_invitation(
 p_email text,p_profile_type text,p_role_codes text[],p_expires_at timestamptz default null,p_notes text default null
) returns jsonb language plpgsql security definer set search_path=public,auth as $$
declare project_uuid uuid:=public.collab_project_id(); invite_id uuid; existing_user uuid; role_code text;
begin
 if not public.collab_has_permission('invitations.manage',project_uuid) then raise exception 'permission_denied'; end if;
 p_email:=lower(trim(p_email));
 if p_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then raise exception 'invalid_email'; end if;
 if not exists(select 1 from public.collab_profile_types where code=p_profile_type and active) then raise exception 'invalid_profile_type'; end if;
 if p_expires_at is not null and p_expires_at<=now() then raise exception 'invalid_expiry'; end if;
 if p_role_codes is null or cardinality(p_role_codes)=0 then p_role_codes:=array['volunteer']::text[]; end if;
 if 'master'=any(p_role_codes) and not exists(select 1 from public.collab_member_roles where project_id=project_uuid and user_id=auth.uid() and role_code='master') then raise exception 'master_required'; end if;
 if exists(select 1 from unnest(p_role_codes) r(code) where not exists(select 1 from public.collab_roles cr where cr.code=r.code)) then raise exception 'invalid_role'; end if;

 insert into public.collab_access_invitations(project_id,email,intended_profile_type,role_codes,expires_at,internal_notes,created_by)
 values(project_uuid,p_email,p_profile_type,p_role_codes,p_expires_at,nullif(trim(p_notes),''),auth.uid())
 on conflict(project_id,email) where status='pending' do update set intended_profile_type=excluded.intended_profile_type,role_codes=excluded.role_codes,expires_at=excluded.expires_at,internal_notes=excluded.internal_notes,created_by=auth.uid(),created_at=now()
 returning id into invite_id;

 select id into existing_user from auth.users where lower(email)=p_email and email_confirmed_at is not null order by created_at asc limit 1;
 if existing_user is not null then perform public.collab_claim_access_invitation(existing_user,p_email); end if;
 insert into public.collab_audit_log(project_id,actor_user_id,action,entity_type,entity_id,after_data) values(project_uuid,auth.uid(),'invitation.created','access_invitation',invite_id::text,jsonb_build_object('profileType',p_profile_type,'roles',to_jsonb(p_role_codes)));
 return jsonb_build_object('id',invite_id,'status',case when existing_user is null then 'pending' else 'claimed' end);
end $$;

create or replace function public.collab_claim_access_invitation(p_user_id uuid,p_email text)
returns boolean language plpgsql security definer set search_path=public as $$
declare project_uuid uuid:=public.collab_project_id(); inv public.collab_access_invitations%rowtype; role_code text;
begin
 select * into inv from public.collab_access_invitations where project_id=project_uuid and email=lower(trim(p_email)) and status='pending' and (expires_at is null or expires_at>now()) order by created_at desc limit 1 for update;
 if inv.id is null then return false; end if;
 update public.collab_profiles set primary_profile_type=inv.intended_profile_type,updated_at=now() where user_id=p_user_id;
 insert into public.collab_project_memberships(project_id,user_id,status,primary_profile_type,approved_at,notes) values(project_uuid,p_user_id,'active',inv.intended_profile_type,now(),'Ativado por pré-autorização de e-mail.')
 on conflict(project_id,user_id) do update set status='active',primary_profile_type=excluded.primary_profile_type,approved_at=coalesce(public.collab_project_memberships.approved_at,now()),notes='Ativado por pré-autorização de e-mail.';
 delete from public.collab_member_roles where project_id=project_uuid and user_id=p_user_id;
 foreach role_code in array inv.role_codes loop insert into public.collab_member_roles(project_id,user_id,role_code) values(project_uuid,p_user_id,role_code); end loop;
 update public.collab_access_invitations set status='claimed',claimed_by=p_user_id,claimed_at=now() where id=inv.id;
 update public.collab_access_requests set status='approved',reviewed_at=now(),reviewer_notes='Ativado por pré-autorização de e-mail.' where project_id=project_uuid and user_id=p_user_id and status='pending';
 insert into public.collab_audit_log(project_id,actor_user_id,action,entity_type,entity_id,after_data) values(project_uuid,p_user_id,'invitation.claimed','access_invitation',inv.id::text,jsonb_build_object('roles',to_jsonb(inv.role_codes)));
 return true;
end $$;

revoke all on function public.collab_create_access_invitation(text,text,text[],timestamptz,text) from public;
grant execute on function public.collab_create_access_invitation(text,text,text[],timestamptz,text) to authenticated;
revoke all on function public.collab_claim_access_invitation(uuid,text) from public;

create or replace function public.collab_revoke_access_invitation(p_invitation_id uuid,p_reason text default null)
returns jsonb language plpgsql security definer set search_path=public as $$
declare project_uuid uuid:=public.collab_project_id(); changed public.collab_access_invitations%rowtype;
begin
 if not public.collab_has_permission('invitations.manage',project_uuid) then raise exception 'permission_denied'; end if;
 update public.collab_access_invitations set status='revoked',revoked_by=auth.uid(),revoked_at=now(),internal_notes=coalesce(nullif(trim(p_reason),''),internal_notes) where id=p_invitation_id and project_id=project_uuid and status='pending' returning * into changed;
 if changed.id is null then raise exception 'pending_invitation_not_found'; end if;
 insert into public.collab_audit_log(project_id,actor_user_id,action,entity_type,entity_id,metadata) values(project_uuid,auth.uid(),'invitation.revoked','access_invitation',p_invitation_id::text,jsonb_build_object('reasonProvided',nullif(trim(p_reason),'') is not null));
 return to_jsonb(changed);
end $$;
revoke all on function public.collab_revoke_access_invitation(uuid,text) from public;
grant execute on function public.collab_revoke_access_invitation(uuid,text) to authenticated;

create or replace function public.collab_update_my_profile_08b(
 p_display_name text,p_primary_profile_type text,p_locale text,p_bio text,p_phone text,p_public_recognition_opt_in boolean,
 p_organization_name text,p_languages text[],p_interests text[],p_skills text[]
) returns jsonb language plpgsql security definer set search_path=public as $$
declare project_uuid uuid:=public.collab_project_id(); item text;
begin
 perform public.collab_update_my_profile(p_display_name,p_primary_profile_type,p_locale,p_bio,p_phone,p_public_recognition_opt_in);
 update public.collab_profiles set organization_name=nullif(trim(p_organization_name),''),languages=coalesce(p_languages,array['pt-PT']::text[]),profile_completed_at=case when nullif(trim(p_display_name),'') is not null and p_primary_profile_type is not null then coalesce(profile_completed_at,now()) else profile_completed_at end where user_id=auth.uid();
 delete from public.collab_member_interests where project_id=project_uuid and user_id=auth.uid();
 foreach item in array coalesce(p_interests,array[]::text[]) loop if exists(select 1 from public.collab_interest_areas where code=item and active) then insert into public.collab_member_interests(project_id,user_id,interest_code) values(project_uuid,auth.uid(),item); end if; end loop;
 delete from public.collab_member_skills where project_id=project_uuid and user_id=auth.uid();
 foreach item in array coalesce(p_skills,array[]::text[]) loop if exists(select 1 from public.collab_skill_catalog where code=item and active) then insert into public.collab_member_skills(project_id,user_id,skill_code) values(project_uuid,auth.uid(),item); end if; end loop;
 return jsonb_build_object('updated',true);
end $$;
revoke all on function public.collab_update_my_profile_08b(text,text,text,text,text,boolean,text,text[],text[],text[]) from public;
grant execute on function public.collab_update_my_profile_08b(text,text,text,text,text,boolean,text,text[],text[],text[]) to authenticated;

-- Recreate auth trigger so a verified Google e-mail can claim a pre-authorization.
create or replace function public.collab_handle_new_auth_user()
returns trigger language plpgsql security definer set search_path=public as $$
declare project_uuid uuid; inferred_name text; claimed boolean:=false;
begin
 project_uuid:=public.collab_project_id(); inferred_name:=coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name',split_part(coalesce(new.email,''),'@',1));
 insert into public.collab_profiles(user_id,email,display_name,avatar_url) values(new.id,lower(coalesce(new.email,'')),inferred_name,coalesce(new.raw_user_meta_data->>'avatar_url',new.raw_user_meta_data->>'picture')) on conflict(user_id) do nothing;
 if new.email_confirmed_at is not null then claimed:=public.collab_claim_access_invitation(new.id,new.email); end if;
 if not claimed then
  insert into public.collab_project_memberships(project_id,user_id,status) values(project_uuid,new.id,'pending') on conflict(project_id,user_id) do nothing;
  insert into public.collab_access_requests(project_id,user_id,status) values(project_uuid,new.id,'pending') on conflict do nothing;
 end if;
 return new;
end $$;