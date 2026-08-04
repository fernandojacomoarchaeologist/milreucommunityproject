/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10C — validador do modelo de conhecimento do Proteus. Verifica: versão + readiness
 * (sem afirmações reais/ingestão/OCR/embeddings/RAG/chat/API/MCP/papéis/publicação automática);
 * contratos (afirmação/evidência/entidade/relação/revisão/CIDOC) com campos e enums; o núcleo
 * PURO impõe as regras (sem-evidência→insufficient; publicação exige aprovação+evidência+revisão+
 * direitos; confiança nunca é percentagem; ciclos de substituição detetados); snapshot público
 * só 'published' e honestamente vazio; crosswalk CIDOC 'draft' validado (camada separada, não
 * certificada); rotas ligadas; SEM PDF/OCR/embeddings/RAG/API/MCP/segredos; 26/152, 0 migrations;
 * e preservação de 09D/09E/09F/10A/10B/10B.1.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { validateAssertion, canPublishAssertion, confidenceErrors, detectSupersedeCycles, derivePublicKnowledge } from "../../src/proteus/knowledge-model.mjs";
import { validateCidocMapping, exportCidocMappings } from "../../src/proteus/cidoc-mapping.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`10C: ${m}`); };
const EXPECTED = "0.38.0";

// 1) Versão + readiness
const pkg = read("package.json");
if (pkg.version !== EXPECTED) fail(`package.json deve estar em ${EXPECTED} (está ${pkg.version}).`);
const readiness = read("contracts/10c/package-10c-readiness.json");
for (const [k, v] of Object.entries(readiness.boundaries)) if (v !== false) fail(`readiness.boundaries.${k} deve ser false.`);
if (readiness.delivery.automaticMerge !== false) fail("readiness: sem merge automático.");
if (readiness.delivery.targetVersion !== EXPECTED || readiness.delivery.targetCurrentPackage !== "10C") fail("readiness: alvo deve ser 0.38.0 / 10C.");

// 2) Contratos com campos obrigatórios
const req = (p) => read(p).required || [];
for (const f of ["id", "text", "language", "epistemicClass", "status", "evidenceIds", "entityIds", "confidence"]) if (!req("contracts/10c/assertion.schema.json").includes(f)) fail(`assertion.schema sem campo: ${f}.`);
for (const f of ["id", "sourceId", "locatorType", "accessedAt"]) if (!req("contracts/10c/evidence-locator.schema.json").includes(f)) fail(`evidence-locator.schema sem campo: ${f}.`);
for (const f of ["id", "type", "preferredLabel", "status"]) if (!req("contracts/10c/knowledge-entity.schema.json").includes(f)) fail(`knowledge-entity.schema sem campo: ${f}.`);
for (const f of ["sourceAssertionId", "targetAssertionId", "relationType", "justification"]) if (!req("contracts/10c/assertion-relation.schema.json").includes(f)) fail(`assertion-relation.schema sem campo: ${f}.`);
for (const f of ["assertionId", "reviewerId", "decision", "checks"]) if (!req("contracts/10c/editorial-review.schema.json").includes(f)) fail(`editorial-review.schema sem campo: ${f}.`);
for (const f of ["localTerm", "cidocUri", "crmVersion", "mappingRelation", "justification", "status"]) if (!req("contracts/10c/cidoc-mapping.schema.json").includes(f)) fail(`cidoc-mapping.schema sem campo: ${f}.`);

// 3) Núcleo PURO impõe as regras epistémicas e de publicação
const noEvidence = { id: "a", text: "x", language: "pt-PT", epistemicClass: "hypothesis", status: "draft", evidenceIds: [], entityIds: [], confidence: { level: "supported", reasons: ["r"] }, proposedBy: "p", createdAt: "2026-08-04T00:00:00Z" };
if (validateAssertion(noEvidence).valid) fail("afirmação sem evidência não pode superar 'insufficient'.");
if (confidenceErrors({ level: "supported", reasons: ["r"], percentage: 90 }).length === 0) fail("confiança com percentagem deve ser rejeitada.");
if (confidenceErrors({ level: "supported", reasons: ["82% de verdade"] }).length === 0) fail("confiança textual em percentagem de verdade deve ser rejeitada.");
const pub = canPublishAssertion({ status: "approved" }, { evidence: [], review: null, rightsCompatible: false });
if (pub.allowed) fail("publicação sem evidência/revisão/direitos deve ser negada.");
const cycles = detectSupersedeCycles([{ relationType: "supersedes", sourceAssertionId: "a", targetAssertionId: "b" }, { relationType: "supersedes", sourceAssertionId: "b", targetAssertionId: "a" }]);
if (cycles.length === 0) fail("ciclo de substituição deve ser detetado.");

// 4) Snapshot público: só 'published', honestamente vazio, sem confiança percentual
const snap = read("public/data/proteus-knowledge-public.json");
for (const key of ["assertions", "entities", "relations"]) if (!Array.isArray(snap[key])) fail(`snapshot sem array ${key}.`);
if (!snap.notice || !snap.generatedBy) fail("snapshot deve declarar notice e origem derivada.");
for (const a of snap.assertions) {
  if (a.status !== "published") fail(`afirmação ${a.id} não 'published' no snapshot público.`);
  if (a.confidence) confidenceErrors(a.confidence).forEach((e) => fail(`afirmação ${a.id}: ${e}`));
}
for (const e of snap.entities) if (e.status !== "published") fail(`entidade ${e.id} não 'published' no snapshot.`);
for (const r of snap.relations) if (r.status !== "approved") fail(`relação ${r.id} não 'approved' no snapshot.`);
// Consistência da derivação: o snapshot é ponto-fixo da função de derivação.
const derived = derivePublicKnowledge(snap);
if (derived.assertions.length !== snap.assertions.length || derived.entities.length !== snap.entities.length) fail("snapshot não é consistente com a derivação pública.");
if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|"fullText"|"ocr"|"bodyText"/.test(JSON.stringify(snap))) fail("snapshot não pode alojar texto integral/OCR.");

