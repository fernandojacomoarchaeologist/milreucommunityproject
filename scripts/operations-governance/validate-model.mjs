/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync, readFileSync } from "node:fs";
const read=(p)=>JSON.parse(readFileSync(p,"utf8"));
const fail=(m)=>{throw new Error(`08M modelo: ${m}`);};
const model=read("public/data/operations-governance-model.json");
if(model.version!=="0.33.0")fail("versão incorreta.");
if(model.module?.code!=="operations-governance")fail("módulo ausente.");
if(model.activeOperatingCyclesByDefault!==0)fail("ciclos ativos por omissão devem ser 0.");
if(model.publicTransparencyEnabledByDefault!==false)fail("transparência pública deve estar off.");
if(model.productionApproval!=="blocked")fail("produção deve estar blocked.");
if(model.emailEnabled!==false||model.chatEnabled!==false)fail("e-mail e chat devem estar off.");
const ind=read("public/data/impact-indicators-model.json");
if(ind.publishesIndividualData!==false)fail("não pode publicar dados individuais.");
if(ind.autoInfersImpact!==false)fail("não pode inferir impacto automaticamente.");
if(!ind.requiresDefinition||!ind.requiresSource||!ind.requiresMethodologyVersion)fail("indicadores exigem definição, fonte e metodologia.");
const roles=read("public/data/collaborative-roles-permissions.json");
const newPerms=["responsibilities.manage","support.submit","support.manage","moderation.manage","content-review.manage","governance.view","governance.manage","governance.decide","impact.manage"];
for(const p of newPerms)if(!roles.permissions.includes(p))fail(`permissão ${p} ausente.`);
if(roles.permissions.length!==152)fail(`esperadas 149 permissões, encontradas ${roles.permissions.length}.`);
if(roles.rolePermissions.coordinator.includes("governance.decide"))fail("governance.decide é reservada ao master.");
const mods=read("public/data/collaborative-modules.json").modules;
if(!mods.some(m=>m.code==="operations-governance"))fail("módulo ausente do registo.");
if(!existsSync("public/data/operations-readiness.json"))fail("operations-readiness.json ausente.");
const rd=read("public/data/operations-readiness.json");
for(const g of ["publicTransparency","continuity","productionApproval"])if(rd[g]!=="blocked")fail(`${g} deve iniciar blocked.`);
if(rd.activeOperatingCycles!==0)fail("activeOperatingCycles deve ser 0.");
console.log("Pacote 08M validado: operação, governação, indicadores sem dados individuais, transparência e continuidade bloqueadas; 149 permissões.");
