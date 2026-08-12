/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10E — testes de FRONTEIRA e não-regressão: dados reais intocados, registos 10E vazios,
 * núcleos puros, nenhuma saída em public/ e estado canónico preservado.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, mkdtempSync, mkdirSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");

test("os 16 registos continuam in_review e 10 entidades draft; nada foi alterado", () => {
  const A = read("data/proteus/knowledge-assertions.json");
  assert.equal(A.assertions.length, 16);
  assert.ok(A.assertions.every((a) => a.status === "in_review"));
  assert.equal(A.entities.length, 10);
  assert.ok(A.entities.every((e) => e.status === "draft"));
});

test("registos 10E começam vazios, não servidos e sem publicação", () => {
  for (const [f, arr] of [["knowledge-ingestion-inbox", "proposals"], ["knowledge-review-decisions", "decisions"], ["knowledge-editorial-audit", "events"]]) {
    const d = read(`data/proteus/${f}.json`);
    assert.deepEqual(d[arr], []);
    assert.equal(d.servedPublication, false);
    assert.equal(d.publicationAllowed, false);
    assert.equal(d.humanActionRequired, true);
  }
});

test("não-regressão pública: Biblioteca 3/2/1, API 5×0, conhecimento 0/0/0", () => {
  const cat = read("public/data/proteus-catalog-public.json");
  assert.equal(cat.works.length, 3);
  assert.equal(cat.authors.length, 2);
  assert.equal(cat.externalResources.length, 1);
  const idx = read("public/api/proteus/v1/index.json");
  assert.ok(idx.resources.every((r) => r.count === 0));
  const snap = read("public/data/proteus-knowledge-public.json");
  assert.equal(snap.assertions.length, 0);
  assert.equal(snap.entities.length, 0);
  assert.equal(snap.relations.length, 0);
});

test("nenhum apiExposure:allow em dados repo-internos ou servidos", () => {
  for (const p of ["data/proteus/knowledge-assertions.json", "data/proteus/knowledge-review-queue.json", "public/api/proteus/v1/works.json", "public/data/proteus-catalog-public.json"]) {
    assert.ok(!/"apiExposure"\s*:\s*"allow"/.test(text(p)), `apiExposure allow em ${p}`);
  }
});

