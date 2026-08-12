/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — núcleo PURO da revisão editorial humana (três gates: editorial → direitos →
 * publicação). Reutiliza `knowledge-model.mjs` e `knowledge-review.mjs` sem afrouxar as regras.
 * Não usa relógio nem aleatoriedade: instantes/IDs vêm do chamador. Valida e PROPÕE transições,
 * mas NÃO as aplica aos dados canónicos neste pacote. Bloqueia publicação e `apiExposure:allow`,
 * conflito de interesse e autoaprovação. Fail-closed enquanto a política editorial estiver pendente.
 */
import { canTransition, canPublishAssertion } from "./knowledge-model.mjs";
import { EDITORIAL_ACTIONS } from "./knowledge-review.mjs";

export const RIGHTS_DIMENSIONS = ["copyright", "consent", "license", "thirdPartyMaterial", "apiExposure"];
export const RIGHTS_DECISIONS = ["allow", "deny", "unknown"];
export const RIGHTS_DIMENSION_KEYS = ["decision", "basis", "evidence", "responsible", "date", "notes"];
export const REVIEW_CHECKS = ["evidence", "rights", "epistemicClass", "publicSafety"];
// Espelham `contracts/10e/audit-event.schema.json` (paridade validada por validate-10e.mjs).
export const AUDIT_ENTITY_TYPES = ["assertion", "entity", "relation", "ingestion-proposal", "rights-assessment"];
export const AUDIT_REQUIRED = ["id", "entityType", "entityId", "action", "actorId", "at", "reason", "decisionRefs"];
export const AUDIT_KEYS = ["id", "entityType", "entityId", "action", "fromState", "toState", "actorId", "at", "reason", "decisionRefs"];
// Campos aplicáveis do localizador preservados na bancada (nunca citação sem direitos).
export const LOCATOR_PRESERVE_KEYS = ["id", "sourceId", "locatorType", "pageStart", "pageEnd", "label", "url", "accessedAt", "notes"];

const ACTION_TARGET = { return_to_draft: "draft", request_changes: "draft", approve: "approved", reject: "withdrawn" };
const isNonEmpty = (v) => typeof v === "string" && v.trim() !== "";
const isStr = (v) => typeof v === "string";
const ISO_8601 = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;
const isISO = (v) => typeof v === "string" && ISO_8601.test(v);
const unknownKeys = (obj, allowed) => (obj && typeof obj === "object" ? Object.keys(obj).filter((k) => !allowed.includes(k)) : []);
const SENSITIVE = new RegExp([
  "fullText", "full_text", "bodyText", "body_text", "ocr",
  "-----BEGIN [A-Z ]*PRIVATE KE" + "Y-----",
  "servic" + "e_role",
  "password", "token", "secret",
  "@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}",
].join("|"), "i");

// Pacote de revisão DETERMINÍSTICO, repo-interno e NÃO servido. Cada item é autossuficiente:
// texto, idioma, confiança COMPLETA (nível+razões+limitações), proveniência, localizadores
// preservados (sem citação sem direitos), entidades, prioridade, checks e condição temporal.
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
        text: a.text,
        language: a.language,
        epistemicClass: a.epistemicClass,
        state: a.status,
        confidence: a.confidence
          ? { level: a.confidence.level, reasons: a.confidence.reasons || [], limitations: a.confidence.limitations || [] }
          : null,
        proposedBy: a.proposedBy ?? null,
        createdAt: a.createdAt ?? null,
        priority: q.priority || "normal",
        timeSensitive: q.priority === "time_sensitive",
        pendingChecks: q.checks || [],
        temporalCondition: q.priority === "time_sensitive" ? (q.checks || []) : [],
        evidenceLocators: (a.evidenceIds || []).map((id) => locById.get(id)).filter(Boolean).map((l) => {
          const out = {};
          for (const k of LOCATOR_PRESERVE_KEYS) if (l[k] !== undefined && l[k] !== null) out[k] = l[k];
          return out;
        }),
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

