/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const foundation=readFileSync("supabase/migrations/20260723080000_collaborative_foundation.sql","utf8");
const rls=readFileSync("supabase/migrations/20260723080200_collaborative_rls_and_rpc.sql","utf8");
const admin=readFileSync("supabase/migrations/20260723080300_collaborative_context_and_admin.sql","utf8");
const modules=readFileSync("supabase/migrations/20260723080400_collaborative_tasks_exhibitions.sql","utf8");

test("tabelas de identidade, perfil e acesso",()=>{
  for(const table of [
    "collab_profiles","collab_project_memberships","collab_roles",
    "collab_permissions","collab_member_roles","collab_access_requests","collab_audit_log"
  ]) assert.match(foundation,new RegExp(table));
});

test("RLS e auth.uid",()=>{
  assert.ok((foundation.match(/enable row level security/g)||[]).length>=10);
  assert.match(rls,/auth\.uid\(\)/);
  assert.match(rls,/collab_has_permission/);
  assert.match(rls,/collab_submit_access_request/);
});

test("master não é hardcoded",()=>{
  assert.match(admin,/collab_bootstrap_master_by_email/);
  assert.match(admin,/grant execute .* to service_role/);
  assert.doesNotMatch(admin,/@gmail\.com|@googlemail\.com/);
});

test("tarefas e exposição itinerante têm fundação",()=>{
  assert.match(modules,/collab_tasks/);
  assert.match(modules,/collab_venues/);
  assert.match(modules,/collab_exhibitions/);
  assert.match(modules,/collab_exhibition_schedule/);
  assert.match(modules,/exhibition_type in \('fixed','itinerant','temporary','digital'\)/);
});
