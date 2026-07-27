/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import { readFileSync } from "node:fs";
const read=path=>JSON.parse(readFileSync(path,"utf8"));
const pkg=read("package.json"),model=read("public/data/collaborative-release-candidate-model.json"),matrix=read("public/data/e2e-scenarios-08j.json"),modules=read("public/data/collaborative-modules.json"),roles=read("public/data/collaborative-roles-permissions.json"),readiness=read("public/data/release-candidate-readiness.json");
if(pkg.version!=="0.25.0"||model.version!==pkg.version||matrix.version!==pkg.version||modules.version!==pkg.version)throw new Error("Versões 08J divergentes.");
if((modules.modules||[]).length!==25||(modules.modules||[]).some(item=>item.status!=="active"))throw new Error("O 08J deve preservar 22 módulos ativos.");
if((roles.permissions||[]).length!==149)throw new Error(`Permissões alteradas sem decisão: ${(roles.permissions||[]).length}`);
if(model.releaseLayers.some(layer=>layer.code==="production-approved"&&layer.mayBeReadyWithoutRemoteSecrets))throw new Error("Produção não pode ser aprovada sem recursos remotos.");
if(readiness.productionApproval?.approved)throw new Error("Produção foi aprovada indevidamente.");
if(readiness.stagingHomologation?.approved)throw new Error("Staging foi homologado sem evidência.");
if(!model.externalGates.every(gate=>gate.status==="blocked"))throw new Error("Gate externo foi desbloqueado por inferência.");
if(!model.humanGates.every(gate=>gate.status==="pending"))throw new Error("Gate humano foi aprovado por inferência.");
const source=["public/data/collaborative-release-candidate-model.json","public/data/release-candidate-readiness.json","README.md","PROMPT_CLAUDE.md"].map(path=>readFileSync(path,"utf8")).join("\n");
for(const forbidden of ["SUPABASE_SERVICE_ROLE_KEY=","GOOGLE_CLIENT_SECRET=","MILREU_MASTER_EMAIL="]){if(source.includes(forbidden))throw new Error(`Segredo/valor indevido no pacote: ${forbidden}`);}
console.log("Contrato da release candidate 08J validado.");
