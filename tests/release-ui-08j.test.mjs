/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const router=readFileSync("src/lib/router.js","utf8");
const main=readFileSync("src/main.js","utf8");
const view=readFileSync("src/views/collaborative-release-candidate.js","utf8");
const layout=readFileSync("src/components/collaborative-layout.js","utf8");
const config=readFileSync("src/collab/config.js","utf8");

test("subrota RC precede o matcher dinâmico",()=>{assert.ok(router.indexOf('release-candidate") return')<router.indexOf("const collabHomologationRun"));});
test("main integra a vista RC",()=>{assert.match(main,/collaborativeReleaseCandidateView/);assert.match(main,/case "collab-release-candidate"/);});
test("vista exige permissão existente",()=>{assert.match(view,/homologation\.view/);assert.doesNotMatch(view,/release\.approve|production\.approve/);});
test("navegação inclui a RC sob homologação",()=>{assert.match(layout,/gestao\/homologacao\/release-candidate/);});
test("controller carrega modelos de qualidade",()=>{assert.match(config,/collaborative-release-candidate-model/);assert.match(config,/accessibility-audit-model-08j/);assert.match(config,/e2e-scenarios-08j/);});
