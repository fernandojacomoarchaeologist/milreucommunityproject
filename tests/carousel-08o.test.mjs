/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const ASSET = "public/media/home/inquerito-2026-carousel.png";
const SHA = "ea58885f4c16dbcb524544ce80de46e93bb21bb594b68be6a991ec71f6ccebba";

test("o asset do Inquérito 2026 existe com o SHA-256 e dimensões exatos", () => {
  assert.ok(existsSync(ASSET), "asset ausente");
  assert.equal(createHash("sha256").update(readFileSync(ASSET)).digest("hex"), SHA);
  const carousel = read("public/data/home-carousel.json");
  assert.equal(carousel.assets.surveyAssetWidth, 1030);
  assert.equal(carousel.assets.surveyAssetHeight, 1426);
  assert.equal(carousel.assets.surveyAssetFormat, "PNG");
  assert.equal(carousel.assets.surveyAssetSha256, SHA);
});

test("o asset antigo webp foi removido e desreferenciado", () => {
  assert.ok(!existsSync("public/media/home/inquerito-2026.webp"));
  const carousel = readFileSync("public/data/home-carousel.json", "utf8");
  const css = readFileSync("src/styles/app.css", "utf8");
  assert.ok(!carousel.includes("inquerito-2026.webp"));
  assert.ok(!css.includes("inquerito-2026.webp"));
});

test("o contrato pós-merge fixa fonte canónica, tolerância e auto-play", () => {
  const model = read("public/data/carousel-post-merge-model.json");
  assert.equal(model.version, "0.27.0");
  assert.equal(model.canonicalSizeSource, "museu-de-memorias");
  assert.equal(model.maxBoundingBoxDifferenceCssPixels, 1);
  assert.equal(model.imageFit, "cover");
  assert.equal(model.requiresRealBrowserE2E, true);
  for (const f of ["loop", "pauseOnHover", "pauseOnFocusWithin", "pauseWhenDocumentHidden", "respectReducedMotion", "singleTimer", "resetAfterManualNavigation"]) {
    assert.equal(model.autoplay[f], true, f);
  }
  assert.deepEqual(model.breakpointsToTest, [375, 768, 1280]);
});

test("os três slides usam a caixa canónica com altura fixa e cover", () => {
  const css = readFileSync("src/styles/app.css", "utf8");
  assert.match(css, /\.home-carousel__viewport\{[^}]*height:72vh/);
  assert.match(css, /\.home-carousel__slide\{[^}]*height:72vh/);
  assert.doesNotMatch(css, /\.home-carousel__viewport\{[^}]*min-height:72vh/);
  assert.match(css, /object-fit:cover/);
});

test("o carrossel tem 3 slides: Museu (canónico), Proteus (sem imagem) e Inquérito (asset)", () => {
  const c = read("public/data/home-carousel.json");
  assert.equal(c.version, "0.27.0");
  assert.equal(c.slides.length, 3);
  assert.equal(c.slides[0].kind, "museum-memory");
  assert.equal(c.slides[1].kind, "empty-state");
  assert.ok(!c.slides[1].image, "Proteus não deve ter imagem inventada");
  assert.equal(c.slides[2].image, ASSET);
  assert.ok(c.slides[2].primaryAction.href.includes("surveymonkey.com"));
  assert.equal(c.slides[2].primaryAction.external, true);
});

test("o auto-play tem timer único, pausa em document.hidden e fallback 7000 ms", () => {
  const main = readFileSync("src/main.js", "utf8");
  assert.match(main, /function scheduleHomeCarousel\(\)\s*\{\s*clearHomeCarouselTimer\(\);/);
  assert.match(main, /document\.hidden/);
  assert.match(main, /visibilitychange/);
  assert.match(main, /prefers-reduced-motion/);
  assert.match(main, /config\.intervalMs\s*\|\|\s*7000/);
  assert.match(main, /mouseenter/);
  assert.match(main, /focusin/);
});
