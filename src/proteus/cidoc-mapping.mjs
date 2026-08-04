/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10C — camada SEPARADA de mapeamento para CIDOC CRM (interoperabilidade), pura e
 * testável. NÃO é um formulário editorial: o vocabulário legível continua a ser a fonte
 * operacional. O mapeamento é pragmático e NÃO declara conformidade CIDOC integral. Cada
 * mapeamento inclui termo local, URI CIDOC, versão do CRM, relação (exact/broader/narrower/
 * related), justificação e estado; mapeamentos ambíguos permanecem 'draft'/pendentes. Não se
 * inventam propriedades para forçar equivalência.
 */

export const CRM_VERSION = "7.1.3";
export const MAPPING_RELATIONS = ["exact", "broader", "narrower", "related"];
export const MAPPING_STATES = ["draft", "approved", "deprecated"];

const isNonEmpty = (v) => typeof v === "string" && v.trim() !== "";

export function validateCidocMapping(m) {
  const e = [];
  if (!m || typeof m !== "object") return { valid: false, errors: ["mapeamento inválido"] };
  for (const f of ["id", "localTerm", "cidocUri", "crmVersion", "mappingRelation", "justification", "status"]) {
    if (m[f] === undefined) e.push(`campo obrigatório em falta: ${f}`);
  }
  if (m.cidocUri !== undefined && !/cidoc-crm/.test(String(m.cidocUri))) e.push("cidocUri deve referir cidoc-crm");
  if (m.mappingRelation !== undefined && !MAPPING_RELATIONS.includes(m.mappingRelation)) e.push(`relação de mapeamento inválida: ${m.mappingRelation}`);
  if (m.status !== undefined && !MAPPING_STATES.includes(m.status)) e.push(`estado de mapeamento inválido: ${m.status}`);
  if (m.justification !== undefined && !isNonEmpty(m.justification)) e.push("mapeamento exige justificação");
  if (m.crmVersion !== undefined && !isNonEmpty(m.crmVersion)) e.push("mapeamento exige versão do CRM");
  return { valid: e.length === 0, errors: e };
}

// Exporta um pacote de interoperabilidade validado, declarando conformância PARCIAL (não
// certificada). Lança se algum mapeamento for inválido.
export function exportCidocMappings(mappings = []) {
  const invalid = mappings
    .map((m, i) => ({ i, id: m && m.id, result: validateCidocMapping(m) }))
    .filter((x) => !x.result.valid);
  if (invalid.length) throw new Error(`mapeamentos CIDOC inválidos: ${JSON.stringify(invalid)}`);
  return {
    crmVersion: CRM_VERSION,
    conformance: "partial-not-certified",
    note: "Camada de interoperabilidade. Não declara conformidade CIDOC CRM integral; mapeamentos 'draft' aguardam revisão humana.",
    generatedAt: new Date().toISOString().slice(0, 10),
    mappings,
  };
}
