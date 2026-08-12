/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — núcleo PURO de ingestão controlada (quarentena). Sem I/O, sem rede, sem PDF/OCR/
 * texto integral, sem relógio nem aleatoriedade e sem mutação. Valida efetivamente o contrato
 * `contracts/10e/ingestion-proposal.schema.json` (campos obrigatórios, `additionalProperties:false`,
 * enum de idioma, timestamps ISO 8601, coerência de fonte no localizador, proveniência e regras de
 * IA). Toda proposta permanece `draft` em quarentena e NUNCA altera dados canónicos. Um lote com
 * cabeçalho inválido NÃO aceita candidatos parcialmente. Instantes e IDs vêm do chamador.
 */
import { EPISTEMIC_CLASSES, confidenceErrors, validateEvidenceLocator } from "./knowledge-model.mjs";

export const INGESTION_STATE = "draft"; // estado inicial invariável de qualquer candidato
export const LANGS_ENUM = ["pt-PT", "en", "es", "fr"];
// Espelham `contracts/10e/ingestion-proposal.schema.json` (validado por validate-10e.mjs).
export const BATCH_REQUIRED = ["batchId", "proposedBy", "proposedAt", "items"];
export const BATCH_KEYS = ["batchId", "proposedBy", "proposedAt", "items"];
export const PROPOSAL_REQUIRED = ["id", "text", "language", "epistemicClass", "sourceId", "locator", "confidence", "proposedBy", "proposedAt"];
export const PROPOSAL_KEYS = ["id", "text", "language", "epistemicClass", "status", "sourceId", "sourceVersion", "entityIds", "locator", "transformation", "tool", "toolVersion", "aiAssisted", "hash", "quotation", "quotationRightsApproved", "confidence", "proposedBy", "proposedAt"];
export const LOCATOR_KEYS = ["id", "sourceId", "locatorType", "pageStart", "pageEnd", "label", "url", "accessedAt", "quotation", "quotationRightsApproved", "notes"];
// Campos de proveniência preservados na pré-visualização de itens aceites (sem mutação).
export const PRESERVE_KEYS = ["id", "text", "language", "epistemicClass", "sourceId", "sourceVersion", "entityIds", "locator", "confidence", "transformation", "tool", "toolVersion", "aiAssisted", "hash", "proposedBy", "proposedAt"];

const isNonEmpty = (v) => typeof v === "string" && v.trim() !== "";
const ISO_8601 = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;
const isISO = (v) => typeof v === "string" && ISO_8601.test(v);
const unknownKeys = (obj, allowed) => (obj && typeof obj === "object" ? Object.keys(obj).filter((k) => !allowed.includes(k)) : []);

// Valida apenas a ESTRUTURA do cabeçalho do lote (sem avaliar itens).
export function validateBatchHeader(batch) {
  const errors = [];
  if (!batch || typeof batch !== "object" || Array.isArray(batch)) return { valid: false, errors: ["lote inválido (objeto esperado)"] };
  for (const f of BATCH_REQUIRED) if (batch[f] === undefined) errors.push(`lote: campo obrigatório em falta: ${f}`);
  for (const k of unknownKeys(batch, BATCH_KEYS)) errors.push(`lote: propriedade desconhecida: ${k}`);
  if (batch.batchId !== undefined && !isNonEmpty(batch.batchId)) errors.push("lote: batchId inválido");
  if (batch.proposedBy !== undefined && !isNonEmpty(batch.proposedBy)) errors.push("lote: proposedBy inválido");
  if (batch.proposedAt !== undefined && !isISO(batch.proposedAt)) errors.push("lote: proposedAt não é ISO 8601");
  if (batch.items !== undefined && !Array.isArray(batch.items)) errors.push("lote: items deve ser um array");
  return { valid: errors.length === 0, errors };
}

