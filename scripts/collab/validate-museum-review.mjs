/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { existsSync,readFileSync } from "node:fs";

const pkg=JSON.parse(readFileSync("package.json","utf8"));
const model=JSON.parse(readFileSync("public/data/collaborative-museum-review-model.json","utf8"));
const training=JSON.parse(readFileSync("public/data/collaborative-training-trails.json","utf8"));
const library=JSON.parse(readFileSync("public/data/collaborative-library.json","utf8"));
const seed=JSON.parse(readFileSync("public/data/museum-review-seed.json","utf8"));
const approved=JSON.parse(readFileSync("public/data/museum-editorial-approved.json","utf8"));
const effects=JSON.parse(readFileSync("public/data/public-content-effects.json","utf8"));
const impact=JSON.parse(readFileSync("public/data/package-impact-registry.json","utf8"));
const modules=JSON.parse(readFileSync("public/data/collaborative-modules.json","utf8")).modules;
const roles=JSON.parse(readFileSync("public/data/collaborative-roles-permissions.json","utf8"));
const memories=JSON.parse(readFileSync("public/data/memories.json","utf8")).records;
const router=readFileSync("src/lib/router.js","utf8");
const controller=readFileSync("src/collab/controller.js","utf8");
const views=readFileSync("src/views/collaborative-museum-review.js","utf8");
const main=readFileSync("src/main.js","utf8");
const portal=readFileSync("src/views/portal.js","utf8");
const museum=readFileSync("src/views/museum.js","utf8");
const effectsComponent=readFileSync("src/components/public-content-effects.js","utf8");
const layout=readFileSync("src/components/collaborative-layout.js","utf8");
const build=readFileSync("scripts/build.mjs","utf8");
const smoke=readFileSync("scripts/smoke.mjs","utf8");
const exporter=readFileSync("scripts/museum-review/export-approved.mjs","utf8");
const apply=readFileSync("scripts/museum-review/apply-approved.mjs","utf8");
const foundation=readFileSync("supabase/migrations/20260724120000_collaborative_museum_review_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724120100_collaborative_museum_review_rpc.sql","utf8");
const sqlSeed=readFileSync("supabase/migrations/20260724120200_collaborative_museum_review_seed.sql","utf8");

if(pkg.version!=="0.32.0")throw new Error("Versão 08F incorreta.");
if(model.version!=="0.32.0"||model.recordCount!==31)throw new Error("Modelo de revisão incorreto.");
if(model.fields.length!==22)throw new Error("Mapa de campos incompleto.");
if(training.trails.length!==5||training.trails.reduce((sum,item)=>sum+item.lessons.length,0)!==15)throw new Error("Trilhas de formação incompletas.");
if(library.resources.length<9)throw new Error("Biblioteca incompleta.");
if(seed.records.length!==31||new Set(seed.records.map(item=>item.memoryId)).size!==31)throw new Error("Seed não contém 31 memórias únicas.");
if(approved.records.length!==0||approved.effects.length!==0)throw new Error("Snapshot inicial não deve inventar aprovações.");
if(Object.values(effects.slots).flat().length!==0)throw new Error("Efeitos iniciais devem estar vazios.");
if(impact.currentPackage!=="09D"||impact.version!=="0.32.0")throw new Error("Registo de impacto desatualizado.");

for(const code of ["library","training","museum-review","museum-review-management"]){
  const module=modules.find(item=>item.code===code);
  if(!module||module.status!=="active")throw new Error(`Módulo não ativo: ${code}`);
}
if(modules.some(item=>item.status!=="active"))throw new Error("Todos os módulos registados devem permanecer ativos.");

for(const permission of [
  "training.complete","training.assess","museum.review.view","museum.review.edit",
  "museum.review.comment","museum.review.assign","museum.review.check",
  "museum.review.editorial-approve","museum.review.rights-approve",
  "museum.review.publication-approve","museum.review.preview","museum.review.export",
  "museum.review.apply","museum.review.manage","museum.review.effects.manage"
]){
  if(!roles.permissions.includes(permission))throw new Error(`Permissão ausente: ${permission}`);
}
if(roles.rolePermissions.volunteer.includes("museum.review.apply"))throw new Error("Voluntário não pode aplicar snapshot.");

