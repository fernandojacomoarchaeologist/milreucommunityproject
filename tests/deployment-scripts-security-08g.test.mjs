/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const bootstrap=readFileSync("scripts/admin/bootstrap-master.mjs","utf8");
const master=readFileSync("scripts/admin/master-status.mjs","utf8");
const smoke=readFileSync("scripts/deploy/remote-smoke.mjs","utf8");
const builder=readFileSync("scripts/deploy/build-deployment-profile.mjs","utf8");
test("bootstrap exige confirmação e não imprime resposta bruta",()=>{assert.match(bootstrap,/BOOTSTRAP_MILREU_MASTER/);assert.doesNotMatch(bootstrap,/console\.log\(body\)/);});
test("estado do master não expõe e-mail",()=>{assert.match(master,/emailExposed:false/);assert.doesNotMatch(master,/MILREU_MASTER_EMAIL/);});
test("smoke de produção é read-only e confirmado",()=>{assert.match(smoke,/ALLOW_READ_ONLY_PRODUCTION_SMOKE/);assert.match(smoke,/method:"GET"/);});
test("service role não é gravada no perfil",()=>{assert.match(builder,/não será gravada/);assert.doesNotMatch(builder,/serviceRole:/);});
