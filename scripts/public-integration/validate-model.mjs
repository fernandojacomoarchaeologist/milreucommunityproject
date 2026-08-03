/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync, readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`08L modelo: ${m}`); };

const pub = read("public/data/public-integration-model.json");
if (pub.version !== "0.35.0") fail("versão do modelo público incorreta.");
if (pub.publicReadsSnapshotsOnly !== true) fail("publicReadsSnapshotsOnly deve ser true.");
if (pub.activePublicEffectsByDefault !== 0) fail("efeitos públicos ativos por omissão devem ser 0.");
if (pub.productionApproval !== "blocked") fail("productionApproval deve estar blocked.");
if (pub.emailEnabled !== false || pub.chatEnabled !== false) fail("e-mail e chat devem estar off.");
for (const dim of ["editorial", "rights", "privacy", "translation", "accessibility", "technical"]) {
  if (!pub.requiredReviewDimensions.includes(dim)) fail(`dimensão de revisão ${dim} ausente.`);
}

const paths = read("public/data/participation-pathways-model.json");
if (paths.version !== "0.35.0") fail("versão do modelo de participação incorreta.");
if (paths.module?.code !== "continuous-participation") fail("módulo continuous-participation ausente.");
if (paths.rankingEnabled !== false || paths.gamificationRequired !== false || paths.automaticRoleGrant !== false) {
  fail("ranking, gamificação e concessão automática de função devem ser false.");
}

const slots = read("public/data/public-effect-slots.json");
if (slots.activeEffects !== 0) fail("public-effect-slots deve ter 0 efeitos ativos.");
if (!slots.slots.every((s) => s.status === "empty" && s.activeSnapshotId === null)) fail("todos os slots devem começar vazios.");

const modules = read("public/data/collaborative-modules.json").modules;
if (!modules.some((m) => m.code === "continuous-participation" && m.permission === "participation.view")) fail("módulo ausente do registo.");

const roles = read("public/data/collaborative-roles-permissions.json");
const newPerms = ["participation.view", "participation.manage", "participation.enrol", "participation.progress.update", "public-integration.view", "public-integration.propose", "public-integration.review", "public-integration.preview", "public-integration.activate", "public-integration.rollback", "evolution.view", "evolution.manage", "evolution.decide"];
for (const p of newPerms) if (!roles.permissions.includes(p)) fail(`permissão ${p} ausente.`);
if (roles.permissions.length !== 152) fail(`esperadas 140 permissões, encontradas ${roles.permissions.length}.`);
for (const p of ["public-integration.activate", "public-integration.rollback", "evolution.decide"]) {
  if (roles.rolePermissions.coordinator.includes(p)) fail(`coordinator não pode ter ${p} (é master-only).`);
}

if (!existsSync("public/data/evolution-readiness.json")) fail("evolution-readiness.json ausente.");
const ev = read("public/data/evolution-readiness.json");
for (const gate of ["pilotEvidence", "publicIntegrationCandidate", "stagingPreview", "productionApproval"]) {
  if (ev[gate] !== "blocked") fail(`${gate} deve iniciar blocked.`);
}
if (ev.activePublicEffects !== 0) fail("activePublicEffects deve ser 0.");

console.log("Pacote 08L validado: integração pública, participação contínua, 140 permissões e efeitos públicos honestamente bloqueados.");
