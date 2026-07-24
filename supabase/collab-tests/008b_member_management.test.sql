begin;
do $$ begin
 if to_regclass('public.collab_access_invitations') is null then raise exception 'invitations missing'; end if;
 if to_regclass('public.collab_membership_notes') is null then raise exception 'notes missing'; end if;
 if to_regprocedure('public.collab_manage_member(uuid,text,text[],text,text)') is null then raise exception 'manage rpc missing'; end if;
 if to_regprocedure('public.collab_create_access_invitation(text,text,text[],timestamp with time zone,text)') is null then raise exception 'invite rpc missing'; end if;
 if not exists(select 1 from public.collab_permissions where code='invitations.manage') then raise exception 'invite permission missing'; end if;
 if not exists(select 1 from public.collab_modules where code='profile-management' and status='active') then raise exception 'management not active'; end if;
end $$;
rollback;
