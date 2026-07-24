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

test("snapshot inicial não contém dados inventados",()=>{
  assert.equal(snapshot.current.length,0);
  assert.equal(snapshot.upcoming.length,0);
  assert.equal(snapshot.events.length,0);
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
