/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — núcleo PURO de ingestão controlada (quarentena). Sem I/O, sem rede, sem PDF/OCR/
 * texto integral, sem relógio nem aleatoriedade e sem mutação. Recebe apenas JSON já preparado e
 * estritamente limitado ao contrato. Toda proposta permanece `draft` em quarentena: NUNCA altera
 * `knowledge-assertions.json`, entidades, relações, catálogo ou snapshots. Instantes e IDs vêm do
 * chamador e são validados. A pré-visualização não tem `--apply`.
 */
import { EPISTEMIC_CLASSES, confidenceErrors, validateEvidenceLocator } from "./knowledge-model.mjs";

export const INGESTION_STATE = "draft"; // estado inicial invariável de qualquer candidato
const isNonEmpty = (v) => typeof v === "string" && v.trim() !== "";

// Valida UMA proposta contra a fonte incluída e os direitos conhecidos. Fail-closed.
export function validateProposal(proposal, { includedSources = [], excludedSources = [], canonicalIds = [], paginatedSources = [] } = {}) {
  const errors = [];
  if (!proposal || typeof proposal !== "object") return { valid: false, errors: ["proposta inválida"], state: INGESTION_STATE };
  if (!isNonEmpty(proposal.id)) errors.push("id em falta");
  if (canonicalIds.includes(proposal.id)) errors.push(`colisão com id canónico: ${proposal.id}`);
  if (proposal.status !== undefined && proposal.status !== INGESTION_STATE) errors.push("estado inicial tem de ser 'draft' (quarentena)");
  // Fonte: tem de existir em 'included'; excluída/ausente/ambígua bloqueia.
  if (!isNonEmpty(proposal.sourceId)) errors.push("sourceId em falta");
  else if (excludedSources.includes(proposal.sourceId)) errors.push(`fonte excluída: ${proposal.sourceId}`);
  else if (!includedSources.includes(proposal.sourceId)) errors.push(`fonte não incluída ou ambígua: ${proposal.sourceId}`);
  // Classe epistémica.
  if (!EPISTEMIC_CLASSES.includes(proposal.epistemicClass)) errors.push(`classe epistémica inválida: ${proposal.epistemicClass}`);
  // Confiança nunca probabilística/percentual.
  if (proposal.confidence) confidenceErrors(proposal.confidence).forEach((e) => errors.push(e));
  else errors.push("confiança em falta");
  // Localizador válido; recurso paginado exige localizador de página/secção.
  if (!proposal.locator) errors.push("localizador em falta");
  else {
    const paginated = paginatedSources.includes(proposal.sourceId);
    const r = validateEvidenceLocator(proposal.locator, { sourcePaginated: paginated });
    if (!r.valid) r.errors.forEach((e) => errors.push(`localizador: ${e}`));
  }
  // Citação textual só com direitos aprovados.
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

// Pré-visualização de quarentena PURA: sempre `draft`, sem mutação, sem I/O. O chamador fornece
// batchId/proposedBy/proposedAt; nada é escrito nos dados canónicos.
export function buildIngestionPreview(batch = {}, scope = {}) {
  const items = normalizeOrder(Array.isArray(batch.items) ? batch.items : []);
  const { duplicates, collisions } = detectDuplicates(items, scope.canonicalIds || []);
  const dupSet = new Set(duplicates);
  const evaluated = items.map((p) => {
    const v = validateProposal(p, scope);
    const errors = [...v.errors];
    if (dupSet.has(p && p.id)) errors.push(`id duplicado no lote: ${p.id}`);
    return { id: p && p.id, sourceId: p && p.sourceId, epistemicClass: p && p.epistemicClass, valid: errors.length === 0, errors, state: INGESTION_STATE };
  });
  const accepted = evaluated.filter((e) => e.valid);
  const rejected = evaluated.filter((e) => !e.valid);
  return {
    contractVersion: "1.0",
    kind: "ingestion-preview",
    state: INGESTION_STATE,
    batchId: batch.batchId ?? null,
    proposedBy: batch.proposedBy ?? null,
    proposedAt: batch.proposedAt ?? null,
    totals: { received: items.length, accepted: accepted.length, rejected: rejected.length, duplicates: duplicates.length, collisions: collisions.length },
    accepted: accepted.map((e) => ({ id: e.id, sourceId: e.sourceId, state: INGESTION_STATE })),
    rejected,
    duplicates,
    collisions,
    servedPublication: false,
    publicationAllowed: false,
    humanActionRequired: true,
    notice: "Proposta em quarentena. Estado 'draft'. Não altera dados canónicos, snapshots ou catálogo. A passagem a 'in_review' exige ação humana explícita. Sem publicação nem apiExposure.",
  };
}
