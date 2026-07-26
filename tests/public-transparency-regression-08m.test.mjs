/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const router=readFileSync("src/lib/router.js","utf8");
const memories=JSON.parse(readFileSync("public/data/memories.json","utf8"));
test("rotas públicas existentes preservadas",()=>{for(const r of ['name:"home"','name:"participate"','name:"public-exhibitions"'])assert.ok(router.includes(r));});
test("nova rota /transparencia não sequestra rotas existentes",()=>{assert.ok(router.includes('if (path === "/transparencia") return { name:"public-transparency" }'));assert.ok(router.includes('if (path === "/exposicoes") return { name:"public-exhibitions" }'));});
test("dataset canónico do Museu preservado em 0.11.3",()=>{assert.equal(memories.version,"0.11.3");});
test("transparência pública começa vazia (0 efeitos)",()=>{const rd=JSON.parse(readFileSync("public/data/operations-readiness.json","utf8"));assert.equal(rd.publishedIndicators,0);assert.equal(rd.publicTransparency,"blocked");});
