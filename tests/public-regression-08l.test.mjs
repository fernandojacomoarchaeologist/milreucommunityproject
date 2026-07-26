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
test("/participar não foi sequestrado pelo 08L",()=>{assert.ok(router.includes('if (path === "/participar") return { name:"participate" }'));});
test("dataset canónico do Museu preservado em 0.11.3",()=>{assert.equal(memories.version,"0.11.3");});
test("slots públicos permanecem vazios",()=>{const slots=JSON.parse(readFileSync("public/data/public-effect-slots.json","utf8"));assert.equal(slots.activeEffects,0);assert.ok(slots.slots.every(s=>s.status==="empty"));});
