/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { spawnSync } from "node:child_process";

for (const [command, args] of [
  ["node", ["scripts/ci/validate-package.mjs"]],
  ["node", ["scripts/database/check-migration-safety.mjs"]],
  ["node", ["--test", "tests/guards.test.mjs", "tests/migration-safety.test.mjs"]],
  ["node", ["scripts/private-assets/status.mjs"]]
]) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log("Pacote 05F validado.");
