/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const model=JSON.parse(readFileSync("public/data/collaborative-notification-model.json","utf8"));
const templates=JSON.parse(readFileSync("public/data/collaborative-notification-templates.json","utf8"));
test("modelo contém vinte eventos únicos",()=>{assert.ok(model.eventTypes.length>=20);assert.equal(new Set(model.eventTypes.map(x=>x.code)).size,model.eventTypes.length);});
test("dez categorias cobrem o projeto",()=>{assert.ok(model.categories.length>=10);for(const code of["membership","tasks","contributions","museum-review","withdrawals","operations"])assert.ok(model.categories.some(x=>x.code===code));});
test("cada evento possui template pt-PT aprovado",()=>{for(const event of model.eventTypes)assert.ok(templates.templates.some(x=>x.eventType===event.code&&x.language==="pt-PT"&&x.status==="approved"),event.code);});
test("eventos críticos internos são obrigatórios",()=>{for(const code of["membership.suspended","withdrawal.submitted","withdrawal.status-changed","homologation.blocked"])assert.equal(model.eventTypes.find(x=>x.code===code)?.mandatoryInApp,true);});

test("e-mail exige opt-in explícito",()=>{
  assert.equal(model.preferenceRules.emailOptIn,true);
  assert.ok(model.eventTypes.every(event=>event.defaultEmail===false));
});
