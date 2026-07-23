/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
let cachedClient = null;

export async function createCollaborativeSupabaseClient(config) {
  if (!config?.supabaseUrl || !config?.supabasePublishableKey) return null;
  if (cachedClient) return cachedClient;

  const moduleUrl = config.supabaseJsModule;
  if (!moduleUrl?.startsWith("https://")) {
    throw new Error("Módulo Supabase inválido ou não seguro.");
  }

  const { createClient } = await import(moduleUrl);
  cachedClient = createClient(config.supabaseUrl, config.supabasePublishableKey, {
    auth: {
      flowType: "pkce",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: "milreu-collaborative-auth"
    },
    global: {
      headers: {
        "X-Client-Info": "milreu-collaborative-area/0.12.0"
      }
    }
  });
  return cachedClient;
}
