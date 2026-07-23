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

test("índice cobre os 31 registos visíveis para revisão", () => {
  assert.equal(index.length,31);
  assert.deepEqual(
    new Set(index.map(item => item.id)),
    new Set(memories.filter(record => record.publication.siteVisible).map(record => record.id))
  );
});

test("MM202617 integra a revisão e a coleção de intervenções", () => {
  assert.ok(index.some(item => item.id === "MM202617"));
  const collection = collections.find(item => item.slug === "intervencoes-digitais-documentadas");
  assert.ok(collection.members.includes("MM202617"));
});

test("coleções são derivadas e transparentes", () => {
  for (const collection of collections) {
    assert.equal(collection.collectionType,"derived-navigation");
    assert.equal(collection.factualClaim,false);
    assert.equal(collection.memberCount,collection.members.length);
  }
});

test("auditoria preserva o estado de revisão", () => {
  assert.equal(audit.records,31);
  assert.equal(audit.siteVisible,31);
  assert.deepEqual(audit.reviewVisible,["MM202617"]);
  assert.deepEqual(audit.publicReleaseIneligible,["MM202617"]);
  assert.ok(audit.nonReciprocalRelations.count > 0);
  assert.ok(audit.digitalInterventions.visibleRecords.includes("MM202617"));
});
