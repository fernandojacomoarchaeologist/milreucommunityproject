/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync,readFileSync } from "node:fs";

const pkg=JSON.parse(readFileSync("package.json","utf8"));
const model=JSON.parse(readFileSync("public/data/collaborative-exhibition-model.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const snapshot=JSON.parse(readFileSync("public/data/exhibitions-public.json","utf8"));
const router=readFileSync("src/lib/router.js","utf8");
const controller=readFileSync("src/collab/controller.js","utf8");
const views=readFileSync("src/views/collaborative-exhibitions.js","utf8");
const publicViews=readFileSync("src/views/exhibitions-public.js","utf8");
const main=readFileSync("src/main.js","utf8");
const css=readFileSync("src/styles/app.css","utf8");
const build=readFileSync("scripts/build.mjs","utf8");
const exporter=readFileSync("scripts/exhibitions/export-public.mjs","utf8");
const migration=readFileSync("supabase/migrations/20260724100000_collaborative_agenda_exhibitions.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724100100_collaborative_agenda_exhibitions_rpc.sql","utf8");
const seed=readFileSync("supabase/migrations/20260724100200_collaborative_agenda_exhibitions_seed.sql","utf8");

if(pkg.version!=="0.34.0")throw new Error("Versão 08D incorreta.");
if(model.version!=="0.34.0")throw new Error("Modelo de exposições desatualizado.");
for(const collection of ["exhibitionTypes","exhibitionStatuses","venueTypes","scheduleStatuses","eventTypes","visibilityOptions","rsvpStatuses","checklistCategories"]){
  if(!Array.isArray(model[collection])||!model[collection].length)throw new Error(`Catálogo ausente: ${collection}`);
}

for(const code of ["agenda","exhibition-management","venue-management"]){
  const module=modules.find(item=>item.code===code);
  if(!module||module.status!=="active")throw new Error(`Módulo 08D não ativo: ${code}`);
}

for(const permission of [
  "agenda.rsvp","agenda.manage","venues.manage","exhibitions.view-internal",
  "exhibitions.publish","exhibitions.logistics","exhibitions.audit.view"
]){
  if(!roles.permissions.includes(permission))throw new Error(`Permissão 08D ausente: ${permission}`);
}

for(const route of [
  "public-exhibitions","collab-venue-management","collab-venue-new","collab-venue-edit",
  "collab-exhibition-new","collab-exhibition-detail","collab-exhibition-edit",
  "collab-schedule-new","collab-schedule-detail","collab-agenda-event-new","collab-agenda-event-edit"
]){
  if(!router.includes(route))throw new Error(`Rota 08D ausente: ${route}`);
}

for(const method of [
  "saveVenue(venueId,payload)","saveExhibition(exhibitionId,payload)",
  "checkScheduleConflicts(scheduleId,payload)","saveSchedule(scheduleId,payload)",
  "saveAgendaEvent(eventId,payload)","rsvpEvent(eventId,status",
  "saveChecklistItem(itemId,scheduleId,payload)","publishSchedule(scheduleId,publish)",
  "generateLogisticsTasks(scheduleId)"
]){
  if(!controller.includes(method))throw new Error(`Método 08D ausente: ${method}`);
}

if(!controller.includes("createDemoExhibitionWorkspace"))throw new Error("Demonstração 08D ausente.");

for(const view of [
  "collaborativeAgendaView","collaborativeExhibitionManagementView",
  "collaborativeVenueManagementView","collaborativeVenueEditorView",
  "collaborativeExhibitionEditorView","collaborativeExhibitionDetailView",
  "collaborativeScheduleEditorView","collaborativeScheduleDetailView",
  "collaborativeAgendaEventEditorView"
]){
  if(!views.includes(view))throw new Error(`View 08D ausente: ${view}`);
}

for(const binding of [
  "data-venue-form","data-exhibition-form","data-schedule-form",
  "data-agenda-event-form","data-agenda-rsvp","data-checklist-form",
  "data-schedule-publish","data-schedule-generate-tasks"
]){
  if(!main.includes(binding))throw new Error(`Binding 08D ausente: ${binding}`);
}

if(!publicViews.includes("publicExhibitionsView")||!publicViews.includes("O próximo local ainda não foi publicado")){
  throw new Error("Página pública da itinerância ausente.");
}

for(const cls of [
  ".agenda-calendar",".agenda-event-card",".exhibition-stop-card",
  ".venue-grid",".exhibition-summary-grid",".public-exhibition-stop"
]){
  if(!css.includes(cls))throw new Error(`Estilo 08D ausente: ${cls}`);
}

for(const table of [
  "collab_agenda_events","collab_event_participants",
  "collab_exhibition_logistics_checklist"
]){
  if(!migration.includes(table))throw new Error(`Tabela 08D ausente: ${table}`);
}

for(const feature of [
  "collab_exhibition_schedule_no_overlap","enable row level security",
  "public_visibility","installation_status","logistics_status",
  "source_entity_type","btree_gist"
]){
  if(!migration.includes(feature))throw new Error(`Fundação SQL ausente: ${feature}`);
}


if(rpc.includes("'status',schedule.status\n        'status'")){
  throw new Error("SQL malformado na construção de conflitos.");
}
for(const guard of [
  "venue_project_mismatch","exhibition_project_mismatch","schedule_project_mismatch",
  "event_project_mismatch","checklist_project_mismatch"
]){
  if(!rpc.includes(guard))throw new Error(`Proteção entre projetos ausente: ${guard}`);
}
if(!rpc.includes("for update;"))throw new Error("RSVP sem serialização de capacidade.");
if(!rpc.includes("invalid_conflict_request")||!rpc.includes("collab_has_permission('agenda.view'")){
  throw new Error("Consulta de conflitos sem validação de permissão.");
}

for(const fn of [
  "collab_upsert_venue_08d","collab_upsert_exhibition_08d",
  "collab_schedule_conflicts_08d","collab_upsert_schedule_08d",
  "collab_publish_schedule_08d","collab_upsert_agenda_event_08d",
  "collab_rsvp_event_08d","collab_upsert_checklist_item_08d",
  "collab_generate_logistics_tasks_08d","collab_public_exhibition_snapshot_08d"
]){
  if(!rpc.includes(fn))throw new Error(`RPC 08D ausente: ${fn}`);
}

if(!seed.includes("venue-management")||!seed.includes("exhibitions.publish")){
  throw new Error("Seed de módulos/permissões 08D incompleto.");
}

if(!exporter.includes("MILREU_SUPABASE_PUBLISHABLE_KEY")||!exporter.includes("SUPABASE_SERVICE_ROLE_KEY foi ignorada")){
  throw new Error("Exportador público não protege credenciais.");
}
if(exporter.includes("Authorization:`Bearer ${key}`")){
  throw new Error("A chave publicável não deve ser enviada como JWT no cabeçalho Authorization.");
}
if(exporter.includes("service_role")&&exporter.includes("Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}")){
  throw new Error("Exportador não pode usar service role.");
}

for(const field of ["current","upcoming","past","events"]){
  if(!Array.isArray(snapshot[field]))throw new Error(`Snapshot público inválido: ${field}`);
}
const serialized=JSON.stringify(snapshot);
for(const privateField of ["internal_notes","transport_notes","condition_report_before","condition_report_after","contact_email"]){
  if(serialized.includes(`"${privateField}"`))throw new Error(`Campo interno no snapshot: ${privateField}`);
}

if(!build.includes("exhibitionModelChecksum")||!build.includes("publicExhibitionsChecksum")){
  throw new Error("Checksums 08D ausentes no build.");
}

for(const file of [
  "supabase/migrations/20260724100000_collaborative_agenda_exhibitions.sql",
  "supabase/migrations/20260724100100_collaborative_agenda_exhibitions_rpc.sql",
  "supabase/migrations/20260724100200_collaborative_agenda_exhibitions_seed.sql",
  "supabase/collab-tests/008d_agenda_exhibitions.test.sql"
]){
  if(!existsSync(file))throw new Error(`Ficheiro 08D ausente: ${file}`);
}

console.log("Pacote 08D validado: agenda, locais, itinerância, publicação, logística e integração com tarefas.");
