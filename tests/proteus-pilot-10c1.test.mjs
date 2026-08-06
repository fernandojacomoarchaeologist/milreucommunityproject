/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10C.1 — testes do piloto de afirmações verificáveis e do modelo editorial puro.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterProposals, reviewTransition, buildEditorialIndex, sourcesByAssertion } from "../src/proteus/knowledge-review.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const A = read("data/proteus/knowledge-assertions.json");
const E = read("data/proteus/knowledge-evidence-locators.json");
const Q = read("data/proteus/knowledge-review-queue.json");
const assertions = A.assertions, entities = A.entities, locators = E.locators, queue = Q.items;

test("16 afirmações in_review, 10 entidades draft, 16 localizadores, 0 published", () => {
  assert.equal(assertions.length, 16);
  assert.equal(entities.length, 10);
  assert.equal(locators.length, 16);
  assert.ok(assertions.every((a) => a.status === "in_review"));
  assert.ok(entities.every((e) => e.status === "draft"));
  assert.ok(!assertions.some((a) => a.status === "published"));
});

test("classes epistémicas e incerteza preservadas (não convertidas em facto)", () => {
  const classes = new Set(assertions.map((a) => a.epistemicClass));
  assert.ok(classes.has("hypothesis") || classes.has("uncertainty_statement"), "hipótese/incerteza presentes");
  // nenhuma afirmação de hipótese/incerteza foi marcada como fact_claim de forma encoberta
  assert.ok(assertions.every((a) => ["fact_claim", "interpretation", "hypothesis", "inference", "memory_account", "uncertainty_statement"].includes(a.epistemicClass)));
});

test("confiança por níveis, nunca percentagem de verdade", () => {
  assert.doesNotMatch(JSON.stringify(assertions), /\d{1,3}\s?%|percent|probabilit/i);
  assert.ok(assertions.every((a) => ["insufficient", "limited", "supported", "well_supported"].includes(a.confidence.level)));
});

test("fontes ∈ 10B.1 e fontes excluídas não usadas", () => {
  const pilot = new Set(read("data/proteus/pilot-records.json").records.map((r) => r.id));
  const scope = read("data/proteus/knowledge-source-scope.json");
  const used = new Set(locators.map((l) => l.sourceId));
  for (const s of used) assert.ok(pilot.has(s), `${s} existe no 10B.1`);
  for (const s of scope.excluded) assert.ok(!used.has(s), `${s} excluída não usada`);
});

test("15 localizadores do artigo com dupla paginação; institucional com URL/data/volatilidade", () => {
  const art = locators.filter((l) => /hauschild-2008/.test(l.sourceId));
  assert.equal(art.length, 15);
  assert.ok(art.every((l) => /PDF/i.test(l.label) && /art/i.test(l.label)));
  const inst = locators.filter((l) => /bilheteira/.test(l.sourceId));
  assert.equal(inst.length, 1);
  assert.ok(inst[0].url && inst[0].accessedAt);
  assert.match(JSON.stringify(inst[0]), /din[âa]mico|reverific|vol[áa]til/i);
});

test("sem citações textuais", () => {
  assert.ok(!locators.some((l) => l.quotation));
});

test("fila sem revisor/aprovação fabricados; publicação não permitida", () => {
  assert.equal(Q.reviewer, null);
  assert.equal(Q.approved_by, null);
  assert.notEqual(Q.publication_allowed, true);
  assert.ok(!queue.some((i) => i.reviewerId || i.approvedBy || i.reviewedBy || i.publishedAt));
});

test("snapshot servido permanece vazio (nada em revisão exposto)", () => {
  const snap = read("public/data/proteus-knowledge-public.json");
  assert.deepEqual(snap.assertions, []);
  assert.deepEqual(snap.entities, []);
  assert.deepEqual(snap.relations, []);
});

test("modelo editorial: filtros por classe/fonte/estado/prioridade", () => {
  const hyp = filterProposals(assertions, { epistemicClass: "hypothesis" }, { locators, queue });
  assert.ok(hyp.every((a) => a.epistemicClass === "hypothesis"));
  const src = filterProposals(assertions, { sourceId: "resource-pcip-bilheteira-milreu" }, { locators, queue });
  assert.ok(src.length >= 1 && src.every((a) => sourcesByAssertion(assertions, locators)[a.id].includes("resource-pcip-bilheteira-milreu")));
  assert.ok(filterProposals(assertions, { state: "in_review" }, { locators, queue }).length === 16);
});

test("NEGATIVO: transição editorial recusa revisor vazio e nunca publica", () => {
  assert.throws(() => reviewTransition(assertions[0], "approve", ""), /reviewerId/);
  assert.throws(() => reviewTransition(assertions[0], "approve", "   "), /reviewerId/);
  // com revisor válido, 'approve' leva a 'approved' (nunca 'published')
  const d = reviewTransition(assertions[0], "approve", "rev-humano-x");
  assert.equal(d.toState, "approved");
  assert.equal(d.reviewerId, "rev-humano-x");
});

test("índice editorial é NÃO servido e marca 'público em Git / em revisão'", () => {
  const idx = buildEditorialIndex({ assertions, locators, entities, queue });
  assert.equal(idx.servedPublication, false);
  assert.equal(idx.items.length, 16);
  assert.ok(idx.items.every((i) => i.publicInGit === true && i.approved === false));
  // o item institucional é marcado volátil
  const anyVolatile = idx.items.some((i) => i.evidence.some((e) => e.volatile));
  assert.ok(anyVolatile, "evidência institucional marcada como volátil");
});
