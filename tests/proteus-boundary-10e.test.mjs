/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — testes de FRONTEIRA e não-regressão: dados reais intocados, registos 10E vazios,
 * núcleos puros, nenhuma saída em public/ e estado canónico preservado.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");

test("os 16 registos continuam in_review e 10 entidades draft; nada foi alterado", () => {
  const A = read("data/proteus/knowledge-assertions.json");
  assert.equal(A.assertions.length, 16);
  assert.ok(A.assertions.every((a) => a.status === "in_review"));
  assert.equal(A.entities.length, 10);
  assert.ok(A.entities.every((e) => e.status === "draft"));
});

test("registos 10E começam vazios, não servidos e sem publicação", () => {
  for (const [f, arr] of [["knowledge-ingestion-inbox", "proposals"], ["knowledge-review-decisions", "decisions"], ["knowledge-editorial-audit", "events"]]) {
    const d = read(`data/proteus/${f}.json`);
    assert.deepEqual(d[arr], []);
    assert.equal(d.servedPublication, false);
    assert.equal(d.publicationAllowed, false);
    assert.equal(d.humanActionRequired, true);
  }
});

test("não-regressão pública: Biblioteca 3/2/1, API 5×0, conhecimento 0/0/0", () => {
  const cat = read("public/data/proteus-catalog-public.json");
  assert.equal(cat.works.length, 3);
  assert.equal(cat.authors.length, 2);
  assert.equal(cat.externalResources.length, 1);
  const idx = read("public/api/proteus/v1/index.json");
  assert.ok(idx.resources.every((r) => r.count === 0));
  const snap = read("public/data/proteus-knowledge-public.json");
  assert.equal(snap.assertions.length, 0);
  assert.equal(snap.entities.length, 0);
  assert.equal(snap.relations.length, 0);
});

test("nenhum apiExposure:allow em dados repo-internos ou servidos", () => {
  for (const p of ["data/proteus/knowledge-assertions.json", "data/proteus/knowledge-review-queue.json", "public/api/proteus/v1/works.json", "public/data/proteus-catalog-public.json"]) {
    assert.ok(!/"apiExposure"\s*:\s*"allow"/.test(text(p)), `apiExposure allow em ${p}`);
  }
});

test("núcleos 10E são puros: sem relógio, aleatoriedade, rede ou I/O", () => {
  for (const f of ["src/proteus/knowledge-ingestion.mjs", "src/proteus/editorial-workflow.mjs"]) {
    const t = text(f);
    assert.ok(!/new Date\(|Date\.now\(|Math\.random\(|fetch\(|from "node:fs"|createServer|process\.env/.test(t), `${f} não é puro`);
  }
});

test("nenhuma saída 10E aparece em public/", () => {
  const bad = [];
  const walk = (dir) => { if (!existsSync(dir)) return; for (const n of readdirSync(dir, { withFileTypes: true })) { const p = `${dir}/${n.name}`; if (n.isDirectory()) walk(p); else if (/ingestion-inbox|review-decisions|editorial-audit|review-packet|ingestion-preview/i.test(p)) bad.push(p); } };
  walk("public");
  assert.deepEqual(bad, []);
});

test("estado canónico permanece 0.39.0/10D com pin legado 10B", () => {
  const pkg = read("package.json"); const reg = read("public/data/package-impact-registry.json");
  assert.equal(pkg.version, "0.39.0");
  assert.equal(pkg.currentPackage, "10B");
  assert.equal(reg.version, "0.39.0");
  assert.equal(reg.currentPackage, "10D");
});

test("42 migrations, 26 módulos, 152 permissões preservados", () => {
  assert.equal(readdirSync("supabase/migrations").filter((f) => f.endsWith(".sql")).length, 42);
  assert.equal(read("public/data/collaborative-modules.json").modules.length, 26);
  assert.equal(read("public/data/collaborative-roles-permissions.json").permissions.length, 152);
});
