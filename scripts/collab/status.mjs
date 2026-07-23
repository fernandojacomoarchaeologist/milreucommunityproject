/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync("public/config/collaborative-area.runtime.json","utf8"));
const modules = JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;

console.log(JSON.stringify({
  version:config.version,
  mode:config.mode,
  supabaseConfigured:Boolean(config.supabaseUrl && config.supabasePublishableKey),
  siteUrl:config.siteUrl,
  googleProvider:config.googleProvider,
  demoAllowed:config.allowDemo,
  serviceRoleInBrowser:config.security.serviceRoleInBrowser,
  modules:{
    total:modules.length,
    active:modules.filter(item=>item.status==="active").length,
    foundation:modules.filter(item=>item.status==="foundation").length,
    skeleton:modules.filter(item=>item.status==="skeleton").length
  }
},null,2));
