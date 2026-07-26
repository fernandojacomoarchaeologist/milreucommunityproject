/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
const rd=JSON.parse(readFileSync("public/data/operations-readiness.json","utf8"));
const pkg=JSON.parse(readFileSync("package.json","utf8"));
const report={_copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",version:pkg.version,generatedAt:new Date().toISOString(),operationsCandidate:rd.operationsCandidate,activeOperatingCycles:0,openSupport:0,openModeration:0,overdueContentReviews:0,continuity:rd.continuity,gaps:rd.blockingItems||[],note:"Sem operação real, o relatório de saúde reporta estado bloqueado e lacunas."};
mkdirSync("reports",{recursive:true});
writeFileSync("reports/operations-health-report.json",JSON.stringify(report,null,2)+"\n");
console.log(`Relatório de saúde operacional gerado: ${report.gaps.length} lacunas, continuidade ${report.continuity}.`);
