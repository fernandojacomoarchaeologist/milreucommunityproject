/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const rpc=readFileSync("supabase/migrations/20260726100100_operations_governance_rpc_rls.sql","utf8");
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
test("submeter suporte usa sempre o próprio utilizador",()=>{assert.ok(/collab_support_submit[\s\S]*requested_by[\s\S]*auth.uid\(\)/.test(rpc));});
test("membros podem submeter suporte",()=>{assert.ok(roles.rolePermissions.volunteer.includes("support.submit"));});
test("moderação exige moderation.manage",()=>{assert.ok(/collab_moderation_upsert[\s\S]*moderation.manage/.test(rpc));assert.ok(!roles.rolePermissions.volunteer.includes("moderation.manage"));});
