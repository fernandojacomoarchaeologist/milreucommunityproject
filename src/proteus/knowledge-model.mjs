/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10C — núcleo PURO e testável do modelo de conhecimento do Proteus.
 * Representa afirmações governadas editorialmente, evidências localizadas, entidades e
 * relações epistémicas. NÃO contém afirmações históricas reais, não lê documentos, não faz
 * OCR/embeddings/RAG/chat/API/MCP. A confiança é explicável (níveis + razões), NUNCA uma
 * percentagem de verdade. Uma afirmação sem evidência não supera 'insufficient'. A publicação
 * exige estado aprovado + evidência válida + revisão humana aprovada + direitos compatíveis.
 * Conflitos entre fontes permanecem visíveis; nada é resolvido por votação.
 */

export const LANGS = ["pt-PT", "en", "es", "fr"];
export const EPISTEMIC_CLASSES = ["fact_claim", "interpretation", "hypothesis", "memory_account", "inference", "uncertainty_statement"];
export const ASSERTION_STATES = ["draft", "in_review", "approved", "published", "superseded", "withdrawn"];
export const CONFIDENCE_LEVELS = ["insufficient", "limited", "supported", "well_supported"];
export const RELATION_TYPES = ["supports", "complements", "qualifies", "contradicts", "supersedes", "withdraws"];
export const ENTITY_TYPES = ["place", "structure", "object", "person", "group", "event", "period", "concept", "digital_resource"];
export const LOCATOR_TYPES = ["page", "page_range", "section", "figure", "table", "timestamp", "url_snapshot", "whole_resource"];
export const PAGINATED_LOCATORS = ["page", "page_range", "section", "figure", "table"];

const isNonEmpty = (v) => typeof v === "string" && v.trim() !== "";

export function validateAssertion(a) {
  const e = [];
  if (!a || typeof a !== "object") return { valid: false, errors: ["afirmação inválida"] };
  for (const f of ["id", "text", "language", "epistemicClass", "status", "evidenceIds", "entityIds", "confidence", "proposedBy", "createdAt"]) {
    if (a[f] === undefined) e.push(`campo obrigatório em falta: ${f}`);
  }
  if (a.language !== undefined && !LANGS.includes(a.language)) e.push(`idioma inválido: ${a.language}`);
  if (a.epistemicClass !== undefined && !EPISTEMIC_CLASSES.includes(a.epistemicClass)) e.push(`classe epistémica desconhecida: ${a.epistemicClass}`);
  if (a.status !== undefined && !ASSERTION_STATES.includes(a.status)) e.push(`estado inválido: ${a.status}`);
  if (a.text !== undefined && !isNonEmpty(a.text)) e.push("texto vazio");
  if (a.evidenceIds !== undefined && !Array.isArray(a.evidenceIds)) e.push("evidenceIds deve ser lista");
  if (a.entityIds !== undefined && !Array.isArray(a.entityIds)) e.push("entityIds deve ser lista");
  if (a.confidence !== undefined) e.push(...confidenceErrors(a.confidence));
  // Regra dura: sem evidência não se ultrapassa 'insufficient'.
  if (Array.isArray(a.evidenceIds) && a.evidenceIds.length === 0 && a.confidence && a.confidence.level && a.confidence.level !== "insufficient") {
    e.push("afirmação sem evidência não pode superar 'insufficient'");
  }
  return { valid: e.length === 0, errors: e };
}

// Confiança explicável e NÃO probabilística.
export function confidenceErrors(c) {
  const e = [];
  if (!c || typeof c !== "object") return ["confiança inválida"];
  if (!CONFIDENCE_LEVELS.includes(c.level)) e.push(`nível de confiança inválido: ${c.level}`);
  if (!Array.isArray(c.reasons) || c.reasons.length === 0) e.push("confiança exige pelo menos uma razão");
  for (const k of ["score", "percentage", "percent", "probability", "truthProbability"]) {
    if (k in c) e.push(`confiança não pode conter '${k}' (não é probabilidade de verdade)`);
  }
  if (/\b\d{1,3}\s?%|probabilidade de verdade|truth probability|% de verdade/i.test(JSON.stringify(c))) {
    e.push("confiança não pode exprimir percentagem/probabilidade de verdade");
  }
  return e;
}

export function validateEvidenceLocator(l, { sourcePaginated } = {}) {
  const e = [];
  if (!l || typeof l !== "object") return { valid: false, errors: ["evidência inválida"] };
  for (const f of ["id", "sourceId", "locatorType", "accessedAt"]) if (l[f] === undefined) e.push(`campo obrigatório em falta: ${f}`);
  if (l.locatorType !== undefined && !LOCATOR_TYPES.includes(l.locatorType)) e.push(`tipo de localizador desconhecido: ${l.locatorType}`);
  if (l.locatorType === "page" && !(Number.isInteger(l.pageStart) && l.pageStart >= 1)) e.push("localizador 'page' exige pageStart>=1");
  if (l.locatorType === "page_range") {
    if (!(Number.isInteger(l.pageStart) && Number.isInteger(l.pageEnd))) e.push("'page_range' exige pageStart e pageEnd");
    else if (l.pageEnd < l.pageStart) e.push("pageEnd não pode ser menor que pageStart");
  }
  if (l.locatorType === "url_snapshot" && !isNonEmpty(l.url)) e.push("'url_snapshot' exige url");
  // Recurso dinâmico (URL) sem data de acesso é inválido (accessedAt já é obrigatório).
  if ((l.locatorType === "url_snapshot" || l.url) && !isNonEmpty(l.accessedAt)) e.push("recurso dinâmico exige data de acesso (accessedAt)");
  // Recurso paginado exige localizador de página/secção; ausência é bloqueante.
  if (sourcePaginated === true && l.locatorType && !PAGINATED_LOCATORS.includes(l.locatorType)) {
    e.push("recurso paginado exige localizador de página/secção/figura/tabela");
  }
  // Citação textual só com direitos aprovados.
  if (isNonEmpty(l.quotation) && l.quotationRightsApproved !== true) e.push("citação textual exige quotationRightsApproved=true");
  return { valid: e.length === 0, errors: e };
}

