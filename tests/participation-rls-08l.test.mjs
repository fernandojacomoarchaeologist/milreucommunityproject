/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const foundation=readFileSync("supabase/migrations/20260726090000_public_integration_and_participation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260726090100_public_integration_rpc_and_rls.sql","utf8");
test("inscrições são próprias ou de gestão (nunca de terceiros)",()=>{assert.ok(/collab_enrol_select[\s\S]*user_id=auth.uid\(\)[\s\S]*participation.manage/.test(foundation));});
test("progresso é próprio (via inscrição) ou gestão",()=>{assert.ok(/collab_progress_select[\s\S]*e.user_id=auth.uid\(\)/.test(foundation));});
test("participante não pode auto-validar quando exige coordenação",()=>{assert.ok(rpc.includes("validation_requires_manager"));});
test("inscrição exige membership ativa",()=>{assert.ok(rpc.includes("member_not_active"));});
