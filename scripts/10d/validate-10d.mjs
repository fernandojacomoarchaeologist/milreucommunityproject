/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10D — validador da Biblioteca amadurecida e API pública estática (somente leitura).
 * Verifica: coerência de versão (sem pinar número — o bump 0.39.0/10D fica para o fecho);
 * contratos presentes e com campos exigidos; os seis exports v1 válidos, VAZIOS e deterministas
 * (regeneração em memória byte-idêntica ao ficheiro); envelope uniforme e direitos default deny;
 * núcleo puro fail-closed (published+fonte+revisão+apiExposure allow; deny/unknown/in_review
 * excluídos e não revelados); rota /conhecimento/api ligada no router e no render; Biblioteca
 * humana preservada (3/2/1) e snapshot de conhecimento 0/0/0 com 16 afirmações in_review; campo
 * legado package.json.currentPackage classificado sem correção; sem migrations/papéis/dependências;
 * sem PDF/OCR/embeddings/RAG/chat/MCP/segredos; predecessores 09/10 preservados.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import {
  buildCollection, buildIndex, isApiEligible, apiExposureDecision, COLLECTIONS, CONTRACT_VERSION, API_VERSION
} from "../../src/proteus/public-api.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const stable = (obj) => JSON.stringify(obj, null, 2) + "\n";
const fail = (m) => { throw new Error(`10D: ${m}`); };

// 0) Coerência de versão (version-agnostic: o bump 0.39.0/10D é o PR de fecho separado).
const pkg = read("package.json");
const registry = read("public/data/package-impact-registry.json");
if (pkg.version !== registry.version) fail(`package.json (${pkg.version}) e registo de impacto (${registry.version}) divergem.`);

// 0.1) Campo legado package.json.currentPackage: classificado, NÃO corrigido neste PR funcional.
if (!registry.currentPackage) fail("registo de impacto sem currentPackage canónico.");
if (typeof pkg.currentPackage !== "string") fail("package.json.currentPackage legado deve permanecer presente (não removido).");
// O registo é a fonte canónica; o campo do package.json permanece legado e intocado.

// 1) Scripts declarados (apenas os dois autorizados) e ligados à cadeia validate.
for (const s of ["proteus:build-api", "validate:10d"]) if (!pkg.scripts[s]) fail(`script em falta: ${s}.`);
if (!pkg.scripts.validate.includes("validate-10d")) fail("validate:10d deve estar ligado ao fim da cadeia validate.");

// 2) Contratos presentes e com campos exigidos.
const need = (p) => { if (!existsSync(p)) fail(`contrato em falta: ${p}.`); return read(p); };
const idx = need("contracts/10d/public-api-index.schema.json");
const col = need("contracts/10d/public-api-collection.schema.json");
const env = need("contracts/10d/public-api-envelope.schema.json");
const readiness = need("contracts/10d/package-10d-readiness.json");
for (const f of ["contractVersion", "apiVersion", "root", "transport", "readOnly", "resources", "rights"]) if (!idx.required.includes(f)) fail(`index.schema sem required: ${f}.`);
for (const f of ["resource", "items", "pagination", "rights"]) if (!col.required.includes(f)) fail(`collection.schema sem required: ${f}.`);
if (!env.required.includes("rights")) fail("envelope.schema sem required rights.");
for (const [k, v] of Object.entries(readiness.boundaries)) if (v !== false) fail(`readiness.boundaries.${k} deve ser false.`);
if (readiness.delivery.automaticMerge !== false) fail("readiness: sem merge automático.");
// Fecho formal 10D atingido: o alvo de fecho diferido passa a coincidir com o estado canónico atual
// (D-10D-CLOSE-03). Os campos base/thisPr do PR funcional são preservados como proveniência histórica.
if (readiness.delivery.deferredClosureVersion !== pkg.version) fail("readiness: deferredClosureVersion deve igualar a versão canónica após o fecho.");
if (readiness.delivery.deferredClosureCurrentPackage !== registry.currentPackage) fail("readiness: deferredClosureCurrentPackage deve igualar o pacote canónico do registo.");
for (const c of Object.values(readiness.api.initialCounts)) if (c !== 0) fail("readiness: contagens iniciais da API devem ser 0.");

