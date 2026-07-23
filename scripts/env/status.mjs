/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { assertKnownEnvironment } from "../lib/guards.mjs";

const environment = assertKnownEnvironment();
const checks = {
  environment,
  node: process.version,
  ci: process.env.CI === "true",
  githubActions: process.env.GITHUB_ACTIONS === "true",
  supabaseUrlConfigured: Boolean(process.env.SUPABASE_URL),
  publishableKeyConfigured: Boolean(process.env.SUPABASE_PUBLISHABLE_KEY),
  accessTokenConfigured: Boolean(process.env.SUPABASE_ACCESS_TOKEN),
  dbPasswordConfigured: Boolean(process.env.SUPABASE_DB_PASSWORD),
  privateAssetRootConfigured: Boolean(process.env.MILREU_PRIVATE_ASSET_ROOT)
};

console.log(JSON.stringify(checks, null, 2));
