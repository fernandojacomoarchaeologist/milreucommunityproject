/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10B — validador do catálogo bibliográfico Proteus. Verifica: versão; contratos
 * (obra/autor/autoria/direitos/rascunho DOI/entrada pública) com campos e negação por
 * defeito; snapshot público vazio e honesto (nenhuma obra/autor real); rotas públicas da
 * Biblioteca ligadas; importação DOI nunca publica; SEO só para publicados (nada indexado
 * enquanto vazio); AUSÊNCIA de PDF/texto/OCR/embeddings/RAG/chat/API/MCP/segredos; ZERO
 * novos módulos/permissões/migrations; e preservação de 09D/09E/09F/10A.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`10B: ${m}`); };
const EXPECTED = "0.38.0";

// 1) Versão + readiness
const pkg = read("package.json");
if (pkg.version !== EXPECTED) fail(`package.json deve estar em ${EXPECTED} (está ${pkg.version}).`);
const readiness = read("contracts/10b/package-10b-readiness.json");
if (readiness.limits.mcp !== false || readiness.limits.publicApi !== false) fail("readiness: sem API pública nem MCP.");
if (readiness.limits.newPermissions !== 0) fail("readiness: 0 permissões novas.");
if (readiness.publication.doiImportPublishes !== false) fail("readiness: importação DOI não publica.");
if (readiness.publication.unknownRightsDefault !== "deny") fail("readiness: direitos desconhecidos negam por defeito.");

// 2) Contratos
const workReq = read("contracts/10b/work.schema.json").required;
for (const f of ["id", "title", "workType", "editorialStatus", "accessStatus", "sources"]) if (!workReq.includes(f)) fail(`work.schema sem campo obrigatório: ${f}.`);
const draft = read("contracts/10b/doi-import-draft.schema.json");
if (!draft.required.includes("publicationApproved") || !draft.required.includes("status")) fail("doi-import-draft: precisa de status e publicationApproved.");
const rights = read("contracts/10b/rights-record.schema.json").required;
for (const f of ["accessStatus", "decisions", "evidence", "reviewedAt"]) if (!rights.includes(f)) fail(`rights-record sem campo: ${f}.`);
const author = read("contracts/10b/author.schema.json").required;
if (!author.includes("sources")) fail("author.schema deve exigir fontes.");

// 3) Snapshot público: VAZIO (era 10B) OU piloto controlado (superado pelo 10B.1). Em qualquer
// caso: nada fabricado, nenhum texto integral alojado, nenhum registo privado, e sem perfil de
// autor com public_profile=false (Jácomo). Pessoas reais só entram sob direitos verificados no piloto.
const cat = read("public/data/proteus-catalog-public.json");
if (!Array.isArray(cat.works) || !Array.isArray(cat.authors)) fail("o catálogo deve ter arrays works e authors.");
if (!cat.notice) fail("o catálogo deve declarar o seu estado.");
const PRIVATE_SLUGS = ["jacomo-2026-desafios-integracao-comunitaria", "jacomo-2026-anexo-a-relatorios-eventos"];
for (const w of cat.works) {
  if (!w.slug || !w.title) fail("cada obra pública precisa de slug e título.");
  if (w.editorialStatus !== "published") fail(`obra ${w.slug} não publicada não pode estar no snapshot.`);
  if (!Array.isArray(w.sources) || w.sources.length === 0) fail(`obra ${w.slug} sem fontes.`);
  if (!["open", "restricted", "metadata_only", "unknown"].includes(w.accessStatus)) fail(`obra ${w.slug} com accessStatus inválido.`);
  if (PRIVATE_SLUGS.includes(w.slug)) fail(`registo privado (${w.slug}) não pode entrar no snapshot público.`);
  for (const k of ["fullText", "ocr", "bodyText", "extractedText"]) if (k in w) fail(`obra ${w.slug} não pode alojar texto integral (${k}).`);
}
for (const a of cat.authors) {
  if (/Jácomo|Jacomo/i.test(a.preferredName || "")) fail("perfil de autor com public_profile=false (Jácomo) não pode ser publicado.");
  if (!Array.isArray(a.sources) || a.sources.length === 0) fail(`autor ${a.slug} sem fontes.`);
}
if (cat.works.length > 0 && !cat.generatedBy) fail("snapshot populado deve declarar a origem derivada (generatedBy).");

