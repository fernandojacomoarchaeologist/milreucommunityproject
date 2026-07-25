/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile,writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const approvedPath="public/data/museum-editorial-approved.json";
const memoriesPath="public/data/memories.json";
const effectsPath="public/data/public-content-effects.json";
const url=process.env.MILREU_SUPABASE_URL?.replace(/\/+$/,"");
const key=process.env.MILREU_SUPABASE_PUBLISHABLE_KEY?.trim();
const token=process.env.MILREU_SUPABASE_ACCESS_TOKEN?.trim();
const snapshotId=process.env.MILREU_MUSEUM_REVIEW_SNAPSHOT_ID?.trim();

function hash(value){return createHash("sha256").update(value).digest("hex");}
function assertSnapshot(snapshot){
  if(!snapshot||typeof snapshot!=="object")throw new Error("Snapshot editorial inválido.");
  if(snapshot.version!=="0.18.0")throw new Error("Versão editorial inesperada.");
  if(!Array.isArray(snapshot.records)||snapshot.records.length>31)throw new Error("Registos editoriais inválidos.");
  if(!Array.isArray(snapshot.effects))throw new Error("Efeitos editoriais inválidos.");
  for(const record of snapshot.records){
    if(!/^MM2026\d{2}$/.test(record.memoryId))throw new Error(`ID inválido: ${record.memoryId}`);
    if(!record.baseHash||!Array.isArray(record.patches))throw new Error(`Contrato incompleto: ${record.memoryId}`);
    if(!record.approvals?.editorialApprovedAt||!record.approvals?.rightsApprovedAt||!record.approvals?.publicationApprovedAt){
      throw new Error(`Aprovações incompletas: ${record.memoryId}`);
    }
    const paths=new Set();
    for(const patch of record.patches){
      if(!String(patch.path||"").startsWith("/"))throw new Error(`Caminho inválido: ${record.memoryId}`);
      if(paths.has(patch.path))throw new Error(`Caminho duplicado: ${record.memoryId} ${patch.path}`);
      paths.add(patch.path);
    }
  }
  for(const effect of snapshot.effects){
    if(!["portal.home.after-featured","museum.home.after-opening"].includes(effect.slotCode))throw new Error("Slot público inválido.");
    if(!Array.isArray(effect.memoryIds)||effect.memoryIds.length>3)throw new Error("Efeito com memórias inválidas.");
    if(effect.enabled&&!["approved","published"].includes(effect.status))throw new Error("Efeito ativo sem aprovação.");
  }
}


function pointerTokens(path){return String(path).split("/").slice(1).map(token=>token.replaceAll("~1","/").replaceAll("~0","~"));}
function setPointer(target,path,value){const parts=pointerTokens(path);let current=target;for(let index=0;index<parts.length-1;index++){const token=parts[index];if(current[token]==null||typeof current[token]!=="object")current[token]={};current=current[token];}current[parts.at(-1)]=value;}
async function validateCandidates(snapshot){
  const canonical=JSON.parse(await readFile(memoriesPath,"utf8"));
  const byId=new Map(canonical.records.map(record=>[record.id,record]));
  for(const item of snapshot.records){
    const source=byId.get(item.memoryId);if(!source)throw new Error(`Memória canónica ausente: ${item.memoryId}`);
    const candidate=structuredClone(source);for(const patch of item.patches)setPointer(candidate,patch.path,patch.value);
    const substantiveAi=(candidate.media?.digitalInterventions||[]).some(intervention=>intervention.substantiveChange&&String(intervention.type||"").toLowerCase().includes("ai"));
    if(candidate.publication?.publicReleaseEligible===true&&substantiveAi&&candidate.publication?.reviewNotice!=="ai-substantive-intervention"){
      throw new Error(`Divulgação de IA ausente no candidato: ${item.memoryId}`);
    }
  }
}

function effectsRegistry(snapshot){
  const slots={"portal.home.after-featured":[],"museum.home.after-opening":[]};
  for(const effect of snapshot.effects){
    if(!effect.enabled)continue;
    slots[effect.slotCode].push(effect);
  }
  return{
    _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
    version:"0.18.0",
    generatedAt:snapshot.generatedAt,
    sourceCycle:snapshot.cycleCode,
    slots,
    rules:{enabledOnly:true,approvedOnly:true,canonicalReferencesOnly:true,maximumItemsPerEffect:3},
    notice:slots["portal.home.after-featured"].length||slots["museum.home.after-opening"].length
      ?"Efeitos gerados por snapshot editorial aprovado."
      :"Nenhum efeito editorial está ativo."
  };
}

if(!url||!key||!token||!snapshotId){
  const current=JSON.parse(await readFile(approvedPath,"utf8"));
  assertSnapshot(current);
  await validateCandidates(current);
  console.log(`Snapshot preservado: ${current.records.length} memórias aprovadas. Configure URL, chave publicável, token de utilizador e ID do snapshot para exportar.`);
  process.exit(0);
}

if(process.env.SUPABASE_SERVICE_ROLE_KEY){
  console.warn("SUPABASE_SERVICE_ROLE_KEY foi ignorada. A exportação usa autenticação de utilizador com permissão museum.review.export.");
}

const response=await fetch(`${url}/rest/v1/rpc/collab_export_museum_review_snapshot_08f`,{
  method:"POST",
  headers:{
    apikey:key,
    Authorization:`Bearer ${token}`,
    "Content-Type":"application/json"
  },
  body:JSON.stringify({p_snapshot_id:snapshotId})
});
const raw=await response.text();
if(!response.ok)throw new Error(`Falha ao exportar snapshot (${response.status}): ${raw}`);
const result=JSON.parse(raw);
if(result.status!=="approved")throw new Error("O snapshot remoto não está aprovado.");

const snapshot={
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.18.0",
  snapshotId:result.snapshotId,
  payloadHash:result.payloadHash,
  approvedAt:result.approvedAt,
  ...result.payload,
  notice:"Snapshot exportado após aprovação humana. Ainda requer aplicação local, validação e PR."
};
assertSnapshot(snapshot);
await validateCandidates(snapshot);
const computed=hash(JSON.stringify(result.payload));
if(result.payloadHash&&result.payloadHash!==computed){
  console.warn("O hash textual pode variar entre JSONB/PostgreSQL e JSON serializado. O payload remoto continua vinculado ao hash devolvido pela RPC.");
}
await writeFile(approvedPath,JSON.stringify(snapshot,null,2)+"\n");
await writeFile(effectsPath,JSON.stringify(effectsRegistry(snapshot),null,2)+"\n");
console.log(`Snapshot exportado: ${snapshot.records.length} memórias e ${snapshot.effects.filter(item=>item.enabled).length} efeitos ativos.`);
