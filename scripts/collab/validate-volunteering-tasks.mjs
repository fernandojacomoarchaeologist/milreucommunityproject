/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync,readFileSync } from "node:fs";
const pkg=JSON.parse(readFileSync("package.json","utf8"));
const model=JSON.parse(readFileSync("public/data/collaborative-task-model.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const router=readFileSync("src/lib/router.js","utf8");
const controller=readFileSync("src/collab/controller.js","utf8");
const views=readFileSync("src/views/collaborative-tasks.js","utf8");
const main=readFileSync("src/main.js","utf8");
const css=readFileSync("src/styles/app.css","utf8");
const build=readFileSync("scripts/build.mjs","utf8");
const migration=readFileSync("supabase/migrations/20260724080000_collaborative_volunteering_tasks.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724080100_collaborative_volunteering_tasks_rpc.sql","utf8");

if(pkg.version!=="0.15.0")throw new Error("Versão 08C incorreta.");
if(model.version!=="0.15.0"||model.categories.length<12)throw new Error("Modelo de tarefas incompleto.");
for(const code of ["availability","tasks","task-management"]){const module=modules.find(item=>item.code===code);if(!module||module.status!=="active")throw new Error(`Módulo ativo ausente: ${code}`);}
for(const permission of ["availability.self.manage","tasks.apply","tasks.progress","tasks.time-log","tasks.assign","tasks.verify","tasks.cancel","tasks.audit.view"]){if(!roles.permissions.includes(permission))throw new Error(`Permissão ausente: ${permission}`);}
for(const route of ["collab-task-detail","collab-availability","collab-task-management","collab-task-new","collab-task-edit","collab-task-manage-detail"]){if(!router.includes(route))throw new Error(`Rota ausente: ${route}`);}
for(const method of ["saveAvailability(values)","createTask(payload)","updateTask(taskId,payload)","joinTask(taskId,note", "inviteTaskMember(taskId,userId", "respondTaskInvitation(taskId,accept", "reviewTaskApplication(taskId,userId", "startTask(taskId)","submitTask(taskId,note", "verifyTask(taskId,userId", "withdrawTask(taskId,note", "logTaskTime(taskId"]){if(!controller.includes(method))throw new Error(`Método ausente: ${method}`);}
if(!controller.includes('kind==="volunteer"')||!controller.includes("createDemoTaskWorkspace"))throw new Error("Demonstração de voluntário ausente.");
for(const view of ["collaborativeTasksView","collaborativeTaskDetailView","collaborativeAvailabilityView","collaborativeTaskManagementView","collaborativeTaskEditorView"]){if(!views.includes(view))throw new Error(`View ausente: ${view}`);}
for(const binding of ["data-task-join-form","data-availability-form","data-task-editor-form","data-task-review-application","data-task-verify"]){if(!main.includes(binding))throw new Error(`Binding ausente: ${binding}`);}
for(const cls of [".task-grid",".task-detail",".availability-form",".task-management-metrics",".task-editor"]){if(!css.includes(cls))throw new Error(`Estilo ausente: ${cls}`);}
for(const table of ["collab_task_categories","collab_task_required_skills","collab_volunteer_preferences","collab_member_availability","collab_task_time_entries","collab_task_updates"]){if(!migration.includes(table))throw new Error(`Tabela ausente: ${table}`);}
for(const fn of ["collab_create_task_08c","collab_update_task_08c","collab_join_task_08c","collab_invite_task_member_08c","collab_respond_task_invitation_08c","collab_review_task_application_08c","collab_submit_task_08c","collab_verify_task_08c","collab_set_my_availability_08c"]){if(!rpc.includes(fn))throw new Error(`RPC ausente: ${fn}`);}
if(!migration.includes("revoke insert,update,delete on public.collab_tasks from authenticated"))throw new Error("Escritas diretas em tarefas não foram revogadas.");
if((migration.match(/enable row level security/g)||[]).length<6)throw new Error("RLS 08C insuficiente.");
if(!build.includes("taskModelChecksum"))throw new Error("Checksum do modelo de tarefas ausente.");
for(const file of ["supabase/migrations/20260724080000_collaborative_volunteering_tasks.sql","supabase/migrations/20260724080100_collaborative_volunteering_tasks_rpc.sql","supabase/collab-tests/008c_volunteering_tasks.test.sql"]){if(!existsSync(file))throw new Error(`Ficheiro ausente: ${file}`);}
console.log("Pacote 08C validado: disponibilidade, tarefas, candidaturas, progresso, tempo e gestão operacional.");
