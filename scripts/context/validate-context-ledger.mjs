/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync,readFileSync } from "node:fs";

const required=[
  "PROJECT_CONTEXT_LEDGER.md","PACKAGE_DEPENDENCY_MAP.md",
  "CHANGE_SURFACE_REGISTRY.md","CONTEXT_RECOVERY_PROTOCOL.md",
  "public/data/package-impact-registry.json"
];
for(const file of required)if(!existsSync(file))throw new Error(`Contexto obrigatório ausente: ${file}`);

const ledger=readFileSync("PROJECT_CONTEXT_LEDGER.md","utf8");
for(const packageCode of ["01","02","03","04","05A","05B","05C","05D","05E","05F","06","07A","07B","07C","07D","07D.1","07D.2","07D.3","08A","08B","08C","08D","08E","08F","08G","08H","08I","08J","08K","08L","08M","08N","08O","08P","08Q","09A","09B","09C"]){
  if(!ledger.includes(packageCode))throw new Error(`Pacote ausente do ledger: ${packageCode}`);
}
for(const invariant of [
  "Projeto Comunitário de Milreu","Comunicação","Mutualidade",
  "Pertinência Social e Política","MM202617","não publicar automaticamente",
  "Supabase","GitHub","pt-PT"
]){
  if(!ledger.includes(invariant))throw new Error(`Invariante ausente: ${invariant}`);
}

const registry=JSON.parse(readFileSync("public/data/package-impact-registry.json","utf8"));
if(registry.version!=="0.34.0"||registry.currentPackage!=="09E")throw new Error("Registo de impacto desatualizado.");
for(const surface of ["portal-home","museum-home","museum-canonical-data","collaborative-navigation","training","library","deployment-profile","google-oauth","homologation","notification-center","notification-events","notification-outbox","system-administration","audit-integrity","retention-lifecycle","incident-continuity","accessibility-baseline","browser-e2e","release-candidate","pilot","continuous-participation","public-integration","operations-governance","carousel-post-merge-08o","functional-closure-08p","home-banner-responsive-08q","portal-quality-foundation-09a","semantic-language-audit-09b","public-opportunities-09c"]){
  if(!registry.surfaces.some(item=>item.code===surface))throw new Error(`Superfície não registada: ${surface}`);
}
if(!readFileSync("CONTEXT_RECOVERY_PROTOCOL.md","utf8").includes("mínimo necessário")){
  throw new Error("Protocolo de recuperação sem conjunto mínimo.");
}
console.log("Contexto 09C validado: ledger, dependências, superfícies e recuperação.");
