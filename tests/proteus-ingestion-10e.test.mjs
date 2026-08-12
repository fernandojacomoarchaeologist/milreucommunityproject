/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — testes do núcleo puro de ingestão controlada (quarentena).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateProposal, detectDuplicates, normalizeOrder, buildIngestionPreview, INGESTION_STATE } from "../src/proteus/knowledge-ingestion.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const scope = { includedSources: ["src-in"], excludedSources: ["src-out"], canonicalIds: ["a10c1-001"], paginatedSources: [] };
const ok = { id: "p-1", text: "x", language: "pt-PT", epistemicClass: "fact_claim", sourceId: "src-in", locator: { id: "l1", sourceId: "src-in", locatorType: "whole_resource", accessedAt: "2026-08-11" }, confidence: { level: "supported", reasons: ["r"] }, proposedBy: "op", proposedAt: "t" };

test("proposta válida de fonte incluída passa e permanece 'draft'", () => {
  const r = validateProposal(ok, scope);
  assert.equal(r.valid, true, r.errors.join("; "));
  assert.equal(r.state, INGESTION_STATE);
  assert.equal(INGESTION_STATE, "draft");
});

test("fonte excluída, ausente ou ambígua falha fechado", () => {
  assert.equal(validateProposal({ ...ok, sourceId: "src-out" }, scope).valid, false);
  assert.equal(validateProposal({ ...ok, sourceId: "src-missing" }, scope).valid, false);
  assert.equal(validateProposal({ ...ok, sourceId: "" }, scope).valid, false);
});

test("colisão com id canónico, confiança probabilística e citação sem direitos falham", () => {
  assert.equal(validateProposal({ ...ok, id: "a10c1-001" }, scope).valid, false);
  assert.equal(validateProposal({ ...ok, confidence: { level: "supported", reasons: ["r"], percentage: 80 } }, scope).valid, false);
  assert.equal(validateProposal({ ...ok, quotation: "trecho", quotationRightsApproved: false }, scope).valid, false);
  assert.equal(validateProposal({ ...ok, epistemicClass: "mixed" }, scope).valid, false);
});

test("localizador inválido falha", () => {
  assert.equal(validateProposal({ ...ok, locator: { id: "l", sourceId: "src-in", locatorType: "page" } }, scope).valid, false, "page sem pageStart/accessedAt");
  assert.equal(validateProposal({ ...ok, sourceId: "src-pag", locator: { id: "l", sourceId: "src-pag", locatorType: "whole_resource", accessedAt: "t" } }, { ...scope, includedSources: ["src-pag"], paginatedSources: ["src-pag"] }).valid, false, "recurso paginado exige localizador de página");
});

test("detectDuplicates deteta duplicados no lote e colisões canónicas", () => {
  const d = detectDuplicates([{ id: "a" }, { id: "a" }, { id: "b" }], ["b", "c"]);
  assert.deepEqual(d.duplicates, ["a"]);
  assert.deepEqual(d.collisions, ["b"]);
});

test("normalizeOrder é determinístico e não altera conteúdo", () => {
  const input = [{ id: "c", v: 3 }, { id: "a", v: 1 }, { id: "b", v: 2 }];
  const a = normalizeOrder(input); const b = normalizeOrder(input);
  assert.deepEqual(a.map((x) => x.id), ["a", "b", "c"]);
  assert.deepEqual(a, b);
  assert.deepEqual(input.map((x) => x.id), ["c", "a", "b"], "não muta o array original");
});

test("buildIngestionPreview mantém tudo em 'draft', sem mutação, e declara não-publicação", () => {
  const prev = buildIngestionPreview({ batchId: "b", proposedBy: "op", proposedAt: "t", items: [ok, { ...ok, id: "p-2" }] }, scope);
  assert.equal(prev.state, "draft");
  assert.equal(prev.publicationAllowed, false);
  assert.equal(prev.humanActionRequired, true);
  assert.equal(prev.servedPublication, false);
  assert.ok(prev.accepted.every((a) => a.state === "draft"));
});

test("fixture sintética válida é aceite; fixture inválida (fonte excluída + citação) é rejeitada", () => {
  const valid = read("tests/fixtures/10e/ingestion-valid.json");
  const realScope = { includedSources: ["work-hauschild-2008-arquitectura-mosaicos-milreu"], excludedSources: ["work-teichner-2006-de-lo-romano-a-lo-arabe"], canonicalIds: [], paginatedSources: ["work-hauschild-2008-arquitectura-mosaicos-milreu"] };
  const pv = buildIngestionPreview(valid, realScope);
  assert.equal(pv.totals.accepted, 1, JSON.stringify(pv.rejected));
  const invalid = read("tests/fixtures/10e/ingestion-invalid-rights.json");
  const pi = buildIngestionPreview(invalid, realScope);
  assert.equal(pi.totals.accepted, 0);
  assert.equal(pi.totals.rejected, 1);
});
