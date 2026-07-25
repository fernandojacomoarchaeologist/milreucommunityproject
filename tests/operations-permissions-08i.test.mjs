/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const operational=["operations.view","operations.manage","audit.search","audit.export","audit.integrity","retention.manage","retention.approve","incidents.manage","backups.manage","continuity.manage"];
test("catálogo acumulado possui 117 permissões",()=>assert.equal(roles.permissions.length,117));
test("master e coordinator possuem governação operacional",()=>{for(const permission of operational){assert.ok(roles.rolePermissions.master.includes("*")||roles.rolePermissions.master.includes(permission));assert.ok(roles.rolePermissions.coordinator.includes(permission));}});
test("perfis comunitários não recebem administração",()=>{for(const role of["volunteer","translator","partner","observer"]){for(const permission of operational)assert.ok(!roles.rolePermissions[role].includes(permission),`${role}:${permission}`);}});
test("três módulos 08I estão ativos",()=>{for(const code of["system-administration","audit-governance","incident-continuity"]){const item=modules.find(x=>x.code===code);assert.equal(item?.status,"active");}});