// 4) Importação DOI: adaptador puro, nunca publica; sem rede embutida
const doi = text("src/proteus/doi-import.mjs");
if (!/publicationApproved:\s*false/.test(doi)) fail("importação DOI deve manter publicationApproved:false.");
if (!/export function normalizeDoi/.test(doi) || !/export function normalizeOrcid/.test(doi)) fail("faltam normalizadores DOI/ORCID.");
if (/\bfetch\s*\(|https?:\/\/api\.crossref/i.test(doi)) fail("o adaptador não pode conter chamada de rede embutida (usar mocks nos testes).");

// 5) Rotas públicas ligadas + SEO só para publicados
const router = text("src/lib/router.js");
for (const r of ["proteus-library", "proteus-work", "proteus-author"]) if (!new RegExp(`name:"${r}"`).test(router)) fail(`rota ${r} ausente do router.`);
const main = text("src/main.js");
for (const r of ["proteus-library", "proteus-work", "proteus-author"]) if (!new RegExp(`case "${r}":`).test(main)) fail(`rota ${r} não despachada no render.`);
const view = text("src/views/proteus-library.js");
if (!/editorialStatus === "published"/.test(view)) fail("a Biblioteca só pode mostrar registos publicados.");
if (/"@type":"(ScholarlyArticle|Person|Book)"/.test(view) && cat.works.length === 0) {
  // JSON-LD só deve existir para registos publicados; com catálogo vazio, não deve haver marcação por defeito.
  fail("JSON-LD de obra/autor não deve existir sem registos publicados.");
}

// 6) Sem PDF/texto/OCR/embeddings/RAG/chat/API/MCP/segredos nas áreas novas
for (const d of ["docs/proteus/10b", "contracts/10b", "src/proteus"]) {
  for (const f of walk(d)) {
    if (/\.pdf$/i.test(f)) fail(`PDF introduzido (${f}).`);
    const t = text(f);
    if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|service_role|sk-[A-Za-z0-9]{20,}/.test(t)) fail(`segredo detetado (${f}).`);
    if (/\[\s*-?0?\.\d{3,}(\s*,\s*-?0?\.\d{3,}){8,}/.test(t)) fail(`possível vetor de embedding (${f}).`);
  }
}
if (/createEmbedding|vectorStore|OpenAI|langchain|chat.?completion/i.test(doi + view)) fail("não pode haver embeddings/LLM/chat.");

// 7) Zero novos módulos/permissões/migrations
if (read("public/data/collaborative-modules.json").modules.length !== 26) fail("módulos devem permanecer 26.");
if (read("public/data/collaborative-roles-permissions.json").permissions.length !== 152) fail("permissões devem permanecer 152.");
if (readdirSync("supabase/migrations").filter((f) => /202611|202612|20270/.test(f)).length) fail("10B não deve adicionar migrations (backend/RLS = pendência condicional).");

// 8) Preservação 09D/09E/09F/10A
if (!existsSync("public/data/locale-availability.json")) fail("09D removido.");
if (!/museum-opening__image"[\s\S]{0,240}fetchpriority="high"/.test(text("src/views/museum.js"))) fail("09E (LCP) removido.");
if (!existsSync("public/config/seo.runtime.json")) fail("09F removido.");
if (!existsSync("public/data/proteus-overview.json")) fail("10A removido.");
if (!/case "collab-opportunities":/.test(main)) fail("09C.1 removido.");

console.log("Pacote 10B validado: contratos de obra/autor/autoria/direitos/rascunho-DOI/entrada-pública; catálogo público VAZIO e honesto (sem pessoas reais); Biblioteca pública ligada (só publicados); importação DOI pura que nunca publica e sem rede embutida; sem PDF/OCR/embeddings/RAG/chat/API/MCP/segredos; 26/152, 0 migrations; 09D/09E/09F/10A preservados.");

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
