/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync,readFileSync } from "node:fs";

const pkg=JSON.parse(readFileSync("package.json","utf8"));
const model=JSON.parse(readFileSync("public/data/collaborative-notification-model.json","utf8"));
const templates=JSON.parse(readFileSync("public/data/collaborative-notification-templates.json","utf8"));
const runtime=JSON.parse(readFileSync("public/config/notifications.runtime.json","utf8"));
const runtimeExample=JSON.parse(readFileSync("public/config/notifications.example.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const library=JSON.parse(readFileSync("public/data/collaborative-library.json","utf8"));
const readiness=JSON.parse(readFileSync("public/data/collaborative-readiness.json","utf8"));
const impact=JSON.parse(readFileSync("public/data/package-impact-registry.json","utf8"));
const configLoader=readFileSync("src/collab/config.js","utf8");
const controller=readFileSync("src/collab/controller.js","utf8");
const router=readFileSync("src/lib/router.js","utf8");
const view=readFileSync("src/views/collaborative-notifications.js","utf8");
const main=readFileSync("src/main.js","utf8");
const layout=readFileSync("src/components/collaborative-layout.js","utf8");
const styles=readFileSync("src/styles/app.css","utf8");
const foundation=readFileSync("supabase/migrations/20260724140000_collaborative_notifications_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724140100_collaborative_notifications_rpc.sql","utf8");
const seed=readFileSync("supabase/migrations/20260724140200_collaborative_notifications_seed.sql","utf8");
const edge=readFileSync("supabase/functions/dispatch-collab-notifications/index.ts","utf8");
const edgeConfig=readFileSync("supabase/functions/dispatch-collab-notifications/config.toml","utf8");
const runtimeBuilder=readFileSync("scripts/notifications/build-runtime-config.mjs","utf8");
const preview=readFileSync("scripts/notifications/preview-templates.mjs","utf8");
const statusScript=readFileSync("scripts/notifications/dispatch-status.mjs","utf8");
const testPayload=readFileSync("scripts/notifications/generate-test-payload.mjs","utf8");
const build=readFileSync("scripts/build.mjs","utf8");
const smoke=readFileSync("scripts/smoke.mjs","utf8");

if(pkg.version!=="0.28.0")throw new Error("Versão 08H incorreta.");
if(model.version!=="0.28.0"||templates.version!=="0.28.0"||runtime.version!=="0.28.0")throw new Error("Contratos 08H desatualizados.");
if(model.eventTypes.length<20||new Set(model.eventTypes.map(item=>item.code)).size!==model.eventTypes.length)throw new Error("O modelo deve preservar os 20 eventos do 08H e manter códigos únicos.");
if(model.categories.length<10)throw new Error("Categorias base do 08H incompletas.");
if(model.preferenceRules.emailOptIn!==true||model.eventTypes.some(item=>item.defaultEmail!==false)){
  throw new Error("E-mail deve exigir opt-in explícito em todos os eventos ordinários.");
}
if(templates.templates.length<20||new Set(templates.templates.map(item=>item.eventType)).size!==templates.templates.length)throw new Error("Templates pt-PT acumulados incompletos.");
if(model.templateTokens.length!==11)throw new Error("Whitelist de tokens divergente.");
if(runtime.email.provider!=="disabled"||runtime.email.enabled!==false||runtime.email.automaticScheduleEnabled!==false)throw new Error("E-mail deve iniciar desativado.");
if(runtime.inApp.enabled!==true)throw new Error("Centro interno deve iniciar ativo.");
if(runtime.privacy.showRecipientEmailInAdmin!==false||runtime.privacy.storeProviderTokens!==false)throw new Error("Contrato de privacidade inválido.");

for(const event of model.eventTypes){
  if(!templates.templates.some(template=>template.eventType===event.code&&template.language==="pt-PT"&&template.status==="approved")){
    throw new Error(`Template pt-PT aprovado ausente: ${event.code}`);
  }
}
const tokenPattern=/\{\{([a-z_][a-z0-9_]*)\}\}/g;
for(const template of templates.templates){
  const used=[...`${template.subjectTemplate} ${template.titleTemplate} ${template.bodyTextTemplate}`.matchAll(tokenPattern)].map(match=>match[1]);
  const unknown=used.filter(token=>!model.templateTokens.includes(token));
  if(unknown.length)throw new Error(`Template usa tokens desconhecidos: ${template.eventType}`);
}

if(modules.length<19||modules.some(item=>item.status!=="active"))throw new Error("Os 19 módulos do 08H devem permanecer ativos.");
for(const code of ["notifications","notification-management"]){
  if(!modules.some(item=>item.code===code))throw new Error(`Módulo ausente: ${code}`);
}
for(const permission of [
  "notifications.view","notifications.mark","notifications.preferences",
  "notifications.manage","notifications.templates.manage",
  "notifications.outbox.view","notifications.outbox.manage",
  "notifications.test","notifications.audit.view",
  "notifications.invitation-email","notifications.channel.manage",
  "notifications.delivery.manage"
]){
  if(!roles.permissions.includes(permission))throw new Error(`Permissão ausente: ${permission}`);
  if(!roles.rolePermissions.coordinator.includes(permission))throw new Error(`Coordinator sem permissão: ${permission}`);
}
if(roles.rolePermissions.volunteer.includes("notifications.manage"))throw new Error("Voluntário não pode gerir notificações.");
if(!roles.rolePermissions.volunteer.includes("notifications.preferences"))throw new Error("Voluntário sem preferências.");
if(library.resources.length<17)throw new Error("A biblioteca deve preservar os 17 recursos do 08H.");

for(const value of ["notificationModel","notificationTemplates","notificationRuntime"]){
  if(!configLoader.includes(value))throw new Error(`Loader sem ${value}.`);
}
for(const value of [
  "emptyNotificationWorkspace","createDemoNotificationWorkspace",
  "loadRemoteNotifications","startNotificationPolling",
  "markNotification","markAllNotificationsRead","saveNotificationPreferences",
  "saveNotificationTemplate","updateNotificationChannel",
  "sendTestNotification","queueInvitationEmail",
  "retryNotificationOutbox","cancelNotificationOutbox"
]){
  if(!controller.includes(value))throw new Error(`Controller 08H incompleto: ${value}`);
}
if(!controller.includes("email_enabled:Boolean(item.defaultEmail)&&false"))throw new Error("Demo não deve ativar e-mail por padrão.");
if(!controller.includes("ACTIVATE_MILREU_TRANSACTIONAL_EMAIL"))throw new Error("Literal de ativação ausente no controller.");

for(const route of [
  "collab-notifications","collab-notification-preferences",
  "collab-notification-management","collab-notification-templates"
]){
  if(!router.includes(route))throw new Error(`Rota ausente: ${route}`);
}
for(const fn of [
  "collaborativeNotificationsView","collaborativeNotificationPreferencesView",
  "collaborativeNotificationManagementView"
]){
  if(!view.includes(fn))throw new Error(`View ausente: ${fn}`);
}
for(const marker of [
  "data-notification-action","data-notification-mark-all",
  "data-notification-preferences-form","data-notification-template-form",
  "data-notification-channel-form","data-notification-test-form",
  "data-notification-invitation-email","data-notification-outbox-retry",
  "data-notification-outbox-cancel"
]){
  if(!main.includes(marker))throw new Error(`Binding ausente: ${marker}`);
}
if(!layout.includes("collab-notification-bell")||!layout.includes("gestao/notificacoes"))throw new Error("Badge ou gestão ausente.");
for(const css of [".notification-card",".notification-preferences-table",".notification-outbox",".collab-notification-bell"]){
  if(!styles.includes(css))throw new Error(`CSS ausente: ${css}`);
}

for(const table of [
  "collab_notification_channels","collab_notification_event_types",
  "collab_notification_templates","collab_notification_preferences",
  "collab_notifications","collab_notification_outbox",
  "collab_notification_deliveries"
]){
  if(!foundation.includes(table))throw new Error(`Tabela ausente: ${table}`);
}
if((foundation.match(/enable row level security/g)||[]).length<7)throw new Error("RLS 08H incompleta.");
if(/grant\s+(insert|update|delete|all)[\s\S]{0,100}to\s+authenticated/i.test(foundation)){
  throw new Error("Escrita direta nas tabelas 08H não é permitida.");
}
if(foundation.includes("grant select on public.collab_notification_outbox to authenticated")
   ||foundation.includes("grant select on public.collab_notification_deliveries to authenticated")){
  throw new Error("Outbox ou deliveries expostas diretamente.");
}
if(!foundation.includes("create policy collab_notifications_read")
   ||!foundation.includes("create policy collab_notification_preferences_read")
   ||foundation.match(/create policy collab_notifications_read[\s\S]*?notifications\.manage/)
   ||foundation.match(/create policy collab_notification_preferences_read[\s\S]*?notifications\.manage/)){
  throw new Error("Inbox e preferências devem permanecer estritamente self-service.");
}
if(!foundation.includes("collab_notifications_dedupe_unique")||!foundation.includes("collab_notification_outbox_dedupe_unique")){
  throw new Error("Deduplicação incompleta.");
}

for(const fn of [
  "collab_create_notification_08h","collab_notify_permission_08h",
  "collab_mark_notification_08h","collab_mark_all_notifications_read_08h",
  "collab_update_notification_preference_08h",
  "collab_upsert_notification_template_08h",
  "collab_update_notification_channel_08h",
  "collab_send_test_notification_08h",
  "collab_queue_invitation_email_08h",
  "collab_notification_operations_08h",
  "collab_retry_notification_outbox_08h",
  "collab_cancel_notification_outbox_08h",
  "collab_claim_notification_outbox_08h",
  "collab_finish_notification_delivery_08h",
  "collab_cleanup_notifications_08h",
  "collab_queue_upcoming_agenda_notifications_08h"
]){
  if(!rpc.includes(fn))throw new Error(`RPC ausente: ${fn}`);
}
for(const gate of [
  "mandatory_in_app_cannot_be_disabled","invalid_timezone",
  "template_contains_unknown_tokens",
  "published_template_is_immutable","literal_email_activation_required",
  "email_channel_not_active","service_role_required",
  "approved_template_required","outbox_not_retryable"
]){
  if(!rpc.includes(gate))throw new Error(`Gate ausente: ${gate}`);
}
for(const trigger of [
  "collab_notify_membership_change_08h","collab_notify_task_assignment_08h",
  "collab_notify_contribution_assignment_08h","collab_notify_contribution_status_08h",
  "collab_notify_museum_assignment_08h","collab_notify_museum_blocking_comment_08h",
  "collab_notify_training_status_08h","collab_notify_agenda_change_08h",
  "collab_notify_exhibition_logistics_08h","collab_notify_withdrawal_08h",
  "collab_notify_homologation_blocked_08h"
]){
  if(!rpc.includes(`create trigger ${trigger}`))throw new Error(`Trigger ausente: ${trigger}`);
}
if(!rpc.includes("grant execute on function public.collab_claim_notification_outbox_08h(text,integer) to service_role")){
  throw new Error("Claim não está reservado ao service role.");
}
if(rpc.includes("grant execute on function public.collab_claim_notification_outbox_08h(text,integer) to authenticated")){
  throw new Error("Claim exposto ao browser.");
}
if(!seed.includes("'email','disabled','disabled'")||!seed.includes("'in-app','active','disabled'"))throw new Error("Canais iniciais divergentes.");
if(model.eventTypes.some(item=>item.defaultEmail)||!/default_email=excluded\.default_email/.test(seed)){
  throw new Error("Seed/modelo não preservam opt-in explícito.");
}
if(!rpc.includes("new.status='assigned'")||rpc.includes("new.status='invited'")){
  throw new Error("Evento de atribuição de tarefa usa estado inválido.");
}
if((seed.match(/\('[a-z-]+\.[a-z-]+'/g)||[]).length<20)throw new Error("Seed de eventos incompleto.");
if(!seed.includes("select 'master',code"))throw new Error("Permissões master ausentes.");

if(!edge.includes("MILREU_NOTIFICATION_WORKER_SECRET")||!edge.includes("x-milreu-worker-secret"))throw new Error("Worker sem segredo próprio.");
if(!edge.includes('PROVIDER==="disabled"')||!edge.includes('PROVIDER!=="webhook"'))throw new Error("Worker sem provider gate.");
if(!edge.includes("auth.admin.getUserById"))throw new Error("Worker não resolve e-mail no servidor.");
if(!edge.includes("escapeHtml")||!edge.includes("htmlFromText"))throw new Error("HTML seguro ausente.");
if(edge.includes("console.log(recipient")||edge.includes("console.log(providerPayload"))throw new Error("Worker pode expor destinatário ou payload.");
if(!edge.includes("responseExcerpt:null")||edge.includes("responseExcerpt:responseText")){
  throw new Error("Worker não deve reter o corpo de resposta do fornecedor.");
}
if(edgeConfig.trim()!=="verify_jwt = false")throw new Error("Config do worker divergente.");
if(!edge.includes("worker_authentication_required"))throw new Error("Worker público sem autenticação customizada.");

if(!runtimeBuilder.includes("MILREU_NOTIFICATION_PROVIDER")||!runtimeBuilder.includes("MILREU_NOTIFICATION_WORKER_SECRET"))throw new Error("Runtime builder incompleto.");
if(!runtimeBuilder.includes("não será gravada")||!runtimeBuilder.includes("ENABLE_MILREU_NOTIFICATION_SCHEDULE"))throw new Error("Proteção de secrets/agendamento ausente.");
if(!preview.includes("test@example.invalid")||!testPayload.includes("test@example.invalid"))throw new Error("Artefactos de teste não usam domínio reservado.");
if(!statusScript.includes("recipientDataExposed:false")||!statusScript.includes("payloadExposed:false"))throw new Error("Status remoto não declara minimização.");

const publicContracts=JSON.stringify({runtime,runtimeExample,model,templates});
for(const secret of [
  "MILREU_NOTIFICATION_WEBHOOK_TOKEN","MILREU_NOTIFICATION_WORKER_SECRET",
  "SUPABASE_SERVICE_ROLE_KEY"
]){
  if(publicContracts.includes(secret))throw new Error(`Nome de secret indevido no contrato público: ${secret}`);
}
if(/@[a-z0-9.-]+\.[a-z]{2,}/i.test(JSON.stringify(runtime)))throw new Error("Runtime público contém endereço real.");
if(!build.includes("notificationModelChecksum")||!build.includes("notificationTemplatesChecksum")||!build.includes("notificationRuntimeChecksum")){
  throw new Error("Checksums 08H ausentes.");
}
for(const asset of [
  "collaborative-notifications.js","collaborative-notification-model.json",
  "collaborative-notification-templates.json","notifications.runtime.json"
]){
  if(!smoke.includes(asset))throw new Error(`Smoke 08H incompleto: ${asset}`);
}
if(impact.currentPackage!=="08Q"||impact.version!=="0.28.0")throw new Error("Registo de impacto desatualizado.");
if(!readiness.functionalModules.includes("notifications")||!readiness.functionalModules.includes("notification-management")){
  throw new Error("Readiness sem módulos 08H.");
}
if(readiness.transactionalEmailEnabled!==false||readiness.notificationScheduleEnabled!==false){
  throw new Error("Readiness não preserva e-mail/agendamento desativados.");
}

for(const file of [
  "PROJECT_CONTEXT_LEDGER.md","PACKAGE_DEPENDENCY_MAP.md",
  "CHANGE_SURFACE_REGISTRY.md","CONTEXT_RECOVERY_PROTOCOL.md",
  "CONTEXT_ATE_08I.md",
  "docs/notifications/NOTIFICATION_ARCHITECTURE_08H.md",
  "docs/notifications/NOTIFICATION_OPERATIONS_RUNBOOK_08H.md",
  "docs/notifications/NOTIFICATION_PRIVACY_RETENTION_08H.md",
  "supabase/collab-tests/008h_notifications.test.sql"
]){
  if(!existsSync(file))throw new Error(`Ficheiro 08H obrigatório ausente: ${file}`);
}
console.log("Pacote 08H validado: centro interno, 20 eventos, templates, outbox privada, worker webhook e e-mail desativado.");
