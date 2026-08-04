/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10B.1 — validador do piloto catalográfico controlado. Verifica os dados editoriais
 * repo-internos (data/proteus/) e o snapshot público derivado, garantindo: 6 registos + 4
 * agentes com IDs únicos; texto integral NUNCA alojado e processamento NUNCA permitido nesta
 * fase; exatamente 1 acesso aberto comprovado, que tem de ser o RUN; o capítulo Teichner 2006
 * permanece com licença "unknown" (ResearchGate ≠ acesso aberto); exatamente 2 registos
 * privados (manuscrito e Anexo A), que NÃO entram no snapshot público; o derivador é fiel
 * (só public_metadata=true; Jácomo, com public_profile=false, nunca é autor público); e
 * AUSÊNCIA de PDF/DOCX/OCR/texto extraído/embeddings/RAG/chat/API/MCP/segredos e dos nomes de
 * ficheiro fornecidos. Não há afirmações históricas nem resumos gerados nesta fase.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`10B.1: ${m}`); };
const EXPECTED = "0.38.0";

// 0) Versão
const pkg = read("package.json");
if (pkg.version !== EXPECTED) fail(`package.json deve estar em ${EXPECTED} (está ${pkg.version}).`);

// 1) Dados editoriais repo-internos presentes (NÃO servidos)
const recFile = "data/proteus/pilot-records.json";
const agFile = "data/proteus/pilot-agents.json";
if (!existsSync(recFile) || !existsSync(agFile)) fail("dados editoriais do piloto ausentes em data/proteus/.");
if (existsSync("public/data/pilot-records.json") || existsSync("public/data/pilot-agents.json")) fail("dados editoriais do piloto não podem ser servidos em public/.");
const records = read(recFile).records;
const agents = read(agFile).agents;

// 2) Cardinalidade e IDs únicos
if (records.length !== 6) fail(`esperados 6 registos (há ${records.length}).`);
if (agents.length !== 4) fail(`esperados 4 agentes (há ${agents.length}).`);
const rid = new Set(records.map((r) => r.id));
if (rid.size !== records.length) fail("IDs de registo duplicados.");
const aid = new Set(agents.map((a) => a.id));
if (aid.size !== agents.length) fail("IDs de agente duplicados.");

// 3) Contrato mínimo por registo + invariantes de fase
const recReq = read("contracts/10b1/pilot-record.schema.json").required;
for (const r of records) {
  for (const f of recReq) if (!(f in r)) fail(`registo ${r.id} sem campo obrigatório: ${f}.`);
  if (r.full_text_hosted !== false) fail(`registo ${r.id}: full_text_hosted tem de ser false.`);
  if (r.processing_allowed_in_10b1 !== false) fail(`registo ${r.id}: processing_allowed_in_10b1 tem de ser false.`);
  if (!Array.isArray(r.provenance) || r.provenance.length === 0) fail(`registo ${r.id} sem proveniência.`);
  if (!r.verified_at) fail(`registo ${r.id} sem verified_at.`);
}

// 4) Acesso aberto: exatamente 1, e tem de ser o RUN (repositório institucional)
const open = records.filter((r) => r.access_status === "open");
if (open.length !== 1) fail(`esperado exatamente 1 registo de acesso aberto (há ${open.length}).`);
if (!/run\.unl\.pt/.test(`${open[0].external_full_text_url || ""} ${open[0].source_record_url || ""}`)) fail("o único acesso aberto tem de ser o artigo do RUN (run.unl.pt).");

// 5) Teichner 2006: disponibilidade externa NÃO é licença aberta
const teichner = records.find((r) => /teichner-2006/.test(r.id));
if (!teichner) fail("registo Teichner 2006 ausente.");
if (teichner.access_status === "open") fail("Teichner 2006 não pode ser 'open' (ResearchGate ≠ acesso aberto).");
if (teichner.reuse_license_label !== "unknown") fail("Teichner 2006 tem de manter licença 'unknown'.");

// 6) Privados: exatamente 2 (manuscrito + Anexo A), ambos fora do snapshot público
const priv = records.filter((r) => r.public_metadata === false);
if (priv.length !== 2) fail(`esperados exatamente 2 registos privados (há ${priv.length}).`);
if (!priv.every((r) => r.access_status === "private_project_document")) fail("registos privados devem ser private_project_document.");

