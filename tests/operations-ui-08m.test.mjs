/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const router=readFileSync("src/lib/router.js","utf8"),main=readFileSync("src/main.js","utf8"),layout=readFileSync("src/components/collaborative-layout.js","utf8");
const opView=readFileSync("src/views/operations-dashboard.js","utf8"),govView=readFileSync("src/views/governance-management.js","utf8");
test("rotas 08M existem (internas + transparência pública)",()=>{for(const n of ["collab-operations-governance","collab-governance","public-transparency"])assert.ok(router.includes(n));assert.ok(router.includes("/area-colaborativa/gestao/operacao"));assert.ok(router.includes("/transparencia"));});
test("main despacha e liga os formulários 08M",()=>{assert.ok(main.includes("operationsGovernanceDashboardView"));assert.ok(main.includes("publicTransparencyView"));for(const m of ["data-support-submit-form","data-operating-cycle-form","data-governance-decide-form","data-transparency-publish-form"])assert.ok(main.includes(m),m);assert.ok(main.includes("collaborative.operationsGovernanceAction"));});
test("menu tem operação e governação gated",()=>{assert.ok(layout.includes("Operação e governação"));assert.ok(layout.includes('hasPermission(context,"operations.view")'));});
test("governação exibe confirmação literal de transparência",()=>{assert.ok(govView.includes("APPROVE_MILREU_PUBLIC_TRANSPARENCY"));assert.ok(govView.includes("aria-live"));});
test("vistas não expõem service role",()=>{for(const v of [opView,govView])assert.ok(!/service_role|SUPABASE_SERVICE_ROLE/i.test(v));});
