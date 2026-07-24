/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const controller=readFileSync("src/collab/controller.js","utf8");
test("workspace de tarefas é carregado",()=>{assert.match(controller,/emptyTaskWorkspace/);assert.match(controller,/loadRemoteTasks\(\)/);for(const table of ["collab_tasks","collab_task_assignments","collab_task_required_skills","collab_volunteer_preferences","collab_member_availability","collab_task_time_entries","collab_task_updates"]){assert.ok(controller.includes(table),table);}});
test("ações remotas utilizam RPC auditada",()=>{for(const fn of ["collab_create_task_08c","collab_update_task_08c","collab_publish_task_08c","collab_join_task_08c","collab_invite_task_member_08c","collab_respond_task_invitation_08c","collab_review_task_application_08c","collab_start_task_08c","collab_submit_task_08c","collab_verify_task_08c","collab_withdraw_task_08c","collab_log_task_time_08c","collab_set_my_availability_08c"]){assert.ok(controller.includes(fn),fn);}});
test("demo usa dados fictícios e relativos",()=>{assert.match(controller,/demo-volunteer/);assert.match(controller,/@local\.invalid/);assert.match(controller,/daysFromNow/);assert.doesNotMatch(controller,/@gmail\.com|@googlemail\.com/);});
