/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { assertNoForbiddenSnapshotFields } from "../lib/guards.mjs";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  throw new Error("SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY são obrigatórios.");
}

const response = await fetch(
  `${url}/rest/v1/proteus_poc_published_facts?select=*&order=slug.asc`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } }
);
if (!response.ok) {
  throw new Error(`Falha na exportação: ${response.status} ${await response.text()}`);
}

const records = await response.json();
records.forEach(assertNoForbiddenSnapshotFields);

const payload = JSON.stringify(records, null, 2) + "\n";
const checksum = createHash("sha256").update(payload).digest("hex");
const generatedAt = new Date().toISOString();
const version = process.env.MILREU_SNAPSHOT_VERSION || generatedAt.slice(0, 10);

await mkdir("data/public/poc", { recursive: true });
await writeFile("data/public/poc/facts.json", payload);
await writeFile(
  "data/public/poc/manifest.json",
  JSON.stringify({
    snapshotId: "PROTEUS_POC_FACTS",
    version,
    generatedAt,
    source: "milreu-proteus",
    records: records.length,
    checksum: `sha256:${checksum}`,
    languages: ["pt-PT", "en", "es", "fr"]
  }, null, 2) + "\n"
);

console.log(`Snapshot exportado: ${records.length} registos.`);