// 7) Snapshot público derivado é fiel
const cat = read("public/data/proteus-catalog-public.json");
if (!cat.generatedBy || !/build-public-catalog/.test(cat.generatedBy)) fail("o snapshot deve declarar a origem derivada.");
const publicWorkRecords = records.filter((r) => r.record_type !== "institutional_dynamic_page" && r.public_metadata === true);
if (cat.works.length !== publicWorkRecords.length) fail(`snapshot deve ter ${publicWorkRecords.length} obras (tem ${cat.works.length}).`);
if (cat.works.length !== 3) fail("esperadas 3 obras públicas no snapshot.");
const catSlugs = new Set(cat.works.map((w) => w.slug));
for (const p of priv) if ([...catSlugs].some((s) => p.id.includes(s))) fail(`registo privado (${p.id}) presente no snapshot.`);
// Jácomo (public_profile=false) nunca é autor público
if (/Jácomo|Jacomo/i.test(JSON.stringify(cat.authors))) fail("Jácomo (public_profile=false) não pode ser autor público.");
const expectedAuthors = agents.filter((a) => a.type === "person" && a.public_profile === true && cat.works.some((w) => (w.authors || []).some((x) => x.slug === a.id.replace(/^person-/, "")))).length;
if (cat.authors.length !== expectedAuthors || cat.authors.length !== 2) fail(`esperados 2 autores públicos (tem ${cat.authors.length}).`);
if (!Array.isArray(cat.externalResources) || cat.externalResources.length !== 1) fail("esperado exatamente 1 recurso institucional (bilheteira).");
const res = cat.externalResources[0];
if (!res.lastVerified || !res.stalenessNotice) fail("o recurso dinâmico deve declarar verificação e aviso de atualidade.");
// Entradas públicas conformes ao contrato mínimo + ligação legal só p/ aberto
const entReq = read("contracts/10b1/public-entry.schema.json").required;
for (const w of cat.works) {
  for (const f of entReq) if (!(f in w)) fail(`entrada pública ${w.slug} sem campo: ${f}.`);
  if (w.editorialStatus !== "published") fail(`entrada ${w.slug} não publicada.`);
  if (w.openAccess && w.accessStatus !== "open") fail(`entrada ${w.slug}: openAccess sem accessStatus open.`);
  if (!w.openAccess && w.accessStatus === "open") fail(`entrada ${w.slug}: accessStatus open sem openAccess.`);
}
if (cat.works.filter((w) => w.openAccess).length !== 1) fail("o snapshot deve ter exatamente 1 obra de acesso aberto.");

// 8) Sem PDF/DOCX/OCR/texto extraído/embeddings/segredos e sem nomes de ficheiro fornecidos.
// Nota: o TÍTULO editorial do Anexo A ("Anexo A - Relatórios...") é metadado legítimo de um
// registo privado (fora do snapshot); o proibido é publicar os NOMES DE FICHEIRO fornecidos —
// tokens com extensão ou o artefacto "content (N)".
const FORBIDDEN_FILENAMES = /content\s*\(\d+\)|\.(docx|doc|odt|pdf)\b/i;
for (const f of walk("data/proteus").concat(walk("docs/proteus/10b1"), walk("contracts/10b1"), walk("scripts/10b1"))) {
  if (/\.(pdf|docx|doc|odt)$/i.test(f)) fail(`ficheiro de documento proibido introduzido (${f}).`);
  // O próprio validador contém, por natureza, os padrões de deteção (sk-…, ocr_text, etc.);
  // não o varremos contra si mesmo para evitar falsos positivos.
  if (f.endsWith("scripts/10b1/validate-10b1.mjs")) continue;
  const t = text(f);
  if (FORBIDDEN_FILENAMES.test(t)) fail(`nome de ficheiro fornecido não pode ser publicado (${f}).`);
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|service_role|sk-[A-Za-z0-9]{20,}/.test(t)) fail(`segredo detetado (${f}).`);
  if (/\bocr_text\b|\bextracted_text\b|\bfull_text\b\s*:\s*"/.test(t)) fail(`texto extraído/OCR não pode existir (${f}).`);
  if (/\[\s*-?0?\.\d{3,}(\s*,\s*-?0?\.\d{3,}){8,}/.test(t)) fail(`possível vetor de embedding (${f}).`);
}
if (existsSync("data/proteus/source-manifest.json")) fail("source-manifest.json (com nomes de ficheiro fornecidos) não pode ser committado.");

// 9) Sem processamento/IA/API/MCP nesta fase
const build = text("scripts/10b1/build-public-catalog.mjs");
if (/createEmbedding|vectorStore|OpenAI|langchain|chat.?completion|\bRAG\b|mcp/i.test(build)) fail("o derivador não pode conter IA/RAG/MCP.");

console.log(`Pacote 10B.1 validado: 6 registos + 4 agentes (IDs únicos); texto integral nunca alojado e processamento negado; 1 acesso aberto (RUN); Teichner 2006 permanece 'unknown'; 2 privados fora do snapshot; derivado fiel (3 obras, 2 autores públicos sem Jácomo, 1 recurso dinâmico com verificação); sem PDF/DOCX/OCR/embeddings/segredos nem nomes de ficheiro fornecidos.`);

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
