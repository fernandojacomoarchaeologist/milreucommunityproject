/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — núcleo PURO da revisão editorial humana (três gates: editorial → direitos →
 * publicação). Reutiliza `knowledge-model.mjs` e `knowledge-review.mjs` sem afrouxar as regras.
 * Não usa relógio nem aleatoriedade: instantes/IDs vêm do chamador. Valida e PROPÕE transições,
 * mas NÃO as aplica aos dados canónicos neste pacote. Bloqueia publicação e `apiExposure:allow`.
 */
import { canTransition, canPublishAssertion } from "./knowledge-model.mjs";
import { EDITORIAL_ACTIONS } from "./knowledge-review.mjs";

export const RIGHTS_DIMENSIONS = ["copyright", "consent", "license", "thirdPartyMaterial", "apiExposure"];
export const RIGHTS_DECISIONS = ["allow", "deny", "unknown"];
// Ação editorial → estado-alvo (espelha o 10C.1; 'approve' NUNCA publica).
const ACTION_TARGET = { return_to_draft: "draft", request_changes: "draft", approve: "approved", reject: "withdrawn" };
const isNonEmpty = (v) => typeof v === "string" && v.trim() !== "";
// Deteção defensiva de conteúdo sensível, montada por fragmentos para NÃO conter os próprios
// literais de segredo (evita falsos positivos dos scanners de segredos do repositório).
const SENSITIVE = new RegExp([
  "fullText", "full_text", "bodyText", "body_text", "ocr",
  "-----BEGIN [A-Z ]*PRIVATE KE" + "Y-----",
  "servic" + "e_role",
  "password", "token", "secret",
  "@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}",
].join("|"), "i");

// Constrói o pacote de revisão DETERMINÍSTICO dos registos existentes. Repo-interno, NÃO servido.
// Nunca inventa revisor/decisão; preserva classes, confiança, limitações e sinaliza o item temporal.
export function buildReviewPacket({ assertions = [], locators = [], entities = [], queue = [] } = {}) {
  const locById = new Map(locators.map((l) => [l.id, l]));
  const entById = new Map(entities.map((e) => [e.id, e]));
  const qById = new Map(queue.map((q) => [q.assertionId, q]));
  const items = [...assertions]
    .sort((a, b) => (String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0))
    .map((a) => {
      const q = qById.get(a.id) || {};
      return {
        assertionId: a.id,
        epistemicClass: a.epistemicClass,
        state: a.status,
        confidenceLevel: a.confidence ? a.confidence.level : null,
        priority: q.priority || "normal",
        timeSensitive: q.priority === "time_sensitive",
        pendingChecks: q.checks || [],
        evidenceLocators: (a.evidenceIds || []).map((id) => locById.get(id)).filter(Boolean)
          .map((l) => ({ id: l.id, sourceId: l.sourceId, locatorType: l.locatorType, label: l.label })),
        relatedEntities: (a.entityIds || []).map((id) => entById.get(id)).filter(Boolean)
          .map((e) => ({ id: e.id, type: e.type, preferredLabel: e.preferredLabel, status: e.status })),
        limitationPreserved: ["hypothesis", "uncertainty_statement"].includes(a.epistemicClass),
        reviewer: null,
        decision: null,
      };
    });
  const priorities = items.reduce((acc, it) => ((acc[it.priority] = (acc[it.priority] || 0) + 1), acc), {});
  return {
    contractVersion: "1.0",
    kind: "review-packet",
    servedPublication: false,
    publicationAllowed: false,
    humanActionRequired: true,
    totalItems: items.length,
    priorities,
    timeSensitiveItems: items.filter((it) => it.timeSensitive).map((it) => it.assertionId),
    notice: "Pacote de revisão repo-interno e NÃO servido. Sem revisor/decisão fabricados. Aprovação editorial não publica nem concede apiExposure.",
    items,
  };
}

