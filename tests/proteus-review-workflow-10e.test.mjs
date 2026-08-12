/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — testes do núcleo puro de revisão editorial (bancada revisável + três gates humanos).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildReviewPacket, validateReviewRequest, validateChecks, validateRightsAssessment, proposeTransition, canPublishInThisPackage, buildAuditEvent, RIGHTS_DIMENSIONS, REVIEW_CHECKS } from "../src/proteus/editorial-workflow.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const A = read("data/proteus/knowledge-assertions.json");
const E = read("data/proteus/knowledge-evidence-locators.json");
const Q = read("data/proteus/knowledge-review-queue.json");
const args = { assertions: A.assertions, locators: E.locators, entities: A.entities, queue: Q.items };
const fullChecks = { evidence: true, rights: true, epistemicClass: true, publicSafety: true };
const goodReq = { assertionId: "a10c1-001", reviewerId: "human-1", decidedAt: "2026-08-12T00:00:00Z", action: "approve", comment: "ok", checks: fullChecks, conflictOfInterest: false };

test("bancada tem 16 itens revisáveis com texto/idioma/confiança/proponente/instante", () => {
  const p = buildReviewPacket(args);
  assert.equal(p.totalItems, 16);
  for (const it of p.items) {
    for (const f of ["text", "language", "confidence", "proposedBy", "createdAt", "evidenceLocators", "relatedEntities", "priority"]) assert.ok(it[f] !== undefined, `${f} presente em ${it.assertionId}`);
    assert.equal(it.reviewer, null);
    assert.equal(it.decision, null);
  }
  // texto presente e não vazio nos 16
  assert.ok(p.items.every((it) => typeof it.text === "string" && it.text.length > 0));
});

test("bancada determinística, prioridades e item temporal a10c1-016", () => {
  assert.deepEqual(buildReviewPacket(args), buildReviewPacket(args));
  const p = buildReviewPacket(args);
  assert.deepEqual(p.priorities, { normal: 7, high: 8, time_sensitive: 1 });
  assert.ok(p.timeSensitiveItems.includes("a10c1-016"));
  const t = p.items.find((it) => it.assertionId === "a10c1-016");
  assert.equal(t.timeSensitive, true);
  assert.ok(t.temporalCondition.length > 0, "condição temporal presente");
});

test("checks têm de ser objeto {evidence,rights,epistemicClass,publicSafety}, não array", () => {
  assert.deepEqual([...REVIEW_CHECKS].sort(), ["epistemicClass", "evidence", "publicSafety", "rights"]);
  assert.equal(validateChecks(["anything"]).valid, false);
  assert.equal(validateChecks({ evidence: true }).valid, false);
  assert.equal(validateChecks({ evidence: true, rights: true, epistemicClass: true, publicSafety: true, extra: true }).valid, false);
  assert.equal(validateChecks(fullChecks).valid, true);
});

test("validateReviewRequest exige reviewerId, ISO, comentário, checks-objeto e conflito explícito", () => {
  assert.equal(validateReviewRequest(goodReq).valid, true);
  assert.equal(validateReviewRequest({ ...goodReq, reviewerId: "" }).valid, false);
  assert.equal(validateReviewRequest({ ...goodReq, decidedAt: "hoje" }).valid, false);
  assert.equal(validateReviewRequest({ ...goodReq, comment: "" }).valid, false);
  assert.equal(validateReviewRequest({ ...goodReq, checks: ["anything"] }).valid, false);
  assert.equal(validateReviewRequest({ ...goodReq, conflictOfInterest: undefined }).valid, false);
  assert.equal(validateReviewRequest(read("tests/fixtures/10e/review-approve-synthetic.json")).valid, true);
  assert.equal(validateReviewRequest(read("tests/fixtures/10e/review-without-human.json")).valid, false);
});

