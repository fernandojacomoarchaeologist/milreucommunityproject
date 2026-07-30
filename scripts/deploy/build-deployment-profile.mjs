/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { writeFile,readFile } from "node:fs/promises";

const environment=(process.env.MILREU_ENVIRONMENT||"local").trim().toLowerCase();
if(!["local","staging","production"].includes(environment)){
  throw new Error("MILREU_ENVIRONMENT deve ser local, staging ou production.");
}

const siteUrl=(process.env.MILREU_SITE_URL||"").trim();
const supabaseUrl=(process.env.MILREU_SUPABASE_URL||"").trim().replace(/\/+$/,"");
const projectRef=(process.env.MILREU_SUPABASE_PROJECT_REF||"").trim();
const publishableKey=(process.env.MILREU_SUPABASE_PUBLISHABLE_KEY||"").trim();
const masterConfigured=Boolean((process.env.MILREU_MASTER_EMAIL||"").trim());
const googleClientIdConfigured=Boolean((process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID||"").trim());
const googleSecretConfigured=Boolean((process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET||"").trim());
const googleEnabled=(process.env.MILREU_GOOGLE_OAUTH_ENABLED||"false").trim()==="true";
const stagingRef=(process.env.MILREU_STAGING_PROJECT_REF||"").trim();
const productionRef=(process.env.MILREU_PRODUCTION_PROJECT_REF||"").trim();
const productionWrites=(process.env.MILREU_PRODUCTION_WRITES_ENABLED||"false").trim()==="true";
const allowDemo=environment==="local"
  ?process.env.MILREU_ALLOW_DEMO!=="false"
  :false;
const allowedEmailDomains=(process.env.MILREU_ALLOWED_EMAIL_DOMAINS||"")
  .split(",").map(item=>item.trim().toLowerCase()).filter(Boolean);

const callbackPath="auth/callback/";
const normalizedSite=siteUrl?`${siteUrl.replace(/\/+$/,"")}/`:"";
const applicationCallback=normalizedSite?new URL(callbackPath,normalizedSite).toString():null;
const localSupabaseCallback=supabaseUrl?`${supabaseUrl}/auth/v1/callback`:null;
const httpsRequired=environment!=="local";
const blockingItems=[];

if(Boolean(supabaseUrl)!==Boolean(publishableKey)){
  blockingItems.push("MILREU_SUPABASE_URL e MILREU_SUPABASE_PUBLISHABLE_KEY devem ser definidos em conjunto.");
}
if(!siteUrl)blockingItems.push("MILREU_SITE_URL não está definido.");
if(!supabaseUrl)blockingItems.push("MILREU_SUPABASE_URL não está definido.");
if(!projectRef&&environment!=="local")blockingItems.push("MILREU_SUPABASE_PROJECT_REF não está definido.");
if(httpsRequired&&siteUrl&&!siteUrl.startsWith("https://"))blockingItems.push("O site deve usar HTTPS em staging e produção.");
if(httpsRequired&&supabaseUrl&&!supabaseUrl.startsWith("https://"))blockingItems.push("O Supabase deve usar HTTPS em staging e produção.");
if(environment!=="local"&&allowDemo)blockingItems.push("O modo de demonstração não pode estar ativo fora do ambiente local.");
if(!googleEnabled)blockingItems.push("Google OAuth ainda não foi marcado como configurado.");
if(googleEnabled&&!googleClientIdConfigured)blockingItems.push("Client ID do Google não está configurado no ambiente de homologação.");
if(googleEnabled&&!googleSecretConfigured&&environment==="local")blockingItems.push("Client secret do Google não está configurado para o Supabase local.");
if(!masterConfigured)blockingItems.push("MILREU_MASTER_EMAIL ainda não está definido.");
if(environment==="staging"&&!stagingRef)blockingItems.push("Projeto Supabase de staging ainda não foi identificado.");
if(environment==="production"&&!productionRef)blockingItems.push("Projeto Supabase de produção ainda não foi identificado.");
if(stagingRef&&productionRef&&stagingRef===productionRef)blockingItems.push("Staging e produção não podem usar o mesmo projeto Supabase.");
if(environment==="production"&&productionWrites)blockingItems.push("Escritas de produção não devem ser ativadas no preflight.");

