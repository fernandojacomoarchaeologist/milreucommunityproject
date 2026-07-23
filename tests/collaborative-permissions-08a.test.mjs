/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { expandRolePermissions, visibleModules } from "../src/collab/permissions.js";

const registry=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;

test("master recebe todas as permissões",()=>{
  const permissions=expandRolePermissions(["master"],registry.rolePermissions,registry.permissions);
  assert.deepEqual(permissions,[...registry.permissions].sort());
});

test("voluntário não recebe gestão de membros",()=>{
  const permissions=expandRolePermissions(["volunteer"],registry.rolePermissions,registry.permissions);
  assert.ok(permissions.includes("tasks.view"));
  assert.ok(permissions.includes("contributions.submit"));
  assert.ok(!permissions.includes("memberships.manage"));
  assert.ok(!permissions.includes("roles.manage"));
});

test("módulos dependem de vínculo ativo e permissão",()=>{
  const active={
    membership:{status:"active"},
    permissions:expandRolePermissions(["volunteer"],registry.rolePermissions,registry.permissions)
  };
  const pending={...active,membership:{status:"pending"}};
  assert.ok(visibleModules(active,modules).some(module=>module.code==="tasks"));
  assert.ok(!visibleModules(active,modules).some(module=>module.code==="profile-management"));
  assert.equal(visibleModules(pending,modules).length,0);
});