test("núcleos 10E são puros: sem relógio, aleatoriedade, rede ou I/O", () => {
  for (const f of ["src/proteus/knowledge-ingestion.mjs", "src/proteus/editorial-workflow.mjs"]) {
    const t = text(f);
    assert.ok(!/new Date\(|Date\.now\(|Math\.random\(|fetch\(|from "node:fs"|createServer|process\.env/.test(t), `${f} não é puro`);
  }
});

test("nenhuma saída 10E aparece em public/", () => {
  const bad = [];
  const walk = (dir) => { if (!existsSync(dir)) return; for (const n of readdirSync(dir, { withFileTypes: true })) { const p = `${dir}/${n.name}`; if (n.isDirectory()) walk(p); else if (/ingestion-inbox|review-decisions|editorial-audit|review-packet|ingestion-preview/i.test(p)) bad.push(p); } };
  walk("public");
  assert.deepEqual(bad, []);
});

test("estado canónico 0.40.0/10E; package.json.currentPackage alinhado ao registo", () => {
  const pkg = read("package.json"); const reg = read("public/data/package-impact-registry.json");
  assert.equal(pkg.version, reg.version);
  assert.equal(pkg.currentPackage, reg.currentPackage);
  assert.equal(reg.version, "0.40.0");
  assert.equal(reg.currentPackage, "10E");
});

test("42 migrations, 26 módulos, 152 permissões preservados", () => {
  assert.equal(readdirSync("supabase/migrations").filter((f) => f.endsWith(".sql")).length, 42);
  assert.equal(read("public/data/collaborative-modules.json").modules.length, 26);
  assert.equal(read("public/data/collaborative-roles-permissions.json").permissions.length, 152);
});

test("paridade contrato↔núcleo: ingestão, auditoria, direitos e bancada alinhados", async () => {
  const ing = read("contracts/10e/ingestion-proposal.schema.json");
  const rwi = read("contracts/10e/review-work-item.schema.json");
  const audit = read("contracts/10e/audit-event.schema.json");
  const rights = read("contracts/10e/rights-assessment.schema.json");
  const KI = await import("../src/proteus/knowledge-ingestion.mjs");
  const EW = await import("../src/proteus/editorial-workflow.mjs");
  const same = (a, b) => assert.deepEqual([...a].sort(), [...b].sort());
  // ingestão
  same(ing.required, KI.BATCH_REQUIRED);
  same(ing.properties.items.items.required, KI.PROPOSAL_REQUIRED);
  same(Object.keys(ing.properties.items.items.properties), KI.PROPOSAL_KEYS);
  same(Object.keys(ing.properties.items.items.properties.locator.properties), KI.LOCATOR_KEYS);
  assert.ok(KI.PROPOSAL_KEYS.includes("sourceVersion"), "sourceVersion na allowlist do núcleo");
  // auditoria
  same(audit.required, EW.AUDIT_REQUIRED);
  same(Object.keys(audit.properties), EW.AUDIT_KEYS);
  same(audit.properties.entityType.enum, EW.AUDIT_ENTITY_TYPES);
  // direitos
  same(Object.keys(rights.$defs.dimension.properties), EW.RIGHTS_DIMENSION_KEYS);
  for (const d of EW.RIGHTS_DIMENSIONS) assert.ok(rights.required.includes(d));
  assert.equal(rights.additionalProperties, false);
  assert.equal(rights.$defs.dimension.additionalProperties, false);
  // bancada
  assert.ok(rwi.properties.confidence.required.includes("limitations"));
  for (const f of ["pageStart", "pageEnd", "url", "accessedAt", "notes"]) assert.ok(rwi.properties.evidenceLocators.items.properties[f], `localizador schema: ${f}`);
});

// Validador mínimo de JSON Schema (subconjunto usado pelos contratos 10E): type, enum, const,
// required, properties, additionalProperties:false, items, minLength/maxLength, minItems, minimum,
// pattern, $ref (#/$defs), allOf, if/then/else e schema booleano. Autossuficiente (zero dependências).
function schemaErrors(schema, data, root) {
  if (schema === true) return [];
  if (schema === false) return ["schema:false"];
  if (schema.$ref) return schemaErrors(schema.$ref.replace(/^#\//, "").split("/").reduce((o, k) => o[k], root), data, root);
  const e = [];
  const typeOK = (t) => t === "object" ? (data !== null && typeof data === "object" && !Array.isArray(data))
    : t === "array" ? Array.isArray(data) : t === "string" ? typeof data === "string"
    : t === "integer" ? Number.isInteger(data) : t === "number" ? typeof data === "number"
    : t === "boolean" ? typeof data === "boolean" : t === "null" ? data === null : false;
  if (schema.type !== undefined && !(Array.isArray(schema.type) ? schema.type : [schema.type]).some(typeOK)) e.push(`tipo ${JSON.stringify(schema.type)}`);
  if (schema.enum !== undefined && !schema.enum.some((v) => JSON.stringify(v) === JSON.stringify(data))) e.push("enum");
  if (schema.const !== undefined && JSON.stringify(schema.const) !== JSON.stringify(data)) e.push("const");
  if (typeof data === "string") {
    if (schema.minLength !== undefined && data.length < schema.minLength) e.push("minLength");
    if (schema.maxLength !== undefined && data.length > schema.maxLength) e.push("maxLength");
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(data)) e.push("pattern");
  }
  if (typeof data === "number" && schema.minimum !== undefined && data < schema.minimum) e.push("minimum");
  if (Array.isArray(data)) {
    if (schema.minItems !== undefined && data.length < schema.minItems) e.push("minItems");
    if (schema.items) for (const it of data) e.push(...schemaErrors(schema.items, it, root));
  }
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    for (const r of schema.required || []) if (!(r in data)) e.push(`obrigatório: ${r}`);
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(data)) {
      if (props[k]) e.push(...schemaErrors(props[k], v, root));
      else if (schema.additionalProperties === false) e.push(`adicional: ${k}`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === "object") e.push(...schemaErrors(schema.additionalProperties, v, root));
    }
  }
  for (const s of schema.allOf || []) e.push(...schemaErrors(s, data, root));
  if (schema.if !== undefined) {
    const condOK = schemaErrors(schema.if, data, root).length === 0;
    if (condOK && schema.then !== undefined) e.push(...schemaErrors(schema.then, data, root));
    if (!condOK && schema.else !== undefined) e.push(...schemaErrors(schema.else, data, root));
  }
  return e;
}

test("o validador mínimo de schema deteta invalidez (não é trivialmente permissivo)", () => {
  const ing = read("contracts/10e/ingestion-proposal.schema.json");
  assert.ok(schemaErrors(ing, {}, ing).length > 0, "lote vazio deve ser inválido");
  const rights = read("contracts/10e/rights-assessment.schema.json");
  const dim = (d) => ({ decision: d, basis: "b", evidence: "e", responsible: "r", date: "2026-08-11" });
  const raAllow = { assertionId: "a", copyright: dim("allow"), consent: dim("allow"), license: dim("allow"), thirdPartyMaterial: dim("allow"), apiExposure: dim("allow") };
  assert.ok(schemaErrors(rights, raAllow, rights).length > 0, "apiExposure:allow deve ser inválido no schema");
  assert.ok(schemaErrors(rights, { ...raAllow, apiExposure: { decision: "allow", basis: "b" } }, rights).length > 0, "allow incompleto inválido");
  const audit = read("contracts/10e/audit-event.schema.json");
  assert.ok(schemaErrors(audit, { id: "e", entityType: "assertion", entityId: "a", action: 7, actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r", decisionRefs: [] }, audit).length > 0, "action numérico inválido");
});

test("INVARIÁVEL DE SEGURANÇA: se o núcleo devolve valid:true, a estrutura é válida no contrato estático", async () => {
  const KI = await import("../src/proteus/knowledge-ingestion.mjs");
  const EW = await import("../src/proteus/editorial-workflow.mjs");
  const ingSchema = read("contracts/10e/ingestion-proposal.schema.json");
  const rightsSchema = read("contracts/10e/rights-assessment.schema.json");
  const auditSchema = read("contracts/10e/audit-event.schema.json");

  // (a) Ingestão — cada proposta candidata: se o LOTE é aceite pelo núcleo, tem de validar no schema.
  const scope = { includedSources: ["src-in"], excludedSources: ["src-out"], canonicalIds: ["a10c1-001"], paginatedSources: [] };
  const L = (extra = {}) => ({ id: "l", sourceId: "src-in", locatorType: "whole_resource", accessedAt: "2026-08-11", ...extra });
  const P = (o) => ({ id: "p", text: "t", language: "pt-PT", epistemicClass: "fact_claim", sourceId: "src-in", locator: L(), confidence: { level: "supported", reasons: ["r"], limitations: [] }, proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", ...o });
  const candidates = [
    P({}),
    P({ sourceVersion: "2.ª ed. 2019" }),
    P({ entityIds: ["e1", "e2"] }),
    P({ aiAssisted: true, transformation: "paraphrase", tool: "t", toolVersion: "1", hash: "sha256:x" }),
    P({ quotation: "trecho", quotationRightsApproved: true, locator: L({ quotation: "trecho", quotationRightsApproved: true }) }),
    P({ locator: L({ locatorType: "page", pageStart: 42, label: "PDF 42" }) }),
    P({ locator: L({ locatorType: "url_snapshot", url: "https://exemplo.invalid/x", notes: "volátil" }) }),
    P({ confidence: { level: "limited", reasons: ["a", "b"], limitations: ["c"] } }),
    // núcleo-inválidas (devem ser ignoradas pela invariável; não asseguram nada no schema):
    P({ aiAssisted: "yes" }), P({ entityIds: [7] }), P({ locator: L({ id: 7 }) }), P({ confidence: { level: "supported", reasons: ["r"] } }),
    P({ sourceId: "src-out" }), P({ id: "a10c1-001" }),
  ];
  let coreValidCount = 0;
  for (const c of candidates) {
    const batch = { batchId: "b", proposedBy: "op", proposedAt: "2026-08-11T00:00:00Z", items: [c] };
    if (KI.validateBatch(batch, scope).valid) {
      coreValidCount++;
      assert.deepEqual(schemaErrors(ingSchema, batch, ingSchema), [], `ingestão núcleo-válida tem de validar no schema: ${JSON.stringify(c)}`);
    }
  }
  assert.ok(coreValidCount >= 8, `esperadas >=8 propostas núcleo-válidas, obtidas ${coreValidCount}`);

  // (b) Direitos — cada avaliação núcleo-válida tem de validar no schema.
  const dim = (d, x = {}) => ({ decision: d, ...x });
  const full = { decision: "allow", basis: "b", evidence: "e", responsible: "r", date: "2026-08-11" };
  const rightsCandidates = [
    { assertionId: "a", copyright: full, consent: full, license: full, thirdPartyMaterial: full, apiExposure: dim("deny") },
    { assertionId: "a", copyright: dim("deny"), consent: dim("unknown"), license: dim("deny", { notes: "n" }), thirdPartyMaterial: dim("deny", { basis: "b" }), apiExposure: dim("deny") },
    { assertionId: "a", copyright: full, consent: dim("deny"), license: full, thirdPartyMaterial: full, apiExposure: dim("unknown") },
    // núcleo-inválidas:
    { assertionId: "a", copyright: full, consent: full, license: full, thirdPartyMaterial: full, apiExposure: dim("allow", { basis: "b", evidence: "e", responsible: "r", date: "2026-08-11" }) },
    { assertionId: "a", copyright: dim("deny", { basis: 123 }), consent: full, license: full, thirdPartyMaterial: full, apiExposure: dim("deny") },
  ];
  let rc = 0;
  for (const r of rightsCandidates) if (EW.validateRightsAssessment(r).valid) { rc++; assert.deepEqual(schemaErrors(rightsSchema, r, rightsSchema), [], `direitos núcleo-válidos têm de validar no schema: ${JSON.stringify(r)}`); }
  assert.ok(rc >= 3, `esperadas >=3 avaliações núcleo-válidas, obtidas ${rc}`);

  // (c) Auditoria — cada evento núcleo-válido tem de validar no schema.
  const A = (o) => ({ id: "e", entityType: "assertion", entityId: "a", action: "propose", actorId: "op", at: "2026-08-12T00:00:00Z", reason: "r", decisionRefs: [], ...o });
  const auditCandidates = [A({}), A({ fromState: "in_review", toState: "approved" }), A({ fromState: null, toState: null }), A({ decisionRefs: ["ref-1"] }), A({ action: 7 }), A({ id: 7 }), A({ decisionRefs: [""] })];
  let ac = 0;
  for (const ev of auditCandidates) { const r = EW.buildAuditEvent(ev); if (r.valid) { ac++; assert.deepEqual(schemaErrors(auditSchema, r.event, auditSchema), [], `auditoria núcleo-válida tem de validar no schema: ${JSON.stringify(ev)}`); } }
  assert.ok(ac >= 4, `esperados >=4 eventos núcleo-válidos, obtidos ${ac}`);
});

test("build-review-packet recusa escrita através de diretório-pai symlink", () => {
  const base = mkdtempSync(join(tmpdir(), "10e-symlink-"));
  try {
    const realDir = join(base, "real");
    mkdirSync(realDir);
    const linkDir = join(base, "link");
    symlinkSync(realDir, linkDir);
    let blocked = false;
    try {
      execFileSync(process.execPath, ["scripts/10e/build-review-packet.mjs", "--output", join(linkDir, "packet.json")], { stdio: "pipe" });
    } catch {
      blocked = true;
    }
    assert.ok(blocked, "escrita através de diretório-pai symlink deve ser recusada");
    assert.equal(existsSync(join(realDir, "packet.json")), false, "nada deve ter sido escrito através do symlink");
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});
