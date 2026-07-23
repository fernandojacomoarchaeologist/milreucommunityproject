/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync, readFileSync } from "node:fs";

const pkg=JSON.parse(readFileSync("package.json","utf8"));
const config=JSON.parse(readFileSync("public/config/collaborative-area.runtime.json","utf8"));
const example=JSON.parse(readFileSync("public/config/collaborative-area.example.json","utf8"));
const profiles=JSON.parse(readFileSync("public/data/collaborative-profile-types.json","utf8")).profileTypes;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const router=readFileSync("src/lib/router.js","utf8");
const controller=readFileSync("src/collab/controller.js","utf8");
const views=readFileSync("src/views/collaborative.js","utf8");
const callback=readFileSync("src/collab/callback.js","utf8");
const build=readFileSync("scripts/build.mjs","utf8");
const runtimeBuilder=readFileSync("scripts/collab/build-runtime-config.mjs","utf8");
const bootstrap=readFileSync("scripts/admin/bootstrap-master.mjs","utf8");
const css=readFileSync("src/styles/app.css","utf8");

if(pkg.version!=="0.12.0") throw new Error("Versão do pacote 08A incorreta.");
if(config.security.serviceRoleInBrowser!==false||example.security.serviceRoleInBrowser!==false){
  throw new Error("service_role não pode ser permitida no navegador.");
}
if(config.supabaseUrl!==null||config.supabasePublishableKey!==null){
  throw new Error("O pacote não deve conter credenciais Supabase.");
}
if(!config.supabaseJsModule.includes("@supabase/supabase-js@2.110.8")){
  throw new Error("Versão pinada do cliente Supabase ausente.");
}
if(profiles.length<8) throw new Error("Perfis de colaboração incompletos.");
if(!roles.roles.some(role=>role.code==="master")) throw new Error("Função master ausente.");
if(!roles.permissions.includes("exhibitions.manage")) throw new Error("Permissão de exposições ausente.");
if(modules.length!==10) throw new Error(`Esperados 10 módulos; obtidos ${modules.length}.`);
for(const code of ["profile","tasks","contributions","agenda","museum-review","profile-management","exhibition-management"]){
  if(!modules.some(module=>module.code===code)) throw new Error(`Módulo ausente: ${code}`);
}
for(const pattern of [
  "/area-colaborativa","/area-colaborativa/perfil","/area-colaborativa/tarefas",
  "/area-colaborativa/agenda","/area-colaborativa/revisao-museu",
  "/area-colaborativa/gestao/perfis","/area-colaborativa/gestao/exposicoes"
]){
  if(!router.includes(pattern)) throw new Error(`Rota colaborativa ausente: ${pattern}`);
}
if(!controller.includes("signInWithOAuth")||!controller.includes('provider:this.config.googleProvider')){
  throw new Error("Integração Google OAuth ausente.");
}
if(!controller.includes("collab_submit_access_request")||!controller.includes("collab_update_my_profile")){
  throw new Error("Operações de perfil/acesso ausentes.");
}
for(const field of ['name="displayName"','name="email"','name="primaryProfileType"']){
  if(!views.includes(field)) throw new Error(`Campo obrigatório ausente: ${field}`);
}
if(!views.includes("Calendário de exposições")||!views.includes("exposição física estará")){
  throw new Error("Esqueleto de exposições ausente.");
}
if(!callback.includes("exchangeCodeForSession")) throw new Error("Callback PKCE ausente.");
if(!build.includes('"auth"')||!build.includes("collaborativeChecksum")){
  throw new Error("Build não inclui callback ou checksum colaborativo.");
}
if(!runtimeBuilder.includes("SUPABASE_SERVICE_ROLE_KEY foi ignorada")){
  throw new Error("Proteção do gerador de configuração ausente.");
}
if(!bootstrap.includes("MILREU_MASTER_EMAIL")||!bootstrap.includes("SUPABASE_SERVICE_ROLE_KEY")){
  throw new Error("Bootstrap configurável do master ausente.");
}
if(bootstrap.includes("@gmail.com")||bootstrap.includes("@googlemail.com")){
  throw new Error("E-mail pessoal não pode ser hardcoded.");
}
if(!css.includes(".collab-login")||!css.includes(".collab-layout")){
  throw new Error("Estilos da Área Colaborativa ausentes.");
}
for(const migration of [
  "20260723080000_collaborative_foundation.sql",
  "20260723080100_collaborative_seed.sql",
  "20260723080200_collaborative_rls_and_rpc.sql",
  "20260723080300_collaborative_context_and_admin.sql",
  "20260723080400_collaborative_tasks_exhibitions.sql"
]){
  if(!existsSync(`supabase/migrations/${migration}`)) throw new Error(`Migration ausente: ${migration}`);
}
const allSql=["supabase/migrations/20260723080000_collaborative_foundation.sql",
"supabase/migrations/20260723080200_collaborative_rls_and_rpc.sql",
"supabase/migrations/20260723080400_collaborative_tasks_exhibitions.sql"]
.map(path=>readFileSync(path,"utf8")).join("\n");
if((allSql.match(/enable row level security/g)||[]).length<14){
  throw new Error("Baseline RLS insuficiente.");
}
if(!allSql.includes("collab_exhibition_schedule")||!allSql.includes("collab_tasks")){
  throw new Error("Esqueletos operacionais ausentes.");
}

console.log("Fundação 08A validada: Google OAuth, perfis, permissões, master configurável e módulos.");
