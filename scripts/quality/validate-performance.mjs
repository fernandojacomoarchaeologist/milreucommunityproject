/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, dirname, normalize } from "node:path";

const budgets = JSON.parse(readFileSync("public/data/performance-budgets.json","utf8")).budgetsBytes;
const memories = JSON.parse(readFileSync("public/data/memories.json","utf8")).records;

for (const record of memories) {
  for (const [variant,budgetKey] of [["thumbnail","thumbnailMax"],["card","cardMax"],["detail","detailMax"],["immersive","immersiveMax"]]) {
    const size = statSync(record.media.variants[variant]).size;
    if (size > budgets[budgetKey]) throw new Error(`${record.id} ${variant}: ${size} > ${budgets[budgetKey]}`);
  }
}

const walk = (dir,extension) => {
  let total = 0;
  for (const entry of readdirSync(dir,{withFileTypes:true})) {
    const path = join(dir,entry.name);
    if (entry.isDirectory()) total += walk(path,extension);
    else if (entry.name.endsWith(extension)) total += statSync(path).size;
  }
  return total;
};

// Grafo de imports ESTÁTICOS (import/export … from) a partir de um ponto de entrada;
// import() dinâmico não entra — é carregado a pedido.
const staticGraph = entry => {
  const seen = new Set(), stack = [entry];
  while (stack.length) {
    const file = normalize(stack.pop());
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    const source = readFileSync(file,"utf8");
    for (const m of source.matchAll(/(?:^|\n)\s*(?:import|export)\s[^;]*?\sfrom\s*"([^"]+)"|(?:^|\n)\s*import\s*"([^"]+)"/g)) {
      const spec = m[1] || m[2];
      if (spec.startsWith(".")) stack.push(join(dirname(file),spec));
    }
  }
  return seen;
};
const sizeOf = files => [...files].reduce((sum,file) => sum + statSync(file).size, 0);

const js = walk("src",".js");
const publicGraph = staticGraph("src/main.js");
const collabGraph = new Set([...staticGraph("src/collab/bundle.js")].filter(file => !publicGraph.has(file)));
const jsPublic = sizeOf(publicGraph), jsCollab = sizeOf(collabGraph);
const css = walk("src",".css");
const html = statSync("index.html").size;

if ([...publicGraph].some(file => /[\\/]collab[\\/]/.test(file))) throw new Error("Código da Área Colaborativa no carregamento público.");
if (jsPublic > budgets.javascriptPublicInitialMax) throw new Error(`JavaScript público acima do budget: ${jsPublic}`);
if (jsCollab > budgets.javascriptCollaborativeMax) throw new Error(`JavaScript da Área Colaborativa acima do budget: ${jsCollab}`);
if (js > budgets.javascriptTotalMax) throw new Error(`JavaScript acima do budget: ${js}`);
if (css > budgets.cssTotalMax) throw new Error(`CSS acima do budget: ${css}`);
if (html > budgets.htmlShellMax) throw new Error(`HTML shell acima do budget: ${html}`);
console.log(`Budgets validados — JS público ${jsPublic}, Área Colaborativa ${jsCollab}, total ${js}, CSS ${css}, HTML ${html}.`);
