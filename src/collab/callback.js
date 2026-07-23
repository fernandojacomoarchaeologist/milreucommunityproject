/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { loadCollaborativeConfig, appRootUrl } from "./config.js";
import { createCollaborativeSupabaseClient } from "./supabase-client.js";

const status = document.querySelector("[data-auth-callback-status]");

async function completeCallback() {
  const config = await loadCollaborativeConfig();
  if (config.mode !== "supabase") {
    throw new Error("A autenticação remota ainda não está configurada.");
  }

  const client = await createCollaborativeSupabaseClient(config);
  const code = new URL(location.href).searchParams.get("code");

  if (code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (error) throw error;
  } else {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    if (!data.session) throw new Error("A sessão não foi recebida.");
  }

  if (status) status.textContent = "Sessão confirmada. A abrir a Área Colaborativa…";
  const target = new URL(appRootUrl());
  target.hash = config.afterLoginHash || "#/area-colaborativa";
  location.replace(target.href);
}

completeCallback().catch(error => {
  console.error(error);
  if (status) status.textContent = `Não foi possível concluir o acesso: ${error.message}`;
});
