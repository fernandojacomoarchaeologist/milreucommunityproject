/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C.1 — lógica pura da jornada de oportunidades para o MODO DE DEMONSTRAÇÃO.
 * NÃO substitui o backend: as RPCs security definer + RLS do 09C continuam a ser a
 * fonte de verdade em staging/produção (a capacidade é aplicada atomicamente no Postgres;
 * ver supabase/collab-tests/009c1_*). Estas funções replicam as MESMAS regras para a
 * demonstração local e para testes unitários rápidos:
 *  - transições: submitted → accepted | not-selected | withdrawn; accepted → removed;
 *  - candidatura única por pessoa/oportunidade;
 *  - capacidade máxima honesta (submetidas + aceites contam);
 *  - menores bloqueados até política (minors_policy_pending);
 *  - candidatos sempre privados (só o próprio ou quem gere);
 *  - notas/justificações internas nunca saem para a superfície pública;
 *  - duplicar não copia candidaturas.
 * pt-PT é a fonte; nenhuma tradução é publicada aqui. Dados são de DEMONSTRAÇÃO.
 */

export const APPLICATION_TRANSITIONS = {
  submitted: ["accepted", "not-selected", "withdrawn"],
  accepted: ["removed"],
  "not-selected": [],
  withdrawn: [],
  removed: [],
};

export const REQUIRED_PUBLISH_FIELDS = ["title", "summary", "opportunityType"];

export function initialOpportunitiesStore() {
  return { opportunities: [], applications: [], audit: [] };
}

const nowIso = () => new Date().toISOString();
const uid = (p) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function findOpportunity(store, id) {
  const o = store.opportunities.find((x) => x.id === id);
  if (!o) throw new Error("opportunity_not_found");
  return o;
}

function pushAudit(store, action, entityId, extra = {}) {
  store.audit.unshift({ id: uid("opp-audit"), action, entity_id: entityId, at: nowIso(), ...extra });
}

/** Candidaturas que "ocupam lugar": submetidas ou aceites (não retiradas/não-selecionadas/removidas). */
export function occupiedCount(store, opportunityId) {
  return store.applications.filter(
    (a) => a.opportunityId === opportunityId && (a.status === "submitted" || a.status === "accepted"),
  ).length;
}

export function capacityReached(store, opp) {
  if (!opp || opp.capacityMode !== "limited" || opp.capacity == null) return false;
  return occupiedCount(store, opp.id) >= Number(opp.capacity);
}

/** Só o próprio candidato ou quem gere vê candidaturas. Nunca públicas, nunca entre candidatos. */
export function visibleApplications(store, opportunityId, viewer) {
  const all = store.applications.filter((a) => a.opportunityId === opportunityId);
  if (viewer?.canManage) return all.map(stripInternalForManager);
  if (viewer?.userId) return all.filter((a) => a.userId === viewer.userId).map(stripInternalForOwner);
  return [];
}

/** O gestor vê estado e nota do candidato, mas a exportação/superfície pública é minimizada à parte. */
function stripInternalForManager(a) {
  return { ...a };
}
/** O candidato nunca vê notas/justificações internas do master. */
function stripInternalForOwner(a) {
  const { internalNote, removalReason, ...visible } = a;
  return visible;
}

export function ownApplication(store, opportunityId, userId) {
  return store.applications.find(
    (a) => a.opportunityId === opportunityId && a.userId === userId && a.status !== "withdrawn" && a.status !== "removed",
  ) || null;
}

// ---- Operações do master ----

