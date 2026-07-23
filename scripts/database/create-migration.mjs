/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { spawnSync } from "node:child_process";

const name = process.argv[2];
if (!name || !/^[a-z0-9_]+$/.test(name)) {
  console.error("Uso: node create-migration.mjs nome_em_snake_case");
  process.exit(1);
}

const result = spawnSync("npx", ["supabase", "migration", "new", name], {
  stdio: "inherit",
  shell: process.platform === "win32"
});
process.exit(result.status ?? 1);
