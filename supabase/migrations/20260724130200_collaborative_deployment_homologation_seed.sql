-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Catálogos e ambientes iniciais do Pacote 08G.

insert into public.collab_permissions(code,name,description) values
('deployment.view','Consultar implantação','Consultar ambientes e estado de implantação.'),
('deployment.manage','Gerir implantação','Configurar metadados dos ambientes.'),
('deployment.audit.view','Consultar auditoria de implantação','Consultar histórico de configuração e homologação.'),
('homologation.view','Consultar homologação','Consultar execuções e checks.'),
('homologation.run','Executar homologação','Criar e concluir execuções.'),
('homologation.check','Registar checks','Registar evidências e resultados.'),
('homologation.approve','Aprovar homologação','Homologar staging ou produção com confirmação literal.'),
('homologation.cancel','Cancelar homologação','Cancelar uma execução com fundamento.'),
('auth.policy.view','Consultar política de autenticação','Consultar configuração lógica de Google OAuth e pré-autorização.'),
('auth.policy.manage','Gerir política de autenticação','Atualizar a política lógica de autenticação.'),
('auth.audit.view','Consultar auditoria de autenticação','Consultar eventos administrativos relacionados com autenticação.'),
('master.status.view','Consultar estado do master','Consultar a existência de master ativo sem expor o e-mail.')
on conflict(code) do update set name=excluded.name,description=excluded.description;

insert into public.collab_role_permissions(role_code,permission_code)
select 'master',code
from public.collab_permissions
where code in ('deployment.view','deployment.manage','deployment.audit.view','homologation.view','homologation.run','homologation.check','homologation.approve','homologation.cancel','auth.policy.view','auth.policy.manage','auth.audit.view','master.status.view')
on conflict do nothing;

insert into public.collab_role_permissions(role_code,permission_code) values
('coordinator','deployment.view'),
('coordinator','deployment.manage'),
('coordinator','deployment.audit.view'),
('coordinator','homologation.view'),
('coordinator','homologation.run'),
('coordinator','homologation.check'),
('coordinator','homologation.approve'),
('coordinator','homologation.cancel'),
('coordinator','auth.policy.view'),
('coordinator','auth.policy.manage'),
('coordinator','auth.audit.view'),
('coordinator','master.status.view'),
('reviewer','deployment.view'),
('reviewer','homologation.view'),
('reviewer','homologation.check'),
('reviewer','auth.policy.view'),
('reviewer','master.status.view'),
('researcher','deployment.view'),
('researcher','homologation.view'),
('researcher','homologation.check'),
('researcher','auth.policy.view'),
('researcher','master.status.view'),
('translator','deployment.view'),
('translator','homologation.view'),
('translator','homologation.check'),
('translator','auth.policy.view'),
('translator','master.status.view'),
('observer','deployment.view'),
('observer','homologation.view'),
('observer','homologation.check'),
('observer','auth.policy.view'),
('observer','master.status.view')
on conflict do nothing;

insert into public.collab_modules(
  code,name,route,description,status,required_permission,sort_order
) values (
  'deployment-homologation',
  'Implantação e homologação',
  '/area-colaborativa/gestao/homologacao',
  'Ambientes, Google OAuth, master, migrations, RLS, storage, fluxos e gates de publicação.',
  'active',
  'homologation.view',
  98
)
on conflict(code) do update set
  name=excluded.name,
  route=excluded.route,
  description=excluded.description,
  status=excluded.status,
  required_permission=excluded.required_permission,
  sort_order=excluded.sort_order;

insert into public.collab_homologation_check_catalog(
  code,category,title,blocking,sort_order,active
) values
('env-config','environment','Variáveis e perfil do ambiente',true,10,true),
('separate-staging','environment','Staging separado de produção',true,20,true),
('migration-dry-run','database','Dry-run das migrations',true,30,true),
('database-tests','database','Testes SQL 08A–08G',true,40,true),
('google-provider','auth','Provider Google ativo',true,50,true),
('google-callback','auth','Callback do Google/Supabase validado',true,60,true),
('app-callback','auth','Callback da aplicação validado',true,70,true),
('preauthorization','auth','Pré-autorização e aprovação de membros',true,80,true),
('master-bootstrap','master','Master configurado',true,90,true),
('last-master-protection','master','Proteção do último master',true,100,true),
('role-matrix','rls','Matriz de perfis e permissões',true,110,true),
('cross-user-isolation','rls','Isolamento entre utilizadores',true,120,true),
('private-contribution-files','storage','Ficheiros comunitários privados',true,130,true),
('signed-links','storage','Links temporários assinados',true,140,true),
('collaborative-flows','functional','Fluxos 08A–08F',true,150,true),
('session-expiry','auth','Logout e expiração de sessão',true,160,true),
('mobile-375','accessibility','Homologação a 375 px',true,170,true),
('tablet-768','accessibility','Homologação a 768 px',true,180,true),
('desktop-1280','accessibility','Homologação a 1280 px',true,190,true),
('keyboard-screen-reader','accessibility','Teclado e leitor de ecrã',true,200,true),
('performance-budget','performance','Budgets de desempenho',false,210,true),
('rollback-tested','recovery','Rollback documentado e ensaiado',true,220,true),
('backup-tested','recovery','Backup e restauração testados',true,230,true),
('consent-privacy-review','privacy','Consentimentos e privacidade revistos',true,240,true)
on conflict(code) do update set
  category=excluded.category,
  title=excluded.title,
  blocking=excluded.blocking,
  sort_order=excluded.sort_order,
  active=excluded.active;

insert into public.collab_deployment_environments(
  project_id,code,name,status,is_production,allows_reset,allows_demo,metadata
) values
(public.collab_project_id(),'local','Local','configured',false,true,true,'{"source":"08G seed"}'::jsonb),
(public.collab_project_id(),'staging','Staging','unconfigured',false,true,false,'{"source":"08G seed"}'::jsonb),
(public.collab_project_id(),'production','Produção','unconfigured',true,false,false,'{"source":"08G seed"}'::jsonb)
on conflict(project_id,code) do nothing;

insert into public.collab_auth_policies(
  project_id,provider,google_enabled,require_preauthorization,
  allowed_email_domains,store_provider_tokens,minimum_active_masters,
  session_expiry_minutes,policy_status
) values (
  public.collab_project_id(),'google',false,true,'{}'::text[],
  false,1,60,'draft'
)
on conflict(project_id) do nothing;
