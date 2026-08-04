/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10C — testes do modelo de conhecimento (positivos e NEGATIVOS) e da derivação/vistas.
 * Os objetos usados são exemplos abstratos de teste, nunca afirmações históricas reais.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  validateAssertion, validateEvidenceLocator, validateEntity, validateRelation,
  canTransition, canPublishAssertion, confidenceErrors, detectSupersedeCycles, derivePublicKnowledge,
} from "../src/proteus/knowledge-model.mjs";
import { validateCidocMapping, exportCidocMappings } from "../src/proteus/cidoc-mapping.mjs";
import { proteusKnowledgeView, proteusAssertionView, proteusEntityView } from "../src/views/proteus-knowledge.js";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const baseAssertion = (over = {}) => ({ id: "a1", text: "Exemplo abstrato de afirmação de teste.", language: "pt-PT", epistemicClass: "interpretation", status: "draft", evidenceIds: ["e1"], entityIds: [], confidence: { level: "limited", reasons: ["exemplo"] }, proposedBy: "rev", createdAt: "2026-08-04T00:00:00Z", ...over });

test("afirmação válida passa; classe/estado desconhecidos falham", () => {
  assert.equal(validateAssertion(baseAssertion()).valid, true);
  assert.equal(validateAssertion(baseAssertion({ epistemicClass: "opinion" })).valid, false);
  assert.equal(validateAssertion(baseAssertion({ status: "live" })).valid, false);
  assert.equal(validateAssertion(baseAssertion({ text: "  " })).valid, false);
});

test("NEGATIVO: sem evidência não supera 'insufficient'", () => {
  const r = validateAssertion(baseAssertion({ evidenceIds: [], confidence: { level: "supported", reasons: ["x"] } }));
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => /insufficient/.test(e)));
  // Sem evidência com insufficient é aceitável.
  assert.equal(validateAssertion(baseAssertion({ evidenceIds: [], confidence: { level: "insufficient", reasons: ["sem fontes"] } })).valid, true);
});

test("NEGATIVO: confiança nunca é percentagem/probabilidade de verdade", () => {
  assert.ok(confidenceErrors({ level: "supported", reasons: ["r"], percentage: 90 }).length > 0);
  assert.ok(confidenceErrors({ level: "supported", reasons: ["r"], probability: 0.9 }).length > 0);
  assert.ok(confidenceErrors({ level: "supported", reasons: ["95% de verdade"] }).length > 0);
  assert.equal(confidenceErrors({ level: "supported", reasons: ["evidência independente"] }).length, 0);
});

test("localizadores por tipo; NEGATIVO: página inválida e URL sem data", () => {
  assert.equal(validateEvidenceLocator({ id: "e", sourceId: "s", locatorType: "page", pageStart: 12, accessedAt: "2026-08-04T00:00:00Z" }).valid, true);
  assert.equal(validateEvidenceLocator({ id: "e", sourceId: "s", locatorType: "page_range", pageStart: 20, pageEnd: 10, accessedAt: "2026-08-04T00:00:00Z" }).valid, false);
  assert.equal(validateEvidenceLocator({ id: "e", sourceId: "s", locatorType: "page", accessedAt: "2026-08-04T00:00:00Z" }).valid, false);
  // recurso paginado exige localizador de página
  assert.equal(validateEvidenceLocator({ id: "e", sourceId: "s", locatorType: "whole_resource", accessedAt: "2026-08-04T00:00:00Z" }, { sourcePaginated: true }).valid, false);
  // recurso dinâmico (url) sem data de acesso
  const r = validateEvidenceLocator({ id: "e", sourceId: "s", locatorType: "url_snapshot", url: "https://x.example/p" });
  assert.equal(r.valid, false);
});

test("NEGATIVO: citação textual exige direitos aprovados", () => {
  const r = validateEvidenceLocator({ id: "e", sourceId: "s", locatorType: "page", pageStart: 1, accessedAt: "2026-08-04T00:00:00Z", quotation: "trecho", quotationRightsApproved: false });
  assert.equal(r.valid, false);
});

test("transições de estado válidas e inválidas", () => {
  assert.equal(canTransition("draft", "in_review"), true);
  assert.equal(canTransition("approved", "published"), true);
  assert.equal(canTransition("published", "superseded"), true);
  assert.equal(canTransition("draft", "published"), false);
  assert.equal(canTransition("withdrawn", "published"), false);
});

test("NEGATIVO: publicação negada sem evidência/revisão/direitos; permitida quando completo", () => {
  const denied = canPublishAssertion({ status: "approved" }, { evidence: [], review: null, rightsCompatible: false });
  assert.equal(denied.allowed, false);
  const goodEvidence = [{ id: "e", sourceId: "s", locatorType: "page", pageStart: 3, accessedAt: "2026-08-04T00:00:00Z" }];
  const goodReview = { decision: "approve", conflictOfInterest: false, checks: { evidence: true, rights: true, epistemicClass: true, publicSafety: true } };
  assert.equal(canPublishAssertion({ status: "approved" }, { evidence: goodEvidence, review: goodReview, rightsCompatible: true }).allowed, true);
  // conflito de interesse bloqueia
  assert.equal(canPublishAssertion({ status: "approved" }, { evidence: goodEvidence, review: { ...goodReview, conflictOfInterest: true }, rightsCompatible: true }).allowed, false);
});

