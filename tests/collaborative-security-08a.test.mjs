/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config=JSON.parse(readFileSync("public/config/collaborative-area.runtime.json","utf8"));
const example=JSON.parse(readFileSync("public/config/collaborative-area.example.json","utf8"));
const controller=readFileSync("src/collab/controller.js","utf8");
const builder=readFileSync("scripts/collab/build-runtime-config.mjs","utf8");
const bootstrap=readFileSync("scripts/admin/bootstrap-master.mjs","utf8");

test("frontend contém apenas espaço para chave publicável",()=>{
  assert.equal(config.supabasePublishableKey,null);
  assert.equal(config.security.serviceRoleInBrowser,false);
  assert.equal(example.security.storeGoogleProviderTokens,false);
  assert.doesNotMatch(controller,/SUPABASE_SERVICE_ROLE_KEY/);
});

test("Google OAuth usa PKCE e callback explícito",()=>{
  assert.match(controller,/signInWithOAuth/);
  assert.match(controller,/openid email profile/);
  assert.match(readFileSync("src/collab/supabase-client.js","utf8"),/flowType:\s*"pkce"/);
  assert.match(readFileSync("src/collab/callback.js","utf8"),/exchangeCodeForSession/);
});

test("master é configurado fora do navegador",()=>{
  assert.match(bootstrap,/MILREU_MASTER_EMAIL/);
  assert.match(bootstrap,/SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(bootstrap,/collab_bootstrap_master_by_email/);
  assert.match(builder,/SUPABASE_SERVICE_ROLE_KEY foi ignorada/);
});
