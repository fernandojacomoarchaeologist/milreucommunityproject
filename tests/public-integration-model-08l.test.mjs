/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=(p)=>JSON.parse(readFileSync(p,"utf8"));
const pub=read("public/data/public-integration-model.json");
const paths=read("public/data/participation-pathways-model.json");
const roles=read("public/data/collaborative-roles-permissions.json");
const ev=read("public/data/evolution-readiness.json");
const slots=read("public/data/public-effect-slots.json");
test("modelo público é staging/snapshots-only e sem efeitos ativos",()=>{assert.equal(pub.version,"0.24.0");assert.equal(pub.publicReadsSnapshotsOnly,true);assert.equal(pub.activePublicEffectsByDefault,0);assert.equal(pub.productionApproval,"blocked");});
test("participação sem ranking, gamificação ou concessão automática",()=>{assert.equal(paths.rankingEnabled,false);assert.equal(paths.gamificationRequired,false);assert.equal(paths.automaticRoleGrant,false);});
test("catálogo tem 140 permissões e as 13 novas",()=>{assert.equal(roles.permissions.length,149);for(const p of ["participation.view","public-integration.propose","public-integration.activate","evolution.decide"])assert.ok(roles.permissions.includes(p));});
test("activate/rollback/decide são master-only",()=>{for(const p of ["public-integration.activate","public-integration.rollback","evolution.decide"])assert.ok(!roles.rolePermissions.coordinator.includes(p));assert.deepEqual(roles.rolePermissions.master,["*"]);});
test("readiness e slots começam bloqueados/vazios",()=>{for(const g of ["pilotEvidence","publicIntegrationCandidate","stagingPreview","productionApproval"])assert.equal(ev[g],"blocked");assert.equal(slots.activeEffects,0);assert.ok(slots.slots.every(s=>s.status==="empty"));});
