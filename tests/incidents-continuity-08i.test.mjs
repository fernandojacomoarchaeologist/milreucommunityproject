/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const foundation=readFileSync("supabase/migrations/20260724150000_collaborative_operations_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724150100_collaborative_operations_rpc.sql","utf8");
test("incidentes possuem severidade, estado e ambiente controlados",()=>{for(const marker of["collab_incident_severity_check","collab_incident_status_check","collab_incident_environment_check"])assert.ok(foundation.includes(marker));});
test("abertura gera referência e notificação",()=>{const fn=rpc.match(/create or replace function public\.collab_create_incident_08i[\s\S]*?\n\$\$;/)?.[0]||"";assert.match(fn,/INC-/);assert.match(fn,/incident\.opened/);assert.match(fn,/collab_notify_permission_08h/);});
test("resolução exige permissão de fecho",()=>assert.match(rpc,/close_permission_required/));
test("exercício concluído exige resultado e evidência",()=>assert.match(rpc,/completed_exercise_requires_evidence/));
