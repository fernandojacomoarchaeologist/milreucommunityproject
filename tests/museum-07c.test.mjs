/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const memories = JSON.parse(readFileSync("public/data/memories.json","utf8")).records;
const index = JSON.parse(readFileSync("public/data/museum-index.json","utf8")).records;
const collections = JSON.parse(readFileSync("public/data/museum-collections.json","utf8")).collections;
const audit = JSON.parse(readFileSync("public/data/museum-audit.json","utf8"));

test("índice cobre os 30 registos públicos", () => {
  assert.equal(index.length,30);
  assert.deepEqual(new Set(index.map(item => item.id)),new Set(memories.filter(x => x.publication.siteVisible).map(x => x.id)));
});

test("MM202617 permanece bloqueado", () => {
  assert.ok(!index.some(item => item.id === "MM202617"));
  assert.ok(!collections.some(collection => collection.members.includes("MM202617")));
});

test("coleções são derivadas e transparentes", () => {
  for (const collection of collections) {
    assert.equal(collection.collectionType,"derived-navigation");
    assert.equal(collection.factualClaim,false);
    assert.equal(collection.memberCount,collection.members.length);
  }
});

test("auditoria preserva pendências", () => {
  assert.equal(audit.records,31);
  assert.equal(audit.siteVisible,30);
  assert.ok(audit.nonReciprocalRelations.count > 0);
  assert.ok(audit.digitalInterventions.visibleRecords.includes("MM202631"));
});
