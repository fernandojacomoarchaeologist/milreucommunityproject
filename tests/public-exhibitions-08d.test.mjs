/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as fsSync from "node:fs";

const snapshot=JSON.parse(readFileSync("public/data/exhibitions-public.json","utf8"));
const exporter=readFileSync("scripts/exhibitions/export-public.mjs","utf8");
const build=readFileSync("scripts/build.mjs","utf8");

test("snapshot público possui contrato estável",()=>{
  assert.equal(snapshot.version,"0.17.0");
  for(const field of ["current","upcoming","past","events"])assert.ok(Array.isArray(snapshot[field]));
});

test("snapshot não contém dados reais inventados (só exemplos declarados)",()=>{
  // 08d-no-fake-exhibition-data + demonstration-content-only: não pode existir conteúdo
  // REAL não aprovado; entradas de demonstração são admitidas apenas se marcadas
  // explicitamente com example:true (decisão editorial 2026-09-30 — exemplo fev/2026).
  // Dados reais só com decisão humana registada (source human-approved-static + approval.decidedOn/ref,
  // decisão 2026-10-13 — paragem Junta de Freguesia de Estoi); caso contrário, apenas exemplos declarados.
  const humanApproved=snapshot.source==="human-approved-static"&&snapshot.isExample===false
    &&/^\d{4}-\d{2}-\d{2}$/.test(snapshot.approval?.decidedOn||"")&&Boolean(snapshot.approval?.ref);
  for(const field of ["current","upcoming","events"]){
    for(const row of snapshot[field]){
      if(!humanApproved)assert.equal(row.example,true,`${field}: entrada não declarada como exemplo`);
      else assert.notEqual(row.example,true,`${field}: exemplo misturado com dados aprovados`);
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

test("inauguração de 30-10-2026: 26 fotografias com crédito, texto alternativo e derivados existentes", async () => {
  const { existsSync } = await import("node:fs");
  const ev = snapshot.events.find(e => e.id === "2026-10-30-estoi-inauguracao");
  assert.equal(ev.media.length, 26);
  for (const m of ev.media) {
    assert.equal(m.kind, "photo");
    assert.equal(m.credit, "Fotografia: Projeto Comunitário de Milreu");
    assert.ok(m.alt.length > 20);
    assert.ok(existsSync(m.src) && existsSync(m.thumb), m.src);
    assert.ok(Math.max(m.width, m.height) <= 1600 && Math.max(m.thumbWidth, m.thumbHeight) <= 640);
  }
});

test("modo slide: imagem em ecrã inteiro, miniaturas ocultas só durante o slide, aviso de IA mantido", async () => {
  const { readFileSync } = await import("node:fs");
  const css = readFileSync("src/styles/app.css", "utf8");
  const view = readFileSync("src/views/museum.js", "utf8");
  assert.match(css, /\.is-slide \.immersive-bottom\{display:none\}/);
  assert.match(css, /\.is-slide \.immersive-frame\{padding:0\}/);
  assert.match(css, /\.is-slide :focus-within\{opacity:1/);
  assert.match(view, /slideshowSpeed \? " is-slide" : ""/);
  assert.match(view, /slideshowSpeed && isSubstantiveAiRecord\(record\)/);
  assert.match(view, /class="immersive-filmstrip"/); // a filmstrip continua a existir fora do modo slide
});

test("modo imersivo: o título começa depois de «Voltar ao Museu» e «Voltar ao Projeto» (sem sobreposição)", () => {
  const css = readFileSync("src/styles/app.css", "utf8");
  // «Voltar ao Projeto» está fixo em left:12.5rem e mede ~10,3rem; o título tem de começar depois (≥ 24rem).
  assert.match(css, /\.immersive-top\{min-width:0;padding-left:24rem;/);
  assert.match(css, /\.immersive-return-portal\{position:fixed;top:\.75rem;left:12\.5rem;/);
});

test("orçamento de CSS: margem mínima de 2 KB abaixo do limite", () => {
  const { statSync, readdirSync } = fsSync;
  const budget = JSON.parse(readFileSync("public/data/performance-budgets.json", "utf8")).budgetsBytes.cssTotalMax;
  const total = readdirSync("src/styles").filter(f => f.endsWith(".css")).reduce((s, f) => s + statSync(`src/styles/${f}`).size, 0);
  assert.ok(budget - total >= 2000, `margem ${budget - total} B`);
});
