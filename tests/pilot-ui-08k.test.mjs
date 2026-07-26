/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const router = readFileSync("src/lib/router.js", "utf8");
const view = readFileSync("src/views/collaborative-pilot.js", "utf8");
const main = readFileSync("src/main.js", "utf8");
const layout = readFileSync("src/components/collaborative-layout.js", "utf8");

test("as rotas do piloto existem", () => {
  for (const name of ["collab-pilot", "collab-pilot-management"]) assert.ok(router.includes(name));
  assert.ok(router.includes("/area-colaborativa/piloto"));
  assert.ok(router.includes("/area-colaborativa/gestao/piloto"));
});

test("as vistas de participação e gestão existem", () => {
  for (const fn of ["collaborativePilotView", "collaborativePilotManagementView"]) assert.ok(view.includes(fn));
});

test("main.js despacha e liga os formulários do piloto", () => {
  assert.ok(main.includes("collaborativePilotView"));
  assert.ok(main.includes("collaborativePilotManagementView"));
  for (const marker of ["data-pilot-confirm-form", "data-pilot-feedback-form", "data-pilot-withdraw-form", "data-pilot-cycle-form", "data-pilot-enrol-form", "data-pilot-gate-form", "data-pilot-approve-form"]) {
    assert.ok(main.includes(marker), marker);
  }
  assert.ok(main.includes("collaborative.pilotAction"));
});

test("a gestão do piloto aparece no menu, gated por pilot.manage", () => {
  assert.ok(layout.includes('hasPermission(context,"pilot.manage")'));
  assert.ok(layout.includes("Piloto e homologação"));
});

test("a vista exibe o aviso de bloqueio de staging/produção", () => {
  assert.ok(view.includes("APPROVE_MILREU_STAGING_HOMOLOGATION"));
  assert.ok(view.includes("aria-live"));
});
