begin;

do $$
declare
  record_count integer;
begin
  if to_regclass('public.collab_museum_review_records') is null then raise exception 'review records missing'; end if;
  if to_regclass('public.collab_museum_review_field_proposals') is null then raise exception 'proposals missing'; end if;
  if to_regclass('public.collab_museum_review_snapshots') is null then raise exception 'snapshots missing'; end if;
  if to_regclass('public.collab_training_trails') is null then raise exception 'training missing'; end if;
  if to_regclass('public.collab_library_resources') is null then raise exception 'library missing'; end if;

  select count(*) into record_count
  from public.collab_museum_review_records record
  join public.collab_museum_review_cycles cycle on cycle.id=record.cycle_id
  where cycle.code='museum-review-2026-01';
  if record_count<>31 then raise exception 'expected 31 review records, got %',record_count; end if;

  if not exists(select 1 from public.collab_training_trails where code='rights-credits-ai' and active) then raise exception 'rights trail missing'; end if;
  if not exists(select 1 from public.collab_training_trails where code='accessible-public-writing' and active) then raise exception 'accessibility trail missing'; end if;
  if not exists(select 1 from public.collab_modules where code='museum-review' and status='active') then raise exception 'museum review module inactive'; end if;
  if not exists(select 1 from public.collab_modules where code='training' and status='active') then raise exception 'training module inactive'; end if;
  if not exists(select 1 from public.collab_modules where code='library' and status='active') then raise exception 'library module inactive'; end if;
  if not exists(select 1 from public.collab_role_permissions where role_code='master' and permission_code='museum.review.apply') then raise exception 'master apply permission missing'; end if;

  if not exists(
    select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='collab_museum_review_records' and c.relrowsecurity
  ) then raise exception 'RLS missing'; end if;

  if to_regprocedure('public.collab_museum_review_field_allowed_08f(text)') is null then raise exception 'field whitelist RPC missing'; end if;
  if to_regprocedure('public.collab_complete_training_lesson_08f(text,text)') is null then raise exception 'training lesson RPC missing'; end if;
  if to_regprocedure('public.collab_upsert_museum_review_proposal_08f(uuid,uuid,text,jsonb,jsonb,text,jsonb,jsonb,boolean)') is null then raise exception 'proposal RPC missing'; end if;
  if to_regprocedure('public.collab_decide_museum_review_08f(uuid,text,text)') is null then raise exception 'decision RPC missing'; end if;
  if to_regprocedure('public.collab_generate_museum_review_snapshot_08f(uuid,text)') is null then raise exception 'snapshot RPC missing'; end if;
  if to_regprocedure('public.collab_export_museum_review_snapshot_08f(uuid)') is null then raise exception 'export RPC missing'; end if;
end
$$;

rollback;
