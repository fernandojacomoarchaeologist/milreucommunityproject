/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const model=JSON.parse(readFileSync("public/data/collaborative-contribution-model.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));

test("modelo cobre tipos, estados, direitos e destinos",()=>{
  assert.equal(model.version,"0.27.0");
  for(const type of ["photograph","testimony","correction","document","reference","rights-credit"]){
    assert.ok(model.contributionTypes.some(item=>item.code===type),type);
  }
  for(const status of ["submitted","needs-info","under-review","accepted","withdrawn","incorporated"]){
    assert.ok(model.statuses.some(item=>item.code===status),status);
  }
  assert.ok(model.incorporationDestinations.some(item=>item.code==="museum"));
  assert.ok(model.incorporationDestinations.some(item=>item.code==="proteus"));
  assert.equal(model.limits.maxFiles,5);
});

test("contributos e moderação estão ativos",()=>{
  assert.equal(modules.find(item=>item.code==="contributions")?.status,"active");
  assert.equal(modules.find(item=>item.code==="contribution-moderation")?.status,"active");
});

test("permissões separam participação de decisão",()=>{
  assert.ok(roles.rolePermissions.volunteer.includes("contributions.submit"));
  assert.ok(roles.rolePermissions.volunteer.includes("contributions.track-own"));
  assert.ok(!roles.rolePermissions.volunteer.includes("contributions.decide"));
  assert.ok(roles.rolePermissions.coordinator.includes("withdrawals.manage"));
  assert.ok(roles.rolePermissions.reviewer.includes("rights.review"));
});
