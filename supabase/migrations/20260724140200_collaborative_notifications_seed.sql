-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Catálogos, templates e permissões do Pacote 08H.

insert into public.collab_permissions(code,name,description) values
('notifications.view','Consultar notificações','Consultar o centro interno e os próprios avisos.'),
('notifications.mark','Atualizar estado de notificações','Marcar como lida, não lida ou arquivada.'),
('notifications.preferences','Gerir preferências de comunicação','Configurar avisos opcionais, e-mail e horário silencioso.'),
('notifications.manage','Gerir notificações','Consultar a operação e coordenar canais.'),
('notifications.templates.manage','Gerir templates','Criar, rever e aprovar templates transacionais.'),
('notifications.outbox.view','Consultar outbox','Consultar filas e estados sem expor dados desnecessários.'),
('notifications.outbox.manage','Gerir outbox','Repetir ou cancelar entregas.'),
('notifications.test','Testar notificações','Criar notificações de teste controladas.'),
('notifications.audit.view','Consultar auditoria de notificações','Consultar eventos e decisões operacionais.'),
('notifications.invitation-email','Enfileirar e-mail de convite','Solicitar explicitamente o envio de uma pré-autorização.'),
('notifications.channel.manage','Gerir canais','Ativar, pausar ou desativar canais com confirmação.'),
('notifications.delivery.manage','Gerir entregas','Supervisionar tentativas, falhas e dead letters.')
on conflict(code) do update set
  name=excluded.name,
  description=excluded.description;

insert into public.collab_role_permissions(role_code,permission_code)
select 'master',code
from public.collab_permissions
where code in ('notifications.view','notifications.mark','notifications.preferences','notifications.manage','notifications.templates.manage','notifications.outbox.view','notifications.outbox.manage','notifications.test','notifications.audit.view','notifications.invitation-email','notifications.channel.manage','notifications.delivery.manage')
on conflict do nothing;

insert into public.collab_role_permissions(role_code,permission_code) values
('coordinator','notifications.view'),
('coordinator','notifications.mark'),
('coordinator','notifications.preferences'),
('coordinator','notifications.manage'),
('coordinator','notifications.templates.manage'),
('coordinator','notifications.outbox.view'),
('coordinator','notifications.outbox.manage'),
('coordinator','notifications.test'),
('coordinator','notifications.audit.view'),
('coordinator','notifications.invitation-email'),
('coordinator','notifications.channel.manage'),
('coordinator','notifications.delivery.manage'),
('volunteer','notifications.view'),
('volunteer','notifications.mark'),
('volunteer','notifications.preferences'),
('reviewer','notifications.view'),
('reviewer','notifications.mark'),
('reviewer','notifications.preferences'),
('researcher','notifications.view'),
('researcher','notifications.mark'),
('researcher','notifications.preferences'),
('translator','notifications.view'),
('translator','notifications.mark'),
('translator','notifications.preferences'),
('partner','notifications.view'),
('partner','notifications.mark'),
('partner','notifications.preferences'),
('observer','notifications.view'),
('observer','notifications.mark'),
('observer','notifications.preferences'),
('reviewer','notifications.audit.view'),
('reviewer','notifications.outbox.view'),
('researcher','notifications.audit.view'),
('researcher','notifications.outbox.view')
on conflict do nothing;

insert into public.collab_modules(
  code,name,route,description,status,required_permission,sort_order
) values
(
  'notifications',
  'Notificações',
  '/area-colaborativa/notificacoes',
  'Centro interno, estado de leitura e preferências de comunicação.',
  'active',
  'notifications.view',
  22
),
(
  'notification-management',
  'Gestão de notificações',
  '/area-colaborativa/gestao/notificacoes',
  'Templates, canais, outbox, entregas, testes e operação transacional.',
  'active',
  'notifications.manage',
  97
)
on conflict(code) do update set
  name=excluded.name,
  route=excluded.route,
  description=excluded.description,
  status=excluded.status,
  required_permission=excluded.required_permission,
  sort_order=excluded.sort_order;

