-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Catálogos e configuração inicial do Pacote 08I.

insert into public.collab_permissions(code,name,description) values
('operations.view','Consultar administração','Consultar saúde e configurações operacionais.'),
('operations.manage','Gerir administração','Coordenar a operação interna.'),
('operations.settings.manage','Gerir configurações operacionais','Editar configurações não sensíveis.'),
('health.view','Consultar saúde operacional','Consultar checks e execuções.'),
('health.run','Executar verificação operacional','Abrir e concluir execuções.'),
('health.check','Registar checks operacionais','Guardar estado, evidência e notas.'),
('audit.search','Pesquisar auditoria','Pesquisar eventos auditáveis redigidos.'),
('audit.export','Exportar auditoria','Gerar exportação limitada e redigida.'),
('audit.integrity','Verificar integridade da auditoria','Validar a cadeia de hashes.'),
('retention.view','Consultar retenção','Consultar políticas, legal holds e previews.'),
('retention.manage','Gerir retenção','Criar políticas e previews.'),
('retention.approve','Aprovar retenção','Aprovar uma execução após preview.'),
('legal-holds.manage','Gerir legal holds','Criar e libertar bloqueios de retenção.'),
('incidents.view','Consultar incidentes','Consultar incidentes e ações.'),
('incidents.manage','Gerir incidentes','Abrir, atualizar e coordenar incidentes.'),
('incidents.assign','Atribuir incidentes','Atribuir responsáveis e ações.'),
('incidents.close','Resolver e fechar incidentes','Concluir incidentes com fundamentação.'),
('backups.view','Consultar backups','Consultar planos e verificações.'),
('backups.manage','Gerir planos de backup','Configurar planos não sensíveis.'),
('backups.verify','Registar verificação de backup','Guardar evidência e restauração.'),
('continuity.view','Consultar continuidade','Consultar exercícios e runbooks.'),
('continuity.manage','Gerir continuidade','Criar e concluir exercícios.'),
('operations.audit.view','Consultar auditoria operacional','Consultar alterações de operação.')
on conflict(code) do update set
  name=excluded.name,
  description=excluded.description;

insert into public.collab_role_permissions(role_code,permission_code)
select 'master',code
from public.collab_permissions
where code in ('operations.view','operations.manage','operations.settings.manage','health.view','health.run','health.check','audit.search','audit.export','audit.integrity','retention.view','retention.manage','retention.approve','legal-holds.manage','incidents.view','incidents.manage','incidents.assign','incidents.close','backups.view','backups.manage','backups.verify','continuity.view','continuity.manage','operations.audit.view')
on conflict do nothing;

insert into public.collab_role_permissions(role_code,permission_code) values
('coordinator','operations.view'),
('coordinator','operations.manage'),
('coordinator','operations.settings.manage'),
('coordinator','health.view'),
('coordinator','health.run'),
('coordinator','health.check'),
('coordinator','audit.search'),
('coordinator','audit.export'),
('coordinator','audit.integrity'),
('coordinator','retention.view'),
('coordinator','retention.manage'),
('coordinator','retention.approve'),
('coordinator','legal-holds.manage'),
('coordinator','incidents.view'),
('coordinator','incidents.manage'),
('coordinator','incidents.assign'),
('coordinator','incidents.close'),
('coordinator','backups.view'),
('coordinator','backups.manage'),
('coordinator','backups.verify'),
('coordinator','continuity.view'),
('coordinator','continuity.manage'),
('coordinator','operations.audit.view'),
('reviewer','audit.search'),
('reviewer','retention.view'),
('reviewer','incidents.view'),
('reviewer','backups.view'),
('reviewer','continuity.view'),
('reviewer','health.view'),
('researcher','audit.search'),
('researcher','retention.view'),
('researcher','incidents.view'),
('researcher','backups.view'),
('researcher','continuity.view'),
('researcher','health.view')
on conflict do nothing;

insert into public.collab_modules(
  code,name,route,description,status,required_permission,sort_order
) values
(
  'system-administration',
  'Administração do sistema',
  '/area-colaborativa/gestao/sistema',
  'Saúde operacional, configurações não sensíveis, backups e verificações.',
  'active','operations.view',101
),
(
  'audit-governance',
  'Auditoria e retenção',
  '/area-colaborativa/gestao/auditoria',
  'Pesquisa auditável, integridade, legal holds, previews e aplicação protegida.',
  'active','audit.search',102
),
(
  'incident-continuity',
  'Incidentes e continuidade',
  '/area-colaborativa/gestao/incidentes',
  'Incidentes, ações corretivas, exercícios e continuidade operacional.',
  'active','incidents.view',103
)
on conflict(code) do update set
  name=excluded.name,route=excluded.route,description=excluded.description,
  status=excluded.status,required_permission=excluded.required_permission,
  sort_order=excluded.sort_order;

