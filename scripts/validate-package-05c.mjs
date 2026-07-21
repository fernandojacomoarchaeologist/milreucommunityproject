/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

import fs from "node:fs";
import path from "node:path";
const root=process.argv[2] || process.cwd();
const required=["README.md","PROMPT_CLAUDE.md","PACKAGE_MANIFEST.md","apps/design-guide/index.html","apps/design-guide/guide.css","apps/design-guide/guide.js","packages/design-guide-catalog/v0.3/catalog.json","releases/PACKAGE_05C_v0.3.0.md"];
let errors=[];
for(const rel of required){ if(!fs.existsSync(path.join(root,rel))) errors.push(`missing: ${rel}`); }
const catalog=JSON.parse(fs.readFileSync(path.join(root,"packages/design-guide-catalog/v0.3/catalog.json"),"utf8"));
const ids=new Set();
for(const page of catalog.pages){ if(ids.has(page.id)) errors.push(`duplicate page id: ${page.id}`); ids.add(page.id); if(!page.sections?.length) errors.push(`page without sections: ${page.id}`); }
if(catalog.pages.length<20) errors.push("catalog must include at least 20 pages");
for(const file of walk(root)){ if(/\.(md|js|css)$/.test(file)){ const text=fs.readFileSync(file,"utf8"); if(!text.includes("Fernando Rodrigues de Jácomo")) errors.push(`copyright missing: ${path.relative(root,file)}`); } }
if(errors.length){ console.error(errors.join("\n")); process.exit(1); }
console.log(`05C valid: ${catalog.pages.length} pages, ${ids.size} routes.`);
function walk(dir){ return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{ const full=path.join(dir,entry.name); return entry.isDirectory()?walk(full):[full]; }); }
