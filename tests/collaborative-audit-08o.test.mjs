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

const contract = read("public/data/collaborative-post-merge-audit.json");
const results = read("reports/collaborative-audit-08o.json");

test("a auditoria cobre os 10 itens do contrato com estados permitidos", () => {
  const allowed = new Set(contract.allowedStatuses);
  const byCode = new Map(results.items.map((i) => [i.code, i]));
  for (const code of contract.items) {
    const item = byCode.get(code);
    assert.ok(item, `item ausente: ${code}`);
    assert.ok(allowed.has(item.status), `estado inválido em ${code}`);
    assert.ok(item.evidence, `${code} sem evidência`);
    assert.ok(item.sourceMapping, `${code} sem mapeamento de origem`);
    assert.ok(Array.isArray(item.files) && item.files.length > 0, `${code} sem ficheiros`);
    assert.ok(item.test, `${code} sem teste`);
    if (item.status === "blocked") assert.ok(item.blocker, `${code} bloqueado sem justificação`);
  }
});

test("o contrato e o resultado não introduzem módulos, permissões ou migrations", () => {
  assert.equal(contract.newModulesExpected, 0);
  assert.equal(contract.newPermissionsExpected, 0);
  assert.equal(contract.newMigrationsExpected, 0);
  const modules = read("public/data/collaborative-modules.json").modules;
  const permissions = read("public/data/collaborative-roles-permissions.json").permissions;
  assert.equal(results.moduleCount, modules.length);
  assert.equal(results.permissionCount, permissions.length);
});

test("a Formação mostra apenas o percurso Fundamentos na UI do voluntário", () => {
  const view = text("src/views/collaborative-museum-review.js");
  assert.match(view, /VOLUNTEER_VISIBLE_TRAINING_CODES\s*=\s*\["project-foundations"\]/);
  // os restantes percursos continuam no backend (dataset intacto)
  const trails = read("public/data/collaborative-training-trails.json").trails;
  assert.ok(trails.length >= 5, "os percursos de formação devem permanecer no backend");
});

test("a revisão do Museu é protegida por permissão e RLS interna (sem anon)", () => {
  const view = text("src/views/collaborative-museum-review.js");
  assert.match(view, /hasPermission\(context,"museum\.review\.view"\)/);
  const rls = text("supabase/migrations/20260724120000_collaborative_museum_review_foundation.sql");
  assert.ok(rls.includes("enable row level security"));
  assert.ok(!/\bto anon\b/.test(rls), "a revisão do Museu não deve conceder acesso a anon");
});

test("o service_role nunca é permitido no browser", () => {
  const config = text("src/collab/config.js");
  assert.match(config, /service_role no navegador/);
});

test("as superfícies sensíveis recusam o modo demo (sem fixtures como reais)", () => {
  const controller = text("src/collab/controller.js");
  assert.ok(controller.includes("participação contínua opera apenas em staging real"));
  assert.ok(controller.includes("integração pública opera apenas em staging real"));
  assert.ok(controller.includes("operação e governação operam apenas em staging real"));
});
