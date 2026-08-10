/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10D — testes do núcleo puro da API pública e dos exports gerados. Prova a elegibilidade
 * fail-closed, a allowlist de campos, o determinismo, a não-revelação de itens excluídos e que os
 * seis exports reais começam com zero itens, mesmo existindo obras publicadas no catálogo humano.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  isApiEligible, apiExposureDecision, projectFields, buildCollection, buildIndex, sortItems,
  COLLECTIONS, FIELD_ALLOWLIST
} from "../src/proteus/public-api.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));

// Fixture sintética elegível (apenas nos testes; nunca dados reais).
const eligibleWork = {
  id: "w-1", slug: "obra-teste", title: "Obra de teste", workType: "article", issuedYear: 2008,
  editorialStatus: "published", apiExposure: "allow", lastReviewed: "2026-08-01",
  sources: [{ label: "Fonte pública", url: "https://example.org/x" }],
  internalNote: "NÃO DEVE APARECER", contactEmail: "oculto@example.invalid"
};

test("elegibilidade fail-closed: só published + fonte + revisão + apiExposure 'allow'", () => {
  assert.equal(isApiEligible(eligibleWork), true);
  assert.equal(isApiEligible({ ...eligibleWork, apiExposure: undefined }), false, "sem permissão API");
  assert.equal(isApiEligible({ ...eligibleWork, apiExposure: "deny" }), false, "deny");
  assert.equal(isApiEligible({ ...eligibleWork, apiExposure: "unknown" }), false, "unknown");
  assert.equal(isApiEligible({ ...eligibleWork, editorialStatus: "in_review" }), false, "in_review");
  assert.equal(isApiEligible({ ...eligibleWork, editorialStatus: "draft" }), false, "draft");
  assert.equal(isApiEligible({ ...eligibleWork, sources: [] }), false, "sem fonte pública");
  assert.equal(isApiEligible({ ...eligibleWork, lastReviewed: undefined }), false, "sem revisão");
  assert.equal(isApiEligible(null), false);
});

test("apiExposureDecision resolve ausência como 'unknown'", () => {
  assert.equal(apiExposureDecision({}), "unknown");
  assert.equal(apiExposureDecision({ rights: { apiExposure: "allow" } }), "allow");
  assert.equal(apiExposureDecision({ apiExposure: "deny" }), "deny");
});

test("projectFields aplica allowlist e descarta campos privados", () => {
  const p = projectFields("works", eligibleWork);
  for (const k of Object.keys(p)) assert.ok([...FIELD_ALLOWLIST.works, "lastReviewed"].includes(k), `campo inesperado: ${k}`);
  assert.equal(p.internalNote, undefined);
  assert.equal(p.contactEmail, undefined);
  assert.equal(p.title, "Obra de teste");
});

test("buildCollection com item elegível devolve envelope 'ok' com 1 item allowlisted", () => {
  const env = buildCollection("works", [eligibleWork], { repositoryVersion: "0.39.0" });
  assert.equal(env.status, "ok");
  assert.equal(env.pagination.total, 1);
  assert.equal(env.items.length, 1);
  assert.equal(env.items[0].contactEmail, undefined);
  assert.equal(env.rights.default, "deny");
});

test("buildCollection sem elegíveis é 'empty' e NÃO revela o item excluído", () => {
  const secret = { id: "SEGREDO-42", slug: "titulo-secreto", title: "Título Secreto Excluído", editorialStatus: "in_review", apiExposure: "deny", sources: [], lastReviewed: null };
  const env = buildCollection("works", [secret], { repositoryVersion: "0.39.0" });
  assert.equal(env.status, "empty");
  assert.equal(env.pagination.total, 0);
  assert.deepEqual(env.items, []);
  const blob = JSON.stringify(env);
  assert.ok(!blob.includes("SEGREDO-42"), "id excluído não pode aparecer");
  assert.ok(!blob.includes("Título Secreto"), "título excluído não pode aparecer");
});

test("ordenação e paginação deterministas", () => {
  const items = [
    { ...eligibleWork, id: "w-3", slug: "c" }, { ...eligibleWork, id: "w-1", slug: "a" }, { ...eligibleWork, id: "w-2", slug: "b" }
  ];
  const a = buildCollection("works", items, { pageSize: 2, page: 1 });
  const b = buildCollection("works", items, { pageSize: 2, page: 1 });
  assert.deepEqual(a, b, "duas construções idênticas");
  assert.deepEqual(a.items.map((x) => x.id), ["w-1", "w-2"]);
  assert.equal(a.pagination.totalPages, 2);
  const page2 = buildCollection("works", items, { pageSize: 2, page: 2 });
  assert.deepEqual(page2.items.map((x) => x.id), ["w-3"]);
});

test("os seis exports reais gerados começam VAZIOS", () => {
  const index = read("public/api/proteus/v1/index.json");
  assert.equal(index.readOnly, true);
  assert.equal(index.transport, "static-json");
  assert.equal(index.resources.length, 5);
  for (const r of index.resources) assert.equal(r.count, 0, `${r.resource} deve ter count 0`);
  for (const type of COLLECTIONS) {
    const env = read(`public/api/proteus/v1/${type}.json`);
    assert.equal(env.resource, type);
    assert.equal(env.status, "empty");
    assert.equal(env.pagination.total, 0);
    assert.deepEqual(env.items, []);
    assert.equal(env.rights.default, "deny");
  }
});

test("catálogo humano tem obras publicadas mas works.json permanece vazio (gate de direitos separado)", () => {
  const catalog = read("public/data/proteus-catalog-public.json");
  const published = (catalog.works || []).filter((w) => w.editorialStatus === "published" || w.published === true);
  assert.ok(published.length >= 1, "o catálogo humano tem pelo menos uma obra publicada");
  const worksApi = read("public/api/proteus/v1/works.json");
  assert.equal(worksApi.pagination.total, 0, "nenhuma obra é exposta por API sem permissão explícita");
});

test("exports não contêm texto integral, OCR, URLs privadas nem segredos", () => {
  for (const f of ["index", ...COLLECTIONS]) {
    const blob = readFileSync(`public/api/proteus/v1/${f}.json`, "utf8");
    assert.ok(!/"fullText"|"ocr"|"bodyText"|-----BEGIN [A-Z ]*PRIVATE KEY-----|service_role/.test(blob), `${f}.json não pode conter conteúdo sensível`);
  }
});