// 3) Índice + coleções: válidos, VAZIOS e deterministas (regeneração byte-idêntica).
const repositoryVersion = pkg.version;
const catalog = read("public/data/proteus-catalog-public.json");
const knowledge = read("public/data/proteus-knowledge-public.json");
const RAW = {
  works: catalog.works || [], authors: catalog.authors || [],
  assertions: knowledge.assertions || [], entities: knowledge.entities || [], relations: knowledge.relations || []
};
const counts = {};
for (const type of COLLECTIONS) {
  const path = `public/api/proteus/v1/${type}.json`;
  if (!existsSync(path)) fail(`export em falta: ${path}.`);
  const onDisk = read(path);
  if (onDisk.contractVersion !== CONTRACT_VERSION || onDisk.apiVersion !== API_VERSION) fail(`${type}: versões de contrato/api incorretas.`);
  if (onDisk.rights?.default !== "deny") fail(`${type}: direitos default devem ser deny.`);
  if (onDisk.pagination.total !== 0 || onDisk.items.length !== 0) fail(`${type}: coleção deve começar VAZIA (0 itens reais).`);
  if (onDisk.status !== "empty") fail(`${type}: status deve ser 'empty' na base atual.`);
  // determinismo: o ficheiro tem de ser exatamente a saída do gerador
  const regenerated = stable(buildCollection(type, RAW[type], { repositoryVersion }));
  if (text(path) !== regenerated) fail(`${type}: export não corresponde à regeneração determinista (drift ou edição manual).`);
  counts[type] = onDisk.pagination.total;
}
const indexPath = "public/api/proteus/v1/index.json";
const indexDisk = read(indexPath);
if (indexDisk.readOnly !== true || indexDisk.transport !== "static-json" || indexDisk.root !== "/api/proteus/v1/") fail("index: raiz/transporte/readOnly inválidos.");
if (indexDisk.resources.length !== 5) fail("index: devem existir 5 recursos.");
for (const r of indexDisk.resources) if (r.count !== 0) fail(`index: recurso ${r.resource} deve ter count 0.`);
if (text(indexPath) !== stable(buildIndex(counts, { repositoryVersion }))) fail("index: não corresponde à regeneração determinista.");

// 4) Núcleo puro fail-closed + não-revelação de excluídos.
const base = { editorialStatus: "published", apiExposure: "allow", lastReviewed: "2026-08-01", sources: [{ label: "x" }] };
if (!isApiEligible(base)) fail("núcleo: item plenamente elegível foi rejeitado.");
for (const bad of [{ apiExposure: "deny" }, { apiExposure: "unknown" }, { apiExposure: undefined }, { editorialStatus: "in_review" }, { editorialStatus: "draft" }, { sources: [] }, { lastReviewed: undefined }]) {
  if (isApiEligible({ ...base, ...bad })) fail(`núcleo: item inelegível passou (${JSON.stringify(bad)}).`);
}
const leak = buildCollection("works", [{ id: "X-SECRET", title: "T-SECRET", editorialStatus: "in_review", apiExposure: "deny", sources: [], lastReviewed: null }], { repositoryVersion });
if (JSON.stringify(leak).includes("X-SECRET") || JSON.stringify(leak).includes("T-SECRET")) fail("núcleo: item excluído não pode ser revelado.");
if (apiExposureDecision({}) !== "unknown") fail("núcleo: ausência de permissão deve resolver como unknown.");

// 5) Sem conteúdo sensível nos exports.
for (const f of ["index", ...COLLECTIONS]) {
  const blob = text(`public/api/proteus/v1/${f}.json`);
  if (/"fullText"|"ocr"|"bodyText"|-----BEGIN [A-Z ]*PRIVATE KEY-----|service_role|sk-[A-Za-z0-9]{20,}/.test(blob)) fail(`${f}.json contém conteúdo sensível.`);
}