export function createOpportunity(store, actor, values) {
  const id = uid("opp");
  const slug = (values.slug || slugify(values.title) || id).slice(0, 80);
  const opp = {
    id,
    slug,
    title: values.title || "",
    summary: values.summary || "",
    description: values.description || "",
    opportunityType: values.opportunityType || "community-activity",
    visibility: values.visibility === "members" ? "members" : "public",
    status: "draft",
    locationText: values.locationText || "",
    startsAt: values.startsAt || null,
    endsAt: values.endsAt || null,
    applicationDeadline: values.applicationDeadline || null,
    capacityMode: values.capacityMode === "limited" ? "limited" : "unlimited",
    capacity: values.capacityMode === "limited" ? numberOrNull(values.capacity) : null,
    costText: values.costText || "",
    remunerationText: values.remunerationText || "",
    requirements: values.requirements || "",
    accessibilityText: values.accessibilityText || "",
    organizerText: values.organizerText || "",
    minorsAllowed: false, // bloqueado até política (09C/09C.1)
    applicationsClosed: false,
    createdBy: actor?.userId || "demo-master",
    createdAt: nowIso(),
    publishedAt: null,
    updatedAt: nowIso(),
    demo: true,
  };
  store.opportunities.unshift(opp);
  pushAudit(store, "opportunity.created", id, { actor: opp.createdBy });
  return opp;
}

export function updateOpportunity(store, id, values) {
  const o = findOpportunity(store, id);
  if (o.status === "cancelled") throw new Error("opportunity_cancelled");
  const operational = ["startsAt", "endsAt", "applicationDeadline", "capacityMode", "capacity", "costText", "remunerationText"];
  for (const key of ["title", "summary", "description", "opportunityType", "visibility", "locationText", "requirements", "accessibilityText", "organizerText", ...operational]) {
    if (key in values && values[key] !== undefined) o[key] = values[key];
  }
  if (o.capacityMode !== "limited") o.capacity = null;
  else o.capacity = numberOrNull(o.capacity);
  o.updatedAt = nowIso();
  pushAudit(store, "opportunity.updated", id);
  return o;
}

export function publishOpportunity(store, id) {
  const o = findOpportunity(store, id);
  if (o.status === "cancelled") throw new Error("opportunity_cancelled");
  for (const f of REQUIRED_PUBLISH_FIELDS) {
    if (!String(o[f] || "").trim()) throw new Error(`publish_requires_${f}`);
  }
  o.status = "published";
  o.applicationsClosed = false;
  o.publishedAt = o.publishedAt || nowIso();
  o.updatedAt = nowIso();
  pushAudit(store, "opportunity.published", id);
  return o;
}

export function closeApplications(store, id) {
  const o = findOpportunity(store, id);
  o.applicationsClosed = true;
  o.updatedAt = nowIso();
  pushAudit(store, "opportunity.applications_closed", id);
  return o;
}

export function cancelOpportunity(store, id, reason = "") {
  const o = findOpportunity(store, id);
  o.status = "cancelled";
  o.applicationsClosed = true;
  o.updatedAt = nowIso();
  // Não apaga candidaturas nem histórico; regista razão interna na auditoria.
  pushAudit(store, "opportunity.cancelled", id, { internalReason: reason || null });
  return o;
}

export function setCapacity(store, id, mode, capacity) {
  const o = findOpportunity(store, id);
  o.capacityMode = mode === "limited" ? "limited" : "unlimited";
  o.capacity = o.capacityMode === "limited" ? numberOrNull(capacity) : null;
  o.updatedAt = nowIso();
  pushAudit(store, "opportunity.capacity_set", id, { mode: o.capacityMode, capacity: o.capacity });
  return o;
}

/** Duplicar cria um NOVO rascunho e NUNCA copia candidaturas. */
export function duplicateOpportunity(store, id, actor) {
  const src = findOpportunity(store, id);
  const copy = createOpportunity(store, actor, {
    title: `${src.title} (cópia)`,
    summary: src.summary,
    description: src.description,
    opportunityType: src.opportunityType,
    visibility: src.visibility,
    locationText: src.locationText,
    startsAt: src.startsAt,
    endsAt: src.endsAt,
    applicationDeadline: src.applicationDeadline,
    capacityMode: src.capacityMode,
    capacity: src.capacity,
    costText: src.costText,
    remunerationText: src.remunerationText,
    requirements: src.requirements,
    accessibilityText: src.accessibilityText,
    organizerText: src.organizerText,
  });
  pushAudit(store, "opportunity.duplicated", copy.id, { from: id });
  return copy;
}

