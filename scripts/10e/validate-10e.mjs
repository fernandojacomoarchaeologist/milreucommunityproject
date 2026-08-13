/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — validador de FRONTEIRA. Falha (exit≠0) se qualquer invariante for quebrada:
 * contratos estritos alinhados ao núcleo; validação estrita da ingestão (contrato, ISO, coerência
 * de fonte, proveniência de IA, sem aceitação parcial); preservação de proveniência; bancada
 * revisável (texto/idioma/confiança/proponente/instante); gates editoriais (checks-objeto,
 * conflito, autoaprovação); auditoria (motivo/ISO/decisionRefs); núcleos PUROS; e não-regressão
 * objetiva (3/2/1, 5×0, 0/0/0, 16 in_review, 0 apiExposure allow, 42/26/152), sem saída em public/.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import {
  buildIngestionPreview, validateProposal, validateBatch, validateBatchHeader, preserveProposal, INGESTION_STATE,
  PROPOSAL_REQUIRED, PROPOSAL_KEYS, LOCATOR_KEYS, BATCH_REQUIRED, CONFIDENCE_KEYS,
} from "../../src/proteus/knowledge-ingestion.mjs";
import {
  buildReviewPacket, validateReviewRequest, validateChecks, validateRightsAssessment, proposeTransition,
  canPublishInThisPackage, buildAuditEvent, REVIEW_CHECKS, RIGHTS_DIMENSIONS, RIGHTS_DIMENSION_KEYS,
  AUDIT_REQUIRED, AUDIT_KEYS, AUDIT_ENTITY_TYPES,
} from "../../src/proteus/editorial-workflow.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`10E: ${m}`); };
const sameSet = (a, b) => a.length === b.length && [...a].sort().join("|") === [...b].sort().join("|");

// 0) Versão/pacote canónicos e pin legado.
const pkg = read("package.json");
const registry = read("public/data/package-impact-registry.json");
if (pkg.version !== registry.version) fail(`package.json (${pkg.version}) e registo (${registry.version}) divergem.`);
const rd10e = read("contracts/10e/package-10e-readiness.json");
if (rd10e.base.commit !== "3b24cb8" || rd10e.base.version !== "0.39.0" || rd10e.base.currentPackage !== "10D" || rd10e.base.packagejsonCurrentPackageLegacy !== "10B") fail("base histórica da implementação 10E não pode ser alterada (3b24cb8 / 0.39.0 / 10D / legado 10B).");
if (registry.currentPackage !== rd10e.deferredClosure.currentPackage) fail("estado canónico atual deve ser o alvo formal do fecho (10E).");
if (registry.version !== rd10e.deferredClosure.version) fail("versão canónica atual deve ser o alvo formal do fecho (0.40.0).");
if (pkg.currentPackage !== registry.currentPackage) fail("package.json.currentPackage deve coincidir com o registo canónico (fonte única).");
// Entrada de impacto do fecho 10E: conforme o schema canónico da Série 10; sem propriedades internas de estado.
{
  const CODE = "proteus-controlled-ingestion-editorial-review-10e";
  const matches = (registry.surfaces || []).filter((s) => s.code === CODE);
  if (matches.length !== 1) fail(`entrada de surfaces '${CODE}' deve ocorrer exatamente uma vez (encontradas ${matches.length}).`);
  const e = matches[0];
  if (e.package !== "10E") fail("entrada 10E: package deve ser '10E'.");
  if (e.series !== "10 — Experiência Proteus") fail("entrada 10E: series deve ser '10 — Experiência Proteus'.");
  if (e.module !== null) fail("entrada 10E: module deve ser null.");
  if (!Array.isArray(e.routes) || e.routes.length !== 0) fail("entrada 10E: routes deve ser um array vazio.");
  if (e.publicEffects !== "none") fail("entrada 10E: publicEffects deve ser 'none'.");
  if (e.productionWrites !== "disabled") fail("entrada 10E: productionWrites deve ser 'disabled'.");
  if ("version" in e || "currentPackage" in e) fail("entrada 10E: não pode conter as propriedades internas 'version' nem 'currentPackage'.");
  if (typeof e.note !== "string" || e.note.trim() === "") fail("entrada 10E: note não pode estar vazia.");
}

