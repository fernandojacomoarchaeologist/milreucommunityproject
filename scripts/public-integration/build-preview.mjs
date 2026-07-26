/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { assertNoForbiddenFields } from "./validate-public-payload.mjs";

const model = JSON.parse(readFileSync("public/data/public-integration-model.json", "utf8"));
// Pré-visualização estrutural, sem ativar efeito público nem conteúdo real.
const preview = {
  _copyright: "© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  generatedAt: new Date().toISOString(),
  publicReadsSnapshotsOnly: model.publicReadsSnapshotsOnly,
  activePublicEffects: 0,
  slots: model.slots.map((code) => ({ slot: code, status: "empty", preview: null })),
  note: "Pré-visualização não ativa efeitos públicos. Ativação exige proposta aprovada, snapshot e gates humanos."
};
assertNoForbiddenFields(preview);
mkdirSync("reports", { recursive: true });
writeFileSync("reports/public-integration-preview.json", JSON.stringify(preview, null, 2) + "\n");
console.log(`Pré-visualização pública gerada: ${preview.slots.length} slots, 0 efeitos ativos.`);
