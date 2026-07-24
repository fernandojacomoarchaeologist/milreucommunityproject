/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const reg=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const catalog=JSON.parse(readFileSync("public/data/collaborative-member-catalog.json","utf8"));
const controller=readFileSync("src/collab/controller.js","utf8");
const views=readFileSync("src/views/collaborative.js","utf8");
test("gestão e pré-autorizações estão ativas",()=>{assert.equal(modules.find(x=>x.code==="profile-management").status,"active");assert.equal(modules.find(x=>x.code==="member-invitations").status,"active");});
test("permissões administrativas são explícitas",()=>{for(const p of["memberships.reject","memberships.suspend","memberships.archive","invitations.manage","member.audit.view","member.notes.manage"])assert.ok(reg.permissions.includes(p),p);});
test("perfil oferece interesses, competências e idiomas",()=>{assert.ok(catalog.interestAreas.length>=8);assert.ok(catalog.skills.length>=10);assert.deepEqual(catalog.languages,["pt-PT","en","es","fr"]);assert.match(views,/checkOptions\(catalog\.interestAreas\|\|\[\],"interests"/);assert.match(views,/checkOptions\(catalog\.skills\|\|\[\],"skills"/);});
test("controller possui operações de gestão",()=>{assert.match(controller,/async manageMember/);assert.match(controller,/async createInvitation/);assert.match(controller,/async revokeInvitation/);});
