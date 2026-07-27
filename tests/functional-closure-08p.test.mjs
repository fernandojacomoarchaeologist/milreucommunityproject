/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");

const contract = read("public/data/collaborative-functional-closure.json");
const report = read("reports/functional-closure-08p.json");

test("o relatório cobre as 10 áreas com estados permitidos", () => {
  const allowed = new Set(contract.allowedAuditStatuses);
  const byCode = new Map(report.areas.map((a) => [a.code, a]));
  for (const code of contract.areas) {
    const area = byCode.get(code);
    assert.ok(area, `área ausente: ${code}`);
    assert.ok(allowed.has(area.status), `estado inválido em ${code}`);
    assert.ok(area.evidence && area.files?.length && area.test, `${code} incompleto`);
    if (area.status === "fixed") assert.ok(area.fix, `${code} fixed sem descrição`);
    if (area.status === "blocked") assert.ok(area.blocker, `${code} blocked sem justificação`);
  }
});

test("a acessibilidade humana não é promovida automaticamente", () => {
  const gate = read("public/data/human-accessibility-gate.json");
  assert.equal(gate.automaticPromotionToPassed, false);
  assert.equal(gate.status, "pending-human-review");
  const human = report.areas.find((a) => a.code === "human-accessibility");
  assert.notEqual(human.status, "passed");
  assert.equal(human.status, "blocked");
});

test("não há expansão arquitetural (25 módulos, 149 permissões, 0 migrations)", () => {
  const modules = read("public/data/collaborative-modules.json").modules;
  const permissions = read("public/data/collaborative-roles-permissions.json").permissions;
  assert.equal(report.moduleCount, modules.length);
  assert.equal(report.permissionCount, permissions.length);
  assert.equal(contract.newModulesExpected, 0);
  assert.equal(contract.newPermissionsExpected, 0);
  assert.equal(contract.newMigrationsExpected, 0);
});

test("o primeiro acesso distingue suspenso, removido e recusado sem notas internas", () => {
  const view = text("src/views/collaborative.js");
  assert.match(view, /membershipBlockedView/);
  assert.match(view, /status\s*===\s*"suspended"/);
  assert.match(view, /"archived"\s*\|\|\s*status\s*===\s*"removed"|"archived"|"removed"/);
  assert.match(view, /não são apresentadas notas internas/);
});

test("a biblioteca mostra finalidade, fonte e audiência", () => {
  const view = text("src/views/collaborative-museum-review.js");
  assert.match(view, /collab-library-source/);
  assert.match(view, /Fonte:/);
  assert.match(view, /collab-library-meta/);
});

test("os bloqueadores externos são listados, não resolvidos pelo código", () => {
  assert.ok(Array.isArray(report.externalBlockers) && report.externalBlockers.length >= 5);
});
