/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertNoForbiddenFields } from "../scripts/public-integration/validate-public-payload.mjs";
test("payload público sem PII é aceite",()=>{assert.doesNotThrow(()=>assertNoForbiddenFields({title:"x",body:"y",languages:{"pt-PT":{title:"a"}}}));});
test("payload com e-mail/telefone/token é rejeitado",()=>{for(const bad of [{contactEmail:"a@b.invalid"},{phone:"123"},{token:"x"},{user_id:"u"},{nested:{secret:"s"}}])assert.throws(()=>assertNoForbiddenFields(bad));});
test("o serviço de snapshot exporta a guarda",()=>{const svc=readFileSync("src/services/public-snapshot-service.js","utf8");assert.ok(svc.includes("assertPublicSafe"));assert.ok(svc.includes("readActiveSnapshots"));});
