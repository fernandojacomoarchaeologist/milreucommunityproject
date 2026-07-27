/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=(p)=>JSON.parse(readFileSync(p,"utf8"));
const model=read("public/data/volunteer-experience-model.json");
const roles=read("public/data/collaborative-roles-permissions.json");
const modules=read("public/data/collaborative-modules.json");
test("08N não cria módulos nem permissões",()=>{assert.equal(model.newPermissionsExpected,0);assert.equal(model.newModulesExpected,0);assert.equal(roles.permissions.length,149);assert.equal(modules.modules.length,25);});
test("estrutura orientadora de 4 blocos definida",()=>{for(const b of ["objective","expectedActions","quickGuide","details"])assert.ok(model.requiredEditorialBlocks.includes(b));});
test("Formação mostra apenas Fundamentos na UI, backend intacto",()=>{assert.deepEqual(model.visibleTrainingCards,["project-foundations"]);const trails=read("public/data/collaborative-training-trails.json").trails;assert.ok(trails.length>=5);const view=readFileSync("src/views/collaborative-museum-review.js","utf8");assert.ok(view.includes("VOLUNTEER_VISIBLE_TRAINING_CODES"));});
test("home tem estrutura orientadora e ações pendentes",()=>{const dash=readFileSync("src/views/collaborative.js","utf8");assert.ok(dash.includes("sectionIntro"));assert.ok(dash.includes("homePendingActions"));assert.ok(dash.includes("Ações pendentes"));});
test("home não inventa pendências (fallback positivo)",()=>{const dash=readFileSync("src/views/collaborative.js","utf8");assert.ok(dash.includes("Sem ações pendentes"));});
