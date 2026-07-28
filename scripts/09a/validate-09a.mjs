/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09A — validação (node, sem Playwright) da fundação de qualidade:
 * contratos, configuração Playwright, cenários migrados, fallback no-JS,
 * progressive enhancement, harness legado preservado e paridade registada.
 */
import { readFileSync, existsSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`09A: ${m}`); };
const need = (p) => { if (!existsSync(p)) fail(`ficheiro em falta: ${p}`); };

const EXPECTED = "0.29.0";

// 1. Contratos
const migration = read("public/data/playwright-migration-model.json");
if (migration.version !== EXPECTED) fail("versão do contrato de migração incorreta.");
if (migration.primaryHarness !== "playwright") fail("harness primário deve ser playwright.");
if (migration.legacyHarnessRemovalAllowed !== false) fail("remoção do harness legado não pode ser permitida.");
const visual = read("public/data/visual-baseline-model.json");
if (visual.version !== EXPECTED) fail("versão do modelo visual incorreta.");
if (visual.automaticSnapshotUpdateInCI !== false) fail("não pode haver atualização automática de snapshots no CI.");
if (visual.requiresGeometricAssertions !== true || visual.requiresNoJavaScriptScenario !== true) fail("modelo visual deve exigir geometria e cenário no-JS.");
const readiness = read("public/data/package-09a-readiness.json");
if (readiness.version !== EXPECTED) fail("versão do readiness incorreta.");
if (readiness.legacyHarnessRemoval !== "blocked-until-parity") fail("remoção do legado deve estar bloqueada até paridade.");
if (readiness.productionApproval !== "blocked") fail("produção deve permanecer bloqueada.");

// 2. Configuração Playwright
need("playwright.config.mjs");
need("playwright.visual.config.mjs");
const cfg = text("playwright.config.mjs");
if (!/testDir:\s*"tests\/e2e"/.test(cfg)) fail("playwright.config sem testDir tests/e2e.");
if (!/webServer/.test(cfg)) fail("playwright.config sem webServer (teardown garantido).");
if (!/retries:\s*process\.env\.CI/.test(cfg)) fail("retries só devem existir no CI.");

// 3. Cenários migrados (áreas críticas)
const specs = {
  "portal-home-carousel": "tests/e2e/portal/home-carousel.spec.mjs",
  "portal": "tests/e2e/portal/portal.spec.mjs",
  "museum": "tests/e2e/museum/museum.spec.mjs",
  "immersive": "tests/e2e/immersive/immersive.spec.mjs",
  "proteus": "tests/e2e/proteus/proteus.spec.mjs",
  "collaborative": "tests/e2e/collaborative/collaborative.spec.mjs",
  "reduced-motion": "tests/e2e/accessibility/reduced-motion.spec.mjs",
  "no-js": "tests/e2e/portal/no-js.spec.mjs",
  "visual": "tests/visual/surfaces.visual.spec.mjs",
};
for (const p of Object.values(specs)) need(p);

// O teste do banner apanha a classe de regressão 08O→08Q (caixa igual + conteúdo dentro).
const banner = text(specs["portal-home-carousel"]);
if (!/maxDiff.*toBeLessThanOrEqual\(1\)/s.test(banner)) fail("o teste do banner não verifica caixa igual (≤1px).");
if (!/contained.*toBe\(true\)/s.test(banner)) fail("o teste do banner não verifica conteúdo dentro da caixa.");

// 4. Cenário sem JavaScript + fallback
const nojs = text(specs["no-js"]);
if (!/javaScriptEnabled:\s*false/.test(nojs)) fail("cenário no-JS não desativa o JavaScript.");
const html = text("index.html");
if (!/<noscript>/.test(html) || !/no-js-fallback/.test(html)) fail("index.html sem fallback <noscript> essencial.");
if (!/surveymonkey\.com/.test(html)) fail("fallback no-JS sem a ação real do Inquérito.");

// 5. Progressive enhancement do carrossel (1.º slide visível sem --active)
const css = text("src/styles/app.css");
if (!/:not\(:has\(\.home-carousel__slide--active\)\)/.test(css)) fail("sem fallback CSS de progressive enhancement do carrossel.");

// 6. Harness legado preservado + paridade
need("scripts/e2e/run-browser-e2e-08j.mjs");
const parity = read("reports/e2e-parity-09a.json");
if (parity.legacyHarnessPreserved !== true) fail("o harness legado deve ser preservado.");
if (parity.legacyRemovalAllowed !== false) fail("remoção do legado não pode ser permitida ainda.");
for (const area of migration.criticalAreas) {
  if (!parity.scenarios.some((s) => s.area === area)) fail(`área crítica sem registo de paridade: ${area}.`);
}

// 7. Scripts npm (sem tocar no lock; Playwright instalado ad-hoc no CI)
const pkg = read("package.json");
for (const s of ["test:e2e:playwright", "test:visual", "test:visual:update", "test:e2e:no-js", "repeat:e2e:critical", "validate:09a"]) {
  if (!pkg.scripts[s]) fail(`script npm em falta: ${s}.`);
}
if (pkg.dependencies?.["@playwright/test"] || pkg.devDependencies?.["@playwright/test"]) {
  fail("@playwright/test não deve estar no package.json (instalação ad-hoc no CI para não partir o lock).");
}

console.log(`Pacote 09A validado: Playwright configurado, ${parity.scenarios.length} cenários de paridade (legado preservado), fallback no-JS + progressive enhancement, baselines visuais sem auto-update no CI.`);
