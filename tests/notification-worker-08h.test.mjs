/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const edge=readFileSync("supabase/functions/dispatch-collab-notifications/index.ts","utf8");
const config=readFileSync("supabase/functions/dispatch-collab-notifications/config.toml","utf8");
test("worker exige segredo próprio",()=>{assert.match(edge,/MILREU_NOTIFICATION_WORKER_SECRET/);assert.match(edge,/x-milreu-worker-secret/);assert.match(edge,/worker_authentication_required/);});
test("provider disabled não reclama outbox",()=>{assert.match(edge,/PROVIDER==="disabled"/);assert.match(edge,/claimed:0/);});
test("e-mail é resolvido no servidor e não logado",()=>{assert.match(edge,/auth\.admin\.getUserById/);assert.doesNotMatch(edge,/console\.log\(recipient|console\.log\(providerPayload/);});
test("HTML é escapado e config usa autenticação customizada",()=>{assert.match(edge,/escapeHtml/);assert.match(edge,/htmlFromText/);assert.equal(config.trim(),"verify_jwt = false");});

test("worker não retém corpo de resposta do fornecedor",()=>{
  assert.match(edge,/responseExcerpt:null/);
  assert.doesNotMatch(edge,/responseExcerpt:responseText/);
});
