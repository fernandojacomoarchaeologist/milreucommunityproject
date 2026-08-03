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

test("contratos: candidatos privados, decisão do master, menores bloqueados, sem OAuth", () => {
  assert.equal(read("public/data/opportunity-model.json").publicApplicantDataAllowed, false);
  assert.equal(read("public/data/opportunity-model.json").minorApplicationsDefault, "blocked-until-policy");
  assert.equal(read("public/data/opportunity-application-model.json").decisionOwner, "project-owner-master");
  assert.equal(read("public/data/opportunity-application-model.json").automaticWaitlist, false);
  assert.equal(read("public/data/opportunity-sharing-model.json").socialOAuthRequired, false);
});

test("módulo e permissões registados (26 módulos, 152 permissões)", () => {
  const modules = read("public/data/collaborative-modules.json").modules;
  const perms = read("public/data/collaborative-roles-permissions.json").permissions;
  assert.equal(modules.length, 26);
  assert.equal(perms.length, 152);
  assert.ok(modules.some((m) => m.code === "opportunities"));
  for (const p of ["opportunities.view", "opportunities.apply", "opportunities.manage"]) assert.ok(perms.includes(p));
});

test("snapshot público começa vazio e honesto (sem oportunidades inventadas)", () => {
  const snap = read("public/data/opportunities-public.json");
  assert.deepEqual(snap.opportunities, []);
  assert.ok(snap.notice);
});

test("migrations: RLS anon só de public+published; candidatos não anon; menores bloqueados", () => {
  const foundation = text("supabase/migrations/20260730100000_opportunities_foundation.sql");
  assert.match(foundation, /for select to anon\s+using \(visibility='public' and status='published'\)/);
  assert.doesNotMatch(foundation, /grant select on public\.collab_opportunity_applications to [^;]*anon/);
  assert.match(foundation, /minors_allowed boolean not null default false/);
  const rpc = text("supabase/migrations/20260730100100_opportunities_rpc.sql");
  assert.match(rpc, /minors_policy_pending/);
  assert.match(rpc, /reason_required/);
});

test("rotas públicas e partilha sem OAuth", () => {
  assert.match(text("src/lib/router.js"), /public-opportunit/);
  assert.match(text("src/main.js"), /bindOpportunityShare/);
  assert.doesNotMatch(text("src/views/opportunities-public.js"), /oauth|graph\.facebook/i);
});
