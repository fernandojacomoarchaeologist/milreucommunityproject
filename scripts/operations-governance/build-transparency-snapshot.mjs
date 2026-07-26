/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { assertTransparencySafe } from "./transparency-guard.mjs";
const model=JSON.parse(readFileSync("public/data/impact-indicators-model.json","utf8"));
// Snapshot público de exemplo (agregado, sem dados individuais nem PII).
const snapshot={_copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",generatedAt:new Date().toISOString(),publishesIndividualData:model.publishesIndividualData,publishedIndicators:[],productionApproval:"blocked",note:"Transparência pública desativada por omissão. Só snapshots aprovados são publicados."};
assertTransparencySafe(snapshot);
// auto-teste da guarda
let rejected=false;try{assertTransparencySafe({email:"x@y.invalid"});}catch{rejected=true;}
if(!rejected)throw new Error("08M transparência: guarda de PII inoperante.");
mkdirSync("reports",{recursive:true});
writeFileSync("reports/transparency-snapshot.json",JSON.stringify(snapshot,null,2)+"\n");
console.log("Snapshot de transparência gerado: 0 indicadores publicados, sem PII, produção bloqueada.");
