/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync, writeFileSync } from "node:fs";

const path = "public/data/pilot-readiness.json";
const readiness = JSON.parse(readFileSync(path, "utf8"));

// Sem infraestrutura real nem evidência, o piloto permanece honestamente bloqueado.
readiness.version = "0.25.0";
readiness.generatedAt = new Date().toISOString();
readiness.technicalCandidate = "ready";
readiness.pilotReadiness = "blocked";
readiness.stagingHomologation = "blocked";
readiness.productionApproval = "blocked";
if (!Array.isArray(readiness.blockingItems) || readiness.blockingItems.length === 0) {
  throw new Error("08K readiness: blockingItems não pode estar vazio enquanto bloqueado.");
}

writeFileSync(path, JSON.stringify(readiness, null, 2) + "\n");
console.log(`Piloto readiness atualizado: pilot=${readiness.pilotReadiness}, staging=${readiness.stagingHomologation}, produção=${readiness.productionApproval}.`);
console.log(`Bloqueadores: ${readiness.blockingItems.length}.`);
