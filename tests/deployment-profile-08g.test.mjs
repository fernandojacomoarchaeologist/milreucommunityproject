/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const profile=JSON.parse(readFileSync("public/config/deployment-profile.runtime.json","utf8"));
const readiness=JSON.parse(readFileSync("public/data/deployment-readiness.json","utf8"));
const builder=readFileSync("scripts/deploy/build-deployment-profile.mjs","utf8");
test("perfil inicial não contém segredos",()=>{const text=JSON.stringify(profile);assert.doesNotMatch(text,/service_role|client_secret|MILREU_MASTER_EMAIL/i);assert.equal(profile.googleOAuth.clientSecretInFrontend,false);});
test("staging e produção devem ser separados",()=>{assert.match(builder,/stagingRef===productionRef/);assert.match(builder,/requireSeparateStaging/);});
test("demo só é permitida localmente",()=>{assert.match(builder,/environment==="local"/);assert.equal(profile.environment,"local");});
test("readiness não expõe o e-mail master",()=>{assert.doesNotMatch(JSON.stringify(readiness),/@/);assert.ok(Array.isArray(readiness.blockingItems));});
