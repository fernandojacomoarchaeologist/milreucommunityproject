/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09D — utilitários partilhados da fundação multilíngue.
 */
import { readFileSync } from "node:fs";

export const read = (p) => JSON.parse(readFileSync(p, "utf8"));
export const text = (p) => readFileSync(p, "utf8");

export const EXPECTED = "0.37.1";
export const SOURCE_LOCALE = "pt-PT";
export const TARGET_LOCALES = ["en", "es", "fr"];
export const STATUSES = [
  "missing",
  "draft",
  "machine-draft",
  "in-review",
  "changes-requested",
  "approved",
  "published",
  "archived",
];
export const PUBLISHED = "published";

export const REGISTRY_PATH = "public/data/locale-content-registry.json";
export const AVAILABILITY_PATH = "public/data/locale-availability.json";
export const GLOSSARY_PATH = "public/data/translation-glossary.json";

export function loadRegistry() {
  return read(REGISTRY_PATH);
}

/** Verdadeiro se a tradução deste idioma está efetivamente publicada e alinhada com a fonte. */
export function isPublishedAligned(unit, tr) {
  return (
    tr.status === PUBLISHED &&
    tr.sourceVersion === unit.sourceVersion &&
    Boolean(tr.reviewer) &&
    Boolean(tr.approver)
  );
}

/** Tradução potencialmente desatualizada: existe conteúdo mas a versão-fonte divergiu. */
export function isStale(unit, tr) {
  if (tr.status === "missing") return false;
  if (tr.sourceVersion == null) return false;
  return tr.sourceVersion !== unit.sourceVersion || tr.sourceChanged === true;
}
