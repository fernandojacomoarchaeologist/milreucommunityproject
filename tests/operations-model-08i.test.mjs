/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const model=JSON.parse(readFileSync("public/data/collaborative-operational-governance-model.json","utf8"));
const retention=JSON.parse(readFileSync("public/data/collaborative-retention-model.json","utf8"));
test("modelo operacional possui três módulos e vinte checks",()=>{assert.equal(model.modules.length,3);assert.equal(model.operationalChecks.length,20);assert.equal(new Set(model.operationalChecks.map(x=>x.code)).size,20);});
test("retenção possui sete políticas sem automação",()=>{assert.equal(retention.policies.length,7);assert.ok(retention.policies.every(x=>x.automaticAllowed===false));assert.equal(retention.rules.automaticScheduleEnabled,false);});
test("dados comunitários e auditoria exigem revisão humana",()=>{for(const code of["audit-log","incidents","community-contributions"]){const policy=retention.policies.find(x=>x.code===code);assert.ok(policy,code);assert.notEqual(policy.action,"delete");}});
test("segurança impede secrets e mutação de produção no browser",()=>{assert.equal(model.safety.secretsInSettings,false);assert.equal(model.safety.productionMutationsFromBrowser,false);assert.equal(model.safety.auditUpdateDelete,false);});
