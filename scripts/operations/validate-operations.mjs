/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync,readFileSync } from "node:fs";

const pkg=JSON.parse(readFileSync("package.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const notifications=JSON.parse(readFileSync("public/data/collaborative-notification-model.json","utf8"));
const templates=JSON.parse(readFileSync("public/data/collaborative-notification-templates.json","utf8"));
const model=JSON.parse(readFileSync("public/data/collaborative-operational-governance-model.json","utf8"));
const retention=JSON.parse(readFileSync("public/data/collaborative-retention-model.json","utf8"));
const runtime=JSON.parse(readFileSync("public/config/operations.runtime.json","utf8"));
const readiness=JSON.parse(readFileSync("public/data/collaborative-readiness.json","utf8"));
const impact=JSON.parse(readFileSync("public/data/package-impact-registry.json","utf8"));
const library=JSON.parse(readFileSync("public/data/collaborative-library.json","utf8"));

const config=readFileSync("src/collab/config.js","utf8");
const controller=readFileSync("src/collab/controller.js","utf8");
const router=readFileSync("src/lib/router.js","utf8");
const main=readFileSync("src/main.js","utf8");
const view=readFileSync("src/views/collaborative-operations.js","utf8");
const layout=readFileSync("src/components/collaborative-layout.js","utf8");
const styles=readFileSync("src/styles/app.css","utf8");
const foundation=readFileSync("supabase/migrations/20260724150000_collaborative_operations_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724150100_collaborative_operations_rpc.sql","utf8");
const seed=readFileSync("supabase/migrations/20260724150200_collaborative_operations_seed.sql","utf8");
const edge=readFileSync("supabase/functions/export-collab-audit/index.ts","utf8");
const edgeConfig=readFileSync("supabase/functions/export-collab-audit/config.toml","utf8");
const runtimeBuilder=readFileSync("scripts/operations/build-runtime-config.mjs","utf8");
const reportScript=readFileSync("scripts/operations/generate-operations-report.mjs","utf8");
const auditStatus=readFileSync("scripts/operations/audit-integrity-status.mjs","utf8");
const backupEvidence=readFileSync("scripts/operations/generate-backup-evidence-template.mjs","utf8");
const retentionPlan=readFileSync("scripts/operations/generate-retention-plan.mjs","utf8");
const build=readFileSync("scripts/build.mjs","utf8");
const smoke=readFileSync("scripts/smoke.mjs","utf8");

if(pkg.version!=="0.29.0")throw new Error("Versão 08I incorreta.");
for(const item of [model,retention,runtime,readiness,impact]){
  if(item.version!=="0.29.0")throw new Error("Contrato 08I desatualizado.");
}
if(impact.currentPackage!=="09A")throw new Error("Registo de impacto não aponta para 09A.");

if(modules.length!==25||modules.some(item=>item.status!=="active"))throw new Error("08I deve manter 22 módulos ativos.");
for(const code of ["system-administration","audit-governance","incident-continuity"]){
  if(!modules.some(item=>item.code===code))throw new Error(`Módulo 08I ausente: ${code}`);
}
if(roles.permissions.length!==149)throw new Error("O catálogo acumulado deve conter 117 permissões.");
for(const permission of [
  "operations.view","operations.manage","operations.settings.manage",
  "health.view","health.run","health.check",
  "audit.search","audit.export","audit.integrity",
  "retention.view","retention.manage","retention.approve","legal-holds.manage",
  "incidents.view","incidents.manage","incidents.assign","incidents.close",
  "backups.view","backups.manage","backups.verify",
  "continuity.view","continuity.manage","operations.audit.view"
]){
  if(!roles.permissions.includes(permission))throw new Error(`Permissão ausente: ${permission}`);
  if(!roles.rolePermissions.coordinator.includes(permission))throw new Error(`Coordinator sem permissão: ${permission}`);
}
for(const role of ["volunteer","translator","partner","observer"]){
  if(roles.rolePermissions[role].some(permission=>[
    "audit.search","audit.export","retention.view","retention.manage",
    "incidents.view","backups.view","continuity.view","operations.view"
  ].includes(permission)))throw new Error(`${role} recebeu permissão operacional indevida.`);
}
if(library.resources.length!==22)throw new Error("Biblioteca 08I deve conter 22 recursos.");

if(model.modules.length!==3||model.operationalChecks.length!==20)throw new Error("Modelo operacional incompleto.");
if(retention.policies.length!==7)throw new Error("Modelo deve conter sete políticas.");
if(retention.rules.automaticScheduleEnabled!==false
   ||retention.rules.serviceRoleApplyOnly!==true
   ||retention.rules.legalHoldPreventsApply!==true
   ||retention.rules.communityDataNeverAutoDeleted!==true){
  throw new Error("Gates de retenção divergentes.");
}
if(model.safety.secretsInSettings!==false
   ||model.safety.automaticRetention!==false
   ||model.safety.productionMutationsFromBrowser!==false
   ||model.safety.auditUpdateDelete!==false){
  throw new Error("Fronteiras de segurança 08I divergentes.");
}
if(runtime.retention.automaticApply!==false
   ||runtime.retention.automaticScheduleEnabled!==false
   ||runtime.retention.applyFromBrowser!==false){
  throw new Error("Runtime não pode habilitar retenção automática.");
}
if(runtime.backup.provider!=="unconfigured"||runtime.backup.managedBackupConfirmed!==false){
  throw new Error("Runtime não pode afirmar backup remoto.");
}
if(runtime.audit.directTableAccess!==false||runtime.audit.maxExportRows!==5000){
  throw new Error("Contrato de auditoria runtime inválido.");
}

if(notifications.eventTypes.length!==25||templates.templates.length!==25){
  throw new Error("08I deve acumular 25 eventos e 25 templates.");
}
for(const code of [
  "incident.opened","incident.assigned","incident.resolved",
  "backup.verification-failed","retention.run-approved"
]){
  const event=notifications.eventTypes.find(item=>item.code===code);
  if(!event||!event.mandatoryInApp||event.defaultEmail!==false)throw new Error(`Evento 08I inválido: ${code}`);
  if(!templates.templates.some(item=>item.eventType===code&&item.language==="pt-PT"&&item.status==="approved")){
    throw new Error(`Template 08I ausente: ${code}`);
  }
}

for(const marker of ["operationalGovernanceModel","retentionModel","operationsRuntime"]){
  if(!config.includes(marker))throw new Error(`Loader sem ${marker}.`);
}
for(const marker of [
  "emptyOperationalWorkspace","createDemoOperationalWorkspace",
  "loadRemoteOperations","startOperationsPolling","stopOperationsPolling",
  "saveOperationalSetting","startOperationalRun","recordOperationalResult",
  "completeOperationalRun","searchAudit","verifyAuditIntegrity","exportAudit",
  "saveRetentionPolicy","createLegalHold","releaseLegalHold",
  "previewRetention","approveRetention","cancelRetention",
  "createIncident","updateIncident","addIncidentUpdate","saveIncidentAction",
  "saveBackupPlan","recordBackupVerification","saveContinuityExercise"
]){
  if(!controller.includes(marker))throw new Error(`Controller 08I incompleto: ${marker}`);
}
if(!controller.includes("Math.max(60"))throw new Error("Polling operacional demasiado frequente.");
if(!controller.includes("APPROVE_MILREU_RETENTION_RUN"))throw new Error("Literal de aprovação ausente.");
if(controller.includes("collab_apply_retention_run_08i"))throw new Error("O browser não deve chamar a aplicação da retenção.");

for(const route of [
  "collab-system-administration","collab-audit-governance",
  "collab-incidents-continuity","collab-incident-detail"
]){
  if(!router.includes(route))throw new Error(`Rota 08I ausente: ${route}`);
}
for(const fn of [
  "collaborativeSystemAdministrationView","collaborativeAuditGovernanceView",
  "collaborativeIncidentsContinuityView","collaborativeIncidentDetailView"
]){
  if(!view.includes(fn))throw new Error(`View 08I ausente: ${fn}`);
}
for(const binding of [
  "data-operation-run-start-form","data-operation-result-form",
  "data-operation-setting-form","data-backup-plan-form",
  "data-backup-verification-form","data-audit-search-form",
  "data-audit-integrity","data-audit-export","data-retention-preview-form",
  "data-retention-approve","data-legal-hold-form",
  "data-incident-create-form","data-incident-update-form",
  "data-incident-action-form","data-continuity-exercise-form"
]){
  if(!main.includes(binding))throw new Error(`Binding ausente: ${binding}`);
}
for(const link of [
  "Administração do sistema","Auditoria e retenção","Incidentes e continuidade"
]){
  if(!layout.includes(link))throw new Error(`Navegação ausente: ${link}`);
}
for(const css of [
  ".operations-summary",".audit-table",".retention-policy",
  ".incident-card",".backup-plan",".continuity-exercise"
]){
  if(!styles.includes(css))throw new Error(`CSS 08I ausente: ${css}`);
}

for(const table of [
  "collab_operational_settings","collab_retention_policies",
  "collab_legal_holds","collab_lifecycle_runs",
  "collab_incidents","collab_incident_updates","collab_incident_actions",
  "collab_backup_plans","collab_backup_verifications",
  "collab_continuity_exercises","collab_operational_check_catalog",
  "collab_operational_runs","collab_operational_results"
]){
  if(!foundation.includes(`create table if not exists public.${table}`))throw new Error(`Tabela 08I ausente: ${table}`);
}
if((foundation.match(/enable row level security/g)||[]).length<13)throw new Error("RLS 08I incompleta.");
if(/grant\s+(insert|update|delete|all)[\s\S]{0,100}to\s+authenticated/i.test(foundation)){
  throw new Error("Escrita direta autenticada não é permitida nas tabelas 08I.");
}
if(!foundation.includes("revoke select on public.collab_audit_log from authenticated")){
  throw new Error("Acesso direto à auditoria não foi revogado.");
}
for(const marker of [
  "collab_redact_json_08i","collab_audit_hash_before_insert_08i",
  "collab_audit_immutable_08i","audit_log_is_immutable",
  "previous_hash","event_hash","redaction_version"
]){
  if(!foundation.includes(marker))throw new Error(`Fundação de auditoria incompleta: ${marker}`);
}
if(foundation.includes("lag(audit_row.project_id)"))throw new Error("Backfill contém window inválida em PL/pgSQL.");
if(!foundation.includes("collab_operational_settings_no_secrets_check"))throw new Error("Settings sem gate de secrets.");

for(const fn of [
  "collab_search_audit_08i","collab_verify_audit_chain_08i",
  "collab_operations_workspace_08i","collab_upsert_operational_setting_08i",
  "collab_start_operational_run_08i","collab_record_operational_result_08i",
  "collab_complete_operational_run_08i","collab_upsert_retention_policy_08i",
  "collab_create_legal_hold_08i","collab_release_legal_hold_08i",
  "collab_preview_retention_run_08i","collab_approve_retention_run_08i",
  "collab_cancel_retention_run_08i","collab_apply_retention_run_08i",
  "collab_create_incident_08i","collab_update_incident_08i",
  "collab_add_incident_update_08i","collab_upsert_incident_action_08i",
  "collab_upsert_backup_plan_08i","collab_record_backup_verification_08i",
  "collab_upsert_continuity_exercise_08i"
]){
  if(!rpc.includes(fn))throw new Error(`RPC 08I ausente: ${fn}`);
}
for(const gate of [
  "sensitive_setting_not_allowed","automatic_retention_not_supported",
  "literal_retention_approval_required","service_role_required",
  "literal_retention_apply_required","literal_production_retention_required",
  "candidate_set_changed","legal_hold_set_changed",
  "backup_evidence_required","completed_exercise_requires_evidence"
]){
  if(!rpc.includes(gate))throw new Error(`Gate 08I ausente: ${gate}`);
}
if(!rpc.includes("then 5000 else 200"))throw new Error("Exportação não possui limite diferenciado.");
if(!rpc.includes("id<p_from_id"))throw new Error("Integridade parcial não recupera predecessor.");
if(!rpc.includes("grant execute on function public.collab_apply_retention_run_08i(uuid,text,text) to service_role")){
  throw new Error("Aplicação de retenção não está reservada ao service role.");
}
if(rpc.includes("grant execute on function public.collab_apply_retention_run_08i(uuid,text,text) to authenticated")){
  throw new Error("Aplicação de retenção exposta ao browser.");
}
if(!rpc.includes("APPROVE_MILREU_RETENTION_RUN")
   ||!rpc.includes("APPLY_MILREU_RETENTION_POLICY")
   ||!rpc.includes("APPLY_MILREU_PRODUCTION_RETENTION")){
  throw new Error("Literais de retenção incompletos.");
}

if(!seed.includes("'system-administration'")
   ||!seed.includes("'audit-governance'")
   ||!seed.includes("'incident-continuity'")){
  throw new Error("Seed de módulos 08I incompleto.");
}
if(!seed.includes("'backup-provider-state'")||!seed.includes("'unconfigured'")){
  throw new Error("Seed não preserva backup não configurado.");
}
if(seed.includes("'retention-auto-apply','retention','{\"enabled\":true"))throw new Error("Seed habilita retenção automática.");
if((seed.match(/\('(?:incident\.|backup\.|retention\.)/g)||[]).length<5)throw new Error("Seed de eventos 08I incompleto.");

if(!edge.includes("collab_search_audit_08i")||!edge.includes("MAX_ROWS"))throw new Error("Edge Function de auditoria incompleta.");
if(edge.includes("SUPABASE_SERVICE_ROLE_KEY")||edge.includes("service_role"))throw new Error("Exportação não deve usar service role.");
if(!edge.includes("Cache-Control")||!edge.includes("no-store"))throw new Error("Exportação sem proteção de cache.");
if(edge.includes("before_data")||edge.includes("after_data")||edge.includes("email"))throw new Error("Exportação pode revelar campos proibidos.");
if(edgeConfig.trim()!=="verify_jwt = true")throw new Error("Exportação deve exigir JWT.");

if(!runtimeBuilder.includes("MILREU_RETENTION_AUTOMATIC_APPLY")
   ||!runtimeBuilder.includes("MILREU_RETENTION_AUTOMATIC_SCHEDULE")
   ||!runtimeBuilder.includes("não será gravada")){
  throw new Error("Runtime builder sem gates de retenção/secrets.");
}
if(!reportScript.includes("Não constitui evidência de backup"))throw new Error("Relatório pode afirmar backup indevidamente.");
if(!auditStatus.includes("userJwtExposed:false")||!auditStatus.includes("personalDataExposed:false")){
  throw new Error("Script de integridade não declara minimização.");
}
if(!backupEvidence.includes("private://replace-with-reference"))throw new Error("Template de backup sem referência privada.");
if(!retentionPlan.includes("não executa qualquer eliminação"))throw new Error("Plano de retenção sem aviso de não execução.");

for(const checksum of [
  "operationalGovernanceChecksum","retentionModelChecksum","operationsRuntimeChecksum"
]){
  if(!build.includes(checksum))throw new Error(`Checksum 08I ausente: ${checksum}`);
}
for(const asset of [
  "collaborative-operations.js","collaborative-operational-governance-model.json",
  "collaborative-retention-model.json","operations.runtime.json"
]){
  if(!smoke.includes(asset))throw new Error(`Smoke 08I incompleto: ${asset}`);
}

if(readiness.operationalGovernanceReady!==true
   ||readiness.remoteOperationsValidated!==false
   ||readiness.retentionAutomaticApply!==false
   ||readiness.backupRemoteConfirmed!==false
   ||readiness.restoreTestConfirmed!==false){
  throw new Error("Readiness 08I não preserva as limitações reais.");
}
for(const surface of [
  "system-administration","audit-integrity",
  "retention-lifecycle","incident-continuity"
]){
  if(!impact.surfaces.some(item=>item.code===surface))throw new Error(`Superfície 08I ausente: ${surface}`);
}

for(const file of [
  "PROJECT_CONTEXT_LEDGER.md","PACKAGE_DEPENDENCY_MAP.md",
  "CHANGE_SURFACE_REGISTRY.md","CONTEXT_RECOVERY_PROTOCOL.md",
  "CONTEXT_ATE_08I.md","supabase/README_08I.md",
  "docs/operations/OPERATIONAL_GOVERNANCE_08I.md",
  "docs/operations/AUDIT_INTEGRITY_08I.md",
  "docs/operations/RETENTION_LIFECYCLE_08I.md",
  "docs/operations/BACKUP_RESTORE_RUNBOOK_08I.md",
  "docs/operations/INCIDENT_RESPONSE_08I.md",
  "supabase/collab-tests/008i_operations_governance.test.sql"
]){
  if(!existsSync(file))throw new Error(`Ficheiro 08I obrigatório ausente: ${file}`);
}

console.log("Pacote 08I validado: 22 módulos, auditoria redigida e íntegra, retenção protegida, incidentes, backups e continuidade.");
