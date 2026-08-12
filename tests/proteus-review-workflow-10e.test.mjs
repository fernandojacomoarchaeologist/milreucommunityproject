/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — testes do núcleo puro de revisão editorial (três gates humanos).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildReviewPacket, validateReviewRequest, validateRightsAssessment, proposeTransition, canPublishInThisPackage, buildAuditEvent, RIGHTS_DIMENSIONS } from "../src/proteus/editorial-workflow.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const A = read("data/proteus/knowledge-assertions.json");
const E = read("data/proteus/knowledge-evidence-locators.json");
const Q = read("data/proteus/knowledge-review-queue.json");
const args = { assertions: A.assertions, locators: E.locators, entities: A.entities, queue: Q.items };

test("pacote de revisão tem exatamente 16 itens, sem revisor/decisão fabricados", () => {
  const p = buildReviewPacket(args);
  assert.equal(p.totalItems, 16);
  assert.equal(p.servedPublication, false);
  assert.equal(p.publicationAllowed, false);
  for (const it of p.items) { assert.equal(it.reviewer, null); assert.equal(it.decision, null); }
});

test("pacote é determinístico, preserva classes/limitações e sinaliza o item temporal a10c1-016", () => {
  const p1 = buildReviewPacket(args); const p2 = buildReviewPacket(args);
  assert.deepEqual(p1, p2);
  assert.deepEqual(p1.priorities, { normal: 7, high: 8, time_sensitive: 1 });
  assert.ok(p1.timeSensitiveItems.includes("a10c1-016"));
  const hyp = p1.items.filter((it) => ["hypothesis", "uncertainty_statement"].includes(it.epistemicClass));
  assert.ok(hyp.length >= 1 && hyp.every((it) => it.limitationPreserved === true));
});

test("validateReviewRequest exige reviewerId, instante, ação, comentário e checks", () => {
  const base = { assertionId: "a10c1-001", reviewerId: "human-1", decidedAt: "2026-08-11", action: "approve", comment: "ok", checks: ["evidence"] };
  assert.equal(validateReviewRequest(base).valid, true);
  assert.equal(validateReviewRequest({ ...base, reviewerId: "" }).valid, false);
  assert.equal(validateReviewRequest({ ...base, decidedAt: "" }).valid, false);
  assert.equal(validateReviewRequest({ ...base, comment: "" }).valid, false);
  assert.equal(validateReviewRequest({ ...base, checks: [] }).valid, false);
  assert.equal(validateReviewRequest({ ...base, action: "publish" }).valid, false);
  assert.equal(validateReviewRequest(read("tests/fixtures/10e/review-approve-synthetic.json")).valid, true);
  assert.equal(validateReviewRequest(read("tests/fixtures/10e/review-without-human.json")).valid, false);
});

test("direitos fail-closed: unknown = deny; allow exige fundamento/evidência/responsável/data", () => {
  const full = (d) => ({ decision: d, basis: "b", evidence: "e", responsible: "r", date: "2026-08-11" });
  const allAllow = Object.fromEntries(RIGHTS_DIMENSIONS.map((k) => [k, full("allow")]));
  const r = validateRightsAssessment({ assertionId: "a", ...allAllow });
  assert.equal(r.valid, true);
  assert.equal(r.rightsCompatible, true);
  assert.equal(r.apiExposureBlockedByPackage, true);
  const withUnknown = validateRightsAssessment({ assertionId: "a", ...allAllow, consent: { decision: "unknown" } });
  assert.equal(withUnknown.effective.consent, "deny");
  assert.equal(withUnknown.rightsCompatible, false);
  const allowNoBasis = validateRightsAssessment({ assertionId: "a", ...allAllow, license: { decision: "allow" } });
  assert.equal(allowNoBasis.valid, false);
});

test("proposeTransition valida mas NÃO aplica; aprovação editorial nunca publica", () => {
  const a = A.assertions.find((x) => x.status === "in_review");
  const pr = proposeTransition(a, { assertionId: a.id, reviewerId: "human-1", decidedAt: "2026-08-11", action: "approve", comment: "ok", checks: ["evidence"] });
  assert.equal(pr.allowed, true);
  assert.equal(pr.applied, false);
  assert.equal(pr.proposal.toState, "approved");
  const pub = proposeTransition(a, { assertionId: a.id, reviewerId: "human-1", decidedAt: "t", action: "publish", comment: "c", checks: ["x"] });
  assert.equal(pub.allowed, false);
});

test("publicação e apiExposure:allow bloqueados neste pacote", () => {
  const r = canPublishInThisPackage({ status: "approved" }, { evidence: [], review: { decision: "approve", checks: { evidence: true, rights: true, epistemicClass: true, publicSafety: true } }, rightsCompatible: true });
  assert.equal(r.allowed, false);
});

test("evento de auditoria mínimo rejeita conteúdo sensível", () => {
  const good = buildAuditEvent({ id: "e1", entityType: "assertion", entityId: "a10c1-001", action: "propose_review", actorId: "human-1", at: "2026-08-11", reason: "revisão proposta", decisionRefs: [] });
  assert.equal(good.valid, true);
  assert.equal(buildAuditEvent({ id: "e2", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "t", reason: "email alguem@example.invalid" }).valid, false);
});
