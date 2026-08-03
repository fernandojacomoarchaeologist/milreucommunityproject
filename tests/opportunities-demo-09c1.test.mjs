/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C.1 — regras da jornada de oportunidades (modo demonstração / lógica pura).
 * Complementa (não substitui) os testes SQL/RLS do backend em supabase/collab-tests/009c1.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  initialOpportunitiesStore, createOpportunity, publishOpportunity, updateOpportunity,
  applyToOpportunity, withdrawApplication, decideApplication, removeParticipant,
  closeApplications, cancelOpportunity, setCapacity, duplicateOpportunity,
  visibleApplications, exportOperational, publicOpportunities, capacityReached,
  APPLICATION_TRANSITIONS,
} from "../src/collab/opportunities-demo.js";

const master = { userId: "demo-master" };
const cand = (id) => ({ userId: id, displayName: `Candidato ${id}`, isMinor: false });

function publishedOpp(store, over = {}) {
  const o = createOpportunity(store, master, { title: "Oficina de demonstração", summary: "Resumo de demonstração", opportunityType: "workshop", ...over });
  publishOpportunity(store, o.id);
  return o;
}

test("contrato de transições: submitted→accepted|not-selected|withdrawn; accepted→removed", () => {
  assert.deepEqual(APPLICATION_TRANSITIONS.submitted.sort(), ["accepted", "not-selected", "withdrawn"]);
  assert.deepEqual(APPLICATION_TRANSITIONS.accepted, ["removed"]);
  for (const terminal of ["not-selected", "withdrawn", "removed"]) assert.deepEqual(APPLICATION_TRANSITIONS[terminal], []);
});

test("publicar exige campos obrigatórios; rascunho não é público", () => {
  const store = initialOpportunitiesStore();
  const o = createOpportunity(store, master, { title: "", summary: "", opportunityType: "course" });
  assert.throws(() => publishOpportunity(store, o.id), /publish_requires_title/);
  assert.equal(publicOpportunities(store).length, 0, "rascunho não entra na superfície pública");
  updateOpportunity(store, o.id, { title: "Curso", summary: "Resumo" });
  publishOpportunity(store, o.id);
  assert.equal(publicOpportunities(store).length, 1);
});

test("oportunidade de membros não entra na descoberta pública", () => {
  const store = initialOpportunitiesStore();
  publishedOpp(store, { visibility: "members" });
  assert.equal(publicOpportunities(store).length, 0);
});

test("candidatura única: submissão duplicada é bloqueada", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  applyToOpportunity(store, o.id, cand("u1"));
  assert.throws(() => applyToOpportunity(store, o.id, cand("u1")), /already_applied/);
  assert.equal(store.applications.filter((a) => a.opportunityId === o.id).length, 1);
});

test("menores bloqueados até política (minors_policy_pending)", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  assert.throws(() => applyToOpportunity(store, o.id, { userId: "minor", displayName: "M", isMinor: true }), /minors_policy_pending/);
});

test("capacidade máxima aplicada honestamente (submetidas+aceites ocupam lugar)", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store, { capacityMode: "limited", capacity: 1 });
  applyToOpportunity(store, o.id, cand("u1"));
  assert.equal(capacityReached(store, store.opportunities.find((x) => x.id === o.id)), true);
  assert.throws(() => applyToOpportunity(store, o.id, cand("u2")), /capacity_reached/);
});

test("encerrar candidaturas impede novas sem apagar a oportunidade", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  closeApplications(store, o.id);
  assert.throws(() => applyToOpportunity(store, o.id, cand("u1")), /applications_closed/);
  assert.ok(store.opportunities.find((x) => x.id === o.id), "oportunidade continua a existir");
});

