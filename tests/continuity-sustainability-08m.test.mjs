/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const rd=JSON.parse(readFileSync("public/data/operations-readiness.json","utf8"));
const model=JSON.parse(readFileSync("public/data/operations-governance-model.json","utf8"));
const foundation=readFileSync("supabase/migrations/20260726100000_operations_governance_foundation.sql","utf8");
test("continuidade inicia bloqueada, sem responsáveis inventados",()=>{assert.equal(rd.continuity,"blocked");assert.equal(rd.assignedCriticalResponsibilities,0);});
test("estados de continuidade incluem risco",()=>{assert.ok(model.continuityStatuses.includes("at-risk"));});
test("tabela de continuidade regista risco de pessoa única",()=>{assert.ok(foundation.includes("single_person_risk boolean"));});
test("checklist de desativação existe",()=>{assert.ok(readFileSync("scripts/operations-governance/build-decommissioning-checklist.mjs","utf8").includes("read-only-and-safe-shutdown"));});
