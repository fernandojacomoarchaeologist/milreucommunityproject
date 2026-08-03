/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile,writeFile,mkdir,copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const memoriesPath="public/data/memories.json";
const approvedPath="public/data/museum-editorial-approved.json";
const effectsPath="public/data/public-content-effects.json";
const confirmation=process.env.MILREU_APPLY_EDITORIAL_SNAPSHOT||"";
const writeMode=confirmation==="I_CONFIRM_APPLY_APPROVED_MUSEUM_REVIEW";

function sha(buffer){return createHash("sha256").update(buffer).digest("hex");}
function recordHash(record){return sha(JSON.stringify(record,Object.keys(record).sort()));}
function stable(value){
  if(Array.isArray(value))return value.map(stable);
  if(value&&typeof value==="object")return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])]));
  return value;
}
function stableRecordHash(record){return sha(JSON.stringify(stable(record)));}
function tokens(path){return String(path).split("/").slice(1).map(token=>token.replaceAll("~1","/").replaceAll("~0","~"));}
function setPointer(target,path,value){
  const parts=tokens(path);
  if(!parts.length)throw new Error("Não é permitido substituir o registo completo.");
  let current=target;
  for(let index=0;index<parts.length-1;index++){
    const token=parts[index];
    if(current[token]===undefined||current[token]===null||typeof current[token]!=="object")current[token]={};
    current=current[token];
  }
  current[parts.at(-1)]=value;
}
function validateSnapshot(snapshot){
  if(snapshot.version!=="0.36.0")throw new Error("Versão de snapshot inválida.");
  if(!Array.isArray(snapshot.records))throw new Error("Registos ausentes.");
  for(const item of snapshot.records){
    if(!item.approvals?.editorialApprovedAt||!item.approvals?.rightsApprovedAt||!item.approvals?.publicationApprovedAt){
      throw new Error(`Aprovações incompletas: ${item.memoryId}`);
    }
  }
}

const memoriesBuffer=await readFile(memoriesPath);
const memories=JSON.parse(memoriesBuffer);
const snapshot=JSON.parse(await readFile(approvedPath,"utf8"));
validateSnapshot(snapshot);

if(!snapshot.records.length){
  console.log("Nenhuma memória aprovada no snapshot. Nada a aplicar.");
  process.exit(0);
}
if(snapshot.sourceDatasetHash&&snapshot.sourceDatasetHash!==sha(memoriesBuffer)){
  throw new Error("O hash do dataset canónico mudou. Reexporte ou reconcilie o snapshot antes de aplicar.");
}

const byId=new Map(memories.records.map(record=>[record.id,record]));
const changed=[];
for(const item of snapshot.records){
  const record=byId.get(item.memoryId);
  if(!record)throw new Error(`Memória não encontrada: ${item.memoryId}`);
  if(stableRecordHash(record)!==item.baseHash){
    throw new Error(`Hash de base divergente: ${item.memoryId}`);
  }
  for(const patch of item.patches)setPointer(record,patch.path,patch.value);
  const substantiveAi=(record.media?.digitalInterventions||[]).some(intervention=>intervention.substantiveChange&&String(intervention.type||"").toLowerCase().includes("ai"));
  if(record.publication?.publicReleaseEligible===true&&substantiveAi&&record.publication?.reviewNotice!=="ai-substantive-intervention"){
    throw new Error(`Divulgação obrigatória de IA ausente: ${item.memoryId}`);
  }
  record.editorialStatus="approved";
  changed.push({memoryId:item.memoryId,patchCount:item.patches.length});
}

const next={...memories,version:"0.36.0",generatedAt:new Date().toISOString(),editorialNotice:"Conteúdo atualizado através de snapshot editorial aprovado, validado e aplicado por processo controlado.",records:memories.records};
const output=JSON.stringify(next,null,2)+"\n";

console.log(JSON.stringify({mode:writeMode?"apply":"dry-run",changed},null,2));
if(!writeMode){
  console.log('Dry-run concluído. Para aplicar, defina MILREU_APPLY_EDITORIAL_SNAPSHOT="I_CONFIRM_APPLY_APPROVED_MUSEUM_REVIEW".');
  process.exit(0);
}

await mkdir("releases/editorial-backups",{recursive:true});
const stamp=new Date().toISOString().replaceAll(":","-").replaceAll(".","-");
await copyFile(memoriesPath,`releases/editorial-backups/memories-before-${stamp}.json`);
await writeFile(memoriesPath,output);

const slots={"portal.home.after-featured":[],"museum.home.after-opening":[]};
for(const effect of snapshot.effects||[]){
  if(effect.enabled&&["approved","published"].includes(effect.status))slots[effect.slotCode].push(effect);
}
await writeFile(effectsPath,JSON.stringify({
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.36.0",
  generatedAt:new Date().toISOString(),
  sourceCycle:snapshot.cycleCode,
  slots,
  rules:{enabledOnly:true,approvedOnly:true,canonicalReferencesOnly:true,maximumItemsPerEffect:3},
  notice:"Efeitos gerados durante a aplicação do snapshot editorial aprovado."
},null,2)+"\n");

console.log(`Aplicação concluída em ${changed.length} memórias. Execute validate, test, build e smoke antes de abrir PR.`);
