/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const controller=readFileSync("src/collab/controller.js","utf8");

test("controller carrega workspace completo",()=>{
  for(const table of [
    "collab_venues","collab_exhibitions","collab_exhibition_schedule",
    "collab_agenda_events","collab_event_participants","collab_exhibition_logistics_checklist"
  ]) assert.ok(controller.includes(table),table);
});

test("controller cobre ciclo da itinerância",()=>{
  for(const method of [
    "saveVenue","saveExhibition","checkScheduleConflicts","saveSchedule",
    "saveAgendaEvent","rsvpEvent","saveChecklistItem","publishSchedule","generateLogisticsTasks"
  ]) assert.ok(controller.includes(`async ${method}`),method);
});

test("modo demo é isolado e explicitamente fictício",()=>{
  assert.match(controller,/createDemoExhibitionWorkspace/);
  assert.match(controller,/Espaço Cultural de demonstração/);
  assert.match(controller,/Não corresponde a um local real/);
  assert.match(controller,/local\.invalid/);
});
