/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.env.MILREU_PRIVATE_ASSET_ROOT;
const expected = [
  "hauschild-teichner/original.pdf",
  "hauschild-teichner/thumbnails"
];

const status = {
  mode: root ? "private" : "public",
  rootConfigured: Boolean(root),
  assets: expected.map(item => ({
    item,
    exists: root ? existsSync(join(root, item)) : false
  }))
};

console.log(JSON.stringify(status, null, 2));
if (!root) {
  console.log("Modo público: ausência dos binários privados é esperada.");
}
