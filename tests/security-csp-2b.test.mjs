/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2B — CSP (meta, GitHub Pages): política presente e restrita; nada inline que a obrigue a relaxar.
 * Verificação em browser: scripts/security/csp-browser-check.mjs.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1] || "";
const directive = name => csp.split(";").map(part => part.trim()).find(part => part.startsWith(`${name} `)) || "";

test("index.html tem CSP restrita: só scripts e estilos do próprio site", () => {
  assert.ok(csp, "CSP em falta");
  assert.equal(directive("default-src"), "default-src 'self'");
  assert.equal(directive("script-src"), "script-src 'self' https://cloud.umami.is");
  assert.equal(directive("style-src"), "style-src 'self'");
  assert.equal(directive("object-src"), "object-src 'none'");
  assert.equal(directive("base-uri"), "base-uri 'self'");
  assert.doesNotMatch(csp, /'unsafe-inline'|'unsafe-eval'|data:|blob:/);
  // Só a estatística e a função do formulário são externas.
  for (const host of directive("connect-src").split(" ").slice(1)) {
    assert.match(host, /^('self'|https:\/\/(cloud|gateway|gateway-eu)\.umami\.is|https:\/\/\*\.supabase\.co)$/, host);
  }
  // A CSP vem antes de qualquer script.
  assert.ok(html.indexOf("Content-Security-Policy") < html.indexOf("<script"));
});

test("nenhum script inline executável nem handlers inline no index.html", () => {
  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/type="application\/ld\+json"/.test(attrs)) continue; // dados, não executa
    assert.match(attrs, /\ssrc="/, "script inline executável");
    assert.equal(body.trim(), "");
  }
  assert.doesNotMatch(html, /\son[a-z]+="/);
});

test("404.html: script de redireccionamento autorizado só pelo seu hash", () => {
  const page = readFileSync("404.html", "utf8");
  const body = page.match(/<script>([\s\S]*?)<\/script>/)[1];
  const hash = `sha256-${createHash("sha256").update(body, "utf8").digest("base64")}`;
  assert.ok(page.includes(`script-src '${hash}'`), "hash do script do 404 não corresponde");
  assert.match(page, /default-src 'none'/);
});

test("vistas sem atributos style (incompatíveis com style-src 'self')", () => {
  const files = [];
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const path = `${dir}/${name}`;
      if (statSync(path).isDirectory()) walk(path);
      else if (path.endsWith(".js")) files.push(path);
    }
  })("src");
  for (const file of files) assert.doesNotMatch(readFileSync(file, "utf8"), /\sstyle="/, file);
  assert.match(readFileSync("src/main.js", "utf8"), /function applyDataStyles/);
});
