/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10C.1 — validador do piloto de afirmações verificáveis (dados editoriais admitidos).
 * Garante: 16 afirmações (todas `in_review`), 10 entidades (todas `draft`), 16 localizadores;
 * cada item válido contra os contratos 10C; fontes ∈ 10B.1 e fontes excluídas NÃO usadas; 15
 * localizadores do artigo com DUPLA PAGINAÇÃO no rótulo; 1 recurso institucional com URL + data
 * de consulta + aviso de volatilidade; SEM citações; fila SEM revisor/aprovação fabricados e
 * `publication_allowed=false`; CC BY 4.0 apenas na camada original + direitos de terceiros
 * preservados; o snapshot SERVIDO permanece SEM afirmações/entidades/relações em revisão; e o
 * modelo editorial é PURO (não serve, não publica). Version-agnostic: não fixa 0.38.1 (o bump
 * fica para o PR de fecho); apenas exige coerência package.json ↔ registo de impacto.
 */
import { readFileSync, existsSync } from "node:fs";
import { validateAssertion, validateEntity, validateEvidenceLocator, validateRelation, confidenceErrors } from "../../src/proteus/knowledge-model.mjs";
import { filterProposals, reviewTransition } from "../../src/proteus/knowledge-review.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`10C.1: ${m}`); };

// 0) Coerência de versão (sem pinar um número — o bump 0.38.1/10C.1 é o PR de fecho)
const pkg = read("package.json");
const registry = read("public/data/package-impact-registry.json");
if (pkg.version !== registry.version) fail(`package.json (${pkg.version}) e registo de impacto (${registry.version}) divergem.`);

// 1) Dados editoriais admitidos
for (const f of ["knowledge-assertions.json", "knowledge-evidence-locators.json", "knowledge-review-queue.json", "knowledge-source-scope.json"]) {
  if (!existsSync(`data/proteus/${f}`)) fail(`ficheiro editorial ausente: data/proteus/${f}`);
}
const A = read("data/proteus/knowledge-assertions.json");
const E = read("data/proteus/knowledge-evidence-locators.json");
const Q = read("data/proteus/knowledge-review-queue.json");
const scope = read("data/proteus/knowledge-source-scope.json");
const assertions = A.assertions || [];
const entities = A.entities || [];
const relations = A.relations || [];
const locators = E.locators || [];
const queue = Q.items || [];

// 2) Cardinalidade e estados
if (assertions.length !== 16) fail(`esperadas 16 afirmações (há ${assertions.length}).`);
if (entities.length !== 10) fail(`esperadas 10 entidades (há ${entities.length}).`);
if (locators.length !== 16) fail(`esperados 16 localizadores (há ${locators.length}).`);
if (queue.length !== 16) fail(`esperados 16 itens na fila (há ${queue.length}).`);
if (!assertions.every((a) => a.status === "in_review")) fail("todas as afirmações têm de estar `in_review`.");
if (!entities.every((e) => e.status === "draft")) fail("todas as entidades têm de estar `draft`.");
if (assertions.some((a) => a.status === "published")) fail("nenhuma afirmação pode estar `published`.");

// 3) Validade contra os contratos 10C + confiança não-probabilística
for (const a of assertions) { const r = validateAssertion(a); if (!r.valid) fail(`afirmação ${a.id}: ${r.errors.join("; ")}`); if (confidenceErrors(a.confidence).length) fail(`afirmação ${a.id}: confiança inválida`); }
for (const e of entities) { const r = validateEntity(e); if (!r.valid) fail(`entidade ${e.id}: ${r.errors.join("; ")}`); }
for (const l of locators) { const r = validateEvidenceLocator(l); if (!r.valid) fail(`localizador ${l.id}: ${r.errors.join("; ")}`); }
for (const r0 of relations) { const r = validateRelation(r0); if (!r.valid) fail(`relação ${r0.id}: ${r.errors.join("; ")}`); }

// 4) Fontes: existem no 10B.1 e as excluídas NÃO são usadas
const pilotIds = new Set(read("data/proteus/pilot-records.json").records.map((r) => r.id));
const usedSources = [...new Set(locators.map((l) => l.sourceId))];
for (const s of usedSources) if (!pilotIds.has(s)) fail(`fonte ${s} não existe no 10B.1 (não substituir por aproximação).`);
const excluded = new Set(scope.excluded || []);
for (const s of usedSources) if (excluded.has(s)) fail(`fonte excluída usada: ${s}.`);

