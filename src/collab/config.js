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
  const [profileTypes, rolesPermissions, modules, memberCatalog, taskModel, exhibitionModel, contributionModel, museumReviewModel, trainingTrails, library, reviewSeed, homologationModel, deploymentProfile, deploymentReadiness, notificationModel, notificationTemplates, notificationRuntime, operationalGovernanceModel, retentionModel, operationsRuntime, releaseCandidateModel, releaseCandidateReadiness, accessibilityAuditModel, e2eScenarios, demo] = await Promise.all([
    fetchJson("public/data/collaborative-profile-types.json"),
    fetchJson("public/data/collaborative-roles-permissions.json"),
    fetchJson("public/data/collaborative-modules.json"),
    fetchJson("public/data/collaborative-member-catalog.json"),
    fetchJson("public/data/collaborative-task-model.json"),
    fetchJson("public/data/collaborative-exhibition-model.json"),
    fetchJson("public/data/collaborative-contribution-model.json"),
    fetchJson("public/data/collaborative-museum-review-model.json"),
    fetchJson("public/data/collaborative-training-trails.json"),
    fetchJson("public/data/collaborative-library.json"),
    fetchJson("public/data/museum-review-seed.json"),
    fetchJson("public/data/collaborative-homologation-model.json"),
    fetchJson("public/config/deployment-profile.runtime.json"),
    fetchJson("public/data/deployment-readiness.json"),
    fetchJson("public/data/collaborative-notification-model.json"),
    fetchJson("public/data/collaborative-notification-templates.json"),
    fetchJson("public/config/notifications.runtime.json"),
    fetchJson("public/data/collaborative-operational-governance-model.json"),
    fetchJson("public/data/collaborative-retention-model.json"),
    fetchJson("public/config/operations.runtime.json"),
    fetchJson("public/data/collaborative-release-candidate-model.json"),
    fetchJson("public/data/release-candidate-readiness.json"),
    fetchJson("public/data/accessibility-audit-model-08j.json"),
    fetchJson("public/data/e2e-scenarios-08j.json"),
    fetchJson("public/data/collaborative-demo.json")
  ]);
  return {
    profileTypes: profileTypes.profileTypes,
    roles: rolesPermissions.roles,
    permissions: rolesPermissions.permissions,
    rolePermissions: rolesPermissions.rolePermissions,
    modules: modules.modules,
    memberCatalog,
    taskModel,
    exhibitionModel,
    contributionModel,
    museumReviewModel,
    trainingTrails,
    library,
    reviewSeed,
    homologationModel,
    deploymentProfile,
    deploymentReadiness,
    notificationModel,
    notificationTemplates,
    notificationRuntime,
    operationalGovernanceModel,
    retentionModel,
    operationsRuntime,
    releaseCandidateModel,
    releaseCandidateReadiness,
    accessibilityAuditModel,
    e2eScenarios,
    demo
  };
}

function validateConfig(config) {
  if (!config || typeof config !== "object") throw new Error("Configuração colaborativa inválida.");
  if (config.security?.serviceRoleInBrowser !== false) {
    throw new Error("A configuração não pode permitir service_role no navegador.");
  }
  const environment=config.environment||"local";
  if(!["local","staging","production"].includes(environment)){
    throw new Error("Ambiente colaborativo inválido.");
  }
  if(environment!=="local"&&config.allowDemo!==false){
    throw new Error("A demonstração deve estar desativada fora do ambiente local.");
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
