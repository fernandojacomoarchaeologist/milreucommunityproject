/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const museum = readFileSync("src/views/museum.js","utf8");

test("sem endereço fictício no Museu", () => {
  assert.doesNotMatch(museum,/example\.invalid/);
});

test("correção conduz à área Participar", () => {
  assert.match(museum,/#\/participar/);
});

test("intervenções digitais são exibidas", () => {
  assert.match(museum,/digitalInterventionNotice/);
  // 2026-10-13 (decisão do responsável): o estado de revisão humana deixa de ser mostrado no site público;
  // continua registado nos dados (humanReviewStatus) e na área de revisão. O tipo de intervenção continua visível.
  assert.match(museum,/digital-intervention-notice/);
});
