/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const foundation = readFileSync("supabase/migrations/20260726080000_collaborative_pilot_foundation.sql", "utf8");
const rpc = readFileSync("supabase/migrations/20260726080100_collaborative_pilot_rpc.sql", "utf8");
const view = readFileSync("src/views/collaborative-pilot.js", "utf8");

test("o piloto é restrito a staging (check de ambiente)", () => {
  assert.ok(foundation.includes("environment = 'staging'"));
});

test("participante vê apenas a própria participação (RLS por user_id)", () => {
  assert.ok(/collab_pilot_participants_select[\s\S]*user_id=auth\.uid\(\)/.test(foundation));
});

test("evidências privadas nunca são visíveis a participantes", () => {
  // A policy de evidence não pode conter reported_by/user_id=auth.uid(); só permissões de gestão.
  const evidencePolicy = foundation.match(/collab_pilot_evidence_select[\s\S]*?using\s*\(([\s\S]*?)\);/);
  assert.ok(evidencePolicy, "policy de evidência ausente");
  assert.ok(evidencePolicy[1].includes("pilot.evidence.manage"));
  assert.ok(!evidencePolicy[1].includes("auth.uid()"));
});

test("a auto-inscrição é proibida na RPC", () => {
  assert.ok(rpc.includes("self_enrolment_forbidden"));
});

test("a inscrição exige membership ativa", () => {
  assert.ok(rpc.includes("member_not_active"));
});

test("a aprovação exige confirmação literal e gates sem bloqueadores", () => {
  assert.ok(rpc.includes("APPROVE_MILREU_STAGING_HOMOLOGATION"));
  assert.ok(rpc.includes("blocking_gates_pending"));
  assert.ok(rpc.includes("critical_observations_open"));
});

test("a homologação de staging não desbloqueia produção", () => {
  assert.ok(/'productionApproval',\s*'blocked'/.test(rpc));
});

test("a vista não expõe service role nem segredos", () => {
  assert.ok(!/service_role|SUPABASE_SERVICE_ROLE|sb_secret/i.test(view));
});

test("todas as mutações do piloto passam por security definer", () => {
  const code = rpc.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n");
  const definers = (code.match(/security definer/g) || []).length;
  const functions = (code.match(/create or replace function/g) || []).length;
  assert.equal(definers, functions, "há RPC sem security definer");
});
