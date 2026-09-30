/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const snapshot=JSON.parse(readFileSync("public/data/exhibitions-public.json","utf8"));
const exporter=readFileSync("scripts/exhibitions/export-public.mjs","utf8");
const build=readFileSync("scripts/build.mjs","utf8");

test("snapshot público possui contrato estável",()=>{
  assert.equal(snapshot.version,"0.15.0");
  for(const field of ["current","upcoming","past","events"])assert.ok(Array.isArray(snapshot[field]));
});

test("snapshot não contém dados reais inventados (só exemplos declarados)",()=>{
  // 08d-no-fake-exhibition-data + demonstration-content-only: não pode existir conteúdo
  // REAL não aprovado; entradas de demonstração são admitidas apenas se marcadas
  // explicitamente com example:true (decisão editorial 2026-09-30 — exemplo fev/2026).
  for(const field of ["current","upcoming","events"]){
    for(const row of snapshot[field]){
      assert.equal(row.example,true,`${field}: entrada não declarada como exemplo`);
    }
  }
  // Campos internos nunca expostos no snapshot público.
  const forbidden=["internal_notes","transport_notes","condition_report_before","condition_report_after","contact_email","contact_name","internal_objectives"];
  const serialized=JSON.stringify(snapshot);
  for(const key of forbidden){
    assert.doesNotMatch(serialized,new RegExp(`"${key}"`),`campo interno exposto: ${key}`);
  }
  assert.match(snapshot.notice,/confirmados e aprovados/);
});

test("exportação usa chave publicável e filtra campos internos",()=>{
  assert.match(exporter,/MILREU_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(exporter,/Campo interno exposto/);
  assert.match(exporter,/SUPABASE_SERVICE_ROLE_KEY foi ignorada/);
  assert.doesNotMatch(exporter,/Authorization:`Bearer \$\{key\}`/);
});

test("build inclui checksums da agenda pública",()=>{
  assert.match(build,/exhibitionModelChecksum/);
  assert.match(build,/publicExhibitionsChecksum/);
});
