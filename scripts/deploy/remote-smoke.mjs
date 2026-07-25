/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile } from "node:fs/promises";

const profile=JSON.parse(await readFile("public/config/deployment-profile.runtime.json","utf8"));
const base=(process.env.MILREU_REMOTE_SITE_URL||profile.siteUrl||"").replace(/\/+$/,"");
if(!base){
  console.log("Remote smoke ignorado: MILREU_REMOTE_SITE_URL/MILREU_SITE_URL não configurado.");
  process.exit(0);
}
if(profile.environment==="production"&&process.env.MILREU_REMOTE_SMOKE_CONFIRM!=="ALLOW_READ_ONLY_PRODUCTION_SMOKE"){
  throw new Error("Smoke de produção exige confirmação literal e permanece apenas read-only.");
}

const paths=[
  "/",
  "/public/data/memories.json",
  "/public/data/collaborative-modules.json",
  "/public/data/collaborative-homologation-model.json",
  "/public/config/collaborative-area.runtime.json",
  "/auth/callback/"
];
const results=[];
for(const path of paths){
  const response=await fetch(`${base}${path}`,{
    method:"GET",
    redirect:"manual",
    headers:{"User-Agent":"Milreu-08G-Homologation/0.18.0"}
  });
  results.push({
    path,status:response.status,
    ok:response.ok||[301,302,303,307,308].includes(response.status),
    contentType:response.headers.get("content-type")
  });
}
console.log(JSON.stringify({base,environment:profile.environment,results},null,2));
if(results.some(item=>!item.ok))throw new Error("Remote smoke encontrou respostas inválidas.");
