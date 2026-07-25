/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const model=JSON.parse(readFileSync("public/data/collaborative-exhibition-model.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));

test("catálogo cobre exposições, locais, agenda e logística",()=>{
  assert.equal(model.version,"0.16.0");
  assert.ok(model.exhibitionTypes.some(item=>item.code==="itinerant"));
  assert.ok(model.venueTypes.some(item=>item.code==="heritage-site"));
  assert.ok(model.eventTypes.some(item=>item.code==="installation"));
  assert.ok(model.checklistCategories.some(item=>item.code==="accessibility"));
});

test("módulos 08D estão ativos",()=>{
  for(const code of ["agenda","exhibition-management","venue-management"]){
    assert.equal(modules.find(item=>item.code===code)?.status,"active");
  }
});

test("permissões separam consulta, publicação e logística",()=>{
  for(const permission of ["agenda.rsvp","agenda.manage","venues.manage","exhibitions.publish","exhibitions.logistics"]){
    assert.ok(roles.permissions.includes(permission),permission);
  }
  assert.ok(roles.rolePermissions.volunteer.includes("agenda.rsvp"));
  assert.ok(!roles.rolePermissions.volunteer.includes("exhibitions.publish"));
});