for(const route of [
  "collab-library-resource","collab-training-trail",
  "collab-museum-review-detail","collab-museum-review-preview",
  "collab-museum-review-management","collab-museum-review-management-detail",
  "collab-museum-review-management-preview","collab-museum-review-releases"
]){
  if(!router.includes(route))throw new Error(`Rota 08F ausente: ${route}`);
}
for(const view of [
  "collaborativeLibraryView","collaborativeLibraryResourceView",
  "collaborativeTrainingView","collaborativeTrainingTrailView",
  "collaborativeMuseumReviewView","collaborativeMuseumReviewDetailView",
  "collaborativeMuseumReviewPreviewView","collaborativeMuseumReviewManagementView"
]){
  if(!views.includes(view))throw new Error(`View 08F ausente: ${view}`);
}
for(const method of [
  "completeTrainingLesson","assessTraining","saveMuseumProposal","reviewMuseumProposal",
  "supersedeMuseumProposal","addMuseumReviewComment",
  "resolveMuseumReviewComment","assignMuseumReview",
  "setMuseumReviewCheck","decideMuseumReview","linkContributionToMuseumReview",
  "savePublicContentEffect","generateMuseumReviewSnapshot","approveMuseumReviewSnapshot"
]){
  if(!controller.includes(`async ${method}`))throw new Error(`Método 08F ausente: ${method}`);
}
for(const binding of [
  "data-training-lesson-complete","data-museum-proposal-form",
  "data-museum-proposal-review","data-museum-proposal-supersede",
  "data-museum-comment-form","data-museum-check-form",
  "data-museum-assignment-form","data-museum-decision-form",
  "data-museum-snapshot-form","data-public-effect-form"
]){
  if(!main.includes(binding))throw new Error(`Binding 08F ausente: ${binding}`);
}

if(!portal.includes('portal.home.after-featured')||!museum.includes('museum.home.after-opening')){
  throw new Error("Slots públicos não integrados.");
}
if(!effectsComponent.includes("record?.publication?.siteVisible")&&!effectsComponent.includes("publication.siteVisible")){
  throw new Error("Componente de efeitos sem referências canónicas.");
}
if(!layout.includes("gestao/revisao-museu"))throw new Error("Gestão editorial ausente da navegação.");

for(const table of [
  "collab_training_trails","collab_training_lessons","collab_training_enrolments",
  "collab_training_assessments","collab_library_resources","collab_museum_review_cycles",
  "collab_museum_review_records","collab_museum_review_field_proposals",
  "collab_museum_review_comments","collab_museum_review_assignments",
  "collab_museum_review_checks","collab_museum_review_decisions",
  "collab_museum_review_contribution_links","collab_museum_review_snapshots",
  "collab_public_content_effects"
]){
  if(!foundation.includes(table))throw new Error(`Tabela 08F ausente: ${table}`);
}
if((foundation.match(/enable row level security/g)||[]).length<16)throw new Error("RLS 08F incompleta.");

if(
  foundation.includes("grant select,insert,update on public.collab_training_enrolments")
  ||foundation.includes("grant select,insert,update on public.collab_training_lesson_progress")
  ||foundation.includes("grant select,insert on public.collab_training_assessments")
  ||foundation.includes("collab_training_enrolments_self_write")
  ||foundation.includes("collab_training_lesson_progress_self_write")
){
  throw new Error("Formação permite escrita direta; progresso deve passar pelas RPCs auditadas.");
}
if(!rpc.includes("collab_museum_review_field_allowed_08f")
   ||!rpc.includes("field_path_not_allowed")){
  throw new Error("Whitelist de campos editoriais ausente.");
}
if(!rpc.includes("invalid_contribution_id:%")
   ||!rpc.includes("contribution_not_eligible:%")){
  throw new Error("Validação dos contributos associados à proposta está incompleta.");
}


