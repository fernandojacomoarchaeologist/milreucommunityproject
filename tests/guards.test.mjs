/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  assertKnownEnvironment,
  assertProductionWriteGate,
  assertNoForbiddenSnapshotFields
} from "../scripts/lib/guards.mjs";

test("ambiente local é aceite", () => {
  assert.equal(assertKnownEnvironment({ MILREU_ENV: "local" }), "local");
});

test("ambiente desconhecido é bloqueado", () => {
  assert.throws(() => assertKnownEnvironment({ MILREU_ENV: "other" }));
});

test("produção sem gates é bloqueada", () => {
  assert.throws(() => assertProductionWriteGate({ MILREU_ENV: "production" }));
});

test("produção com todos os gates passa", () => {
  assert.equal(assertProductionWriteGate({
    MILREU_ENV: "production",
    MILREU_ALLOW_PRODUCTION_WRITE: "true",
    MILREU_PRODUCTION_CONFIRMATION: "APPLY_APPROVED_MIGRATIONS",
    MILREU_CHANGE_TICKET: "CHANGE-001",
    CI: "true",
    GITHUB_ACTIONS: "true",
    MILREU_GITHUB_ENVIRONMENT: "production"
  }), true);
});

test("snapshot com email é bloqueado", () => {
  assert.throws(() => assertNoForbiddenSnapshotFields({ email: "x@example.invalid" }));
});
