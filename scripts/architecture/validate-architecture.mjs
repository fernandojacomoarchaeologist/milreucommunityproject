/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { readFileSync, readdirSync } from "node:fs";
const routes=JSON.parse(readFileSync("data/architecture/route-manifest.json","utf8")).routes;
const paths=routes.map(r=>r.path);
if(new Set(paths).size!==paths.length)throw new Error("Rotas duplicadas.");
const specs=readdirSync("docs/specifications/pages").filter(x=>x.endsWith(".md"));
if(specs.length!==routes.length)throw new Error(`Specs ${specs.length} != rotas ${routes.length}`);
const proto=readFileSync("apps/architecture-prototype/prototype.js","utf8");
for(const forbidden of ["MM202601","MM202617","museum-items.js"]){
  if(proto.includes(forbidden))throw new Error(`Referência real proibida: ${forbidden}`);
}
console.log(`${routes.length} rotas, ${specs.length} specs e protótipo validados.`);
