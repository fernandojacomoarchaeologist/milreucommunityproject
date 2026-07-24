/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const migration=readFileSync("supabase/migrations/20260724080000_collaborative_volunteering_tasks.sql","utf8"),rpc=readFileSync("supabase/migrations/20260724080100_collaborative_volunteering_tasks_rpc.sql","utf8");
test("modelo de dados de voluntariado",()=>{for(const table of ["collab_task_categories","collab_task_required_skills","collab_volunteer_preferences","collab_member_availability","collab_task_time_entries","collab_task_updates"]){assert.match(migration,new RegExp(table));}assert.match(migration,/assignment_mode in \('open','approval','direct'\)/);assert.match(migration,/status in \('invited','applied','accepted','declined','in-progress','submitted','completed','withdrawn','cancelled'\)/);});
test("RLS e escrita por RPC",()=>{assert.ok((migration.match(/enable row level security/g)||[]).length>=6);assert.match(migration,/revoke insert,update,delete on public\.collab_tasks from authenticated/);assert.match(migration,/public\.collab_has_permission\('tasks\.manage'/);assert.match(migration,/user_id=auth\.uid\(\)/);});
test("transições críticas são transacionais",()=>{for(const fn of ["collab_join_task_08c","collab_review_task_application_08c","collab_respond_task_invitation_08c","collab_submit_task_08c","collab_verify_task_08c","collab_set_my_availability_08c"]){assert.match(rpc,new RegExp(`create or replace function public\\.${fn}`));}assert.match(rpc,/task_capacity_reached/);assert.match(rpc,/application_closed/);assert.match(rpc,/perform public\.collab_record_audit/);});
test("registo de tempo não é pontuação automática",()=>{assert.match(migration,/status text not null default 'pending'/);assert.match(rpc,/then 'approved' else 'rejected'/);});