// Valida UMA proposta contra o contrato e o âmbito (fontes incluídas, IDs canónicos). Fail-closed.
export function validateProposal(proposal, { includedSources = [], excludedSources = [], canonicalIds = [], paginatedSources = [] } = {}) {
  const errors = [];
  if (!proposal || typeof proposal !== "object" || Array.isArray(proposal)) return { valid: false, errors: ["proposta inválida"], state: INGESTION_STATE };
  // Estrutura: obrigatórios + propriedades desconhecidas.
  for (const f of PROPOSAL_REQUIRED) if (proposal[f] === undefined) errors.push(`campo obrigatório em falta: ${f}`);
  for (const k of unknownKeys(proposal, PROPOSAL_KEYS)) errors.push(`propriedade desconhecida: ${k}`);
  // Estado inicial e identificação.
  if (!isNonEmpty(proposal.id)) errors.push("id em falta");
  if (canonicalIds.includes(proposal.id)) errors.push(`colisão com id canónico: ${proposal.id}`);
  if (proposal.status !== undefined && proposal.status !== INGESTION_STATE) errors.push("estado inicial tem de ser 'draft' (quarentena)");
  if (proposal.text !== undefined && !isNonEmpty(proposal.text)) errors.push("text vazio");
  // Idioma pelo enum.
  if (!LANGS_ENUM.includes(proposal.language)) errors.push(`idioma inválido: ${proposal.language}`);
  // Timestamps ISO 8601.
  if (!isISO(proposal.proposedAt)) errors.push("proposedAt não é ISO 8601");
  if (!isNonEmpty(proposal.proposedBy)) errors.push("proposedBy em falta");
  // Fonte: incluída; excluída/ausente/ambígua bloqueia.
  if (!isNonEmpty(proposal.sourceId)) errors.push("sourceId em falta");
  else if (excludedSources.includes(proposal.sourceId)) errors.push(`fonte excluída: ${proposal.sourceId}`);
  else if (!includedSources.includes(proposal.sourceId)) errors.push(`fonte não incluída ou ambígua: ${proposal.sourceId}`);
  // Versão/edição da fonte: opcional; quando fornecida, string não vazia (não se inventa).
  if (proposal.sourceVersion !== undefined && !isNonEmpty(proposal.sourceVersion)) errors.push("sourceVersion, quando presente, tem de ser uma string não vazia");
  // Classe epistémica.
  if (!EPISTEMIC_CLASSES.includes(proposal.epistemicClass)) errors.push(`classe epistémica inválida: ${proposal.epistemicClass}`);
  // Confiança nunca probabilística/percentual.
  if (proposal.confidence) confidenceErrors(proposal.confidence).forEach((e) => errors.push(e));
  else errors.push("confiança em falta");
  // Localizador: contrato + coerência de fonte + ISO + paginação.
  if (!proposal.locator || typeof proposal.locator !== "object") errors.push("localizador em falta");
  else {
    for (const k of unknownKeys(proposal.locator, LOCATOR_KEYS)) errors.push(`localizador: propriedade desconhecida: ${k}`);
    if (proposal.locator.sourceId !== proposal.sourceId) errors.push("localizador: sourceId tem de coincidir com o da proposta");
    if (proposal.locator.accessedAt !== undefined && !isISO(proposal.locator.accessedAt)) errors.push("localizador: accessedAt não é ISO 8601");
    const paginated = paginatedSources.includes(proposal.sourceId);
    const r = validateEvidenceLocator(proposal.locator, { sourcePaginated: paginated });
    if (!r.valid) r.errors.forEach((e) => errors.push(`localizador: ${e}`));
  }
  // Proveniência assistida por IA: exige transformação, ferramenta e versão.
  if (proposal.aiAssisted === true) {
    if (!isNonEmpty(proposal.transformation)) errors.push("aiAssisted exige 'transformation'");
    if (!isNonEmpty(proposal.tool)) errors.push("aiAssisted exige 'tool'");
    if (!isNonEmpty(proposal.toolVersion)) errors.push("aiAssisted exige 'toolVersion'");
  }
  // Citação textual só com direitos aprovados (proposta e localizador).
  if (isNonEmpty(proposal.quotation) && proposal.quotationRightsApproved !== true) errors.push("citação textual sem direitos aprovados");
  return { valid: errors.length === 0, errors, state: INGESTION_STATE };
}

// Deteta duplicados dentro do lote e colisões com IDs canónicos fornecidos pelo chamador.
export function detectDuplicates(items = [], canonicalIds = []) {
  const seen = new Set(); const duplicates = new Set(); const collisions = new Set();
  for (const it of items) {
    const id = it && it.id;
    if (id === undefined) continue;
    if (seen.has(id)) duplicates.add(id); else seen.add(id);
    if (canonicalIds.includes(id)) collisions.add(id);
  }
  return { duplicates: [...duplicates], collisions: [...collisions] };
}