insert into public.collab_notification_channels(
  project_id,channel,status,provider,from_name,from_email,settings
) values
(
  public.collab_project_id(),'in-app','active','disabled',
  'Projeto Comunitário de Milreu',null,
  '{"pollIntervalSeconds":60,"pageSize":30}'::jsonb
),
(
  public.collab_project_id(),'email','disabled','disabled',
  'Projeto Comunitário de Milreu',null,
  '{"automaticScheduleEnabled":false,"maxBatch":25,"maxAttempts":5}'::jsonb
)
on conflict(project_id,channel) do update set
  from_name=excluded.from_name,
  settings=excluded.settings,
  updated_at=now();

insert into public.collab_notification_event_types(
  code,category,name,severity,mandatory_in_app,email_allowed,
  default_email,retention_days,route_template,active
) values
('membership.approved','membership','Acesso aprovado','success',true,true,false,365,'/area-colaborativa',true),
('membership.rejected','membership','Pedido de acesso recusado','warning',true,true,false,365,'/area-colaborativa',true),
('membership.suspended','security','Acesso suspenso','critical',true,true,false,730,'/area-colaborativa',true),
('invitation.created','membership','Convite de acesso','info',false,true,false,180,'/area-colaborativa',true),
('task.assigned','tasks','Tarefa atribuída','info',true,true,false,365,'/area-colaborativa/tarefas',true),
('task.status-changed','tasks','Estado de tarefa alterado','info',true,true,false,365,'/area-colaborativa/tarefas',true),
('contribution.assigned','contributions','Contributo atribuído','info',true,true,false,365,'/area-colaborativa/gestao/contributos',true),
('contribution.needs-info','contributions','Contributo necessita informação','warning',true,true,false,730,'/area-colaborativa/contributos',true),
('contribution.decision','contributions','Decisão sobre contributo','info',true,true,false,730,'/area-colaborativa/contributos',true),
('museum-review.assigned','museum-review','Revisão do Museu atribuída','info',true,true,false,365,'/area-colaborativa/revisao-museu',true),
('museum-review.blocking-comment','museum-review','Comentário editorial bloqueante','warning',true,true,false,730,'/area-colaborativa/revisao-museu',true),
('training.assessment-pending','training','Avaliação de formação pendente','warning',true,true,false,365,'/area-colaborativa/formacao',true),
('training.completed','training','Formação concluída','success',true,true,false,365,'/area-colaborativa/formacao',true),
('agenda.changed','agenda','Atividade alterada','info',true,true,false,180,'/area-colaborativa/agenda',true),
('agenda.cancelled','agenda','Atividade cancelada','warning',true,true,false,365,'/area-colaborativa/agenda',true),
('agenda.upcoming','agenda','Atividade próxima','info',false,true,false,90,'/area-colaborativa/agenda',true),
('exhibition.logistics-assigned','exhibitions','Logística de exposição atribuída','info',true,true,false,365,'/area-colaborativa/agenda',true),
('withdrawal.submitted','withdrawals','Pedido de retirada recebido','critical',true,true,false,1095,'/area-colaborativa/gestao/contributos',true),
('withdrawal.status-changed','withdrawals','Pedido de retirada atualizado','critical',true,true,false,1095,'/area-colaborativa/contributos',true),
('homologation.blocked','operations','Homologação bloqueada','critical',true,true,false,730,'/area-colaborativa/gestao/homologacao',true)
on conflict(code) do update set
  category=excluded.category,
  name=excluded.name,
  severity=excluded.severity,
  mandatory_in_app=excluded.mandatory_in_app,
  email_allowed=excluded.email_allowed,
  default_email=excluded.default_email,
  retention_days=excluded.retention_days,
  route_template=excluded.route_template,
  active=excluded.active;

