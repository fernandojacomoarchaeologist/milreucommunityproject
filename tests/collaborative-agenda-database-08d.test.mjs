/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration=readFileSync("supabase/migrations/20260724100000_collaborative_agenda_exhibitions.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724100100_collaborative_agenda_exhibitions_rpc.sql","utf8");
const seed=readFileSync("supabase/migrations/20260724100200_collaborative_agenda_exhibitions_seed.sql","utf8");

test("banco separa exposição, local, período, evento e participante",()=>{
  for(const entity of [
    "collab_venues","collab_exhibitions","collab_exhibition_schedule",
    "collab_agenda_events","collab_event_participants","collab_exhibition_logistics_checklist"
  ]) assert.ok(migration.includes(entity),entity);
});

test("sobreposição da mesma exposição é impedida",()=>{
  assert.match(migration,/exclude using gist/);
  assert.match(migration,/collab_exhibition_schedule_no_overlap/);
  assert.match(rpc,/exhibition_schedule_overlap/);
});

test("RLS diferencia público, membros e gestão",()=>{
  assert.match(migration,/to anon,authenticated/);
  assert.match(migration,/agenda\.view/);
  assert.match(migration,/agenda\.manage/);
  assert.match(seed,/exhibitions\.publish/);
  assert.match(seed,/select 'master',code/);
});

test("logística gera tarefas ligadas ao período",()=>{
  assert.match(rpc,/collab_generate_logistics_tasks_08d/);
  assert.match(rpc,/source_entity_type/);
  assert.match(rpc,/Montagem/);
  assert.match(rpc,/Desmontagem/);
});

test("RPCs endurecem limites de projeto e concorrência",()=>{
  assert.doesNotMatch(rpc,/'status',schedule\.status\n\s*'status'/);
  for(const guard of [
    "venue_project_mismatch","exhibition_project_mismatch","schedule_project_mismatch",
    "event_project_mismatch","checklist_project_mismatch"
  ]) assert.match(rpc,new RegExp(guard));
  assert.match(rpc,/for update;/);
  assert.match(rpc,/invalid_conflict_request/);
});
