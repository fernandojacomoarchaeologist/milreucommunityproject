/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const matrix=JSON.parse(readFileSync("public/data/e2e-scenarios-08j.json","utf8"));
const model=JSON.parse(readFileSync("public/data/collaborative-release-candidate-model.json","utf8"));
const source=readFileSync("scripts/e2e/run-browser-e2e-08j.mjs","utf8");

test("matriz possui contagens coerentes",()=>{const s=matrix.scenarios;assert.equal(s.length,model.scenarioCounts.total);assert.equal(s.filter(x=>x.execution==="automated").length,model.scenarioCounts.automated);assert.equal(s.filter(x=>x.execution==="human").length,model.scenarioCounts.human);assert.equal(s.filter(x=>x.execution==="external").length,model.scenarioCounts.external);});
test("cenários cobrem público, pendente, voluntário e master",()=>{const profiles=new Set(matrix.scenarios.map(item=>item.profile));for(const code of ["anonymous","pending","volunteer","master"])assert.ok(profiles.has(code));});
test("cenários cobrem negação e honestidade da RC",()=>{const codes=new Set(matrix.scenarios.map(item=>item.code));assert.ok(codes.has("volunteer-admin-denied"));assert.ok(codes.has("master-release-candidate"));assert.ok(codes.has("staging-auth"));});
test("runner usa Chromium CDP sem dependência externa",()=>{assert.match(source,/remote-debugging-port/);assert.match(source,/new WebSocket/);assert.doesNotMatch(source,/playwright|puppeteer/i);});
test("runner produz evidência JSON",()=>{assert.match(source,/reports\/e2e-result\.json/);assert.match(source,/runtime-errors/);});