// 5) Dupla paginação (15 do artigo) + institucional (URL + data + volatilidade)
const article = locators.filter((l) => /hauschild-2008/.test(l.sourceId));
if (article.length !== 15) fail(`esperados 15 localizadores do artigo (há ${article.length}).`);
for (const l of article) if (!(/PDF/i.test(l.label || "") && /art/i.test(l.label || ""))) fail(`localizador ${l.id} sem dupla paginação (PDF + artigo) no rótulo.`);
const inst = locators.filter((l) => /bilheteira/.test(l.sourceId));
if (inst.length !== 1) fail("esperado exatamente 1 localizador institucional.");
if (!inst[0].url || !inst[0].accessedAt) fail("recurso institucional exige URL e data de consulta.");
if (!/din[âa]mico|reverific|volátil|volatil/i.test(JSON.stringify(inst[0]))) fail("recurso institucional exige aviso de volatilidade.");

// 6) Sem citações textuais
if (locators.some((l) => l.quotation)) fail("o piloto não pode conter citações textuais (só paráfrases e localizadores).");

// 7) Fila sem revisor/aprovação fabricados
if (Q.reviewer || Q.approved_by || Q.publication_allowed === true) fail("a fila não pode ter revisor/aprovação nem permitir publicação.");
if (queue.some((i) => i.reviewerId || i.approvedBy || i.reviewedBy || i.publishedAt)) fail("nenhum item pode ter revisor/aprovação/publicação preenchidos.");

// 8) Direitos: CC BY 4.0 só na camada original; terceiros preservados
const os = scope.open_science || {};
if (os.license !== "CC-BY-4.0" || os.third_party_materials_excluded !== true || os.served_publication !== false) fail("âmbito de fontes: CC BY 4.0 na camada original, terceiros excluídos, sem publicação servida.");

// 9) Snapshot SERVIDO permanece sem conteúdo em revisão
const snap = read("public/data/proteus-knowledge-public.json");
if ((snap.assertions || []).length || (snap.entities || []).length || (snap.relations || []).length) fail("o snapshot servido não pode conter afirmações/entidades/relações em revisão.");

// 10) Modelo editorial PURO: transição exige revisor; publicação/aprovação nunca fabricadas
const src = readFileSync("src/proteus/knowledge-review.mjs", "utf8");
if (/writeFileSync|public\/data|fetch\s*\(/.test(src)) fail("o modelo editorial não pode escrever no público nem fazer rede.");
let threw = false; try { reviewTransition(assertions[0], "approve", ""); } catch { threw = true; }
if (!threw) fail("a transição editorial tem de recusar revisor vazio (sem fabricar).");
if (filterProposals(assertions, { epistemicClass: "hypothesis" }, { locators, queue }).some((a) => a.epistemicClass !== "hypothesis")) fail("filtro por classe epistémica inconsistente.");

// 11) Sem ficheiros/segredos/embeddings proibidos nos dados novos
for (const f of ["knowledge-assertions.json", "knowledge-evidence-locators.json", "knowledge-review-queue.json", "knowledge-source-scope.json"]) {
  const t = readFileSync(`data/proteus/${f}`, "utf8");
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|service_role|sk-[A-Za-z0-9]{20,}/.test(t)) fail(`segredo em ${f}.`);
  if (/\bocr_text\b|\bextracted_text\b|\[\s*-?0?\.\d{3,}(\s*,\s*-?0?\.\d{3,}){8,}/.test(t)) fail(`OCR/embedding em ${f}.`);
}

console.log(`Pacote 10C.1 validado: 16 afirmações in_review + 10 entidades draft + 16 localizadores (15 com dupla paginação, 1 institucional com URL/data/volatilidade); fontes ∈ 10B.1, excluídas não usadas; sem citações; fila sem revisor/aprovação fabricados; CC BY 4.0 só camada original; snapshot servido vazio; modelo editorial puro (transição exige revisor). Versão coerente (${pkg.version}); bump 0.38.1/10C.1 fica para o PR de fecho.`);
