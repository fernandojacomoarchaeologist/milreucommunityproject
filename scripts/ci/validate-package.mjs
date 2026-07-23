/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = process.cwd();
const required = [
  "README.md",
  "PROMPT_CLAUDE.md",
  "docs/security/PRODUCTION_ACCESS_POLICY.md",
  "infrastructure/access/claude-access-matrix.json",
  "supabase/config.toml",
  ".github/workflows/05f-ci.yml"
];

for (const file of required) {
  try { statSync(join(root, file)); }
  catch { throw new Error(`Ficheiro obrigatório ausente: ${file}`); }
}

const forbiddenNames = [".env", ".env.local", "service_role", "database-password"];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules") continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else {
      const lower = path.toLowerCase();
      if (forbiddenNames.some(item => lower.endsWith(item))) {
        throw new Error(`Possível secret ou ficheiro proibido: ${path}`);
      }
      if ([".json"].includes(extname(path))) JSON.parse(readFileSync(path, "utf8"));
    }
  }
}
walk(root);
console.log("Validação estrutural concluída.");
