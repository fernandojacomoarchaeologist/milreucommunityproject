/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const edge=readFileSync("supabase/functions/export-collab-audit/index.ts","utf8");
const config=readFileSync("supabase/functions/export-collab-audit/config.toml","utf8");
test("exportação usa sessão e RPC redigida",()=>{assert.match(edge,/authorization/);assert.match(edge,/auth\.getUser/);assert.match(edge,/collab_search_audit_08i/);});
test("exportação não usa service role",()=>assert.doesNotMatch(edge,/SERVICE_ROLE|service_role/));
test("CSV possui limite e no-store",()=>{assert.match(edge,/5000/);assert.match(edge,/Cache-Control/);assert.match(edge,/no-store/);});
test("função exige JWT",()=>assert.equal(config.trim(),"verify_jwt = true"));
