/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const foundation = readFileSync("supabase/migrations/20260726080000_collaborative_pilot_foundation.sql", "utf8");
const rpc = readFileSync("supabase/migrations/20260726080100_collaborative_pilot_rpc.sql", "utf8");
const seed = readFileSync("supabase/migrations/20260726080200_collaborative_pilot_seed.sql", "utf8");

test("as três migrations do piloto existem", () => {
  for (const f of ["20260726080000_collaborative_pilot_foundation.sql", "20260726080100_collaborative_pilot_rpc.sql", "20260726080200_collaborative_pilot_seed.sql"]) {
    assert.ok(existsSync(`supabase/migrations/${f}`), f);
  }
});

test("as 9 tabelas do piloto são criadas", () => {
  for (const t of ["collab_pilot_cycles", "collab_pilot_participants", "collab_pilot_scenarios", "collab_pilot_sessions", "collab_pilot_session_participants", "collab_pilot_observations", "collab_pilot_evidence", "collab_pilot_metric_snapshots", "collab_pilot_gate_results"]) {
    assert.ok(foundation.includes(`create table if not exists public.${t}`), t);
  }
});

test("RLS está ativa nas 9 tabelas", () => {
  const enabled = (foundation.match(/enable row level security/g) || []).length;
  assert.ok(enabled >= 9, `apenas ${enabled} tabelas com RLS`);
});

test("RPCs essenciais estão definidas", () => {
  for (const fn of ["collab_pilot_upsert_cycle", "collab_pilot_enrol_participant", "collab_pilot_confirm_participation", "collab_pilot_submit_observation", "collab_pilot_set_gate_result", "collab_pilot_approve_staging_homologation", "collab_pilot_workspace"]) {
    assert.ok(rpc.includes(`function public.${fn}`), fn);
  }
});

test("o seed adiciona permissões e módulo, sem ciclos nem participantes", () => {
  assert.ok(seed.includes("insert into public.collab_permissions"));
  assert.ok(seed.includes("insert into public.collab_modules"));
  assert.ok(!/insert into public\.collab_pilot_cycles/.test(seed));
  assert.ok(!/insert into public\.collab_pilot_participants/.test(seed));
});

test("as migrations do piloto não têm operações destrutivas próprias", () => {
  for (const sql of [foundation, rpc, seed]) {
    assert.ok(!/\b(drop\s+table|truncate|delete\s+from)\b/i.test(sql));
  }
});
