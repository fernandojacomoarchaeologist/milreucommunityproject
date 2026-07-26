/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { writeFile } from "node:fs/promises";

const url = process.env.MILREU_SUPABASE_URL?.trim() || "";
const publishableKey = process.env.MILREU_SUPABASE_PUBLISHABLE_KEY?.trim() || "";
const siteUrl = process.env.MILREU_SITE_URL?.trim() || "";
const environment=(process.env.MILREU_ENVIRONMENT||"local").trim().toLowerCase();
const allowDemo=environment==="local"&&process.env.MILREU_ALLOW_DEMO!=="false";
const allowedEmailDomains=(process.env.MILREU_ALLOWED_EMAIL_DOMAINS||"")
  .split(",").map(item=>item.trim().toLowerCase()).filter(Boolean);
const googleOAuthEnabled=process.env.MILREU_GOOGLE_OAUTH_ENABLED==="true";

if(!["local","staging","production"].includes(environment)){
  throw new Error("MILREU_ENVIRONMENT deve ser local, staging ou production.");
}
if(environment!=="local"&&!siteUrl.startsWith("https://")){
  throw new Error("MILREU_SITE_URL deve usar HTTPS fora do ambiente local.");
}
if(environment!=="local"&&allowDemo){
  throw new Error("Demonstração não pode ser ativada em staging ou produção.");
}

if (Boolean(url) !== Boolean(publishableKey)) {
  throw new Error("MILREU_SUPABASE_URL e MILREU_SUPABASE_PUBLISHABLE_KEY devem ser definidos em conjunto.");
}

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY foi ignorada pelo gerador do frontend.");
}

const config = {
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.22.0",
  environment,
  mode:url && publishableKey ? "supabase" : "demo",
  supabaseUrl:url || null,
  supabasePublishableKey:publishableKey || null,
  supabaseJsModule:"https://esm.sh/@supabase/supabase-js@2.110.8?bundle",
  siteUrl:siteUrl || null,
  callbackPath:"auth/callback/",
  afterLoginHash:"#/area-colaborativa",
  googleProvider:"google",
  auth:{
    googleOAuthEnabled,
    requirePreauthorization:true,
    allowedEmailDomains,
    storeProviderTokens:false,
    productionDemoDisabled:environment!=="local"
  },
  allowDemo,
  allowDemoMaster:allowDemo,
  deploymentProfilePath:"public/config/deployment-profile.runtime.json",
  registration:{
    openAccessRequests:true,
    requireApproval:true,
    requiredFields:["displayName","email","primaryProfileType"]
  },
  contributions:{
    functionName:"community-contribution-intake",
    publicIntakeEnabled:true,
    maxFiles:5,
    maxFileSizeBytes:26214400,
    turnstileSiteKey:process.env.MILREU_TURNSTILE_SITE_KEY?.trim()||null,
    privateBucket:"community-contributions-private"
  },
  security:{
    serviceRoleInBrowser:false,
    rlsRequired:true,
    storeGoogleProviderTokens:false
  }
};

await writeFile(
  "public/config/collaborative-area.runtime.json",
  JSON.stringify(config,null,2)+"\n"
);

console.log(`Configuração colaborativa: ${config.mode}.`);
