/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const profiles=JSON.parse(readFileSync("public/data/collaborative-profile-types.json","utf8")).profileTypes;
const registry=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;

test("cadastro possui perfis de vínculo",()=>{
  assert.ok(profiles.some(item=>item.code==="volunteer"));
  assert.ok(profiles.some(item=>item.code==="coordinator"));
  assert.ok(profiles.some(item=>item.code==="community-collaborator"));
  assert.ok(profiles.some(item=>item.code==="institutional-partner"));
});

test("master é função separada do perfil principal",()=>{
  assert.ok(registry.roles.some(role=>role.code==="master"));
  assert.ok(!profiles.some(profile=>profile.code==="master"));
  assert.deepEqual(registry.rolePermissions.master,["*"]);
});

test("módulos voluntários e gestão estão registados",()=>{
  for(const code of ["tasks","contributions","agenda","library","training","museum-review","profile-management","exhibition-management"]){
    assert.ok(modules.some(module=>module.code===code),code);
  }
  assert.equal(modules.find(module=>module.code==="profile").status,"active");
  assert.equal(modules.find(module=>module.code==="agenda").status,"skeleton");
});
