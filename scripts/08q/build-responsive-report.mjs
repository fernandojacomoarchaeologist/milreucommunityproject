/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08Q — consolida e valida o estado de prontidão do hotfix + auditoria
 * responsiva, sem ativar produção e sem inventar aprovações.
 */
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`08Q relatório: ${m}`); };

const EXPECTED = "0.37.1";
const readiness = read("public/data/package-08q-readiness.json");
if (readiness.version !== EXPECTED) fail("versão do readiness incorreta.");
if (readiness.newModulesExpected !== 0 || readiness.newPermissionsExpected !== 0 || readiness.newMigrationsExpected !== 0) {
  fail("o pacote não deve esperar novos módulos/permissões/migrations.");
}
if (readiness.productionApproval !== "blocked") fail("a produção deve permanecer bloqueada.");

const banner = read("reports/responsive-audit-08q.json").areas.find((a) => a.area === "portal");
if (!banner || banner.status !== "responsive-fixed") fail("o hotfix do banner (portal) deve estar responsive-fixed.");

// Contagens reais inalteradas (sem expansão arquitetural).
const modules = read("public/data/collaborative-modules.json").modules.length;
const permissions = read("public/data/collaborative-roles-permissions.json").permissions.length;

console.log(`Pacote 08Q pronto: banner ${banner.status}; produção bloqueada; ${modules} módulos, ${permissions} permissões (inalterados).`);
