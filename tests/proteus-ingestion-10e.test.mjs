/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — testes do núcleo puro de ingestão controlada (validação estrita + proveniência).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateProposal, validateBatch, validateBatchHeader, detectDuplicates, normalizeOrder, buildIngestionPreview, preserveProposal, INGESTION_STATE } from "../src/proteus/knowledge-ingestion.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const scope = { includedSources: ["src-in"], excludedSources: ["src-out"], canonicalIds: ["a10c1-001"], paginatedSources: [] };
const ok = { id: "p-1", text: "x", language: "pt-PT", epistemicClass: "fact_claim", sourceId: "src-in", locator: { id: "l1", sourceId: "src-in", locatorType: "whole_resource", accessedAt: "2026-08-11" }, confidence: { level: "supported", reasons: ["r"] }, proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z" };

test("proposta válida passa e permanece 'draft'", () => {
  const r = validateProposal(ok, scope);
  assert.equal(r.valid, true, r.errors.join("; "));
  assert.equal(r.state, "draft");
  assert.equal(INGESTION_STATE, "draft");
});

test("estrutura: campos obrigatórios e propriedades desconhecidas", () => {
  assert.equal(validateProposal({ ...ok, foo: 1 }, scope).valid, false, "propriedade desconhecida");
  const noConf = { ...ok }; delete noConf.confidence;
  assert.equal(validateProposal(noConf, scope).valid, false, "sem confidence");
  const noText = { ...ok }; delete noText.text;
  assert.equal(validateProposal(noText, scope).valid, false, "sem text");
});

test("idioma pelo enum e timestamps ISO 8601", () => {
  assert.equal(validateProposal({ ...ok, language: "de" }, scope).valid, false, "idioma fora do enum");
  assert.equal(validateProposal({ ...ok, proposedAt: "ontem" }, scope).valid, false, "proposedAt não-ISO");
  assert.equal(validateProposal({ ...ok, locator: { ...ok.locator, accessedAt: "xx" } }, scope).valid, false, "accessedAt não-ISO");
});

test("coerência de fonte: locator.sourceId === proposal.sourceId", () => {
  assert.equal(validateProposal({ ...ok, locator: { ...ok.locator, sourceId: "outra" } }, scope).valid, false);
});

test("proveniência assistida por IA exige transformation/tool/toolVersion", () => {
  assert.equal(validateProposal({ ...ok, aiAssisted: true }, scope).valid, false);
  assert.equal(validateProposal({ ...ok, aiAssisted: true, transformation: "paraphrase", tool: "t", toolVersion: "1" }, scope).valid, true);
});

test("fonte excluída/ausente, colisão canónica e citação sem direitos falham", () => {
  assert.equal(validateProposal({ ...ok, sourceId: "src-out" }, scope).valid, false);
  assert.equal(validateProposal({ ...ok, sourceId: "src-missing" }, scope).valid, false);
  assert.equal(validateProposal({ ...ok, id: "a10c1-001" }, scope).valid, false);
  assert.equal(validateProposal({ ...ok, quotation: "trecho", quotationRightsApproved: false }, scope).valid, false);
});

test("validateBatchHeader: obrigatórios, ISO e propriedades desconhecidas", () => {
  assert.equal(validateBatchHeader({ batchId: "b", proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", items: [] }).valid, true);
  assert.equal(validateBatchHeader({ proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", items: [] }).valid, false, "sem batchId");
  assert.equal(validateBatchHeader({ batchId: "b", proposedBy: "op", proposedAt: "ontem", items: [] }).valid, false, "proposedAt não-ISO");
  assert.equal(validateBatchHeader({ batchId: "b", proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", items: [], extra: 1 }).valid, false, "propriedade desconhecida");
});

test("lote com cabeçalho inválido NÃO aceita candidatos parcialmente", () => {
  const prev = buildIngestionPreview({ items: [ok] }, scope); // faltam batchId/proposedBy/proposedAt
  assert.equal(prev.batchValid, false);
  assert.equal(prev.totals.accepted, 0);
  assert.deepEqual(prev.accepted, []);
  assert.ok(prev.headerErrors.length > 0);
});

test("validateBatch valida cabeçalho + todos os itens", () => {
  const good = validateBatch({ batchId: "b", proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", items: [ok] }, scope);
  assert.equal(good.valid, true);
  const bad = validateBatch({ batchId: "b", proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", items: [ok, { ...ok, sourceId: "src-out" }] }, scope);
  assert.equal(bad.valid, false);
});

test("preservação integral de proveniência na pré-visualização de itens aceites", () => {
  const rich = { ...ok, transformation: "paraphrase", tool: "t", toolVersion: "1", aiAssisted: true, hash: "sha256:x", entityIds: ["e1"] };
  const prev = buildIngestionPreview({ batchId: "b", proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", items: [rich] }, scope);
  const a = prev.accepted[0];
  for (const k of ["text", "language", "epistemicClass", "sourceId", "locator", "confidence", "transformation", "tool", "toolVersion", "aiAssisted", "hash", "proposedBy", "proposedAt"]) assert.ok(a[k] !== undefined, `preservado: ${k}`);
  assert.deepEqual(a.confidence, rich.confidence);
  assert.equal(a.state, "draft");
  // não muta o original
  assert.equal(rich.state, undefined);
});

test("sourceVersion: opcional, string não vazia quando presente, preservado byte-a-byte", () => {
  assert.equal(validateProposal({ ...ok, sourceVersion: "" }, scope).valid, false, "vazio falha");
  assert.equal(validateProposal({ ...ok, sourceVersion: "2.ª ed. 2019" }, scope).valid, true);
  assert.equal(validateProposal(ok, scope).valid, true, "ausência é válida (opcional)");
  const prev = buildIngestionPreview({ batchId: "b", proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", items: [{ ...ok, sourceVersion: "ed-2019" }] }, scope);
  assert.equal(prev.accepted[0].sourceVersion, "ed-2019");
});

test("preserveProposal não inclui citação sem direitos aprovados", () => {
  const p = preserveProposal({ ...ok, quotation: "trecho", quotationRightsApproved: false });
  assert.equal("quotation" in p, false);
  const q = preserveProposal({ ...ok, quotation: "trecho", quotationRightsApproved: true });
  assert.equal(q.quotation, "trecho");
});

test("detectDuplicates e normalizeOrder deterministas e sem mutação", () => {
  const d = detectDuplicates([{ id: "a" }, { id: "a" }, { id: "b" }], ["b"]);
  assert.deepEqual(d.duplicates, ["a"]);
  assert.deepEqual(d.collisions, ["b"]);
  const input = [{ id: "c" }, { id: "a" }, { id: "b" }];
  assert.deepEqual(normalizeOrder(input).map((x) => x.id), ["a", "b", "c"]);
  assert.deepEqual(input.map((x) => x.id), ["c", "a", "b"]);
});

test("fixtures sintéticas: válida aceite, inválida (fonte excluída + citação) rejeitada", () => {
  const realScope = { includedSources: ["work-hauschild-2008-arquitectura-mosaicos-milreu"], excludedSources: ["work-teichner-2006-de-lo-romano-a-lo-arabe"], canonicalIds: [], paginatedSources: ["work-hauschild-2008-arquitectura-mosaicos-milreu"] };
  const pv = buildIngestionPreview(read("tests/fixtures/10e/ingestion-valid.json"), realScope);
  assert.equal(pv.totals.accepted, 1, JSON.stringify(pv.rejected));
  const pi = buildIngestionPreview(read("tests/fixtures/10e/ingestion-invalid-rights.json"), realScope);
  assert.equal(pi.totals.accepted, 0);
});
