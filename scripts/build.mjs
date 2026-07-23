/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
await rm("dist",{recursive:true,force:true});await mkdir("dist",{recursive:true});
for(const item of ["index.html","404.html",".nojekyll","src","public"]){await cp(item,`dist/${item}`,{recursive:true})}
const data=readFileSync("public/data/memories.json");const hash=createHash("sha256").update(data).digest("hex");const collections=readFileSync("public/data/museum-collections.json");const collectionsHash=createHash("sha256").update(collections).digest("hex");const index=readFileSync("public/data/museum-index.json");const indexHash=createHash("sha256").update(index).digest("hex");
await writeFile("dist/build-manifest.json",JSON.stringify({_copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",version:"0.10.0",builtAt:new Date().toISOString(),memoriesChecksum:`sha256:${hash}`,collectionsChecksum:`sha256:${collectionsHash}`,indexChecksum:`sha256:${indexHash}`,mode:"editorial-preview-noindex"},null,2)+"\n");
console.log("Build concluído em dist/.");
