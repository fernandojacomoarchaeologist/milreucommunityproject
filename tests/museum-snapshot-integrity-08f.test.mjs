/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const approved=JSON.parse(readFileSync("public/data/museum-editorial-approved.json","utf8"));
const effects=JSON.parse(readFileSync("public/data/public-content-effects.json","utf8"));
const exporter=readFileSync("scripts/museum-review/export-approved.mjs","utf8");
const apply=readFileSync("scripts/museum-review/apply-approved.mjs","utf8");
test("snapshot inicial é vazio",()=>{assert.equal(approved.records.length,0);assert.equal(approved.effects.length,0);});
test("efeitos iniciais são vazios",()=>{assert.equal(Object.values(effects.slots).flat().length,0);});
test("exportação usa JWT de utilizador",()=>{assert.match(exporter,/MILREU_SUPABASE_ACCESS_TOKEN/);assert.match(exporter,/SUPABASE_SERVICE_ROLE_KEY foi ignorada/);});
test("aplicação exige literal, hash e backup",()=>{assert.match(apply,/I_CONFIRM_APPLY_APPROVED_MUSEUM_REVIEW/);assert.match(apply,/sourceDatasetHash/);assert.match(apply,/baseHash/);assert.match(apply,/editorial-backups/);});

test("exportação e aplicação validam divulgação substantiva de IA",()=>{
  assert.match(exporter,/validateCandidates/);
  assert.match(exporter,/ai-substantive-intervention/);
  assert.match(apply,/Divulgação obrigatória de IA ausente/);
});
