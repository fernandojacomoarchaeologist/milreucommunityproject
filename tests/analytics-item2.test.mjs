/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2 — estatística de visitas (Umami, sem cookies): desligada por omissão, só no domínio público,
 * respeita Do Not Track, não mede a Área Colaborativa, funil museu/agenda/inquérito.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { analyticsAllowed, funnelStep, isTrackedRoute, FUNNEL_EVENTS } from "../src/lib/analytics.js";

const config = JSON.parse(readFileSync("public/config/analytics.runtime.json", "utf8"));
const on = { ...config, enabled: true, websiteId: "00000000-0000-4000-8000-000000000000", scriptUrl: "https://cloud.umami.is/script.js" };

test("versionado desligado e sem identificador", () => {
  assert.equal(config.enabled, false);
  assert.equal(config.websiteId, null);
  assert.equal(analyticsAllowed(config, "projectomilreu.pt", null), false);
});

test("só no domínio público e respeita Do Not Track", () => {
  assert.equal(analyticsAllowed(on, "projectomilreu.pt", null), true);
  assert.equal(analyticsAllowed(on, "localhost", null), false);
  assert.equal(analyticsAllowed(on, "projectomilreu.pt", "1"), false);
  assert.equal(analyticsAllowed({ ...on, scriptUrl: "http://x/script.js" }, "projectomilreu.pt", null), false);
});

test("funil e exclusão da Área Colaborativa", () => {
  assert.equal(funnelStep({ name: "memory" }), FUNNEL_EVENTS.museum);
  assert.equal(funnelStep({ name: "public-exhibition-entry" }), FUNNEL_EVENTS.agenda);
  assert.equal(funnelStep({ name: "home" }), null);
  assert.equal(isTrackedRoute({ name: "collab-dashboard" }), false);
  assert.equal(isTrackedRoute({ name: "home" }), true);
  const rights = readFileSync("src/views/rights.js", "utf8");
  assert.match(rights, /analytics \? `<section/);
});
