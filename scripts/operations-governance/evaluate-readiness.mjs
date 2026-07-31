/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";
const rd=JSON.parse(readFileSync("public/data/operations-readiness.json","utf8"));
const gates=["08j-08k-08l-integrados","responsaveis-operacionais","suporte-e-moderacao","governanca-e-autoridade","indicadores-e-metodologias","monitorizacao-backup-continuidade","transparencia-aprovada","producao-aprovada"];
const report={version:"0.31.0",operationsCandidate:rd.operationsCandidate,publicTransparency:rd.publicTransparency,continuity:rd.continuity,productionApproval:"blocked",activeOperatingCycles:0,gates:gates.map(c=>({code:c,status:"blocked",blocking:true}))};
const open=report.gates.filter(g=>g.blocking&&g.status!=="passed").length;
console.log(`Prontidão operacional 08M: ${open} bloqueadores por resolver (esperado sem operação real).`);
console.log(`transparência=${report.publicTransparency}, continuidade=${report.continuity}, produção=${report.productionApproval}.`);
