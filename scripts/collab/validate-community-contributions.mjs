/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync,readFileSync } from "node:fs";

const pkg=JSON.parse(readFileSync("package.json","utf8"));
const model=JSON.parse(readFileSync("public/data/collaborative-contribution-model.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const config=JSON.parse(readFileSync("public/config/collaborative-area.runtime.json","utf8"));
const summary=JSON.parse(readFileSync("public/data/contributions-public-summary.json","utf8"));
const router=readFileSync("src/lib/router.js","utf8");
const controller=readFileSync("src/collab/controller.js","utf8");
const publicView=readFileSync("src/views/contributions-public.js","utf8");
const collaborativeView=readFileSync("src/views/collaborative-contributions.js","utf8");
const main=readFileSync("src/main.js","utf8");
const layout=readFileSync("src/components/collaborative-layout.js","utf8");
const portal=readFileSync("src/views/portal.js","utf8");
const css=readFileSync("src/styles/app.css","utf8");
const build=readFileSync("scripts/build.mjs","utf8");
const smoke=readFileSync("scripts/smoke.mjs","utf8");
const foundation=readFileSync("supabase/migrations/20260724110000_collaborative_contributions_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724110100_collaborative_contributions_rpc.sql","utf8");
const seed=readFileSync("supabase/migrations/20260724110200_collaborative_contributions_seed.sql","utf8");
const edge=readFileSync("supabase/functions/community-contribution-intake/index.ts","utf8");
const edgeConfig=readFileSync("supabase/functions/community-contribution-intake/config.toml","utf8");

if(pkg.version!=="0.17.0")throw new Error("Versão 08E incorreta.");
if(model.version!=="0.17.0")throw new Error("Modelo 08E desatualizado.");
for(const collection of [
  "contributionTypes","statuses","attributionPreferences","usageScopes",
  "targetTypes","targetRelations","fileStatuses","decisionTypes",
  "incorporationDestinations","withdrawalStatuses"
]){
  if(!Array.isArray(model[collection])||!model[collection].length){
    throw new Error(`Catálogo 08E ausente: ${collection}`);
  }
}
if(model.limits.maxFiles!==5||model.limits.maxFileSizeBytes!==26214400){
  throw new Error("Limites de ficheiros inconsistentes.");
}

for(const code of ["contributions","contribution-moderation"]){
  const module=modules.find(item=>item.code===code);
  if(!module||module.status!=="active")throw new Error(`Módulo 08E não ativo: ${code}`);
}

for(const permission of [
  "contributions.track-own","contributions.view-all","contributions.assign",
  "contributions.review","contributions.decide","contributions.request-info",
  "contributions.files.review","contributions.export","withdrawals.manage","rights.review"
]){
  if(!roles.permissions.includes(permission))throw new Error(`Permissão 08E ausente: ${permission}`);
}

if(!roles.rolePermissions.volunteer.includes("contributions.track-own")){
  throw new Error("Voluntário sem acompanhamento dos próprios contributos.");
}
if(roles.rolePermissions.volunteer.includes("contributions.decide")){
  throw new Error("Voluntário não pode decidir contributos.");
}

for(const route of [
  "public-contribution-new","public-contribution-track","public-contribution-withdrawal",
  "collab-contribution-new","collab-contribution-detail",
  "collab-contribution-moderation","collab-contribution-moderation-detail"
]){
  if(!router.includes(route))throw new Error(`Rota 08E ausente: ${route}`);
}

for(const method of [
  "submitContribution(payload,files=[])","trackContribution(trackingCode,email)",
  "requestContributionWithdrawal(values)","assignContribution(contributionId",
  "moderateContribution(contributionId","createIncorporationProposal(contributionId",
  "reviewContributionFile(fileId","resolveWithdrawal(requestId",
  "getContributionFileLink(fileId)"
]){
  if(!controller.includes(method))throw new Error(`Método 08E ausente: ${method}`);
}
if(!controller.includes("createDemoContributionWorkspace")){
  throw new Error("Demonstração 08E ausente.");
}

for(const marker of [
  "data-public-contribution-form","data-public-contribution-track-form",
  "data-public-withdrawal-form"
]){
  if(!publicView.includes(marker))throw new Error(`Formulário público ausente: ${marker}`);
}
for(const marker of [
  "data-member-contribution-form","data-contribution-assignment-form",
  "data-contribution-moderation-form","data-incorporation-proposal-form",
  "data-contribution-file-review","data-withdrawal-resolve"
]){
  if(!collaborativeView.includes(marker))throw new Error(`Interface interna ausente: ${marker}`);
}
for(const binding of [
  "data-public-contribution-form","data-public-contribution-track-form",
  "data-public-withdrawal-form","data-contribution-moderation-form",
  "data-contribution-file-link","data-withdrawal-resolve"
]){
  if(!main.includes(binding))throw new Error(`Binding 08E ausente: ${binding}`);
}
if(!portal.includes("Partilhar contributo")||!layout.includes("gestao/contributos")){
  throw new Error("Integração de navegação 08E incompleta.");
}
for(const cls of [
  ".public-contribution-form",".contribution-card",
  ".contribution-moderation-workspace",".contribution-success"
]){
  if(!css.includes(cls))throw new Error(`Estilo 08E ausente: ${cls}`);
}

for(const table of [
  "collab_consent_versions","collab_contribution_submitters","collab_contributions",
  "collab_contribution_consents","collab_contribution_files","collab_contribution_targets",
  "collab_contribution_assignments","collab_contribution_events",
  "collab_contribution_decisions","collab_contribution_incorporation_proposals",
  "collab_withdrawal_requests","collab_public_submission_rate_limits"
]){
  if(!foundation.includes(table))throw new Error(`Tabela 08E ausente: ${table}`);
}
if(!foundation.includes("enable row level security")){
  throw new Error("RLS 08E ausente.");
}
if(!foundation.includes("'community-contributions-private'")||!foundation.includes("public=false")){
  throw new Error("Bucket privado 08E ausente.");
}
if(/grant\s+insert[\s\S]{0,80}to\s+anon/i.test(foundation)){
  throw new Error("Anon não pode inserir diretamente nas tabelas.");
}

for(const fn of [
  "collab_create_public_contribution_08e","collab_create_member_contribution_08e",
  "collab_track_public_contribution_08e","collab_submit_withdrawal_request_08e",
  "collab_assign_contribution_08e","collab_moderate_contribution_08e",
  "collab_create_incorporation_proposal_08e","collab_review_contribution_file_08e",
  "collab_can_access_contribution_file_08e","collab_resolve_withdrawal_request_08e"
]){
  if(!rpc.includes(fn))throw new Error(`RPC 08E ausente: ${fn}`);
}
if(!rpc.includes("contribution_not_accepted")){
  throw new Error("Proposta de incorporação sem gate editorial.");
}
if(rpc.includes("update public.memories")||rpc.includes("update public.museum")){
  throw new Error("08E não pode alterar conteúdo canónico.");
}
if(!rpc.includes("grant execute on function public.collab_create_public_contribution_08e(jsonb) to service_role")){
  throw new Error("Entrada pública não está limitada ao serviço intermediário.");
}
if(!rpc.includes("collab_track_public_contribution_08e(text,text) to service_role")
   ||!rpc.includes("collab_submit_withdrawal_request_08e(text,text,text,text) to service_role")){
  throw new Error("Acompanhamento e retirada devem passar pela Edge Function.");
}
if(!rpc.includes("collab_consume_public_rate_limit_08e")){
  throw new Error("Rate limit atómico ausente.");
}
const contributionInsert=rpc.split("insert into public.collab_contributions",2)[1]||"";
if(contributionInsert.includes("p_payload->>'status'")){
  throw new Error("Participante não pode escolher estado editorial.");
}

if(!seed.includes("2026-08E-v1")||!seed.includes("contribution-moderation")){
  throw new Error("Consentimento ou módulo 08E ausente.");
}
if(!seed.includes("select 'master',code")){
  throw new Error("Master não recebeu permissões 08E.");
}

if(!edgeConfig.includes("verify_jwt = false"))throw new Error("Config da função pública ausente.");
for(const securityFeature of [
  "RATE_LIMIT_SALT","TURNSTILE_SECRET_KEY","ALLOWED_ORIGINS",
  "createSignedUploadUrl","uploadToSignedUrl","file-link",
  "SUPABASE_SERVICE_ROLE_KEY"
]){
  if(!edge.includes(securityFeature)&&securityFeature!=="uploadToSignedUrl"){
    throw new Error(`Proteção da Edge Function ausente: ${securityFeature}`);
  }
}
if(edge.includes("localStorage")||edge.includes("document.")){
  throw new Error("Edge Function contém código de browser.");
}
const browserFiles=[controller,publicView,collaborativeView,main,config,portal,layout].join("\n");
if(browserFiles.includes("SUPABASE_SERVICE_ROLE_KEY")){
  throw new Error("service_role exposta no browser.");
}

if(summary.counts.submitted!==0||summary.counts.accepted!==0){
  throw new Error("Resumo público inicial contém dados não aprovados.");
}
const summaryText=JSON.stringify(summary);
for(const pii of ["email","phone","display_name","trackingCode"]){
  if(summaryText.includes(`"${pii}"`))throw new Error(`PII no resumo público: ${pii}`);
}

if(!build.includes("contributionModelChecksum")||!build.includes("contributionSummaryChecksum")){
  throw new Error("Checksums 08E ausentes.");
}
for(const asset of [
  "collaborative-contributions.js","contributions-public.js",
  "collaborative-contribution-model.json","contributions-public-summary.json"
]){
  if(!smoke.includes(asset))throw new Error(`Smoke 08E incompleto: ${asset}`);
}

for(const file of [
  "supabase/migrations/20260724110000_collaborative_contributions_foundation.sql",
  "supabase/migrations/20260724110100_collaborative_contributions_rpc.sql",
  "supabase/migrations/20260724110200_collaborative_contributions_seed.sql",
  "supabase/collab-tests/008e_contributions.test.sql",
  "supabase/functions/community-contribution-intake/index.ts"
]){
  if(!existsSync(file))throw new Error(`Ficheiro 08E ausente: ${file}`);
}

console.log("Pacote 08E validado: contributos, ficheiros privados, consentimento, moderação, retirada e encaminhamento sem publicação automática.");
