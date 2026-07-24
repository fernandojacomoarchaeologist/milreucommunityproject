/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const model=JSON.parse(readFileSync("public/data/collaborative-task-model.json","utf8"));const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
test("modelo operacional possui categorias e ciclos de estado",()=>{assert.ok(model.categories.length>=12);assert.deepEqual(model.assignmentModes.map(x=>x.code),["open","approval","direct"]);for(const status of ["invited","applied","accepted","in-progress","submitted","completed","withdrawn"]){assert.ok(model.assignmentStatuses.some(x=>x.code===status));}});
test("tarefas e disponibilidade estão ativas",()=>{for(const code of ["tasks","availability","task-management"]){assert.equal(modules.find(x=>x.code===code)?.status,"active");}});
test("funções mínimas recebem permissões de voluntariado",()=>{for(const role of ["volunteer","researcher","reviewer","translator"]){const permissions=roles.rolePermissions[role];assert.ok(permissions.includes("availability.self.manage"));assert.ok(permissions.includes("tasks.apply"));assert.ok(permissions.includes("tasks.progress"));assert.ok(permissions.includes("tasks.time-log"));}assert.ok(roles.rolePermissions.coordinator.includes("tasks.verify"));assert.ok(roles.rolePermissions.coordinator.includes("tasks.assign"));});