for(const fn of [
  "collab_training_completed_08f","collab_require_training_08f",
  "collab_complete_training_lesson_08f","collab_record_training_assessment_08f",
  "collab_bootstrap_museum_review_08f","collab_upsert_museum_review_proposal_08f",
  "collab_review_museum_proposal_08f","collab_supersede_museum_proposal_08f",
  "collab_add_museum_review_comment_08f",
  "collab_set_museum_review_check_08f","collab_museum_review_gates_08f",
  "collab_museum_review_publication_eligibility_08f",
  "collab_decide_museum_review_08f","collab_link_contribution_to_museum_review_08f",
  "collab_upsert_public_content_effect_08f","collab_generate_museum_review_snapshot_08f",
  "collab_approve_museum_review_snapshot_08f","collab_export_museum_review_snapshot_08f"
]){
  if(!rpc.includes(fn))throw new Error(`RPC 08F ausente: ${fn}`);
}
for(const sequence of [
  "editorial_approval_required","rights_approval_required",
  "publication_approval_required","public_release_eligibility_required",
  "training_required","review_gates_failed","literal_confirmation_required",
  "proposal_locked","accepted_proposal_not_found"
]){
  if(!rpc.includes(sequence))throw new Error(`Gate ausente: ${sequence}`);
}
if(rpc.includes("update public.memories")||rpc.includes("update public.museum"))throw new Error("RPC não pode alterar conteúdo canónico.");
if(!sqlSeed.includes("expected_31_records")&&!sqlSeed.includes("MM202631"))throw new Error("Seed SQL não cobre as 31 memórias.");
const mm617Seed=seed.records.find(item=>item.memoryId==="MM202617");
if(!mm617Seed||mm617Seed.publicReleaseEligible!==false||mm617Seed.requiresAiDisclosure!==true){
  throw new Error("MM202617 deve permanecer inelegível e exigir divulgação de IA no seed.");
}
if(!foundation.includes("requires_ai_disclosure boolean not null default false")){
  throw new Error("Campo de divulgação obrigatória de IA ausente.");
}
if(!rpc.includes("reviewNotice'='ai-substantive-intervention")){
  throw new Error("Gate de divulgação de IA ausente.");
}
if(!sqlSeed.includes("rights-credits-ai")||!sqlSeed.includes("accessible-public-writing"))throw new Error("Trilhas não foram semeadas.");
if(!sqlSeed.includes("select 'master',code"))throw new Error("Master sem permissões 08F.");

const browser=[controller,views,main,portal,museum,effectsComponent].join("\n");
if(browser.includes("SUPABASE_SERVICE_ROLE_KEY"))throw new Error("service_role exposta no browser.");
if(!exporter.includes("MILREU_SUPABASE_ACCESS_TOKEN")||!exporter.includes("SUPABASE_SERVICE_ROLE_KEY foi ignorada"))throw new Error("Exportação não usa JWT de utilizador.");
if(!apply.includes("I_CONFIRM_APPLY_APPROVED_MUSEUM_REVIEW")||!apply.includes("releases/editorial-backups"))throw new Error("Aplicação local sem confirmação ou backup.");
if(!apply.includes("sourceDatasetHash")||!apply.includes("baseHash"))throw new Error("Aplicação sem gates de hash.");
if(!exporter.includes("validateCandidates")||!apply.includes("Divulgação obrigatória de IA ausente")){
  throw new Error("Exportação/aplicação sem validação independente da divulgação de IA.");
}

for(const checksum of [
  "museumReviewModelChecksum","trainingTrailsChecksum","libraryChecksum",
  "museumEditorialApprovedChecksum","publicContentEffectsChecksum",
  "packageImpactRegistryChecksum"
]){
  if(!build.includes(checksum))throw new Error(`Checksum ausente: ${checksum}`);
}
for(const asset of [
  "collaborative-museum-review.js","public-content-effects.js",
  "collaborative-museum-review-model.json","collaborative-training-trails.json",
  "collaborative-library.json","museum-editorial-approved.json",
  "public-content-effects.json","package-impact-registry.json"
]){
  if(!smoke.includes(asset))throw new Error(`Smoke incompleto: ${asset}`);
}

const mm617=memories.find(item=>item.id==="MM202617");
if(!mm617||!mm617.publication.siteVisible)throw new Error("MM202617 deve permanecer visível para revisão.");
const interventions=JSON.stringify(mm617.media.digitalInterventions).toLowerCase();
if(!interventions.includes("ai")||!interventions.includes("substantive"))throw new Error("MM202617 sem divulgação de IA substantiva.");
if(mm617.publication.siteStatus!=="review-visible")throw new Error("MM202617 não deve ser publicado como final.");

for(const file of [
  "PROJECT_CONTEXT_LEDGER.md","PACKAGE_DEPENDENCY_MAP.md","CHANGE_SURFACE_REGISTRY.md",
  "CONTEXT_RECOVERY_PROTOCOL.md","supabase/collab-tests/008f_museum_review.test.sql"
]){
  if(!existsSync(file))throw new Error(`Ficheiro obrigatório ausente: ${file}`);
}

console.log("Pacote 08F validado: 31 memórias, formação, biblioteca, gates, snapshots, slots públicos e continuidade de contexto.");
