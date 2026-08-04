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

const TARGETS = ["en", "es", "fr"];

test("o registo de conteúdo tem fonte pt-PT, chaves únicas e versão-fonte", () => {
  const r = read("public/data/locale-content-registry.json");
  assert.equal(r.sourceLocale, "pt-PT");
  assert.equal(r.version, "0.38.0");
  const ids = new Set();
  const keys = new Set();
  for (const u of r.content) {
    assert.ok(u.contentId && !ids.has(u.contentId), `contentId único: ${u.contentId}`);
    ids.add(u.contentId);
    assert.ok(u.key && !keys.has(u.key), `chave única: ${u.key}`);
    keys.add(u.key);
    assert.equal(u.sourceLocale, "pt-PT");
    assert.ok(Number.isInteger(u.sourceVersion) && u.sourceVersion >= 1);
  }
});

test("nesta fundação todas as traduções-alvo estão 'missing' e sem texto (nada inventado)", () => {
  const r = read("public/data/locale-content-registry.json");
  for (const u of r.content) {
    for (const target of TARGETS) {
      const tr = u.translations.find((t) => t.locale === target);
      assert.ok(tr, `${u.contentId} deve ter entrada ${target}`);
      assert.equal(tr.status, "missing", `${u.contentId}/${target} deve estar missing`);
      assert.equal(tr.text, null, `${u.contentId}/${target} não pode ter texto`);
      assert.equal(tr.sourceVersion, null);
    }
  }
});

test("os estados editoriais do contrato incluem todo o fluxo e proíbem publicação automática", () => {
  const m = read("contracts/09d/locale-content-model.json");
  for (const s of ["missing", "draft", "machine-draft", "in-review", "changes-requested", "approved", "published", "archived"]) {
    assert.ok(m.statuses.includes(s), `estado em falta: ${s}`);
  }
  assert.equal(m.automaticPublicationAllowed, false);
  assert.equal(m.silentFallbackAllowed, false);
  assert.equal(m.staleDetectionRequired, true);
  const wf = read("contracts/09d/translation-workflow-model.json");
  assert.equal(wf.machineDraftCanPublish, false);
  assert.equal(wf.humanReviewRequired, true);
});

test("a disponibilidade por rota só publica pt-PT (sem tradução publicada nesta fundação)", () => {
  const a = read("public/data/locale-availability.json");
  assert.equal(a.silentFallbackAllowed, false);
  assert.equal(a.hreflangGeneration, false);
  assert.equal(a.fakeTranslatedUrlsAllowed, false);
  for (const [route, def] of Object.entries(a.routes)) {
    assert.ok(def.available.includes("pt-PT"), `${route} deve incluir pt-PT`);
    for (const target of TARGETS) {
      assert.ok(!def.available.includes(target), `${route} não pode publicar ${target}`);
    }
  }
});

test("o glossário exige revisão humana e preserva nomes próprios", () => {
  const g = read("public/data/translation-glossary.json");
  assert.equal(g.status, "seed-requires-human-review");
  for (const t of g.terms) {
    if (t.rule === "preserve-name") {
      assert.equal(t.en, null);
      assert.equal(t.es, null);
      assert.equal(t.fr, null);
    }
  }
});

test("o i18n expõe strings de indisponibilidade e o helper por rota", () => {
  const i18n = text("src/lib/i18n.js");
  for (const key of ["localeUnavailableTitle", "localeUnavailableText", "continueInPortuguese", "languageInPreparationNote"]) {
    assert.match(i18n, new RegExp(key));
  }
  assert.match(i18n, /export function localeAvailableForRoute/);
});

test("localeAvailableForRoute: pt-PT sempre; alvo só quando listado", async () => {
  const { localeAvailableForRoute } = await import("../src/lib/i18n.js");
  const availability = read("public/data/locale-availability.json");
  assert.equal(localeAvailableForRoute(availability, "home", "pt-PT"), true);
  assert.equal(localeAvailableForRoute(availability, "home", "en"), false);
  assert.equal(localeAvailableForRoute(availability, "rota-inexistente", "en"), false);
});

test("o switcher descreve a indisponibilidade de forma acessível", () => {
  const layout = text("src/components/layout.js");
  assert.match(layout, /aria-describedby="language-switcher-note"/);
  assert.match(layout, /data-locale-note/);
});

test("a deteção de stale existe e não sinaliza nada quando não há traduções", () => {
  const r = read("reports/stale-translations-09d.json");
  assert.equal(r.staleCount, 0);
  assert.equal(r.stale.length, 0);
});

test("o registo multilíngue não manipula MM202617 nem altera módulos/permissões", () => {
  const r = text("public/data/locale-content-registry.json");
  assert.doesNotMatch(r, /MM202617/);
  const modules = read("public/data/collaborative-modules.json").modules;
  assert.equal(modules.length, 26);
  const perms = read("public/data/collaborative-roles-permissions.json").permissions;
  assert.equal(perms.length, 152);
});
