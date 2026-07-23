/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";

const memories = JSON.parse(readFileSync("public/data/memories.json","utf8")).records;
const index = JSON.parse(readFileSync("public/data/museum-index.json","utf8")).records;
const collections = JSON.parse(readFileSync("public/data/museum-collections.json","utf8")).collections;
const audit = JSON.parse(readFileSync("public/data/museum-audit.json","utf8"));
const visible = memories.filter(record => record.publication.siteVisible);

if (visible.length !== 30) throw new Error(`Esperados 30 registos visíveis; obtidos ${visible.length}.`);
if (index.length !== visible.length) throw new Error("Índice não cobre todos os registos visíveis.");
if (index.some(item => item.id === "MM202617")) throw new Error("MM202617 não pode entrar no índice público.");
if (collections.some(collection => collection.members.includes("MM202617"))) throw new Error("MM202617 não pode entrar em coleções públicas.");
if (collections.some(collection => collection.collectionType !== "derived-navigation" || collection.factualClaim !== false)) {
  throw new Error("Coleções derivadas devem declarar natureza navegacional e ausência de nova alegação factual.");
}
for (const record of visible) {
  if (!index.find(item => item.id === record.id)) throw new Error(`Registo ausente do índice: ${record.id}`);
  for (const variant of ["thumbnail","card","detail","immersive"]) {
    if (!record.media.variants[variant]) throw new Error(`${record.id} sem variante ${variant}`);
  }
}
if (audit.nonReciprocalRelations.count !== audit.nonReciprocalRelations.pairs.length) {
  throw new Error("Contagem de relações não recíprocas inconsistente.");
}
const museum = readFileSync("src/views/museum.js","utf8");
for (const requirement of [
  "collectionsView","collectionDetailView","suggestedMemories","digitalInterventionNotice",
  "museum-index.json","data-browser-fullscreen","immersive-filmstrip","source-list"
]) {
  if (!museum.includes(requirement) && !readFileSync("src/main.js","utf8").includes(requirement) && !readFileSync("src/lib/data.js","utf8").includes(requirement)) {
    throw new Error(`Capacidade 07C ausente: ${requirement}`);
  }
}
if (museum.includes("example.invalid")) throw new Error("O Museu ainda contém contacto fictício.");
console.log("Museu 07C validado.");
