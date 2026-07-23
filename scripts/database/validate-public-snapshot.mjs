/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { assertNoForbiddenSnapshotFields } from "../lib/guards.mjs";

const recordsText = await readFile("data/public/poc/facts.json", "utf8");
const manifest = JSON.parse(await readFile("data/public/poc/manifest.json", "utf8"));
const records = JSON.parse(recordsText);

if (!Array.isArray(records)) throw new Error("Snapshot não é uma lista.");
records.forEach(assertNoForbiddenSnapshotFields);

const checksum = createHash("sha256").update(recordsText).digest("hex");
if (manifest.checksum !== `sha256:${checksum}`) {
  throw new Error("Checksum do snapshot inválido.");
}
if (manifest.records !== records.length) {
  throw new Error("Contagem do manifest diverge do snapshot.");
}
console.log(`Snapshot válido: ${records.length} registos.`);
