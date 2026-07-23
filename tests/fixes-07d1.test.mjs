/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const content = JSON.parse(readFileSync("public/data/portal-content.json","utf8"));
const portal = readFileSync("src/views/portal.js","utf8");
const museum = readFileSync("src/views/museum.js","utf8");
const layout = readFileSync("src/components/layout.js","utf8");
const main = readFileSync("src/main.js","utf8");
const i18n = readFileSync("src/lib/i18n.js","utf8");

test("pilares do projeto", () => {
  assert.deepEqual(
    content.project.principles.map(item => item.title["pt-PT"]),
    ["Comunicação","Mutualidade","Pertinência Social e Política"]
  );
});

test("home sem explicações internas", () => {
  assert.doesNotMatch(portal,/Um projeto, várias formas de encontro/);
  assert.doesNotMatch(portal,/Evolução incremental do Museu/);
});

test("iniciativas sem relação multicanal e Museu com CTA", () => {
  assert.doesNotMatch(portal,/Relação multicanal/);
  assert.match(portal,/museu-de-memorias/);
  assert.match(portal,/accessMuseum/);
});

test("header e retorno do Museu", () => {
  assert.match(layout,/site-brand/);
  assert.match(layout,/museum-return-floating/);
  assert.doesNotMatch(layout,/class="back-project"/);
});

test("X e slideshow", () => {
  assert.match(museum,/data-close-immersive/);
  assert.match(main,/closeImmersive/);
  assert.match(main,/1: 15000/);
  assert.match(main,/2: 7000/);
  assert.match(main,/3: 4000/);
});

test("timeline e coleções limpas", () => {
  const timeline = museum.slice(museum.indexOf("function timelineItem"),museum.indexOf("function selectField"));
  const collection = museum.slice(museum.indexOf("export function collectionDetailView"),museum.indexOf("export function detailView"));
  assert.doesNotMatch(timeline,/date\.precision|<small>/);
  assert.doesNotMatch(collection,/<details>|JSON\.stringify/);
});

test("Experiência Proteus", () => {
  assert.match(i18n,/knowledge:"Experiência Proteus"/);
});
