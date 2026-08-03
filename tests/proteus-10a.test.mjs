/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");

test("direitos são multidimensionais com negação por defeito e 'unknown' = 'denied'", () => {
  const r = read("contracts/10a/rights-access-policy.json");
  assert.equal(r.default, "deny");
  assert.equal(r.publicEligibility.unknownBehavesAs, "denied");
  for (const d of ["store_file", "extract_ocr", "create_embeddings", "publish_fulltext", "redistribute", "expose_api_mcp", "model_training"]) {
    assert.ok(r.dimensions.includes(d), `dimensão ${d}`);
  }
});

test("classes epistémicas incluem facto, interpretação, hipótese, memória, inferência e desconhecido", () => {
  const enumv = read("contracts/10a/knowledge-assertion.schema.json").properties.classification.enum;
  for (const c of ["facto_documentado", "interpretacao", "hipotese", "memoria_testemunho", "inferencia_proteus", "desconhecido"]) {
    assert.ok(enumv.includes(c), c);
  }
});

test("resposta pública futura tem estados honestos (insuficiente/restrito/fora de âmbito)", () => {
  const s = read("contracts/10a/public-answer.schema.json").properties.status.enum;
  for (const st of ["answered", "limited", "insufficient_evidence", "rights_restricted", "out_of_scope"]) assert.ok(s.includes(st), st);
});

test("contrato MCP é futuro, não implementado, sem acesso direto a BD/documentos restritos", () => {
  const m = read("contracts/10a/future-mcp-contract.json");
  assert.equal(m.contractStatus, "future-not-implemented");
  assert.equal(m.directDatabaseAccess, false);
  assert.equal(m.restrictedDocumentAccess, false);
});

test("apresentação pública do Proteus é honesta: tudo em preparação, nada disponível", () => {
  const o = read("public/data/proteus-overview.json");
  assert.ok(o.futureExperiences.every((x) => x.status === "em-preparacao"));
  assert.equal(o.externalResources.length, 0);
  assert.equal(o.futureMcp.status, "future-not-implemented");
  assert.equal(o.rights.default, "deny");
  assert.equal(o.knowledgeClasses.length, 6);
  assert.match(o.availabilityNotice, /nenhuma consulta|api|chat/i);
});

test("a vista não simula chat/consulta nem promete funções disponíveis", () => {
  const portal = text("src/views/portal.js");
  assert.match(portal, /Em preparação/);
  assert.doesNotMatch(portal, /Pergunte já|Consultar agora/i);
});

test("recurso externo separa fornecedor e direitos; Património 360 não é apropriado", () => {
  const er = read("contracts/10a/external-resource.schema.json");
  for (const f of ["provider", "rightsStatus", "publicUrl"]) assert.ok(er.required.includes(f), f);
  const o = read("public/data/proteus-overview.json");
  assert.match(o.externalResourcesNote, /Património Cultural, I\.P\.|decisão humana/);
});

test("10A não introduz PDFs, embeddings, segredos, MCP, migrations nem permissões", () => {
  assert.equal(read("public/data/collaborative-modules.json").modules.length, 26);
  assert.equal(read("public/data/collaborative-roles-permissions.json").permissions.length, 152);
  // Preservação de 09D/09E/09F.
  assert.ok(text("public/config/seo.runtime.json").length > 0);
  assert.ok(text("public/data/locale-availability.json").length > 0);
  assert.match(text("src/views/museum.js"), /fetchpriority="high"/);
});
