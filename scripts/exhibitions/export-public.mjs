/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile, writeFile } from "node:fs/promises";

const outputPath="public/data/exhibitions-public.json";
const url=process.env.MILREU_SUPABASE_URL?.replace(/\/+$/,"");
const key=process.env.MILREU_SUPABASE_PUBLISHABLE_KEY?.trim();

function assertPublicSnapshot(snapshot){
  if(!snapshot||typeof snapshot!=="object")throw new Error("Snapshot público inválido.");
  for(const field of ["current","upcoming","past","events"]){
    if(!Array.isArray(snapshot[field]))throw new Error(`Campo ${field} inválido.`);
  }
  const forbidden=["internal_notes","internal_objectives","transport_notes","condition_report_before","condition_report_after","contact_email","contact_name"];
  const serialized=JSON.stringify(snapshot);
  for(const key of forbidden){
    if(serialized.includes(`"${key}"`))throw new Error(`Campo interno exposto: ${key}`);
  }
}

if(!url||!key){
  const current=JSON.parse(await readFile(outputPath,"utf8"));
  assertPublicSnapshot(current);
  console.log("Exportação pública preservada: Supabase não configurado.");
  process.exit(0);
}

if(process.env.SUPABASE_SERVICE_ROLE_KEY){
  console.warn("SUPABASE_SERVICE_ROLE_KEY foi ignorada. A exportação pública usa apenas a chave publicável.");
}

const response=await fetch(`${url}/rest/v1/rpc/collab_public_exhibition_snapshot_08d`,{
  method:"POST",
  headers:{
    apikey:key,
    "Content-Type":"application/json"
  },
  body:"{}"
});

const raw=await response.text();
if(!response.ok)throw new Error(`Falha ao exportar agenda pública (${response.status}): ${raw}`);

const snapshot=JSON.parse(raw);
assertPublicSnapshot(snapshot);
snapshot._copyright="© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu";
snapshot.version="0.15.0";
await writeFile(outputPath,JSON.stringify(snapshot,null,2)+"\n");
console.log(`Agenda pública exportada: ${snapshot.current.length} atuais, ${snapshot.upcoming.length} futuras e ${snapshot.events.length} atividades.`);
