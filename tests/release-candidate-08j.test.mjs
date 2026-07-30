/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=path=>JSON.parse(readFileSync(path,"utf8"));
const model=read("public/data/collaborative-release-candidate-model.json");
const readiness=read("public/data/release-candidate-readiness.json");
const modules=read("public/data/collaborative-modules.json");
const roles=read("public/data/collaborative-roles-permissions.json");

test("08J mantém versão e candidata",()=>{assert.equal(model.version,"0.30.0");assert.equal(model.package,"08J");assert.equal(model.candidate,"RC1");});
test("08J preserva módulos e permissões",()=>{assert.equal(modules.modules.length,25);assert.ok(modules.modules.every(item=>item.status==="active"));assert.equal(roles.permissions.length,149);});
test("camadas de release são distintas",()=>{assert.deepEqual(model.releaseLayers.map(item=>item.code),["technical-rc","staging-homologated","production-approved"]);assert.equal(model.releaseLayers[0].mayBeReadyWithoutRemoteSecrets,true);assert.equal(model.releaseLayers[1].mayBeReadyWithoutRemoteSecrets,false);assert.equal(model.releaseLayers[2].mayBeReadyWithoutRemoteSecrets,false);});
test("gates externos permanecem bloqueados",()=>{assert.ok(model.externalGates.length>=7);assert.ok(model.externalGates.every(item=>item.status==="blocked"));assert.equal(readiness.stagingHomologation.approved,false);});
test("gates humanos permanecem pendentes",()=>{assert.ok(model.humanGates.length>=7);assert.ok(model.humanGates.every(item=>item.status==="pending"));assert.equal(readiness.productionApproval.approved,false);});
test("não há novos módulos funcionais",()=>{assert.equal(modules.modules.some(item=>item.code==="release-candidate"),false);});
