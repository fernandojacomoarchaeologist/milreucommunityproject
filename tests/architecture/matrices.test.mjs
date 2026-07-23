/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const r=JSON.parse(readFileSync("data/architecture/route-manifest.json","utf8")).routes;
const c=JSON.parse(readFileSync("data/architecture/page-component-matrix.json","utf8")).pages;
const d=JSON.parse(readFileSync("data/architecture/page-data-source-matrix.json","utf8")).pages;
test("componentes cobrem rotas",()=>assert.deepEqual(new Set(c.map(x=>x.route)),new Set(r.map(x=>x.path))));
test("dados cobrem rotas",()=>assert.deepEqual(new Set(d.map(x=>x.route)),new Set(r.map(x=>x.path))));
