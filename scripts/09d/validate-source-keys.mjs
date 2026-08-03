/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09D — garante que cada unidade de conteúdo tem chave estável, fonte pt-PT
 * e versão-fonte, sem chaves nem contentId duplicados.
 */
import { loadRegistry, SOURCE_LOCALE, TARGET_LOCALES } from "./lib.mjs";

const fail = (m) => { throw new Error(`09D chaves-fonte: ${m}`); };

const registry = loadRegistry();
if (registry.sourceLocale !== SOURCE_LOCALE) fail("o registo deve declarar pt-PT como fonte.");

const ids = new Set();
const keys = new Set();
for (const unit of registry.content) {
  if (!unit.contentId) fail("unidade sem contentId.");
  if (ids.has(unit.contentId)) fail(`contentId duplicado: ${unit.contentId}`);
  ids.add(unit.contentId);
  if (!unit.key) fail(`unidade sem chave estável: ${unit.contentId}`);
  if (keys.has(unit.key)) fail(`chave duplicada: ${unit.key}`);
  keys.add(unit.key);
  if (unit.sourceLocale !== SOURCE_LOCALE) fail(`fonte incorreta em ${unit.contentId}.`);
  if (!Number.isInteger(unit.sourceVersion) || unit.sourceVersion < 1) fail(`versão-fonte inválida em ${unit.contentId}.`);
  if (!unit.domain) fail(`domínio ausente em ${unit.contentId}.`);
  const locales = (unit.translations || []).map((t) => t.locale);
  for (const target of TARGET_LOCALES) {
    if (!locales.includes(target)) fail(`falta a entrada de tradução '${target}' em ${unit.contentId}.`);
  }
}

console.log(`Pacote 09D: ${registry.content.length} unidades de conteúdo com chave estável, fonte pt-PT e versão-fonte.`);
