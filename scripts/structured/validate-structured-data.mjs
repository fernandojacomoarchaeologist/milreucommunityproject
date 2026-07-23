/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";
const dataset = JSON.parse(readFileSync("public/data/structured/museum-dataset.jsonld","utf8"));
const records = JSON.parse(readFileSync("public/data/memories.json","utf8")).records.filter(record => record.publication.siteVisible);

if (dataset["@context"] !== "https://schema.org") throw new Error("Contexto JSON-LD inválido.");
if (dataset["@type"] !== "Dataset") throw new Error("A exportação principal deve ser Dataset.");
if (dataset.hasPart.length !== records.length) throw new Error("Dataset JSON-LD incompleto.");
if (dataset.hasPart.some(item => item.identifier === "MM202617")) throw new Error("MM202617 não pode entrar no dataset público.");
for (const item of dataset.hasPart) {
  if (item["@type"] !== "Photograph") throw new Error(`Tipo inválido: ${item.identifier}`);
  if (!item.image || item.image["@type"] !== "ImageObject") throw new Error(`ImageObject ausente: ${item.identifier}`);
  if ("license" in item || "license" in item.image) throw new Error("Não atribuir licença aberta sem decisão explícita.");
}
console.log("Dados estruturados validados.");
