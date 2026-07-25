/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile } from "node:fs/promises";

const profile=JSON.parse(await readFile("public/config/deployment-profile.runtime.json","utf8"));
const environment=profile.environment;
const google=profile.googleOAuth||{};
const errors=[];

if(google.provider!=="google")errors.push("O provider deve ser google.");
if(google.clientSecretInFrontend!==false)errors.push("O client secret não pode estar no frontend.");
if(google.storeProviderTokens!==false)errors.push("Tokens do Google não devem ser armazenados.");
if(google.requirePreauthorization!==true)errors.push("A pré-autorização deve permanecer obrigatória.");
if(environment!=="local"&&!String(profile.siteUrl||"").startsWith("https://"))errors.push("SITE_URL deve usar HTTPS.");
if(environment!=="local"&&!String(profile.supabaseUrl||"").startsWith("https://"))errors.push("Supabase deve usar HTTPS.");
if(environment==="local"){
  if(google.supabaseCallbackUrl&&google.supabaseCallbackUrl!=="http://127.0.0.1:54321/auth/v1/callback"){
    errors.push("Callback local do Supabase divergente.");
  }
  if(google.applicationCallbackUrl&&google.applicationCallbackUrl!=="http://localhost:4173/auth/callback/"){
    errors.push("Callback local da aplicação divergente.");
  }
}
if(profile.safety?.serviceRoleInBrowser!==false)errors.push("service_role não pode entrar no browser.");
if(profile.safety?.allowDemo&&environment!=="local")errors.push("Demonstração fora do ambiente local.");

console.log(JSON.stringify({
  environment,
  googleOAuthEnabled:google.enabled,
  applicationCallbackUrl:google.applicationCallbackUrl,
  supabaseCallbackUrl:google.supabaseCallbackUrl,
  allowedEmailDomains:google.allowedEmailDomains||[],
  errors
},null,2));

if(errors.length)throw new Error(`Contrato OAuth inválido: ${errors.join(" | ")}`);
if(process.env.MILREU_OAUTH_STRICT==="true"){
  if(!google.enabled)throw new Error("Google OAuth ainda não foi marcado como configurado.");
  if(!google.supabaseCallbackUrl||!google.applicationCallbackUrl)throw new Error("Callbacks OAuth não estão configurados.");
}
