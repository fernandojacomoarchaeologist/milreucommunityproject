/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync, existsSync } from "node:fs";

const config = JSON.parse(readFileSync("public/data/channels/channel-config.json","utf8"));
const records = JSON.parse(readFileSync("public/data/channels/channel-records.json","utf8")).records;
const qr = JSON.parse(readFileSync("public/data/channels/qr-targets.json","utf8"));
const memories = JSON.parse(readFileSync("public/data/memories.json","utf8")).records;

if (records.length !== memories.length) throw new Error("Exportação multicanal incompleta.");
if (records.find(item => item.id === "MM202617")?.totem.eligibility !== "blocked") {
  throw new Error("MM202617 deve estar bloqueado nos canais físicos.");
}
if (records.some(item => item.totem.enabled || item.panel.enabled)) {
  throw new Error("Totens e painéis não podem ser ativados sem seleção curatorial.");
}
if (config.publicBaseUrl !== null || qr.publicBaseUrl !== null) {
  throw new Error("O pacote não deve inventar um domínio público.");
}
if (qr.targets.some(target => target.absoluteUrl !== null || target.status !== "pending")) {
  throw new Error("QR final não pode ser marcado como pronto sem domínio.");
}
for (const item of records.filter(item => item.publication.siteVisible)) {
  if (!item.media.printSource || !existsSync(item.media.printSource)) {
    throw new Error(`Fonte de impressão ausente: ${item.id}`);
  }
  if (item.totem.qrTargetPath !== `/museu/memorias/${item.id}`) {
    throw new Error(`Destino QR divergente: ${item.id}`);
  }
}
console.log("Perfis multicanal validados.");