insert into public.collab_notification_templates(
  event_type,channel,language,version,status,subject_template,
  title_template,body_text_template,allowed_tokens
) values
('membership.approved','email','pt-PT',1,'approved','Acesso aprovado — {{project_name}}','O seu acesso foi aprovado','Olá {{display_name}}. O seu acesso à Área Colaborativa do {{project_name}} foi aprovado. Aceda em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('membership.rejected','email','pt-PT',1,'approved','Atualização do pedido de acesso — {{project_name}}','Pedido de acesso atualizado','Olá {{display_name}}. O pedido de acesso à Área Colaborativa foi atualizado. Consulte a informação disponível em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('membership.suspended','email','pt-PT',1,'approved','Acesso suspenso — {{project_name}}','O seu acesso foi suspenso','Olá {{display_name}}. O seu acesso à Área Colaborativa foi suspenso. Para esclarecimentos, utilize os canais institucionais definidos pelo projeto.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('invitation.created','email','pt-PT',1,'approved','Convite para colaborar — {{project_name}}','Convite para a Área Colaborativa','Foi criado um convite para participar no {{project_name}} com o perfil {{role}}. Inicie sessão com esta conta Google em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('task.assigned','email','pt-PT',1,'approved','Nova tarefa atribuída — {{title}}','Recebeu uma tarefa','Foi-lhe atribuída a tarefa “{{title}}”. Consulte prazo e instruções em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('task.status-changed','email','pt-PT',1,'approved','Atualização da tarefa — {{title}}','A tarefa foi atualizada','O estado da tarefa “{{title}}” passou para {{status}}. Consulte os detalhes em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('contribution.assigned','email','pt-PT',1,'approved','Contributo atribuído — {{reference}}','Novo contributo para revisão','O contributo {{reference}} foi-lhe atribuído. Consulte a fila de moderação em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('contribution.needs-info','email','pt-PT',1,'approved','Informação necessária — {{reference}}','O contributo necessita de informação','É necessária informação adicional sobre o contributo {{reference}}. Consulte a mensagem e responda em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('contribution.decision','email','pt-PT',1,'approved','Decisão sobre o contributo {{reference}}','O contributo foi revisto','O contributo {{reference}} recebeu uma decisão: {{status}}. Consulte a mensagem em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('museum-review.assigned','email','pt-PT',1,'approved','Revisão atribuída — {{reference}}','Memória atribuída para revisão','A memória {{reference}} foi-lhe atribuída para {{role}}. Aceda ao registo em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('museum-review.blocking-comment','email','pt-PT',1,'approved','Bloqueio editorial — {{reference}}','Existe um comentário bloqueante','A memória {{reference}} possui um comentário bloqueante que requer atenção. Consulte-o em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('training.assessment-pending','email','pt-PT',1,'approved','Avaliação de formação pendente','Formação a aguardar avaliação','O percurso “{{title}}” foi concluído e aguarda avaliação. Consulte a formação em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('training.completed','email','pt-PT',1,'approved','Formação concluída — {{title}}','Percurso concluído','Concluiu o percurso “{{title}}”. O estado foi atualizado na Área Colaborativa.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('agenda.changed','email','pt-PT',1,'approved','Atividade atualizada — {{title}}','Uma atividade foi alterada','A atividade “{{title}}”, prevista para {{starts_at}}, foi atualizada. Consulte os detalhes em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('agenda.cancelled','email','pt-PT',1,'approved','Atividade cancelada — {{title}}','Uma atividade foi cancelada','A atividade “{{title}}” foi cancelada. Consulte a agenda em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('agenda.upcoming','email','pt-PT',1,'approved','Lembrete — {{title}}','Atividade próxima','A atividade “{{title}}” começa em {{starts_at}}. Consulte localização e detalhes em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('exhibition.logistics-assigned','email','pt-PT',1,'approved','Ação logística atribuída — {{title}}','Ação de exposição atribuída','Foi-lhe atribuída a ação logística “{{title}}”, com prazo {{due_at}}. Consulte os detalhes em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('withdrawal.submitted','email','pt-PT',1,'approved','Pedido de retirada recebido — {{reference}}','Novo pedido de retirada','Foi recebido um pedido de retirada relacionado com {{reference}}. Este evento é prioritário e deve ser tratado em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('withdrawal.status-changed','email','pt-PT',1,'approved','Pedido de retirada atualizado — {{reference}}','Pedido de retirada atualizado','O estado do pedido de retirada {{reference}} passou para {{status}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[]),
('homologation.blocked','email','pt-PT',1,'approved','Homologação bloqueada — {{environment}}','A homologação foi bloqueada','A homologação do ambiente {{environment}} foi bloqueada. Consulte checks e evidências em {{action_url}}.',array['display_name','project_name','title','status','reference','action_url','due_at','starts_at','role','reason','environment']::text[])
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