// 6) Rota humana ligada.
const router = text("src/lib/router.js");
if (!/name:"proteus-api"/.test(router) || !/\/conhecimento\/api/.test(router)) fail("rota /conhecimento/api ausente do router.");
const main = text("src/main.js");
if (!/case "proteus-api":/.test(main)) fail("render não despacha proteus-api.");
if (!/loadProteusApiIndex\(\)/.test(main)) fail("índice da API não é carregado no arranque.");
if (!existsSync("src/views/proteus-api.js")) fail("vista src/views/proteus-api.js em falta.");
if (!/#\/conhecimento\/api/.test(text("src/views/proteus-library.js"))) fail("Biblioteca não liga à documentação da API.");

// 7) Biblioteca humana preservada e snapshot de conhecimento 0/0/0 com 16 afirmações in_review.
const works = (catalog.works || []).length, authors = (catalog.authors || []).length, resources = (catalog.externalResources || []).length;
if (works !== 3 || authors !== 2 || resources !== 1) fail(`catálogo humano alterado (esperado 3/2/1, está ${works}/${authors}/${resources}).`);
for (const k of ["assertions", "entities", "relations"]) if ((knowledge[k] || []).length !== 0) fail(`snapshot de conhecimento deve permanecer 0/0/0 (${k} não vazio).`);
const editorial = read("data/proteus/knowledge-assertions.json");
const assertions = editorial.assertions || [];
if (assertions.length !== 16) fail(`esperadas 16 afirmações no piloto (há ${assertions.length}).`);
if (assertions.some((a) => a.status !== "in_review")) fail("todas as afirmações do piloto devem permanecer in_review.");

// 8) Sem migrations/papéis/permissões novos; sem dependências novas.
const migrations = readdirSync("supabase/migrations");
if (migrations.length !== 42) fail(`10D não deve adicionar migrations (esperadas 42, há ${migrations.length}).`);
if (read("public/data/collaborative-modules.json").modules.length !== 26) fail("módulos devem permanecer 26.");
if (read("public/data/collaborative-roles-permissions.json").permissions.length !== 152) fail("permissões devem permanecer 152.");
if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) fail("10D não deve introduzir dependencies de runtime.");

// 9) Sem implementação proibida nas áreas novas (código).
for (const f of ["src/proteus/public-api.mjs", "scripts/10d/build-public-api.mjs", "scripts/10d/validate-10d.mjs", "src/views/proteus-api.js"]) {
  const t = text(f);
  if (f.endsWith("scripts/10d/validate-10d.mjs")) continue; // contém os próprios padrões de deteção
  if (/createEmbedding|vectorStore|OpenAI|langchain|chat\.?completion|ragPipeline|ocr_text|extracted_text|new MCPServer|createServer\(|express\(|supabase|fetch\(\s*['"`]https?:/i.test(t)) fail(`implementação proibida (backend/IA/MCP/rede) em ${f}.`);
}

// 10) Predecessores preservados.
for (const p of ["public/data/proteus-catalog-public.json", "public/data/proteus-knowledge-public.json", "public/data/proteus-overview.json", "scripts/10c1/validate-10c1.mjs", "scripts/10c/validate-10c.mjs", "scripts/10b/validate-10b.mjs"]) {
  if (!existsSync(p)) fail(`predecessor removido: ${p}.`);
}
if (!/case "proteus-library":/.test(main)) fail("Biblioteca (10B) removida do render.");
if (!/case "proteus-knowledge":/.test(main)) fail("Base de conhecimento (10C) removida do render.");

console.log("Pacote 10D validado: API pública v1 estática, somente leitura, uniforme e determinista; 6 exports VAZIOS (regeneração byte-idêntica); núcleo puro fail-closed sem revelar excluídos; rota /conhecimento/api ligada; Biblioteca humana 3/2/1 preservada; conhecimento 0/0/0 e 16 afirmações in_review; campo legado currentPackage classificado sem correção; 26 módulos/152 permissões/42 migrations; sem dependências/backend/IA/MCP; predecessores 09/10 preservados. Estado canónico de fecho atingido (" + pkg.version + " / " + registry.currentPackage + "); pin legado package.json.currentPackage preservado (" + pkg.currentPackage + ").");
