/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const model=JSON.parse(readFileSync("public/data/collaborative-museum-review-model.json","utf8"));
const seed=JSON.parse(readFileSync("public/data/museum-review-seed.json","utf8"));
test("modelo cobre 31 memórias e 22 campos",()=>{assert.equal(model.recordCount,31);assert.equal(model.fields.length,22);assert.equal(seed.records.length,31);assert.equal(new Set(seed.records.map(x=>x.memoryId)).size,31);});
test("gates possuem três etapas",()=>{assert.deepEqual(model.approvalGates.editorial,["editorial","source","relations","accessibility"]);assert.deepEqual(model.approvalGates.rights,["rights","digital-intervention"]);assert.deepEqual(model.approvalGates.publication,["publication","translation"]);});
test("formação é requisito",()=>{assert.ok(model.approvalGates.trainingRequired);assert.ok(model.requiredTrainingByAction["publication-approve"].includes("rights-credits-ai"));});
test("efeitos públicos possuem slots limitados",()=>{assert.deepEqual(model.publicEffects.allowedSlots,["portal.home.after-featured","museum.home.after-opening"]);assert.equal(model.publicEffects.maximumMemoriesPerEffect,3);});
