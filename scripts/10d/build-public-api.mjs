/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10D — gerador ESTÁTICO e DETERMINISTA da API pública Proteus v1 (somente leitura).
 *
 * Lê apenas snapshots PÚBLICOS já versionados (proteus-catalog-public.json e
 * proteus-knowledge-public.json) e escreve os seis exports autorizados em public/api/proteus/v1/.
 * Nunca lê PDFs, storage privado, base de dados remota, rede nem relógio: duas execuções produzem
 * bytes idênticos.
 *
 * Fail-closed reforçado: se qualquer registo real for considerado elegível sem carregar uma
 * permissão de exposição por API explicitamente "allow", o build FALHA. Na base atual, nenhum
 * registo tem essa permissão, pelo que todas as coleções começam com zero itens.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCollection, buildIndex, isApiEligible, apiExposureDecision, COLLECTIONS } from "../../src/proteus/public-api.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));
const OUT_DIR = join(root, "public/api/proteus/v1");
const stable = (obj) => JSON.stringify(obj, null, 2) + "\n";

const pkg = read("package.json");
const repositoryVersion = pkg.version;

const catalog = read("public/data/proteus-catalog-public.json");
const knowledge = read("public/data/proteus-knowledge-public.json");

// Fontes cruas por coleção (snapshots públicos). Se uma chave não existir, coleção vazia.
const RAW = {
  works: catalog.works || [],
  authors: catalog.authors || [],
  assertions: knowledge.assertions || [],
  entities: knowledge.entities || [],
  relations: knowledge.relations || []
};

mkdirSync(OUT_DIR, { recursive: true });

const counts = {};
for (const type of COLLECTIONS) {
  const raw = RAW[type];
  // Gate fail-closed reforçado: qualquer item que passe a elegibilidade TEM de ter apiExposure "allow".
  for (const item of raw) {
    if (isApiEligible(item) && apiExposureDecision(item) !== "allow") {
      throw new Error(`10D build: registo elegível sem permissão API 'allow' explícita na coleção '${type}'. Build bloqueado (fail-closed).`);
    }
  }
  const envelope = buildCollection(type, raw, { repositoryVersion });
  counts[type] = envelope.pagination.total;
  writeFileSync(join(OUT_DIR, `${type}.json`), stable(envelope));
}

const index = buildIndex(counts, { repositoryVersion });
writeFileSync(join(OUT_DIR, "index.json"), stable(index));

const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(`10D API pública gerada em public/api/proteus/v1/ (repositoryVersion ${repositoryVersion}). Contagens: ${COLLECTIONS.map((c) => `${c}=${counts[c]}`).join(", ")}. Total elegível=${total}.`);
if (total !== 0) {
  console.log("Nota: total elegível > 0 significa que algum registo carrega apiExposure 'allow' comprovado. Na base 10D esperada, o total deve ser 0.");
}