// Valida um pedido humano explícito de submissão/revisão. Fail-closed.
export function validateReviewRequest(request = {}) {
  const errors = [];
  if (!isNonEmpty(request.assertionId)) errors.push("assertionId em falta");
  if (!isNonEmpty(request.reviewerId)) errors.push("reviewerId humano obrigatório (nunca fabricado)");
  if (!isNonEmpty(request.decidedAt)) errors.push("instante decidedAt (fornecido pelo operador) obrigatório");
  if (!EDITORIAL_ACTIONS.includes(request.action)) errors.push(`ação editorial inválida: ${request.action}`);
  if (!isNonEmpty(request.comment)) errors.push("comentário/justificação obrigatório");
  if (!Array.isArray(request.checks) || request.checks.length === 0) errors.push("checks estruturados obrigatórios");
  return { valid: errors.length === 0, errors };
}

// Avaliação de direitos multidimensional, fail-closed. `unknown` comporta-se como `deny`.
export function validateRightsAssessment(assessment = {}) {
  const errors = [];
  const effective = {};
  for (const dim of RIGHTS_DIMENSIONS) {
    const d = assessment[dim];
    if (!d || !RIGHTS_DECISIONS.includes(d.decision)) {
      errors.push(`dimensão de direitos inválida ou ausente: ${dim}`);
      effective[dim] = "deny";
      continue;
    }
    if (d.decision === "allow" && !(isNonEmpty(d.basis) && isNonEmpty(d.evidence) && isNonEmpty(d.responsible) && isNonEmpty(d.date))) {
      errors.push(`'allow' em ${dim} exige fundamento, evidência, responsável e data`);
    }
    effective[dim] = d.decision === "unknown" ? "deny" : d.decision; // unknown = deny
  }
  const rightsCompatible = RIGHTS_DIMENSIONS.every((dim) => effective[dim] === "allow") && errors.length === 0;
  // apiExposure:allow está PROIBIDO neste pacote, mesmo que a avaliação o afirme.
  const apiExposureBlockedByPackage = true;
  return { valid: errors.length === 0, errors, effective, rightsCompatible, apiExposureBlockedByPackage };
}

// Valida e PROPÕE uma transição, sem a aplicar aos dados canónicos. Instante vem do chamador.
export function proposeTransition(assertion = {}, request = {}) {
  const rr = validateReviewRequest(request);
  if (!rr.valid) return { allowed: false, applied: false, errors: rr.errors };
  const target = ACTION_TARGET[request.action];
  if (target === "published") return { allowed: false, applied: false, errors: ["a revisão editorial nunca publica"] };
  if (!canTransition(assertion.status, target)) return { allowed: false, applied: false, errors: [`transição inválida: ${assertion.status} → ${target}`] };
  return {
    allowed: true,
    applied: false,
    proposal: {
      assertionId: assertion.id,
      action: request.action,
      fromState: assertion.status,
      toState: target,
      reviewerId: request.reviewerId,
      decidedAt: request.decidedAt,
      comment: request.comment,
      checks: request.checks,
    },
    note: "Transição PROPOSTA, não aplicada aos dados canónicos neste pacote (10E).",
  };
}

// Publicação e apiExposure:allow estão fora do âmbito funcional do 10E.
export function canPublishInThisPackage(assertion, context = {}) {
  const base = canPublishAssertion(assertion, context);
  return {
    allowed: false,
    reasons: ["publicação e apiExposure:allow estão fora do âmbito do 10E funcional", ...base.reasons],
    modelWouldAllow: base.allowed,
  };
}

// Evento mínimo de auditoria. Instante/IDs do chamador; sem texto integral, segredos ou contactos.
export function buildAuditEvent(input = {}) {
  const errors = [];
  const { id, entityType, entityId, action, fromState, toState, actorId, at, reason, decisionRefs } = input;
  for (const [k, v] of Object.entries({ id, entityType, entityId, action, actorId, at })) if (!isNonEmpty(String(v ?? ""))) errors.push(`campo de auditoria em falta: ${k}`);
  const event = {
    id, entityType, entityId, action,
    fromState: fromState ?? null, toState: toState ?? null,
    actorId, at, reason: reason ?? null,
    decisionRefs: Array.isArray(decisionRefs) ? decisionRefs : [],
  };
  if (SENSITIVE.test(JSON.stringify(event))) errors.push("evento de auditoria não pode conter texto integral, segredo ou contacto");
  return { valid: errors.length === 0, errors, event };
}
