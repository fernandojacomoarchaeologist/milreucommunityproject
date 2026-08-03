/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09D — deteta traduções potencialmente desatualizadas: a versão-fonte da
 * unidade divergiu da versão registada na tradução, ou a fonte foi marcada como
 * alterada. Não sobrescreve nem despublica; apenas assinala para revisão humana.
 * Escreve reports/stale-translations-09d.json.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { loadRegistry, isStale } from "./lib.mjs";

const registry = loadRegistry();
const stale = [];
for (const unit of registry.content) {
  for (const tr of unit.translations) {
    if (isStale(unit, tr)) {
      stale.push({
        contentId: unit.contentId,
        locale: tr.locale,
        status: tr.status,
        sourceVersion: unit.sourceVersion,
        translationSourceVersion: tr.sourceVersion,
        sourceChanged: tr.sourceChanged === true,
      });
    }
  }
}

mkdirSync("reports", { recursive: true });
const report = {
  package: "09D",
  version: registry.version,
  generatedAt: new Date().toISOString().slice(0, 10),
  staleCount: stale.length,
  stale,
  note: "Traduções assinaladas para revisão humana. Nada é sobrescrito nem despublicado automaticamente.",
};
writeFileSync("reports/stale-translations-09d.json", JSON.stringify(report, null, 2) + "\n");

console.log(`Pacote 09D: deteção de stale concluída — ${stale.length} tradução(ões) assinalada(s). Relatório: reports/stale-translations-09d.json`);
