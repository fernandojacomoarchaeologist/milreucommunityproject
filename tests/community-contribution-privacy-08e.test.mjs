/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const summary=JSON.parse(readFileSync("public/data/contributions-public-summary.json","utf8"));
const publicView=readFileSync("src/views/contributions-public.js","utf8");
const collaborative=readFileSync("src/views/collaborative-contributions.js","utf8");

test("resumo público inicial não publica contributos",()=>{
  assert.equal(summary.counts.submitted,0);
  assert.equal(summary.counts.accepted,0);
  assert.ok(summary.generatedAt===null||typeof summary.generatedAt==="string");
});

test("resumo público não contém PII",()=>{
  const text=JSON.stringify(summary);
  for(const key of ["email","phone","display_name","trackingCode"]){
    assert.ok(!text.includes(`"${key}"`),key);
  }
});

test("acompanhamento público devolve apenas estado comunicado",()=>{
  assert.match(publicView,/Estado privado/);
  assert.match(publicView,/não apresenta ficheiros, notas internas, responsáveis/);
});

test("vista do participante oculta e-mail",()=>{
  assert.match(collaborative,/Oculto nesta vista/);
  assert.match(collaborative,/Histórico comunicado/);
});
