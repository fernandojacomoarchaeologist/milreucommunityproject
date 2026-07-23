/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { buildStaticRecordPages } from "./structured/static-record-builder.mjs";
await rm("dist",{recursive:true,force:true});await mkdir("dist",{recursive:true});
for(const item of ["index.html","404.html",".nojekyll","src","public","auth"]){await cp(item,`dist/${item}`,{recursive:true})}
const collaborativeConfig=readFileSync("public/config/collaborative-area.runtime.json");const collaborativeConfigHash=createHash("sha256").update(collaborativeConfig).digest("hex");const collaborativeData=readFileSync("public/data/collaborative-modules.json");const collaborativeHash=createHash("sha256").update(collaborativeData).digest("hex");const carouselData=readFileSync("public/data/home-carousel.json");const carouselHash=createHash("sha256").update(carouselData).digest("hex");const channelsData=readFileSync("public/data/channels/channel-records.json");const channelsHash=createHash("sha256").update(channelsData).digest("hex");const structuredData=readFileSync("public/data/structured/museum-dataset.jsonld");const structuredHash=createHash("sha256").update(structuredData).digest("hex");const data=readFileSync("public/data/memories.json");const hash=createHash("sha256").update(data).digest("hex");const collections=readFileSync("public/data/museum-collections.json");const collectionsHash=createHash("sha256").update(collections).digest("hex");const index=readFileSync("public/data/museum-index.json");const indexHash=createHash("sha256").update(index).digest("hex");
await buildStaticRecordPages("dist");
await writeFile("dist/build-manifest.json",JSON.stringify({_copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",version:"0.12.0",builtAt:new Date().toISOString(),memoriesChecksum:`sha256:${hash}`,collectionsChecksum:`sha256:${collectionsHash}`,indexChecksum:`sha256:${indexHash}`,collaborativeConfigChecksum:`sha256:${collaborativeConfigHash}`,collaborativeChecksum:`sha256:${collaborativeHash}`,carouselChecksum:`sha256:${carouselHash}`,channelsChecksum:`sha256:${channelsHash}`,structuredChecksum:`sha256:${structuredHash}`,mode:"editorial-preview-noindex"},null,2)+"\n");
console.log("Build concluído em dist/.");