// 1) Scripts declarados e ligados.
for (const s of ["proteus:preview-ingestion", "proteus:review-packet", "validate:10e"]) if (!pkg.scripts[s]) fail(`script em falta: ${s}.`);
if (!pkg.scripts.validate.includes("validate-10e")) fail("validate:10e deve estar ligado à cadeia validate.");

// 2) Contratos presentes, estritos e ALINHADOS ao núcleo.
for (const c of ["ingestion-proposal", "review-work-item", "rights-assessment", "audit-event"]) {
  const p = `contracts/10e/${c}.schema.json`;
  if (!existsSync(p)) fail(`contrato em falta: ${p}.`);
  if (read(p).additionalProperties !== false) fail(`${c}.schema deve ter additionalProperties:false no topo.`);
}
const ing = read("contracts/10e/ingestion-proposal.schema.json");
if (!sameSet(ing.required, BATCH_REQUIRED)) fail("contrato de ingestão: required do lote diverge do núcleo.");
const itemSchema = ing.properties.items.items;
if (itemSchema.additionalProperties !== false) fail("contrato de ingestão: item deve ter additionalProperties:false.");
if (!sameSet(itemSchema.required, PROPOSAL_REQUIRED)) fail("contrato de ingestão: required do item diverge do núcleo.");
if (!sameSet(Object.keys(itemSchema.properties), PROPOSAL_KEYS)) fail("contrato de ingestão: propriedades do item divergem do núcleo.");
if (!sameSet(Object.keys(itemSchema.properties.locator.properties), LOCATOR_KEYS)) fail("contrato de ingestão: propriedades do localizador divergem do núcleo.");
if (!itemSchema.properties.sourceVersion || itemSchema.properties.sourceVersion.type !== "string") fail("contrato de ingestão: sourceVersion (string) em falta.");
// Confiança completa desde a ingestão: allowlist aninhada e limitations obrigatória (array de strings).
const confSchema = itemSchema.properties.confidence;
if (!sameSet(Object.keys(confSchema.properties), CONFIDENCE_KEYS)) fail("paridade: confidence.properties da ingestão divergem do núcleo (level/reasons/limitations).");
if (confSchema.additionalProperties !== false) fail("contrato de ingestão: confidence deve ter additionalProperties:false.");
if (!confSchema.required.includes("limitations")) fail("contrato de ingestão: confidence.limitations obrigatório.");
if (!confSchema.properties.limitations || confSchema.properties.limitations.type !== "array" || confSchema.properties.limitations.items.type !== "string") fail("contrato de ingestão: confidence.limitations deve ser array de strings.");
const rwi = read("contracts/10e/review-work-item.schema.json");
if (rwi.additionalProperties !== false) fail("review-work-item deve ter additionalProperties:false.");
for (const f of ["text", "language", "confidence", "proposedBy", "createdAt", "temporalCondition"]) if (!rwi.required.includes(f)) fail(`review-work-item.schema sem campo obrigatório: ${f}.`);
if (!rwi.properties.confidence.required.includes("limitations")) fail("review-work-item: confidence.limitations obrigatório.");
for (const f of ["pageStart", "pageEnd", "url", "accessedAt", "notes"]) if (!rwi.properties.evidenceLocators.items.properties[f]) fail(`review-work-item: localizador sem campo preservável ${f}.`);
// PARIDADE contrato↔núcleo (evita divergência silenciosa):
const audit = read("contracts/10e/audit-event.schema.json");
if (!sameSet(audit.required, AUDIT_REQUIRED)) fail("paridade: audit-event.required diverge do núcleo.");
if (!sameSet(Object.keys(audit.properties), AUDIT_KEYS)) fail("paridade: audit-event.properties diverge do núcleo.");
if (!sameSet(audit.properties.entityType.enum, AUDIT_ENTITY_TYPES)) fail("paridade: audit-event.entityType enum diverge do núcleo.");
const rights = read("contracts/10e/rights-assessment.schema.json");
if (rights.additionalProperties !== false) fail("rights-assessment deve ter additionalProperties:false.");
if (!rights.required.includes("assertionId")) fail("rights-assessment: assertionId obrigatório.");
for (const dim of RIGHTS_DIMENSIONS) if (!rights.required.includes(dim)) fail(`rights-assessment: dimensão ${dim} obrigatória.`);
if (rights.$defs.dimension.additionalProperties !== false) fail("rights-assessment: dimensão deve ter additionalProperties:false.");
if (!sameSet(Object.keys(rights.$defs.dimension.properties), RIGHTS_DIMENSION_KEYS)) fail("paridade: rights dimension.properties diverge do núcleo.");
// Regras duras representadas no schema de direitos: data ISO, allow-completude e apiExposure:allow inválido.
if (!rights.$defs.dimension.properties.date.pattern) fail("rights: dimension.date deve ter padrão ISO.");
const dimAllow = (rights.$defs.dimension.allOf || []).find((s) => s.if && s.if.properties && s.if.properties.decision && s.if.properties.decision.const === "allow");
if (!dimAllow || !sameSet(dimAllow.then.required, ["basis", "evidence", "responsible", "date"])) fail("rights: dimensão deve exigir basis/evidence/responsible/date quando decision=allow.");
const apiForbid = (rights.allOf || []).find((s) => s.if && s.if.properties && s.if.properties.apiExposure && s.if.properties.apiExposure.properties.decision.const === "allow");
if (!apiForbid || apiForbid.then !== false) fail("rights: apiExposure:allow deve tornar o documento inválido (then:false).");
// Auditoria: instante ISO e referências de decisão não vazias representadas no schema.
if (!audit.properties.at.pattern) fail("audit: 'at' deve ter padrão ISO.");
if (audit.properties.decisionRefs.items.minLength !== 1) fail("audit: decisionRefs deve conter apenas strings não vazias (minLength:1).");
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

