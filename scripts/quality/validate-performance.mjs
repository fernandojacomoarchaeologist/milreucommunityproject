/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

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

const js = walk("src",".js");
const css = walk("src",".css");
const html = statSync("index.html").size;

if (js > budgets.javascriptTotalMax) throw new Error(`JavaScript acima do budget: ${js}`);
if (css > budgets.cssTotalMax) throw new Error(`CSS acima do budget: ${css}`);
if (html > budgets.htmlShellMax) throw new Error(`HTML shell acima do budget: ${html}`);
console.log(`Budgets validados — JS ${js}, CSS ${css}, HTML ${html}.`);