test("integridade, conflito de interesse e autoaprovação bloqueiam a TRANSIÇÃO editorial", () => {
  const a = A.assertions.find((x) => x.status === "in_review");
  assert.equal(proposeTransition(a, { ...goodReq, assertionId: a.id }).allowed, true);
  assert.equal(proposeTransition(a, { ...goodReq, assertionId: "outro-id" }).allowed, false, "assertionId divergente bloqueia");
  assert.equal(proposeTransition(a, { ...goodReq, assertionId: a.id, conflictOfInterest: true }).allowed, false);
  assert.equal(proposeTransition({ ...a, proposedBy: "human-1" }, { ...goodReq, assertionId: a.id, reviewerId: "human-1" }).allowed, false);
});

test("confiança da bancada inclui limitações iguais aos dados canónicos", () => {
  const p = buildReviewPacket(args);
  const byId = new Map(A.assertions.map((a) => [a.id, a]));
  for (const it of p.items) {
    assert.ok(Array.isArray(it.confidence.limitations), `limitations array em ${it.assertionId}`);
    assert.deepEqual(it.confidence.limitations, byId.get(it.assertionId).confidence.limitations || []);
  }
});

test("localizadores autossuficientes: Hauschild paginado, a10c1-016 url+accessedAt+nota, sem citação", () => {
  const p = buildReviewPacket(args);
  const it009 = p.items.find((i) => i.assertionId === "a10c1-009");
  assert.ok(it009.evidenceLocators.some((l) => Number.isInteger(l.pageStart) && typeof l.label === "string"), "paginação estruturada");
  const loc016 = p.items.find((i) => i.assertionId === "a10c1-016").evidenceLocators[0];
  assert.equal(loc016.locatorType, "url_snapshot");
  assert.ok(loc016.url && loc016.accessedAt && loc016.notes, "url, accessedAt e nota de volatilidade");
  for (const it of p.items) for (const l of it.evidenceLocators) assert.ok(!("quotation" in l) && !("quotationRightsApproved" in l));
});

test("proposeTransition valida mas NÃO aplica; aprovação nunca publica", () => {
  const a = A.assertions.find((x) => x.status === "in_review");
  const pr = proposeTransition(a, { ...goodReq, assertionId: a.id });
  assert.equal(pr.applied, false);
  assert.equal(pr.proposal.toState, "approved");
  assert.equal(proposeTransition(a, { ...goodReq, assertionId: a.id, action: "publish" }).allowed, false);
});

test("direitos estritamente fail-closed (schema): assertionId, propriedades, ISO, allow completo, unknown=deny, apiExposure inválido", () => {
  const dim = (d) => ({ decision: d, basis: "b", evidence: "e", responsible: "r", date: "2026-08-11" });
  const base = { assertionId: "a", copyright: dim("allow"), consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("deny") };
  const r = validateRightsAssessment(base);
  assert.equal(r.valid, true, r.errors.join("; "));
  assert.equal(r.rightsCompatible, false, "apiExposure deny => não compatível");
  assert.equal(r.apiExposureBlockedByPackage, true);
  assert.equal(validateRightsAssessment({ ...base, assertionId: "" }).valid, false, "sem assertionId");
  assert.equal(validateRightsAssessment({ ...base, extra: 1 }).valid, false, "propriedade desconhecida no topo");
  assert.equal(validateRightsAssessment({ ...base, copyright: { decision: "allow", basis: "b", evidence: "e", responsible: "r", date: "d" } }).valid, false, "data não-ISO");
  assert.equal(validateRightsAssessment({ ...base, copyright: { decision: "allow", basis: "b" } }).valid, false, "allow incompleto");
  assert.equal(validateRightsAssessment({ ...base, license: { decision: "allow", basis: "b", evidence: "e", responsible: "r", date: "2026-08-11", foo: 1 } }).valid, false, "propriedade desconhecida na dimensão");
  assert.equal(validateRightsAssessment({ ...base, consent: { decision: "unknown" } }).effective.consent, "deny");
  assert.equal(validateRightsAssessment({ ...base, apiExposure: dim("allow") }).valid, false, "apiExposure:allow torna a avaliação inválida");
});