// Verificações editoriais: objeto {evidence,rights,epistemicClass,publicSafety} com todos `true`.
export function validateChecks(checks) {
  if (!checks || typeof checks !== "object" || Array.isArray(checks)) return { valid: false, errors: ["checks deve ser um objeto {evidence,rights,epistemicClass,publicSafety}"] };
  const errors = [];
  for (const k of Object.keys(checks)) if (!REVIEW_CHECKS.includes(k)) errors.push(`check desconhecido: ${k}`);
  for (const k of REVIEW_CHECKS) if (checks[k] !== true) errors.push(`verificação '${k}' obrigatória (true)`);
  return { valid: errors.length === 0, errors };
}

// Valida um pedido humano explícito de submissão/revisão. Fail-closed.
export function validateReviewRequest(request = {}) {
  const errors = [];
  if (!isNonEmpty(request.assertionId)) errors.push("assertionId em falta");
  if (!isNonEmpty(request.reviewerId)) errors.push("reviewerId humano obrigatório (nunca fabricado)");
  if (!isISO(request.decidedAt)) errors.push("decidedAt (instante ISO 8601, fornecido pelo operador) obrigatório e válido");
  if (!EDITORIAL_ACTIONS.includes(request.action)) errors.push(`ação editorial inválida: ${request.action}`);
  if (!isNonEmpty(request.comment)) errors.push("comentário/justificação obrigatório");
  const c = validateChecks(request.checks);
  if (!c.valid) c.errors.forEach((e) => errors.push(e));
  if (typeof request.conflictOfInterest !== "boolean") errors.push("conflictOfInterest tem de ser declarado explicitamente (boolean)");
  return { valid: errors.length === 0, errors };
}

// Avaliação de direitos ESTRITAMENTE fail-closed, alinhada ao schema. `unknown` = `deny`.
// `apiExposure.decision === "allow"` torna a avaliação INVÁLIDA neste pacote (não apenas bloqueada).
export function validateRightsAssessment(assessment = {}) {
  const errors = [];
  const effective = {};
  if (!assessment || typeof assessment !== "object" || Array.isArray(assessment)) return { valid: false, errors: ["avaliação de direitos inválida"], effective: {}, rightsCompatible: false, apiExposureBlockedByPackage: true };
  if (!isNonEmpty(assessment.assertionId)) errors.push("assertionId obrigatório");
  for (const k of unknownKeys(assessment, ["assertionId", ...RIGHTS_DIMENSIONS])) errors.push(`propriedade desconhecida na avaliação: ${k}`);
  for (const dim of RIGHTS_DIMENSIONS) {
    const d = assessment[dim];
    if (!d || typeof d !== "object" || !RIGHTS_DECISIONS.includes(d.decision)) { errors.push(`dimensão de direitos inválida ou ausente: ${dim}`); effective[dim] = "deny"; continue; }
    for (const k of unknownKeys(d, RIGHTS_DIMENSION_KEYS)) errors.push(`propriedade desconhecida em ${dim}: ${k}`);
    // Tipos alinhados ao schema em TODAS as decisões (inclusive deny/unknown): strings quando presentes.
    for (const f of ["basis", "evidence", "responsible", "notes"]) if (d[f] !== undefined && !isStr(d[f])) errors.push(`${dim}: ${f} tem de ser string`);
    if (d.date !== undefined && !isISO(d.date)) errors.push(`${dim}: data tem de ser ISO 8601`);
    if (d.decision === "allow" && !(isNonEmpty(d.basis) && isNonEmpty(d.evidence) && isNonEmpty(d.responsible) && isISO(d.date))) errors.push(`'allow' em ${dim} exige fundamento, evidência, responsável e data (ISO)`);
    effective[dim] = d.decision === "unknown" ? "deny" : d.decision;
  }
  // apiExposure:allow está PROIBIDO neste pacote: torna a avaliação inválida.
  if (assessment.apiExposure && assessment.apiExposure.decision === "allow") errors.push("apiExposure:allow está fora do âmbito do 10E: avaliação inválida");
  const rightsCompatible = errors.length === 0 && RIGHTS_DIMENSIONS.every((dim) => effective[dim] === "allow");
  return { valid: errors.length === 0, errors, effective, rightsCompatible, apiExposureBlockedByPackage: true };
}