export function decideApplication(store, applicationId, decision) {
  const app = store.applications.find((a) => a.id === applicationId);
  if (!app) throw new Error("application_not_found");
  if (!APPLICATION_TRANSITIONS[app.status]?.includes(decision)) throw new Error("invalid_transition");
  if (decision !== "accepted" && decision !== "not-selected") throw new Error("invalid_decision");
  app.status = decision;
  app.decidedAt = nowIso();
  app.updatedAt = nowIso();
  pushAudit(store, `application.${decision}`, app.id, { opportunityId: app.opportunityId });
  return app;
}

export function removeParticipant(store, applicationId, reason) {
  const app = store.applications.find((a) => a.id === applicationId);
  if (!app) throw new Error("application_not_found");
  if (app.status !== "accepted") throw new Error("invalid_transition");
  if (!String(reason || "").trim()) throw new Error("reason_required");
  app.status = "removed";
  app.internalNote = null;
  app.removalReason = String(reason).trim(); // interno; nunca público
  app.updatedAt = nowIso();
  pushAudit(store, "application.removed", app.id, { opportunityId: app.opportunityId });
  return app;
}

/** Lista operacional minimizada: sem notas internas, sem dados supérfluos. */
export function exportOperational(store, opportunityId) {
  return store.applications
    .filter((a) => a.opportunityId === opportunityId && a.status !== "withdrawn")
    .map((a) => ({ applicant: a.displayName || "(sem nome)", status: a.status, submittedAt: a.submittedAt }));
}

// ---- Operações do candidato ----

export function applyToOpportunity(store, opportunityId, applicant) {
  const o = findOpportunity(store, opportunityId);
  if (o.status !== "published") throw new Error("opportunity_not_published");
  if (o.status === "cancelled") throw new Error("opportunity_cancelled");
  if (o.applicationsClosed) throw new Error("applications_closed");
  if (applicant?.isMinor && !o.minorsAllowed) throw new Error("minors_policy_pending");
  if (ownApplication(store, opportunityId, applicant.userId)) throw new Error("already_applied");
  if (capacityReached(store, o)) throw new Error("capacity_reached");
  const app = {
    id: uid("app"),
    opportunityId,
    userId: applicant.userId,
    displayName: applicant.displayName || null,
    status: "submitted",
    submittedAt: nowIso(),
    updatedAt: nowIso(),
    internalNote: null,
    demo: true,
  };
  store.applications.unshift(app);
  pushAudit(store, "application.submitted", app.id, { opportunityId });
  return app;
}

export function withdrawApplication(store, applicationId, userId) {
  const app = store.applications.find((a) => a.id === applicationId);
  if (!app) throw new Error("application_not_found");
  if (app.userId !== userId) throw new Error("forbidden");
  if (!APPLICATION_TRANSITIONS[app.status]?.includes("withdrawn")) throw new Error("invalid_transition");
  app.status = "withdrawn";
  app.updatedAt = nowIso();
  pushAudit(store, "application.withdrawn", app.id, { opportunityId: app.opportunityId });
  return app;
}

// ---- Descoberta pública (leitura) ----

/** Só oportunidades públicas e publicadas entram na superfície pública. Nunca rascunhos/membros. */
export function publicOpportunities(store) {
  return store.opportunities
    .filter((o) => o.visibility === "public" && o.status === "published")
    .map(toPublicShape);
}

export function toPublicShape(o) {
  return {
    slug: o.slug, title: o.title, summary: o.summary, description: o.description,
    opportunityType: o.opportunityType, locationText: o.locationText, startsAt: o.startsAt, endsAt: o.endsAt,
    durationText: o.durationText, effortText: o.effortText, requirements: o.requirements,
    accessibilityText: o.accessibilityText, costText: o.costText, remunerationText: o.remunerationText,
    organizerText: o.organizerText, applicationDeadline: o.applicationDeadline,
    capacityMode: o.capacityMode, applicationsClosed: o.applicationsClosed,
    capacityReached: o.capacityMode === "limited" && o.capacity != null ? false : false, // computado à parte no controlador
    demo: true,
  };
}

// ---- utilitários ----

function slugify(v) {
  return String(v || "")
    .toLocaleLowerCase("pt-PT")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function numberOrNull(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}
