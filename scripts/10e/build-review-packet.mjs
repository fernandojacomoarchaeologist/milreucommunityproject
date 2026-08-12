/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — comando LOCAL que constrói o pacote de revisão DETERMINÍSTICO dos 16 registos
 * `in_review` existentes. Lê apenas os dados editoriais 10C.1 repo-internos; NUNCA altera dados
 * editoriais, NUNCA escreve sob `public/` e NUNCA inventa revisor. Escreve em `stdout` por
 * omissão; `--output <caminho>` só escreve no caminho explicitamente indicado pelo operador.
 *
 * Uso: node scripts/10e/build-review-packet.mjs [--output <caminho.json>]
 */
import { readFileSync, writeFileSync, lstatSync, existsSync, realpathSync } from "node:fs";
import { resolve, dirname, basename, join } from "node:path";
import { buildReviewPacket } from "../../src/proteus/editorial-workflow.mjs";

const die = (m) => { console.error(`10E review-packet: ${m}`); process.exit(2); };
const read = (p) => JSON.parse(readFileSync(resolve(p), "utf8"));

const A = read("data/proteus/knowledge-assertions.json");
const E = read("data/proteus/knowledge-evidence-locators.json");
const Q = read("data/proteus/knowledge-review-queue.json");
const packet = buildReviewPacket({ assertions: A.assertions || [], locators: E.locators || [], entities: A.entities || [], queue: Q.items || [] });
const out = JSON.stringify(packet, null, 2) + "\n";

const oi = process.argv.indexOf("--output");
if (oi === -1) { process.stdout.write(out); process.exit(0); }

const target = process.argv[oi + 1];
if (!target) die("--output exige um caminho.");
if (!/\.json$/i.test(target)) die("--output só aceita um caminho .json.");
const abs = resolve(target);
// Alvo não pode ser um symlink existente (impede escrita através de symlink).
if (existsSync(abs)) { try { if (lstatSync(abs).isSymbolicLink()) die("alvo é um symlink; recusado."); } catch { die("alvo inacessível."); } }
// Diretório-pai tem de existir, não ser symlink, e ser resolvido pelo seu caminho real (impede
// escrita através de um diretório-pai/ancestral simbólico).
const parent = dirname(abs);
if (!existsSync(parent)) die("diretório-pai inexistente.");
let realParent;
try {
  if (lstatSync(parent).isSymbolicLink()) die("diretório-pai é um symlink; recusado.");
  realParent = realpathSync(parent);
} catch (e) { die(`diretório-pai inválido: ${e && e.message ? e.message.replace(abs, "<alvo>") : "erro"}`); }
const finalPath = join(realParent, basename(abs));
// Nunca escrever sob public/, src/, data/proteus/ ou .github do repositório (verificado no caminho REAL).
const repoRoot = realpathSync(resolve(process.cwd()));
const forbidden = ["/public/", "/src/", "/data/proteus/", "/.github/"];
if (finalPath.startsWith(repoRoot) && forbidden.some((f) => finalPath.includes(f))) die(`caminho proibido para saída: ${target} (não escrever em áreas canónicas/servidas).`);
if (existsSync(finalPath)) { try { if (lstatSync(finalPath).isSymbolicLink()) die("alvo resolvido é um symlink; recusado."); } catch { die("alvo resolvido inacessível."); } }
writeFileSync(finalPath, out);
console.error(`10E review-packet: escrito em ${target} (${packet.totalItems} itens; nada alterado nos dados canónicos).`);
