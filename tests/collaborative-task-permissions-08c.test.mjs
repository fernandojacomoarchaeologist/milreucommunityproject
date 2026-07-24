/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";import{expandRolePermissions,visibleModules}from"../src/collab/permissions.js";
const registry=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8")),modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
test("voluntário vê tarefas e disponibilidade, não gestão",()=>{const permissions=expandRolePermissions(["volunteer"],registry.rolePermissions,registry.permissions),context={membership:{status:"active"},permissions};const visible=visibleModules(context,modules).map(x=>x.code);assert.ok(visible.includes("tasks"));assert.ok(visible.includes("availability"));assert.ok(!visible.includes("task-management"));});
test("coordenador vê gestão e validação",()=>{const permissions=expandRolePermissions(["coordinator"],registry.rolePermissions,registry.permissions),context={membership:{status:"active"},permissions};const visible=visibleModules(context,modules).map(x=>x.code);assert.ok(visible.includes("task-management"));assert.ok(permissions.includes("tasks.assign"));assert.ok(permissions.includes("tasks.verify"));});
