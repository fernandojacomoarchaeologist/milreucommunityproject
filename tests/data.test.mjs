/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const records=JSON.parse(readFileSync("public/data/memories.json","utf8")).records;

test("31 registos visíveis em revisão",()=>{
  assert.equal(records.length,31);
  assert.equal(records.filter(record=>record.publication.siteVisible).length,31);
});

test("MM202617 visível apenas para revisão",()=>{
  const record=records.find(record=>record.id==="MM202617");
  assert.equal(record.publication.siteVisible,true);
  assert.equal(record.publication.siteStatus,"review-visible");
  assert.equal(record.publication.publicReleaseEligible,false);
  assert.equal(record.publication.robots,"noindex");
  assert.equal(record.editorialStatus,"in-review");
});

test("MM202617 declara retoque substantivo por IA",()=>{
  const record=records.find(record=>record.id==="MM202617");
  assert.ok(record.media.digitalInterventions.some(item =>
    item.substantiveChange && String(item.type).includes("ai")
  ));
  assert.match(record.media.credit["pt-PT"],/inteligência artificial/i);
});

test("estrutura multicanal",()=>{
  for(const record of records) {
    for(const channel of ["portal","museum","totem","panel"]) assert.ok(record.channels[channel]);
  }
});

test("direitos registados",()=>{
  for(const record of records) assert.equal(record.rights.status,"authorized-for-project-publication");
});
