/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09B — valida o estado temporário dos idiomas: pt-PT publicado/selecionável,
 * EN/ES/FR "em preparação"/não-selecionáveis, sem fallback silencioso, e coerência
 * entre o contrato, o i18n e o seletor/guard reais.
 */
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`09B idiomas: ${m}`); };

const EXPECTED = "0.30.0";
const model = read("public/data/language-availability-model.json");
if (model.version !== EXPECTED) fail("versão do contrato incorreta.");
if (model.sourceLocale !== "pt-PT") fail("locale fonte deve ser pt-PT.");
if (model.silentFallbackAllowed !== false) fail("fallback silencioso não pode ser permitido.");
if (model.automaticPublicationAllowed !== false) fail("publicação automática não pode ser permitida.");
if (model.locales["pt-PT"].status !== "published" || model.locales["pt-PT"].selectorEnabled !== true) fail("pt-PT deve estar published/selecionável.");
for (const code of ["en", "es", "fr"]) {
  if (model.locales[code].status !== "preparation" || model.locales[code].selectorEnabled !== false) fail(`${code} deve estar preparation/não-selecionável.`);
}

// O i18n deve espelhar o contrato.
const i18n = text("src/lib/i18n.js");
if (!/languageAvailability\s*=/.test(i18n)) fail("i18n sem languageAvailability.");
if (!/isLocaleSelectable/.test(i18n)) fail("i18n sem isLocaleSelectable.");
if (!/"pt-PT":\s*\{\s*status:\s*"published",\s*selectorEnabled:\s*true\s*\}/.test(i18n)) fail("i18n: pt-PT deve ser published/selecionável.");
for (const code of ["en", "es", "fr"]) {
  if (!new RegExp(`"${code}":\\s*\\{\\s*status:\\s*"preparation",\\s*selectorEnabled:\\s*false\\s*\\}`).test(i18n)) fail(`i18n: ${code} deve ser preparation/não-selecionável.`);
}

// O seletor deve desativar os idiomas não selecionáveis e assinalar "em preparação".
const layout = text("src/components/layout.js");
if (!/language-switcher__option--preparation/.test(layout)) fail("seletor sem estado 'em preparação'.");
if (!/aria-disabled="true"/.test(layout)) fail("idiomas não selecionáveis devem ter aria-disabled.");
if (!/disabled/.test(layout)) fail("idiomas não selecionáveis devem estar disabled.");

// O setLanguage deve recusar idiomas não selecionáveis (sem navegação falsa).
const main = text("src/main.js");
if (!/if\s*\(!isLocaleSelectable\(lang\)\)\s*return;/.test(main)) fail("setLanguage não recusa idiomas não selecionáveis.");

console.log("Pacote 09B idiomas validado: pt-PT selecionável; EN/ES/FR 'em preparação' (desativados, sem fallback silencioso); contrato, i18n e seletor coerentes.");
