/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const routes=JSON.parse(readFileSync("data/architecture/route-manifest.json","utf8")).routes;
test("rotas únicas",()=>assert.equal(new Set(routes.map(r=>r.path)).size,routes.length));
test("Portal e Museu existem",()=>{assert.ok(routes.some(r=>r.product==="portal"));assert.ok(routes.some(r=>r.product==="museu"))});
test("mapa vivo fora do MVP",()=>assert.ok(!routes.some(r=>r.path==="/museu/mapa")));
test("deep links existem",()=>{assert.ok(routes.some(r=>r.path==="/museu/memorias/:id"));assert.ok(routes.some(r=>r.path==="/museu/imersivo/:id"))});