// 5) Crosswalk CIDOC: separado, 'draft', validado; sem 'approved' sem revisor
const crosswalk = read("data/proteus/cidoc-mappings.json");
if (!Array.isArray(crosswalk.mappings) || crosswalk.mappings.length === 0) fail("crosswalk CIDOC vazio.");
for (const m of crosswalk.mappings) {
  const r = validateCidocMapping(m);
  if (!r.valid) fail(`mapeamento CIDOC inválido (${m.id}): ${r.errors.join("; ")}`);
  if (m.status === "approved" && !m.reviewedBy) fail(`mapeamento ${m.id} 'approved' exige revisor.`);
}
exportCidocMappings(crosswalk.mappings); // lança se inválido
if (existsSync("public/data/cidoc-mappings.json")) fail("crosswalk editorial não pode ser servido em public/.");

// 6) Rotas ligadas
const router = text("src/lib/router.js");
for (const r of ["proteus-knowledge", "proteus-assertion", "proteus-entity"]) if (!new RegExp(`name:"${r}"`).test(router)) fail(`rota ${r} ausente do router.`);
const main = text("src/main.js");
for (const r of ["proteus-knowledge", "proteus-assertion", "proteus-entity"]) if (!new RegExp(`case "${r}":`).test(main)) fail(`rota ${r} não despachada no render.`);
const view = text("src/views/proteus-knowledge.js");
if (!/status === "published"|isPublished/.test(view)) fail("a base de conhecimento só pode mostrar publicados.");
if (/"@type":"(Claim|CreativeWork|Statement)"/.test(view) && snap.assertions.length === 0) fail("JSON-LD não deve existir sem afirmações publicadas.");

// 7) Sem PDF/OCR/embeddings/RAG/chat/API/MCP/segredos nas áreas novas.
// Nota: os documentos (docs/) MENCIONAM legitimamente OCR/embeddings/RAG como fora de escopo;
// por isso o scan de implementação IA/OCR só corre em ficheiros de CÓDIGO. Segredos e vetores
// de embedding são procurados em todos os ficheiros.
for (const d of ["src/proteus", "contracts/10c", "docs/proteus/10c", "data/proteus", "scripts/10c"]) {
  for (const f of walk(d)) {
    if (/\.(pdf|docx|doc|odt)$/i.test(f)) fail(`ficheiro de documento proibido (${f}).`);
    if (f.endsWith("scripts/10c/validate-10c.mjs")) continue; // contém os próprios padrões de deteção
    const t = text(f);
    if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|service_role|sk-[A-Za-z0-9]{20,}/.test(t)) fail(`segredo detetado (${f}).`);
    if (/\[\s*-?0?\.\d{3,}(\s*,\s*-?0?\.\d{3,}){8,}/.test(t)) fail(`possível vetor de embedding (${f}).`);
    if (/\.(mjs|js)$/.test(f) && /createEmbedding|vectorStore|OpenAI|langchain|chat\.?completion|ragPipeline|ocr_text|extracted_text/i.test(t)) fail(`implementação de IA/OCR/RAG proibida (${f}).`);
  }
}

// 8) Zero novos módulos/permissões/migrations
if (read("public/data/collaborative-modules.json").modules.length !== 26) fail("módulos devem permanecer 26.");
if (read("public/data/collaborative-roles-permissions.json").permissions.length !== 152) fail("permissões devem permanecer 152.");
const migrations = readdirSync("supabase/migrations");
if (migrations.length !== 42) fail(`10C não deve adicionar migrations (esperadas 42, há ${migrations.length}).`);
if (migrations.some((f) => /2026072[7-9]|20260[89]|20261[0-2]|20270/.test(f))) fail("10C não deve adicionar migration de data nova.");

// 9) Preservação 09D/09E/09F/10A/10B/10B.1
if (!existsSync("public/data/locale-availability.json")) fail("09D removido.");
if (!existsSync("public/config/seo.runtime.json")) fail("09F removido.");
if (!existsSync("public/data/proteus-overview.json")) fail("10A removido.");
if (!existsSync("public/data/proteus-catalog-public.json")) fail("10B removido.");
if (!existsSync("data/proteus/pilot-records.json")) fail("10B.1 removido.");
if (!/case "proteus-library":/.test(main)) fail("10B (Biblioteca) removido do render.");

console.log("Pacote 10C validado: contratos de afirmação/evidência/entidade/relação/revisão/CIDOC; núcleo puro impõe sem-evidência→insufficient, publicação com evidência+revisão+direitos, confiança não-probabilística e deteção de ciclos; snapshot público só 'published' e vazio honesto; crosswalk CIDOC 'draft' validado (camada separada, não certificada); rotas ligadas; sem PDF/OCR/embeddings/RAG/API/MCP/segredos; 26/152, 42 migrations (0 novas); 09D/09E/09F/10A/10B/10B.1 preservados.");

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
