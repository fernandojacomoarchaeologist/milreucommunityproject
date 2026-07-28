/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync, readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`08K modelo do piloto: ${m}`); };

const model = read("public/data/collaborative-pilot-model.json");
if (model.version !== "0.29.0") fail("versão do modelo incorreta.");
if (model.module?.code !== "pilot") fail("módulo pilot ausente.");
if (model.environmentRule !== "staging-only") fail("regra de ambiente deve ser staging-only.");
for (const flag of ["publicEffectsEnabled", "productionWritesEnabled", "emailEnabled", "chatEnabled", "recordingEnabledByDefault"]) {
  if (model[flag] !== false) fail(`${flag} deve permanecer false.`);
}
for (const list of ["cycleStatuses", "phases", "participantStatuses", "sessionStatuses", "observationStatuses", "gateStatuses", "sensitivities", "redactionStatuses"]) {
  if (!Array.isArray(model[list]) || model[list].length === 0) fail(`lista ${list} ausente.`);
}

const modules = read("public/data/collaborative-modules.json");
const modArr = modules.modules || modules;
if (!modArr.some((m) => m.code === "pilot" && m.route === "/area-colaborativa/piloto" && m.permission === "pilot.view")) {
  fail("módulo pilot ausente do registo de módulos.");
}

const rp = read("public/data/collaborative-roles-permissions.json");
const pilotPerms = ["pilot.view", "pilot.manage", "pilot.participants.manage", "pilot.sessions.manage", "pilot.feedback.submit", "pilot.feedback.manage", "pilot.evidence.manage", "pilot.metrics.view", "pilot.gates.evaluate", "pilot.approve"];
for (const p of pilotPerms) if (!rp.permissions.includes(p)) fail(`permissão ${p} ausente.`);
if (rp.permissions.length !== 149) fail(`esperadas 127 permissões, encontradas ${rp.permissions.length}.`);
if (rp.rolePermissions.coordinator.includes("pilot.approve")) fail("coordinator não pode ter pilot.approve.");
for (const p of pilotPerms.filter((x) => x !== "pilot.approve")) {
  if (!rp.rolePermissions.coordinator.includes(p)) fail(`coordinator sem ${p}.`);
}
for (const role of ["volunteer", "reviewer", "researcher", "translator", "partner", "observer"]) {
  for (const p of ["pilot.view", "pilot.feedback.submit"]) {
    if (!rp.rolePermissions[role].includes(p)) fail(`${role} sem ${p}.`);
  }
}
if (JSON.stringify(rp.rolePermissions.master) !== JSON.stringify(["*"])) fail("master deve manter '*'.");

if (!existsSync("public/data/pilot-readiness.json")) fail("pilot-readiness.json ausente.");
const readiness = read("public/data/pilot-readiness.json");
for (const gate of ["pilotReadiness", "stagingHomologation", "productionApproval"]) {
  if (readiness[gate] !== "blocked") fail(`${gate} deve iniciar como blocked.`);
}

console.log("Pacote 08K validado: módulo do piloto, 127 permissões, matriz por função e estados honestamente bloqueados.");