test("relações exigem justificação; NEGATIVO: ciclo de substituição detetado", () => {
  assert.equal(validateRelation({ id: "r", sourceAssertionId: "a", targetAssertionId: "b", relationType: "contradicts", justification: "fontes divergem", status: "approved" }).valid, true);
  assert.equal(validateRelation({ id: "r", sourceAssertionId: "a", targetAssertionId: "b", relationType: "supports", justification: "  ", status: "approved" }).valid, false);
  assert.equal(validateRelation({ id: "r", sourceAssertionId: "a", targetAssertionId: "a", relationType: "supersedes", justification: "x", status: "approved" }).valid, false);
  const cycles = detectSupersedeCycles([
    { relationType: "supersedes", sourceAssertionId: "a", targetAssertionId: "b" },
    { relationType: "supersedes", sourceAssertionId: "b", targetAssertionId: "a" },
  ]);
  assert.ok(cycles.length > 0);
  assert.equal(detectSupersedeCycles([{ relationType: "supersedes", sourceAssertionId: "a", targetAssertionId: "b" }]).length, 0);
});

test("entidade válida; tipo desconhecido falha", () => {
  assert.equal(validateEntity({ id: "x", type: "place", preferredLabel: "Exemplo", language: "pt-PT", status: "draft" }).valid, true);
  assert.equal(validateEntity({ id: "x", type: "planet", preferredLabel: "Exemplo", language: "pt-PT", status: "draft" }).valid, false);
});

test("derivação pública: só 'published'; conflitos publicados permanecem", () => {
  const all = {
    assertions: [
      { id: "a1", status: "published", text: "t", epistemicClass: "interpretation" },
      { id: "a2", status: "draft", text: "t2", epistemicClass: "hypothesis" },
      { id: "a3", status: "published", text: "t3", epistemicClass: "fact_claim" },
    ],
    entities: [{ id: "p1", status: "published" }, { id: "p2", status: "draft" }],
    relations: [
      { id: "r1", status: "approved", relationType: "contradicts", sourceAssertionId: "a1", targetAssertionId: "a3" },
      { id: "r2", status: "draft", relationType: "supports", sourceAssertionId: "a1", targetAssertionId: "a3" },
      { id: "r3", status: "approved", relationType: "supports", sourceAssertionId: "a1", targetAssertionId: "a2" },
    ],
  };
  const d = derivePublicKnowledge(all);
  assert.deepEqual(d.assertions.map((a) => a.id), ["a1", "a3"]);
  assert.deepEqual(d.entities.map((e) => e.id), ["p1"]);
  // Só relação aprovada entre publicadas; o conflito permanece visível.
  assert.deepEqual(d.relations.map((r) => r.id), ["r1"]);
});

test("mapeamento CIDOC exige URI cidoc-crm, versão e justificação", () => {
  assert.equal(validateCidocMapping({ id: "m", localTerm: "place", cidocUri: "http://www.cidoc-crm.org/cidoc-crm/E53_Place", crmVersion: "7.1.3", mappingRelation: "exact", justification: "lugar", status: "draft" }).valid, true);
  assert.equal(validateCidocMapping({ id: "m", localTerm: "place", cidocUri: "http://example.org/E53", crmVersion: "7.1.3", mappingRelation: "exact", justification: "x", status: "draft" }).valid, false);
  assert.equal(validateCidocMapping({ id: "m", localTerm: "place", cidocUri: "http://www.cidoc-crm.org/cidoc-crm/E53_Place", crmVersion: "7.1.3", mappingRelation: "exact", justification: "  ", status: "draft" }).valid, false);
});

test("crosswalk do repositório é válido, 'draft' e exportável (não certificado)", () => {
  const crosswalk = read("data/proteus/cidoc-mappings.json");
  for (const m of crosswalk.mappings) assert.equal(validateCidocMapping(m).valid, true, `mapeamento ${m.id}`);
  assert.ok(crosswalk.mappings.every((m) => m.status === "draft"));
  const exp = exportCidocMappings(crosswalk.mappings);
  assert.equal(exp.conformance, "partial-not-certified");
  assert.ok(exp.crmVersion);
});

test("snapshot público começa vazio e honesto; sem confiança percentual", () => {
  const snap = read("public/data/proteus-knowledge-public.json");
  assert.deepEqual(snap.assertions, []);
  assert.deepEqual(snap.entities, []);
  assert.deepEqual(snap.relations, []);
  assert.ok(snap.notice);
  assert.doesNotMatch(JSON.stringify(snap), /"percentage"|"probability"|% de verdade/);
});

test("vistas: estado vazio, 404 de afirmação e de entidade são honestos", () => {
  const snap = read("public/data/proteus-knowledge-public.json");
  assert.match(proteusKnowledgeView(snap, "pt-PT", {}), /Ainda não há afirmações publicadas/);
  assert.match(proteusAssertionView(snap, "inexistente", "pt-PT"), /Afirmação não encontrada/);
  assert.match(proteusEntityView(snap, "inexistente", "pt-PT"), /Entidade não encontrada/);
});

test("vista de afirmação publicada mostra classe, evidência e divergência (exemplo de teste)", () => {
  const knowledge = {
    assertions: [{
      id: "a1", status: "published", text: "Exemplo abstrato publicado para teste.", epistemicClass: "interpretation",
      confidence: { level: "supported", reasons: ["evidência localizada", "revisão humana"] },
      entities: [{ slug: "lugar-x", preferredLabel: "Lugar de teste" }],
      evidence: [{ sourceId: "obra-x", sourceTitle: "Obra de teste", locatorType: "page", pageStart: 42, accessedAt: "2026-08-04" }],
      relations: [{ relationType: "contradicts", targetAssertionId: "a2", justification: "as fontes divergem" }],
      review: { reviewedAt: "2026-08-04" },
    }],
    entities: [],
  };
  const html = proteusAssertionView(knowledge, "a1", "pt-PT");
  assert.match(html, /Interpretação/);
  assert.match(html, /Sustentada/);
  assert.match(html, /página 42/);
  assert.match(html, /contradiz/);
  assert.doesNotMatch(html, /\d{1,3}\s?%/); // nunca uma percentagem de verdade
});
