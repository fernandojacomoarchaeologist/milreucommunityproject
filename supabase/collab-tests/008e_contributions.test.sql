begin;

do $$
begin
  if to_regclass('public.collab_contributions') is null then
    raise exception 'collab_contributions missing';
  end if;
  if to_regclass('public.collab_contribution_submitters') is null then
    raise exception 'collab_contribution_submitters missing';
  end if;
  if to_regclass('public.collab_contribution_files') is null then
    raise exception 'collab_contribution_files missing';
  end if;
  if to_regclass('public.collab_contribution_events') is null then
    raise exception 'collab_contribution_events missing';
  end if;
  if to_regclass('public.collab_withdrawal_requests') is null then
    raise exception 'collab_withdrawal_requests missing';
  end if;

  if not exists(
    select 1 from public.collab_consent_versions
    where code='2026-08E-v1' and active
  ) then raise exception 'active 08E consent missing'; end if;

  if not exists(
    select 1 from public.collab_permissions
    where code='contributions.decide'
  ) then raise exception 'contributions.decide missing'; end if;

  if not exists(
    select 1 from public.collab_role_permissions
    where role_code='master' and permission_code='withdrawals.manage'
  ) then raise exception 'master withdrawals.manage missing'; end if;

  if not exists(
    select 1 from public.collab_modules
    where code='contributions' and status='active'
  ) then raise exception 'contributions module not active'; end if;

  if not exists(
    select 1 from public.collab_modules
    where code='contribution-moderation' and status='active'
  ) then raise exception 'moderation module not active'; end if;

  if not exists(
    select 1 from pg_class c
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public'
      and c.relname='collab_contributions'
      and c.relrowsecurity
  ) then raise exception 'RLS missing on collab_contributions'; end if;

  if not exists(
    select 1 from storage.buckets
    where id='community-contributions-private'
      and public=false
  ) then raise exception 'private contribution bucket missing'; end if;

  if to_regprocedure('public.collab_consume_public_rate_limit_08e(text,timestamp with time zone,integer)') is null then
    raise exception 'atomic rate limit RPC missing';
  end if;
  if to_regprocedure('public.collab_create_public_contribution_08e(jsonb)') is null then
    raise exception 'public contribution RPC missing';
  end if;
  if to_regprocedure('public.collab_create_member_contribution_08e(jsonb)') is null then
    raise exception 'member contribution RPC missing';
  end if;
  if to_regprocedure('public.collab_track_public_contribution_08e(text,text)') is null then
    raise exception 'tracking RPC missing';
  end if;
  if to_regprocedure('public.collab_moderate_contribution_08e(uuid,text,text,text)') is null then
    raise exception 'moderation RPC missing';
  end if;
  if to_regprocedure('public.collab_create_incorporation_proposal_08e(uuid,text,text,text)') is null then
    raise exception 'incorporation proposal RPC missing';
  end if;
  if to_regprocedure('public.collab_resolve_withdrawal_request_08e(uuid,text,text)') is null then
    raise exception 'withdrawal RPC missing';
  end if;
end
$$;

rollback;
