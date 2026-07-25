/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const controller=readFileSync("src/collab/controller.js","utf8");
test("workspace remoto usa RPC agregada",()=>{assert.match(controller,/collab_operations_workspace_08i/);assert.match(controller,/collab_search_audit_08i/);});
test("polling operacional respeita mínimo de sessenta segundos",()=>{assert.match(controller,/Math\.max\(60/);assert.match(controller,/startOperationsPolling/);assert.match(controller,/stopOperationsPolling/);});
test("browser não aplica retenção",()=>{assert.doesNotMatch(controller,/collab_apply_retention_run_08i/);assert.match(controller,/APPROVE_MILREU_RETENTION_RUN/);});
test("configurações rejeitam nomes sensíveis",()=>assert.match(controller,/service\[_-\]\?role\|secret\|password/));
