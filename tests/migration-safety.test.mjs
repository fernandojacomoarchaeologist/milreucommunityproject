/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("POC é marcado como demonstrativo", () => {
  const sql = readFileSync(
    "supabase/migrations/20260723000100_create_proteus_poc.sql",
    "utf8"
  );
  assert.match(sql, /demonstration/);
  assert.match(sql, /enable row level security/i);
});

test("workflow produtivo não usa gatilho push", () => {
  const yaml = readFileSync(".github/workflows/05f-production-migration.yml", "utf8");
  assert.match(yaml, /workflow_dispatch/);
  assert.doesNotMatch(yaml, /^\s*push:/m);
  assert.match(yaml, /environment:\s*production/);
});
