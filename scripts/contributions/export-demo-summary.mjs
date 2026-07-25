/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile,writeFile } from "node:fs/promises";

const model=JSON.parse(await readFile("public/data/collaborative-contribution-model.json","utf8"));
const summary={
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.16.0",
  generatedAt:new Date().toISOString(),
  source:"demo-contract-only",
  counts:{submitted:0,underReview:0,accepted:0,incorporated:0},
  contributionTypes:model.contributionTypes.map(item=>item.code),
  notice:"Este ficheiro valida o contrato. Não contém dados pessoais ou contributos reais."
};
await writeFile("public/data/contributions-public-summary.json",JSON.stringify(summary,null,2)+"\n");
console.log("Resumo demonstrativo dos contributos atualizado sem dados reais.");