test("cancelar preserva histórico e bloqueia candidaturas", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  applyToOpportunity(store, o.id, cand("u1"));
  cancelOpportunity(store, o.id, "razão interna");
  assert.equal(store.opportunities.find((x) => x.id === o.id).status, "cancelled");
  assert.equal(store.applications.length, 1, "candidatura preservada");
  assert.throws(() => applyToOpportunity(store, o.id, cand("u2")), /applications_closed|opportunity_not_published/);
});

test("decisão: aceitar e não selecionar; remoção exige razão interna", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  const a1 = applyToOpportunity(store, o.id, cand("u1"));
  const a2 = applyToOpportunity(store, o.id, cand("u2"));
  decideApplication(store, a1.id, "accepted");
  decideApplication(store, a2.id, "not-selected");
  assert.equal(store.applications.find((a) => a.id === a1.id).status, "accepted");
  assert.equal(store.applications.find((a) => a.id === a2.id).status, "not-selected");
  assert.throws(() => removeParticipant(store, a1.id, ""), /reason_required/);
  removeParticipant(store, a1.id, "saiu do projeto");
  assert.equal(store.applications.find((a) => a.id === a1.id).status, "removed");
});

test("transições inválidas são recusadas (não-selecionada não pode ser aceite)", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  const a = applyToOpportunity(store, o.id, cand("u1"));
  decideApplication(store, a.id, "not-selected");
  assert.throws(() => decideApplication(store, a.id, "accepted"), /invalid_transition/);
});

test("retirada pelo próprio; outro utilizador não pode retirar", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  const a = applyToOpportunity(store, o.id, cand("u1"));
  assert.throws(() => withdrawApplication(store, a.id, "u2"), /forbidden/);
  withdrawApplication(store, a.id, "u1");
  assert.equal(store.applications.find((x) => x.id === a.id).status, "withdrawn");
});

test("privacidade: candidato só vê a própria candidatura; nunca a alheia", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  applyToOpportunity(store, o.id, cand("u1"));
  applyToOpportunity(store, o.id, cand("u2"));
  const asU1 = visibleApplications(store, o.id, { userId: "u1" });
  assert.equal(asU1.length, 1);
  assert.equal(asU1[0].userId, "u1");
  const asManager = visibleApplications(store, o.id, { canManage: true });
  assert.equal(asManager.length, 2);
  const asAnon = visibleApplications(store, o.id, {});
  assert.equal(asAnon.length, 0);
});

test("candidato nunca vê notas/justificações internas do master", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  const a = applyToOpportunity(store, o.id, cand("u1"));
  decideApplication(store, a.id, "accepted");
  removeParticipant(store, a.id, "motivo interno confidencial");
  const own = visibleApplications(store, o.id, { userId: "u1" })[0];
  assert.equal("removalReason" in own, false);
  assert.equal("internalNote" in own, false);
});

test("duplicar cria rascunho novo e NÃO copia candidaturas", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  applyToOpportunity(store, o.id, cand("u1"));
  const copy = duplicateOpportunity(store, o.id, master);
  assert.equal(copy.status, "draft");
  assert.equal(store.applications.filter((a) => a.opportunityId === copy.id).length, 0);
});

test("exportação operacional é minimizada (sem notas internas)", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store);
  const a = applyToOpportunity(store, o.id, cand("u1"));
  decideApplication(store, a.id, "accepted");
  const rows = exportOperational(store, o.id);
  assert.equal(rows.length, 1);
  assert.deepEqual(Object.keys(rows[0]).sort(), ["applicant", "status", "submittedAt"].sort());
});

test("dados operacionais não são alterados por 'tradução' (o modelo é único, pt-PT)", () => {
  const store = initialOpportunitiesStore();
  const o = publishedOpp(store, { capacityMode: "limited", capacity: 5, startsAt: "2026-09-01" });
  // não existe caminho para traduzir datas/capacidade: os campos são únicos no objeto.
  const found = store.opportunities.find((x) => x.id === o.id);
  assert.equal(found.capacity, 5);
  assert.equal(found.startsAt, "2026-09-01");
});
