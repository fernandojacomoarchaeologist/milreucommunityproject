/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09B — valida os relatórios da auditoria semântica contra o contrato:
 * classificações válidas, gravidades válidas, itens corrigidos com "depois",
 * e sem reescrita autónoma total.
 */
import { readFileSync, existsSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`09B relatório: ${m}`); };

const EXPECTED = "0.33.0";
const model = read("public/data/semantic-audit-model.json");
if (model.version !== EXPECTED) fail("versão do contrato incorreta.");
if (model.automaticFullRewriteAllowed !== false) fail("o contrato não pode permitir reescrita total automática.");

for (const p of [
  "reports/semantic-audit-09b.json",
  "reports/semantic-audit-09b.md",
  "reports/public-instruction-leaks-09b.json",
  "reports/editorial-decisions-09b.md",
  "reports/language-source-inventory-09b.json",
]) if (!existsSync(p)) fail(`relatório em falta: ${p}`);

const audit = read("reports/semantic-audit-09b.json");
if (audit.version !== EXPECTED) fail("versão do relatório de auditoria incorreta.");
const classes = new Set(model.classifications);
const sev = new Set(model.severity);
for (const item of audit.items) {
  if (!classes.has(item.classification)) fail(`classificação inválida: ${item.classification}`);
  if (!sev.has(item.severity)) fail(`gravidade inválida: ${item.severity}`);
  if (!["fixed", "proposed", "kept"].includes(item.action)) fail(`ação inválida: ${item.action}`);
  if (item.action === "fixed" && !item.proposal) fail(`item 'fixed' sem descrição da correção (${item.component}).`);
  if (item.humanReviewRequired === undefined) fail(`item sem humanReviewRequired (${item.component}).`);
}

// As fugas públicas registadas devem estar corrigidas.
const leaks = read("reports/public-instruction-leaks-09b.json");
for (const leak of leaks.publicLeaks) {
  if (leak.action !== "fixed") fail(`fuga pública não corrigida: ${leak.id}`);
}

const counts = audit.items.reduce((acc, i) => { acc[i.action] = (acc[i.action] || 0) + 1; return acc; }, {});
console.log(`Pacote 09B relatório semântico validado: ${audit.items.length} itens (${JSON.stringify(counts)}); fugas públicas corrigidas; sem reescrita autónoma total.`);
