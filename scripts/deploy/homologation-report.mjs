/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile,writeFile,mkdir } from "node:fs/promises";

const profile=JSON.parse(await readFile("public/config/deployment-profile.runtime.json","utf8"));
const readiness=JSON.parse(await readFile("public/data/deployment-readiness.json","utf8"));
const model=JSON.parse(await readFile("public/data/collaborative-homologation-model.json","utf8"));
const date=new Date().toISOString();
const payload={
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.25.0",
  generatedAt:date,
  environment:profile.environment,
  status:readiness.status,
  blockingItems:readiness.blockingItems,
  checks:model.requiredChecks.map(item=>({
    code:item.code,category:item.category,title:item.title,
    blocking:item.blocking,status:"pending",evidence:null,note:null
  })),
  notice:"Relatório local inicial. Resultados reais devem ser registados na Área Colaborativa ou no Supabase de staging."
};
await mkdir("releases/homologation",{recursive:true});
const filename=`releases/homologation/homologation-${profile.environment}-${date.replaceAll(":","-").replaceAll(".","-")}.json`;
await writeFile(filename,JSON.stringify(payload,null,2)+"\n");
console.log(filename);
