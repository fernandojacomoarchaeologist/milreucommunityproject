/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync("public/data/portal-content.json","utf8"));
const router = readFileSync("src/lib/router.js","utf8");
const portal = readFileSync("src/views/portal.js","utf8");

test("Portal tem conteúdo estruturado", () => {
  assert.equal(data.sourceLanguage,"pt-PT");
  assert.ok(data.initiatives.length >= 5);
});

test("rotas institucionais", () => {
  for (const route of ["/projeto","/metodologia","/iniciativas","/conhecimento","/participar","/sobre"]) {
    assert.match(router,new RegExp(route.replaceAll("/","\\/")));
  }
});

test("sem contacto inventado", () => {
  assert.doesNotMatch(portal,/example\.invalid/);
});
