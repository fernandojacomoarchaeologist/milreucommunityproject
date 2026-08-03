/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10A — validador da fundação documental da Experiência Proteus. Verifica:
 * versão; contratos (direitos multidimensionais com negação por defeito; classes
 * epistémicas; resposta pública com fontes/estados; recurso externo com fornecedor e
 * direitos; contrato MCP futuro NÃO implementado); apresentação pública honesta (tudo
 * "em preparação", sem função disponível); AUSÊNCIA de MCP/API/chat/ingestão/embeddings/
 * PDFs/segredos introduzidos; zero módulos/permissões/migrations; preservação de 09D/09E/09F.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`10A: ${m}`); };
const EXPECTED = "0.36.0";

// 1) Versão + readiness
const pkg = read("package.json");
if (pkg.version !== EXPECTED) fail(`package.json deve estar em ${EXPECTED} (está ${pkg.version}).`);
const readiness = read("contracts/10a/package-10a-readiness.json");
if (readiness.implementsMcp !== false || readiness.implementsApi !== false || readiness.implementsChat !== false) fail("readiness: 10A não implementa MCP/API/chat.");
if (readiness.newMigrationsExpected !== 0 || readiness.newPermissionsExpected !== 0) fail("readiness: 0 migrations/permissões.");
if (readiness.productionActivation !== false) fail("readiness: produção bloqueada.");

// 2) Contrato de direitos — multidimensional, negação por defeito
const rights = read("contracts/10a/rights-access-policy.json");
if (rights.default !== "deny") fail("rights: default deve ser 'deny'.");
if (rights.publicEligibility?.unknownBehavesAs !== "denied") fail("rights: 'unknown' comporta-se como 'denied'.");
for (const dim of ["store_file", "extract_ocr", "create_embeddings", "publish_summary", "publish_fulltext", "redistribute", "expose_api_mcp", "model_training"]) {
  if (!rights.dimensions.includes(dim)) fail(`rights: dimensão em falta: ${dim}.`);
}

// 3) Classes epistémicas
const ka = read("contracts/10a/knowledge-assertion.schema.json");
const classes = ka.properties?.classification?.enum || [];
for (const c of ["facto_documentado", "interpretacao", "hipotese", "memoria_testemunho", "inferencia_proteus", "desconhecido"]) {
  if (!classes.includes(c)) fail(`knowledge-assertion: classe em falta: ${c}.`);
}

// 4) Resposta pública futura — estados honestos
const pa = read("contracts/10a/public-answer.schema.json");
const statuses = pa.properties?.status?.enum || [];
for (const s of ["answered", "limited", "insufficient_evidence", "rights_restricted", "out_of_scope"]) {
  if (!statuses.includes(s)) fail(`public-answer: estado em falta: ${s}.`);
}

// 5) Recurso externo — fornecedor + direitos separados
const er = read("contracts/10a/external-resource.schema.json");
for (const f of ["provider", "rightsStatus", "publicUrl"]) if (!er.required.includes(f)) fail(`external-resource: campo obrigatório em falta: ${f}.`);

// 6) Contrato MCP futuro — não implementado, sem acesso direto
const mcp = read("contracts/10a/future-mcp-contract.json");
if (mcp.contractStatus !== "future-not-implemented") fail("mcp: deve estar 'future-not-implemented'.");
if (mcp.directDatabaseAccess !== false || mcp.restrictedDocumentAccess !== false) fail("mcp: sem acesso direto a BD nem a documentos restritos.");

// 7) Apresentação pública honesta
const ov = read("public/data/proteus-overview.json");
if (ov.futureExperiences.some((x) => x.status !== "em-preparacao")) fail("overview: todas as experiências devem estar 'em-preparacao'.");
if (ov.externalResources.length !== 0) fail("overview: sem recursos externos catalogados nesta fase (URL/direitos são decisão humana).");
if (ov.futureMcp.status !== "future-not-implemented") fail("overview: MCP não implementado.");
if (ov.rights.default !== "deny") fail("overview: direitos por omissão devem negar.");
if (ov.knowledgeClasses.length !== 6) fail("overview: 6 classes de conhecimento.");
if (!ov.availabilityNotice || !/nenhuma consulta.*api.*chat/i.test(ov.availabilityNotice)) fail("overview: deve declarar que nada está disponível ainda.");
// A vista não pode prometer funções inexistentes.
const portal = text("src/views/portal.js");
if (!/Em preparação/.test(portal)) fail("knowledgeView: experiências futuras devem estar assinaladas como em preparação.");
if (/<(input|textarea)[^>]*data-proteus|Pergunte já|Consultar agora|chat/i.test(portal)) fail("knowledgeView: não pode simular chat/consulta disponível.");

// 8) Sem MCP/API/chat/ingestão/embeddings introduzidos por 10A (scan das áreas novas)
const scanDirs = ["docs/proteus/10a", "contracts/10a"];
for (const d of scanDirs) {
  for (const f of walk(d)) {
    if (/\.pdf$/i.test(f)) fail(`conteúdo proibido: PDF introduzido (${f}).`);
    const t = text(f);
    if (/\[\s*-?0?\.\d{3,}(\s*,\s*-?0?\.\d{3,}){8,}/.test(t)) fail(`conteúdo proibido: possível vetor de embedding (${f}).`);
    if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|service_role|sk-[A-Za-z0-9]{20,}/.test(t)) fail(`segredo detetado (${f}).`);
  }
}
// Nenhum servidor MCP / endpoint real
if (existsSync("mcp-server") || readdirSync("scripts").includes("mcp")) fail("não deve existir servidor MCP.");

// 9) Preservação: 26/152, 0 novas migrations, 09D/09E/09F intactos
if (read("public/data/collaborative-modules.json").modules.length !== 26) fail("módulos devem permanecer 26.");
if (read("public/data/collaborative-roles-permissions.json").permissions.length !== 152) fail("permissões devem permanecer 152.");
if (readdirSync("supabase/migrations").filter((f) => /20261[0-2]|202609/.test(f)).length) fail("10A não deve adicionar migrations.");
if (!existsSync("public/data/locale-availability.json")) fail("09D removido.");
if (!existsSync("public/config/seo.runtime.json")) fail("09F removido.");
if (!/museum-opening__image"[\s\S]{0,240}fetchpriority="high"/.test(text("src/views/museum.js"))) fail("09E (LCP) removido.");
for (const r of ["collab-opportunities", "collab-operations-governance"]) if (!new RegExp(`case "${r}":`).test(text("src/main.js"))) fail(`09C.1: rota ${r} removida.`);

console.log("Pacote 10A validado: fundação documental do Proteus, direitos multidimensionais com negação por defeito, classes epistémicas e contrato de resposta, recursos institucionais sem apropriação, MCP futuro não implementado, apresentação pública honesta (tudo em preparação), sem MCP/API/chat/ingestão/PDF/embeddings/segredos, 26/152, 0 migrations, 09D/09E/09F preservados.");

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${name.name}`;
    if (name.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