insert into public.collab_operational_settings(
  project_id,code,category,value_json,status,description
) values
(
  public.collab_project_id(),'current-environment','environment',
  '{"value":"unconfigured"}'::jsonb,'draft',
  'Deve ser configurado explicitamente em local, staging ou produção.'
),
(
  public.collab_project_id(),'maintenance-mode','maintenance',
  '{"enabled":false,"message":null}'::jsonb,'active',
  'Modo de manutenção da Área Colaborativa; não altera o Portal público.'
),
(
  public.collab_project_id(),'audit-export-limit','audit',
  '{"rows":5000}'::jsonb,'active',
  'Limite máximo de linhas redigidas por exportação.'
),
(
  public.collab_project_id(),'retention-auto-apply','retention',
  '{"enabled":false}'::jsonb,'active',
  'A retenção não pode ser aplicada automaticamente.'
),
(
  public.collab_project_id(),'backup-provider-state','backup',
  '{"status":"unconfigured"}'::jsonb,'draft',
  'Não afirma a existência de backup remoto sem evidência.'
),
(
  public.collab_project_id(),'continuity-responsibles','continuity',
  '{"primaryConfigured":false,"secondaryConfigured":false}'::jsonb,'draft',
  'Responsáveis devem ser atribuídos sem gravar contactos ou secrets.'
)
on conflict(project_id,code) do update set
  description=excluded.description;

insert into public.collab_retention_policies(
  project_id,code,resource_type,name,retention_days,action,
  automatic_allowed,legal_hold_supported,risk,scope_description,status
) values
(public.collab_project_id(),'expired-notifications','collab_notifications','Notificações expiradas',365,'delete',false,true,'low','Registos cujo expires_at já terminou.','active'),
(public.collab_project_id(),'notification-outbox-delivered','collab_notification_outbox','Outbox entregue ou cancelada',180,'delete',false,true,'low','Itens delivered ou cancelled mais antigos do que o prazo.','active'),
(public.collab_project_id(),'notification-deliveries','collab_notification_deliveries','Tentativas de entrega',365,'delete',false,true,'medium','Tentativas ligadas a outbox antiga.','active'),
(public.collab_project_id(),'operational-results','collab_operational_results','Resultados operacionais',730,'delete',false,true,'low','Resultados não bloqueantes de execuções antigas.','active'),
(public.collab_project_id(),'audit-log','collab_audit_log','Auditoria',2555,'export-only',false,true,'critical','Não é eliminada pela aplicação; apenas revisão e arquivo controlado.','active'),
(public.collab_project_id(),'incidents','collab_incidents','Incidentes e continuidade',2555,'manual-review',false,true,'critical','Revisão humana antes de qualquer anonimização ou arquivo.','active'),
(public.collab_project_id(),'community-contributions','collab_contributions','Contributos comunitários',0,'manual-review',false,true,'critical','Governado por consentimento, direitos e pedidos de retirada.','active')
on conflict(project_id,code) do update set
  resource_type=excluded.resource_type,name=excluded.name,
  retention_days=excluded.retention_days,action=excluded.action,
  automatic_allowed=false,legal_hold_supported=excluded.legal_hold_supported,
  risk=excluded.risk,scope_description=excluded.scope_description,
  status=excluded.status;

insert into public.collab_operational_check_catalog(
  code,category,name,blocking,evidence_required,frequency,active,sort_order
) values
('database-migrations','database','Migrations aplicadas',true,true,'release',true,10),
('rls-policies','database','RLS e RPCs validadas',true,true,'release',true,20),
('audit-chain','audit','Cadeia de integridade da auditoria',true,true,'weekly',true,30),
('google-oauth','authentication','Google OAuth operacional',true,true,'release',true,40),
('active-master','authentication','Master ativo',true,true,'weekly',true,50),
('last-master-protection','authentication','Proteção do último master',true,true,'release',true,60),
('private-storage','storage','Storage privado',true,true,'monthly',true,70),
('signed-links','storage','URLs assinadas e expiração',true,true,'monthly',true,80),
('notification-center','notifications','Centro interno de notificações',true,true,'release',true,90),
('notification-dead-letter','notifications','Outbox e dead-letter controladas',false,true,'weekly',true,100),
('backup-freshness','backup','Backup recente',true,true,'daily',true,110),
('restore-test','backup','Teste de restauração',true,true,'quarterly',true,120),
('retention-preview','retention','Preview de retenção revisto',false,true,'monthly',true,130),
('legal-holds','retention','Legal holds revistos',true,true,'monthly',true,140),
('critical-incidents','incidents','Incidentes críticos sem resposta',true,false,'daily',true,150),
('public-build','publication','Build público validado',true,true,'release',true,160),
('staging-homologation','deployment','Staging homologado',true,true,'release',true,170),
('production-gate','deployment','Gate de produção preservado',true,true,'release',true,180),
('secrets-boundary','security','Fronteira de secrets',true,true,'release',true,190),
('continuity-runbook','continuity','Runbook e responsáveis atualizados',false,true,'quarterly',true,200)
on conflict(code) do update set
  category=excluded.category,name=excluded.name,blocking=excluded.blocking,
  evidence_required=excluded.evidence_required,frequency=excluded.frequency,
  active=excluded.active,sort_order=excluded.sort_order;

