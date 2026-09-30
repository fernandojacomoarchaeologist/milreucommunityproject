/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09B — valida a coerência do estado dos idiomas: pt-PT publicado/selecionável,
 * o i18n a espelhar o contrato (language-availability-model.json), sem fallback
 * silencioso, e o seletor/guard reais preparados para idiomas não-selecionáveis.
 *
 * Nota editorial (2026-09-30): por decisão do responsável, EN/ES/FR passam a
 * "published"/selecionáveis no contrato. O gate deixa de cravar "preparation" e
 * passa a exigir que o i18n reflita EXATAMENTE o contrato; o fallback visível
 * (silentFallbackAllowed=false) mantém-se para conteúdo ainda sem tradução.
 */
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`09B idiomas: ${m}`); };

const EXPECTED = "0.39.0";
const model = read("public/data/language-availability-model.json");
if (model.version !== EXPECTED) fail("versão do contrato incorreta.");
if (model.sourceLocale !== "pt-PT") fail("locale fonte deve ser pt-PT.");
if (model.silentFallbackAllowed !== false) fail("fallback silencioso não pode ser permitido.");
if (model.automaticPublicationAllowed !== false) fail("publicação automática não pode ser permitida.");
if (model.locales["pt-PT"].status !== "published" || model.locales["pt-PT"].selectorEnabled !== true) fail("pt-PT deve estar published/selecionável.");
for (const code of ["en", "es", "fr"]) {
  const loc = model.locales[code];
  const coherent = (loc.status === "preparation" && loc.selectorEnabled === false) || (loc.status === "published" && loc.selectorEnabled === true);
  if (!coherent) fail(`${code}: estado/seletor incoerentes no contrato (status=${loc.status}, selectorEnabled=${loc.selectorEnabled}).`);
}

// O i18n deve espelhar o contrato.
const i18n = text("src/lib/i18n.js");
if (!/languageAvailability\s*=/.test(i18n)) fail("i18n sem languageAvailability.");
if (!/isLocaleSelectable/.test(i18n)) fail("i18n sem isLocaleSelectable.");
if (!/"pt-PT":\s*\{\s*status:\s*"published",\s*selectorEnabled:\s*true\s*\}/.test(i18n)) fail("i18n: pt-PT deve ser published/selecionável.");
for (const code of ["en", "es", "fr"]) {
  const loc = model.locales[code];
  if (!new RegExp(`"${code}":\\s*\\{\\s*status:\\s*"${loc.status}",\\s*selectorEnabled:\\s*${loc.selectorEnabled}\\s*\\}`).test(i18n)) fail(`i18n: ${code} deve espelhar o contrato (${loc.status}/${loc.selectorEnabled}).`);
}

// O seletor deve desativar os idiomas não selecionáveis e assinalar "em preparação".
const layout = text("src/components/layout.js");
if (!/language-switcher__option--preparation/.test(layout)) fail("seletor sem estado 'em preparação'.");
if (!/aria-disabled="true"/.test(layout)) fail("idiomas não selecionáveis devem ter aria-disabled.");
if (!/disabled/.test(layout)) fail("idiomas não selecionáveis devem estar disabled.");

// O setLanguage deve recusar idiomas não selecionáveis (sem navegação falsa).
const main = text("src/main.js");
if (!/if\s*\(!isLocaleSelectable\(lang\)\)\s*return;/.test(main)) fail("setLanguage não recusa idiomas não selecionáveis.");

console.log("Pacote 09B idiomas validado: contrato e i18n coerentes; pt-PT/EN/ES/FR conforme o contrato; sem fallback silencioso; seletor/guard preparados.");
