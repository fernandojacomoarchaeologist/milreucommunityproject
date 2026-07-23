/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const main = readFileSync("src/main.js","utf8");
const museum = readFileSync("src/views/museum.js","utf8");
const router = readFileSync("src/lib/router.js","utf8");

test("modo de ecrã inteiro permanece", () => {
  assert.match(router,/museu\\\/imersivo|museu\/imersivo/);
  assert.match(museum,/immersiveView/);
  assert.match(museum,/variants\.immersive/);
});

test("Escape regressa ao detalhe", () => {
  assert.match(main,/event\.key === "Escape"/);
  assert.match(main,/museu\/memorias/);
});

test("navegação anterior e seguinte permanece", () => {
  assert.match(museum,/prev\.id/);
  assert.match(museum,/next\.id/);
});
