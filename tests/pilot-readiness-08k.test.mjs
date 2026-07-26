/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const readiness = JSON.parse(readFileSync("public/data/pilot-readiness.json", "utf8"));

test("pilot-readiness declara a candidatura técnica pronta mas o piloto bloqueado", () => {
  assert.equal(readiness.technicalCandidate, "ready");
  assert.equal(readiness.pilotReadiness, "blocked");
  assert.equal(readiness.stagingHomologation, "blocked");
  assert.equal(readiness.productionApproval, "blocked");
});

test("os bloqueadores incluem infraestrutura e revisão humana", () => {
  assert.ok(Array.isArray(readiness.blockingItems) && readiness.blockingItems.length >= 5);
  const joined = readiness.blockingItems.join(" ").toLowerCase();
  assert.ok(joined.includes("supabase"));
  assert.ok(joined.includes("oauth") || joined.includes("google"));
  assert.ok(joined.includes("acessibilidade"));
});

test("os scripts de readiness, gates e bundle existem", () => {
  for (const s of ["build-pilot-readiness.mjs", "evaluate-pilot-gates.mjs", "generate-evidence-bundle.mjs", "validate-pilot-model.mjs", "validate-scenario-matrix.mjs"]) {
    assert.ok(existsSync(`scripts/pilot/${s}`), s);
  }
});