// 4) Núcleos PUROS.
for (const f of ["src/proteus/knowledge-ingestion.mjs", "src/proteus/editorial-workflow.mjs"]) {
  const t = text(f);
  if (/new Date\(|Date\.now\(|Math\.random\(|fetch\(|require\(|from "node:fs"|from "node:http|createServer|process\.env/.test(t)) fail(`núcleo ${f} não pode usar relógio/aleatoriedade/rede/I/O/estado global.`);
}

// 5) Ingestão estrita (fixtures sintéticas).
const okProp = { id: "p-1", text: "x", language: "pt-PT", epistemicClass: "fact_claim", sourceId: "src-in", locator: { id: "l1", sourceId: "src-in", locatorType: "whole_resource", accessedAt: "2026-08-11" }, confidence: { level: "supported", reasons: ["r"], limitations: [] }, proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z" };
const scope = { includedSources: ["src-in"], excludedSources: ["src-out"], canonicalIds: ["a10c1-001"], paginatedSources: [] };
if (!validateProposal(okProp, scope).valid) fail("proposta válida deveria passar.");
if (validateProposal({ ...okProp, sourceId: "src-out" }, scope).valid) fail("fonte excluída deveria falhar.");
if (validateProposal({ ...okProp, sourceId: "src-missing" }, scope).valid) fail("fonte ausente deveria falhar.");
if (validateProposal({ ...okProp, id: "a10c1-001" }, scope).valid) fail("colisão canónica deveria falhar.");
if (validateProposal({ ...okProp, language: "de" }, scope).valid) fail("idioma fora do enum deveria falhar.");
if (validateProposal({ ...okProp, proposedAt: "ontem" }, scope).valid) fail("proposedAt não-ISO deveria falhar.");
if (validateProposal({ ...okProp, foo: 1 }, scope).valid) fail("propriedade desconhecida deveria falhar (additionalProperties:false).");
if (validateProposal({ ...okProp, locator: { ...okProp.locator, sourceId: "outra" } }, scope).valid) fail("localizador com sourceId divergente deveria falhar.");
if (validateProposal({ ...okProp, aiAssisted: true }, scope).valid) fail("aiAssisted sem transformation/tool/toolVersion deveria falhar.");
if (!validateProposal({ ...okProp, aiAssisted: true, transformation: "paraphrase", tool: "x", toolVersion: "1" }, scope).valid) fail("aiAssisted com proveniência completa deveria passar.");
if (validateProposal({ id: "p", text: "x", language: "pt-PT", epistemicClass: "fact_claim", sourceId: "src-in", locator: okProp.locator, proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z" }, scope).valid) fail("proposta sem confidence deveria falhar.");
// lote inválido não aceita parcialmente
const badBatch = buildIngestionPreview({ items: [okProp] }, scope); // faltam batchId/proposedBy/proposedAt
if (badBatch.batchValid !== false || badBatch.totals.accepted !== 0 || badBatch.accepted.length !== 0) fail("lote com cabeçalho inválido não pode aceitar candidatos parcialmente.");
if (validateBatchHeader({ batchId: "b", proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", items: [], extra: 1 }).valid) fail("lote com propriedade desconhecida deveria falhar.");
// sourceVersion: opcional; string não vazia quando presente; preservado byte-identicamente.
if (validateProposal({ ...okProp, sourceVersion: "" }, scope).valid) fail("sourceVersion vazio deveria falhar.");
if (!validateProposal({ ...okProp, sourceVersion: "2.ª ed. 2019" }, scope).valid) fail("sourceVersion string não vazia deveria passar.");
// preservação de proveniência (incl. sourceVersion)
const rich = { ...okProp, sourceVersion: "ed-2019", transformation: "paraphrase", tool: "t", toolVersion: "1", aiAssisted: true, hash: "sha256:x", entityIds: ["e1"] };
const preview = buildIngestionPreview({ batchId: "b", proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", items: [rich] }, scope);
const acc = preview.accepted[0];
for (const k of ["text", "language", "epistemicClass", "sourceId", "sourceVersion", "locator", "confidence", "transformation", "tool", "toolVersion", "aiAssisted", "hash", "proposedBy", "proposedAt"]) if (acc[k] === undefined) fail(`preservação: campo ausente na pré-visualização aceite: ${k}.`);
if (acc.sourceVersion !== "ed-2019") fail("sourceVersion não foi preservado byte-a-byte.");
if (acc.state !== "draft") fail("item aceite não pode ir além de 'draft'.");
const pres = preserveProposal({ ...okProp, quotation: "trecho", quotationRightsApproved: false });
if ("quotation" in pres) fail("preservação não pode incluir citação sem direitos aprovados.");
// PARIDADE PROFUNDA de ingestão: tipos inválidos que o schema recusa também têm de falhar no núcleo.
if (validateProposal({ ...okProp, aiAssisted: "yes" }, scope).valid) fail("aiAssisted não-boolean deveria falhar.");
if (validateProposal({ ...okProp, entityIds: [7] }, scope).valid) fail("entityIds não-strings deveria falhar.");
if (validateProposal({ ...okProp, locator: { ...okProp.locator, id: 7 } }, scope).valid) fail("locator.id não-string deveria falhar.");
if (validateProposal({ ...okProp, locator: { ...okProp.locator, notes: 7 } }, scope).valid) fail("locator.notes não-string deveria falhar.");
if (validateProposal({ ...okProp, confidence: { ...okProp.confidence, foo: "bar" } }, scope).valid) fail("confidence com propriedade desconhecida deveria falhar.");
if (validateProposal({ ...okProp, confidence: { level: "supported", reasons: ["r"] } }, scope).valid) fail("confidence sem limitations deveria falhar (obrigatório mesmo []).");
if (validateProposal({ ...okProp, confidence: { level: "supported", reasons: ["r"], limitations: [7] } }, scope).valid) fail("confidence.limitations não-strings deveria falhar.");
if (validateProposal({ ...okProp, confidence: { level: "supported", reasons: [7], limitations: [] } }, scope).valid) fail("confidence.reasons não-strings deveria falhar.");
if (validateProposal({ ...okProp, locator: { ...okProp.locator, pageStart: 0 } }, scope).valid) fail("locator.pageStart<1 deveria falhar.");

// 6) Revisão editorial: bancada revisável + gates.
const A = read("data/proteus/knowledge-assertions.json");
const E = read("data/proteus/knowledge-evidence-locators.json");
const Q = read("data/proteus/knowledge-review-queue.json");
const packet = buildReviewPacket({ assertions: A.assertions || [], locators: E.locators || [], entities: A.entities || [], queue: Q.items || [] });
if (packet.totalItems !== 16) fail(`pacote de revisão deve ter 16 itens (tem ${packet.totalItems}).`);
const assById = new Map((A.assertions || []).map((a) => [a.id, a]));
for (const it of packet.items) {
  for (const f of ["text", "language", "confidence", "proposedBy", "createdAt"]) if (it[f] === undefined) fail(`item da bancada sem campo revisável: ${f} (${it.assertionId}).`);
  if (it.reviewer !== null || it.decision !== null) fail("pacote não pode conter revisor/decisão fabricados.");
  // confiança completa: limitações sempre presentes e iguais aos dados canónicos.
  if (!it.confidence || !Array.isArray(it.confidence.limitations)) fail(`bancada: confidence.limitations ausente em ${it.assertionId}.`);
  const src = assById.get(it.assertionId);
  if (JSON.stringify(it.confidence.limitations) !== JSON.stringify(src.confidence.limitations || [])) fail(`bancada: limitações divergem dos dados canónicos em ${it.assertionId}.`);
  // localizadores autossuficientes, sem citação.
  for (const l of it.evidenceLocators) {
    if (!l.id || !l.sourceId || !l.locatorType) fail(`bancada: localizador incompleto em ${it.assertionId}.`);
    if ("quotation" in l || "quotationRightsApproved" in l) fail(`bancada: localizador não pode conter citação/direitos (${it.assertionId}).`);
  }
}
// Hauschild com paginação estruturada e a10c1-016 com url+accessedAt+nota de volatilidade.
const it009 = packet.items.find((i) => i.assertionId === "a10c1-009");
if (!it009.evidenceLocators.some((l) => Number.isInteger(l.pageStart) && l.label)) fail("bancada: paginação estruturada de Hauschild em falta (a10c1-009).");
const it016 = packet.items.find((i) => i.assertionId === "a10c1-016");
const loc016 = it016.evidenceLocators[0] || {};
if (loc016.locatorType !== "url_snapshot" || !loc016.url || !loc016.accessedAt || !loc016.notes) fail("bancada: a10c1-016 deve preservar url, accessedAt e nota de volatilidade.");
if (!packet.timeSensitiveItems.includes("a10c1-016")) fail("o item temporal a10c1-016 deve ser sinalizado.");
if (JSON.stringify(packet) !== JSON.stringify(buildReviewPacket({ assertions: A.assertions || [], locators: E.locators || [], entities: A.entities || [], queue: Q.items || [] }))) fail("pacote de revisão não é determinístico.");
// checks-objeto
if (!sameSet(REVIEW_CHECKS, ["evidence", "rights", "epistemicClass", "publicSafety"])) fail("REVIEW_CHECKS desalinhado do contrato 10C.");
if (validateChecks(["anything"]).valid) fail("checks como array arbitrário deveria falhar.");
if (validateChecks({ evidence: true }).valid) fail("checks incompletos deveriam falhar.");
if (!validateChecks({ evidence: true, rights: true, epistemicClass: true, publicSafety: true }).valid) fail("checks completos deveriam passar.");
const goodReq = { assertionId: "a10c1-001", reviewerId: "human-1", decidedAt: "2026-08-12T00:00:00Z", action: "approve", comment: "ok", checks: { evidence: true, rights: true, epistemicClass: true, publicSafety: true }, conflictOfInterest: false };
if (!validateReviewRequest(goodReq).valid) fail("pedido de revisão completo deveria passar.");
if (validateReviewRequest({ ...goodReq, reviewerId: "" }).valid) fail("revisão sem reviewerId deveria falhar.");
if (validateReviewRequest({ ...goodReq, decidedAt: "hoje" }).valid) fail("data inválida deveria falhar.");
if (validateReviewRequest({ ...goodReq, comment: "" }).valid) fail("comentário vazio deveria falhar.");
if (validateReviewRequest({ ...goodReq, checks: ["anything"] }).valid) fail("checks arbitrários deveriam falhar.");
if (validateReviewRequest({ ...goodReq, conflictOfInterest: undefined }).valid) fail("conflictOfInterest tem de ser explícito.");
// integridade, conflito e autoaprovação bloqueiam a TRANSIÇÃO
const inrev = (A.assertions || []).find((a) => a.status === "in_review");
if (proposeTransition(inrev, { ...goodReq, assertionId: "outro-id" }).allowed !== false) fail("integridade: assertionId divergente deve bloquear a transição.");
if (proposeTransition(inrev, { ...goodReq, assertionId: inrev.id, conflictOfInterest: true }).allowed !== false) fail("conflito de interesse deve bloquear a transição.");
if (proposeTransition({ ...inrev, proposedBy: "human-1" }, { ...goodReq, assertionId: inrev.id, reviewerId: "human-1" }).allowed !== false) fail("autoaprovação (reviewerId===proposedBy) deve bloquear.");
if (proposeTransition(inrev, { ...goodReq, assertionId: inrev.id }).allowed !== true) fail("transição válida deveria ser permitida.");
// direitos ESTRITAMENTE fail-closed
const dim = (d) => ({ decision: d, basis: "b", evidence: "e", responsible: "r", date: "2026-08-11" });
if (validateRightsAssessment({ copyright: dim("allow"), consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("deny") }).valid) fail("rights sem assertionId deveria falhar.");
if (validateRightsAssessment({ assertionId: "a", copyright: dim("allow"), consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("deny"), extra: 1 }).valid) fail("rights com propriedade desconhecida no topo deveria falhar.");
if (validateRightsAssessment({ assertionId: "a", copyright: { decision: "allow", basis: "b", evidence: "e", responsible: "r", date: "d" }, consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("deny") }).valid) fail("rights com data não-ISO deveria falhar.");
if (validateRightsAssessment({ assertionId: "a", copyright: { decision: "allow", basis: "b" }, consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("deny") }).valid) fail("allow sem evidência/responsável/data deveria falhar.");
const raUnknown = validateRightsAssessment({ assertionId: "a", copyright: dim("allow"), consent: { decision: "unknown" }, license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("deny") });
if (raUnknown.effective.consent !== "deny" || raUnknown.rightsCompatible !== false) fail("'unknown' deve comportar-se como 'deny'.");
if (validateRightsAssessment({ assertionId: "a", copyright: dim("allow"), consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("allow") }).valid !== false) fail("apiExposure:allow deve tornar a avaliação INVÁLIDA neste pacote.");
if (validateRightsAssessment({ assertionId: "a", copyright: { decision: "allow", basis: "b", evidence: "e", responsible: "r", date: "2026-08-11", foo: 1 }, consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("deny") }).valid) fail("propriedade desconhecida numa dimensão deveria falhar.");
// tipos das dimensões validados mesmo em deny/unknown (paridade profunda).
if (validateRightsAssessment({ assertionId: "a", copyright: { decision: "deny", basis: 123 }, consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("deny") }).valid) fail("basis não-string (deny) deveria falhar.");
if (validateRightsAssessment({ assertionId: "a", copyright: { decision: "unknown", evidence: 123 }, consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("deny") }).valid) fail("evidence não-string (unknown) deveria falhar.");
if (canPublishInThisPackage({ status: "approved" }, {}).allowed !== false) fail("publicação deve estar bloqueada no 10E.");
// auditoria: motivo/ISO/decisionRefs/entityType-enum/propriedades desconhecidas
if (buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z", decisionRefs: [] }).valid) fail("auditoria sem motivo deveria falhar.");
if (buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "amanhã", reason: "r", decisionRefs: [] }).valid) fail("auditoria com instante não-ISO deveria falhar.");
if (buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r" }).valid) fail("decisionRefs em falta deveria falhar (obrigatório mesmo []).");
if (buildAuditEvent({ id: "e", entityType: "desconhecido", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r", decisionRefs: [] }).valid) fail("entityType fora do enum deveria falhar.");
if (buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r", decisionRefs: [], foo: 1 }).valid) fail("propriedade de auditoria desconhecida deveria falhar.");
if (!buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "propose", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "revisão proposta", decisionRefs: [] }).valid) fail("auditoria mínima válida (decisionRefs=[]) deveria passar.");
if (buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "email alguem@example.invalid", decisionRefs: [] }).valid) fail("auditoria com contacto deveria falhar.");
// PARIDADE PROFUNDA de auditoria: tipos inválidos têm de falhar.
if (buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: 7, actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r", decisionRefs: [] }).valid) fail("action numérico deveria falhar.");
if (buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r", decisionRefs: [], fromState: 7 }).valid) fail("fromState numérico deveria falhar.");
if (buildAuditEvent({ id: "e", entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r", decisionRefs: [""] }).valid) fail("decisionRefs com string vazia deveria falhar.");
if (buildAuditEvent({ id: 7, entityType: "assertion", entityId: "a", action: "x", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r", decisionRefs: [] }).valid) fail("id numérico deveria falhar.");

// 7) Não-regressão objetiva.
const cat = read("public/data/proteus-catalog-public.json");
if ((cat.works || []).length !== 3 || (cat.authors || []).length !== 2 || (cat.externalResources || []).length !== 1) fail("catálogo humano deve permanecer 3/2/1.");
if (read("public/api/proteus/v1/index.json").resources.some((r) => r.count !== 0)) fail("API pública deve permanecer 5×0.");
const snap = read("public/data/proteus-knowledge-public.json");
if ((snap.assertions || []).length || (snap.entities || []).length || (snap.relations || []).length) fail("snapshot servido deve permanecer 0/0/0.");
if ((A.assertions || []).length !== 16 || (A.assertions || []).some((a) => a.status !== "in_review")) fail("os 16 registos devem permanecer in_review.");
if ((A.entities || []).some((e) => e.status !== "draft")) fail("as 10 entidades devem permanecer draft.");
for (const p of ["data/proteus/knowledge-assertions.json", "data/proteus/knowledge-review-queue.json", "public/data/proteus-catalog-public.json", "public/data/proteus-knowledge-public.json"]) {
  if (/"apiExposure"\s*:\s*"allow"/i.test(text(p))) fail(`apiExposure allow detetado em ${p}.`);
}
if (readdirSync("supabase/migrations").filter((f) => f.endsWith(".sql")).length !== 42) fail("42 migrations esperadas.");
if (read("public/data/collaborative-modules.json").modules.length !== 26) fail("módulos devem permanecer 26.");
if (read("public/data/collaborative-roles-permissions.json").permissions.length !== 152) fail("permissões devem permanecer 152.");

// 8) Nenhuma saída 10E em public/.
for (const f of walk("public")) if (/knowledge-ingestion-inbox|knowledge-review-decisions|knowledge-editorial-audit|review-packet|ingestion-preview/i.test(f)) fail(`saída 10E não pode existir em public/: ${f}.`);

// 9) Predecessores preservados.
for (const p of ["scripts/10d/validate-10d.mjs", "scripts/10c1/validate-10c1.mjs", "src/proteus/knowledge-model.mjs", "src/proteus/knowledge-review.mjs", "src/proteus/public-api.mjs"]) if (!existsSync(p)) fail(`predecessor removido: ${p}.`);

console.log("Pacote 10E validado: contratos estritos alinhados ao núcleo; ingestão estrita (contrato/ISO/coerência de fonte/proveniência IA/sem aceitação parcial) e proveniência preservada; bancada revisável (texto/idioma/confiança/proponente/instante) determinística de 16 itens (a10c1-016 temporal); gates editoriais (checks-objeto, conflito e autoaprovação bloqueiam a transição); auditoria com motivo/ISO/decisionRefs; núcleos PUROS; não-regressão 3/2/1, 5×0, 0/0/0, 16 in_review, 0 apiExposure allow, 42/26/152; sem saída em public/. Estado canónico 0.40.0/10E (pin package.json.currentPackage alinhado ao registo).");

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${name.name}`;
    if (name.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