insert into public.collab_backup_plans(
  project_id,code,name,backup_type,provider,frequency,retention_days,
  target_rpo_minutes,target_rto_minutes,status,instructions_reference
) values
(
  public.collab_project_id(),'database-main','Base de dados principal',
  'database','unconfigured','daily',30,1440,240,'draft',
  'docs/operations/BACKUP_RESTORE_RUNBOOK_08I.md'
),
(
  public.collab_project_id(),'private-storage','Ficheiros privados',
  'storage','unconfigured','weekly',30,10080,480,'draft',
  'docs/operations/BACKUP_RESTORE_RUNBOOK_08I.md'
),
(
  public.collab_project_id(),'repository-code','Código e documentação',
  'code','github','daily',365,1440,120,'active',
  'docs/operations/BACKUP_RESTORE_RUNBOOK_08I.md'
),
(
  public.collab_project_id(),'configuration-export','Configuração não sensível',
  'configuration','manual-export','monthly',365,43200,240,'draft',
  'docs/operations/BACKUP_RESTORE_RUNBOOK_08I.md'
),
(
  public.collab_project_id(),'audit-export','Exportação de auditoria',
  'audit-export','manual-export','quarterly',2555,129600,1440,'draft',
  'docs/operations/AUDIT_EXPORT_GUIDE_08I.md'
)
on conflict(project_id,code) do update set
  name=excluded.name,instructions_reference=excluded.instructions_reference;

insert into public.collab_notification_event_types(
  code,category,name,severity,mandatory_in_app,email_allowed,
  default_email,retention_days,route_template,active
) values
('incident.opened','incidents','Incidente aberto','critical',true,true,false,730,'/area-colaborativa/gestao/incidentes',true),
('incident.assigned','incidents','Incidente atribuído','warning',true,true,false,730,'/area-colaborativa/gestao/incidentes',true),
('incident.resolved','incidents','Incidente resolvido','success',true,true,false,730,'/area-colaborativa/gestao/incidentes',true),
('backup.verification-failed','backups','Verificação de backup falhou','critical',true,true,false,730,'/area-colaborativa/gestao/sistema',true),
('retention.run-approved','governance','Execução de retenção aprovada','warning',true,true,false,730,'/area-colaborativa/gestao/auditoria',true)
on conflict(code) do update set
  category=excluded.category,name=excluded.name,severity=excluded.severity,
  mandatory_in_app=excluded.mandatory_in_app,
  email_allowed=excluded.email_allowed,default_email=false,
  retention_days=excluded.retention_days,
  route_template=excluded.route_template,active=excluded.active;

insert into public.collab_notification_templates(
  event_type,channel,language,version,status,subject_template,
  title_template,body_text_template,allowed_tokens
) values
('incident.opened','email','pt-PT',1,'approved','Incidente aberto — {{title}}','Novo incidente operacional','Foi aberto o incidente “{{title}}”, com estado {{status}}. Consulte a informação operacional em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('incident.assigned','email','pt-PT',1,'approved','Incidente atribuído — {{title}}','Foi-lhe atribuído um incidente','O incidente “{{title}}” foi-lhe atribuído com o papel {{role}}. Consulte ações e atualizações em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('incident.resolved','email','pt-PT',1,'approved','Incidente resolvido — {{title}}','Incidente resolvido','O incidente “{{title}}” foi marcado como resolvido. Consulte o resumo e as ações de continuidade em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('backup.verification-failed','email','pt-PT',1,'approved','Verificação de backup falhou — {{title}}','Backup necessita de atenção','A verificação “{{title}}” terminou com o estado {{status}}. Consulte a evidência e as ações corretivas em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('retention.run-approved','email','pt-PT',1,'approved','Execução de retenção aprovada — {{reference}}','Retenção aprovada para aplicação protegida','A execução de retenção {{reference}} foi aprovada. A aplicação continua dependente de service role, legal holds e confirmação literal.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[])
on conflict(event_type,channel,language,version) do update set
  subject_template=excluded.subject_template,
  title_template=excluded.title_template,
  body_text_template=excluded.body_text_template,
  allowed_tokens=excluded.allowed_tokens,
  status=case
    when public.collab_notification_templates.status='approved'
      then public.collab_notification_templates.status
    else excluded.status
  end,
  updated_at=now();
