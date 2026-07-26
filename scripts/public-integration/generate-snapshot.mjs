/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { assertNoForbiddenFields } from "./validate-public-payload.mjs";

// Snapshot estrutural de exemplo (sem conteúdo real). O checksum é obrigatório.
const payload = {
  schemaVersion: "1.0.0",
  surface: "portal",
  slot: "portal.home.after-featured",
  status: "example",
  languages: { "pt-PT": { title: "Exemplo estrutural", body: "Sem conteúdo real." } },
  references: []
};
assertNoForbiddenFields(payload);
const checksum = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
const snapshot = { _copyright: "© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu", version: 1, schemaVersion: payload.schemaVersion, checksum, status: "generated", activated: false, payload };
mkdirSync("reports", { recursive: true });
writeFileSync("reports/public-integration-snapshot.json", JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Snapshot de exemplo gerado (checksum ${checksum.slice(0, 12)}…), estado generated, não ativado.`);
