/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — validador de FRONTEIRA. Falha (exit≠0) se qualquer invariante for quebrada:
 * contratos estritos; registos vazios repo-internos; núcleos PUROS (sem relógio/aleatoriedade/rede/
 * I/O); ingestão em quarentena sempre 'draft' e fail-closed; pacote de revisão determinístico de 16
 * itens sem revisor fabricado (item temporal sinalizado); direitos unknown=deny; publicação e
 * apiExposure:allow bloqueados; e não-regressão objetiva (3/2/1, 5×0, 0/0/0, 16 in_review, 0
 * apiExposure allow, 42/26/152), sem qualquer saída 10E em public/.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { buildIngestionPreview, validateProposal, INGESTION_STATE } from "../../src/proteus/knowledge-ingestion.mjs";
import { buildReviewPacket, validateReviewRequest, validateRightsAssessment, proposeTransition, canPublishInThisPackage, buildAuditEvent } from "../../src/proteus/editorial-workflow.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`10E: ${m}`); };

// 0) Versão/pacote canónicos e pin legado.
const pkg = read("package.json");
const registry = read("public/data/package-impact-registry.json");
if (pkg.version !== registry.version) fail(`package.json (${pkg.version}) e registo (${registry.version}) divergem.`);
if (registry.currentPackage !== "10D") fail("registo canónico deve permanecer 10D neste PR funcional.");
if (pkg.currentPackage !== "10B") fail("pin legado package.json.currentPackage deve permanecer '10B'.");

// 1) Scripts declarados e ligados.
for (const s of ["proteus:preview-ingestion", "proteus:review-packet", "validate:10e"]) if (!pkg.scripts[s]) fail(`script em falta: ${s}.`);
if (!pkg.scripts.validate.includes("validate-10e")) fail("validate:10e deve estar ligado à cadeia validate.");

// 2) Contratos presentes e estritos.
for (const c of ["ingestion-proposal", "review-work-item", "rights-assessment", "audit-event"]) {
  const p = `contracts/10e/${c}.schema.json`;
  if (!existsSync(p)) fail(`contrato em falta: ${p}.`);
  const s = read(p);
  if (s.additionalProperties !== false) fail(`${c}.schema deve ter additionalProperties:false no topo.`);
}
const readiness = read("contracts/10e/package-10e-readiness.json");
for (const [k, v] of Object.entries(readiness.boundaries)) if (v !== false) fail(`readiness.boundaries.${k} deve ser false.`);
if (readiness.deferredClosure.version !== "0.40.0" || readiness.deferredClosure.currentPackage !== "10E") fail("readiness: fecho diferido deve ser 0.40.0/10E.");

// 3) Registos vazios repo-internos.
for (const [f, arr] of [["knowledge-ingestion-inbox", "proposals"], ["knowledge-review-decisions", "decisions"], ["knowledge-editorial-audit", "events"]]) {
  const p = `data/proteus/${f}.json`;
  if (!existsSync(p)) fail(`registo em falta: ${p}.`);
  const d = read(p);
  if (!Array.isArray(d[arr]) || d[arr].length !== 0) fail(`${f} deve começar vazio (${arr}=[]).`);
  if (d.servedPublication !== false || d.publicationAllowed !== false || d.humanActionRequired !== true) fail(`${f} deve declarar servedPublication:false, publicationAllowed:false, humanActionRequired:true.`);
}

