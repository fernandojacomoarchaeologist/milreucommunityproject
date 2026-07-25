/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const rpc=readFileSync("supabase/migrations/20260724150100_collaborative_operations_rpc.sql","utf8");
const runtime=JSON.parse(readFileSync("public/config/operations.runtime.json","utf8"));
test("retenção exige preview, aprovação e literais",()=>{for(const marker of["collab_preview_retention_run_08i","collab_approve_retention_run_08i","APPROVE_MILREU_RETENTION_RUN","APPLY_MILREU_RETENTION_POLICY","APPLY_MILREU_PRODUCTION_RETENTION"])assert.ok(rpc.includes(marker));});
test("aplicação exige service role",()=>{assert.match(rpc,/service_role_required/);assert.match(rpc,/collab_apply_retention_run_08i\(uuid,text,text\) to service_role/);assert.doesNotMatch(rpc,/collab_apply_retention_run_08i\(uuid,text,text\) to authenticated/);});
test("candidatos e legal holds são revalidados",()=>{assert.match(rpc,/candidate_set_changed/);assert.match(rpc,/legal_hold_set_changed/);assert.match(rpc,/candidate_hash/);});
test("runtime bloqueia automação e browser",()=>{assert.equal(runtime.retention.automaticApply,false);assert.equal(runtime.retention.automaticScheduleEnabled,false);assert.equal(runtime.retention.applyFromBrowser,false);});
