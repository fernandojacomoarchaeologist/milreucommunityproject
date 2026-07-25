/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const foundation=readFileSync("supabase/migrations/20260724150000_collaborative_operations_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724150100_collaborative_operations_rpc.sql","utf8");
test("auditoria possui redacção, hashes e imutabilidade",()=>{for(const marker of["collab_redact_json_08i","previous_hash","event_hash","collab_audit_hash_before_insert_08i","collab_audit_immutable_08i","audit_log_is_immutable"])assert.ok(foundation.includes(marker));});
test("acesso direto autenticado foi revogado",()=>assert.match(foundation,/revoke select on public\.collab_audit_log from authenticated/));
test("pesquisa redigida não devolve snapshots completos",()=>{const fn=rpc.match(/create or replace function public\.collab_search_audit_08i[\s\S]*?\n\$\$;/)?.[0]||"";assert.doesNotMatch(fn,/'beforeData'|'afterData'/);assert.match(fn,/changedKeys/);});
test("verificação parcial recupera hash predecessor",()=>assert.match(rpc,/id<p_from_id/));
