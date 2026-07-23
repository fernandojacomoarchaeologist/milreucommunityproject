/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const js=readFileSync("apps/architecture-prototype/prototype.js","utf8");
const html=readFileSync("apps/architecture-prototype/index.html","utf8");
test("conteúdo demonstrativo",()=>{assert.match(js,/DEMO-001/);assert.match(js,/DEMONSTRATION CONTENT|CONTEÚDO DEMONSTRATIVO/)});
test("quatro idiomas",()=>{for(const l of ["pt-PT","en","es","fr"])assert.match(js,new RegExp(l.replace("-","\\-")))});
test("skip link",()=>assert.match(html,/skip-link/));
