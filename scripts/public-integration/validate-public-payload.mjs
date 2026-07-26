/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * O export/pré-visualização pública DEVE falhar quando encontra campos
 * proibidos (PII, segredos, contactos, tokens). Este validador aplica essa
 * regra ao payload público de exemplo e é reutilizável por snapshots reais.
 */
import { readFileSync, existsSync } from "node:fs";

const FORBIDDEN_KEYS = /(email|phone|telefone|contact|contacto|address|morada|password|secret|token|service_role|apikey|signed_url|user_id|reviewer|nif|iban)/i;

export function assertNoForbiddenFields(value, path = "$") {
  if (value === null || value === undefined) return;
  if (Array.isArray(value)) { value.forEach((v, i) => assertNoForbiddenFields(v, `${path}[${i}]`)); return; }
  if (typeof value === "object") {
    for (const [key, val] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.test(key)) throw new Error(`08L payload público: campo proibido "${key}" em ${path}`);
      assertNoForbiddenFields(val, `${path}.${key}`);
    }
  }
}

const model = JSON.parse(readFileSync("public/data/public-integration-model.json", "utf8"));
if (model.publicReadsSnapshotsOnly !== true) throw new Error("08L payload: leitura pública deve ser apenas de snapshots.");

// Payload público de exemplo (estrutural, sem dados reais nem PII).
const samplePublicPayload = {
  schemaVersion: "1.0.0",
  surface: "portal",
  slot: "portal.home.after-featured",
  status: "example",
  languages: { "pt-PT": { title: "Exemplo estrutural", body: "Sem conteúdo real." } },
  references: []
};
assertNoForbiddenFields(samplePublicPayload);

// Um payload com PII deve ser rejeitado (auto-teste da guarda).
let rejected = false;
try { assertNoForbiddenFields({ contactEmail: "x@example.invalid" }); } catch { rejected = true; }
if (!rejected) throw new Error("08L payload: a guarda de campos proibidos não está a funcionar.");

// Snapshot público real, se existir, também é verificado.
if (existsSync("public/data/public-effect-slots.json")) {
  const slots = JSON.parse(readFileSync("public/data/public-effect-slots.json", "utf8"));
  assertNoForbiddenFields(slots.slots);
}

console.log("Payload público 08L validado: sem PII nem campos proibidos; a guarda rejeita corretamente.");
