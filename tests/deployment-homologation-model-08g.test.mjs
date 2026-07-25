/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const model=JSON.parse(readFileSync("public/data/collaborative-homologation-model.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
test("modelo possui três ambientes e 24 checks",()=>{assert.equal(model.environments.length,3);assert.equal(model.requiredChecks.length,24);assert.equal(new Set(model.requiredChecks.map(x=>x.code)).size,24);});
test("produção exige staging e confirmação literal",()=>{assert.equal(model.productionGates.stagingRunApproved,true);assert.equal(model.productionGates.manualLiteralConfirmation,"APPROVE_MILREU_PRODUCTION_RELEASE");});
test("módulo 08G está ativo",()=>{const module=modules.find(x=>x.code==="deployment-homologation");assert.equal(module?.status,"active");assert.equal(module?.permission,"homologation.view");});
test("voluntário não aprova homologação",()=>{assert.ok(!roles.rolePermissions.volunteer.includes("homologation.approve"));assert.ok(roles.rolePermissions.master.includes("*")||roles.rolePermissions.master.includes("homologation.approve"));});
