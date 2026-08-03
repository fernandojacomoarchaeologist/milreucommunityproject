/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const model = read("public/data/collaborative-pilot-model.json");
const modules = read("public/data/collaborative-modules.json");
const roles = read("public/data/collaborative-roles-permissions.json");
const readiness = read("public/data/pilot-readiness.json");

test("modelo do piloto está na versão 0.22.0 e staging-only", () => {
  assert.equal(model.version, "0.37.0");
  assert.equal(model.environmentRule, "staging-only");
});

test("modelo mantém efeitos públicos, produção, e-mail, chat e gravação desativados", () => {
  for (const flag of ["publicEffectsEnabled", "productionWritesEnabled", "emailEnabled", "chatEnabled", "recordingEnabledByDefault"]) {
    assert.equal(model[flag], false, flag);
  }
});

test("módulo pilot registado com pilot.view", () => {
  assert.ok(modules.modules.some((m) => m.code === "pilot" && m.permission === "pilot.view" && m.status === "active"));
});

test("catálogo tem 127 permissões e as 10 do piloto", () => {
  assert.equal(roles.permissions.length, 152);
  for (const p of ["pilot.view", "pilot.manage", "pilot.approve", "pilot.evidence.manage"]) assert.ok(roles.permissions.includes(p));
});

test("pilot.approve é exclusivo do master", () => {
  assert.ok(!roles.rolePermissions.coordinator.includes("pilot.approve"));
  assert.deepEqual(roles.rolePermissions.master, ["*"]);
});

test("readiness inicia honestamente bloqueado", () => {
  for (const gate of ["pilotReadiness", "stagingHomologation", "productionApproval"]) {
    assert.equal(readiness[gate], "blocked", gate);
  }
});
