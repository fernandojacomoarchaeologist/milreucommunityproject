/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync,readFileSync } from "node:fs";

const pkg=JSON.parse(readFileSync("package.json","utf8"));
const profile=JSON.parse(readFileSync("public/config/deployment-profile.runtime.json","utf8"));
const profileExample=JSON.parse(readFileSync("public/config/deployment-profile.example.json","utf8"));
const readiness=JSON.parse(readFileSync("public/data/deployment-readiness.json","utf8"));
const model=JSON.parse(readFileSync("public/data/collaborative-homologation-model.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const collabConfig=JSON.parse(readFileSync("public/config/collaborative-area.runtime.json","utf8"));
const router=readFileSync("src/lib/router.js","utf8");
const controller=readFileSync("src/collab/controller.js","utf8");
const view=readFileSync("src/views/collaborative-deployment.js","utf8");
const main=readFileSync("src/main.js","utf8");
const layout=readFileSync("src/components/collaborative-layout.js","utf8");
const styles=readFileSync("src/styles/app.css","utf8");
const configLoader=readFileSync("src/collab/config.js","utf8");
const runtimeBuilder=readFileSync("scripts/collab/build-runtime-config.mjs","utf8");
const profileBuilder=readFileSync("scripts/deploy/build-deployment-profile.mjs","utf8");
const preflight=readFileSync("scripts/deploy/preflight.mjs","utf8");
const oauth=readFileSync("scripts/deploy/google-oauth-contract.mjs","utf8");
const remoteSmoke=readFileSync("scripts/deploy/remote-smoke.mjs","utf8");
const report=readFileSync("scripts/deploy/homologation-report.mjs","utf8");
const masterStatus=readFileSync("scripts/admin/master-status.mjs","utf8");
const bootstrap=readFileSync("scripts/admin/bootstrap-master.mjs","utf8");
const supabaseConfig=readFileSync("supabase/config.toml","utf8");
const foundation=readFileSync("supabase/migrations/20260724130000_collaborative_deployment_homologation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724130100_collaborative_deployment_homologation_rpc.sql","utf8");
const seed=readFileSync("supabase/migrations/20260724130200_collaborative_deployment_homologation_seed.sql","utf8");
const build=readFileSync("scripts/build.mjs","utf8");
const smoke=readFileSync("scripts/smoke.mjs","utf8");
const impact=JSON.parse(readFileSync("public/data/package-impact-registry.json","utf8"));
const collaborativeReadiness=JSON.parse(readFileSync("public/data/collaborative-readiness.json","utf8"));

if(pkg.version!=="0.33.0")throw new Error("Versão 08G incorreta.");
if(profile.version!=="0.33.0"||profileExample.version!=="0.33.0")throw new Error("Perfil de implantação desatualizado.");
if(readiness.version!=="0.33.0"||model.version!=="0.33.0")throw new Error("Modelo/readiness 08G desatualizado.");
if(model.environments.length!==3)throw new Error("Ambientes 08G incompletos.");
if(model.requiredChecks.length!==24)throw new Error("Catálogo de homologação deve conter 24 checks.");
const library=JSON.parse(readFileSync("public/data/collaborative-library.json","utf8"));
if(library.resources.length<13)throw new Error("Biblioteca acumulada deve preservar os 13 recursos do 08G.");
for(const code of ["environment-strategy","google-oauth-setup","staging-homologation","rls-homologation-matrix"]){if(!library.resources.some(item=>item.code===code))throw new Error(`Recurso 08G ausente: ${code}`);}
if(new Set(model.requiredChecks.map(item=>item.code)).size!==24)throw new Error("Checks de homologação duplicados.");
if(model.productionGates.manualLiteralConfirmation!=="APPROVE_MILREU_PRODUCTION_RELEASE")throw new Error("Literal de produção divergente.");

const module=modules.find(item=>item.code==="deployment-homologation");
if(!module||module.status!=="active"||module.permission!=="homologation.view")throw new Error("Módulo 08G não ativo.");
for(const permission of [
  "deployment.view","deployment.manage","deployment.audit.view",
  "homologation.view","homologation.run","homologation.check",
  "homologation.approve","homologation.cancel",
  "auth.policy.view","auth.policy.manage","auth.audit.view","master.status.view"
]){
  if(!roles.permissions.includes(permission))throw new Error(`Permissão 08G ausente: ${permission}`);
  if(!roles.rolePermissions.master.includes("*")&&!roles.rolePermissions.master.includes(permission))throw new Error(`Master sem permissão: ${permission}`);
}
if(roles.rolePermissions.volunteer.includes("homologation.approve"))throw new Error("Voluntário não pode aprovar homologação.");

for(const route of ["collab-deployment-homologation","collab-homologation-run"]){
  if(!router.includes(route))throw new Error(`Rota 08G ausente: ${route}`);
}
for(const functionName of ["collaborativeDeploymentHomologationView","collaborativeHomologationRunView"]){
  if(!view.includes(functionName))throw new Error(`View 08G ausente: ${functionName}`);
}
for(const method of [
  "saveDeploymentEnvironment","saveAuthPolicy","startHomologation",
  "recordHomologationCheck","completeHomologation","approveHomologation","cancelHomologation"
]){
  if(!controller.includes(`async ${method}`))throw new Error(`Método 08G ausente: ${method}`);
}
for(const binding of [
  "data-deployment-environment-form","data-auth-policy-form",
  "data-homologation-start-form","data-homologation-check-form",
  "data-homologation-complete-form","data-homologation-approve",
  "data-homologation-cancel"
]){
  if(!main.includes(binding))throw new Error(`Binding 08G ausente: ${binding}`);
}
if(!layout.includes("gestao/homologacao"))throw new Error("Homologação ausente da navegação.");
for(const css of [".deployment-preflight",".deployment-environment-grid",".homologation-check-form"]){
  if(!styles.includes(css))throw new Error(`Estilo 08G ausente: ${css}`);
}

if(!configLoader.includes("homologationModel")||!configLoader.includes("deploymentProfile")||!configLoader.includes("deploymentReadiness")){
  throw new Error("Loader 08G incompleto.");
}
if(!controller.includes("email_domain_not_allowed")||!controller.includes("Google OAuth ainda não foi homologado")){
  throw new Error("Gates de autenticação do controller ausentes.");
}
if(!runtimeBuilder.includes("MILREU_ENVIRONMENT")||!runtimeBuilder.includes("MILREU_ALLOWED_EMAIL_DOMAINS")){
  throw new Error("Runtime builder sem contrato 08G.");
}
if(!profileBuilder.includes("MILREU_STAGING_PROJECT_REF")||!profileBuilder.includes("MILREU_PRODUCTION_PROJECT_REF")){
  throw new Error("Perfil sem separação staging/produção.");
}
if(!profileBuilder.includes("stagingRef===productionRef")||!profileBuilder.includes("productionWrites")){
  throw new Error("Gates de ambiente ausentes.");
}
if(!preflight.includes("deployment-readiness.json")||!oauth.includes("supabaseCallbackUrl")){
  throw new Error("Preflight/OAuth checker incompletos.");
}
if(!remoteSmoke.includes("ALLOW_READ_ONLY_PRODUCTION_SMOKE")||!remoteSmoke.includes('method:"GET"')){
  throw new Error("Remote smoke não está limitado a leitura.");
}
if(!report.includes("releases/homologation"))throw new Error("Relatório de homologação ausente.");

if(!bootstrap.includes("BOOTSTRAP_MILREU_MASTER")||bootstrap.includes("console.log(body)")){
  throw new Error("Bootstrap do master sem confirmação ou expondo resposta bruta.");
}
if(!masterStatus.includes("emailExposed:false")||!masterStatus.includes("collab_active_master_count")){
  throw new Error("Consulta segura do estado do master ausente.");
}
if(!supabaseConfig.includes("[auth.external.google]")
   ||!supabaseConfig.includes("SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET")
   ||!supabaseConfig.includes("skip_nonce_check = false")){
  throw new Error("Google OAuth local não está preparado.");
}

for(const table of [
  "collab_deployment_environments","collab_auth_policies",
  "collab_homologation_check_catalog","collab_homologation_runs",
  "collab_homologation_checks"
]){
  if(!foundation.includes(table))throw new Error(`Tabela 08G ausente: ${table}`);
}
if((foundation.match(/enable row level security/g)||[]).length<5)throw new Error("RLS 08G incompleta.");
if(/grant\s+(insert|update|delete|all)[\s\S]{0,80}to\s+authenticated/i.test(foundation)){
  throw new Error("Escrita direta nas tabelas 08G não é permitida.");
}
for(const fn of [
  "collab_upsert_deployment_environment_08g","collab_upsert_auth_policy_08g",
  "collab_start_homologation_08g","collab_record_homologation_check_08g",
  "collab_complete_homologation_08g","collab_approve_homologation_08g",
  "collab_cancel_homologation_08g","collab_deployment_readiness_08g"
]){
  if(!rpc.includes(fn))throw new Error(`RPC 08G ausente: ${fn}`);
}
for(const gate of [
  "https_required","active_homologation_run_exists","blocking_checks_open",
  "passed_run_required","approved_staging_run_required",
  "literal_production_confirmation_required"
]){
  if(!rpc.includes(gate))throw new Error(`Gate 08G ausente: ${gate}`);
}
if(!seed.includes("deployment-homologation")||!seed.includes("select 'master',code")){
  throw new Error("Seed de módulo/permissões incompleto.");
}
if((seed.match(/\('(?:env-config|separate-staging|migration-dry-run|database-tests|google-provider|google-callback|app-callback|preauthorization|master-bootstrap|last-master-protection|role-matrix|cross-user-isolation|private-contribution-files|signed-links|collaborative-flows|session-expiry|mobile-375|tablet-768|desktop-1280|keyboard-screen-reader|performance-budget|rollback-tested|backup-tested|consent-privacy-review)'/g)||[]).length!==24){
  throw new Error("Seed SQL não contém os 24 checks.");
}

const publicText=JSON.stringify({profile,profileExample,readiness,collabConfig});
for(const secret of ["service_role","client_secret","SUPABASE_SERVICE_ROLE_KEY"]){
  if(publicText.toLowerCase().includes(secret.toLowerCase()))throw new Error(`Segredo/identificador indevido no ficheiro público: ${secret}`);
}
if(/@[a-z0-9.-]+\.[a-z]{2,}/i.test(publicText))throw new Error("Um e-mail real foi encontrado nos ficheiros públicos de implantação.");
if(profile.googleOAuth.clientSecretInFrontend!==false||profile.safety.serviceRoleInBrowser!==false){
  throw new Error("Fronteira de segredos inválida.");
}
if(profile.environment!=="local"&&profile.safety.allowDemo)throw new Error("Demo fora do local.");
if(collabConfig.security?.serviceRoleInBrowser!==false)throw new Error("Config colaborativa permite service role.");

for(const checksum of ["deploymentProfileChecksum","deploymentReadinessChecksum","homologationModelChecksum"]){
  if(!build.includes(checksum))throw new Error(`Checksum 08G ausente: ${checksum}`);
}
for(const asset of [
  "collaborative-deployment.js","collaborative-homologation-model.json",
  "deployment-readiness.json","deployment-profile.runtime.json"
]){
  if(!smoke.includes(asset))throw new Error(`Smoke 08G incompleto: ${asset}`);
}
if(impact.currentPackage!=="09C.1"||impact.version!=="0.33.0")throw new Error("Registo de impacto 08G desatualizado.");
if(!collaborativeReadiness.functionalModules.includes("deployment-homologation")){
  throw new Error("Readiness colaborativa não inclui 08G.");
}

for(const file of [
  "PROJECT_CONTEXT_LEDGER.md","PACKAGE_DEPENDENCY_MAP.md",
  "CHANGE_SURFACE_REGISTRY.md","CONTEXT_RECOVERY_PROTOCOL.md",
  "docs/deployment/GOOGLE_OAUTH_SETUP_08G.md",
  "docs/deployment/STAGING_HOMOLOGATION_08G.md",
  "supabase/collab-tests/008g_deployment_homologation.test.sql"
]){
  if(!existsSync(file))throw new Error(`Ficheiro 08G obrigatório ausente: ${file}`);
}
console.log("Pacote 08G validado: ambientes separados, Google OAuth, master configurável, RLS, homologação e gates de produção.");
