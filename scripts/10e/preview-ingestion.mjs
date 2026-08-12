/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — comando LOCAL de pré-visualização de ingestão. Recebe APENAS um JSON local
 * explicitamente indicado; NÃO busca URLs, NÃO lê PDF/OCR/texto integral, NÃO escreve nada.
 * Não existe `--apply`. Aplica limite pequeno de tamanho, valida caminho/formato (sem traversal
 * nem symlink) e imprime a pré-visualização de quarentena (sempre 'draft').
 *
 * Uso: node scripts/10e/preview-ingestion.mjs <caminho-do-lote.json>
 */
import { readFileSync, lstatSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import { buildIngestionPreview } from "../../src/proteus/knowledge-ingestion.mjs";

const MAX_BYTES = 256 * 1024; // limite pequeno e explícito
const die = (m) => { console.error(`10E preview: ${m}`); process.exit(2); };

const arg = process.argv[2];
if (!arg) die("indique o caminho de um ficheiro JSON local: node scripts/10e/preview-ingestion.mjs <ficheiro.json>");
if (process.argv.includes("--apply")) die("opção --apply não existe: a pré-visualização nunca escreve nem aplica.");
if (!/\.json$/i.test(arg)) die("apenas ficheiros .json são aceites.");

const abs = resolve(arg);
let st;
try { st = lstatSync(abs); } catch { die(`ficheiro não encontrado: ${arg}`); }
if (st.isSymbolicLink()) die("symlink recusado.");
if (!st.isFile()) die("o caminho não é um ficheiro regular.");
// Anti-traversal defensivo: o caminho real tem de coincidir com o resolvido (sem symlink no meio).
try { if (realpathSync(abs) !== abs) die("caminho com ligação simbólica intermédia recusado."); } catch { die("caminho inválido."); }
if (st.size > MAX_BYTES) die(`ficheiro excede o limite de ${MAX_BYTES} bytes.`);

let batch;
try { batch = JSON.parse(readFileSync(abs, "utf8")); } catch { die("JSON inválido (não revelamos o conteúdo)."); }
if (!batch || typeof batch !== "object") die("o lote tem de ser um objeto JSON.");

// Âmbito de fontes e IDs canónicos, lidos de dados repo-internos (nunca de rede).
const scope = read("data/proteus/knowledge-source-scope.json");
const canonical = read("data/proteus/knowledge-assertions.json");
const paginated = (scope.included || []).filter((s) => /pagina|paginat|\bpage\b/i.test(JSON.stringify(s))).map((s) => (typeof s === "string" ? s : s.id || s.sourceId)).filter(Boolean);
const included = (scope.included || []).map((s) => (typeof s === "string" ? s : s.id || s.sourceId)).filter(Boolean);
const excluded = (scope.excluded || []).map((s) => (typeof s === "string" ? s : s.id || s.sourceId)).filter(Boolean);
const canonicalIds = (canonical.assertions || []).map((a) => a.id);

const preview = buildIngestionPreview(batch, { includedSources: included, excludedSources: excluded, canonicalIds, paginatedSources: paginated });
process.stdout.write(JSON.stringify(preview, null, 2) + "\n");

function read(p) {
  try { return JSON.parse(readFileSync(resolve(p), "utf8")); } catch { return {}; }
}
