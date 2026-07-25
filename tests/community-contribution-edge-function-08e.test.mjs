/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const edge=readFileSync("supabase/functions/community-contribution-intake/index.ts","utf8");
const config=readFileSync("supabase/functions/community-contribution-intake/config.toml","utf8");

test("função pública valida manualmente ações e CORS",()=>{
  assert.match(config,/verify_jwt = false/);
  assert.match(edge,/ALLOWED_ORIGINS/);
  assert.match(edge,/method_not_allowed/);
  assert.match(edge,/invalid_action/);
});

test("proteções antiabuso e desafio são configuráveis",()=>{
  assert.match(edge,/RATE_LIMIT_SALT/);
  assert.match(edge,/TURNSTILE_SECRET_KEY/);
  assert.match(edge,/collab_consume_public_rate_limit_08e/);
  assert.match(edge,/rate_limit_exceeded/);
  assert.match(edge,/spam_detected/);
});

test("service role permanece na função, não no browser",()=>{
  assert.match(edge,/SUPABASE_SERVICE_ROLE_KEY/);
  const browser=[
    "src/main.js","src/collab/controller.js",
    "src/views/contributions-public.js","src/views/collaborative-contributions.js"
  ].map(path=>readFileSync(path,"utf8")).join("\n");
  assert.doesNotMatch(browser,/SUPABASE_SERVICE_ROLE_KEY/);
});

test("ficheiros usam URL assinada e bucket privado",()=>{
  assert.match(edge,/createSignedUploadUrl/);
  assert.match(edge,/createSignedUrl/);
  assert.match(edge,/community-contributions-private/);
  assert.match(edge,/complete-file/);
  assert.match(edge,/file-link/);
});
