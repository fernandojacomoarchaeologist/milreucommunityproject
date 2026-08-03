/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08O — valida a auditoria pós-merge da Área Colaborativa.
 * A auditoria é escrita à mão (reports/collaborative-audit-08o.json) com base
 * na inspeção real do código; este script garante que respeita o contrato,
 * cobre todos os itens obrigatórios e não introduz expansão arquitetural.
 */
import { readFileSync, existsSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`08O auditoria: ${m}`); };

const EXPECTED_VERSION = "0.37.0";
const contract = read("public/data/collaborative-post-merge-audit.json");
if (contract.version !== EXPECTED_VERSION) fail("versão do contrato incorreta.");

const RESULTS = "reports/collaborative-audit-08o.json";
if (!existsSync(RESULTS)) fail(`resultado da auditoria ausente: ${RESULTS}`);
const results = read(RESULTS);
if (results.version !== EXPECTED_VERSION) fail("versão do resultado da auditoria incorreta.");

const allowed = new Set(contract.allowedStatuses);
const byCode = new Map((results.items || []).map((i) => [i.code, i]));

for (const code of contract.items) {
  const item = byCode.get(code);
  if (!item) fail(`item obrigatório ausente: ${code}`);
  if (!allowed.has(item.status)) fail(`estado inválido em ${code}: ${item.status}`);
  if (contract.mustIncludeEvidence && !item.evidence) fail(`item ${code} sem evidência.`);
  if (!Array.isArray(item.files) || item.files.length === 0) fail(`item ${code} sem ficheiros relacionados.`);
  if (!item.test) fail(`item ${code} sem teste associado.`);
  if (contract.mustIncludeSourceMapping && !item.sourceMapping) fail(`item ${code} sem mapeamento de origem.`);
  // A CI deve falhar quando existir item bloqueado sem justificação.
  if (item.status === "blocked" && !item.blocker) fail(`item ${code} bloqueado sem justificação.`);
  if (item.status === "fixed" && !item.fix) fail(`item ${code} marcado como fixed sem descrição da correção.`);
}

// Sem expansão arquitetural: contagens reais têm de bater certo com o esperado.
const modules = read("public/data/collaborative-modules.json").modules;
const permissions = read("public/data/collaborative-roles-permissions.json").permissions;
if (typeof results.moduleCount === "number" && results.moduleCount !== modules.length) fail("moduleCount do resultado diverge do real.");
if (typeof results.permissionCount === "number" && results.permissionCount !== permissions.length) fail("permissionCount do resultado diverge do real.");
if (contract.newModulesExpected !== 0) fail("o contrato não deve esperar novos módulos.");
if (contract.newPermissionsExpected !== 0) fail("o contrato não deve esperar novas permissões.");
if (contract.newMigrationsExpected !== 0) fail("o contrato não deve esperar novas migrations.");

const blockedCount = results.items.filter((i) => i.status === "blocked").length;
console.log(`Pacote 08O auditoria colaborativa validada: ${results.items.length}/${contract.items.length} itens, ${blockedCount} bloqueados (com justificação), módulos ${modules.length}, permissões ${permissions.length}.`);
