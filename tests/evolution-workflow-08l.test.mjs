/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const rpc=readFileSync("supabase/migrations/20260726090100_public_integration_rpc_and_rls.sql","utf8");
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
test("decidir evolução exige evolution.decide e fundamento",()=>{assert.ok(/collab_evolution_decide[\s\S]*evolution.decide/.test(rpc));assert.ok(rpc.includes("rationale_required"));});
test("evolution.decide não pertence à coordenação",()=>{assert.ok(!roles.rolePermissions.coordinator.includes("evolution.decide"));});
test("decisões válidas cobrem accept/reject/defer/plan",()=>{for(const d of ["accept","reject","defer","plan"])assert.ok(rpc.includes("'"+d+"'"));});
