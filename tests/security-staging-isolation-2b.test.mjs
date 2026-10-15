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
