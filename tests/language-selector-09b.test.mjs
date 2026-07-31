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

test("o contrato de idiomas mantém pt-PT selecionável e EN/ES/FR em preparação", () => {
  const m = read("public/data/language-availability-model.json");
  assert.equal(m.version, "0.31.0");
  assert.equal(m.silentFallbackAllowed, false);
  assert.equal(m.locales["pt-PT"].selectorEnabled, true);
  for (const c of ["en", "es", "fr"]) {
    assert.equal(m.locales[c].status, "preparation");
    assert.equal(m.locales[c].selectorEnabled, false);
  }
});

test("o i18n espelha o contrato e expõe isLocaleSelectable", () => {
  const i18n = text("src/lib/i18n.js");
  assert.match(i18n, /languageAvailability\s*=/);
  assert.match(i18n, /export const isLocaleSelectable/);
  assert.match(i18n, /"pt-PT":\s*\{\s*status:\s*"published",\s*selectorEnabled:\s*true\s*\}/);
});

test("o seletor desativa EN/ES/FR e assinala em preparação", () => {
  const layout = text("src/components/layout.js");
  assert.match(layout, /language-switcher__option--preparation/);
  assert.match(layout, /aria-disabled="true"/);
  assert.match(layout, /disabled/);
});

test("setLanguage recusa idiomas não selecionáveis (sem navegação falsa)", () => {
  const main = text("src/main.js");
  assert.match(main, /if\s*\(!isLocaleSelectable\(lang\)\)\s*return;/);
});

test("o footer não expõe código de pacote de dev", () => {
  const layout = text("src/components/layout.js");
  assert.doesNotMatch(layout, /Vers[aã]o\s*08A/);
});

test("os relatórios da auditoria semântica existem e as fugas públicas estão corrigidas", () => {
  const leaks = read("reports/public-instruction-leaks-09b.json");
  for (const l of leaks.publicLeaks) assert.equal(l.action, "fixed");
  const audit = read("reports/semantic-audit-09b.json");
  assert.ok(audit.items.length >= 10);
});
