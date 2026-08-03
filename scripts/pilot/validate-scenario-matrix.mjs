/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`08K matriz de cenários: ${m}`); };

const seed = read("public/data/pilot-scenario-seed.json");
if (seed.version !== "0.35.0") fail("versão incorreta.");
const scenarios = seed.scenarios || [];
if (scenarios.length !== 34) fail(`esperados 34 cenários, encontrados ${scenarios.length}.`);
if (seed.scenarioCount !== scenarios.length) fail("scenarioCount não corresponde.");

const risks = ["info", "low", "medium", "high", "critical"];
const codes = new Set();
const required = ["code", "title", "targetProfileType", "moduleCode", "flow", "expectedOutcome", "riskLevel", "required"];
for (const s of scenarios) {
  for (const f of required) if (s[f] === undefined || s[f] === null || s[f] === "") fail(`campo ${f} ausente em ${s.code || "(sem código)"}.`);
  if (!/^PILOT-[A-Z]+-\d{2}$/.test(s.code)) fail(`código inválido: ${s.code}.`);
  if (codes.has(s.code)) fail(`código duplicado: ${s.code}.`);
  codes.add(s.code);
  if (!risks.includes(s.riskLevel)) fail(`riskLevel inválido em ${s.code}.`);
  // Os modelos não podem conter resultados nem participantes reais.
  if ("result" in s || "participant" in s || "sessionId" in s || "outcome" in s) fail(`${s.code} não pode conter resultado/participante.`);
}

// Cobertura mínima de temas críticos.
for (const must of ["PILOT-SEC-01", "PILOT-PILOT-02", "PILOT-PROD-01", "PILOT-PUBLIC-02", "PILOT-MUSEUM-03"]) {
  if (!codes.has(must)) fail(`cenário crítico ${must} ausente.`);
}

console.log(`Matriz de cenários do piloto validada: ${scenarios.length} modelos, sem resultados nem participantes.`);
