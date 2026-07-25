/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const foundation=readFileSync("supabase/migrations/20260724150000_collaborative_operations_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724150100_collaborative_operations_rpc.sql","utf8");
const runtime=JSON.parse(readFileSync("public/config/operations.runtime.json","utf8"));
test("planos distinguem provider, frequência, RPO e RTO",()=>{for(const marker of["backup_type","provider","frequency","target_rpo_minutes","target_rto_minutes","responsible_user_id","secondary_user_id"])assert.ok(foundation.includes(marker));});
test("responsável secundário deve ser diferente",()=>assert.match(rpc,/backup_secondary_must_differ/));
test("verificação exige evidência",()=>assert.match(rpc,/backup_evidence_required/));
test("runtime não afirma backup remoto",()=>{assert.equal(runtime.backup.provider,"unconfigured");assert.equal(runtime.backup.managedBackupConfirmed,false);});
