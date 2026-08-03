/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09D — deriva a disponibilidade de idiomas POR ROTA a partir do registo de
 * conteúdo. Um idioma-alvo só fica disponível numa rota quando TODAS as unidades de
 * conteúdo dos domínios dessa rota estão publicadas e alinhadas com a fonte. pt-PT
 * (fonte) está sempre disponível. Reescreve os arrays 'available' de locale-availability.json
 * preservando o mapa rota→domínios. Sem fallback silencioso; disponibilidade é factual.
 */
import { writeFileSync } from "node:fs";
import {
  loadRegistry, read, AVAILABILITY_PATH, SOURCE_LOCALE, TARGET_LOCALES, isPublishedAligned,
} from "./lib.mjs";

const registry = loadRegistry();
const availability = read(AVAILABILITY_PATH);

// Índice: domínio → lista de unidades.
const byDomain = new Map();
for (const unit of registry.content) {
  if (!byDomain.has(unit.domain)) byDomain.set(unit.domain, []);
  byDomain.get(unit.domain).push(unit);
}

for (const [routeName, def] of Object.entries(availability.routes)) {
  const units = (def.domains || []).flatMap((d) => byDomain.get(d) || []);
  const available = [SOURCE_LOCALE];
  for (const locale of TARGET_LOCALES) {
    if (units.length === 0) continue;
    const allPublished = units.every((unit) => {
      const tr = unit.translations.find((t) => t.locale === locale);
      return tr && isPublishedAligned(unit, tr);
    });
    if (allPublished) available.push(locale);
  }
  def.available = available;
}

availability.version = registry.version;
availability.generatedBy = "scripts/09d/build-locale-availability.mjs";
availability.silentFallbackAllowed = false;
availability.hreflangGeneration = false;
availability.fakeTranslatedUrlsAllowed = false;
writeFileSync(AVAILABILITY_PATH, JSON.stringify(availability, null, 2) + "\n");

const summary = Object.entries(availability.routes)
  .map(([r, d]) => `${r}: ${d.available.join(",")}`)
  .join(" · ");
console.log(`Pacote 09D: disponibilidade por rota derivada do registo → ${summary}`);
