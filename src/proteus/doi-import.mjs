/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10B — importação assistida por DOI (adaptador PURO, sem rede embutida).
 * Normaliza DOI/ORCID, mapeia metadados externos (ex.: Crossref) para um ImportDraft
 * que NUNCA é publicado automaticamente (publicationApproved: false), deteta duplicados
 * de forma conservadora (nunca funde), e regista proveniência e avisos. Não descarrega
 * PDFs, não faz OCR/scraping, não infere direitos nem biografia. A chamada de rede real
 * fica fora deste módulo; os testes injetam respostas sintéticas (mocks).
 */

/** Normaliza um DOI: remove prefixos/URL, valida o padrão 10.xxxx/suffix. Devolve null se inválido. */
export function normalizeDoi(input) {
  if (!input || typeof input !== "string") return null;
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\/(dx\.)?doi\.org\//, "").replace(/^doi:\s*/, "").trim();
  return /^10\.\d{4,9}\/\S+$/.test(d) ? d : null;
}

/** Normaliza um ORCID para 0000-0000-0000-000X e valida o dígito de controlo (ISO 7064 mod 11-2). */
export function normalizeOrcid(input) {
  if (!input || typeof input !== "string") return null;
  const digits = input.replace(/^https?:\/\/orcid\.org\//i, "").replace(/[\s-]/g, "").toUpperCase();
  if (!/^\d{15}[\dX]$/.test(digits)) return null;
  let total = 0;
  for (let i = 0; i < 15; i++) total = (total + Number(digits[i])) * 2;
  const remainder = total % 11;
  const check = (12 - remainder) % 11;
  const expected = check === 10 ? "X" : String(check);
  if (digits[15] !== expected) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}-${digits.slice(12, 16)}`;
}

const nowIso = () => new Date().toISOString();

/** Mapeia uma mensagem Crossref (message) para um ImportDraft. Não decide direitos nem publica. */
export function mapCrossrefToDraft(message, normalizedDoi, { provider = "crossref", providerRecordId = null } = {}) {
  const m = message || {};
  const issuedParts = m.issued?.["date-parts"]?.[0] || [];
  const mappedFields = {
    title: Array.isArray(m.title) ? m.title[0] || null : m.title || null,
    subtitle: Array.isArray(m.subtitle) ? m.subtitle[0] || null : null,
    workType: mapType(m.type),
    issued: issuedParts.length ? { year: issuedParts[0] ?? null, month: issuedParts[1] ?? null, day: issuedParts[2] ?? null, precision: precisionOf(issuedParts) } : null,
    authors: (m.author || []).map((a, i) => ({
      position: i + 1,
      preferredName: [a.given, a.family].filter(Boolean).join(" ") || null,
      orcid: a.ORCID ? normalizeOrcid(a.ORCID) : null,
      verified: false,
    })),
    publication: {
      containerTitle: Array.isArray(m["container-title"]) ? m["container-title"][0] || null : null,
      publisher: m.publisher || null,
      volume: m.volume || null,
      issue: m.issue || null,
      pages: m.page || null,
    },
    identifiers: {
      doi: normalizedDoi,
      issn: Array.isArray(m.ISSN) ? m.ISSN : (m.ISSN ? [m.ISSN] : []),
      isbn: Array.isArray(m.ISBN) ? m.ISBN : (m.ISBN ? [m.ISBN] : []),
      url: m.URL || null,
    },
    languages: m.language ? [m.language] : [],
  };
  const warnings = [];
  if (!mappedFields.title) warnings.push("missing_title");
  if (!mappedFields.authors.length) warnings.push("missing_authors");
  if (!mappedFields.issued) warnings.push("missing_date");
  if (mappedFields.workType === "other") warnings.push("uncontrolled_type");
  // Direitos NUNCA inferidos a partir da presença de URL de texto integral.
  warnings.push("rights_not_evaluated");

  return {
    id: `import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    normalizedDoi,
    provider,
    providerRecordId,
    retrievedAt: nowIso(),
    status: "draft",
    mappedFields,
    warnings,
    duplicateCandidates: [],
    publicationApproved: false,
  };
}

/** Deteção conservadora de duplicados por DOI normalizado. Nunca funde: apenas assinala. */
export function detectDuplicateCandidates(existingWorks, normalizedDoi) {
  if (!normalizedDoi) return [];
  return (existingWorks || [])
    .filter((w) => normalizeDoi(w.identifiers?.doi || "") === normalizedDoi)
    .map((w) => ({ workId: w.id, reason: "same_normalized_doi" }));
}

/** Constrói o rascunho completo com dedup, garantindo que não publica. */
export function buildImportDraft({ doi, message, existingWorks = [], provider = "crossref" }) {
  const normalizedDoi = normalizeDoi(doi);
  if (!normalizedDoi) throw new Error("invalid_doi");
  const draft = mapCrossrefToDraft(message, normalizedDoi, { provider });
  draft.duplicateCandidates = detectDuplicateCandidates(existingWorks, normalizedDoi);
  draft.publicationApproved = false; // reforço: importação nunca publica
  return draft;
}

function mapType(t) {
  const map = {
    "journal-article": "article", "book": "book", "book-chapter": "book-chapter",
    "report": "report", "dissertation": "thesis", "proceedings-article": "conference-paper",
    "dataset": "dataset",
  };
  return map[t] || "other";
}
function precisionOf(parts) {
  return parts.length >= 3 ? "day" : parts.length === 2 ? "month" : parts.length === 1 ? "year" : "unknown";
}
