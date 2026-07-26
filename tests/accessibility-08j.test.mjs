/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const model=JSON.parse(readFileSync("public/data/accessibility-audit-model-08j.json","utf8"));
const index=readFileSync("index.html","utf8");
const css=["src/styles/tokens.css","src/styles/components.css","src/styles/app.css"].map(path=>readFileSync(path,"utf8")).join("\n");

test("alvo é WCAG 2.2 AA",()=>{assert.equal(model.standard,"WCAG 2.2");assert.equal(model.target,"AA");});
test("três viewports obrigatórios",()=>{assert.deepEqual(model.viewports.map(item=>item.width),[375,768,1280]);assert.ok(model.viewports.every(item=>item.required));});
test("baseline e gate humano coexistem",()=>{assert.ok(model.automatedBaseline.length>=12);assert.ok(model.humanRequired.length>=6);assert.match(model.rule,/não substitui/i);});
test("documento possui idioma, viewport e skip link",()=>{assert.match(index,/lang="pt-PT"/);assert.match(index,/name="viewport"/);assert.match(index,/class="skip-link"/);});
test("CSS preserva foco e movimento reduzido",()=>{assert.match(css,/:focus-visible|\.skip-link:focus/);assert.match(css,/prefers-reduced-motion/);});
