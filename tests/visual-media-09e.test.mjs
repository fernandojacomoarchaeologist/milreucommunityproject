/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const sha256 = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");

test("inventário de media: 31 originais + 4 variantes cada, campos obrigatórios do schema", () => {
  const inv = read("reports/media-inventory-09e.json");
  const schemaReq = read("contracts/09e/media-asset-record.schema.json").required;
  assert.equal(inv.counts.historicalOriginals, 31);
  assert.equal(inv.counts.historicalDerivatives, 31 * 4);
  for (const a of inv.assets) for (const k of schemaReq) assert.ok(k in a, `${a.path} sem ${k}`);
});

test("originais históricos inalterados byte a byte (sha256 == manifesto)", () => {
  const manifest = read("public/data/media-manifest.json");
  let n = 0;
  for (const item of manifest.items) { assert.equal(sha256(item.originalPath), item.sha256, item.originalPath); n++; }
  assert.equal(n, 31);
});

test("inventário de fontes é honesto: 3 famílias declaradas mas ausentes, sem ficheiros nem 404", () => {
  const f = read("reports/font-inventory-09e.json");
  assert.equal(f.summary.fontFilesInRepo, 0);
  assert.equal(f.summary.fontFaceDeclarations, 0);
  assert.equal(f.summary.externalFontServiceDetected, false);
  assert.equal(f.declaredFamilies.length, 3);
  for (const fam of f.declaredFamilies) {
    assert.equal(fam.status, "declared-but-absent");
    assert.equal(fam.licenseStatus, "pending");
    assert.equal(fam.hasFontFace, false);
    assert.equal(fam.computedEvidence, "system-fallback");
  }
});

test("nenhum @font-face aponta para ficheiro inexistente (guardrail font404=0)", () => {
  const css = ["src/styles/app.css", "src/styles/components.css", "src/styles/tokens.css"].map(text).join("\n");
  assert.doesNotMatch(css, /@font-face/);
});

test("estratégia responsiva: LCP com prioridade e srcset; cards lazy", () => {
  const museum = text("src/views/museum.js");
  assert.match(museum, /museum-opening__image"[\s\S]{0,240}fetchpriority="high"/);
  assert.match(museum, /museum-opening__image"[\s\S]{0,240}srcset=/);
  assert.doesNotMatch(museum, /museum-opening__image"[\s\S]{0,240}loading="lazy"/);
  const portal = text("src/views/portal.js");
  assert.match(portal, /home-carousel__media[\s\S]{0,240}srcset=/);
  const card = text("src/components/memory-card.js");
  assert.match(card, /loading="lazy"/);
  assert.match(card, /decoding="async"/);
});

test("baseline: LCP mobile serve variante menor que a immersive (benefício de bytes real)", () => {
  const b = read("reports/visual-performance-baseline-09e.json");
  assert.ok(b.measured.lcpCandidateImageBytes.museumOpeningMobile < b.measured.lcpCandidateImageBytes.desktopHomeHero);
  assert.equal(b.fieldMetrics.mobileLcpMs, "pending-local-browser-and-staging");
});

test("09E não altera módulos/permissões (o SEO/OG é introduzido só a partir do 09F)", () => {
  assert.equal(read("public/data/collaborative-modules.json").modules.length, 26);
  assert.equal(read("public/data/collaborative-roles-permissions.json").permissions.length, 152);
});
