/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10D — núcleo PURO da API pública do Proteus (somente leitura, sem I/O de rede).
 *
 * Regras invariantes:
 *  - elegibilidade fail-closed: um item só entra se editorial === "published" E fonte pública
 *    adequada E data de revisão E permissão de exposição por API explicitamente "allow";
 *  - ausência, "unknown", "deny", "in_review", "draft", "withdrawn" ou conflito excluem;
 *  - allowlist de campos por tipo; campos ausentes ou de aparência privada são descartados;
 *  - a saída NUNCA identifica nem contabiliza os itens excluídos;
 *  - ordenação e paginação deterministas; sem relógio nem aleatoriedade;
 *  - envelopes uniformes. Uma coleção vazia é sucesso honesto, não erro.
 *
 * Este módulo não lê ficheiros, rede, base de dados nem storage. É testável com fixtures
 * sintéticas apenas nos testes. Não deve conter registos reais.
 */

export const CONTRACT_VERSION = "1.0";
export const API_VERSION = "v1";
export const API_ROOT = "/api/proteus/v1/";
export const COLLECTIONS = ["works", "authors", "assertions", "entities", "relations"];

// Estados editoriais que NUNCA são públicos por API.
const NON_PUBLIC_STATES = new Set(["draft", "in_review", "withdrawn", "superseded", "contested", "review-visible"]);

// Allowlist de campos públicos por coleção. Tudo o que não estiver aqui é descartado.
export const FIELD_ALLOWLIST = {
  works: ["id", "slug", "title", "subtitle", "workType", "issuedYear", "languages", "doi", "accessStatus", "sources", "rights", "lastReviewed"],
  authors: ["id", "slug", "preferredName", "orcid", "sources", "rights", "lastReviewed"],
  assertions: ["id", "text", "language", "epistemicClass", "confidenceLevel", "entityIds", "sources", "rights", "lastReviewed"],
  entities: ["id", "slug", "entityType", "preferredLabel", "sources", "rights", "lastReviewed"],
  relations: ["id", "sourceAssertionId", "targetAssertionId", "relationType", "sources", "rights", "lastReviewed"]
};

// Chaves de aparência privada, descartadas por defesa mesmo que apareçam numa allowlist futura.
const PRIVATE_KEY_HINT = /(internal|private|contact|email|phone|token|secret|password|fullText|full_text|ocr|bodyText|body_text|reviewerNote|internalNote)/i;

const RIGHTS_NOTE = "Exposição por API exige decisão explícita 'allow', além do estado 'published'. Por omissão nega.";

// Decisão canónica de exposição por API. Só "allow" (string exata) habilita.
// Procurada em locais canónicos; qualquer outro valor (ou ausência) resolve como "unknown".
export function apiExposureDecision(item) {
  if (!item || typeof item !== "object") return "unknown";
  const v = item.apiExposure
    ?? (item.rights && item.rights.apiExposure)
    ?? (item.publicApi && item.publicApi.decision);
  return typeof v === "string" ? v : "unknown";
}

function editorialState(item) {
  return item.editorialStatus ?? item.status ?? null;
}

function lastReviewedValue(item) {
  return item.lastReviewed ?? item.lastReviewedAt ?? item.reviewedAt ?? null;
}

export function hasPublicSource(item) {
  const s = item.sources ?? item.publicSources;
  return Array.isArray(s) && s.length > 0;
}

// Elegibilidade fail-closed. Devolve apenas boolean; nunca explica o motivo da exclusão.
export function isApiEligible(item) {
  if (!item || typeof item !== "object") return false;
  const state = editorialState(item);
  if (state !== "published") return false;
  if (NON_PUBLIC_STATES.has(state)) return false; // redundante, defensivo
  if (apiExposureDecision(item) !== "allow") return false;
  if (!hasPublicSource(item)) return false;
  if (!lastReviewedValue(item)) return false;
  return true;
}

// Projeta apenas campos públicos allowlisted; normaliza lastReviewed.
export function projectFields(type, item) {
  const allow = FIELD_ALLOWLIST[type] || [];
  const out = {};
  for (const key of allow) {
    if (PRIVATE_KEY_HINT.test(key)) continue;
    const value = item[key];
    if (value === undefined || value === null) continue;
    out[key] = value;
  }
  const lr = lastReviewedValue(item);
  if (lr) out.lastReviewed = lr;
  return out;
}

// Ordenação determinista por id e, em empate, por slug.
export function sortItems(items) {
  return [...items].sort((a, b) => {
    const ka = `${a.id ?? ""} ${a.slug ?? ""}`;
    const kb = `${b.id ?? ""} ${b.slug ?? ""}`;
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
}

// Envelope de coleção uniforme, determinista, com paginação.
export function buildCollection(type, rawItems, opts = {}) {
  if (!COLLECTIONS.includes(type)) throw new Error(`public-api: coleção desconhecida '${type}'.`);
  const page = Number.isInteger(opts.page) && opts.page > 0 ? opts.page : 1;
  const pageSize = Number.isInteger(opts.pageSize) && opts.pageSize > 0 ? opts.pageSize : 100;
  const repositoryVersion = opts.repositoryVersion ?? null;

  const eligible = sortItems((Array.isArray(rawItems) ? rawItems : []).filter(isApiEligible)).map((x) => projectFields(type, x));
  const total = eligible.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const items = eligible.slice(start, start + pageSize);

  const warnings = [];
  if (total === 0) warnings.push("Coleção vazia: nenhum registo cumpre a elegibilidade de API (published + fonte pública + revisão + apiExposure 'allow'). Vazio é resultado honesto, não erro.");

  return {
    contractVersion: CONTRACT_VERSION,
    apiVersion: API_VERSION,
    repositoryVersion,
    resource: type,
    status: total === 0 ? "empty" : "ok",
    items,
    pagination: { page, pageSize, total, totalPages },
    sources: [],
    rights: { default: "deny", note: RIGHTS_NOTE },
    lastReviewed: null,
    warnings,
    generatedBy: "scripts/10d/build-public-api.mjs",
    notice: "Somente leitura. Export estático derivado de snapshots públicos. Itens excluídos por direitos ou estado editorial não são identificados nem contabilizados."
  };
}

// Envelope do índice. counts: { works, authors, assertions, entities, relations }.
export function buildIndex(counts = {}, opts = {}) {
  const repositoryVersion = opts.repositoryVersion ?? null;
  const resources = COLLECTIONS.map((name) => ({
    resource: name,
    path: `${API_ROOT}${name}.json`,
    count: Number.isInteger(counts[name]) ? counts[name] : 0
  }));
  const allEmpty = resources.every((r) => r.count === 0);
  return {
    contractVersion: CONTRACT_VERSION,
    apiVersion: API_VERSION,
    repositoryVersion,
    status: "ok",
    root: API_ROOT,
    transport: "static-json",
    readOnly: true,
    resources,
    rights: { default: "deny", note: RIGHTS_NOTE },
    warnings: allEmpty ? ["Todas as coleções estão vazias: nenhum registo tem elegibilidade de API comprovada nesta fase."] : [],
    generatedBy: "scripts/10d/build-public-api.mjs",
    notice: "Contrato público v1 somente de leitura. Sem servidor, base de dados, autenticação, escrita ou execução. O futuro MCP será adaptador sobre esta API."
  };
}
