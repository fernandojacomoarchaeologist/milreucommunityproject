/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const build=spawnSync(process.execPath,["scripts/deploy/build-deployment-profile.mjs"],{
  stdio:"inherit",env:process.env
});
if(build.status!==0)process.exit(build.status??1);

const readiness=JSON.parse(await readFile("public/data/deployment-readiness.json","utf8"));
const profile=JSON.parse(await readFile("public/config/deployment-profile.runtime.json","utf8"));
const output={
  version:readiness.version,
  environment:profile.environment,
  status:readiness.status,
  blockingItems:readiness.blockingItems,
  callbacks:{
    supabase:profile.googleOAuth?.supabaseCallbackUrl||null,
    application:profile.googleOAuth?.applicationCallbackUrl||null
  },
  safety:profile.safety
};
console.log(JSON.stringify(output,null,2));
if(process.env.MILREU_PREFLIGHT_STRICT==="true"&&readiness.blockingItems.length){
  throw new Error("Preflight estrito falhou.");
}
