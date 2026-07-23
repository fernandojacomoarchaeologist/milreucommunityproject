/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync, readFileSync } from "node:fs";

const memories=JSON.parse(readFileSync("public/data/memories.json","utf8")).records;
const index=JSON.parse(readFileSync("public/data/museum-index.json","utf8")).records;
const collections=JSON.parse(readFileSync("public/data/museum-collections.json","utf8")).collections;
const channels=JSON.parse(readFileSync("public/data/channels/channel-records.json","utf8")).records;
const qr=JSON.parse(readFileSync("public/data/channels/qr-targets.json","utf8"));
const dataset=JSON.parse(readFileSync("public/data/structured/museum-dataset.jsonld","utf8"));
const rights=JSON.parse(readFileSync("public/data/rights-register.json","utf8")).records;
const card=readFileSync("src/components/memory-card.js","utf8");
const museum=readFileSync("src/views/museum.js","utf8");
const css=readFileSync("src/styles/app.css","utf8");

const record=memories.find(item=>item.id==="MM202617");
if(!record) throw new Error("MM202617 ausente.");
if(record.publication.siteVisible!==true||record.publication.siteStatus!=="review-visible"){
  throw new Error("MM202617 deve estar visível em modo de revisão.");
}
if(record.publication.publicReleaseEligible!==false||record.publication.robots!=="noindex"){
  throw new Error("MM202617 deve permanecer inelegível para lançamento e noindex.");
}
if(record.editorialStatus!=="in-review") throw new Error("MM202617 deve permanecer in-review.");
if(!record.media.digitalInterventions.some(item=>item.substantiveChange&&String(item.type).includes("ai"))){
  throw new Error("Retoque substantivo por IA não documentado.");
}
if(!index.some(item=>item.id==="MM202617")) throw new Error("MM202617 ausente do índice de revisão.");
const interventionCollection=collections.find(item=>item.slug==="intervencoes-digitais-documentadas");
if(!interventionCollection?.members.includes("MM202617")) throw new Error("MM202617 ausente da coleção de intervenções.");
const channel=channels.find(item=>item.id==="MM202617");
if(channel?.totem.eligibility!=="review-only"||channel?.panel.eligibility!=="review-only"){
  throw new Error("Canais físicos de MM202617 devem permanecer review-only.");
}
if(qr.targets.some(item=>item.id==="MM202617")) throw new Error("MM202617 não pode ter QR final.");
if(dataset.hasPart.some(item=>item.identifier==="MM202617")) throw new Error("MM202617 não pode integrar o dataset de lançamento.");
const rightsRecord=rights.find(item=>item.id==="MM202617");
if(rightsRecord?.siteVisible!==true||rightsRecord?.publicReleaseEligible!==false){
  throw new Error("Registo de direitos inconsistente.");
}
if(!existsSync("public/data/editorial-decisions/MM202617-unlock-review.json")){
  throw new Error("Decisão editorial de desbloqueio ausente.");
}
for(const requirement of ["ai-retouch-badge","ai-card-notice"]){
  if(!card.includes(requirement)) throw new Error(`Aviso no card ausente: ${requirement}`);
}
for(const requirement of ["aiReviewDisclosure","immersive-ai-badge"]){
  if(!museum.includes(requirement)) throw new Error(`Aviso museológico ausente: ${requirement}`);
}
if(!css.includes(".ai-review-disclosure")) throw new Error("Estilo de divulgação por IA ausente.");

console.log("Hotfix 07D.3 validado: MM202617 visível para revisão, com divulgação de IA e bloqueios de lançamento preservados.");
