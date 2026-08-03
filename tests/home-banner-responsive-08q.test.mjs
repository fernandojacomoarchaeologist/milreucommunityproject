/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");

test("o contrato do banner proíbe corte de texto/botões e permite crop de imagem", () => {
  const m = read("public/data/home-banner-responsive-model.json");
  assert.equal(m.version, "0.35.0");
  assert.equal(m.canonicalOuterBoxSource, "museu-de-memorias");
  assert.equal(m.textClippingAllowed, false);
  assert.equal(m.buttonClippingAllowed, false);
  assert.equal(m.mediaCroppingAllowed, true);
  assert.equal(m.maxSameViewportBoxDifferenceCssPx, 1);
  assert.equal(m.autoplayMustRemainFunctional, true);
  for (const el of ["title", "subtitle", "actions"]) assert.ok(m.requiredVisibleElements.includes(el));
});

test("os slides partilham a caixa (empilhados) e o crop é só na media", () => {
  const css = text("src/styles/app.css");
  assert.match(css, /\.home-carousel__viewport\{[^}]*display:grid/);
  assert.match(css, /\.home-carousel__slide\{[^}]*grid-area:1\/1/);
  assert.doesNotMatch(css, /\.home-carousel__slide\{[^}]*overflow:hidden/);
  assert.match(css, /\.home-carousel__media\{[^}]*overflow:hidden/);
});

test("a imagem vertical não força a altura do card", () => {
  const css = text("src/styles/app.css");
  assert.match(css, /\.home-carousel__survey-image img\{[^}]*position:absolute/);
});

test("existe o equalizador de caixa por scrollHeight e o auto-play é preservado", () => {
  const main = text("src/main.js");
  assert.match(main, /function equalizeHomeCarousel\(\)/);
  assert.match(main, /scrollHeight/);
  assert.match(main, /equalizeHomeCarousel\(\);/);
  assert.match(main, /function scheduleHomeCarousel\(\)/);
});

test("a auditoria responsiva cobre as 4 áreas e todas as verificações", () => {
  const contract = read("public/data/responsive-audit-report.json");
  const report = read("reports/responsive-audit-08q.json");
  const byArea = new Map(report.areas.map((a) => [a.area, a]));
  const allowed = new Set(contract.allowedStatuses);
  for (const area of contract.areas) {
    const entry = byArea.get(area);
    assert.ok(entry, `área ausente: ${area}`);
    assert.ok(allowed.has(entry.status));
    for (const check of contract.requiredChecks) assert.ok(allowed.has(entry.checks[check]), `${area}/${check}`);
  }
  assert.equal(byArea.get("portal").status, "responsive-fixed");
  assert.match(report.humanAccessibilityGate, /pending-human-review/);
});
