/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const root = process.env.MILREU_PRIVATE_ASSET_ROOT;
if (!root) {
  console.log("Modo público: verificação privada ignorada sem falhar.");
  process.exit(0);
}

const manifestPath = "sources/manifests/hauschild-teichner.json";
if (!existsSync(manifestPath)) {
  throw new Error(`Manifest ausente: ${manifestPath}`);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const filePath = join(root, manifest.relativePrivatePath);
if (!existsSync(filePath)) throw new Error(`Fonte privada ausente: ${filePath}`);

const hash = createHash("sha256").update(readFileSync(filePath)).digest("hex");
if (manifest.sha256 && manifest.sha256 !== hash) {
  throw new Error("Checksum da fonte privada diverge do manifest.");
}
console.log("Fonte privada verificada.");
