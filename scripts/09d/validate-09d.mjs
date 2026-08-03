/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09D — validador umbrella da fundação multilíngue: versão, contratos,
 * integridade do registo, disponibilidade por rota, seletor/fallback data-driven,
 * ausência de publicação automática/hreflang, e invariantes preservadas do 09C
 * (módulos/permissões inalterados, MM202617 intocada, sem nova migration).
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import {
  read, text, EXPECTED, SOURCE_LOCALE, TARGET_LOCALES,
} from "./lib.mjs";

const fail = (m) => { throw new Error(`09D: ${m}`); };

// 1) Versão
const pkg = read("package.json");
if (pkg.version !== EXPECTED) fail(`package.json deve estar em ${EXPECTED} (está ${pkg.version}).`);
if (pkg.currentPackage && pkg.currentPackage !== "10A") fail("currentPackage deve ser 09D.");

// 2) Contratos do pacote
const locModel = read("contracts/09d/locale-content-model.json");
if (locModel.sourceLocale !== SOURCE_LOCALE) fail("locale-content-model: fonte deve ser pt-PT.");
if (locModel.automaticPublicationAllowed !== false) fail("locale-content-model: publicação automática proibida.");
if (locModel.silentFallbackAllowed !== false) fail("locale-content-model: fallback silencioso proibido.");
if (locModel.sourceVersionRequired !== true) fail("locale-content-model: versão-fonte obrigatória.");
if (locModel.staleDetectionRequired !== true) fail("locale-content-model: deteção de stale obrigatória.");
const wf = read("contracts/09d/translation-workflow-model.json");
if (wf.machineDraftCanPublish !== false) fail("translation-workflow: machine-draft não publica.");
if (wf.humanReviewRequired !== true || wf.approvalRequired !== true || wf.publicationExplicit !== true) fail("translation-workflow: revisão/aprovação/publicação explícitas obrigatórias.");
const routeModel = read("contracts/09d/language-route-availability-model.json");
if (routeModel.hreflangGeneration !== false) fail("route-availability: hreflang fica para 09F.");
if (routeModel.fakeTranslatedUrlsAllowed !== false) fail("route-availability: URLs traduzidas falsas proibidas.");
if (routeModel.missingLocaleBehaviour !== "visible-message-with-ptPT-option") fail("route-availability: comportamento de idioma ausente incorreto.");
const readiness = read("contracts/09d/package-09d-readiness.json");
if (readiness.productionApproval !== "blocked") fail("readiness: produção deve permanecer bloqueada.");
if (readiness.humanReview !== "required") fail("readiness: revisão humana obrigatória.");

// 3) Dados: registo, disponibilidade e glossário
for (const p of [
  "public/data/locale-content-registry.json",
  "public/data/locale-availability.json",
  "public/data/translation-glossary.json",
]) if (!existsSync(p)) fail(`ficheiro de dados em falta: ${p}`);
const registry = read("public/data/locale-content-registry.json");
if (registry.version !== EXPECTED) fail("registo: versão incorreta.");
if (registry.content.length === 0) fail("registo: deve conter unidades de conteúdo-fonte.");

const availability = read("public/data/locale-availability.json");
if (availability.silentFallbackAllowed !== false) fail("disponibilidade: fallback silencioso proibido.");
// Fundação: nenhuma rota pode publicar idioma-alvo (nada foi traduzido/revisto ainda).
for (const [route, def] of Object.entries(availability.routes)) {
  if (!def.available.includes(SOURCE_LOCALE)) fail(`disponibilidade: ${route} deve incluir pt-PT.`);
  const targets = def.available.filter((l) => TARGET_LOCALES.includes(l));
  if (targets.length) fail(`disponibilidade: ${route} não pode publicar idioma-alvo nesta fundação (${targets.join(",")}).`);
}

const glossary = read("public/data/translation-glossary.json");
if (glossary.status !== "seed-requires-human-review") fail("glossário: deve exigir revisão humana.");
for (const t of glossary.terms) {
  if (t.rule === "preserve-name" && (t.en || t.es || t.fr)) fail(`glossário: '${t["pt-PT"]}' é preserve-name e não pode ter tradução.`);
}

// 4) Seletor/fallback data-driven na superfície
const i18n = text("src/lib/i18n.js");
for (const key of ["localeUnavailableTitle", "localeUnavailableText", "continueInPortuguese", "languageInPreparationNote"]) {
  if (!i18n.includes(key)) fail(`i18n: string de indisponibilidade em falta: ${key}.`);
}
if (!/export function localeAvailableForRoute/.test(i18n)) fail("i18n: helper localeAvailableForRoute em falta.");
const layout = text("src/components/layout.js");
if (!/aria-describedby="language-switcher-note"/.test(layout)) fail("layout: switcher sem descrição acessível de indisponibilidade.");
if (!/data-locale-note/.test(layout)) fail("layout: nota de idioma em falta.");

// 5) Invariantes preservadas (09C): módulos/permissões inalterados; MM202617 intocada; sem nova migration.
const modules = read("public/data/collaborative-modules.json").modules;
if (modules.length !== 26) fail(`módulos devem permanecer 26 (estão ${modules.length}).`);
const perms = read("public/data/collaborative-roles-permissions.json").permissions;
if (perms.length !== 152) fail(`permissões devem permanecer 152 (estão ${perms.length}).`);
const migrations = readdirSync("supabase/migrations").filter((f) => f.endsWith(".sql"));
const nineDMigrations = migrations.filter((f) => /2026073[1-9]|202608/.test(f));
if (nineDMigrations.length) fail(`09D não deve adicionar migrations (encontradas: ${nineDMigrations.join(", ")}).`);
// MM202617: continua inelegível — não pode ser referenciada no registo multilíngue de forma a alterar elegibilidade.
if (/MM202617/.test(JSON.stringify(registry))) fail("registo multilíngue não deve manipular MM202617.");

// 6) Sem instruções internas na superfície pública (reforço leve).
if (/hreflang/i.test(i18n) || /hreflang/i.test(layout)) fail("hreflang não pertence a esta fundação (fica para 09F).");

console.log("Pacote 09D validado: fundação multilíngue com fonte pt-PT, estados editoriais, deteção de stale, disponibilidade por rota, fallback visível sem troca silenciosa, sem publicação automática, módulos/permissões/MM202617 preservados e sem nova migration.");
