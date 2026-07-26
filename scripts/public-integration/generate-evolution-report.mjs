/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
const ev = JSON.parse(readFileSync("public/data/evolution-readiness.json", "utf8"));
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const report = {
  _copyright: "© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version: pkg.version,
  generatedAt: new Date().toISOString(),
  technicalCandidate: ev.technicalCandidate,
  pilotEvidence: ev.pilotEvidence,
  publicIntegrationCandidate: ev.publicIntegrationCandidate,
  continuousParticipationCandidate: ev.continuousParticipationCandidate,
  productionApproval: "blocked",
  proposals: [],
  decisions: [],
  gaps: ev.blockingItems || [],
  note: "Sem evidência real do piloto, as propostas de evolução não podem ser confirmadas."
};
mkdirSync("reports", { recursive: true });
writeFileSync("reports/evolution-report.json", JSON.stringify(report, null, 2) + "\n");
console.log(`Relatório de evolução gerado: ${report.gaps.length} lacunas, produção bloqueada.`);
