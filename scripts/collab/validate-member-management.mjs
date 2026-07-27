/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync,readFileSync } from "node:fs";
const pkg=JSON.parse(readFileSync("package.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const catalog=JSON.parse(readFileSync("public/data/collaborative-member-catalog.json","utf8"));
const router=readFileSync("src/lib/router.js","utf8");
const controller=readFileSync("src/collab/controller.js","utf8");
const views=readFileSync("src/views/collaborative.js","utf8");
const main=readFileSync("src/main.js","utf8");
const css=readFileSync("src/styles/app.css","utf8");
const migration=readFileSync("supabase/migrations/20260723090100_collaborative_member_management_rpc.sql","utf8");
if(pkg.version!=="0.27.0")throw new Error("Versão 08B incorreta.");
for(const code of ["memberships.reject","memberships.suspend","memberships.archive","invitations.manage","member.audit.view","member.notes.manage"]){if(!roles.permissions.includes(code))throw new Error(`Permissão ausente: ${code}`);}
if(modules.find(x=>x.code==="profile-management")?.status!=="active")throw new Error("Gestão de perfis deve estar ativa.");
if(!modules.some(x=>x.code==="member-invitations"&&x.status==="active"))throw new Error("Pré-autorizações ausentes.");
if(catalog.interestAreas.length<8||catalog.skills.length<10)throw new Error("Catálogo de perfil insuficiente.");
for(const route of ["collab-member-detail","collab-invitations"]){if(!router.includes(route))throw new Error(`Rota ausente: ${route}`);}
for(const method of ["manageMember(values)","createInvitation(values)","revokeInvitation(invitationId","loadRemoteManagement()"]){if(!controller.includes(method))throw new Error(`Método ausente: ${method}`);}
for(const view of ["collaborativeMemberDetailView","collaborativeInvitationsView","data-member-search","data-collab-member-form","data-collab-invitation-form"]){if(!views.includes(view))throw new Error(`Interface ausente: ${view}`);}
if(!main.includes("checkedValues")||!main.includes("applyMemberFilters")||!main.includes("collaborative.manageMember"))throw new Error("Bindings 08B incompletos.");
for(const cls of [".collab-management-metrics",".collab-member-detail",".collab-invitation-layout"]){if(!css.includes(cls))throw new Error(`Estilo ausente: ${cls}`);}
for(const fn of ["collab_manage_member","collab_active_master_count","last_active_master_protected","collab_create_access_invitation","collab_claim_access_invitation","collab_revoke_access_invitation"]){if(!migration.includes(fn))throw new Error(`Proteção/RPC ausente: ${fn}`);}
for(const file of ["supabase/migrations/20260723090000_collaborative_member_management.sql","supabase/migrations/20260723090100_collaborative_member_management_rpc.sql","supabase/collab-tests/008b_member_management.test.sql"]){if(!existsSync(file))throw new Error(`Ficheiro ausente: ${file}`);}
console.log("Pacote 08B validado: gestão de membros, perfis, funções, histórico e pré-autorizações.");