// Ordenação determinística por id, sem alterar conteúdo semântico.
export function normalizeOrder(items = []) {
  return [...items].sort((a, b) => {
    const ka = String(a && a.id !== undefined ? a.id : "");
    const kb = String(b && b.id !== undefined ? b.id : "");
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
}

// Validação do LOTE COMPLETO: cabeçalho + cada item. Cabeçalho inválido => nada é aceite.
export function validateBatch(batch = {}, scope = {}) {
  const header = validateBatchHeader(batch);
  if (!header.valid) return { valid: false, headerValid: false, headerErrors: header.errors, items: [], duplicates: [], collisions: [] };
  const items = normalizeOrder(batch.items || []);
  const { duplicates, collisions } = detectDuplicates(items, scope.canonicalIds || []);
  const dup = new Set(duplicates);
  const results = items.map((p) => {
    const v = validateProposal(p, scope);
    const errors = [...v.errors];
    if (dup.has(p && p.id)) errors.push(`id duplicado no lote: ${p.id}`);
    return { id: p && p.id, valid: errors.length === 0, errors };
  });
  return { valid: results.every((r) => r.valid), headerValid: true, headerErrors: [], items: results, duplicates, collisions };
}

// Preserva a proveniência de um item aceite, sem mutação. Não inclui citação sem direitos aprovados.
export function preserveProposal(p) {
  const out = {};
  for (const k of PRESERVE_KEYS) if (p[k] !== undefined) out[k] = p[k];
  if (isNonEmpty(p.quotation) && p.quotationRightsApproved === true) { out.quotation = p.quotation; out.quotationRightsApproved = true; }
  out.state = INGESTION_STATE;
  return out;
}

// Pré-visualização de quarentena PURA. Cabeçalho inválido => rejeição total (sem aceitação parcial).
export function buildIngestionPreview(batch = {}, scope = {}) {
  const header = validateBatchHeader(batch);
  const rawItems = Array.isArray(batch && batch.items) ? batch.items : [];
  if (!header.valid) {
    return {
      contractVersion: "1.0", kind: "ingestion-preview", state: INGESTION_STATE, batchValid: false,
      batchId: (batch && batch.batchId) ?? null, proposedBy: (batch && batch.proposedBy) ?? null, proposedAt: (batch && batch.proposedAt) ?? null,
      totals: { received: rawItems.length, accepted: 0, rejected: rawItems.length, duplicates: 0, collisions: 0 },
      accepted: [], rejected: [], headerErrors: header.errors, duplicates: [], collisions: [],
      servedPublication: false, publicationAllowed: false, humanActionRequired: true,
      notice: "Lote inválido: o cabeçalho não cumpre o contrato. NENHUM candidato é aceite (sem aceitação parcial).",
    };
  }
  const items = normalizeOrder(rawItems);
  const rawById = new Map(items.map((p) => [p && p.id, p]));
  const { duplicates, collisions } = detectDuplicates(items, scope.canonicalIds || []);
  const dupSet = new Set(duplicates);
  const evaluated = items.map((p) => {
    const v = validateProposal(p, scope);
    const errors = [...v.errors];
    if (dupSet.has(p && p.id)) errors.push(`id duplicado no lote: ${p.id}`);
    return { id: p && p.id, sourceId: p && p.sourceId, epistemicClass: p && p.epistemicClass, valid: errors.length === 0, errors };
  });
  const accepted = evaluated.filter((e) => e.valid);
  const rejected = evaluated.filter((e) => !e.valid);
  return {
    contractVersion: "1.0", kind: "ingestion-preview", state: INGESTION_STATE, batchValid: true,
    batchId: batch.batchId ?? null, proposedBy: batch.proposedBy ?? null, proposedAt: batch.proposedAt ?? null,
    totals: { received: items.length, accepted: accepted.length, rejected: rejected.length, duplicates: duplicates.length, collisions: collisions.length },
    accepted: accepted.map((e) => preserveProposal(rawById.get(e.id))),
    rejected, duplicates, collisions, headerErrors: [],
    servedPublication: false, publicationAllowed: false, humanActionRequired: true,
    notice: "Proposta em quarentena. Estado 'draft'. Não altera dados canónicos, snapshots ou catálogo. A passagem a 'in_review' exige ação humana explícita. Sem publicação nem apiExposure.",
  };
}
