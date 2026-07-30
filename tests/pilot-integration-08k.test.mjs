/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const pkg = read("package.json");
const seed = read("public/data/pilot-scenario-seed.json");
const registry = read("public/data/package-impact-registry.json");

test("o pacote está na versão 0.22.0 com os scripts do piloto", () => {
  assert.equal(pkg.version, "0.30.0");
  for (const s of ["pilot:validate", "pilot:readiness", "pilot:scenario-matrix", "pilot:gates", "validate:08k"]) {
    assert.ok(pkg.scripts[s], s);
  }
  assert.ok(pkg.scripts.validate.includes("validate-pilot-model"));
});

test("a matriz tem 34 cenários únicos sem resultados", () => {
  assert.equal(seed.scenarios.length, 34);
  const codes = new Set(seed.scenarios.map((s) => s.code));
  assert.equal(codes.size, 34);
  for (const s of seed.scenarios) assert.ok(!("result" in s) && !("participant" in s));
});

test("cenários críticos de isolamento, produção e MM202617 estão presentes", () => {
  const codes = new Set(seed.scenarios.map((s) => s.code));
  for (const c of ["PILOT-SEC-01", "PILOT-PILOT-02", "PILOT-PROD-01", "PILOT-MUSEUM-03", "PILOT-PUBLIC-02"]) assert.ok(codes.has(c), c);
});

test("o registo de impacto aponta para o 08K com a superfície do piloto", () => {
  assert.equal(registry.currentPackage, "09B");
  assert.equal(registry.version, "0.30.0");
  const pilot = registry.surfaces.find((s) => s.code === "pilot");
  assert.ok(pilot);
  assert.equal(pilot.publicEffects, "none");
  assert.equal(pilot.productionWrites, "disabled");
});
