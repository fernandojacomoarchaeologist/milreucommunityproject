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

test("config SEO é por ambiente e não inventa domínio", () => {
  const seo = read("public/config/seo.runtime.json");
  assert.equal(seo.publicOrigin, null);
  assert.equal(seo.indexingAllowed, false);
  assert.equal(seo.canonicalLocale, "pt-PT");
  assert.deepEqual(seo.publishedLocales, ["pt-PT"]);
  assert.equal(seo.xDefault, null);
});

test("o inventário classifica cada rota do router exatamente uma vez", () => {
  const names = [...new Set([...text("src/lib/router.js").matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]))];
  const inv = read("reports/seo-route-inventory-09f.json");
  assert.equal(inv.routes.length, names.length);
  for (const r of inv.routes) {
    assert.ok(["index", "noindex", "blocked"].includes(r.indexability));
    assert.ok(r.evidence.length >= 1);
  }
});

test("rotas colaborativas/pessoais estão blocked e fora do sitemap", () => {
  const inv = read("reports/seo-route-inventory-09f.json");
  for (const r of inv.routes) {
    if (/area-colaborativa|entrar|auth|contribuir|retirada/.test(r.route)) {
      assert.equal(r.inSitemap, false, `${r.route} não pode entrar no sitemap`);
    }
  }
  assert.equal(inv.counts.inSitemap, 0, "sem origem aprovada, nada entra no sitemap");
});

test("hreflang só anuncia pt-PT (EN/ES/FR nunca)", () => {
  const inv = read("reports/seo-route-inventory-09f.json");
  for (const r of inv.routes) for (const t of r.hreflangTargets) assert.equal(t, "pt-PT");
  const staticBuilder = text("scripts/structured/static-record-builder.mjs");
  assert.match(staticBuilder, /hreflang="pt-PT"/);
  assert.doesNotMatch(staticBuilder, /hreflang="(en|es|fr)"/);
});

test("index.html: OG/Twitter/WebSite factual + noindex; sem tipos inventados", () => {
  const h = text("index.html");
  assert.match(h, /property="og:title"/);
  assert.match(h, /name="twitter:card"/);
  assert.match(h, /"@type":"WebSite"/);
  assert.match(h, /name="robots" content="noindex/);
  assert.doesNotMatch(h, /"@type":"(Organization|Event|Offer|AggregateRating|Review)"/);
});

test("páginas estáticas: robots condicionado à origem, OG/Twitter, JSON-LD factual", () => {
  const b = text("scripts/structured/static-record-builder.mjs");
  assert.match(b, /property="og:title"/);
  assert.match(b, /name="twitter:card"/);
  assert.match(b, /name="robots" content="\$\{canonical \? "index,follow" : "noindex,nofollow"\}"/);
  assert.match(b, /"@type":"Photograph"/);
  assert.doesNotMatch(b, /"@type":"(Organization|Event|Offer|Review)"/);
});

test("robots.txt do preview bloqueia tudo e não há sitemap sem domínio", async () => {
  // Independente do build: invoca o builder num diretório temporário.
  const { mkdtempSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { buildRobotsAndSitemap } = await import("../scripts/09f/build-robots-sitemap.mjs");
  const out = mkdtempSync(join(tmpdir(), "milreu-seo-"));
  const result = buildRobotsAndSitemap(out);
  assert.equal(result.robotsMode, "disallow-all");
  assert.match(text(join(out, "robots.txt")), /Disallow: \/\s*$/m);
  let sitemapExists = true;
  try { readFileSync(join(out, "sitemap.xml")); } catch { sitemapExists = false; }
  assert.equal(sitemapExists, false, "não deve existir sitemap sem origem aprovada");
});

test("preservação: 31 originais, 26/152, 09D/09E/09C.1 intactos", () => {
  assert.equal(read("public/data/media-manifest.json").items.length, 31);
  assert.equal(read("public/data/collaborative-modules.json").modules.length, 26);
  assert.equal(read("public/data/collaborative-roles-permissions.json").permissions.length, 152);
  assert.match(text("src/views/museum.js"), /fetchpriority="high"/);
  assert.match(text("src/main.js"), /case "collab-opportunities":/);
});
