/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09D — valida os estados editoriais de cada tradução e a coerência dos campos:
 * estado válido; conteúdo 'missing' sem texto; publicado exige texto, versão-fonte,
 * revisor e aprovador; nenhuma tradução-alvo pode conter texto inventado nesta fundação.
 */
import { loadRegistry, STATUSES, TARGET_LOCALES } from "./lib.mjs";

const fail = (m) => { throw new Error(`09D estado de tradução: ${m}`); };
const registry = loadRegistry();
const allowed = new Set(STATUSES);

let missing = 0;
let withContent = 0;
for (const unit of registry.content) {
  for (const tr of unit.translations) {
    if (!TARGET_LOCALES.includes(tr.locale)) fail(`idioma-alvo inesperado '${tr.locale}' em ${unit.contentId}.`);
    if (!allowed.has(tr.status)) fail(`estado inválido '${tr.status}' em ${unit.contentId}/${tr.locale}.`);

    if (tr.status === "missing") {
      missing++;
      if (tr.text != null) fail(`tradução 'missing' não pode ter texto: ${unit.contentId}/${tr.locale}.`);
      if (tr.sourceVersion != null) fail(`tradução 'missing' não pode ter versão-fonte: ${unit.contentId}/${tr.locale}.`);
      continue;
    }

    withContent++;
    if (tr.text == null || String(tr.text).trim() === "") fail(`tradução '${tr.status}' exige texto: ${unit.contentId}/${tr.locale}.`);
    if (!Number.isInteger(tr.sourceVersion)) fail(`tradução '${tr.status}' exige versão-fonte: ${unit.contentId}/${tr.locale}.`);

    if (tr.status === "published") {
      if (!tr.reviewer) fail(`publicado sem revisor humano: ${unit.contentId}/${tr.locale}.`);
      if (!tr.approver) fail(`publicado sem aprovador: ${unit.contentId}/${tr.locale}.`);
      if (!tr.publishedAt) fail(`publicado sem data de publicação: ${unit.contentId}/${tr.locale}.`);
    }
  }
}

// Fundação 09D: não deve conter traduções-alvo com conteúdo (nenhuma tradução foi feita ainda).
if (withContent !== 0) {
  console.warn(`Aviso 09D: ${withContent} tradução(ões)-alvo com conteúdo já presente(s). Confirmar que passaram por revisão humana.`);
}

console.log(`Pacote 09D: estados válidos — ${missing} 'missing', ${withContent} com conteúdo (revisão/aprovação verificadas quando publicado).`);
