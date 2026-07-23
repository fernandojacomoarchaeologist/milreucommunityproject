/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { writeFile } from "node:fs/promises";

const url = process.env.MILREU_SUPABASE_URL?.trim() || "";
const publishableKey = process.env.MILREU_SUPABASE_PUBLISHABLE_KEY?.trim() || "";
const siteUrl = process.env.MILREU_SITE_URL?.trim() || "";
const allowDemo = process.env.MILREU_ALLOW_DEMO !== "false";

if (Boolean(url) !== Boolean(publishableKey)) {
  throw new Error("MILREU_SUPABASE_URL e MILREU_SUPABASE_PUBLISHABLE_KEY devem ser definidos em conjunto.");
}

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY foi ignorada pelo gerador do frontend.");
}

const config = {
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.12.0",
  mode:url && publishableKey ? "supabase" : "demo",
  supabaseUrl:url || null,
  supabasePublishableKey:publishableKey || null,
  supabaseJsModule:"https://esm.sh/@supabase/supabase-js@2.110.8?bundle",
  siteUrl:siteUrl || null,
  callbackPath:"auth/callback/",
  afterLoginHash:"#/area-colaborativa",
  googleProvider:"google",
  allowDemo,
  allowDemoMaster:allowDemo,
  registration:{
    openAccessRequests:true,
    requireApproval:true,
    requiredFields:["displayName","email","primaryProfileType"]
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
