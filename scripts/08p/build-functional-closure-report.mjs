/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08P — valida o relatório de fecho funcional da Área Colaborativa
 * contra o contrato: todas as áreas cobertas, estados permitidos, sem expansão
 * arquitetural e sem promover a acessibilidade humana automaticamente.
 */
import { readFileSync, existsSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`08P fecho funcional: ${m}`); };

const EXPECTED_VERSION = "0.27.0";
const contract = read("public/data/collaborative-functional-closure.json");
if (contract.version !== EXPECTED_VERSION) fail("versão do contrato incorreta.");

const REPORT = "reports/functional-closure-08p.json";
if (!existsSync(REPORT)) fail(`relatório ausente: ${REPORT}`);
const report = read(REPORT);
if (report.version !== EXPECTED_VERSION) fail("versão do relatório incorreta.");

const allowed = new Set(contract.allowedAuditStatuses);
const byCode = new Map(report.areas.map((a) => [a.code, a]));

for (const code of contract.areas) {
  const area = byCode.get(code);
  if (!area) fail(`área obrigatória ausente: ${code}`);
  if (!allowed.has(area.status)) fail(`estado inválido em ${code}: ${area.status}`);
  if (!area.evidence) fail(`área ${code} sem evidência.`);
  if (!Array.isArray(area.files) || area.files.length === 0) fail(`área ${code} sem ficheiros.`);
  if (!area.test) fail(`área ${code} sem teste.`);
  if (area.status === "blocked" && !area.blocker) fail(`área ${code} bloqueada sem justificação.`);
  if (area.status === "fixed" && !area.fix) fail(`área ${code} marcada como fixed sem descrição.`);
}

// A acessibilidade humana não pode ser promovida automaticamente.
const gate = read("public/data/human-accessibility-gate.json");
if (gate.automaticPromotionToPassed !== false) fail("o gate humano não pode permitir promoção automática.");
if (gate.status !== "pending-human-review") fail("o gate humano deve permanecer pending-human-review.");
const humanArea = byCode.get("human-accessibility");
if (humanArea.status === "passed") fail("a acessibilidade humana não pode estar 'passed' sem revisão humana.");

// Sem expansão arquitetural: contagens reais têm de bater certo.
const modules = read("public/data/collaborative-modules.json").modules;
const permissions = read("public/data/collaborative-roles-permissions.json").permissions;
if (report.moduleCount !== modules.length) fail("moduleCount diverge do real.");
if (report.permissionCount !== permissions.length) fail("permissionCount diverge do real.");
if (contract.newModulesExpected !== 0 || contract.newPermissionsExpected !== 0 || contract.newMigrationsExpected !== 0) fail("o contrato não deve esperar novos módulos/permissões/migrations.");

if (!Array.isArray(report.externalBlockers) || report.externalBlockers.length === 0) fail("os bloqueadores externos devem ser listados, não resolvidos pelo código.");

const counts = report.areas.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});
console.log(`Pacote 08P fecho funcional validado: ${report.areas.length}/${contract.areas.length} áreas (${JSON.stringify(counts)}); acessibilidade humana pendente; ${report.externalBlockers.length} bloqueadores externos; módulos ${modules.length}, permissões ${permissions.length}.`);
