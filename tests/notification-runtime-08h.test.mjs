/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const runtime=JSON.parse(readFileSync("public/config/notifications.runtime.json","utf8"));
const builder=readFileSync("scripts/notifications/build-runtime-config.mjs","utf8");
test("centro interno ativo e e-mail desativado",()=>{assert.equal(runtime.inApp.enabled,true);assert.equal(runtime.email.enabled,false);assert.equal(runtime.email.provider,"disabled");});
test("runtime não contém secrets ou endereço real",()=>{const text=JSON.stringify(runtime);assert.doesNotMatch(text,/WORKER_SECRET|WEBHOOK_TOKEN|SERVICE_ROLE/);assert.doesNotMatch(text,/@[a-z0-9.-]+\.[a-z]{2,}/i);});
test("produção exige literal para agenda automática",()=>{assert.match(builder,/ENABLE_MILREU_NOTIFICATION_SCHEDULE/);assert.match(builder,/MILREU_NOTIFICATION_AUTOMATIC_SCHEDULE/);});
test("service role não é gravada",()=>assert.match(builder,/não será gravada/));
