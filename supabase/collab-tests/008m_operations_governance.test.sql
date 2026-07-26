-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08M — teste estrutural de operação, governação e transparência.

begin;

do $$
declare
  table_count integer;
  permission_count integer;
  rls_count integer;
  rpc_count integer;
  anon_policy_count integer;
begin
  select count(*) into table_count from information_schema.tables
  where table_schema='public' and table_name in (
    'collab_operating_cycles','collab_operational_responsibilities','collab_service_requests',
    'collab_moderation_cases','collab_content_review_cycles','collab_governance_decisions',
    'collab_impact_indicators','collab_impact_snapshots','collab_continuity_reviews');
  if table_count <> 9 then raise exception 'expected 9 tables, got %', table_count; end if;

  -- 9 permissões genuinamente novas
  select count(*) into permission_count from public.collab_permissions
  where code in ('responsibilities.manage','support.submit','support.manage','moderation.manage',
    'content-review.manage','governance.view','governance.manage','governance.decide','impact.manage');
  if permission_count <> 9 then raise exception 'expected 9 new permissions, got %', permission_count; end if;

  if not exists(select 1 from public.collab_modules where code='operations-governance' and required_permission='operations.view') then
    raise exception 'operations-governance module missing'; end if;

  -- master decide; coordenação não
  if not exists(select 1 from public.collab_role_permissions where role_code='master' and permission_code='governance.decide') then
    raise exception 'master must hold governance.decide'; end if;
  if exists(select 1 from public.collab_role_permissions where role_code='coordinator' and permission_code='governance.decide') then
    raise exception 'coordinator must not hold governance.decide'; end if;
  if not exists(select 1 from public.collab_role_permissions where role_code='volunteer' and permission_code='support.submit') then
    raise exception 'volunteer must hold support.submit'; end if;

  select count(*) into rpc_count from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname in (
    'collab_support_submit','collab_support_manage','collab_moderation_upsert','collab_operating_cycle_upsert',
    'collab_governance_upsert','collab_governance_decide','collab_indicator_upsert',
    'collab_indicator_publish_snapshot','collab_public_transparency_view');
  if rpc_count <> 9 then raise exception 'expected 9 functions, got %', rpc_count; end if;

  select count(*) into rls_count from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind='r' and c.relrowsecurity
    and c.relname in ('collab_operating_cycles','collab_operational_responsibilities','collab_service_requests',
      'collab_moderation_cases','collab_content_review_cycles','collab_governance_decisions',
      'collab_impact_indicators','collab_impact_snapshots','collab_continuity_reviews');
  if rls_count <> 9 then raise exception 'expected RLS on 9 tables, got %', rls_count; end if;

  -- política anon apenas em impact_snapshots
  select count(*) into anon_policy_count from pg_policies
  where schemaname='public' and 'anon'=any(roles) and tablename='collab_impact_snapshots';
  if anon_policy_count < 1 then raise exception 'expected anon read policy on snapshots, got %', anon_policy_count; end if;
  -- moderação e responsabilidades NÃO têm política anon
  if exists(select 1 from pg_policies where schemaname='public' and 'anon'=any(roles) and tablename in ('collab_moderation_cases','collab_operational_responsibilities','collab_service_requests')) then
    raise exception 'moderation/responsibilities/support must not be public';
  end if;
end
$$;

rollback;
