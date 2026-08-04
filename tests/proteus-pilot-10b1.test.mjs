/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10B.1 — testes do piloto catalográfico controlado e da derivação pública.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const records = read("data/proteus/pilot-records.json").records;
const agents = read("data/proteus/pilot-agents.json").agents;
const cat = read("public/data/proteus-catalog-public.json");

test("piloto: 6 registos e 4 agentes, IDs únicos", () => {
  assert.equal(records.length, 6);
  assert.equal(agents.length, 4);
  assert.equal(new Set(records.map((r) => r.id)).size, 6);
  assert.equal(new Set(agents.map((a) => a.id)).size, 4);
});

test("texto integral nunca alojado; processamento negado nesta fase", () => {
  for (const r of records) {
    assert.equal(r.full_text_hosted, false, `${r.id} não pode alojar texto integral`);
    assert.equal(r.processing_allowed_in_10b1, false, `${r.id} não pode ser processado`);
  }
});

test("exatamente 1 acesso aberto e é o RUN", () => {
  const open = records.filter((r) => r.access_status === "open");
  assert.equal(open.length, 1);
  assert.match(`${open[0].external_full_text_url} ${open[0].source_record_url}`, /run\.unl\.pt/);
});

test("Teichner 2006 permanece com licença desconhecida (ResearchGate ≠ aberto)", () => {
  const t = records.find((r) => /teichner-2006/.test(r.id));
  assert.ok(t);
  assert.notEqual(t.access_status, "open");
  assert.equal(t.reuse_license_label, "unknown");
});

test("exatamente 2 registos privados, fora do snapshot público", () => {
  const priv = records.filter((r) => r.public_metadata === false);
  assert.equal(priv.length, 2);
  const slugs = JSON.stringify(cat.works.map((w) => w.slug));
  for (const p of priv) assert.doesNotMatch(slugs, new RegExp(p.id.replace(/^work-/, "")));
});

test("snapshot derivado: 3 obras, 2 autores públicos (sem Jácomo), 1 recurso dinâmico", () => {
  assert.equal(cat.works.length, 3);
  assert.equal(cat.authors.length, 2);
  assert.doesNotMatch(JSON.stringify(cat.authors), /Jácomo|Jacomo/i);
  assert.equal(cat.externalResources.length, 1);
  assert.ok(cat.externalResources[0].lastVerified);
  assert.ok(cat.externalResources[0].stalenessNotice);
  assert.equal(cat.works.filter((w) => w.openAccess).length, 1);
});

test("nenhum ficheiro fornecido nem manifesto de origem foi committado", () => {
  assert.equal(existsSync("data/proteus/source-manifest.json"), false);
  const blob = JSON.stringify(records) + JSON.stringify(agents);
  assert.doesNotMatch(blob, /content\s*\(10\)|\.docx\b/i);
});
