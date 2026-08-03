/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09D — relatório de prontidão multilíngue: contagem de unidades-fonte, estado
 * das traduções por idioma, disponibilidade por rota e bloqueios humanos pendentes.
 * Não aprova publicação; apenas descreve o estado factual. Escreve reports/multilingual-readiness-09d.json.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import {
  loadRegistry, read, AVAILABILITY_PATH, SOURCE_LOCALE, TARGET_LOCALES, STATUSES,
} from "./lib.mjs";

const registry = loadRegistry();
const availability = read(AVAILABILITY_PATH);

const byLocale = {};
for (const locale of TARGET_LOCALES) {
  byLocale[locale] = Object.fromEntries(STATUSES.map((s) => [s, 0]));
}
for (const unit of registry.content) {
  for (const tr of unit.translations) {
    if (byLocale[tr.locale]) byLocale[tr.locale][tr.status]++;
  }
}

const routesWithTargets = Object.entries(availability.routes)
  .filter(([, d]) => d.available.some((l) => l !== SOURCE_LOCALE))
  .map(([r]) => r);

mkdirSync("reports", { recursive: true });
const report = {
  package: "09D",
  version: registry.version,
  generatedAt: new Date().toISOString().slice(0, 10),
  sourceLocale: SOURCE_LOCALE,
  targetLocales: TARGET_LOCALES,
  sourceUnits: registry.content.length,
  translationStateByLocale: byLocale,
  routesWithPublishedTargets: routesWithTargets,
  automaticPublicationAllowed: false,
  silentFallbackAllowed: false,
  hreflangGeneration: false,
  productionApproval: "blocked",
  humanBlockers: [
    "definir variantes de EN/ES/FR",
    "designar revisores e aprovadores",
    "decidir glossário arqueológico e nomes institucionais",
    "definir prioridade editorial das páginas",
  ],
  note: "Fundação multilíngue pronta. Nenhuma tradução automática publicada; revisão e publicação humanas continuam obrigatórias.",
};
writeFileSync("reports/multilingual-readiness-09d.json", JSON.stringify(report, null, 2) + "\n");

console.log(`Pacote 09D: relatório de prontidão escrito — ${registry.content.length} unidades-fonte, alvos publicados em ${routesWithTargets.length} rota(s).`);
