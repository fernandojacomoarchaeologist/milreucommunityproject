/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const carousel = JSON.parse(readFileSync("public/data/home-carousel.json","utf8"));
const portal = readFileSync("src/views/portal.js","utf8");
const museum = readFileSync("src/views/museum.js","utf8");
const main = readFileSync("src/main.js","utf8");
const css = readFileSync("src/styles/app.css","utf8");

test("Home tem Museu, Proteus e Inquérito", () => {
  assert.deepEqual(carousel.slides.map(slide => slide.id),["museum","proteus","survey-2026"]);
  assert.equal(carousel.slides[1].kind,"empty-state");
  assert.equal(carousel.slides[2].primaryAction.href,"https://pt.surveymonkey.com/r/3CFG2MQ");
  assert.ok(existsSync(carousel.slides[2].image));
});

test("carrossel automático e controlável", () => {
  assert.match(portal,/data-home-carousel-previous/);
  assert.match(portal,/data-home-carousel-next/);
  assert.match(portal,/data-home-carousel-pause/);
  assert.match(main,/scheduleHomeCarousel/);
  assert.match(main,/prefers-reduced-motion/);
});

test("Iniciativas usa título e descrição em linhas distintas", () => {
  assert.match(portal,/section-heading--stacked/);
  assert.match(css,/\.section-heading--stacked\{display:block\}/);
});

test("Museu abre sem sumário estatístico", () => {
  assert.doesNotMatch(museum,/museum-dashboard/);
});

test("modo imersivo tem retorno persistente", () => {
  assert.match(museum,/immersive-return-fixed/);
  assert.match(museum,/immersive-close-fixed/);
  assert.match(main,/querySelectorAll\("\[data-close-immersive\]"\)/);
});

test("imagem imersiva encaixa no viewport", () => {
  assert.match(css,/width:auto!important/);
  assert.match(css,/height:auto!important/);
  assert.match(css,/max-width:100%!important/);
  assert.match(css,/max-height:100%!important/);
  assert.match(css,/object-fit:contain!important/);
});
