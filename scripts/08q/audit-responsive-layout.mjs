/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08Q — valida a auditoria responsiva contra o contrato: todas as áreas
 * e verificações cobertas, estados permitidos, sem promover acessibilidade humana.
 */
import { readFileSync, existsSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`08Q auditoria responsiva: ${m}`); };

const EXPECTED = "0.28.0";
const contract = read("public/data/responsive-audit-report.json");
if (contract.version !== EXPECTED) fail("versão do contrato incorreta.");

const REPORT = "reports/responsive-audit-08q.json";
if (!existsSync(REPORT)) fail(`relatório ausente: ${REPORT}`);
const report = read(REPORT);
if (report.version !== EXPECTED) fail("versão do relatório incorreta.");

const allowed = new Set(contract.allowedStatuses);
const byArea = new Map(report.areas.map((a) => [a.area, a]));

for (const area of contract.areas) {
  const entry = byArea.get(area);
  if (!entry) fail(`área obrigatória ausente: ${area}`);
  if (!allowed.has(entry.status)) fail(`estado inválido em ${area}: ${entry.status}`);
  if (!entry.evidence) fail(`área ${area} sem evidência.`);
  if (!Array.isArray(entry.files) || entry.files.length === 0) fail(`área ${area} sem ficheiros.`);
  for (const check of contract.requiredChecks) {
    const value = entry.checks?.[check];
    if (!value) fail(`área ${area} sem a verificação ${check}.`);
    if (!allowed.has(value)) fail(`verificação ${check} em ${area} com estado inválido: ${value}.`);
  }
}

// A acessibilidade humana não é promovida automaticamente (gate do 08P mantido).
if (!/pending-human-review/.test(report.humanAccessibilityGate || "")) fail("o gate de acessibilidade humana deve permanecer pendente.");

const counts = report.areas.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});
console.log(`Pacote 08Q auditoria responsiva validada: ${report.areas.length}/${contract.areas.length} áreas (${JSON.stringify(counts)}), ${contract.requiredChecks.length} verificações cada, ${contract.viewports.length} viewports.`);