export function validateEntity(x) {
  const e = [];
  if (!x || typeof x !== "object") return { valid: false, errors: ["entidade inválida"] };
  for (const f of ["id", "type", "preferredLabel", "language", "status"]) if (x[f] === undefined) e.push(`campo obrigatório em falta: ${f}`);
  if (x.type !== undefined && !ENTITY_TYPES.includes(x.type)) e.push(`tipo de entidade desconhecido: ${x.type}`);
  if (x.language !== undefined && !LANGS.includes(x.language)) e.push(`idioma inválido: ${x.language}`);
  if (!["draft", "approved", "published", "deprecated"].includes(x.status)) e.push(`estado de entidade inválido: ${x.status}`);
  return { valid: e.length === 0, errors: e };
}

// Transições de estado permitidas. 'superseded'/'withdrawn' são terminais.
const TRANSITIONS = {
  draft: ["in_review", "withdrawn"],
  in_review: ["approved", "draft", "withdrawn"],
  approved: ["published", "in_review", "withdrawn"],
  published: ["superseded", "withdrawn"],
  superseded: [],
  withdrawn: [],
};
export function canTransition(from, to) {
  return Boolean(TRANSITIONS[from] && TRANSITIONS[from].includes(to));
}

// Publicação: aprovada + evidência válida + revisão humana aprovada (checks) + direitos compatíveis.
export function canPublishAssertion(a, { evidence = [], review = null, rightsCompatible = false } = {}) {
  const reasons = [];
  if (!a || a.status !== "approved") reasons.push("só afirmações 'approved' podem ser publicadas");
  const validEvidence = evidence.filter((ev) => validateEvidenceLocator(ev).valid);
  if (validEvidence.length === 0) reasons.push("publicação exige pelo menos uma evidência válida");
  if (!review || review.decision !== "approve") {
    reasons.push("publicação exige revisão humana aprovada");
  } else {
    const c = review.checks || {};
    for (const k of ["evidence", "rights", "epistemicClass", "publicSafety"]) if (c[k] !== true) reasons.push(`revisão sem verificação de '${k}'`);
    if (review.conflictOfInterest === true) reasons.push("revisão com conflito de interesse declarado não publica");
  }
  if (rightsCompatible !== true) reasons.push("direitos incompatíveis ou por confirmar");
  return { allowed: reasons.length === 0, reasons };
}

export function validateRelation(r) {
  const e = [];
  if (!r || typeof r !== "object") return { valid: false, errors: ["relação inválida"] };
  for (const f of ["id", "sourceAssertionId", "targetAssertionId", "relationType", "justification", "status"]) if (r[f] === undefined) e.push(`campo obrigatório em falta: ${f}`);
  if (r.relationType !== undefined && !RELATION_TYPES.includes(r.relationType)) e.push(`relação desconhecida: ${r.relationType}`);
  if (r.justification !== undefined && !isNonEmpty(r.justification)) e.push("relação exige justificação editorial");
  if (r.sourceAssertionId && r.sourceAssertionId === r.targetAssertionId) e.push("relação não pode ligar uma afirmação a si mesma");
  return { valid: e.length === 0, errors: e };
}

// Deteta ciclos de substituição (A supersedes B ... supersedes A) — inválidos.
export function detectSupersedeCycles(relations = []) {
  const adj = new Map();
  for (const r of relations) {
    if (r.relationType !== "supersedes") continue;
    if (!adj.has(r.sourceAssertionId)) adj.set(r.sourceAssertionId, []);
    adj.get(r.sourceAssertionId).push(r.targetAssertionId);
  }
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  const cycles = [];
  const dfs = (u, path) => {
    color.set(u, GRAY);
    for (const v of adj.get(u) || []) {
      if (color.get(v) === GRAY) cycles.push([...path, v]);
      else if ((color.get(v) || WHITE) === WHITE) dfs(v, [...path, v]);
    }
    color.set(u, BLACK);
  };
  for (const n of adj.keys()) if ((color.get(n) || WHITE) === WHITE) dfs(n, [n]);
  return cycles;
}

// Snapshot público derivado: só afirmações/entidades 'published' e relações 'approved' entre
// afirmações publicadas. Conflitos publicados permanecem visíveis (não são removidos).
export function derivePublicKnowledge(all = {}) {
  const assertions = (all.assertions || []).filter((a) => a.status === "published");
  const publishedIds = new Set(assertions.map((a) => a.id));
  const entities = (all.entities || []).filter((x) => x.status === "published");
  const relations = (all.relations || []).filter((r) => r.status === "approved" && publishedIds.has(r.sourceAssertionId) && publishedIds.has(r.targetAssertionId));
  return { assertions, entities, relations };
}
