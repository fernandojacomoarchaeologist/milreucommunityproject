/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09E — inventário e classificação de media. Deriva do media-manifest.json
 * (31 originais + variantes, com dimensões, bytes e sha256) e cataloga também marca,
 * ícones e demais ativos públicos referenciados. NÃO altera originais nem derivados;
 * apenas descreve. Direitos/crédito vêm de memories.json (fonte de verdade editorial).
 * Escreve reports/media-inventory-09e.json conforme contracts/09e/media-asset-record.schema.json.
 */
import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const sha256 = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const mimeOf = (p) => ({ webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", svg: "image/svg+xml" }[p.split(".").pop().toLowerCase()] || "application/octet-stream");

const manifest = read("public/data/media-manifest.json");
const memories = read("public/data/memories.json").records;
const memoryById = Object.fromEntries(memories.map((m) => [m.id, m]));

const records = [];

// 1) Originais históricos + derivados do Museu (a partir do manifesto).
for (const item of manifest.items) {
  const mem = memoryById[item.id];
  const credit = mem?.media?.credit?.["pt-PT"] || null;
  const intervention = (mem?.media?.digitalInterventions || []).length
    ? mem.media.digitalInterventions.map((d) => d.summary || d.type).join("; ")
    : null;
  records.push({
    path: item.originalPath, hash: item.sha256, mime: item.mimeType, bytes: item.bytes,
    width: item.width, height: item.height, classification: "historical-original", isOriginal: true,
    sourceHash: null, rightsStatus: credit ? "confirmed" : "pending", credit,
    digitalIntervention: intervention, contexts: ["museum-original"], memoryId: item.id,
  });
  for (const [variant, v] of Object.entries(item.variants || {})) {
    records.push({
      path: v.path, hash: v.sha256, mime: mimeOf(v.path), bytes: v.bytes,
      width: v.width, height: v.height, classification: "historical-derivative", isOriginal: false,
      sourceHash: item.sha256, rightsStatus: credit ? "confirmed" : "pending", credit,
      digitalIntervention: intervention, contexts: [`museum-${variant}`], memoryId: item.id,
    });
  }
}

// 2) Ativos de interface (marca, ícones) referenciados no código.
function catalogDir(dir, classification, context) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { catalogDir(p, classification, context); continue; }
    if (!/\.(webp|png|jpg|jpeg|svg)$/i.test(name)) continue;
    const st = statSync(p);
    records.push({
      path: p, hash: sha256(p), mime: mimeOf(p), bytes: st.size, width: null, height: null,
      classification, isOriginal: false, sourceHash: null, rightsStatus: "confirmed",
      credit: "Projeto Comunitário de Milreu", digitalIntervention: null, contexts: [context],
    });
  }
}
catalogDir("public/brand", "interface", "brand");
catalogDir("public/icons", "interface", "icon");

const originals = records.filter((r) => r.isOriginal);
const report = {
  _copyright: "© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.",
  package: "09E", version: "0.38.0", generatedAt: new Date().toISOString().slice(0, 10),
  sourceManifestVersion: manifest.version,
  counts: {
    total: records.length,
    historicalOriginals: originals.length,
    historicalDerivatives: records.filter((r) => r.classification === "historical-derivative").length,
    interface: records.filter((r) => r.classification === "interface").length,
    rightsPending: records.filter((r) => r.rightsStatus === "pending").length,
    unknown: records.filter((r) => r.classification === "unknown").length,
  },
  note: "Inventário derivado do manifesto. Originais históricos são imutáveis (byte a byte). 'rightsStatus: pending' assinala crédito por confirmar; nada é publicado ou transformado por este inventário. MM202617 preserva a nota de intervenção por IA.",
  assets: records,
};
mkdirSync("reports", { recursive: true });
writeFileSync("reports/media-inventory-09e.json", JSON.stringify(report, null, 2) + "\n");
console.log(`Pacote 09E: inventário de media escrito — ${records.length} ativos (${originals.length} originais, ${report.counts.historicalDerivatives} derivados, ${report.counts.interface} de interface; ${report.counts.rightsPending} com direitos pendentes).`);
