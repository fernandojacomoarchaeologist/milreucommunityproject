/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync, existsSync } from "node:fs";

const config = JSON.parse(readFileSync("public/data/channels/channel-config.json","utf8"));
const records = JSON.parse(readFileSync("public/data/channels/channel-records.json","utf8")).records;
const readiness = JSON.parse(readFileSync("public/data/release-readiness.json","utf8"));
const router = readFileSync("src/lib/router.js","utf8");
const main = readFileSync("src/main.js","utf8");
const channels = readFileSync("src/views/channels.js","utf8");
const build = readFileSync("scripts/build.mjs","utf8");

for (const [pattern,label] of [
  ["laboratorio/canais","laboratório"],
  ["totemPreview","totem"],
  ["panelPreview","painel"]
]) {
  if (!router.includes(pattern)) throw new Error(`Rota multicanal ausente: ${label}`);
}
for (const view of ["channelLabView","totemPreviewView","panelPreviewView"]) {
  if (!channels.includes(view) || !main.includes(view)) throw new Error(`View 07D ausente: ${view}`);
}
if (!build.includes("buildStaticRecordPages")) throw new Error("Build não gera páginas estáticas.");
if (readiness.publicLaunch.approved) throw new Error("O pacote técnico não pode aprovar o lançamento público.");
if (config.channels.totem.printReady || config.channels.panel.printReady) throw new Error("Previews físicos não são print-ready.");
if (!existsSync(".github/workflows/07d-pages.yml")) throw new Error("Workflow Pages ausente.");
if (records.filter(record => record.publication.siteVisible).length !== 30) throw new Error("Esperados 30 perfis públicos.");
console.log("Pacote 07D validado.");
