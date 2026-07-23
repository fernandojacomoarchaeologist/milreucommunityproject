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
const css = readFileSync("src/styles/app.css","utf8");

test("teclado imersivo completo", () => {
  for (const key of ['"Escape"','"ArrowLeft"','"ArrowRight"','"i"','"f"']) assert.match(main,new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")));
});

test("informação e filmstrip", () => {
  assert.match(museum,/immersive-info-panel/);
  assert.match(museum,/immersive-filmstrip/);
  assert.match(museum,/data-browser-fullscreen/);
});

test("imagem não é cortada obrigatoriamente", () => {
  assert.match(css,/object-fit:contain/);
});