test("direitos: tipos de basis/evidence/responsible/notes validados mesmo em deny/unknown", () => {
  const dim = (d) => ({ decision: d, basis: "b", evidence: "e", responsible: "r", date: "2026-08-11" });
  const base = { assertionId: "a", copyright: dim("allow"), consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("deny") };
  assert.equal(validateRightsAssessment({ ...base, copyright: { decision: "deny", basis: 123 } }).valid, false, "basis:123 (deny)");
  assert.equal(validateRightsAssessment({ ...base, copyright: { decision: "unknown", evidence: 123 } }).valid, false, "evidence:123 (unknown)");
  assert.equal(validateRightsAssessment({ ...base, consent: { decision: "deny", responsible: 5 } }).valid, false, "responsible não-string (deny)");
  assert.equal(validateRightsAssessment({ ...base, license: { decision: "deny", notes: 5 } }).valid, false, "notes não-string (deny)");
  assert.equal(validateRightsAssessment({ ...base, thirdPartyMaterial: { decision: "deny", date: "d" } }).valid, false, "date não-ISO (deny)");
  // deny/unknown sem campos extra continuam válidos estruturalmente.
  assert.equal(validateRightsAssessment({ ...base, copyright: { decision: "deny" } }).valid, true);
});

test("auditoria: tipos inválidos falham (action numérico, fromState/toState, IDs não-string)", () => {
  const good = { id: "e", entityType: "assertion", entityId: "a", action: "propose", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r", decisionRefs: [] };
  assert.equal(buildAuditEvent({ ...good, action: 7 }).valid, false, "action numérico");
  assert.equal(buildAuditEvent({ ...good, fromState: 7 }).valid, false, "fromState numérico");
  assert.equal(buildAuditEvent({ ...good, toState: 7 }).valid, false, "toState numérico");
  assert.equal(buildAuditEvent({ ...good, fromState: null, toState: null }).valid, true, "fromState/toState null válidos");
  assert.equal(buildAuditEvent({ ...good, id: 7 }).valid, false, "id numérico");
  assert.equal(buildAuditEvent({ ...good, actorId: 7 }).valid, false, "actorId numérico");
  assert.equal(buildAuditEvent({ ...good, entityId: "" }).valid, false, "entityId vazio");
});

test("publicação bloqueada no 10E", () => {
  assert.equal(canPublishInThisPackage({ status: "approved" }, { review: { decision: "approve", checks: { evidence: true, rights: true, epistemicClass: true, publicSafety: true } }, rightsCompatible: true, evidence: [{ id: "l", sourceId: "s", locatorType: "whole_resource", accessedAt: "t" }] }).allowed, false);
});

test("auditoria alinhada ao schema: motivo/ISO/decisionRefs/entityType-enum/propriedades desconhecidas", () => {
  const good = { id: "e", entityType: "assertion", entityId: "a", action: "propose", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "revisão proposta", decisionRefs: [] };
  assert.equal(buildAuditEvent(good).valid, true, "decisionRefs=[] é válido");
  assert.equal(buildAuditEvent({ ...good, reason: undefined }).valid, false, "sem motivo");
  assert.equal(buildAuditEvent({ ...good, at: "amanhã" }).valid, false, "instante não-ISO");
  assert.equal(buildAuditEvent({ ...good, decisionRefs: undefined }).valid, false, "decisionRefs obrigatório");
  assert.equal(buildAuditEvent({ ...good, decisionRefs: [""] }).valid, false, "decisionRefs vazio");
  assert.equal(buildAuditEvent({ ...good, entityType: "desconhecido" }).valid, false, "entityType fora do enum");
  assert.equal(buildAuditEvent({ ...good, foo: 1 }).valid, false, "propriedade desconhecida");
  assert.equal(buildAuditEvent({ ...good, reason: "email alguem@example.invalid" }).valid, false, "contacto");
});
