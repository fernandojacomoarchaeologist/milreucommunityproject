/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2B — L1-08/09: nenhum workflow de staging pode receber o token Supabase de produção,
 * mesmo que o staging venha a ser activado e o secret ainda exista ao nível do repositório.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const dir = ".github/workflows";
const workflows = readdirSync(dir).filter(name => /\.ya?ml$/.test(name)).map(name => ({ name, text: readFileSync(`${dir}/${name}`, "utf8") }));

test("SUPABASE_ACCESS_TOKEN de produção só em jobs do environment production", () => {
  for (const { name, text } of workflows.filter(w => /secrets\.SUPABASE_ACCESS_TOKEN\b/.test(w.text))) {
    assert.match(text, /^\s+environment:\s*production\s*$/m, `${name}: usa o token de produção fora de environment: production`);
    assert.doesNotMatch(text, /^\s+environment:\s*staging\s*$/m, `${name}: job de staging com o token de produção`);
  }
});

test("workflows de staging usam credenciais próprias de staging", () => {
  const staging = workflows.filter(w => /^\s+environment:\s*staging\s*$/m.test(w.text));
  assert.ok(staging.length >= 3);
  for (const { name, text } of staging) {
    assert.doesNotMatch(text, /secrets\.SUPABASE_ACCESS_TOKEN\b/, name);
    if (/supabase (link|functions deploy|db push)/.test(text)) assert.match(text, /secrets\.STAGING_SUPABASE_ACCESS_TOKEN\b/, name);
  }
});

// Cobertura alargada (2026-10-15): todas as credenciais de produção, não só o token do CLI.
const PRODUCTION_CREDENTIALS = ["SUPABASE_ACCESS_TOKEN", "SUPABASE_DB_PASSWORD", "SUPABASE_SERVICE_ROLE_KEY", "EXPOR_RESEND_API_KEY"];
// Único workflow que escolhe o environment por input (production/staging): os secrets resolvem-se
// por environment e NUNCA podem existir ao nível do repositório (plano L1-08/09, R4).
const DYNAMIC_ENVIRONMENT = new Set(["08i-retention-apply.yml"]);

test("nenhum job de staging referencia credenciais de produção", () => {
  for (const { name, text } of workflows.filter(w => /^\s+environment:\s*staging\s*$/m.test(w.text))) {
    for (const credential of PRODUCTION_CREDENTIALS) assert.doesNotMatch(text, new RegExp(`secrets\\.${credential}\\b`), `${name}: ${credential}`);
  }
});

test("credenciais de produção só em environment production (ou no único workflow de environment dinâmico)", () => {
  for (const { name, text } of workflows) {
    const uses = PRODUCTION_CREDENTIALS.filter(credential => new RegExp(`secrets\\.${credential}\\b`).test(text));
    if (!uses.length) continue;
    if (DYNAMIC_ENVIRONMENT.has(name)) {
      assert.match(text, /environment:\s*\$\{\{\s*inputs\.environment\s*\}\}/, name);
      assert.match(text, /options:\s*\n\s*- staging\s*\n\s*- production|inputs\.environment == 'production'/, name);
      continue;
    }
    assert.match(text, /^\s+environment:\s*production\s*$/m, `${name}: ${uses.join(", ")} fora de environment: production`);
  }
});

test("nenhuma credencial é escolhida com fallback entre environments (|| entre secrets)", () => {
  for (const { name, text } of workflows) assert.doesNotMatch(text, /secrets\.[A-Z_]+\s*\|\|\s*secrets\./, name);
});