// Valida e PROPÕE uma transição, sem a aplicar. Exige integridade (assertionId === assertion.id) e
// bloqueia conflito de interesse e autoaprovação.
export function proposeTransition(assertion = {}, request = {}) {
  const rr = validateReviewRequest(request);
  if (!rr.valid) return { allowed: false, applied: false, errors: rr.errors };
  if (request.assertionId !== assertion.id) return { allowed: false, applied: false, errors: ["integridade: request.assertionId tem de coincidir com assertion.id"] };
  if (request.conflictOfInterest === true) return { allowed: false, applied: false, errors: ["conflito de interesse declarado bloqueia a transição editorial"] };
  if (isNonEmpty(assertion.proposedBy) && request.reviewerId === assertion.proposedBy) return { allowed: false, applied: false, errors: ["autoaprovação bloqueada: reviewerId não pode ser o proponente da afirmação"] };
  const target = ACTION_TARGET[request.action];
  if (target === "published") return { allowed: false, applied: false, errors: ["a revisão editorial nunca publica"] };
  if (!canTransition(assertion.status, target)) return { allowed: false, applied: false, errors: [`transição inválida: ${assertion.status} → ${target}`] };
  return {
    allowed: true,
    applied: false,
    proposal: { assertionId: assertion.id, action: request.action, fromState: assertion.status, toState: target, reviewerId: request.reviewerId, decidedAt: request.decidedAt, comment: request.comment, checks: request.checks, conflictOfInterest: request.conflictOfInterest },
    note: "Transição PROPOSTA, não aplicada aos dados canónicos neste pacote (10E).",
  };
}

// Publicação e apiExposure:allow estão fora do âmbito funcional do 10E.
export function canPublishInThisPackage(assertion, context = {}) {
  const base = canPublishAssertion(assertion, context);
  return { allowed: false, reasons: ["publicação e apiExposure:allow estão fora do âmbito do 10E funcional", ...base.reasons], modelWouldAllow: base.allowed };
}

// Evento mínimo de auditoria, alinhado ao schema. `reason` obrigatório não vazio; `at` ISO;
// `decisionRefs` obrigatório (mesmo `[]`); `entityType` no enum; propriedades desconhecidas rejeitadas.
export function buildAuditEvent(input = {}) {
  const errors = [];
  if (!input || typeof input !== "object") return { valid: false, errors: ["evento inválido"], event: null };
  for (const k of unknownKeys(input, AUDIT_KEYS)) errors.push(`propriedade de auditoria desconhecida: ${k}`);
  const { id, entityType, entityId, action, fromState, toState, actorId, at, reason, decisionRefs } = input;
  // IDs/tipo/ação/actor têm de ser strings NÃO vazias (rejeita numéricos e vazios, sem coerção).
  for (const [k, v] of Object.entries({ id, entityType, entityId, action, actorId })) if (!isNonEmpty(v)) errors.push(`campo de auditoria em falta ou de tipo inválido (string não vazia): ${k}`);
  if (!AUDIT_ENTITY_TYPES.includes(entityType)) errors.push(`entityType fora do enum: ${entityType}`);
  // fromState/toState só podem ser string ou null.
  for (const [k, v] of Object.entries({ fromState, toState })) if (v !== undefined && v !== null && !isStr(v)) errors.push(`${k} tem de ser string ou null`);
  if (!isISO(at)) errors.push("instante de auditoria (at) tem de ser ISO 8601 válido");
  if (!isNonEmpty(reason)) errors.push("motivo (reason) obrigatório e não vazio");
  if (!(Array.isArray(decisionRefs) && decisionRefs.every((r) => isNonEmpty(r)))) errors.push("decisionRefs obrigatório (array de referências não vazias, mesmo que [])");
  const event = { id, entityType, entityId, action, fromState: fromState ?? null, toState: toState ?? null, actorId, at, reason: reason ?? null, decisionRefs: Array.isArray(decisionRefs) ? decisionRefs : [] };
  if (SENSITIVE.test(JSON.stringify(event))) errors.push("evento de auditoria não pode conter texto integral, segredo ou contacto");
  return { valid: errors.length === 0, errors, event };
}
