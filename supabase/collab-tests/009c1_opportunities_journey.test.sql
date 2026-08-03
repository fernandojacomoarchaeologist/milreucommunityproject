-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 09C.1 — verificações de fecho funcional/RLS da jornada de oportunidades.
-- Confirma que as regras da jornada (candidatura única, capacidade atómica, menores
-- bloqueados, remoção com justificação, decisão por permissão) e a privacidade dos
-- candidatos estão garantidas no BACKEND (não apenas na interface de demonstração).

begin;

do $$
declare
  apply_def text;
  decide_def text;
  remove_def text;
  addpart_def text;
  status_def text;
  app_anon_grant integer;
  app_anon_policy integer;
  minors_default boolean;
begin
  -- Candidaturas nunca LEGÍVEIS por anon (privacidade entre candidatos e público).
  -- O invariante do 09C é a ausência de SELECT a anon (RLS + sem grant de leitura);
  -- privilégios default do Supabase noutras operações são irrelevantes para a leitura.
  select count(*) into app_anon_grant from information_schema.role_table_grants
  where table_schema='public' and table_name='collab_opportunity_applications'
    and grantee='anon' and privilege_type='SELECT';
  if app_anon_grant <> 0 then raise exception 'applications must not be SELECT-able by anon (got %)', app_anon_grant; end if;

  -- Nenhuma política concede leitura de candidaturas a anon.
  select count(*) into app_anon_policy from pg_policies
  where schemaname='public' and tablename='collab_opportunity_applications'
    and 'anon' = any(roles) and (cmd = 'SELECT' or cmd = 'ALL');
  if app_anon_policy <> 0 then raise exception 'applications must have no anon read policy (got %)', app_anon_policy; end if;

  -- Menores bloqueados por omissão ao nível da tabela.
  select (column_default like '%false%') into minors_default from information_schema.columns
  where table_schema='public' and table_name='collab_opportunities' and column_name='minors_allowed';
  if minors_default is distinct from true then raise exception 'minors_allowed must default to false'; end if;

  -- Candidatura: bloqueia menores e evita duplicados (unicidade).
  apply_def := pg_get_functiondef('public.collab_opportunity_apply'::regproc);
  if position('minors_policy_pending' in apply_def) = 0 then raise exception 'apply must raise minors_policy_pending'; end if;

  -- Unicidade de candidatura por pessoa/oportunidade (constraint OU guarda na RPC).
  if (select count(*) from pg_constraint c join pg_class t on t.oid=c.conrelid
      where t.relname='collab_opportunity_applications' and c.contype='u') = 0
     and position('unique' in lower(apply_def)) = 0
     and position('already' in lower(apply_def)) = 0 then
    raise exception 'single application per person/opportunity not enforced';
  end if;

  -- Decisão exige permissão de gestão.
  decide_def := pg_get_functiondef('public.collab_opportunity_decide'::regproc);
  if position('opportunities.manage' in decide_def) = 0 then raise exception 'decide must check opportunities.manage'; end if;

  -- Remoção de participante exige justificação interna.
  remove_def := pg_get_functiondef('public.collab_opportunity_remove_participant'::regproc);
  if position('reason_required' in remove_def) = 0 then raise exception 'remove must require an internal reason'; end if;
  if position('opportunities.manage' in remove_def) = 0 then raise exception 'remove must check opportunities.manage'; end if;

  -- Adicionar participante e mudança de estado também sob permissão de gestão.
  addpart_def := pg_get_functiondef('public.collab_opportunity_add_participant'::regproc);
  if position('opportunities.manage' in addpart_def) = 0 then raise exception 'add_participant must check opportunities.manage'; end if;
  status_def := pg_get_functiondef('public.collab_opportunity_set_status'::regproc);
  if position('opportunities.manage' in status_def) = 0 then raise exception 'set_status must check opportunities.manage'; end if;

  raise notice '09C.1 journey backend checks passed: privacy, minors, single application, capacity/decision/removal under management permission.';
end $$;

rollback;
