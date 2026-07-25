/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const config=readFileSync("supabase/config.toml","utf8");
const runtime=readFileSync("scripts/collab/build-runtime-config.mjs","utf8");
const controller=readFileSync("src/collab/controller.js","utf8");
const oauth=readFileSync("scripts/deploy/google-oauth-contract.mjs","utf8");
test("Google local usa secret por variável de ambiente",()=>{assert.match(config,/\[auth\.external\.google\]/);assert.match(config,/SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET/);assert.match(config,/skip_nonce_check = false/);});
test("runtime preserva pré-autorização e domínios",()=>{assert.match(runtime,/requirePreauthorization:true/);assert.match(runtime,/MILREU_ALLOWED_EMAIL_DOMAINS/);});
test("controller bloqueia provider não homologado e domínio",()=>{assert.match(controller,/Google OAuth ainda não foi homologado/);assert.match(controller,/email_domain_not_allowed/);});
test("contrato OAuth valida callbacks",()=>{assert.match(oauth,/127\.0\.0\.1:54321\/auth\/v1\/callback/);assert.match(oauth,/localhost:4173\/auth\/callback/);});