if(process.env.SUPABASE_SERVICE_ROLE_KEY){
  console.warn("SUPABASE_SERVICE_ROLE_KEY foi detetada no processo, mas não será gravada nos ficheiros públicos.");
}

const model=JSON.parse(await readFile("public/data/collaborative-homologation-model.json","utf8"));
const profile={
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.30.0",
  environment,
  deploymentMode:environment==="local"?"validation-only":"homologation",
  siteUrl:normalizedSite||null,
  supabaseUrl:supabaseUrl||null,
  projectRef:projectRef||null,
  googleOAuth:{
    enabled:googleEnabled,
    provider:"google",
    localClientIdConfigured:googleClientIdConfigured,
    localClientSecretConfigured:environment==="local"?googleSecretConfigured:null,
    clientSecretInFrontend:false,
    supabaseCallbackUrl:localSupabaseCallback,
    applicationCallbackUrl:applicationCallback,
    allowedEmailDomains,
    requirePreauthorization:true,
    storeProviderTokens:false
  },
  master:{
    emailConfigured:masterConfigured,
    bootstrapExecuted:false,
    bootstrapRequiresLiteralConfirmation:true,
    minimumActiveMasters:1
  },
  safety:{
    allowDemo,
    allowDemoMaster:allowDemo,
    productionWritesEnabled:productionWrites,
    serviceRoleInBrowser:false,
    requireRls:true,
    requireSeparateStaging:true,
    requireDbDryRun:true,
    requireManualProductionApproval:true
  },
  homologation:{
    requiredProfiles:model.environments?["master","coordinator","volunteer","reviewer","translator","observer"]:[],
    requiredViewports:[375,768,1280],
    requiredFlows:[
      "google-oauth","membership-approval","master-protection",
      "profile-and-permissions","tasks-and-availability",
      "agenda-and-exhibitions","community-contributions",
      "training","museum-review","private-files",
      "withdrawal","logout-and-session-expiry"
    ]
  }
};

const readiness={
  _copyright:profile._copyright,
  version:"0.30.0",
  environment,
  generatedAt:new Date().toISOString(),
  status:blockingItems.length?"blocked":"preflight-passed",
  checks:{
    supabaseConfigured:Boolean(supabaseUrl&&publishableKey),
    siteUrlConfigured:Boolean(siteUrl),
    googleOAuthConfigured:Boolean(googleEnabled&&googleClientIdConfigured&&(environment!=="local"||googleSecretConfigured)),
    masterEmailConfigured:masterConfigured,
    stagingProjectConfigured:Boolean(stagingRef),
    productionProjectConfigured:Boolean(productionRef),
    separateRemoteProjects:Boolean(!stagingRef||!productionRef||stagingRef!==productionRef),
    serviceRoleInFrontend:false,
    demoDisabledForStaging:environment!=="staging"||!allowDemo,
    demoDisabledForProduction:environment!=="production"||!allowDemo,
    httpsValid:!httpsRequired||(
      siteUrl.startsWith("https://")&&supabaseUrl.startsWith("https://")
    ),
    productionWritesDisabled:environment!=="production"||!productionWrites
  },
  blockingItems,
  notice:"O preflight valida contratos e configuração. Não executa migrations, não configura o Google e não altera produção."
};

await writeFile("public/config/deployment-profile.runtime.json",JSON.stringify(profile,null,2)+"\n");
await writeFile("public/data/deployment-readiness.json",JSON.stringify(readiness,null,2)+"\n");
console.log(`Perfil ${environment}: ${readiness.status}; ${blockingItems.length} bloqueios.`);
if(process.env.MILREU_PREFLIGHT_STRICT==="true"&&blockingItems.length){
  throw new Error(`Preflight bloqueado: ${blockingItems.join(" | ")}`);
}
