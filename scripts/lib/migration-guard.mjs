// © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.
// Guardrail de migrations: baseline histórica congelada (42) + allowlist governada de migrations
// pós-freeze (por identidade de filename, não por data permissiva). Ver docs/governance/POST_FREEZE_MIGRATIONS.md.
import { readFileSync, readdirSync } from "node:fs";

const cfg = JSON.parse(readFileSync("supabase/migrations-baseline.json", "utf8"));
export const BASELINE_MIGRATIONS = cfg.baseline;                 // fotografia histórica (10C/10D/10E): 42
export const POST_FREEZE_MIGRATIONS = cfg.postFreeze;            // allowlist explícita (HUMAN GATE)
export const EXPECTED_MIGRATION_COUNT = BASELINE_MIGRATIONS + POST_FREEZE_MIGRATIONS.length;

// Uma migration é "pós-freeze" pela data no filename (2026-09 em diante); nenhuma baseline cai aqui.
const POST_FREEZE_DATE = /^(202609|20261|2027)/;

export function listMigrations() {
  return readdirSync("supabase/migrations").filter((f) => f.endsWith(".sql")).sort();
}

// Verifica: total = baseline + allowlist; toda pós-freeze-dated está na allowlist; allowlist existe.
export function assertMigrationGuard(fail) {
  const all = listMigrations();
  if (all.length !== EXPECTED_MIGRATION_COUNT) {
    fail(`migrations: esperadas ${EXPECTED_MIGRATION_COUNT} (baseline ${BASELINE_MIGRATIONS} + ${POST_FREEZE_MIGRATIONS.length} pós-freeze), há ${all.length}.`);
  }
  for (const f of all) {
    if (POST_FREEZE_DATE.test(f) && !POST_FREEZE_MIGRATIONS.includes(f)) {
      fail(`migration pós-freeze NÃO autorizada: ${f} — registar na allowlist (HUMAN GATE): supabase/migrations-baseline.json / docs/governance/POST_FREEZE_MIGRATIONS.md.`);
    }
  }
  for (const f of POST_FREEZE_MIGRATIONS) {
    if (!all.includes(f)) fail(`allowlist pós-freeze refere migration ausente: ${f}.`);
  }
}
