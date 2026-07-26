/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const controller = readFileSync("src/collab/controller.js", "utf8");

test("o controller expõe o workspace do piloto", () => {
  assert.ok(controller.includes("emptyPilotWorkspace"));
  assert.ok(controller.includes("pilotWorkspace:emptyPilotWorkspace()"));
});

test("o controller carrega o piloto por RPC (workspace)", () => {
  assert.ok(controller.includes("loadRemotePilot"));
  assert.ok(controller.includes("collab_pilot_workspace"));
});

test("pilotAction verifica permissões e não escreve em demo", () => {
  assert.ok(controller.includes("async pilotAction"));
  assert.ok(controller.includes('"pilot.approve"'));
  assert.ok(/demonstração não cria ciclos/.test(controller));
});

test("pilotAction mapeia as ações para as RPCs corretas", () => {
  for (const rpc of ["collab_pilot_confirm_participation", "collab_pilot_submit_observation", "collab_pilot_enrol_participant", "collab_pilot_approve_staging_homologation"]) {
    assert.ok(controller.includes(rpc), rpc);
  }
});

test("o workspace do piloto começa sem escrita de produção nem efeitos públicos", () => {
  assert.ok(/emptyPilotWorkspace\(\)\{return\{[^}]*productionWrites:false[^}]*publicEffects:false/.test(controller));
});
