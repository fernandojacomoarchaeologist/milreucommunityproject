/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09E — integridade e não regressão dos originais históricos. Recalcula o sha256
 * dos 31 originais do Museu e compara com o manifesto: o conjunto deve ser idêntico,
 * byte a byte. Confirma também que o diretório de derivados não é fonte canónica das
 * memórias (memories.json aponta 'original' para os originais, não para 'generated').
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const sha256 = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const fail = (m) => { throw new Error(`09E integridade: ${m}`); };

const manifest = read("public/data/media-manifest.json");
let checked = 0;
for (const item of manifest.items) {
  const actual = sha256(item.originalPath);
  if (actual !== item.sha256) fail(`original alterado: ${item.originalPath}\n  manifesto=${item.sha256}\n  atual=    ${actual}`);
  checked++;
}
if (checked !== 31) fail(`esperados 31 originais, verificados ${checked}.`);

const memories = read("public/data/memories.json").records;
for (const m of memories) {
  if (m.media?.original && /\/generated\//.test(m.media.original)) fail(`memória ${m.id}: 'original' aponta para derivados (generated).`);
}

console.log(`Pacote 09E: integridade dos originais confirmada — ${checked}/31 originais inalterados (byte a byte); derivados não são fonte canónica.`);
