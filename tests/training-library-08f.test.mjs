/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const training=JSON.parse(readFileSync("public/data/collaborative-training-trails.json","utf8"));
const library=JSON.parse(readFileSync("public/data/collaborative-library.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
test("cinco trilhas e quinze lições",()=>{assert.equal(training.trails.length,5);assert.equal(training.trails.flatMap(x=>x.lessons).length,15);});
test("trilhas cobrem direitos, tradução e acessibilidade",()=>{for(const code of["rights-credits-ai","translation-localisation","accessible-public-writing"])assert.ok(training.trails.some(x=>x.code===code));});
test("biblioteca possui recursos de contexto e revisão",()=>{assert.equal(library.resources.length,9);assert.ok(library.resources.some(x=>x.code==="context-recovery"));assert.ok(library.resources.some(x=>x.code==="museum-review-manual"));});
test("biblioteca, formação e revisão estão ativas",()=>{for(const code of["library","training","museum-review","museum-review-management"])assert.equal(modules.find(x=>x.code===code)?.status,"active");});
