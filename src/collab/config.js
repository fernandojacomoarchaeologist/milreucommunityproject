/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
const rootUrl = new URL("../../", import.meta.url);

async function fetchJson(path) {
  const response = await fetch(new URL(path, rootUrl));
  if (!response.ok) throw new Error(`Falha ao carregar ${path}: ${response.status}`);
  return response.json();
}

export async function loadCollaborativeConfig() {
  try {
    const runtime = await fetchJson("public/config/collaborative-area.runtime.json");
    return validateConfig(runtime);
  } catch {
    const example = await fetchJson("public/config/collaborative-area.example.json");
    return validateConfig(example);
  }
}

export async function loadCollaborativeFoundationData() {
  const [profileTypes, rolesPermissions, modules, demo] = await Promise.all([
    fetchJson("public/data/collaborative-profile-types.json"),
    fetchJson("public/data/collaborative-roles-permissions.json"),
    fetchJson("public/data/collaborative-modules.json"),
    fetchJson("public/data/collaborative-demo.json")
  ]);
  return {
    profileTypes: profileTypes.profileTypes,
    roles: rolesPermissions.roles,
    permissions: rolesPermissions.permissions,
    rolePermissions: rolesPermissions.rolePermissions,
    modules: modules.modules,
    demo
  };
}

function validateConfig(config) {
  if (!config || typeof config !== "object") throw new Error("Configuração colaborativa inválida.");
  if (config.security?.serviceRoleInBrowser !== false) {
    throw new Error("A configuração não pode permitir service_role no navegador.");
  }
  const hasRemote = Boolean(config.supabaseUrl && config.supabasePublishableKey);
  return {
    ...config,
    mode: hasRemote ? "supabase" : "demo",
    allowDemo: config.allowDemo !== false
  };
}

export function appRootUrl() {
  return new URL("../../", import.meta.url);
}

export function callbackUrl(config) {
  const base = config.siteUrl ? new URL(config.siteUrl) : appRootUrl();
  return new URL(config.callbackPath || "auth/callback/", base).href;
}
