/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync, readFileSync, statSync } from "node:fs";

const carousel = JSON.parse(readFileSync("public/data/home-carousel.json","utf8"));
const portal = readFileSync("src/views/portal.js","utf8");
const museum = readFileSync("src/views/museum.js","utf8");
const main = readFileSync("src/main.js","utf8");
const css = readFileSync("src/styles/app.css","utf8");

if (carousel.version !== "0.11.2") throw new Error("Versão do carrossel inválida.");
if (carousel.slides.length !== 3) throw new Error("A Home deve possuir três destaques.");
if (carousel.slides[0].id !== "museum") throw new Error("O Museu deve ser o primeiro destaque.");
if (carousel.slides[1].kind !== "empty-state" || carousel.slides[1].id !== "proteus") {
  throw new Error("Experiência Proteus deve ser o segundo destaque sem imagem.");
}
const survey = carousel.slides[2];
if (survey.id !== "survey-2026" || survey.primaryAction.href !== "https://pt.surveymonkey.com/r/3CFG2MQ") {
  throw new Error("Destaque do Inquérito 2026 incorreto.");
}
if (!existsSync(survey.image) || statSync(survey.image).size === 0) {
  throw new Error("Imagem do Inquérito 2026 ausente.");
}

for (const required of [
  "data-home-carousel-previous",
  "data-home-carousel-next",
  "data-home-carousel-index",
  "data-home-carousel-pause",
  "proteus-empty-state",
  'target="_blank" rel="noopener noreferrer external"'
]) {
  if (!portal.includes(required)) throw new Error(`Carrossel incompleto: ${required}`);
}

for (const required of [
  "scheduleHomeCarousel",
  "clearHomeCarouselTimer",
  "homeCarouselIndex",
  "homeCarouselPaused",
  "prefers-reduced-motion"
]) {
  if (!main.includes(required)) throw new Error(`Motor do carrossel incompleto: ${required}`);
}

if (museum.includes("museum-dashboard")) throw new Error("Resumo estatístico ainda aparece na Home do Museu.");
for (const required of ["immersive-return-fixed","immersive-close-fixed","data-close-immersive"]) {
  if (!museum.includes(required)) throw new Error(`Retorno imersivo incompleto: ${required}`);
}
if (!main.includes('querySelectorAll("[data-close-immersive]")')) {
  throw new Error("Controlos imersivos não possuem handler múltiplo.");
}

for (const required of [
  ".immersive-return-fixed",
  ".immersive-close-fixed",
  ".immersive-frame img",
  "width:auto!important",
  "height:auto!important",
  "max-width:100%!important",
  "max-height:100%!important",
  "object-fit:contain!important"
]) {
  if (!css.includes(required)) throw new Error(`Ajuste da imagem imersiva ausente: ${required}`);
}

if (!portal.includes("section-heading--stacked") || !css.includes(".section-heading--stacked")) {
  throw new Error("Título e descrição de iniciativas ainda não estão empilhados.");
}

console.log("Hotfix 07D.2 validado.");
