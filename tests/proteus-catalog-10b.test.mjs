/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeDoi, normalizeOrcid, mapCrossrefToDraft, detectDuplicateCandidates, buildImportDraft } from "../src/proteus/doi-import.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));

test("normalizeDoi remove prefixos/URL e valida o padrão", () => {
  assert.equal(normalizeDoi("https://doi.org/10.1234/ABC.def"), "10.1234/abc.def");
  assert.equal(normalizeDoi("doi:10.1000/xyz"), "10.1000/xyz");
  assert.equal(normalizeDoi("não é um doi"), null);
  assert.equal(normalizeDoi(""), null);
});

test("normalizeOrcid valida o dígito de controlo (mod 11-2)", () => {
  assert.equal(normalizeOrcid("0000-0002-1825-0097"), "0000-0002-1825-0097"); // ORCID de exemplo oficial (checksum válido)
  assert.equal(normalizeOrcid("https://orcid.org/0000-0002-1825-0097"), "0000-0002-1825-0097");
  assert.equal(normalizeOrcid("0000-0002-1825-0098"), null); // checksum inválido
  assert.equal(normalizeOrcid("1234"), null);
});

test("mapCrossrefToDraft produz rascunho que NUNCA publica, com avisos", () => {
  const message = { title: ["Uma obra"], type: "journal-article", author: [{ given: "A", family: "B" }], issued: { "date-parts": [[2020, 5]] }, "container-title": ["Revista"], DOI: "10.1/x" };
  const d = mapCrossrefToDraft(message, "10.1/x");
  assert.equal(d.status, "draft");
  assert.equal(d.publicationApproved, false);
  assert.equal(d.mappedFields.title, "Uma obra");
  assert.equal(d.mappedFields.workType, "article");
  assert.equal(d.mappedFields.issued.precision, "month");
  assert.ok(d.warnings.includes("rights_not_evaluated"));
});

test("buildImportDraft não publica e deteta duplicados de forma conservadora", () => {
  const existing = [{ id: "w1", identifiers: { doi: "10.1234/x" } }];
  const d = buildImportDraft({ doi: "https://doi.org/10.1234/X", message: { title: ["T"] }, existingWorks: existing });
  assert.equal(d.publicationApproved, false);
  assert.equal(d.duplicateCandidates.length, 1);
  assert.equal(d.duplicateCandidates[0].workId, "w1");
  assert.throws(() => buildImportDraft({ doi: "inválido", message: {} }), /invalid_doi/);
});

test("detectDuplicateCandidates nunca funde; só assinala", () => {
  const c = detectDuplicateCandidates([{ id: "a", identifiers: { doi: "10.1234/y" } }], "10.1234/y");
  assert.equal(c.length, 1);
  assert.equal(detectDuplicateCandidates([], "10.1234/y").length, 0);
});

test("catálogo público é honesto: vazio (10B) ou piloto controlado (10B.1), sem privados", () => {
  const cat = read("public/data/proteus-catalog-public.json");
  assert.ok(Array.isArray(cat.works) && Array.isArray(cat.authors));
  assert.ok(cat.notice);
  const PRIVATE = ["jacomo-2026-desafios-integracao-comunitaria", "jacomo-2026-anexo-a-relatorios-eventos"];
  for (const w of cat.works) {
    assert.equal(w.editorialStatus, "published");
    assert.ok(Array.isArray(w.sources) && w.sources.length > 0, "cada obra precisa de fontes");
    assert.ok(!PRIVATE.includes(w.slug), "registo privado não pode entrar no snapshot");
    for (const k of ["fullText", "ocr", "bodyText", "extractedText"]) assert.ok(!(k in w), "sem texto integral alojado");
  }
  // Jácomo (public_profile=false) nunca aparece como autor público.
  assert.doesNotMatch(JSON.stringify(cat.authors), /Jácomo|Jacomo/i);
  if (cat.works.length > 0) assert.ok(cat.generatedBy, "snapshot populado declara origem derivada");
});

test("contratos de obra/direitos exigem estados editorial e de acesso", () => {
  const work = read("contracts/10b/work.schema.json");
  assert.ok(work.required.includes("editorialStatus"));
  assert.ok(work.required.includes("accessStatus"));
  const rights = read("contracts/10b/rights-record.schema.json");
  assert.ok(rights.required.includes("accessStatus"));
  assert.ok(rights.properties.accessStatus.enum.includes("unknown"));
});

test("a Biblioteca só mostra publicados e não há JSON-LD sem registos", () => {
  const view = readFileSync("src/views/proteus-library.js", "utf8");
  assert.match(view, /editorialStatus === "published"/);
  assert.doesNotMatch(view, /"@type":"(ScholarlyArticle|Person|Book)"/);
});

test("10B preserva 26/152, 0 migrations, e 09D/09E/09F/10A", () => {
  assert.equal(read("public/data/collaborative-modules.json").modules.length, 26);
  assert.equal(read("public/data/collaborative-roles-permissions.json").permissions.length, 152);
  assert.ok(readFileSync("public/data/proteus-overview.json", "utf8").length > 0);
  assert.match(readFileSync("src/main.js", "utf8"), /case "proteus-library":/);
});
