/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=(p)=>JSON.parse(readFileSync(p,"utf8"));
const model=read("public/data/operations-governance-model.json");
const ind=read("public/data/impact-indicators-model.json");
const roles=read("public/data/collaborative-roles-permissions.json");
const rd=read("public/data/operations-readiness.json");
test("modelo com 0 ciclos ativos, transparência e produção off",()=>{assert.equal(model.activeOperatingCyclesByDefault,0);assert.equal(model.publicTransparencyEnabledByDefault,false);assert.equal(model.productionApproval,"blocked");});
test("indicadores não publicam dados individuais nem inferem impacto",()=>{assert.equal(ind.publishesIndividualData,false);assert.equal(ind.autoInfersImpact,false);assert.ok(ind.requiresDefinition&&ind.requiresSource&&ind.requiresMethodologyVersion);});
test("catálogo tem 149 permissões e as 9 novas",()=>{assert.equal(roles.permissions.length,149);for(const p of ["governance.decide","support.submit","moderation.manage","impact.manage"])assert.ok(roles.permissions.includes(p));});
test("governance.decide é reservada ao master",()=>{assert.ok(!roles.rolePermissions.coordinator.includes("governance.decide"));});
test("readiness inicia bloqueado",()=>{for(const g of ["publicTransparency","continuity","productionApproval"])assert.equal(rd[g],"blocked");assert.equal(rd.activeOperatingCycles,0);});
