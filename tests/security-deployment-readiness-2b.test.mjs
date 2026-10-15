/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2B — deployment-readiness.json: em produção o site só publica o resumo (sem nomes de variáveis,
 * checks de configuração nem bloqueios); o detalhe fica em reports/ (não publicado). Local/staging inalterados.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function runProfile(environment) {
  const dir = mkdtempSync(join(tmpdir(), "milreu-readiness-"));
  mkdirSync(join(dir, "public/data"), { recursive: true });
  mkdirSync(join(dir, "public/config"), { recursive: true });
  cpSync("public/data/collaborative-homologation-model.json", join(dir, "public/data/collaborative-homologation-model.json"));
  const env = { PATH: process.env.PATH, MILREU_ENVIRONMENT: environment, MILREU_SITE_URL: "https://projectomilreu.pt" };
  execFileSync(process.execPath, [join(process.cwd(), "scripts/deploy/build-deployment-profile.mjs")], { cwd: dir, env, stdio: "pipe" });
  const read = path => (existsSync(join(dir, path)) ? JSON.parse(readFileSync(join(dir, path), "utf8")) : null);
  return { published: read("public/data/deployment-readiness.json"), internal: read(`reports/deployment-readiness-${environment}.json`), raw: readFileSync(join(dir, "public/data/deployment-readiness.json"), "utf8") };
}

test("produção: o ficheiro publicado só tem o resumo", () => {
  const { published, internal, raw } = runProfile("production");
  assert.deepEqual(Object.keys(published).sort(), ["_copyright", "environment", "generatedAt", "notice", "redacted", "status", "version"]);
  assert.equal(published.redacted, true);
  assert.equal(published.environment, "production");
  assert.doesNotMatch(raw, /MILREU_|SUPABASE|OAuth|master|blockingItems|checks/i);
  // O detalhe continua disponível para o CI/homologação, fora do site.
  assert.ok(internal?.checks && Array.isArray(internal.blockingItems));
  assert.equal(internal.status, published.status);
});

test("local: comportamento inalterado (detalhe completo, sem relatório extra)", () => {
  const { published, internal } = runProfile("local");
  assert.ok(published.checks && Array.isArray(published.blockingItems));
  assert.equal(published.redacted, undefined);
  assert.equal(internal, null);
});

test("reports/ não é publicado pelo build", () => {
  const build = readFileSync("scripts/build.mjs", "utf8");
  const copied = build.match(/for\(const item of (\[[^\]]+\])\)/)[1];
  assert.doesNotMatch(copied, /reports/);
});

test("painel interno mostra a nota quando o resumo é redigido", () => {
  assert.match(readFileSync("src/views/collaborative-deployment.js", "utf8"), /readiness\.redacted\?/);
});
