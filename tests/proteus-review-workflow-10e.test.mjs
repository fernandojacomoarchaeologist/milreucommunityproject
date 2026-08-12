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

test("conflito de interesse e autoaprovação bloqueiam a TRANSIÇÃO editorial", () => {
  const a = A.assertions.find((x) => x.status === "in_review");
  assert.equal(proposeTransition(a, { ...goodReq, assertionId: a.id }).allowed, true);
  assert.equal(proposeTransition(a, { ...goodReq, assertionId: a.id, conflictOfInterest: true }).allowed, false);
  assert.equal(proposeTransition({ ...a, proposedBy: "human-1" }, { ...goodReq, assertionId: a.id, reviewerId: "human-1" }).allowed, false);
});

test("proposeTransition valida mas NÃO aplica; aprovação nunca publica", () => {
  const a = A.assertions.find((x) => x.status === "in_review");
  const pr = proposeTransition(a, { ...goodReq, assertionId: a.id });
  assert.equal(pr.applied, false);
  assert.equal(pr.proposal.toState, "approved");
  assert.equal(proposeTransition(a, { ...goodReq, assertionId: a.id, action: "publish" }).allowed, false);
});

test("direitos fail-closed (unknown=deny); publicação e apiExposure bloqueados", () => {
  const full = (d) => ({ decision: d, basis: "b", evidence: "e", responsible: "r", date: "2026-08-11" });
  const allAllow = Object.fromEntries(RIGHTS_DIMENSIONS.map((k) => [k, full("allow")]));
  const r = validateRightsAssessment({ assertionId: "a", ...allAllow });
  assert.equal(r.rightsCompatible, true);
  assert.equal(r.apiExposureBlockedByPackage, true);
  assert.equal(validateRightsAssessment({ assertionId: "a", ...allAllow, consent: { decision: "unknown" } }).effective.consent, "deny");
  assert.equal(canPublishInThisPackage({ status: "approved" }, { review: { decision: "approve", checks: { evidence: true, rights: true, epistemicClass: true, publicSafety: true } }, rightsCompatible: true, evidence: [{ id: "l", sourceId: "s", locatorType: "whole_resource", accessedAt: "t" }] }).allowed, false);
});

test("auditoria: motivo obrigatório, instante ISO, decisionRefs válido, sem conteúdo sensível", () => {
  assert.equal(buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z" }).valid, false, "sem motivo");
  assert.equal(buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "amanhã", reason: "r" }).valid, false, "instante não-ISO");
  assert.equal(buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r", decisionRefs: [""] }).valid, false, "decisionRefs vazio");
  assert.equal(buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "propose", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "revisão proposta", decisionRefs: ["d1"] }).valid, true);
  assert.equal(buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "email alguem@example.invalid" }).valid, false, "contacto");
});
