/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const readiness=JSON.parse(readFileSync("public/data/release-readiness.json","utf8"));
const workflow=readFileSync(".github/workflows/07d-pages.yml","utf8");
test("lançamento bloqueado",()=>{assert.equal(readiness.publicLaunch.approved,false);assert.ok(readiness.publicLaunch.blockers.length>=6)});
test("workflow manual",()=>{assert.match(workflow,/workflow_dispatch/);assert.match(workflow,/PUBLISH_TECHNICAL_MVP/);assert.doesNotMatch(workflow,/^\s*push:/m)});
test("URL pública obrigatória",()=>{assert.match(workflow,/public_base_url/);assert.match(workflow,/MILREU_PUBLIC_BASE_URL/)});
