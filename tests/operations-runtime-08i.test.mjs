/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const runtime=JSON.parse(readFileSync("public/config/operations.runtime.json","utf8"));
const builder=readFileSync("scripts/operations/build-runtime-config.mjs","utf8");
test("runtime começa local e bloqueado",()=>{assert.equal(runtime.environment,"local");assert.equal(runtime.retention.automaticApply,false);assert.equal(runtime.backup.provider,"unconfigured");});
test("builder rejeita retenção automática",()=>{assert.match(builder,/MILREU_RETENTION_AUTOMATIC_APPLY/);assert.match(builder,/MILREU_RETENTION_AUTOMATIC_SCHEDULE/);assert.match(builder,/não é suportada/);});
test("builder não grava service role ou JWT",()=>{assert.match(builder,/não será gravada/);assert.match(builder,/MILREU_ADMIN_USER_JWT/);});
test("polling respeita mínimo operacional",()=>assert.match(builder,/Math\.max\(60/));
