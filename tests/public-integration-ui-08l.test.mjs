/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const router=readFileSync("src/lib/router.js","utf8"),main=readFileSync("src/main.js","utf8"),layout=readFileSync("src/components/collaborative-layout.js","utf8");
const partView=readFileSync("src/views/collaborative-participation.js","utf8"),pubView=readFileSync("src/views/public-integration-management.js","utf8");
test("rotas 08L existem",()=>{for(const n of ["collab-participation","collab-public-integration"])assert.ok(router.includes(n));assert.ok(router.includes("/area-colaborativa/participacao"));assert.ok(router.includes("/area-colaborativa/gestao/integracao-publica"));});
test("main despacha e liga os formulários 08L",()=>{assert.ok(main.includes("collaborativeParticipationView"));assert.ok(main.includes("collaborativePublicIntegrationView"));for(const m of ["data-participation-enrol-form","data-participation-progress-form","data-public-proposal-form","data-public-activation-form","data-evolution-proposal-form"])assert.ok(main.includes(m),m);assert.ok(main.includes("collaborative.participationAction"));assert.ok(main.includes("collaborative.publicIntegrationAction"));});
test("menu tem integração pública gated",()=>{assert.ok(layout.includes('hasPermission(context,"public-integration.view")'));assert.ok(layout.includes("Integração pública"));});
test("gestão pública exibe aviso de bloqueio e confirmação literal",()=>{assert.ok(pubView.includes("ACTIVATE_MILREU_PUBLIC_EFFECT"));assert.ok(pubView.includes("aria-live"));});
test("vistas não expõem service role",()=>{for(const v of [partView,pubView])assert.ok(!/service_role|SUPABASE_SERVICE_ROLE/i.test(v));});