// 4) Núcleos PUROS: sem relógio, aleatoriedade, rede ou I/O.
for (const f of ["src/proteus/knowledge-ingestion.mjs", "src/proteus/editorial-workflow.mjs"]) {
  const t = text(f);
  if (/new Date\(|Date\.now\(|Math\.random\(|fetch\(|require\(|from "node:fs"|from "node:http|createServer|process\.env/.test(t)) fail(`núcleo ${f} não pode usar relógio/aleatoriedade/rede/I/O/estado global.`);
}

// 5) Ingestão fail-closed (fixtures sintéticas).
const okProp = { id: "p-1", text: "x", language: "pt-PT", epistemicClass: "fact_claim", sourceId: "src-in", locator: { id: "l1", sourceId: "src-in", locatorType: "whole_resource", accessedAt: "2026-08-11" }, confidence: { level: "supported", reasons: ["r"] }, proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z" };
const scope = { includedSources: ["src-in"], excludedSources: ["src-out"], canonicalIds: ["a10c1-001"], paginatedSources: [] };
if (!validateProposal(okProp, scope).valid) fail("proposta válida de fonte incluída deveria passar.");
if (validateProposal({ ...okProp, sourceId: "src-out" }, scope).valid) fail("fonte excluída deveria falhar.");
if (validateProposal({ ...okProp, sourceId: "src-missing" }, scope).valid) fail("fonte ausente deveria falhar.");
if (validateProposal({ ...okProp, id: "a10c1-001" }, scope).valid) fail("colisão com id canónico deveria falhar.");
if (validateProposal({ ...okProp, confidence: { level: "supported", reasons: ["r"], percentage: 90 } }, scope).valid) fail("confiança probabilística deveria falhar.");
if (validateProposal({ ...okProp, quotation: "trecho", quotationRightsApproved: false }, scope).valid) fail("citação sem direitos deveria falhar.");
const prev = buildIngestionPreview({ batchId: "b", proposedBy: "op", proposedAt: "t", items: [okProp, { ...okProp }] }, scope);
if (prev.state !== INGESTION_STATE) fail("pré-visualização deve permanecer 'draft'.");
if (prev.totals.duplicates !== 1) fail("duplicado no lote deveria ser detetado.");
if (prev.accepted.some((a) => a.state !== "draft")) fail("nenhum item aceite pode ir além de 'draft'.");

// 6) Revisão editorial: pacote determinístico de 16 + gates humanos.
const A = read("data/proteus/knowledge-assertions.json");
const E = read("data/proteus/knowledge-evidence-locators.json");
const Q = read("data/proteus/knowledge-review-queue.json");
const packet = buildReviewPacket({ assertions: A.assertions || [], locators: E.locators || [], entities: A.entities || [], queue: Q.items || [] });
if (packet.totalItems !== 16) fail(`pacote de revisão deve ter exatamente 16 itens (tem ${packet.totalItems}).`);
if (packet.servedPublication !== false || packet.publicationAllowed !== false) fail("pacote não pode autorizar publicação nem ser servido.");
if (packet.items.some((it) => it.reviewer !== null || it.decision !== null)) fail("pacote não pode conter revisor/decisão fabricados.");
if (!packet.timeSensitiveItems.includes("a10c1-016")) fail("o item temporal a10c1-016 deve ser sinalizado.");
// determinismo
if (JSON.stringify(packet) !== JSON.stringify(buildReviewPacket({ assertions: A.assertions || [], locators: E.locators || [], entities: A.entities || [], queue: Q.items || [] }))) fail("pacote de revisão não é determinístico.");
// gates humanos
if (validateReviewRequest({ assertionId: "a", action: "approve", decidedAt: "t", comment: "c", checks: ["x"] }).valid) fail("revisão sem reviewerId deveria falhar.");
if (validateReviewRequest({ assertionId: "a", reviewerId: "r", action: "approve", comment: "c", checks: ["x"] }).valid) fail("revisão sem instante deveria falhar.");
if (validateReviewRequest({ assertionId: "a", reviewerId: "r", decidedAt: "t", action: "approve", comment: "c", checks: [] }).valid) fail("revisão sem checks deveria falhar.");
// direitos unknown = deny
const ra = validateRightsAssessment({ assertionId: "a", copyright: { decision: "allow", basis: "b", evidence: "e", responsible: "r", date: "d" }, consent: { decision: "unknown" }, license: { decision: "allow", basis: "b", evidence: "e", responsible: "r", date: "d" }, thirdPartyMaterial: { decision: "allow", basis: "b", evidence: "e", responsible: "r", date: "d" }, apiExposure: { decision: "unknown" } });
if (ra.effective.consent !== "deny" || ra.effective.apiExposure !== "deny") fail("'unknown' deve comportar-se como 'deny'.");
if (ra.rightsCompatible !== false) fail("com 'unknown' os direitos não podem ser compatíveis.");
// transição proposta, não aplicada; publicação bloqueada
const someInReview = (A.assertions || []).find((a) => a.status === "in_review");
const pr = proposeTransition(someInReview, { assertionId: someInReview.id, reviewerId: "human-1", decidedAt: "2026-08-11", action: "approve", comment: "ok", checks: ["evidence"] });
if (!pr.allowed || pr.applied !== false) fail("proposta de transição deve ser válida mas NÃO aplicada.");
if (canPublishInThisPackage({ status: "approved" }, { evidence: [], review: null }).allowed !== false) fail("publicação deve estar bloqueada no 10E.");
// auditoria sem conteúdo sensível
if (buildAuditEvent({ id: "e1", entityType: "assertion", entityId: "a", action: "propose", actorId: "op", at: "t", reason: "contacto: alguem@example.invalid" }).valid) fail("auditoria com contacto deveria falhar.");

// 7) Não-regressão objetiva.
const cat = read("public/data/proteus-catalog-public.json");
if ((cat.works || []).length !== 3 || (cat.authors || []).length !== 2 || (cat.externalResources || []).length !== 1) fail("catálogo humano deve permanecer 3/2/1.");
const idx = read("public/api/proteus/v1/index.json");
if (idx.resources.some((r) => r.count !== 0)) fail("API pública deve permanecer 5×0.");
const snap = read("public/data/proteus-knowledge-public.json");
if ((snap.assertions || []).length || (snap.entities || []).length || (snap.relations || []).length) fail("snapshot servido deve permanecer 0/0/0.");
if ((A.assertions || []).length !== 16 || (A.assertions || []).some((a) => a.status !== "in_review")) fail("os 16 registos devem permanecer in_review.");
if ((A.entities || []).some((e) => e.status !== "draft")) fail("as 10 entidades devem permanecer draft.");
// nenhum apiExposure:allow em dados repo-internos nem servidos
for (const p of ["data/proteus/knowledge-assertions.json", "data/proteus/knowledge-review-queue.json", "public/data/proteus-catalog-public.json", "public/data/proteus-knowledge-public.json"]) {
  if (/"apiExposure"\s*:\s*"allow"|apiExposure.*allow/i.test(text(p))) fail(`apiExposure allow detetado em ${p}.`);
}
const migrations = readdirSync("supabase/migrations").filter((f) => f.endsWith(".sql"));
if (migrations.length !== 42) fail(`10E não deve adicionar migrations (esperadas 42, há ${migrations.length}).`);
if (read("public/data/collaborative-modules.json").modules.length !== 26) fail("módulos devem permanecer 26.");
if (read("public/data/collaborative-roles-permissions.json").permissions.length !== 152) fail("permissões devem permanecer 152.");

// 8) Nenhuma saída 10E em public/.
for (const dir of ["public"]) {
  for (const f of walk(dir)) if (/knowledge-ingestion-inbox|knowledge-review-decisions|knowledge-editorial-audit|review-packet|ingestion-preview/i.test(f)) fail(`saída 10E não pode existir em public/: ${f}.`);
}

// 9) Predecessores preservados.
for (const p of ["scripts/10d/validate-10d.mjs", "scripts/10c1/validate-10c1.mjs", "src/proteus/knowledge-model.mjs", "src/proteus/knowledge-review.mjs", "src/proteus/public-api.mjs"]) if (!existsSync(p)) fail(`predecessor removido: ${p}.`);

console.log("Pacote 10E validado: contratos estritos; registos repo-internos vazios; núcleos PUROS (sem relógio/rede/I/O); ingestão em quarentena 'draft' e fail-closed; pacote de revisão determinístico de 16 itens sem revisor fabricado (a10c1-016 temporal sinalizado); direitos unknown=deny; publicação e apiExposure:allow bloqueados; não-regressão 3/2/1, 5×0, 0/0/0, 16 in_review, 0 apiExposure allow, 42/26/152; sem saída em public/; predecessores preservados. Estado canónico permanece 0.39.0/10D (pin legado 10B).");

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${name.name}`;
    if (name.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
