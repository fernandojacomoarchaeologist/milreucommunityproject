/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = "supabase/migrations";
const files = readdirSync(dir).filter(file => file.endsWith(".sql"));
const destructive = /\b(drop\s+(table|schema)|truncate\s+table|delete\s+from)\b/i;
let blocked = false;

for (const file of files) {
  const sql = readFileSync(join(dir, file), "utf8");
  if (destructive.test(sql) && !sql.includes("MILREU-DESTRUCTIVE-REVIEWED")) {
    console.error(`${file}: operação potencialmente destrutiva sem marcador de revisão.`);
    blocked = true;
  }
}

if (blocked) process.exit(1);
console.log(`${files.length} migrations verificadas.`);
