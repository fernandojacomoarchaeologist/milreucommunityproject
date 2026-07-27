/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const contract = read("public/data/role-access-matrix.json");
const matrix = read("reports/role-access-matrix-08p.json");
const modules = read("public/data/collaborative-modules.json").modules;
const roles = read("public/data/collaborative-roles-permissions.json");

test("a matriz cobre os 13 perfis do contrato", () => {
  assert.equal(matrix.matrix.length, contract.profilesToMap.length);
  const codes = new Set(matrix.matrix.map((m) => m.profile));
  for (const p of contract.profilesToMap) assert.ok(codes.has(p), `perfil ausente: ${p}`);
});

test("os perfis não-ativos veem 0 módulos internos", () => {
  for (const p of ["anonymous", "authenticated-without-membership", "pending", "suspended", "removed"]) {
    const row = matrix.matrix.find((m) => m.profile === p);
    assert.equal(row.menuModuleCount, 0, `${p} não devia ver módulos`);
  }
});

test("a visibilidade de menu deriva das permissões reais", () => {
  const has = (role, perm) => (roles.rolePermissions[role] || []).includes("*") || (roles.rolePermissions[role] || []).includes(perm);
  const volunteer = matrix.matrix.find((m) => m.profile === "volunteer");
  const expected = modules.filter((mod) => has("volunteer", mod.permission)).map((mod) => mod.code);
  assert.deepEqual(volunteer.menuModules, expected);
  const owner = matrix.matrix.find((m) => m.profile === "project-owner");
  assert.equal(owner.menuModuleCount, modules.length, "o dono do projeto (master) vê todos os módulos");
});

test("a matriz declara as camadas e a fonte real", () => {
  assert.deepEqual(matrix.layers, contract.layers);
  assert.equal(contract.mustUseRealRepositoryPermissions, true);
  assert.equal(matrix.totals.permissions, roles.permissions.length);
});
