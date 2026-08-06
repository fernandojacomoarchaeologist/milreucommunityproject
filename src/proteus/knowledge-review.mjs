/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10C.1 — modelo editorial PURO e testável para o piloto de afirmações verificáveis.
 * Trabalha sobre os dados editoriais repo-internos (data/proteus/knowledge-*.json), que são
 * PÚBLICOS em Git mas permanecem `in_review` (HD-02). Este módulo NÃO serve conteúdo, NÃO
 * escreve no snapshot público, NÃO publica automaticamente e NUNCA fabrica revisor/aprovação:
 * qualquer transição exige um `reviewerId` humano explícito. Sem persistência segura comprovada,
 * é um adaptador demonstrável; a UI/persistência servida depende da futura fundação Supabase.
 */
import { canTransition } from "./knowledge-model.mjs";

export const EDITORIAL_ACTIONS = ["return_to_draft", "request_changes", "approve", "reject"];

// Ação editorial → estado-alvo (dentro das transições válidas do modelo 10C). 'approve' NUNCA
// publica: leva a 'approved'; a publicação exige um gate separado (canPublishAssertion) + direitos.
const ACTION_TARGET = {
  return_to_draft: "draft",
  request_changes: "draft",
  approve: "approved",
  reject: "withdrawn",
};

const isNonEmpty = (v) => typeof v === "string" && v.trim() !== "";

// Mapa assertionId → sourceIds (via localizadores de evidência).
export function sourcesByAssertion(assertions, locators) {
  const locById = Object.fromEntries((locators || []).map((l) => [l.id, l]));
  const out = {};
  for (const a of assertions || []) {
    out[a.id] = [...new Set((a.evidenceIds || []).map((id) => locById[id]?.sourceId).filter(Boolean))];
  }
  return out;
}

// Filtros editoriais por classe epistémica, fonte, estado e prioridade de revisão.
export function filterProposals(assertions, filters = {}, { locators = [], queue = [] } = {}) {
  const bySource = sourcesByAssertion(assertions, locators);
  const priorityById = Object.fromEntries((queue || []).map((q) => [q.assertionId, q.priority]));
  return (assertions || []).filter((a) => {
    if (filters.epistemicClass && a.epistemicClass !== filters.epistemicClass) return false;
    if (filters.state && a.status !== filters.state) return false;
    if (filters.sourceId && !(bySource[a.id] || []).includes(filters.sourceId)) return false;
    if (filters.priority && priorityById[a.id] !== filters.priority) return false;
    return true;
  });
}

// Transição editorial com revisor humano OBRIGATÓRIO. Devolve o registo da decisão (não muta o
// objeto original) OU lança se faltar revisor ou a transição for inválida. NUNCA publica.
export function reviewTransition(assertion, action, reviewerId, { comment = null } = {}) {
  if (!EDITORIAL_ACTIONS.includes(action)) throw new Error(`ação editorial desconhecida: ${action}`);
  if (!isNonEmpty(reviewerId)) throw new Error("revisão exige um reviewerId humano explícito (não pode ser fabricado)");
  const target = ACTION_TARGET[action];
  if (!canTransition(assertion.status, target)) throw new Error(`transição inválida: ${assertion.status} → ${target}`);
  if (target === "published") throw new Error("a revisão editorial nunca publica automaticamente");
  return {
    assertionId: assertion.id,
    action,
    fromState: assertion.status,
    toState: target,
    reviewerId,
    comment: comment || null,
    decidedAt: new Date().toISOString(),
  };
}

// Índice editorial NÃO servido: junta afirmação + evidência + entidades + prioridade, marcando
// explicitamente o estatuto (público em Git, em revisão, não servido). Nunca vai para public/.
export function buildEditorialIndex({ assertions = [], locators = [], entities = [], queue = [] } = {}) {
  const locById = Object.fromEntries(locators.map((l) => [l.id, l]));
  const entById = Object.fromEntries(entities.map((e) => [e.id, e]));
  const qById = Object.fromEntries(queue.map((q) => [q.assertionId, q]));
  return {
    servedPublication: false,
    statusNote: "público em Git (CC BY 4.0 na camada original) · em revisão editorial · NÃO servido na aplicação",
    items: assertions.map((a) => ({
      id: a.id,
      text: a.text,
      epistemicClass: a.epistemicClass,
      state: a.status,
      confidence: a.confidence || null,
      evidence: (a.evidenceIds || []).map((id) => locById[id]).filter(Boolean).map((l) => ({
        sourceId: l.sourceId, locatorType: l.locatorType, label: l.label, accessedAt: l.accessedAt,
        volatile: /din[âa]mico|reverific|volátil|estado operacional/i.test(`${l.notes || ""} ${l.label || ""}`),
      })),
      entities: (a.entityIds || []).map((id) => entById[id]).filter(Boolean).map((e) => ({ id: e.id, type: e.type, label: e.preferredLabel })),
      reviewPriority: qById[a.id]?.priority || null,
      reviewChecks: qById[a.id]?.checks || [],
      publicInGit: true,
      approved: false,
    })),
  };
}
