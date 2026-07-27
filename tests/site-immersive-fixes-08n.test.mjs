/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const site=JSON.parse(readFileSync("public/data/site-refinement-model.json","utf8"));
const carousel=JSON.parse(readFileSync("public/data/home-carousel.json","utf8"));
const css=readFileSync("src/styles/app.css","utf8");
const museum=readFileSync("src/views/museum.js","utf8");
const main=readFileSync("src/main.js","utf8");
test("carrossel com autoplay e 3 slides",()=>{assert.equal(site.carouselAutoplayEnabled,true);assert.ok(carousel.autoplay.enabled);assert.equal(carousel.slides.length,3);});
test("imagem do Inquérito recortada e consistente (object-fit:cover)",()=>{assert.ok(/\.home-carousel__survey-image img\{[^}]*object-fit:cover/.test(css));});
test("imersivo tem retorno ao Portal e preserva Voltar ao Museu/fecho",()=>{assert.ok(museum.includes("data-immersive-portal"));assert.ok(museum.includes("Voltar ao Museu"));assert.ok(museum.includes("data-close-immersive"));assert.ok(main.includes("data-immersive-portal"));});
test("0 efeitos públicos ativos",()=>{assert.equal(site.publicEffectsActive,0);});
