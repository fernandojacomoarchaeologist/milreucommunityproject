/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
const data=JSON.parse(readFileSync("public/data/memories.json","utf8"));const media=JSON.parse(readFileSync("public/data/media-manifest.json","utf8"));
if(data.records.length!==31)throw new Error(`Esperados 31 registos; encontrados ${data.records.length}`);
if(media.items.length!==31)throw new Error(`Esperadas 31 imagens; encontradas ${media.items.length}`);
if(data.records.filter(x=>x.publication.siteVisible).length!==31)throw new Error("Devem existir 31 registos visíveis em modo de revisão.");
const review=data.records.find(x=>x.id==="MM202617");if(review?.publication.siteVisible!==true||review?.publication.siteStatus!=="review-visible")throw new Error("MM202617 deve estar visível para revisão.");if(review?.publication.publicReleaseEligible!==false)throw new Error("MM202617 não pode estar elegível para lançamento público.");if(!review?.media.digitalInterventions?.some(item=>item.substantiveChange&&String(item.type).includes("ai")))throw new Error("MM202617 deve declarar retoque substantivo por IA.");
for(const record of data.records){if(!record.rights||record.rights.status!=="authorized-for-project-publication")throw new Error(`Direitos ausentes: ${record.id}`);for(const path of [record.media.original,...Object.values(record.media.variants)])if(!existsSync(path))throw new Error(`Asset ausente: ${path}`)}
if(existsSync("public/media/museum/originals/MM202612.jpeg"))throw new Error("Duplicado MM202612.jpeg não deve existir.");
if(existsSync("public/media/museum/originals/milreu_mosaic_hero.png"))throw new Error("Hero legado não deve existir.");
console.log("Validação base concluída: 31 imagens visíveis; MM202617 em revisão e inelegível para lançamento público.");
