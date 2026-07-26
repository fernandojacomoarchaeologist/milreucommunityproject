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
test("decidir exige governance.decide e fundamento",()=>{assert.ok(/collab_governance_decide[\s\S]*governance.decide/.test(rpc));assert.ok(rpc.includes("rationale_required"));});
test("governance.decide não pertence à coordenação",()=>{assert.ok(!roles.rolePermissions.coordinator.includes("governance.decide"));});
