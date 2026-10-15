/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2B — L1-08/09: o preflight B2 não afirma mais do que prova e não expõe valores.
 * Simulação dos estados por cenário: scripts/security/simulate-preflight-b2.py (requer PyYAML + jq).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const wf = readFileSync(".github/workflows/l1-08-production-secrets-preflight.yml", "utf8");
// Código sem comentários (os comentários explicam as regras e citam os comandos proibidos).
const code = wf.split("\n").filter(line => !/^\s*#/.test(line)).join("\n");
const runBlocks = [...wf.matchAll(/run: \|\n([\s\S]*?)(?=\n {6}- |\n*$)/g)].map(m => m[1]);

test("só leitura: sem checkout, sem deploy, sem escrita de secrets, CLI fixado por SHA", () => {
  assert.doesNotMatch(wf, /actions\/checkout/);
  assert.doesNotMatch(code, /supabase (functions deploy|secrets set|secrets unset|db push)/);
  assert.match(wf, /supabase\/setup-cli@[0-9a-f]{40} # v/);
  assert.match(wf, /environment: production/);
  assert.match(wf, /permissions:\n {2}contents: read/);
});

test("input só por variável de ambiente; nunca interpolado em run", () => {
  assert.ok(runBlocks.length >= 5);
  for (const block of runBlocks) assert.doesNotMatch(block, /\$\{\{\s*(inputs|github\.event|secrets)\./, block.slice(0, 80));
  assert.match(wf, /CONFIRMATION: \$\{\{ inputs\.confirmation \}\}/);
});

test("higiene: sem set -x e sem eco de valores", () => {
  assert.doesNotMatch(code, /set -x|set -o xtrace/);
  assert.doesNotMatch(wf, /echo[^\n]*\$\{?(S_[A-Z_]+|SUPABASE_ACCESS_TOKEN|RESEND_KEY|PROJECT_REF)\}?/);
  assert.doesNotMatch(wf, /echo[^\n]*\$\{!var\}/);
});

test("estados honestos: VERIFIED / NOT VERIFIED / UNKNOWN, sem falso positivo de âmbito", () => {
  for (const state of ["VERIFIED", "NOT\\ VERIFIED", "UNKNOWN", "FAIL"]) assert.ok(wf.includes(state), state);
  // Uma lista com 1 só projecto não prova âmbito limitado (conta com 1 projecto + token clássico).
  assert.match(wf, /Token limitado a um só projecto" UNKNOWN/);
  assert.doesNotMatch(wf, /só vê o projecto configurado/);
  // Escritas e domínio do Resend nunca aparecem como verificados.
  assert.match(wf, /Read-write \(deploy\)" NOT\\ VERIFIED/);
  assert.match(wf, /domínio do remetente" NOT\\ VERIFIED/);
  assert.match(wf, /GITHUB_STEP_SUMMARY/);
});
