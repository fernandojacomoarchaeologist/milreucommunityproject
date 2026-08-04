/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { loadCollaborativeConfig, loadCollaborativeFoundationData, callbackUrl } from "./config.js";
import { createCollaborativeSupabaseClient } from "./supabase-client.js";
import { expandRolePermissions, visibleModules, hasPermission } from "./permissions.js";
import * as opp from "./opportunities-demo.js";

const DEMO_KEY="milreu-collaborative-demo-context-v9";
const PUBLIC_CONTRIBUTION_DEMO_KEY="milreu-public-contributions-demo-v1";
const OPPORTUNITIES_DEMO_KEY="milreu-opportunities-demo-v1";

function emptyManagement(){return{members:[],requests:[],invitations:[],notes:[],audit:[]};}
function emptyTaskWorkspace(){return{tasks:[],assignments:[],requiredSkills:[],preferences:null,availability:[],timeEntries:[],updates:[]};}
function emptyExhibitionWorkspace(){return{venues:[],exhibitions:[],schedules:[],events:[],participants:[],checklist:[],conflicts:[]};}
function emptyContributionWorkspace(){return{contributions:[],submitters:[],consents:[],files:[],targets:[],assignments:[],events:[],decisions:[],proposals:[],withdrawals:[]};}
function emptyMuseumReviewWorkspace(){return{cycles:[],records:[],proposals:[],comments:[],assignments:[],checks:[],decisions:[],contributionLinks:[],snapshots:[],effects:[],trainingEnrolments:[],lessonProgress:[],assessments:[]};}
function emptyDeploymentWorkspace(){return{environments:[],authPolicy:null,runs:[],checks:[],catalog:[],readiness:null};}
function emptyNotificationWorkspace(){return{notifications:[],preferences:[],channels:[],templates:[],summary:{unreadCount:0,criticalUnreadCount:0,byCategory:{}},operations:{channels:[],outboxCounts:{},recentOutbox:[],deliveryCounts:{},templates:[]}};}
function emptyPilotWorkspace(){return{authenticated:false,canManage:false,productionWrites:false,publicEffects:false,cycles:[],myParticipation:[],myObservations:[],gates:[]};}
function emptyParticipationWorkspace(){return{authenticated:false,canManage:false,programmes:[],myEnrolments:[]};}
function emptyOpportunitiesWorkspace(){return{canManage:false,viewerId:null,opportunities:[],applications:[],notice:null};}
function emptyPublicIntegrationWorkspace(){return{authenticated:false,activePublicEffects:0,productionWrites:false,proposals:[],snapshots:[],evolutionProposals:[]};}
function emptyOperationsGovernanceWorkspace(){return{authenticated:false,canManage:false,activeOperatingCycles:0,operatingCycles:[],mySupport:[],governanceDecisions:[]};}
function emptyOperationalWorkspace(){return{settings:[],retentionPolicies:[],legalHolds:[],lifecycleRuns:[],incidents:[],incidentUpdates:[],incidentActions:[],backupPlans:[],backupVerifications:[],continuityExercises:[],checkCatalog:[],operationalRuns:[],operationalResults:[],summary:{openCriticalIncidents:0,activeLegalHolds:0,failedBackupVerifications:0,latestOperationalStatus:"not-run",auditEvents30Days:0},audit:{total:0,limit:100,offset:0,rows:[]},integrity:null};}
function emptyContext(){return{ready:false,mode:"demo",authenticated:false,session:null,profile:null,membership:null,accessRequest:null,roles:[],permissions:[],modules:[],profileTypes:[],moduleRegistry:[],roleRegistry:[],permissionRegistry:[],memberCatalog:{interestAreas:[],skills:[],languages:[]},taskModel:{categories:[],taskStatuses:[],assignmentStatuses:[],assignmentModes:[],locationModes:[],priorities:[],availabilityModes:[],weekdays:[]},exhibitionModel:{exhibitionTypes:[],exhibitionStatuses:[],venueTypes:[],scheduleStatuses:[],installationStatuses:[],logisticsStatuses:[],eventTypes:[],eventStatuses:[],visibilityOptions:[],rsvpStatuses:[],checklistCategories:[]},contributionModel:{contributionTypes:[],statuses:[],attributionPreferences:[],usageScopes:[],targetTypes:[],targetRelations:[],fileStatuses:[],decisionTypes:[],incorporationDestinations:[],withdrawalStatuses:[],limits:{}},museumReviewModel:{reviewStatuses:[],proposalStatuses:[],commentTypes:[],checkTypes:[],decisionTypes:[],assignmentRoles:[],fieldGroups:[],fields:[],requiredTrainingByAction:{}},trainingTrails:{trails:[]},library:{resources:[]},reviewSeed:{cycle:null,records:[]},homologationModel:{environments:[],runStatuses:[],checkStatuses:[],checkCategories:[],requiredChecks:[],productionGates:{}},deploymentProfile:{environment:"local"},deploymentReadiness:{status:"configuration-pending",checks:{},blockingItems:[]},notificationModel:{channels:[],categories:[],eventTypes:[],notificationStatuses:[],outboxStatuses:[],deliveryStatuses:[],preferenceRules:{},templateTokens:[],dispatch:{}},notificationTemplates:{templates:[],rules:{}},notificationRuntime:{inApp:{enabled:true,pollIntervalSeconds:60,pageSize:30},email:{provider:"disabled",enabled:false}},operationalGovernanceModel:{modules:[],operationalChecks:[],incident:{},backup:{},continuity:{},retention:{},audit:{},safety:{}},retentionModel:{policies:[],rules:{}},operationsRuntime:{environment:"local",dashboard:{pollIntervalSeconds:120}},releaseCandidateModel:{candidate:"RC1",scenarioCounts:{},externalGates:[],humanGates:[]},releaseCandidateReadiness:{technicalCandidate:{status:"not-evaluated",approved:false,checks:[],blockers:[]},stagingHomologation:{status:"blocked",approved:false,blockers:[]},productionApproval:{status:"blocked",approved:false,blockers:[]}},accessibilityAuditModel:{},e2eScenarios:{scenarios:[]},management:emptyManagement(),taskWorkspace:emptyTaskWorkspace(),exhibitionWorkspace:emptyExhibitionWorkspace(),contributionWorkspace:emptyContributionWorkspace(),museumReviewWorkspace:emptyMuseumReviewWorkspace(),deploymentWorkspace:emptyDeploymentWorkspace(),notificationWorkspace:emptyNotificationWorkspace(),operationalWorkspace:emptyOperationalWorkspace(),pilotWorkspace:emptyPilotWorkspace(),participationWorkspace:emptyParticipationWorkspace(),opportunitiesWorkspace:emptyOpportunitiesWorkspace(),publicIntegrationWorkspace:emptyPublicIntegrationWorkspace(),operationsGovernanceWorkspace:emptyOperationsGovernanceWorkspace(),tasks:[],exhibitions:[],error:null,notice:null};}
function demoAudit(action,userId,actor="demo-master",metadata={}){return{id:`demo-audit-${Date.now()}-${Math.random()}`,actor_user_id:actor,action,entity_type:"membership",entity_id:userId,metadata,created_at:new Date().toISOString()};}
function daysFromNow(days,hour=10){const d=new Date();d.setDate(d.getDate()+days);d.setHours(hour,0,0,0);return d.toISOString();}
function demoTaskUpdate(taskId,userId,type,note="",metadata={}){return{id:`demo-update-${Date.now()}-${Math.random()}`,project_id:"demo-project",task_id:taskId,user_id:userId,update_type:type,note,metadata,created_at:new Date().toISOString()};}

function dateFromNow(days){return daysFromNow(days,12).slice(0,10);}
function createDemoExhibitionWorkspace(){
  const venues=[
    {id:"demo-venue-cultural",project_id:"demo-project",name:"Espaço Cultural de demonstração",slug:"espaco-cultural-demonstracao",venue_type:"cultural-centre",municipality:"Faro",locality:"Localidade de demonstração",address_text:"Morada fictícia para avaliação",country_code:"PT",postal_code:null,public_email:null,public_phone:null,public_url:null,opening_hours:"Horário de demonstração",public_description:"Local fictício utilizado apenas para testar a gestão da itinerância.",accessibility_summary:"Informação de acessibilidade por validar.",accessibility_notes:"Dado de demonstração.",internal_notes:"Não corresponde a um local real.",status:"active",public_visibility:true,active:true},
    {id:"demo-venue-school",project_id:"demo-project",name:"Escola de demonstração",slug:"escola-demonstracao",venue_type:"school",municipality:"Faro",locality:"Localidade de demonstração",address_text:null,country_code:"PT",postal_code:null,public_description:null,accessibility_summary:null,internal_notes:"Local de demonstração ainda em contacto.",status:"draft",public_visibility:false,active:true}
  ];
  const exhibitions=[
    {id:"demo-exhibition-itinerant",project_id:"demo-project",title:"Entre Ruínas e Memórias — demonstração",slug:"entre-ruinas-memorias-demonstracao",subtitle:"Exposição comunitária itinerante",exhibition_type:"itinerant",description:"Registo fictício para avaliar o fluxo de itinerância.",public_summary:"Exposição de demonstração sem correspondência com datas ou locais reais.",internal_objectives:"Testar calendário, publicação, logística e voluntariado.",status:"active",default_duration_days:14,public_visibility:true,published_at:new Date().toISOString()}
  ];
  const schedules=[
    {id:"demo-schedule-current",project_id:"demo-project",exhibition_id:"demo-exhibition-itinerant",venue_id:"demo-venue-cultural",slug:"demonstracao-local-atual",starts_on:dateFromNow(-3),ends_on:dateFromNow(7),status:"open",installation_at:daysFromNow(-4,9),dismantling_at:daysFromNow(8,9),public_title:"Exposição em local de demonstração",public_summary:"Período fictício para avaliação do calendário.",public_notes:"Não corresponde a uma exposição real.",internal_notes:"Validar a experiência de coordenação.",public_visibility:true,published_at:new Date().toISOString(),opening_hours:"Horário de demonstração",public_contact:null,registration_url:null,installation_status:"checked",logistics_status:"in-progress",transport_notes:"Notas fictícias.",condition_report_before:"Verificação de demonstração concluída.",condition_report_after:null},
    {id:"demo-schedule-future",project_id:"demo-project",exhibition_id:"demo-exhibition-itinerant",venue_id:"demo-venue-school",slug:"demonstracao-proximo-local",starts_on:dateFromNow(30),ends_on:dateFromNow(44),status:"planned",installation_at:daysFromNow(29,9),dismantling_at:daysFromNow(45,9),public_title:null,public_summary:null,public_notes:null,internal_notes:"Período ainda não confirmado.",public_visibility:false,published_at:null,opening_hours:null,public_contact:null,registration_url:null,installation_status:"not-started",logistics_status:"not-started",transport_notes:null,condition_report_before:null,condition_report_after:null}
  ];
  const events=[
    {id:"demo-event-opening",project_id:"demo-project",exhibition_schedule_id:"demo-schedule-current",venue_id:"demo-venue-cultural",title:"Abertura de demonstração",description:"Evento fictício para testar confirmações de participação.",event_type:"opening",status:"confirmed",visibility:"public",starts_at:daysFromNow(1,18),ends_at:daysFromNow(1,20),location_text:"Espaço Cultural de demonstração",capacity:30,registration_required:false,registration_url:null,public_contact:null},
    {id:"demo-event-dismantling",project_id:"demo-project",exhibition_schedule_id:"demo-schedule-current",venue_id:"demo-venue-cultural",title:"Apoio à desmontagem — demonstração",description:"Atividade interna fictícia.",event_type:"dismantling",status:"confirmed",visibility:"members",starts_at:daysFromNow(8,9),ends_at:daysFromNow(8,13),location_text:"Espaço Cultural de demonstração",capacity:6,registration_required:true,registration_url:null,public_contact:null}
  ];
  const participants=[
    {event_id:"demo-event-opening",user_id:"demo-volunteer",status:"attending",notes:null,responded_at:new Date().toISOString()}
  ];
  const checklist=[
    {id:"demo-check-transport",project_id:"demo-project",schedule_id:"demo-schedule-current",category:"transport",title:"Confirmar transporte dos painéis",description:"Item fictício.",status:"in-progress",assigned_to:"demo-master",due_at:daysFromNow(6,18),sort_order:10},
    {id:"demo-check-accessibility",project_id:"demo-project",schedule_id:"demo-schedule-current",category:"accessibility",title:"Verificar circulação e altura dos textos",description:"Item fictício.",status:"pending",assigned_to:null,due_at:daysFromNow(6,18),sort_order:20},
    {id:"demo-check-condition",project_id:"demo-project",schedule_id:"demo-schedule-current",category:"condition",title:"Registar estado antes da desmontagem",description:"Item fictício.",status:"pending",assigned_to:null,due_at:daysFromNow(7,18),sort_order:30}
  ];
  return{venues,exhibitions,schedules,events,participants,checklist,conflicts:[]};
}


function createDemoContributionWorkspace(){
  const now=new Date().toISOString();
  const submitters=[
    {id:"demo-submitter-volunteer",project_id:"demo-project",user_id:"demo-volunteer",display_name:"Voluntário de demonstração",email:"voluntario@local.invalid",locality:"Faro",preferred_contact:"email",contact_allowed:true},
    {id:"demo-submitter-public",project_id:"demo-project",user_id:null,display_name:"Participante de demonstração",email:"participante@local.invalid",locality:"Estoi",preferred_contact:"email",contact_allowed:true},
    {id:"demo-submitter-correction",project_id:"demo-project",user_id:null,display_name:"Colaborador de demonstração",email:"correcao@local.invalid",locality:"Faro",preferred_contact:"email",contact_allowed:true}
  ];
  const contributions=[
    {id:"demo-contribution-photo",project_id:"demo-project",submitter_id:"demo-submitter-volunteer",submitter_user_id:"demo-volunteer",contribution_type:"photograph",title:"Fotografia familiar de demonstração",summary:"Fotografia fictícia para testar o acompanhamento.",content:"A imagem de demonstração representaria uma visita familiar a Milreu.",historical_context:"Contexto fictício.",place_text:"Milreu",date_text:"Década de demonstração",source_context:"Arquivo familiar fictício.",attribution_preference:"discuss",requested_usage_scope:"review-only",rights_declaration:"Declaração fictícia para avaliação.",status:"submitted",priority:"normal",public_reference:"MILREU-DEMO-001",public_message:"Contributo recebido.",assigned_to:null,submitted_at:now,updated_at:now,trackingCode:"DEMO-PHOTO-001"},
    {id:"demo-contribution-testimony",project_id:"demo-project",submitter_id:"demo-submitter-public",submitter_user_id:null,contribution_type:"testimony",title:"Memória comunitária de demonstração",summary:"Testemunho fictício.",content:"Relato criado apenas para testar a fila de moderação.",historical_context:null,place_text:"Estoi",date_text:null,source_context:"Memória oral fictícia.",attribution_preference:"anonymous",requested_usage_scope:"digital-project",rights_declaration:"Declaração fictícia.",status:"triage",priority:"normal",public_reference:"MILREU-DEMO-002",public_message:"O contributo está em triagem.",assigned_to:"demo-master",submitted_at:daysFromNow(-2),triaged_at:daysFromNow(-1),updated_at:now,trackingCode:"DEMO-TESTIMONY-002"},
    {id:"demo-contribution-correction",project_id:"demo-project",submitter_id:"demo-submitter-correction",submitter_user_id:null,contribution_type:"correction",title:"Correção de identificação — demonstração",summary:"Proposta fictícia ligada a MM202603.",content:"A pessoa identificada na legenda deverá ser revista.",historical_context:"Sem prova documental nesta demonstração.",place_text:null,date_text:null,source_context:"Conhecimento local fictício.",attribution_preference:"discuss",requested_usage_scope:"review-only",rights_declaration:"Declaração fictícia.",status:"under-review",priority:"high",public_reference:"MILREU-DEMO-003",public_message:"A informação está em revisão.",assigned_to:"demo-master",submitted_at:daysFromNow(-5),reviewed_at:daysFromNow(-1),updated_at:now,trackingCode:"DEMO-CORRECTION-003"}
  ];
  const files=[
    {id:"demo-file-photo",project_id:"demo-project",contribution_id:"demo-contribution-photo",storage_bucket:"community-contributions-private",storage_path:"demo/private/photo.jpg",original_filename:"fotografia-demonstracao.jpg",mime_type:"image/jpeg",size_bytes:1200000,status:"scan-pending",rights_note:"Ficheiro fictício; não existe no armazenamento.",created_at:now},
    {id:"demo-file-reference",project_id:"demo-project",contribution_id:"demo-contribution-correction",storage_bucket:"community-contributions-private",storage_path:"demo/private/reference.pdf",original_filename:"referencia-demonstracao.pdf",mime_type:"application/pdf",size_bytes:240000,status:"uploaded",rights_note:"Documento fictício.",created_at:now}
  ];
  const targets=[
    {id:"demo-target-correction",project_id:"demo-project",contribution_id:"demo-contribution-correction",target_type:"museum-memory",target_identifier:"MM202603",relation_type:"corrects",note:"Relação fictícia."}
  ];
  const assignments=[
    {id:"demo-assignment-testimony",project_id:"demo-project",contribution_id:"demo-contribution-testimony",reviewer_user_id:"demo-master",assignment_role:"triage",status:"active",assigned_by:"demo-master",assigned_at:daysFromNow(-1)},
    {id:"demo-assignment-correction",project_id:"demo-project",contribution_id:"demo-contribution-correction",reviewer_user_id:"demo-master",assignment_role:"reviewer",status:"active",assigned_by:"demo-master",assigned_at:daysFromNow(-1)}
  ];
  const events=contributions.map(item=>({id:`demo-event-${item.id}`,project_id:"demo-project",contribution_id:item.id,actor_user_id:item.submitter_user_id,event_type:"contribution.submitted",from_status:null,to_status:"submitted",note:"Contributo submetido.",visible_to_submitter:true,metadata:{},created_at:item.submitted_at}));
  events.push({id:"demo-event-triage",project_id:"demo-project",contribution_id:"demo-contribution-testimony",actor_user_id:"demo-master",event_type:"contribution.moderated",from_status:"submitted",to_status:"triage",note:"Triagem de demonstração.",visible_to_submitter:false,metadata:{action:"triage"},created_at:daysFromNow(-1)});
  const consents=contributions.map(item=>({id:`demo-consent-${item.id}`,project_id:"demo-project",contribution_id:item.id,consent_version:"2026-08E-v1",privacy_accepted:true,rights_confirmed:true,project_use_authorised:true,contact_authorised:true,public_attribution_authorised:false,accepted_at:item.submitted_at}));
  const withdrawals=[{id:"demo-withdrawal",project_id:"demo-project",contribution_id:"demo-contribution-photo",public_reference:"MILREU-DEMO-001",requester_user_id:"demo-volunteer",requester_name:"Voluntário de demonstração",requester_email:"voluntario@local.invalid",reason:"Pedido fictício para avaliar o fluxo.",status:"submitted",submitted_at:now}];
  return{contributions,submitters,consents,files,targets,assignments,events,decisions:[],proposals:[],withdrawals};
}


function createDemoMuseumReviewWorkspace(reviewSeed,trainingTrails,master=false){
  const cycle={id:"demo-review-cycle",project_id:"demo-project",code:reviewSeed.cycle.code,title:reviewSeed.cycle.title,description:"Ciclo local de demonstração, sem alterações canónicas.",status:"active",source_dataset_version:reviewSeed.cycle.sourceDatasetVersion,source_dataset_hash:"demo-source-hash",started_at:new Date().toISOString(),created_at:new Date().toISOString()};
  const records=reviewSeed.records.map((item,index)=>({id:`demo-review-${item.memoryId}`,project_id:"demo-project",cycle_id:cycle.id,memory_id:item.memoryId,status:index===0&&master?"in-progress":"not-started",source_record_hash:item.baseHash,source_editorial_status:item.sourceEditorialStatus,source_site_visible:item.siteVisible,public_release_eligible:item.publicReleaseEligible,requires_ai_disclosure:Boolean(item.requiresAiDisclosure),assigned_editor:index===0&&master?"demo-master":null,assigned_researcher:null,assigned_rights_reviewer:null,assigned_translator:null,blocking_comment_count:0,accepted_proposal_count:0,linked_contribution_count:0,editorial_approved_at:null,rights_approved_at:null,publication_approved_at:null,incorporated_at:null,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}));
  const checks=records.flatMap(record=>["editorial","source","rights","digital-intervention","accessibility","translation","relations","publication"].map(type=>({id:`demo-check-${record.memory_id}-${type}`,project_id:"demo-project",review_record_id:record.id,check_type:type,status:"pending",note:null,checked_by:null,checked_at:null,updated_at:new Date().toISOString()})));
  // 09C.1 — Formação sem progresso fictício: estados honestos "not-started"/0%, sem
  // lições concluídas nem notas. O progresso real só existe quando o membro interage.
  const enrolments=(trainingTrails.trails||[]).map(trail=>({id:`demo-enrolment-${trail.code}`,project_id:"demo-project",user_id:master?"demo-master":"demo-volunteer",trail_code:trail.code,status:"not-started",progress_percent:0,started_at:null,completed_at:null,expires_at:null,updated_at:new Date().toISOString()}));
  const lessonProgress=[];
  const assessments=[]; // 09C.1 — sem notas de avaliação fictícias na demonstração.
  return{cycles:[cycle],records,proposals:[],comments:[],assignments:[],checks,decisions:[],contributionLinks:[],snapshots:[],effects:[],trainingEnrolments:enrolments,lessonProgress,assessments};
}


function createDemoDeploymentWorkspace(homologationModel,deploymentProfile,deploymentReadiness,master=false){
  const now=new Date().toISOString();
  const environments=(homologationModel.environments||[]).map(item=>({
    id:`demo-environment-${item.code}`,project_id:"demo-project",code:item.code,name:item.name,
    status:item.code==="local"?"configured":"unconfigured",
    site_url:item.code==="local"?"http://localhost:4173/":null,
    supabase_project_ref:null,
    auth_callback_url:item.code==="local"?"http://localhost:4173/auth/callback/":null,
    is_production:item.code==="production",allows_reset:Boolean(item.allowsReset),
    allows_demo:Boolean(item.allowsDemo),last_verified_at:null,metadata:{demo:true},
    created_at:now,updated_at:now
  }));
  const local=environments.find(item=>item.code==="local");
  const run={
    id:"demo-homologation-local",project_id:"demo-project",environment_id:local.id,
    version:"0.38.0",commit_sha:null,status:master?"in-progress":"planned",
    summary:"Execução local de demonstração.",started_by:master?"demo-master":null,
    started_at:master?now:null,created_at:now,updated_at:now
  };
  const checks=(homologationModel.requiredChecks||[]).map(item=>({
    id:`demo-homologation-check-${item.code}`,project_id:"demo-project",run_id:run.id,
    check_code:item.code,category:item.category,title:item.title,blocking:Boolean(item.blocking),
    status:item.code==="env-config"&&master?"passed":"pending",
    evidence:item.code==="env-config"&&master?"Perfil local de demonstração validado.":null,
    note:null,checked_by:item.code==="env-config"&&master?"demo-master":null,
    checked_at:item.code==="env-config"&&master?now:null,updated_at:now
  }));
  return{
    environments,
    authPolicy:{
      project_id:"demo-project",provider:"google",
      google_enabled:Boolean(deploymentProfile.googleOAuth?.enabled),
      require_preauthorization:true,
      allowed_email_domains:deploymentProfile.googleOAuth?.allowedEmailDomains||[],
      store_provider_tokens:false,minimum_active_masters:1,session_expiry_minutes:60,
      policy_status:"draft",updated_at:now
    },
    runs:[run],checks,catalog:homologationModel.requiredChecks||[],
    readiness:deploymentReadiness
  };
}


function createDemoNotificationWorkspace(notificationModel,notificationTemplates,notificationRuntime,userId,master=false,volunteer=false){
  const now=Date.now();
  const samples=master?[
    {id:"demo-notification-homologation",event_type:"homologation.blocked",entity_type:"homologation-run",entity_id:"demo-homologation-local",title:"Homologação bloqueada",body:"A execução local possui checks bloqueantes por concluir.",action_url:"#/area-colaborativa/gestao/homologacao/demo-homologation-local",severity:"critical",status:"unread",created_at:new Date(now-10*60*1000).toISOString()},
    {id:"demo-notification-withdrawal",event_type:"withdrawal.submitted",entity_type:"withdrawal-request",entity_id:"demo-withdrawal-01",title:"Novo pedido de retirada",body:"Foi recebido um pedido de retirada que requer tratamento prioritário.",action_url:"#/area-colaborativa/gestao/contributos",severity:"critical",status:"unread",created_at:new Date(now-45*60*1000).toISOString()},
    {id:"demo-notification-contribution",event_type:"contribution.assigned",entity_type:"contribution",entity_id:"demo-contribution-01",title:"Contributo atribuído",body:"O contributo DEMO-001 foi-lhe atribuído para revisão.",action_url:"#/area-colaborativa/gestao/contributos",severity:"info",status:"read",read_at:new Date(now-30*60*1000).toISOString(),created_at:new Date(now-2*60*60*1000).toISOString()},
    {id:"demo-notification-training",event_type:"training.assessment-pending",entity_type:"training",entity_id:"rights-credits-ai",title:"Avaliação de formação pendente",body:"O percurso de direitos, créditos e IA aguarda avaliação.",action_url:"#/area-colaborativa/formacao/rights-credits-ai",severity:"warning",status:"unread",created_at:new Date(now-5*60*60*1000).toISOString()},
    {id:"demo-notification-agenda",event_type:"agenda.changed",entity_type:"agenda-event",entity_id:"demo-event-01",title:"Atividade atualizada",body:"A sessão comunitária teve o horário atualizado.",action_url:"#/area-colaborativa/agenda",severity:"info",status:"read",read_at:new Date(now-24*60*60*1000).toISOString(),created_at:new Date(now-30*60*60*1000).toISOString()}
  ]:volunteer?[
    {id:"demo-notification-task",event_type:"task.assigned",entity_type:"task",entity_id:"demo-task-01",title:"Nova tarefa atribuída",body:"Foi-lhe atribuída uma tarefa de digitalização.",action_url:"#/area-colaborativa/tarefas",severity:"info",status:"unread",created_at:new Date(now-25*60*1000).toISOString()},
    {id:"demo-notification-agenda-volunteer",event_type:"agenda.changed",entity_type:"agenda-event",entity_id:"demo-event-01",title:"Atividade atualizada",body:"A atividade de voluntariado teve o horário atualizado.",action_url:"#/area-colaborativa/agenda",severity:"info",status:"unread",created_at:new Date(now-3*60*60*1000).toISOString()},
    {id:"demo-notification-training-complete",event_type:"training.completed",entity_type:"training",entity_id:"project-foundations",title:"Formação concluída",body:"Concluiu o percurso Fundamentos do projeto.",action_url:"#/area-colaborativa/formacao/project-foundations",severity:"success",status:"read",read_at:new Date(now-24*60*60*1000).toISOString(),created_at:new Date(now-2*24*60*60*1000).toISOString()}
  ]:[];
  const notifications=samples.map(item=>({...item,project_id:"demo-project",user_id:userId,metadata:{demo:true},expires_at:new Date(now+365*24*60*60*1000).toISOString()}));
  const preferences=(notificationModel.eventTypes||[]).map(item=>({
    project_id:"demo-project",user_id:userId,event_type:item.code,
    in_app_enabled:true,email_enabled:Boolean(item.defaultEmail)&&false,
    quiet_hours_start:null,quiet_hours_end:null,timezone:"Europe/Lisbon",
    language:"pt-PT",updated_at:new Date(now).toISOString()
  }));
  const channels=[
    {project_id:"demo-project",channel:"in-app",status:"active",provider:"disabled",from_name:"Projeto Comunitário de Milreu",from_email:null,settings:{pollIntervalSeconds:60},updated_at:new Date(now).toISOString()},
    {project_id:"demo-project",channel:"email",status:"disabled",provider:"disabled",from_name:"Projeto Comunitário de Milreu",from_email:null,settings:{automaticScheduleEnabled:false},updated_at:new Date(now).toISOString()}
  ];
  const summary={
    unreadCount:notifications.filter(item=>item.status==="unread").length,
    criticalUnreadCount:notifications.filter(item=>item.status==="unread"&&item.severity==="critical").length,
    byCategory:notifications.filter(item=>item.status==="unread").reduce((acc,item)=>{const category=(notificationModel.eventTypes||[]).find(event=>event.code===item.event_type)?.category||"other";acc[category]=(acc[category]||0)+1;return acc;},{})
  };
  return{
    notifications,preferences,channels,
    templates:notificationTemplates.templates||[],summary,
    operations:{
      channels:channels.map(channel=>({...channel,fromEmailConfigured:Boolean(channel.from_email)})),
      outboxCounts:{pending:0,failed:0,delivered:0,"dead-letter":0},
      recentOutbox:[],
      deliveryCounts:{delivered:0,failed:0},
      templates:notificationTemplates.templates||[]
    },
    runtime:notificationRuntime
  };
}


function createDemoOperationalWorkspace(model,retentionModel,runtime,master=false){
  if(!master)return emptyOperationalWorkspace();
  const now=new Date();
  const iso=offset=>new Date(now.getTime()+offset).toISOString();
  const settings=[
    {code:"current-environment",category:"environment",value:{value:"local"},status:"active",description:"Ambiente de demonstração.",updatedAt:iso(-86400000)},
    {code:"maintenance-mode",category:"maintenance",value:{enabled:false,message:null},status:"active",description:"Área Colaborativa disponível.",updatedAt:iso(-86400000)},
    {code:"retention-auto-apply",category:"retention",value:{enabled:false},status:"active",description:"Aplicação automática bloqueada.",updatedAt:iso(-86400000)},
    {code:"continuity-responsibles",category:"continuity",value:{primaryConfigured:false,secondaryConfigured:false},status:"draft",description:"Responsáveis reais não definidos.",updatedAt:iso(-86400000)}
  ];
  const retentionPolicies=(retentionModel.policies||[]).map(item=>({
    code:item.code,resource_type:item.resourceType,name:item.name,
    retention_days:item.retentionDays,action:item.action,
    automatic_allowed:false,legal_hold_supported:item.legalHoldSupported,
    risk:item.risk,scope_description:item.scope,status:"active",updated_at:iso(-86400000)
  }));
  const legalHolds=[
    {id:"demo-hold-audit",resourceType:"collab_audit_log",entityId:null,reason:"Demonstração de preservação integral durante revisão.",status:"active",startsAt:iso(-7*86400000),endsAt:null,createdAt:iso(-7*86400000)}
  ];
  const lifecycleRuns=[
    {id:"demo-retention-preview",policyCode:"expired-notifications",environment:"local",mode:"preview",status:"previewed",cutoffAt:iso(-365*86400000),candidateCount:4,affectedCount:0,excludedByHoldCount:0,candidateHash:"demo-hash-not-production",summary:{resourceType:"collab_notifications",action:"delete",retentionDays:365,eligibleCount:4},previewedAt:iso(-2*86400000),approvedAt:null,completedAt:null,errorMessage:null}
  ];
  const incidents=[
    {id:"demo-incident-01",reference:"INC-2026-001",title:"Falha simulada no acesso de staging",description:"Incidente fictício criado apenas para avaliar o fluxo operacional.",category:"authentication",severity:"sev-3",status:"investigating",environment:"staging",impactSummary:"Apenas utilizadores de teste.",detectedAt:iso(-6*3600000),acknowledgedAt:iso(-5.5*3600000),mitigatedAt:null,resolvedAt:null,closedAt:null,ownerUserId:"demo-master",publicSummary:null,updatedAt:iso(-2*3600000)}
  ];
  const incidentUpdates=[
    {id:"demo-incident-update-01",incidentId:"demo-incident-01",updateType:"analysis",body:"Callback de demonstração em revisão.",statusAfter:null,createdBy:"demo-master",createdAt:iso(-4*3600000)}
  ];
  const incidentActions=[
    {id:"demo-incident-action-01",incidentId:"demo-incident-01",title:"Rever callbacks OAuth de staging",description:"Ação fictícia.",status:"in-progress",priority:"high",assignedTo:"demo-master",dueAt:iso(86400000),completedAt:null,updatedAt:iso(-2*3600000)}
  ];
  const backupPlans=[
    {id:"demo-backup-db",code:"database-main",name:"Base de dados principal",backupType:"database",provider:"unconfigured",frequency:"daily",retentionDays:30,targetRpoMinutes:1440,targetRtoMinutes:240,status:"draft",instructionsReference:"docs/operations/BACKUP_RESTORE_RUNBOOK_08I.md",responsibleUserId:null,secondaryUserId:null,lastSuccessfulAt:null,nextDueAt:null,updatedAt:iso(-86400000)},
    {id:"demo-backup-code",code:"repository-code",name:"Código e documentação",backupType:"code",provider:"github",frequency:"daily",retentionDays:365,targetRpoMinutes:1440,targetRtoMinutes:120,status:"active",instructionsReference:"docs/operations/BACKUP_RESTORE_RUNBOOK_08I.md",responsibleUserId:"demo-master",secondaryUserId:null,lastSuccessfulAt:iso(-86400000),nextDueAt:iso(86400000),updatedAt:iso(-86400000)}
  ];
  const backupVerifications=[
    {id:"demo-backup-verification",planId:"demo-backup-code",status:"passed",backupObservedAt:iso(-86400000),verifiedAt:iso(-20*3600000),restoreTested:false,evidenceReference:"demo://github-commit",notes:"Evidência de demonstração.",verifiedBy:"demo-master"}
  ];
  const continuityExercises=[
    {id:"demo-continuity-01",title:"Exercício de perda de credencial",scenario:"credential-compromise",status:"planned",objectives:"Testar rotação de secrets e manutenção do acesso master.",scheduledAt:iso(14*86400000),startedAt:null,completedAt:null,targetRtoMinutes:240,targetRpoMinutes:0,actualRecoveryMinutes:null,resultSummary:null,evidenceReference:null,coordinatorUserId:"demo-master",updatedAt:iso(-86400000)}
  ];
  const checkCatalog=(model.operationalChecks||[]).map((item,index)=>({
    ...item,evidence_required:item.evidenceRequired,sort_order:(index+1)*10,active:true
  }));
  const operationalRuns=[
    {id:"demo-operational-run",environment:"local",version:"0.38.0",commitSha:null,status:"running",summary:null,startedAt:iso(-2*3600000),completedAt:null}
  ];
  const operationalResults=checkCatalog.map((check,index)=>({
    id:`demo-result-${check.code}`,runId:"demo-operational-run",checkCode:check.code,
    status:index<5?"passed":index===10?"failed":"pending",
    evidenceReference:index<5?`demo://evidence/${check.code}`:index===10?"demo://backup/unconfigured":null,
    notes:index===10?"Backup remoto ainda não configurado.":null,
    checkedAt:index<=10?iso(-3600000):null
  }));
  const auditRows=[
    {id:5,actorUserId:"demo-master",actorName:"Master de demonstração",action:"incident.opened",entityType:"incident",entityId:"demo-incident-01",category:"incidents",severity:"critical",changedKeys:["category","severity","status"],metadata:{demo:true},correlationId:null,eventHash:"demo-event-hash-5",previousHash:"demo-event-hash-4",createdAt:iso(-6*3600000)},
    {id:4,actorUserId:"demo-master",actorName:"Master de demonstração",action:"retention.preview.created",entityType:"lifecycle_run",entityId:"demo-retention-preview",category:"retention",severity:"info",changedKeys:["candidateCount","policyCode"],metadata:{demo:true},correlationId:null,eventHash:"demo-event-hash-4",previousHash:"demo-event-hash-3",createdAt:iso(-2*86400000)},
    {id:3,actorUserId:"demo-master",actorName:"Master de demonstração",action:"backup.verification.recorded",entityType:"backup_verification",entityId:"demo-backup-verification",category:"backups",severity:"info",changedKeys:["status"],metadata:{demo:true},correlationId:null,eventHash:"demo-event-hash-3",previousHash:"demo-event-hash-2",createdAt:iso(-20*3600000)}
  ];
  return{
    settings,retentionPolicies,legalHolds,lifecycleRuns,incidents,
    incidentUpdates,incidentActions,backupPlans,backupVerifications,
    continuityExercises,checkCatalog,operationalRuns,operationalResults,
    summary:{openCriticalIncidents:0,activeLegalHolds:1,failedBackupVerifications:0,latestOperationalStatus:"running",auditEvents30Days:auditRows.length},
    audit:{total:auditRows.length,limit:100,offset:0,rows:auditRows},
    integrity:{valid:true,checkedCount:auditRows.length,firstBreakId:null,lastHash:"demo-event-hash-5",verifiedAt:iso(-3600000)},
    runtime
  };
}

function createDemoTaskWorkspace(){
  const tasks=[
    {id:"demo-task-digitisation",project_id:"demo-project",title:"Digitalizar fotografias do arquivo comunitário",summary:"Preparar imagens e verificar nomes de ficheiros para futura catalogação.",description:"Digitalização e controlo técnico de um pequeno conjunto de fotografias de demonstração.",instructions:"Utilizar apenas os materiais indicados pela coordenação. Não publicar ficheiros fora do projeto.",category:"digitisation",category_code:"digitisation",status:"open",priority:"high",assignment_mode:"approval",location_mode:"hybrid",location_name:"Área Colaborativa",municipality:"Faro",starts_at:daysFromNow(2,9),due_at:daysFromNow(14,18),application_deadline:daysFromNow(7,18),estimated_minutes:240,capacity:3,minimum_participants:1,visibility:"members",recognition_eligible:true,created_by:"demo-master",updated_at:new Date().toISOString()},
    {id:"demo-task-exhibition",project_id:"demo-project",title:"Apoiar a preparação da exposição itinerante",summary:"Rever materiais, checklist e necessidades de montagem.",description:"Atividade de demonstração para testar tarefas presenciais e convites diretos.",instructions:"A data e o local são fictícios e servem apenas para avaliação do módulo.",category:"exhibition-setup",category_code:"exhibition-setup",status:"open",priority:"normal",assignment_mode:"direct",location_mode:"on-site",location_name:"Local de demonstração",municipality:"Faro",starts_at:daysFromNow(9,9),due_at:daysFromNow(9,17),application_deadline:null,estimated_minutes:360,capacity:4,minimum_participants:2,visibility:"members",recognition_eligible:true,created_by:"demo-master",updated_at:new Date().toISOString()},
    {id:"demo-task-transcription",project_id:"demo-project",title:"Rever uma transcrição de entrevista",summary:"Comparar a transcrição com o áudio e assinalar dúvidas.",description:"Atividade remota de demonstração para testar acompanhamento e conclusão.",instructions:"Não copiar o conteúdo para serviços externos.",category:"transcription",category_code:"transcription",status:"in-progress",priority:"normal",assignment_mode:"approval",location_mode:"remote",location_name:null,municipality:null,starts_at:daysFromNow(-2,9),due_at:daysFromNow(5,18),application_deadline:daysFromNow(-3,18),estimated_minutes:180,capacity:2,minimum_participants:1,visibility:"members",recognition_eligible:true,created_by:"demo-master",updated_at:new Date().toISOString()},
    {id:"demo-task-draft",project_id:"demo-project",title:"Preparar roteiro de acolhimento de voluntários",summary:"Rascunho visível apenas para coordenação.",description:"Exemplo de tarefa ainda não publicada.",instructions:null,category:"event-support",category_code:"event-support",status:"draft",priority:"low",assignment_mode:"approval",location_mode:"flexible",location_name:null,municipality:null,starts_at:null,due_at:daysFromNow(30,18),application_deadline:null,estimated_minutes:120,capacity:2,minimum_participants:1,visibility:"members",recognition_eligible:false,created_by:"demo-master",updated_at:new Date().toISOString()}
  ];
  const assignments=[
    {task_id:"demo-task-digitisation",user_id:"demo-volunteer",status:"applied",applied_at:new Date().toISOString(),application_note:"Tenho experiência em digitalização e disponibilidade ao sábado.",updated_at:new Date().toISOString()},
    {task_id:"demo-task-exhibition",user_id:"demo-volunteer",status:"invited",assigned_by:"demo-master",assigned_at:new Date().toISOString(),manager_note:"Convite de demonstração.",updated_at:new Date().toISOString()},
    {task_id:"demo-task-transcription",user_id:"demo-volunteer",status:"in-progress",accepted_at:daysFromNow(-3,10),started_at:daysFromNow(-2,10),updated_at:new Date().toISOString()}
  ];
  const requiredSkills=[
    {task_id:"demo-task-digitisation",skill_code:"digitisation",required:true},
    {task_id:"demo-task-digitisation",skill_code:"cataloguing",required:false},
    {task_id:"demo-task-exhibition",skill_code:"installation",required:false},
    {task_id:"demo-task-exhibition",skill_code:"event-support",required:false},
    {task_id:"demo-task-transcription",skill_code:"transcription",required:true}
  ];
  const preferences={project_id:"demo-project",user_id:"demo-volunteer",preferred_modes:["remote","on-site"],maximum_weekly_minutes:360,availability_notes:"Disponibilidade de demonstração.",timezone:"Europe/Lisbon"};
  const availability=[
    {id:"demo-slot-1",project_id:"demo-project",user_id:"demo-volunteer",day_of_week:6,starts_at:"09:00:00",ends_at:"13:00:00",mode:"hybrid",active:true},
    {id:"demo-slot-2",project_id:"demo-project",user_id:"demo-volunteer",day_of_week:3,starts_at:"19:00:00",ends_at:"21:00:00",mode:"remote",active:true}
  ];
  const timeEntries=[{id:"demo-time-1",project_id:"demo-project",task_id:"demo-task-transcription",user_id:"demo-volunteer",activity_date:new Date().toISOString().slice(0,10),minutes:45,note:"Primeira revisão.",status:"pending",created_at:new Date().toISOString()}];
  const updates=[demoTaskUpdate("demo-task-digitisation","demo-volunteer","application","Candidatura de demonstração."),demoTaskUpdate("demo-task-exhibition","demo-volunteer","invitation","Convite de demonstração."),demoTaskUpdate("demo-task-transcription","demo-volunteer","started","Atividade iniciada.")];
  return{tasks,assignments,requiredSkills,preferences,availability,timeEntries,updates};
}

class CollaborativeController{
  constructor(){this.state=emptyContext();this.listeners=new Set();this.config=null;this.foundation=null;this.client=null;this.authSubscription=null;this.notificationPoller=null;this.operationsPoller=null;}
  getState(){return structuredClone(this.state);}
  subscribe(listener){this.listeners.add(listener);return()=>this.listeners.delete(listener);}
  emit(){const snapshot=this.getState();for(const listener of this.listeners)listener(snapshot);}

  async init(){
    this.config=await loadCollaborativeConfig();
    this.foundation=await loadCollaborativeFoundationData();
    this.state={...emptyContext(),ready:false,mode:this.config.mode,profileTypes:this.foundation.profileTypes,moduleRegistry:this.foundation.modules,roleRegistry:this.foundation.roles,permissionRegistry:this.foundation.permissions,memberCatalog:this.foundation.memberCatalog,taskModel:this.foundation.taskModel,exhibitionModel:this.foundation.exhibitionModel,contributionModel:this.foundation.contributionModel,museumReviewModel:this.foundation.museumReviewModel,trainingTrails:this.foundation.trainingTrails,library:this.foundation.library,reviewSeed:this.foundation.reviewSeed,homologationModel:this.foundation.homologationModel,deploymentProfile:this.foundation.deploymentProfile,deploymentReadiness:this.foundation.deploymentReadiness,notificationModel:this.foundation.notificationModel,notificationTemplates:this.foundation.notificationTemplates,notificationRuntime:this.foundation.notificationRuntime,operationalGovernanceModel:this.foundation.operationalGovernanceModel,retentionModel:this.foundation.retentionModel,operationsRuntime:this.foundation.operationsRuntime,releaseCandidateModel:this.foundation.releaseCandidateModel,releaseCandidateReadiness:this.foundation.releaseCandidateReadiness,accessibilityAuditModel:this.foundation.accessibilityAuditModel,e2eScenarios:this.foundation.e2eScenarios};
    if(this.config.mode==="supabase"){
      this.client=await createCollaborativeSupabaseClient(this.config);
      const{data,error}=await this.client.auth.getSession();if(error)this.state.error=error.message;if(data?.session)await this.loadRemoteContext(data.session);
      const{data:subscription}=this.client.auth.onAuthStateChange(async(_event,session)=>{if(session)await this.loadRemoteContext(session);else this.resetAuthentication();this.emit();});this.authSubscription=subscription?.subscription||null;
    }else this.loadDemoContext();
    this.state.ready=true;this.emit();return this.getState();
  }

  resetAuthentication(){Object.assign(this.state,{authenticated:false,session:null,profile:null,membership:null,accessRequest:null,roles:[],permissions:[],modules:[],management:emptyManagement(),taskWorkspace:emptyTaskWorkspace(),exhibitionWorkspace:emptyExhibitionWorkspace(),contributionWorkspace:emptyContributionWorkspace(),museumReviewWorkspace:emptyMuseumReviewWorkspace(),deploymentWorkspace:emptyDeploymentWorkspace(),notificationWorkspace:emptyNotificationWorkspace(),operationalWorkspace:emptyOperationalWorkspace(),pilotWorkspace:emptyPilotWorkspace(),participationWorkspace:emptyParticipationWorkspace(),opportunitiesWorkspace:emptyOpportunitiesWorkspace(),publicIntegrationWorkspace:emptyPublicIntegrationWorkspace(),operationsGovernanceWorkspace:emptyOperationsGovernanceWorkspace(),tasks:[],exhibitions:[],error:null});this.stopNotificationPolling();this.stopOperationsPolling();}

  async loadRemoteParticipation(){
    if(!this.client)return;
    if(!hasPermission(this.state,"participation.view"))return;
    const{data,error}=await this.client.rpc("collab_participation_workspace");
    if(error){this.state.error=error.message;return;}
    if(data&&data.authenticated){this.state.participationWorkspace={...emptyParticipationWorkspace(),...data};}
  }

  async participationAction(kind,values={}){
    const perms={enrol:"participation.enrol",progress:"participation.progress.update",programme:"participation.manage"};
    if(!perms[kind]||!hasPermission(this.state,perms[kind]))throw new Error("Permissão insuficiente para a ação de participação.");
    if(this.config?.mode==="demo")throw new Error("A participação contínua opera apenas em staging real; a demonstração não cria percursos nem inscrições.");
    let rpc,params;
    switch(kind){
      case "enrol":rpc="collab_participation_enrol";params={p_programme_id:values.programmeId,p_user_id:null};break;
      case "progress":rpc="collab_participation_update_progress";params={p_enrolment_id:values.enrolmentId,p_step_id:values.stepId,p_status:values.status,p_completion_source:"participant-declaration"};break;
      case "programme":rpc="collab_participation_upsert_programme";params={p_programme_id:null,p_code:values.code,p_title:values.title,p_description:values.description,p_objective:values.objective,p_visibility:values.visibility||"members",p_status:"draft"};break;
      default:throw new Error("Ação de participação desconhecida.");
    }
    const{error}=await this.client.rpc(rpc,params);
    if(error)throw new Error(error.message);
    await this.loadRemoteParticipation();
  }

  async publicIntegrationAction(kind,values={}){
    const perms={proposal:"public-integration.propose",activation:"public-integration.activate",evolution:"evolution.manage"};
    if(!perms[kind]||!hasPermission(this.state,perms[kind]))throw new Error("Permissão insuficiente para a ação de integração pública.");
    if(this.config?.mode==="demo")throw new Error("A integração pública opera apenas em staging real; a demonstração não ativa efeitos públicos.");
    let rpc,params;
    switch(kind){
      case "proposal":rpc="collab_pub_upsert_proposal";params={p_proposal_id:null,p_code:values.code,p_title:values.title,p_purpose:values.purpose,p_target_surface:values.targetSurface,p_source_type:"manual",p_target_slot:values.targetSlot||null,p_payload_draft:{}};break;
      case "activation":rpc="collab_pub_activation";params={p_snapshot_id:values.snapshotId,p_action:values.action,p_reason:values.reason,p_confirmation:values.confirmation||null};break;
      case "evolution":rpc="collab_evolution_upsert_proposal";params={p_proposal_id:null,p_code:values.code,p_title:values.title,p_finding_summary:values.findingSummary,p_proposed_change:values.proposedChange,p_no_action_alternative:"—",p_expected_impact:"—",p_risks:"—",p_verification_plan:"—"};break;
      default:throw new Error("Ação de integração pública desconhecida.");
    }
    const{error}=await this.client.rpc(rpc,params);
    if(error)throw new Error(error.message);
  }

  async loadRemoteOperationsGovernance(){
    if(!this.client)return;
    if(!hasPermission(this.state,"operations.view"))return;
    const{data,error}=await this.client.rpc("collab_operations_governance_workspace");
    if(error){this.state.error=error.message;return;}
    if(data&&data.authenticated){this.state.operationsGovernanceWorkspace={...emptyOperationsGovernanceWorkspace(),...data};}
  }

  async operationsGovernanceAction(kind,values={}){
    const perms={"support-submit":"support.submit",cycle:"operations.manage",continuity:"continuity.manage",governance:"governance.manage",decide:"governance.decide",transparency:"impact.manage"};
    if(!perms[kind]||!hasPermission(this.state,perms[kind]))throw new Error("Permissão insuficiente para a ação de operação/governação.");
    if(this.config?.mode==="demo")throw new Error("A operação e governação operam apenas em staging real; a demonstração não cria ciclos, decisões nem indicadores.");
    let rpc,params;
    switch(kind){
      case "support-submit":rpc="collab_support_submit";params={p_category:values.category,p_summary:values.summary,p_description:values.description,p_priority:values.priority||"normal"};break;
      case "cycle":rpc="collab_operating_cycle_upsert";params={p_cycle_id:null,p_code:values.code,p_title:values.title,p_cycle_type:"operations",p_status:"draft"};break;
      case "continuity":rpc="collab_continuity_upsert";params={p_review_id:null,p_review_type:values.reviewType,p_status:values.status||"in-review",p_single_person_risk:Boolean(values.singlePersonRisk),p_findings:values.findings||null};break;
      case "governance":rpc="collab_governance_upsert";params={p_decision_id:null,p_decision_type:values.decisionType,p_title:values.title,p_context:values.context,p_authority:values.authority,p_status:"draft"};break;
      case "decide":rpc="collab_governance_decide";params={p_decision_id:values.decisionId,p_decision:values.decision,p_rationale:values.rationale,p_conditions:values.conditions||null};break;
      case "transparency":rpc="collab_indicator_publish_snapshot";params={p_snapshot_id:values.snapshotId,p_confirmation:values.confirmation};break;
      default:throw new Error("Ação de operação/governação desconhecida.");
    }
    const{error}=await this.client.rpc(rpc,params);
    if(error)throw new Error(error.message);
    await this.loadRemoteOperationsGovernance();
  }

  async loadRemotePilot(cycleId=null){
    if(!this.client)return;
    if(!hasPermission(this.state,"pilot.view"))return;
    const{data,error}=await this.client.rpc("collab_pilot_workspace",{p_cycle_id:cycleId});
    if(error){this.state.error=error.message;return;}
    if(data&&data.authenticated){this.state.pilotWorkspace={...emptyPilotWorkspace(),...data};}
  }

  async pilotAction(kind,values={}){
    const perms={confirm:"pilot.feedback.submit",feedback:"pilot.feedback.submit",withdraw:"pilot.view",cycle:"pilot.manage",enrol:"pilot.participants.manage",gate:"pilot.gates.evaluate",approve:"pilot.approve"};
    const needed=perms[kind];
    if(!needed||!hasPermission(this.state,needed))throw new Error("Permissão insuficiente para a ação do piloto.");
    if(this.config?.mode==="demo"){
      throw new Error("O piloto opera apenas em staging real; a demonstração não cria ciclos, participantes nem evidências.");
    }
    const cid=values.cycleId||null;
    let rpc,params;
    switch(kind){
      case "confirm":rpc="collab_pilot_confirm_participation";params={p_cycle_id:cid,p_notice_version:values.noticeVersion};break;
      case "feedback":rpc="collab_pilot_submit_observation";params={p_cycle_id:cid,p_observation_type:values.observationType,p_summary:values.summary,p_description:values.description,p_severity:values.severity||"info"};break;
      case "withdraw":rpc="collab_pilot_withdraw_participation";params={p_cycle_id:cid,p_reason:values.reason||null};break;
      case "cycle":rpc="collab_pilot_upsert_cycle";params={p_cycle_id:null,p_code:values.code,p_title:values.title,p_objective:values.objective,p_baseline_release:values.baselineRelease};break;
      case "enrol":rpc="collab_pilot_enrol_participant";params={p_cycle_id:cid,p_user_id:values.userId,p_participant_role:values.participantRole||"participant"};break;
      case "gate":rpc="collab_pilot_set_gate_result";params={p_cycle_id:cid,p_gate_code:values.gateCode,p_status:values.status};break;
      case "approve":rpc="collab_pilot_approve_staging_homologation";params={p_cycle_id:cid,p_confirmation:values.confirmation};break;
      default:throw new Error("Ação de piloto desconhecida.");
    }
    const{error}=await this.client.rpc(rpc,params);
    if(error)throw new Error(error.message);
    await this.loadRemotePilot(cid);
  }

  async loadRemoteContext(session){
    const email=String(session.user.email||"").toLowerCase();
    const allowedDomains=this.config.auth?.allowedEmailDomains||[];
    const domain=email.split("@")[1]||"";
    if(allowedDomains.length&&!allowedDomains.includes(domain)){
      await this.client.auth.signOut();
      this.resetAuthentication();
      this.state.error="email_domain_not_allowed";
      return;
    }
    this.state.session={user:{id:session.user.id,email:session.user.email,user_metadata:session.user.user_metadata||{}}};this.state.authenticated=true;
    const{data,error}=await this.client.rpc("collab_get_my_context");if(error){this.state.error=error.message;return;}
    this.state.profile=data.profile||{user_id:session.user.id,email:session.user.email,display_name:session.user.user_metadata?.full_name||session.user.user_metadata?.name||"",avatar_url:session.user.user_metadata?.avatar_url||session.user.user_metadata?.picture||null,primary_profile_type:null,locale:"pt-PT"};
    this.state.membership=data.membership||{status:"pending"};this.state.accessRequest=data.accessRequest||null;this.state.roles=data.roles||[];this.state.permissions=data.permissions||[];this.state.modules=data.modules||visibleModules(this.state,this.foundation.modules);this.state.error=null;
    await this.loadRemoteOwnPreferences();
    if(hasPermission(this.state,"memberships.view")||hasPermission(this.state,"memberships.manage"))await this.loadRemoteManagement();
    if(hasPermission(this.state,"tasks.view")||hasPermission(this.state,"tasks.manage"))await this.loadRemoteTasks();
    if(hasPermission(this.state,"agenda.view"))await this.loadRemoteExhibitions();
    if(
      hasPermission(this.state,"contributions.view-own")
      ||hasPermission(this.state,"contributions.submit")
      ||hasPermission(this.state,"contributions.view-all")
      ||hasPermission(this.state,"contributions.moderate")
    )await this.loadRemoteContributions();
    if(
      hasPermission(this.state,"training.view")
      ||hasPermission(this.state,"library.view")
      ||hasPermission(this.state,"museum.review")
      ||hasPermission(this.state,"museum.review.view")
      ||hasPermission(this.state,"museum.review.manage")
    )await this.loadRemoteMuseumReview();
    if(
      hasPermission(this.state,"deployment.view")
      ||hasPermission(this.state,"homologation.view")
      ||hasPermission(this.state,"homologation.run")
      ||hasPermission(this.state,"auth.policy.view")
    )await this.loadRemoteDeployment();
    if(hasPermission(this.state,"notifications.view"))await this.loadRemoteNotifications();
    if(
      hasPermission(this.state,"operations.view")
      ||hasPermission(this.state,"audit.search")
      ||hasPermission(this.state,"retention.view")
      ||hasPermission(this.state,"incidents.view")
      ||hasPermission(this.state,"backups.view")
      ||hasPermission(this.state,"continuity.view")
      ||hasPermission(this.state,"health.view")
    )await this.loadRemoteOperations();
    if(hasPermission(this.state,"opportunities.view")||hasPermission(this.state,"opportunities.manage"))await this.loadRemoteOpportunities();
    this.startNotificationPolling();
    this.startOperationsPolling();
  }

  async loadRemoteOwnPreferences(){
    const userId=this.state.session?.user?.id;if(!userId)return;
    const[interests,skills]=await Promise.all([this.client.from("collab_member_interests").select("interest_code").eq("user_id",userId),this.client.from("collab_member_skills").select("skill_code,level").eq("user_id",userId)]);
    if(!interests.error)this.state.profile.interests=(interests.data||[]).map(x=>x.interest_code);
    if(!skills.error)this.state.profile.skills=(skills.data||[]).map(x=>x.skill_code);
  }

  async loadRemoteManagement(){
    const jobs=[
      this.client.from("collab_profiles").select("user_id,email,display_name,preferred_name,primary_profile_type,avatar_url,organization_name,languages,profile_completed_at,updated_at").order("display_name"),
      this.client.from("collab_project_memberships").select("project_id,user_id,status,primary_profile_type,requested_at,approved_at,approved_by,suspended_at,notes"),
      this.client.from("collab_access_requests").select("id,user_id,requested_profile_type,motivation,status,submitted_at,reviewed_at,reviewer_notes").order("submitted_at",{ascending:false}),
      this.client.from("collab_member_roles").select("user_id,role_code,assigned_at,assigned_by"),
      this.client.from("collab_access_invitations").select("id,email,intended_profile_type,role_codes,status,expires_at,internal_notes,created_by,created_at,claimed_by,claimed_at,revoked_at").order("created_at",{ascending:false}),
      this.client.from("collab_membership_notes").select("id,user_id,note,visibility,created_by,created_at").order("created_at",{ascending:false}),
      this.client.from("collab_audit_log").select("id,actor_user_id,action,entity_type,entity_id,metadata,created_at").order("created_at",{ascending:false}).limit(300),
      this.client.from("collab_member_interests").select("user_id,interest_code"),this.client.from("collab_member_skills").select("user_id,skill_code,level")
    ];
    const[profiles,memberships,requests,roles,invitations,notes,audit,interests,skills]=await Promise.all(jobs);const error=[profiles,memberships,requests,roles,invitations,notes,audit,interests,skills].find(x=>x.error)?.error;if(error){this.state.error=error.message;return;}
    const membershipMap=new Map((memberships.data||[]).map(x=>[x.user_id,x])),rolesMap=new Map(),interestMap=new Map(),skillMap=new Map();
    for(const x of roles.data||[]){const a=rolesMap.get(x.user_id)||[];a.push(x.role_code);rolesMap.set(x.user_id,a);}for(const x of interests.data||[]){const a=interestMap.get(x.user_id)||[];a.push(x.interest_code);interestMap.set(x.user_id,a);}for(const x of skills.data||[]){const a=skillMap.get(x.user_id)||[];a.push(x.skill_code);skillMap.set(x.user_id,a);}
    this.state.management={members:(profiles.data||[]).map(profile=>({...profile,membership:membershipMap.get(profile.user_id)||null,roles:rolesMap.get(profile.user_id)||[],interests:interestMap.get(profile.user_id)||[],skills:skillMap.get(profile.user_id)||[]})),requests:requests.data||[],invitations:invitations.data||[],notes:notes.data||[],audit:audit.data||[]};
  }

  async loadRemoteTasks(){
    const userId=this.state.session?.user?.id;if(!userId)return;
    const jobs=[
      this.client.from("collab_tasks").select("*").order("due_at",{ascending:true}),
      this.client.from("collab_task_assignments").select("*").order("updated_at",{ascending:false}),
      this.client.from("collab_task_required_skills").select("task_id,skill_code,required"),
      this.client.from("collab_volunteer_preferences").select("*").eq("user_id",userId).limit(1),
      this.client.from("collab_member_availability").select("*").eq("user_id",userId).eq("active",true).order("day_of_week").order("starts_at"),
      this.client.from("collab_task_time_entries").select("*").order("activity_date",{ascending:false}),
      this.client.from("collab_task_updates").select("*").order("created_at",{ascending:false}).limit(500)
    ];
    const[tasks,assignments,requiredSkills,preferences,availability,timeEntries,updates]=await Promise.all(jobs);const error=[tasks,assignments,requiredSkills,preferences,availability,timeEntries,updates].find(x=>x.error)?.error;if(error){this.state.error=error.message;return;}
    this.state.taskWorkspace={tasks:tasks.data||[],assignments:assignments.data||[],requiredSkills:requiredSkills.data||[],preferences:preferences.data?.[0]||null,availability:availability.data||[],timeEntries:timeEntries.data||[],updates:updates.data||[]};this.state.tasks=this.state.taskWorkspace.tasks;
  }

  async loadRemoteExhibitions(){
    const jobs=[
      this.client.from("collab_venues").select("*").order("name"),
      this.client.from("collab_exhibitions").select("*").order("title"),
      this.client.from("collab_exhibition_schedule").select("*").order("starts_on"),
      this.client.from("collab_agenda_events").select("*").order("starts_at"),
      this.client.from("collab_event_participants").select("*").order("responded_at",{ascending:false}),
      this.client.from("collab_exhibition_logistics_checklist").select("*").order("sort_order").order("due_at")
    ];
    const[venues,exhibitions,schedules,events,participants,checklist]=await Promise.all(jobs);
    const error=[venues,exhibitions,schedules,events,participants,checklist].find(item=>item.error)?.error;
    if(error){this.state.error=error.message;return;}
    this.state.exhibitionWorkspace={
      venues:venues.data||[],
      exhibitions:exhibitions.data||[],
      schedules:schedules.data||[],
      events:events.data||[],
      participants:participants.data||[],
      checklist:checklist.data||[],
      conflicts:[]
    };
    this.state.exhibitions=this.state.exhibitionWorkspace.schedules;
  }



  async loadRemoteMuseumReview(){
    const jobs=[
      this.client.from("collab_museum_review_cycles").select("*").order("created_at",{ascending:false}),
      this.client.from("collab_museum_review_records").select("*").order("memory_id"),
      this.client.from("collab_museum_review_field_proposals").select("*").order("proposed_at",{ascending:false}),
      this.client.from("collab_museum_review_comments").select("*").order("created_at",{ascending:false}),
      this.client.from("collab_museum_review_assignments").select("*").order("assigned_at",{ascending:false}),
      this.client.from("collab_museum_review_checks").select("*").order("check_type"),
      this.client.from("collab_museum_review_decisions").select("*").order("decided_at",{ascending:false}),
      this.client.from("collab_museum_review_contribution_links").select("*").order("linked_at",{ascending:false}),
      this.client.from("collab_museum_review_snapshots").select("*").order("generated_at",{ascending:false}),
      this.client.from("collab_public_content_effects").select("*").order("created_at",{ascending:false}),
      this.client.from("collab_training_enrolments").select("*").order("updated_at",{ascending:false}),
      this.client.from("collab_training_lesson_progress").select("*").order("updated_at",{ascending:false}),
      this.client.from("collab_training_assessments").select("*").order("assessed_at",{ascending:false})
    ];
    const[cycles,records,proposals,comments,assignments,checks,decisions,links,snapshots,effects,enrolments,lessonProgress,assessments]=await Promise.all(jobs);
    const error=[cycles,records,proposals,comments,assignments,checks,decisions,links,snapshots,effects,enrolments,lessonProgress,assessments].find(item=>item.error)?.error;
    if(error){this.state.error=error.message;return;}
    this.state.museumReviewWorkspace={
      cycles:cycles.data||[],records:records.data||[],proposals:proposals.data||[],
      comments:comments.data||[],assignments:assignments.data||[],checks:checks.data||[],
      decisions:decisions.data||[],contributionLinks:links.data||[],snapshots:snapshots.data||[],
      effects:effects.data||[],trainingEnrolments:enrolments.data||[],
      lessonProgress:lessonProgress.data||[],assessments:assessments.data||[]
    };
  }


  async loadRemoteDeployment(){
    const jobs=[
      this.client.from("collab_deployment_environments").select("*").order("code"),
      this.client.from("collab_auth_policies").select("*").limit(1),
      this.client.from("collab_homologation_runs").select("*").order("created_at",{ascending:false}),
      this.client.from("collab_homologation_checks").select("*").order("updated_at",{ascending:false}),
      this.client.from("collab_homologation_check_catalog").select("*").order("sort_order")
    ];
    const[environments,authPolicies,runs,checks,catalog]=await Promise.all(jobs);
    const error=[environments,authPolicies,runs,checks,catalog].find(item=>item.error)?.error;
    if(error){this.state.error=error.message;return;}
    let readiness=null;
    const readinessResponse=await this.client.rpc("collab_deployment_readiness_08g");
    if(!readinessResponse.error)readiness=readinessResponse.data;
    this.state.deploymentWorkspace={
      environments:environments.data||[],
      authPolicy:authPolicies.data?.[0]||null,
      runs:runs.data||[],
      checks:checks.data||[],
      catalog:catalog.data||[],
      readiness
    };
  }


  async loadRemoteNotifications(){
    const jobs=[
      this.client.from("collab_notifications").select("*").order("created_at",{ascending:false}).limit(this.foundation.notificationRuntime?.inApp?.pageSize||30),
      this.client.from("collab_notification_preferences").select("*").order("event_type"),
      this.client.from("collab_notification_channels").select("*").order("channel"),
      this.client.from("collab_notification_templates").select("*").eq("status","approved").order("event_type"),
      this.client.rpc("collab_notification_summary_08h")
    ];
    const[notifications,preferences,channels,templates,summary]=await Promise.all(jobs);
    const error=[notifications,preferences,channels,templates,summary].find(item=>item.error)?.error;
    if(error){this.state.error=error.message;return;}
    let operations={channels:[],outboxCounts:{},recentOutbox:[],deliveryCounts:{},templates:[]};
    if(hasPermission(this.state,"notifications.manage")||hasPermission(this.state,"notifications.outbox.view")){
      const response=await this.client.rpc("collab_notification_operations_08h",{p_limit:50});
      if(!response.error&&response.data)operations=response.data;
    }
    this.state.notificationWorkspace={
      notifications:notifications.data||[],
      preferences:preferences.data||[],
      channels:channels.data||[],
      templates:templates.data||[],
      summary:summary.data||{unreadCount:0,criticalUnreadCount:0,byCategory:{}},
      operations,
      runtime:this.foundation.notificationRuntime
    };
  }

  startNotificationPolling(){
    this.stopNotificationPolling();
    if(this.config?.mode!=="supabase"||!this.state.authenticated||!hasPermission(this.state,"notifications.view"))return;
    const seconds=Math.max(30,Number(this.foundation.notificationRuntime?.inApp?.pollIntervalSeconds||60));
    this.notificationPoller=setInterval(async()=>{
      try{await this.loadRemoteNotifications();this.emit();}catch{/* polling must not break the session */}
    },seconds*1000);
  }

  stopNotificationPolling(){
    if(this.notificationPoller){clearInterval(this.notificationPoller);this.notificationPoller=null;}
  }


  async loadRemoteOperations(){
    const response=await this.client.rpc("collab_operations_workspace_08i");
    if(response.error){this.state.error=response.error.message;return;}
    const workspace=response.data||emptyOperationalWorkspace();
    let audit={total:0,limit:100,offset:0,rows:[]};
    if(hasPermission(this.state,"audit.search")||hasPermission(this.state,"audit.view")){
      const auditResponse=await this.client.rpc("collab_search_audit_08i",{
        p_query:null,p_action:null,p_entity_type:null,p_severity:null,
        p_category:null,p_actor_user_id:null,p_from:null,p_to:null,
        p_limit:this.foundation.operationsRuntime?.dashboard?.recentAuditLimit||50,
        p_offset:0
      });
      if(!auditResponse.error&&auditResponse.data)audit=auditResponse.data;
    }
    this.state.operationalWorkspace={
      ...emptyOperationalWorkspace(),
      ...workspace,
      audit,
      integrity:this.state.operationalWorkspace?.integrity||null
    };
  }

  startOperationsPolling(){
    this.stopOperationsPolling();
    if(this.config?.mode!=="supabase"||!this.state.authenticated||!hasPermission(this.state,"operations.view"))return;
    const seconds=Math.max(60,Number(this.foundation.operationsRuntime?.dashboard?.pollIntervalSeconds||120));
    this.operationsPoller=setInterval(async()=>{
      try{await this.loadRemoteOperations();this.emit();}catch{/* polling operacional não interrompe a sessão */}
    },seconds*1000);
  }

  stopOperationsPolling(){
    if(this.operationsPoller){clearInterval(this.operationsPoller);this.operationsPoller=null;}
  }

  async loadRemoteContributions(){
    const jobs=[
      this.client.from("collab_contributions").select("*").order("submitted_at",{ascending:false}),
      this.client.from("collab_contribution_submitters").select("*").order("created_at",{ascending:false}),
      this.client.from("collab_contribution_consents").select("*").order("accepted_at",{ascending:false}),
      this.client.from("collab_contribution_files").select("*").order("created_at",{ascending:false}),
      this.client.from("collab_contribution_targets").select("*").order("created_at",{ascending:false}),
      this.client.from("collab_contribution_assignments").select("*").order("assigned_at",{ascending:false}),
      this.client.from("collab_contribution_events").select("*").order("created_at",{ascending:false}).limit(800),
      this.client.from("collab_contribution_decisions").select("*").order("decided_at",{ascending:false}),
      this.client.from("collab_contribution_incorporation_proposals").select("*").order("created_at",{ascending:false}),
      this.client.from("collab_withdrawal_requests").select("*").order("submitted_at",{ascending:false})
    ];
    const[contributions,submitters,consents,files,targets,assignments,events,decisions,proposals,withdrawals]=await Promise.all(jobs);
    const error=[contributions,submitters,consents,files,targets,assignments,events,decisions,proposals,withdrawals].find(item=>item.error)?.error;
    if(error){this.state.error=error.message;return;}
    this.state.contributionWorkspace={
      contributions:contributions.data||[],
      submitters:submitters.data||[],
      consents:consents.data||[],
      files:files.data||[],
      targets:targets.data||[],
      assignments:assignments.data||[],
      events:events.data||[],
      decisions:decisions.data||[],
      proposals:proposals.data||[],
      withdrawals:withdrawals.data||[]
    };
  }

  // ---- Oportunidades (09C.1): demo isolado por localStorage; backend real via RPCs 09C. ----
  demoOpportunityStore(){const raw=localStorage.getItem(OPPORTUNITIES_DEMO_KEY);if(raw){try{const s=JSON.parse(raw);return{opportunities:s.opportunities||[],applications:s.applications||[],audit:s.audit||[]};}catch{localStorage.removeItem(OPPORTUNITIES_DEMO_KEY);}}return opp.initialOpportunitiesStore();}
  saveOpportunityStore(store){localStorage.setItem(OPPORTUNITIES_DEMO_KEY,JSON.stringify(store));this.refreshOpportunitiesWorkspace(store);this.emit();}
  refreshOpportunitiesWorkspace(store=this.demoOpportunityStore()){
    const canManage=hasPermission(this.state,"opportunities.manage");
    const viewerId=this.state.session?.user?.id||null;
    const opportunities=canManage?store.opportunities:store.opportunities.filter(o=>o.status==="published");
    const applications=opp.visibleApplications(store,null,{}); // placeholder; per-opportunity abaixo
    // Candidaturas visíveis para o viewer, agregadas por oportunidade.
    const apps=[];
    for(const o of store.opportunities){for(const a of opp.visibleApplications(store,o.id,{canManage,userId:viewerId}))apps.push(a);}
    this.state.opportunitiesWorkspace={canManage,viewerId,opportunities,applications:apps,notice:this.config?.mode==="demo"?"Dados de demonstração locais — não representam oportunidades reais.":null};
    return this.state.opportunitiesWorkspace;
  }
  async opportunitySave(values){if(!hasPermission(this.state,"opportunities.manage"))throw new Error("Permissão insuficiente.");if(this.config.mode==="demo"){const store=this.demoOpportunityStore();if(values.id)opp.updateOpportunity(store,values.id,values);else opp.createOpportunity(store,{userId:this.state.session.user.id},values);this.saveOpportunityStore(store);return;}const{error}=await this.client.rpc("collab_opportunity_upsert",{p_id:values.id||null,p_payload:{title:values.title,summary:values.summary,description:values.description||null,opportunity_type:values.opportunityType,visibility:values.visibility||"public",location_text:values.locationText||null,starts_at:values.startsAt||null,ends_at:values.endsAt||null,application_deadline:values.applicationDeadline||null,capacity_mode:values.capacityMode||"unlimited",capacity:values.capacityMode==="limited"?Number(values.capacity)||null:null}});if(error)throw error;await this.loadRemoteOpportunities();this.emit();}
  async opportunitySetStatus(id,status,reason=""){if(!hasPermission(this.state,"opportunities.manage"))throw new Error("Permissão insuficiente.");if(this.config.mode==="demo"){const store=this.demoOpportunityStore();if(status==="published")opp.publishOpportunity(store,id);else if(status==="closed")opp.closeApplications(store,id);else if(status==="cancelled")opp.cancelOpportunity(store,id,reason);this.saveOpportunityStore(store);return;}const{error}=await this.client.rpc("collab_opportunity_set_status",{p_id:id,p_status:status});if(error)throw error;await this.loadRemoteOpportunities();this.emit();}
  async opportunitySetCapacity(id,mode,capacity){if(!hasPermission(this.state,"opportunities.manage"))throw new Error("Permissão insuficiente.");if(this.config.mode==="demo"){const store=this.demoOpportunityStore();opp.setCapacity(store,id,mode,capacity);this.saveOpportunityStore(store);return;}await this.opportunitySave({id,capacityMode:mode,capacity});}
  async opportunityDuplicate(id){if(!hasPermission(this.state,"opportunities.manage"))throw new Error("Permissão insuficiente.");if(this.config.mode==="demo"){const store=this.demoOpportunityStore();opp.duplicateOpportunity(store,id,{userId:this.state.session.user.id});this.saveOpportunityStore(store);return;}throw new Error("A duplicação em staging usa a RPC de criação; indisponível na demonstração remota.");}
  async opportunityDecide(applicationId,decision){if(!hasPermission(this.state,"opportunities.manage"))throw new Error("Permissão insuficiente.");if(this.config.mode==="demo"){const store=this.demoOpportunityStore();opp.decideApplication(store,applicationId,decision);this.saveOpportunityStore(store);return;}const{error}=await this.client.rpc("collab_opportunity_decide",{p_application_id:applicationId,p_decision:decision});if(error)throw error;await this.loadRemoteOpportunities();this.emit();}
  async opportunityRemoveParticipant(applicationId,reason){if(!hasPermission(this.state,"opportunities.manage"))throw new Error("Permissão insuficiente.");if(!String(reason||"").trim())throw new Error("A remoção exige uma justificação interna.");if(this.config.mode==="demo"){const store=this.demoOpportunityStore();opp.removeParticipant(store,applicationId,reason);this.saveOpportunityStore(store);return;}const{error}=await this.client.rpc("collab_opportunity_remove_participant",{p_application_id:applicationId,p_reason:reason});if(error)throw error;await this.loadRemoteOpportunities();this.emit();}
  opportunityExport(id){const store=this.demoOpportunityStore();return opp.exportOperational(store,id);}
  publicDemoOpportunities(){if(this.config?.mode!=="demo")return [];const store=this.demoOpportunityStore();return opp.publicOpportunities(store).map(o=>{const full=store.opportunities.find(x=>x.slug===o.slug);return{...o,capacityReached:full?opp.capacityReached(store,full):false};});}
  async opportunityApply(opportunityId){if(!this.state.authenticated)throw new Error("É necessário autenticar-se.");const applicant={userId:this.state.session.user.id,displayName:this.state.profile?.display_name||null,isMinor:Boolean(this.state.profile?.is_minor)};if(this.config.mode==="demo"){const store=this.demoOpportunityStore();opp.applyToOpportunity(store,opportunityId,applicant);this.saveOpportunityStore(store);return;}const{error}=await this.client.rpc("collab_opportunity_apply",{p_opportunity_id:opportunityId});if(error)throw error;await this.loadRemoteOpportunities();this.emit();}
  async opportunityWithdraw(applicationId){if(this.config.mode==="demo"){const store=this.demoOpportunityStore();opp.withdrawApplication(store,applicationId,this.state.session.user.id);this.saveOpportunityStore(store);return;}const{error}=await this.client.rpc("collab_opportunity_withdraw",{p_application_id:applicationId});if(error)throw error;await this.loadRemoteOpportunities();this.emit();}
  async loadRemoteOpportunities(){if(!this.client)return;try{const{data:oppData}=await this.client.from("collab_opportunities").select("*").order("created_at",{ascending:false});const{data:appData}=await this.client.from("collab_opportunity_applications").select("*").order("submitted_at",{ascending:false});const canManage=hasPermission(this.state,"opportunities.manage");this.state.opportunitiesWorkspace={canManage,viewerId:this.state.session?.user?.id||null,opportunities:oppData||[],applications:appData||[],notice:null};}catch(e){this.state.error=e.message;}}
  minimumProfileComplete(){const p=this.state.profile;return Boolean(p?.display_name&&p?.email&&p?.primary_profile_type&&p?.minimum_profile_confirmed);}
  async saveMinimumProfile(values){if(!this.state.authenticated)throw new Error("É necessário autenticar-se.");if(values.consent!==true)throw new Error("É necessário aceitar a política de privacidade.");if(this.config.mode==="demo"){const interests=values.interests||[];this.persistDemo({displayName:values.displayName?.trim()||this.state.profile.display_name,primaryProfileType:values.primaryProfileType||this.state.profile.primary_profile_type||"volunteer",interests,minimumProfileConfirmed:true,preferredContact:values.preferredContact||"email",availabilityNote:values.availabilityNote||""});return;}await this.updateMyProfile({displayName:values.displayName,primaryProfileType:values.primaryProfileType||"volunteer",interests:values.interests||[]});}

  loadDemoContext(){const stored=localStorage.getItem(DEMO_KEY);if(stored){try{this.applyDemoContext(JSON.parse(stored));return;}catch{localStorage.removeItem(DEMO_KEY);}}}
  applyDemoContext(demo){
    const roleCodes=demo.roles||[],permissions=expandRolePermissions(roleCodes,this.foundation.rolePermissions,this.foundation.permissions);
    this.state.authenticated=true;this.state.session={user:{id:demo.userId,email:demo.email,user_metadata:{full_name:demo.displayName}}};this.state.profile={user_id:demo.userId,email:demo.email,display_name:demo.displayName,avatar_url:null,primary_profile_type:demo.primaryProfileType||null,locale:"pt-PT",bio:demo.bio||"",phone:"",organization_name:demo.organizationName||"",languages:demo.languages||["pt-PT"],interests:demo.interests||[],skills:demo.skills||[],public_recognition_opt_in:false,minimum_profile_confirmed:Boolean(demo.minimumProfileConfirmed),is_minor:false};
    this.state.membership={status:demo.status||"pending",primary_profile_type:demo.primaryProfileType||null};this.state.accessRequest=demo.accessRequest||null;this.state.roles=roleCodes;this.state.permissions=permissions;this.state.modules=visibleModules(this.state,this.foundation.modules);this.state.taskWorkspace=demo.taskWorkspace||emptyTaskWorkspace();this.state.tasks=this.state.taskWorkspace.tasks;this.state.exhibitionWorkspace=demo.exhibitionWorkspace||emptyExhibitionWorkspace();this.state.exhibitions=this.state.exhibitionWorkspace.schedules;this.state.contributionWorkspace=demo.contributionWorkspace||emptyContributionWorkspace();this.state.museumReviewWorkspace=demo.museumReviewWorkspace||emptyMuseumReviewWorkspace();this.state.deploymentWorkspace=demo.deploymentWorkspace||emptyDeploymentWorkspace();this.state.notificationWorkspace=demo.notificationWorkspace||emptyNotificationWorkspace();this.state.operationalWorkspace=demo.operationalWorkspace||emptyOperationalWorkspace();this.state.management=demo.management||emptyManagement();this.state.notice="Modo de demonstração local — não utiliza contas, membros ou dados reais.";this.refreshOpportunitiesWorkspace();
  }
  persistDemo(partial){const current=this.state.session?.user?{userId:this.state.session.user.id,email:this.state.session.user.email,displayName:this.state.profile?.display_name||"",primaryProfileType:this.state.profile?.primary_profile_type||null,status:this.state.membership?.status||"pending",roles:this.state.roles,accessRequest:this.state.accessRequest,bio:this.state.profile?.bio||"",organizationName:this.state.profile?.organization_name||"",languages:this.state.profile?.languages||["pt-PT"],interests:this.state.profile?.interests||[],skills:this.state.profile?.skills||[],minimumProfileConfirmed:this.state.profile?.minimum_profile_confirmed||false,taskWorkspace:this.state.taskWorkspace,exhibitionWorkspace:this.state.exhibitionWorkspace,contributionWorkspace:this.state.contributionWorkspace,museumReviewWorkspace:this.state.museumReviewWorkspace,deploymentWorkspace:this.state.deploymentWorkspace,notificationWorkspace:this.state.notificationWorkspace,operationalWorkspace:this.state.operationalWorkspace,management:this.state.management}:{};const next={...current,...partial};localStorage.setItem(DEMO_KEY,JSON.stringify(next));this.applyDemoContext(next);this.emit();}

  async signInGoogle(){if(this.config.mode!=="supabase"||!this.client)throw new Error("Configure o Supabase e o Google OAuth para utilizar este botão.");if(this.config.auth?.googleOAuthEnabled!==true)throw new Error("Google OAuth ainda não foi homologado neste ambiente.");const{error}=await this.client.auth.signInWithOAuth({provider:this.config.googleProvider||"google",options:{redirectTo:callbackUrl(this.config),scopes:"openid email profile"}});if(error)throw error;}

  demoSignIn(kind="pending"){
    if(!this.config.allowDemo)throw new Error("Modo de demonstração desativado.");const master=kind==="master",volunteer=kind==="volunteer",now=new Date().toISOString();
    const members=[{user_id:"demo-master",email:"demo.master@local.invalid",display_name:"Master de demonstração",primary_profile_type:"coordinator",organization_name:"Projeto Comunitário de Milreu",languages:["pt-PT"],membership:{status:"active",approved_at:now},roles:["master"],interests:["museum-memories","events"],skills:["cataloguing"]},{user_id:"demo-volunteer",email:"voluntario@local.invalid",display_name:"Voluntário de demonstração",primary_profile_type:"volunteer",languages:["pt-PT"],membership:{status:"active",approved_at:now},roles:["volunteer"],interests:["photography","events"],skills:["digitisation","event-support","transcription"]},{user_id:"demo-request",email:"pedido@local.invalid",display_name:"Pedido de demonstração",primary_profile_type:"volunteer",languages:["pt-PT"],membership:{status:"pending",requested_at:now},roles:[],interests:[],skills:[]},{user_id:"demo-suspended",email:"investigador@local.invalid",display_name:"Investigador suspenso",primary_profile_type:"researcher",languages:["pt-PT","en"],membership:{status:"suspended",suspended_at:now},roles:["researcher"],interests:["research"],skills:["historical-research"]}];
    const management=master?{members,requests:[{id:"demo-request-id",user_id:"demo-request",requested_profile_type:"volunteer",motivation:"Quero apoiar a recolha e digitalização de fotografias.",status:"pending",submitted_at:now}],invitations:[{id:"demo-invite",email:"convidado@local.invalid",intended_profile_type:"reviewer",role_codes:["reviewer"],status:"pending",created_at:now,expires_at:null}],notes:[],audit:[demoAudit("system.master_bootstrapped","demo-master"),demoAudit("membership.suspended","demo-suspended")]}:emptyManagement();
    const workspace=createDemoTaskWorkspace();const exhibitionWorkspace=createDemoExhibitionWorkspace();const contributionWorkspace=createDemoContributionWorkspace();const museumReviewWorkspace=createDemoMuseumReviewWorkspace(this.foundation.reviewSeed,this.foundation.trainingTrails,master);const deploymentWorkspace=createDemoDeploymentWorkspace(this.foundation.homologationModel,this.foundation.deploymentProfile,this.foundation.deploymentReadiness,master);const notificationWorkspace=createDemoNotificationWorkspace(this.foundation.notificationModel,this.foundation.notificationTemplates,this.foundation.notificationRuntime,master?"demo-master":volunteer?"demo-volunteer":"demo-pending",master,volunteer);const operationalWorkspace=createDemoOperationalWorkspace(this.foundation.operationalGovernanceModel,this.foundation.retentionModel,this.foundation.operationsRuntime,master);
    if(volunteer){workspace.tasks=workspace.tasks.filter(task=>task.status!=="draft");workspace.requiredSkills=workspace.requiredSkills.filter(item=>workspace.tasks.some(task=>task.id===item.task_id));workspace.updates=workspace.updates.filter(item=>workspace.tasks.some(task=>task.id===item.task_id));}
    const demo={userId:master?"demo-master":volunteer?"demo-volunteer":"demo-pending",email:master?"demo.master@local.invalid":volunteer?"voluntario@local.invalid":"demo.user@local.invalid",displayName:master?"Master de demonstração":volunteer?"Voluntário de demonstração":"Utilizador de demonstração",primaryProfileType:master?"coordinator":volunteer?"volunteer":null,status:(master||volunteer)?"active":"pending",roles:master?["master"]:volunteer?["volunteer"]:[],accessRequest:(master||volunteer)?{status:"approved"}:null,taskWorkspace:workspace,exhibitionWorkspace,contributionWorkspace,museumReviewWorkspace,deploymentWorkspace,notificationWorkspace,operationalWorkspace,management,languages:["pt-PT"],interests:master?["museum-memories","events"]:volunteer?["photography","events"]:[],skills:master?["cataloguing"]:volunteer?["digitisation","event-support","transcription"]:[]};
    localStorage.setItem(DEMO_KEY,JSON.stringify(demo));this.applyDemoContext(demo);this.emit();
  }

  async submitAccessRequest({displayName,primaryProfileType,motivation}){if(!displayName?.trim()||!primaryProfileType)throw new Error("Nome e perfil principal são obrigatórios.");if(this.config.mode==="demo"){this.persistDemo({displayName:displayName.trim(),primaryProfileType,status:"pending",accessRequest:{status:"pending",requested_profile_type:primaryProfileType,motivation:motivation||""}});return;}const{error}=await this.client.rpc("collab_submit_access_request",{p_display_name:displayName.trim(),p_primary_profile_type:primaryProfileType,p_motivation:motivation||null});if(error)throw error;const{data:s}=await this.client.auth.getSession();await this.loadRemoteContext(s.session);this.emit();}

  async updateMyProfile(values){const interests=values.interests||[],skills=values.skills||[],languages=values.languages?.length?values.languages:["pt-PT"];if(this.config.mode==="demo"){this.persistDemo({displayName:values.displayName?.trim()||this.state.profile.display_name,primaryProfileType:values.primaryProfileType||this.state.profile.primary_profile_type,bio:values.bio||"",organizationName:values.organizationName||"",languages,interests,skills});return;}const{error}=await this.client.rpc("collab_update_my_profile_08b",{p_display_name:values.displayName,p_primary_profile_type:values.primaryProfileType||null,p_locale:values.locale||"pt-PT",p_bio:values.bio||null,p_phone:values.phone||null,p_public_recognition_opt_in:Boolean(values.publicRecognitionOptIn),p_organization_name:values.organizationName||null,p_languages:languages,p_interests:interests,p_skills:skills});if(error)throw error;const{data:s}=await this.client.auth.getSession();await this.loadRemoteContext(s.session);this.emit();}

  async manageMember(values){if(!hasPermission(this.state,"memberships.manage"))throw new Error("Permissão insuficiente.");const roleCodes=values.roleCodes||[];if(this.config.mode==="demo"){const management=structuredClone(this.state.management),member=management.members.find(x=>x.user_id===values.userId);if(!member)throw new Error("Membro não encontrado.");const currentMasters=management.members.filter(x=>x.membership?.status==="active"&&x.roles?.includes("master"));if(member.roles?.includes("master")&&(!roleCodes.includes("master")||values.status!=="active")&&currentMasters.length<=1)throw new Error("O último master ativo não pode ser removido ou suspenso.");member.primary_profile_type=values.primaryProfileType;member.membership={...member.membership,status:values.status,primary_profile_type:values.primaryProfileType,notes:values.note||member.membership?.notes};member.roles=roleCodes;const request=management.requests.find(x=>x.user_id===values.userId&&x.status==="pending");if(request&&values.status==="active")request.status="approved";if(request&&values.status==="rejected")request.status="rejected";if(values.note)management.notes.unshift({id:`demo-note-${Date.now()}`,user_id:values.userId,note:values.note,created_by:this.state.session.user.id,created_at:new Date().toISOString()});management.audit.unshift(demoAudit("membership.managed",values.userId,this.state.session.user.id,{status:values.status,roles:roleCodes}));this.persistDemo({management});return;}const{error}=await this.client.rpc("collab_manage_member",{p_user_id:values.userId,p_primary_profile_type:values.primaryProfileType,p_role_codes:roleCodes,p_status:values.status,p_note:values.note||null});if(error)throw error;await this.loadRemoteManagement();this.emit();}

  async createInvitation(values){if(!hasPermission(this.state,"invitations.manage"))throw new Error("Permissão insuficiente.");if(this.config.mode==="demo"){const management=structuredClone(this.state.management);management.invitations.unshift({id:`demo-invite-${Date.now()}`,email:values.email.toLowerCase(),intended_profile_type:values.primaryProfileType,role_codes:values.roleCodes||["volunteer"],status:"pending",created_at:new Date().toISOString(),expires_at:values.expiresAt||null,internal_notes:values.notes||null});management.audit.unshift(demoAudit("invitation.created",values.email,this.state.session.user.id));this.persistDemo({management});return;}const{error}=await this.client.rpc("collab_create_access_invitation",{p_email:values.email,p_profile_type:values.primaryProfileType,p_role_codes:values.roleCodes||["volunteer"],p_expires_at:values.expiresAt||null,p_notes:values.notes||null});if(error)throw error;await this.loadRemoteManagement();this.emit();}
  async revokeInvitation(invitationId,reason=""){if(this.config.mode==="demo"){const management=structuredClone(this.state.management),inv=management.invitations.find(x=>x.id===invitationId);if(inv){inv.status="revoked";inv.revoked_at=new Date().toISOString();}management.audit.unshift(demoAudit("invitation.revoked",invitationId,this.state.session.user.id));this.persistDemo({management});return;}const{error}=await this.client.rpc("collab_revoke_access_invitation",{p_invitation_id:invitationId,p_reason:reason||null});if(error)throw error;await this.loadRemoteManagement();this.emit();}

  demoWorkspaceUpdate(mutator){const taskWorkspace=structuredClone(this.state.taskWorkspace);mutator(taskWorkspace);this.persistDemo({taskWorkspace});}
  addDemoTaskUpdate(workspace,taskId,type,note="",userId=this.state.session.user.id,metadata={}){workspace.updates.unshift(demoTaskUpdate(taskId,userId,type,note,metadata));}
  async refreshTasks(){if(this.config.mode==="supabase"){await this.loadRemoteTasks();this.emit();}}

  async saveAvailability(values){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{workspace.preferences={project_id:"demo-project",user_id:this.state.session.user.id,preferred_modes:values.preferredModes,maximum_weekly_minutes:values.maximumWeeklyMinutes,availability_notes:values.notes,timezone:values.timezone};workspace.availability=values.slots.map((slot,index)=>({id:`demo-slot-${Date.now()}-${index}`,project_id:"demo-project",user_id:this.state.session.user.id,day_of_week:Number(slot.dayOfWeek),starts_at:`${slot.startsAt}:00`,ends_at:`${slot.endsAt}:00`,mode:slot.mode,active:true}));});return;}const{error}=await this.client.rpc("collab_set_my_availability_08c",{p_preferences:{preferredModes:values.preferredModes,maximumWeeklyMinutes:values.maximumWeeklyMinutes,notes:values.notes||null,timezone:values.timezone||"Europe/Lisbon"},p_slots:values.slots});if(error)throw error;await this.refreshTasks();}

  async createTask(payload){if(this.config.mode==="demo"){const id=`demo-task-${Date.now()}`;this.demoWorkspaceUpdate(workspace=>{workspace.tasks.unshift({id,project_id:"demo-project",title:payload.title,summary:payload.summary||null,description:payload.description||null,instructions:payload.instructions||null,category:payload.categoryCode,category_code:payload.categoryCode,status:"draft",priority:payload.priority||"normal",assignment_mode:payload.assignmentMode||"approval",location_mode:payload.locationMode||"flexible",location_name:payload.locationName||null,municipality:payload.municipality||null,starts_at:payload.startsAt||null,due_at:payload.dueAt||null,application_deadline:payload.applicationDeadline||null,estimated_minutes:payload.estimatedMinutes||null,capacity:payload.capacity||null,minimum_participants:payload.minimumParticipants||1,visibility:"members",recognition_eligible:Boolean(payload.recognitionEligible),created_by:this.state.session.user.id,updated_at:new Date().toISOString()});for(const skill of payload.skills||[])workspace.requiredSkills.push({task_id:id,skill_code:skill.code,required:Boolean(skill.required)});this.addDemoTaskUpdate(workspace,id,"progress","Rascunho criado.");});return id;}const{data,error}=await this.client.rpc("collab_create_task_08c",{p_payload:payload});if(error)throw error;await this.refreshTasks();return data;}
  async updateTask(taskId,payload){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const task=workspace.tasks.find(x=>x.id===taskId);if(!task)throw new Error("Tarefa não encontrada.");Object.assign(task,{title:payload.title||task.title,summary:payload.summary??task.summary,description:payload.description??task.description,instructions:payload.instructions??task.instructions,category:payload.categoryCode||task.category,category_code:payload.categoryCode||task.category_code,priority:payload.priority||task.priority,assignment_mode:payload.assignmentMode||task.assignment_mode,location_mode:payload.locationMode||task.location_mode,location_name:payload.locationName??task.location_name,municipality:payload.municipality??task.municipality,starts_at:payload.startsAt??task.starts_at,due_at:payload.dueAt??task.due_at,application_deadline:payload.applicationDeadline??task.application_deadline,estimated_minutes:payload.estimatedMinutes??task.estimated_minutes,capacity:payload.capacity??task.capacity,minimum_participants:payload.minimumParticipants??task.minimum_participants,recognition_eligible:Boolean(payload.recognitionEligible),updated_at:new Date().toISOString()});workspace.requiredSkills=workspace.requiredSkills.filter(x=>x.task_id!==taskId);for(const skill of payload.skills||[])workspace.requiredSkills.push({task_id:taskId,skill_code:skill.code,required:Boolean(skill.required)});this.addDemoTaskUpdate(workspace,taskId,"progress","Tarefa atualizada.");});return;}const{error}=await this.client.rpc("collab_update_task_08c",{p_task_id:taskId,p_payload:payload});if(error)throw error;await this.refreshTasks();}
  async publishTask(taskId){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const task=workspace.tasks.find(x=>x.id===taskId);if(!task||task.status!=="draft")throw new Error("Tarefa não publicável.");task.status="open";this.addDemoTaskUpdate(workspace,taskId,"progress","Tarefa publicada.");});return;}const{error}=await this.client.rpc("collab_publish_task_08c",{p_task_id:taskId});if(error)throw error;await this.refreshTasks();}
  async cancelTask(taskId,reason=""){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const task=workspace.tasks.find(x=>x.id===taskId);if(!task)throw new Error("Tarefa não encontrada.");task.status="cancelled";workspace.assignments.filter(x=>x.task_id===taskId&&!['completed','declined','withdrawn'].includes(x.status)).forEach(x=>x.status="cancelled");this.addDemoTaskUpdate(workspace,taskId,"cancelled",reason);});return;}const{error}=await this.client.rpc("collab_cancel_task_08c",{p_task_id:taskId,p_reason:reason||null});if(error)throw error;await this.refreshTasks();}
  async completeTask(taskId,note=""){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const task=workspace.tasks.find(x=>x.id===taskId);if(!task)throw new Error("Tarefa não encontrada.");if(workspace.assignments.some(x=>x.task_id===taskId&&['accepted','in-progress','submitted'].includes(x.status)))throw new Error("Ainda existem participações abertas.");task.status="completed";workspace.assignments.filter(x=>x.task_id===taskId&&["invited","applied"].includes(x.status)).forEach(x=>x.status="cancelled");this.addDemoTaskUpdate(workspace,taskId,"verified",note);});return;}const{error}=await this.client.rpc("collab_complete_task_08c",{p_task_id:taskId,p_note:note||null});if(error)throw error;await this.refreshTasks();}
  async joinTask(taskId,note=""){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const task=workspace.tasks.find(x=>x.id===taskId);if(!task||task.status!=="open")throw new Error("Tarefa indisponível.");const existing=workspace.assignments.find(x=>x.task_id===taskId&&x.user_id===this.state.session.user.id);if(existing&&!['declined','withdrawn','cancelled'].includes(existing.status))throw new Error("Já existe uma participação.");const status=task.assignment_mode==="open"?"accepted":"applied",row={task_id:taskId,user_id:this.state.session.user.id,status,applied_at:new Date().toISOString(),accepted_at:status==="accepted"?new Date().toISOString():null,application_note:note,updated_at:new Date().toISOString()};if(existing)Object.assign(existing,row);else workspace.assignments.push(row);this.addDemoTaskUpdate(workspace,taskId,status==="accepted"?"accepted":"application",note);});return;}const{error}=await this.client.rpc("collab_join_task_08c",{p_task_id:taskId,p_note:note||null});if(error)throw error;await this.refreshTasks();}
  async inviteTaskMember(taskId,userId,note=""){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{let assignment=workspace.assignments.find(x=>x.task_id===taskId&&x.user_id===userId);const row={task_id:taskId,user_id:userId,status:"invited",assigned_by:this.state.session.user.id,assigned_at:new Date().toISOString(),manager_note:note,updated_at:new Date().toISOString()};if(assignment)Object.assign(assignment,row);else workspace.assignments.push(row);this.addDemoTaskUpdate(workspace,taskId,"invitation",note,userId);});return;}const{error}=await this.client.rpc("collab_invite_task_member_08c",{p_task_id:taskId,p_user_id:userId,p_note:note||null});if(error)throw error;await this.refreshTasks();}
  async respondTaskInvitation(taskId,accept,note=""){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const assignment=workspace.assignments.find(x=>x.task_id===taskId&&x.user_id===this.state.session.user.id&&x.status==="invited");if(!assignment)throw new Error("Convite não encontrado.");assignment.status=accept?"accepted":"declined";assignment.accepted_at=accept?new Date().toISOString():null;assignment.declined_at=!accept?new Date().toISOString():null;this.addDemoTaskUpdate(workspace,taskId,accept?"accepted":"declined",note);});return;}const{error}=await this.client.rpc("collab_respond_task_invitation_08c",{p_task_id:taskId,p_accept:Boolean(accept),p_note:note||null});if(error)throw error;await this.refreshTasks();}
  async reviewTaskApplication(taskId,userId,accept,note=""){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const assignment=workspace.assignments.find(x=>x.task_id===taskId&&x.user_id===userId&&x.status==="applied");if(!assignment)throw new Error("Candidatura não encontrada.");assignment.status=accept?"accepted":"declined";assignment.manager_note=note;assignment.accepted_at=accept?new Date().toISOString():null;this.addDemoTaskUpdate(workspace,taskId,accept?"accepted":"declined",note,userId);});return;}const{error}=await this.client.rpc("collab_review_task_application_08c",{p_task_id:taskId,p_user_id:userId,p_accept:Boolean(accept),p_note:note||null});if(error)throw error;await this.refreshTasks();}
  async startTask(taskId){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const assignment=workspace.assignments.find(x=>x.task_id===taskId&&x.user_id===this.state.session.user.id&&x.status==="accepted");if(!assignment)throw new Error("Tarefa não pode ser iniciada.");assignment.status="in-progress";assignment.started_at=new Date().toISOString();const task=workspace.tasks.find(x=>x.id===taskId);if(task?.status==="open")task.status="in-progress";this.addDemoTaskUpdate(workspace,taskId,"started");});return;}const{error}=await this.client.rpc("collab_start_task_08c",{p_task_id:taskId});if(error)throw error;await this.refreshTasks();}
  async submitTask(taskId,note="",minutes=null){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const assignment=workspace.assignments.find(x=>x.task_id===taskId&&x.user_id===this.state.session.user.id&&['accepted','in-progress'].includes(x.status));if(!assignment)throw new Error("Tarefa não pode ser submetida.");assignment.status="submitted";assignment.submitted_at=new Date().toISOString();assignment.completion_note=note;if(minutes)workspace.timeEntries.unshift({id:`demo-time-${Date.now()}`,project_id:"demo-project",task_id:taskId,user_id:this.state.session.user.id,activity_date:new Date().toISOString().slice(0,10),minutes:Number(minutes),note,status:"pending",created_at:new Date().toISOString()});this.addDemoTaskUpdate(workspace,taskId,"submitted",note,{minutes});});return;}const{error}=await this.client.rpc("collab_submit_task_08c",{p_task_id:taskId,p_note:note||null,p_minutes:minutes?Number(minutes):null});if(error)throw error;await this.refreshTasks();}
  async verifyTask(taskId,userId,accept,note=""){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const assignment=workspace.assignments.find(x=>x.task_id===taskId&&x.user_id===userId&&x.status==="submitted");if(!assignment)throw new Error("Submissão não encontrada.");assignment.status=accept?"completed":"in-progress";assignment.manager_note=note;assignment.verified_at=accept?new Date().toISOString():null;workspace.timeEntries.filter(x=>x.task_id===taskId&&x.user_id===userId&&x.status==="pending").forEach(x=>x.status=accept?"approved":"rejected");this.addDemoTaskUpdate(workspace,taskId,accept?"verified":"reopened",note,userId);});return;}const{error}=await this.client.rpc("collab_verify_task_08c",{p_task_id:taskId,p_user_id:userId,p_accept:Boolean(accept),p_note:note||null});if(error)throw error;await this.refreshTasks();}
  async withdrawTask(taskId,note=""){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{const assignment=workspace.assignments.find(x=>x.task_id===taskId&&x.user_id===this.state.session.user.id&&!['completed','withdrawn','cancelled'].includes(x.status));if(!assignment)throw new Error("Participação não pode ser retirada.");assignment.status="withdrawn";assignment.withdrawn_at=new Date().toISOString();assignment.completion_note=note;this.addDemoTaskUpdate(workspace,taskId,"withdrawn",note);});return;}const{error}=await this.client.rpc("collab_withdraw_task_08c",{p_task_id:taskId,p_note:note||null});if(error)throw error;await this.refreshTasks();}
  async logTaskTime(taskId,activityDate,minutes,note=""){if(this.config.mode==="demo"){this.demoWorkspaceUpdate(workspace=>{workspace.timeEntries.unshift({id:`demo-time-${Date.now()}`,project_id:"demo-project",task_id:taskId,user_id:this.state.session.user.id,activity_date:activityDate,minutes:Number(minutes),note,status:"pending",created_at:new Date().toISOString()});this.addDemoTaskUpdate(workspace,taskId,"time-log",note,{minutes:Number(minutes)});});return;}const{error}=await this.client.rpc("collab_log_task_time_08c",{p_task_id:taskId,p_activity_date:activityDate,p_minutes:Number(minutes),p_note:note||null});if(error)throw error;await this.refreshTasks();}



  demoContributionUpdate(mutator){const contributionWorkspace=structuredClone(this.state.contributionWorkspace);mutator(contributionWorkspace);this.persistDemo({contributionWorkspace});}
  async refreshContributions(){if(this.config.mode==="supabase"){await this.loadRemoteContributions();this.emit();}}

  demoPublicContributions(){
    try{return JSON.parse(localStorage.getItem(PUBLIC_CONTRIBUTION_DEMO_KEY)||"[]");}
    catch{return[];}
  }

  saveDemoPublicContributions(items){
    localStorage.setItem(PUBLIC_CONTRIBUTION_DEMO_KEY,JSON.stringify(items));
  }

  async invokeContributionFunction(body){
    if(this.config.mode!=="supabase"||!this.client)throw new Error("A infraestrutura remota de contributos ainda não está configurada.");
    const{data,error}=await this.client.functions.invoke(this.config.contributions?.functionName||"community-contribution-intake",{body});
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||"contribution_function_failed");
    return data.data;
  }

  async submitContribution(payload,files=[]){
    const metadata=files.map(file=>({name:file.name,mimeType:file.type||"application/octet-stream",sizeBytes:file.size,rightsNote:payload.fileRightsNote||null}));
    const contributionPayload={...payload,files:metadata,language:"pt-PT"};
    if(this.config.mode==="demo"){
      const trackingCode=`DEMO-${crypto.randomUUID().replaceAll("-","").slice(0,16).toUpperCase()}`;
      const publicReference=`MILREU-DEMO-${String(Date.now()).slice(-8)}`;
      const id=`demo-public-contribution-${Date.now()}`;
      const row={id,project_id:"demo-project",submitter_id:`demo-submitter-${Date.now()}`,submitter_user_id:this.state.authenticated?this.state.session?.user?.id:null,contribution_type:payload.contributionType,title:payload.title,summary:payload.summary||null,content:payload.content,historical_context:payload.historicalContext||null,place_text:payload.placeText||null,date_text:payload.dateText||null,source_context:payload.sourceContext||null,attribution_preference:payload.attributionPreference||"discuss",requested_usage_scope:payload.requestedUsageScope||"review-only",rights_declaration:payload.rightsDeclaration,status:"submitted",priority:"normal",public_reference:publicReference,public_message:"Contributo recebido. Será analisado pela equipa do projeto.",assigned_to:null,submitted_at:new Date().toISOString(),updated_at:new Date().toISOString(),trackingCode};
      const submitter={id:row.submitter_id,project_id:"demo-project",user_id:row.submitter_user_id,display_name:payload.displayName,email:String(payload.email||"").toLowerCase(),phone:payload.phone||null,locality:payload.locality||null,preferred_contact:payload.preferredContact||"email",contact_allowed:Boolean(payload.contactAllowed)};
      const fileRows=metadata.map((file,index)=>({id:`demo-file-${Date.now()}-${index}`,project_id:"demo-project",contribution_id:id,storage_bucket:"community-contributions-private",storage_path:`demo/private/${file.name}`,original_filename:file.name,mime_type:file.mimeType,size_bytes:file.sizeBytes,status:"declared",rights_note:file.rightsNote,created_at:new Date().toISOString()}));
      if(this.state.authenticated){
        this.demoContributionUpdate(workspace=>{workspace.contributions.unshift(row);workspace.submitters.unshift(submitter);workspace.files.unshift(...fileRows);workspace.consents.unshift({id:`demo-consent-${id}`,project_id:"demo-project",contribution_id:id,consent_version:"2026-08E-v1",privacy_accepted:true,rights_confirmed:true,project_use_authorised:true,contact_authorised:Boolean(payload.contactAllowed),public_attribution_authorised:Boolean(payload.publicAttributionAuthorised),accepted_at:new Date().toISOString()});workspace.events.unshift({id:`demo-event-${id}`,project_id:"demo-project",contribution_id:id,actor_user_id:row.submitter_user_id,event_type:"contribution.submitted",to_status:"submitted",note:"Contributo submetido.",visible_to_submitter:true,metadata:{},created_at:new Date().toISOString()});});
      }else{
        const items=this.demoPublicContributions();items.unshift({row,submitter,files:fileRows,withdrawal:null});this.saveDemoPublicContributions(items);
      }
      return{contributionId:id,publicReference,trackingCode,status:"submitted",uploads:[]};
    }

    const result=await this.invokeContributionFunction({action:"submit",payload:contributionPayload,website:payload.website||"",turnstileToken:payload.turnstileToken||null});
    for(let index=0;index<(result.uploads||[]).length;index++){
      const upload=result.uploads[index],file=files[index];
      if(!file)continue;
      const{error}=await this.client.storage.from("community-contributions-private").uploadToSignedUrl(upload.path,upload.token,file,{contentType:file.type||upload.mimeType});
      if(error)throw error;
      await this.invokeContributionFunction({action:"complete-file",fileId:upload.fileId,trackingCode:result.trackingCode,email:payload.email,sha256:null});
    }
    if(this.state.authenticated)await this.refreshContributions();
    return result;
  }

  async trackContribution(trackingCode,email){
    if(this.config.mode==="demo"){
      const all=[...this.demoPublicContributions().map(item=>({...item.row,email:item.submitter.email})),...this.state.contributionWorkspace.contributions.map(row=>({...row,email:this.state.contributionWorkspace.submitters.find(item=>item.id===row.submitter_id)?.email}))];
      const row=all.find(item=>item.trackingCode===trackingCode&&String(item.email||"").toLowerCase()===String(email||"").toLowerCase());
      if(!row)throw new Error("Código ou e-mail não encontrado.");
      const withdrawal=this.state.contributionWorkspace.withdrawals.find(item=>item.contribution_id===row.id)||this.demoPublicContributions().find(item=>item.row.id===row.id)?.withdrawal;
      return{publicReference:row.public_reference,contributionType:row.contribution_type,title:row.title,status:row.status,publicMessage:row.public_message,submittedAt:row.submitted_at,updatedAt:row.updated_at,withdrawalStatus:withdrawal?.status||null};
    }
    return this.invokeContributionFunction({action:"track",trackingCode,email});
  }

  async requestContributionWithdrawal(values){
    if(this.config.mode==="demo"){
      const publicItems=this.demoPublicContributions(),publicItem=publicItems.find(item=>item.row.trackingCode===values.trackingCode&&item.submitter.email===String(values.email).toLowerCase());
      if(publicItem){publicItem.withdrawal={id:`demo-withdrawal-${Date.now()}`,contribution_id:publicItem.row.id,public_reference:publicItem.row.public_reference,requester_name:values.name,requester_email:values.email,status:"submitted",reason:values.reason,submitted_at:new Date().toISOString()};this.saveDemoPublicContributions(publicItems);return publicItem.withdrawal;}
      const row=this.state.contributionWorkspace.contributions.find(item=>item.trackingCode===values.trackingCode);
      const submitter=this.state.contributionWorkspace.submitters.find(item=>item.id===row?.submitter_id);
      if(!row||submitter?.email!==String(values.email).toLowerCase())throw new Error("Código ou e-mail não encontrado.");
      const request={id:`demo-withdrawal-${Date.now()}`,project_id:"demo-project",contribution_id:row.id,public_reference:row.public_reference,requester_user_id:this.state.session?.user?.id||null,requester_name:values.name,requester_email:values.email,status:"submitted",reason:values.reason,submitted_at:new Date().toISOString()};
      this.demoContributionUpdate(workspace=>workspace.withdrawals.unshift(request));return request;
    }
    return this.invokeContributionFunction({action:"withdraw",...values});
  }

  async assignContribution(contributionId,reviewerUserId,assignmentRole="reviewer",note=""){
    if(!hasPermission(this.state,"contributions.assign"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){this.demoContributionUpdate(workspace=>{workspace.assignments.unshift({id:`demo-assignment-${Date.now()}`,project_id:"demo-project",contribution_id:contributionId,reviewer_user_id:reviewerUserId,assignment_role:assignmentRole,status:"active",assigned_by:this.state.session.user.id,assigned_at:new Date().toISOString()});const row=workspace.contributions.find(item=>item.id===contributionId);if(row){row.assigned_to=reviewerUserId;if(row.status==="submitted")row.status="triage";row.updated_at=new Date().toISOString();}});return;}
    const{error}=await this.client.rpc("collab_assign_contribution_08e",{p_contribution_id:contributionId,p_reviewer_user_id:reviewerUserId,p_assignment_role:assignmentRole,p_note:note||null});if(error)throw error;await this.refreshContributions();
  }

  async moderateContribution(contributionId,action,rationale,publicMessage=""){
    if(!hasPermission(this.state,"contributions.moderate")&&!hasPermission(this.state,"contributions.decide"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){const mapping={triage:"triage",review:"under-review","request-info":"needs-info",accept:"accepted",partial:"partially-accepted",reject:"rejected",withdraw:"withdrawn",incorporate:"incorporated",archive:"archived"};this.demoContributionUpdate(workspace=>{const row=workspace.contributions.find(item=>item.id===contributionId);if(!row)throw new Error("Contributo não encontrado.");const previous=row.status;row.status=mapping[action]||row.status;row.public_message=publicMessage||row.public_message;row.updated_at=new Date().toISOString();workspace.events.unshift({id:`demo-event-${Date.now()}`,project_id:"demo-project",contribution_id:contributionId,actor_user_id:this.state.session.user.id,event_type:"contribution.moderated",from_status:previous,to_status:row.status,note:rationale,visible_to_submitter:["request-info","accept","partial","reject","withdraw","incorporate"].includes(action),metadata:{action,publicMessage},created_at:new Date().toISOString()});if(["accept","partial","reject","request-info","withdraw","incorporate"].includes(action))workspace.decisions.unshift({id:`demo-decision-${Date.now()}`,project_id:"demo-project",contribution_id:contributionId,decision_type:action,rationale,public_message:publicMessage,decided_by:this.state.session.user.id,decided_at:new Date().toISOString()});});return;}
    const{error}=await this.client.rpc("collab_moderate_contribution_08e",{p_contribution_id:contributionId,p_action:action,p_rationale:rationale,p_public_message:publicMessage||null});if(error)throw error;await this.refreshContributions();
  }

  async createIncorporationProposal(contributionId,destination,targetIdentifier,summary){
    if(!hasPermission(this.state,"contributions.review"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){this.demoContributionUpdate(workspace=>workspace.proposals.unshift({id:`demo-proposal-${Date.now()}`,project_id:"demo-project",contribution_id:contributionId,destination,target_identifier:targetIdentifier||null,proposal_summary:summary,status:"pending",proposed_by:this.state.session.user.id,created_at:new Date().toISOString()}));return;}
    const{error}=await this.client.rpc("collab_create_incorporation_proposal_08e",{p_contribution_id:contributionId,p_destination:destination,p_target_identifier:targetIdentifier||null,p_summary:summary});if(error)throw error;await this.refreshContributions();
  }

  async reviewContributionFile(fileId,status,note=""){
    if(!hasPermission(this.state,"contributions.files.review"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){this.demoContributionUpdate(workspace=>{const file=workspace.files.find(item=>item.id===fileId);if(!file)throw new Error("Ficheiro não encontrado.");file.status=status;file.technical_note=note;file.reviewed_at=new Date().toISOString();file.reviewed_by=this.state.session.user.id;});return;}
    const{error}=await this.client.rpc("collab_review_contribution_file_08e",{p_file_id:fileId,p_status:status,p_note:note||null});if(error)throw error;await this.refreshContributions();
  }


  async resolveWithdrawal(requestId,status,note=""){
    if(!hasPermission(this.state,"withdrawals.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){this.demoContributionUpdate(workspace=>{const request=workspace.withdrawals.find(item=>item.id===requestId);if(!request)throw new Error("Pedido não encontrado.");request.status=status;request.reviewer_note=note;request.reviewed_by=this.state.session.user.id;request.reviewed_at=new Date().toISOString();if(status==="completed")request.completed_at=new Date().toISOString();if(["approved","completed"].includes(status)){const row=workspace.contributions.find(item=>item.id===request.contribution_id);if(row){row.status="withdrawn";row.public_message="O pedido de retirada foi aprovado.";row.withdrawn_at=new Date().toISOString();row.updated_at=new Date().toISOString();}}});return;}
    const{error}=await this.client.rpc("collab_resolve_withdrawal_request_08e",{p_request_id:requestId,p_status:status,p_note:note||null});if(error)throw error;await this.refreshContributions();
  }

  async getContributionFileLink(fileId){
    if(this.config.mode==="demo")throw new Error("O modo de demonstração não contém ficheiros reais.");
    return this.invokeContributionFunction({action:"file-link",fileId});
  }


  demoMuseumReviewUpdate(mutator){const museumReviewWorkspace=structuredClone(this.state.museumReviewWorkspace);mutator(museumReviewWorkspace);this.persistDemo({museumReviewWorkspace});}
  async refreshMuseumReview(){if(this.config.mode==="supabase"){await this.loadRemoteMuseumReview();this.emit();}}

  trainingCompleted(trailCode,userId=this.state.session?.user?.id){
    return this.state.museumReviewWorkspace.trainingEnrolments.some(item=>item.user_id===userId&&item.trail_code===trailCode&&item.status==="completed");
  }

  requiredTraining(action){
    return this.state.museumReviewModel.requiredTrainingByAction?.[action]||[];
  }

  assertDemoTraining(action){
    const missing=this.requiredTraining(action).filter(code=>!this.trainingCompleted(code));
    if(missing.length)throw new Error(`Formação obrigatória por concluir: ${missing.join(", ")}`);
  }

  async completeTrainingLesson(trailCode,lessonCode){
    if(!hasPermission(this.state,"training.complete"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoMuseumReviewUpdate(workspace=>{
        let enrolment=workspace.trainingEnrolments.find(item=>item.user_id===this.state.session.user.id&&item.trail_code===trailCode);
        if(!enrolment){enrolment={id:`demo-enrolment-${trailCode}-${Date.now()}`,project_id:"demo-project",user_id:this.state.session.user.id,trail_code:trailCode,status:"in-progress",progress_percent:0,started_at:new Date().toISOString(),completed_at:null,expires_at:null,updated_at:new Date().toISOString()};workspace.trainingEnrolments.push(enrolment);}
        let progress=workspace.lessonProgress.find(item=>item.enrolment_id===enrolment.id&&item.lesson_code===lessonCode);
        if(progress){progress.status="completed";progress.completed_at=new Date().toISOString();progress.updated_at=new Date().toISOString();}
        else workspace.lessonProgress.push({id:`demo-progress-${Date.now()}`,enrolment_id:enrolment.id,lesson_code:lessonCode,status:"completed",completed_at:new Date().toISOString(),updated_at:new Date().toISOString()});
        const trail=this.state.trainingTrails.trails.find(item=>item.code===trailCode);
        const total=trail?.lessons?.length||1;
        const completed=workspace.lessonProgress.filter(item=>item.enrolment_id===enrolment.id&&item.status==="completed").length;
        enrolment.progress_percent=Math.round(completed*100/total);enrolment.status=enrolment.progress_percent===100?"assessment-pending":"in-progress";enrolment.updated_at=new Date().toISOString();
      });return;
    }
    const{error}=await this.client.rpc("collab_complete_training_lesson_08f",{p_trail_code:trailCode,p_lesson_code:lessonCode});if(error)throw error;await this.refreshMuseumReview();
  }

  async assessTraining(userId,trailCode,score){
    if(!(hasPermission(this.state,"training.assess")||hasPermission(this.state,"training.manage")))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoMuseumReviewUpdate(workspace=>{
        const enrolment=workspace.trainingEnrolments.find(item=>item.user_id===userId&&item.trail_code===trailCode);if(!enrolment||enrolment.progress_percent!==100)throw new Error("As lições ainda não foram concluídas.");
        const trail=this.state.trainingTrails.trails.find(item=>item.code===trailCode),passed=Number(score)>=(trail?.assessment?.passingScore||80);
        workspace.assessments.unshift({id:`demo-assessment-${Date.now()}`,project_id:"demo-project",user_id:userId,trail_code:trailCode,attempt_number:workspace.assessments.filter(item=>item.user_id===userId&&item.trail_code===trailCode).length+1,score:Number(score),passed,answers:{demo:true},assessed_at:new Date().toISOString(),assessed_by:this.state.session.user.id});
        enrolment.status=passed?"completed":"assessment-pending";enrolment.completed_at=passed?new Date().toISOString():null;enrolment.updated_at=new Date().toISOString();
      });return;
    }
    const{error}=await this.client.rpc("collab_record_training_assessment_08f",{p_user_id:userId,p_trail_code:trailCode,p_score:Number(score),p_answers:{}});if(error)throw error;await this.refreshMuseumReview();
  }

  async saveMuseumProposal(proposalId,reviewRecordId,payload){
    if(!hasPermission(this.state,"museum.review.edit"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.assertDemoTraining("edit");
      this.demoMuseumReviewUpdate(workspace=>{
        const id=proposalId||`demo-proposal-${Date.now()}`;let row=workspace.proposals.find(item=>item.id===id);
        const next={id,project_id:"demo-project",review_record_id:reviewRecordId,field_path:payload.fieldPath,base_value:payload.baseValue,proposed_value:payload.proposedValue,rationale:payload.rationale,source_ids:payload.sourceIds||[],contribution_ids:payload.contributionIds||[],status:payload.submit?"submitted":"draft",proposed_by:this.state.session.user.id,proposed_at:row?.proposed_at||new Date().toISOString(),updated_at:new Date().toISOString()};
        if(row)Object.assign(row,next);else workspace.proposals.unshift(next);
        const record=workspace.records.find(item=>item.id===reviewRecordId);if(record&&record.status==="not-started")record.status="in-progress";
      });return;
    }
    const{error}=await this.client.rpc("collab_upsert_museum_review_proposal_08f",{p_proposal_id:proposalId||null,p_review_record_id:reviewRecordId,p_field_path:payload.fieldPath,p_base_value:payload.baseValue,p_proposed_value:payload.proposedValue,p_rationale:payload.rationale,p_source_ids:payload.sourceIds||[],p_contribution_ids:payload.contributionIds||[],p_submit:Boolean(payload.submit)});if(error)throw error;await this.refreshMuseumReview();
  }

  async reviewMuseumProposal(proposalId,status,note){
    if(!hasPermission(this.state,"museum.review.check"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoMuseumReviewUpdate(workspace=>{const row=workspace.proposals.find(item=>item.id===proposalId);if(!row||row.status!=="submitted")throw new Error("Proposta indisponível.");row.status=status;row.reviewed_by=this.state.session.user.id;row.reviewed_at=new Date().toISOString();const record=workspace.records.find(item=>item.id===row.review_record_id);if(record)record.accepted_proposal_count=workspace.proposals.filter(item=>item.review_record_id===record.id&&item.status==="accepted").length;workspace.comments.unshift({id:`demo-comment-${Date.now()}`,project_id:"demo-project",review_record_id:row.review_record_id,field_path:row.field_path,comment_type:"note",body:note,blocking:false,resolved:false,created_by:this.state.session.user.id,created_at:new Date().toISOString()});});return;
    }
    const{error}=await this.client.rpc("collab_review_museum_proposal_08f",{p_proposal_id:proposalId,p_status:status,p_note:note});if(error)throw error;await this.refreshMuseumReview();
  }


  async supersedeMuseumProposal(proposalId,rationale){
    if(!hasPermission(this.state,"museum.review.check"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoMuseumReviewUpdate(workspace=>{const row=workspace.proposals.find(item=>item.id===proposalId&&item.status==="accepted");if(!row)throw new Error("Proposta aceite não encontrada.");row.status="superseded";row.reviewed_by=this.state.session.user.id;row.reviewed_at=new Date().toISOString();const record=workspace.records.find(item=>item.id===row.review_record_id);if(record){record.accepted_proposal_count=workspace.proposals.filter(item=>item.review_record_id===record.id&&item.status==="accepted").length;if(["editorial-approved","rights-approved","publication-approved"].includes(record.status)){record.status="needs-changes";record.editorial_approved_at=null;record.rights_approved_at=null;record.publication_approved_at=null;}}workspace.comments.unshift({id:`demo-comment-${Date.now()}`,project_id:"demo-project",review_record_id:row.review_record_id,field_path:row.field_path,comment_type:"note",body:`Proposta substituída: ${rationale}`,blocking:false,resolved:false,created_by:this.state.session.user.id,created_at:new Date().toISOString()});});return;
    }
    const{error}=await this.client.rpc("collab_supersede_museum_proposal_08f",{p_proposal_id:proposalId,p_rationale:rationale});if(error)throw error;await this.refreshMuseumReview();
  }

  async addMuseumReviewComment(reviewRecordId,payload){
    if(!hasPermission(this.state,"museum.review.comment"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoMuseumReviewUpdate(workspace=>{workspace.comments.unshift({id:`demo-comment-${Date.now()}`,project_id:"demo-project",review_record_id:reviewRecordId,field_path:payload.fieldPath||null,comment_type:payload.commentType||"note",body:payload.body,blocking:Boolean(payload.blocking)||payload.commentType==="blocking",resolved:false,created_by:this.state.session.user.id,created_at:new Date().toISOString()});const record=workspace.records.find(item=>item.id===reviewRecordId);if(record){record.blocking_comment_count=workspace.comments.filter(item=>item.review_record_id===reviewRecordId&&item.blocking&&!item.resolved).length;if(payload.blocking||payload.commentType==="blocking")record.status="needs-changes";}});return;
    }
    const{error}=await this.client.rpc("collab_add_museum_review_comment_08f",{p_review_record_id:reviewRecordId,p_field_path:payload.fieldPath||null,p_comment_type:payload.commentType||"note",p_body:payload.body,p_blocking:Boolean(payload.blocking)});if(error)throw error;await this.refreshMuseumReview();
  }

  async resolveMuseumReviewComment(commentId,resolution){
    if(!hasPermission(this.state,"museum.review.comment"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoMuseumReviewUpdate(workspace=>{const comment=workspace.comments.find(item=>item.id===commentId);if(!comment)throw new Error("Comentário não encontrado.");comment.resolved=true;comment.resolved_by=this.state.session.user.id;comment.resolved_at=new Date().toISOString();comment.body+=`\\n\\nResolução: ${resolution}`;const record=workspace.records.find(item=>item.id===comment.review_record_id);if(record)record.blocking_comment_count=workspace.comments.filter(item=>item.review_record_id===record.id&&item.blocking&&!item.resolved).length;});return;
    }
    const{error}=await this.client.rpc("collab_resolve_museum_review_comment_08f",{p_comment_id:commentId,p_resolution:resolution});if(error)throw error;await this.refreshMuseumReview();
  }

  async assignMuseumReview(reviewRecordId,userId,assignmentRole){
    if(!hasPermission(this.state,"museum.review.assign"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoMuseumReviewUpdate(workspace=>{workspace.assignments.unshift({id:`demo-review-assignment-${Date.now()}`,project_id:"demo-project",review_record_id:reviewRecordId,user_id:userId,assignment_role:assignmentRole,status:"active",assigned_by:this.state.session.user.id,assigned_at:new Date().toISOString()});const record=workspace.records.find(item=>item.id===reviewRecordId);if(record){if(assignmentRole==="editorial")record.assigned_editor=userId;if(assignmentRole==="research")record.assigned_researcher=userId;if(assignmentRole==="rights")record.assigned_rights_reviewer=userId;if(assignmentRole==="translation")record.assigned_translator=userId;if(record.status==="not-started")record.status="in-progress";}});return;
    }
    const{error}=await this.client.rpc("collab_assign_museum_review_08f",{p_review_record_id:reviewRecordId,p_user_id:userId,p_assignment_role:assignmentRole});if(error)throw error;await this.refreshMuseumReview();
  }

  async setMuseumReviewCheck(reviewRecordId,checkType,status,note=""){
    if(!hasPermission(this.state,"museum.review.check"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoMuseumReviewUpdate(workspace=>{const row=workspace.checks.find(item=>item.review_record_id===reviewRecordId&&item.check_type===checkType);if(!row)throw new Error("Check não encontrado.");row.status=status;row.note=note;row.checked_by=this.state.session.user.id;row.checked_at=["passed","failed","not-applicable"].includes(status)?new Date().toISOString():null;row.updated_at=new Date().toISOString();});return;
    }
    const{error}=await this.client.rpc("collab_set_museum_review_check_08f",{p_review_record_id:reviewRecordId,p_check_type:checkType,p_status:status,p_note:note||null});if(error)throw error;await this.refreshMuseumReview();
  }

  demoReviewGates(reviewRecordId,decisionType){
    const mapping={"editorial-approve":["editorial","source","relations","accessibility"],"rights-approve":["rights","digital-intervention"],"publication-approve":["publication","translation"]};
    const missing=(mapping[decisionType]||[]).filter(type=>!this.state.museumReviewWorkspace.checks.some(item=>item.review_record_id===reviewRecordId&&item.check_type===type&&["passed","not-applicable"].includes(item.status)));
    const blockers=this.state.museumReviewWorkspace.comments.filter(item=>item.review_record_id===reviewRecordId&&item.blocking&&!item.resolved).length;
    const submitted=this.state.museumReviewWorkspace.proposals.filter(item=>item.review_record_id===reviewRecordId&&["draft","submitted"].includes(item.status)).length;
    return{missingChecks:missing,blockingComments:blockers,openProposals:submitted,passed:!missing.length&&!blockers&&!submitted};
  }

  async decideMuseumReview(reviewRecordId,decisionType,rationale){
    const permission={"editorial-approve":"museum.review.editorial-approve","rights-approve":"museum.review.rights-approve","publication-approve":"museum.review.publication-approve",incorporate:"museum.review.apply"}[decisionType]||"museum.review.check";
    if(!hasPermission(this.state,permission))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      if(["editorial-approve","rights-approve","publication-approve"].includes(decisionType)){this.assertDemoTraining(decisionType);const gates=this.demoReviewGates(reviewRecordId,decisionType);if(!gates.passed)throw new Error(`Gates pendentes: ${[...gates.missingChecks,gates.blockingComments?"comentários bloqueantes":"",gates.openProposals?"propostas abertas":""].filter(Boolean).join(", ")}`);}
      this.demoMuseumReviewUpdate(workspace=>{const row=workspace.records.find(item=>item.id===reviewRecordId);if(!row)throw new Error("Registo não encontrado.");if(decisionType==="rights-approve"&&!row.editorial_approved_at)throw new Error("Aprovação editorial necessária.");if(decisionType==="publication-approve"&&!row.rights_approved_at)throw new Error("Aprovação de direitos necessária.");if(decisionType==="publication-approve"){const publicationProposal=workspace.proposals.find(item=>item.review_record_id===reviewRecordId&&item.field_path==="/publication"&&item.status==="accepted");const eligible=row.public_release_eligible||publicationProposal?.proposed_value?.publicReleaseEligible===true;const disclosureOk=!row.requires_ai_disclosure||(publicationProposal?.proposed_value?.reviewNotice==="ai-substantive-intervention"&&publicationProposal?.proposed_value?.publicReleaseEligible===true);if(!eligible||!disclosureOk)throw new Error("Elegibilidade pública e divulgação de IA ainda não foram aprovadas.");}if(decisionType==="incorporate"&&!row.publication_approved_at)throw new Error("Aprovação de publicação necessária.");const next={"editorial-approve":"editorial-approved","rights-approve":"rights-approved","publication-approve":"publication-approved","request-changes":"needs-changes",reopen:"in-progress",incorporate:"incorporated"}[decisionType];row.status=next;if(decisionType==="editorial-approve")row.editorial_approved_at=new Date().toISOString();if(decisionType==="rights-approve")row.rights_approved_at=new Date().toISOString();if(decisionType==="publication-approve")row.publication_approved_at=new Date().toISOString();if(decisionType==="incorporate")row.incorporated_at=new Date().toISOString();row.updated_at=new Date().toISOString();workspace.decisions.unshift({id:`demo-decision-${Date.now()}`,project_id:"demo-project",review_record_id:reviewRecordId,decision_type:decisionType,rationale,decision_data:{demo:true},decided_by:this.state.session.user.id,decided_at:new Date().toISOString()});});return;
    }
    const{error}=await this.client.rpc("collab_decide_museum_review_08f",{p_review_record_id:reviewRecordId,p_decision_type:decisionType,p_rationale:rationale});if(error)throw error;await this.refreshMuseumReview();
  }

  async linkContributionToMuseumReview(reviewRecordId,contributionId,linkType,note=""){
    if(!hasPermission(this.state,"museum.review.link-contribution"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoMuseumReviewUpdate(workspace=>{workspace.contributionLinks.push({id:`demo-link-${Date.now()}`,project_id:"demo-project",review_record_id:reviewRecordId,contribution_id:contributionId,link_type:linkType,note,linked_by:this.state.session.user.id,linked_at:new Date().toISOString()});const row=workspace.records.find(item=>item.id===reviewRecordId);if(row)row.linked_contribution_count=workspace.contributionLinks.filter(item=>item.review_record_id===reviewRecordId).length;});return;
    }
    const{error}=await this.client.rpc("collab_link_contribution_to_museum_review_08f",{p_review_record_id:reviewRecordId,p_contribution_id:contributionId,p_link_type:linkType,p_note:note||null});if(error)throw error;await this.refreshMuseumReview();
  }

  async savePublicContentEffect(effectId,payload){
    if(!hasPermission(this.state,"museum.review.effects.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoMuseumReviewUpdate(workspace=>{const id=effectId||`demo-effect-${Date.now()}`,row=workspace.effects.find(item=>item.id===id),next={id,project_id:"demo-project",cycle_id:payload.cycleId||null,effect_code:payload.effectCode,slot_code:payload.slotCode,effect_type:payload.effectType||"memory-highlight",title:payload.title||{},description:payload.description||{},memory_ids:payload.memoryIds||[],enabled:Boolean(payload.enabled),status:payload.status||"draft",starts_at:payload.startsAt||null,ends_at:payload.endsAt||null,created_by:this.state.session.user.id,created_at:row?.created_at||new Date().toISOString(),updated_at:new Date().toISOString()};if(next.enabled&&!["approved","published"].includes(next.status))throw new Error("O efeito precisa estar aprovado.");for(const memoryId of next.memory_ids){if(!workspace.records.some(item=>item.memory_id===memoryId&&item.publication_approved_at))throw new Error(`Memória sem aprovação de publicação: ${memoryId}`);}if(row)Object.assign(row,next);else workspace.effects.unshift(next);});return;
    }
    const{error}=await this.client.rpc("collab_upsert_public_content_effect_08f",{p_effect_id:effectId||null,p_payload:payload});if(error)throw error;await this.refreshMuseumReview();
  }

  async generateMuseumReviewSnapshot(cycleId,version="0.38.0"){
    if(!hasPermission(this.state,"museum.review.export"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      const workspace=this.state.museumReviewWorkspace,cycle=workspace.cycles.find(item=>item.id===cycleId);if(!cycle)throw new Error("Ciclo não encontrado.");
      const records=workspace.records.filter(item=>item.cycle_id===cycleId&&item.publication_approved_at).map(record=>({memoryId:record.memory_id,baseHash:record.source_record_hash,status:record.status,patches:workspace.proposals.filter(item=>item.review_record_id===record.id&&item.status==="accepted").map(item=>({path:item.field_path,value:item.proposed_value,rationale:item.rationale,sourceIds:item.source_ids,contributionIds:item.contribution_ids})),approvals:{editorialApprovedAt:record.editorial_approved_at,rightsApprovedAt:record.rights_approved_at,publicationApprovedAt:record.publication_approved_at}}));
      const payload={version,cycleCode:cycle.code,generatedAt:new Date().toISOString(),sourceDatasetVersion:cycle.source_dataset_version,sourceDatasetHash:cycle.source_dataset_hash,completeCycle:workspace.records.every(item=>["publication-approved","incorporated","closed"].includes(item.status)),records,effects:workspace.effects.filter(item=>item.cycle_id===cycleId&&["approved","published"].includes(item.status)).map(item=>({effectCode:item.effect_code,slotCode:item.slot_code,effectType:item.effect_type,title:item.title,description:item.description,memoryIds:item.memory_ids,enabled:item.enabled,status:item.status,startsAt:item.starts_at,endsAt:item.ends_at}))};
      const snapshot={id:`demo-snapshot-${Date.now()}`,project_id:"demo-project",cycle_id:cycleId,version,source_dataset_hash:cycle.source_dataset_hash,payload,payload_hash:`demo-${Date.now()}`,status:"validated",generated_by:this.state.session.user.id,generated_at:new Date().toISOString()};this.demoMuseumReviewUpdate(current=>current.snapshots.unshift(snapshot));return snapshot;
    }
    const{data,error}=await this.client.rpc("collab_generate_museum_review_snapshot_08f",{p_cycle_id:cycleId,p_version:version});if(error)throw error;await this.refreshMuseumReview();return data;
  }

  async approveMuseumReviewSnapshot(snapshotId,confirmation){
    if(!hasPermission(this.state,"museum.review.apply"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      if(confirmation!=="APPROVE_MUSEUM_EDITORIAL_SNAPSHOT")throw new Error("Confirmação literal obrigatória.");
      this.demoMuseumReviewUpdate(workspace=>{const row=workspace.snapshots.find(item=>item.id===snapshotId&&item.status==="validated");if(!row)throw new Error("Snapshot indisponível.");row.status="approved";row.approved_by=this.state.session.user.id;row.approved_at=new Date().toISOString();});return;
    }
    const{error}=await this.client.rpc("collab_approve_museum_review_snapshot_08f",{p_snapshot_id:snapshotId,p_confirmation:confirmation});if(error)throw error;await this.refreshMuseumReview();
  }


  demoDeploymentUpdate(mutator){
    const deploymentWorkspace=structuredClone(this.state.deploymentWorkspace);
    mutator(deploymentWorkspace);
    this.persistDemo({deploymentWorkspace});
  }

  async refreshDeployment(){
    if(this.config.mode==="supabase"){
      await this.loadRemoteDeployment();
      this.emit();
    }
  }

  async saveDeploymentEnvironment(values){
    if(!hasPermission(this.state,"deployment.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoDeploymentUpdate(workspace=>{
        let row=workspace.environments.find(item=>item.code===values.code);
        const next={
          id:row?.id||`demo-environment-${values.code}`,project_id:"demo-project",
          code:values.code,name:values.name,status:values.status,
          site_url:values.siteUrl||null,supabase_project_ref:values.projectRef||null,
          auth_callback_url:values.authCallbackUrl||null,
          is_production:values.code==="production",
          allows_reset:values.code!=="production",allows_demo:values.code==="local",
          metadata:values.metadata||{},updated_by:this.state.session.user.id,
          updated_at:new Date().toISOString()
        };
        if(values.code!=="local"&&next.site_url&&!next.site_url.startsWith("https://"))throw new Error("HTTPS obrigatório fora do ambiente local.");
        if(row)Object.assign(row,next);else workspace.environments.push(next);
      });
      return;
    }
    const{error}=await this.client.rpc("collab_upsert_deployment_environment_08g",{
      p_code:values.code,p_name:values.name,p_status:values.status,
      p_site_url:values.siteUrl||null,p_supabase_project_ref:values.projectRef||null,
      p_auth_callback_url:values.authCallbackUrl||null,p_metadata:values.metadata||{}
    });
    if(error)throw error;
    await this.refreshDeployment();
  }

  async saveAuthPolicy(values){
    if(!hasPermission(this.state,"auth.policy.manage"))throw new Error("Permissão insuficiente.");
    const domains=(values.allowedEmailDomains||[]).map(item=>String(item).trim().toLowerCase()).filter(Boolean);
    if(this.config.mode==="demo"){
      this.demoDeploymentUpdate(workspace=>{
        workspace.authPolicy={
          ...(workspace.authPolicy||{}),project_id:"demo-project",provider:"google",
          google_enabled:Boolean(values.googleEnabled),require_preauthorization:true,
          allowed_email_domains:[...new Set(domains)],store_provider_tokens:false,
          minimum_active_masters:1,session_expiry_minutes:Number(values.sessionExpiryMinutes||60),
          policy_status:values.policyStatus||"draft",updated_by:this.state.session.user.id,
          updated_at:new Date().toISOString()
        };
      });
      return;
    }
    const{error}=await this.client.rpc("collab_upsert_auth_policy_08g",{
      p_google_enabled:Boolean(values.googleEnabled),
      p_allowed_email_domains:domains,
      p_session_expiry_minutes:Number(values.sessionExpiryMinutes||60),
      p_policy_status:values.policyStatus||"draft"
    });
    if(error)throw error;
    await this.refreshDeployment();
  }

  async startHomologation(environmentCode,version,commitSha=""){
    if(!hasPermission(this.state,"homologation.run"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoDeploymentUpdate(workspace=>{
        const environment=workspace.environments.find(item=>item.code===environmentCode);
        if(!environment)throw new Error("Ambiente não encontrado.");
        if(workspace.runs.some(item=>item.environment_id===environment.id&&["planned","in-progress","blocked"].includes(item.status)))throw new Error("Já existe uma homologação ativa.");
        const runId=`demo-homologation-${Date.now()}`;
        workspace.runs.unshift({
          id:runId,project_id:"demo-project",environment_id:environment.id,
          version,commit_sha:commitSha||null,status:"in-progress",summary:null,
          started_by:this.state.session.user.id,started_at:new Date().toISOString(),
          created_at:new Date().toISOString(),updated_at:new Date().toISOString()
        });
        workspace.checks.push(...workspace.catalog.map(item=>({
          id:`demo-check-${runId}-${item.code}`,project_id:"demo-project",run_id:runId,
          check_code:item.code,category:item.category,title:item.title,
          blocking:Boolean(item.blocking),status:"pending",evidence:null,note:null,
          checked_by:null,checked_at:null,updated_at:new Date().toISOString()
        })));
        environment.status="testing";environment.updated_at=new Date().toISOString();
      });
      return;
    }
    const{error}=await this.client.rpc("collab_start_homologation_08g",{
      p_environment_code:environmentCode,p_version:version,p_commit_sha:commitSha||null
    });
    if(error)throw error;
    await this.refreshDeployment();
  }

  async recordHomologationCheck(runId,checkCode,status,evidence="",note=""){
    if(!hasPermission(this.state,"homologation.check"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoDeploymentUpdate(workspace=>{
        const run=workspace.runs.find(item=>item.id===runId);
        if(!run||!["in-progress","blocked"].includes(run.status))throw new Error("Execução indisponível.");
        const check=workspace.checks.find(item=>item.run_id===runId&&item.check_code===checkCode);
        if(!check)throw new Error("Check não encontrado.");
        check.status=status;check.evidence=evidence||null;check.note=note||null;
        check.checked_by=this.state.session.user.id;
        check.checked_at=["passed","failed","blocked","not-applicable"].includes(status)?new Date().toISOString():null;
        check.updated_at=new Date().toISOString();
        run.status=workspace.checks.some(item=>item.run_id===runId&&item.blocking&&["failed","blocked"].includes(item.status))?"blocked":"in-progress";
        run.updated_at=new Date().toISOString();
      });
      return;
    }
    const{error}=await this.client.rpc("collab_record_homologation_check_08g",{
      p_run_id:runId,p_check_code:checkCode,p_status:status,
      p_evidence:evidence||null,p_note:note||null
    });
    if(error)throw error;
    await this.refreshDeployment();
  }

  async completeHomologation(runId,summary){
    if(!hasPermission(this.state,"homologation.run"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoDeploymentUpdate(workspace=>{
        const run=workspace.runs.find(item=>item.id===runId);
        if(!run||!["in-progress","blocked"].includes(run.status))throw new Error("Execução indisponível.");
        const checks=workspace.checks.filter(item=>item.run_id===runId);
        const open=checks.filter(item=>item.blocking&&["pending","running"].includes(item.status));
        if(open.length)throw new Error(`Existem ${open.length} checks bloqueantes por concluir.`);
        run.status=checks.some(item=>item.blocking&&["failed","blocked"].includes(item.status))?"failed":"passed";
        run.summary=summary;run.completed_by=this.state.session.user.id;
        run.completed_at=new Date().toISOString();run.updated_at=new Date().toISOString();
      });
      return;
    }
    const{error}=await this.client.rpc("collab_complete_homologation_08g",{
      p_run_id:runId,p_summary:summary
    });
    if(error)throw error;
    await this.refreshDeployment();
  }

  async approveHomologation(runId,confirmation){
    if(!hasPermission(this.state,"homologation.approve"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoDeploymentUpdate(workspace=>{
        const run=workspace.runs.find(item=>item.id===runId&&item.status==="passed");
        if(!run)throw new Error("Execução aprovada tecnicamente não encontrada.");
        const environment=workspace.environments.find(item=>item.id===run.environment_id);
        const expected=environment?.code==="production"?"APPROVE_MILREU_PRODUCTION_RELEASE":"APPROVE_MILREU_HOMOLOGATION";
        if(confirmation!==expected)throw new Error("Confirmação literal obrigatória.");
        if(environment?.code==="production"&&!workspace.runs.some(item=>{
          const env=workspace.environments.find(environmentRow=>environmentRow.id===item.environment_id);
          return env?.code==="staging"&&item.version===run.version&&item.status==="approved";
        }))throw new Error("Homologação de staging aprovada é obrigatória.");
        run.status="approved";run.approved_by=this.state.session.user.id;
        run.approved_at=new Date().toISOString();run.updated_at=new Date().toISOString();
        if(environment){environment.status="homologated";environment.last_verified_at=new Date().toISOString();}
      });
      return;
    }
    const{error}=await this.client.rpc("collab_approve_homologation_08g",{
      p_run_id:runId,p_confirmation:confirmation
    });
    if(error)throw error;
    await this.refreshDeployment();
  }

  async cancelHomologation(runId,reason){
    if(!hasPermission(this.state,"homologation.cancel"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoDeploymentUpdate(workspace=>{
        const run=workspace.runs.find(item=>item.id===runId);
        if(!run)throw new Error("Execução não encontrada.");
        run.status="cancelled";run.summary=reason;run.cancelled_at=new Date().toISOString();
        run.updated_at=new Date().toISOString();
      });
      return;
    }
    const{error}=await this.client.rpc("collab_cancel_homologation_08g",{
      p_run_id:runId,p_reason:reason
    });
    if(error)throw error;
    await this.refreshDeployment();
  }


  demoNotificationUpdate(mutator){
    const notificationWorkspace=structuredClone(this.state.notificationWorkspace);
    mutator(notificationWorkspace);
    notificationWorkspace.summary={
      unreadCount:notificationWorkspace.notifications.filter(item=>item.status==="unread").length,
      criticalUnreadCount:notificationWorkspace.notifications.filter(item=>item.status==="unread"&&item.severity==="critical").length,
      byCategory:notificationWorkspace.notifications.filter(item=>item.status==="unread").reduce((acc,item)=>{
        const category=this.state.notificationModel.eventTypes.find(event=>event.code===item.event_type)?.category||"other";
        acc[category]=(acc[category]||0)+1;return acc;
      },{})
    };
    this.persistDemo({notificationWorkspace});
  }

  async refreshNotifications(){
    if(this.config.mode==="supabase"){await this.loadRemoteNotifications();this.emit();}
  }

  async markNotification(notificationId,action){
    if(!hasPermission(this.state,"notifications.mark"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoNotificationUpdate(workspace=>{
        const row=workspace.notifications.find(item=>item.id===notificationId);
        if(!row)throw new Error("Notificação não encontrada.");
        if(action==="read"){row.status="read";row.read_at=row.read_at||new Date().toISOString();row.archived_at=null;}
        else if(action==="unread"){row.status="unread";row.read_at=null;row.archived_at=null;}
        else if(action==="archive"){row.status="archived";row.archived_at=new Date().toISOString();}
        else throw new Error("Ação inválida.");
      });
      return;
    }
    const{error}=await this.client.rpc("collab_mark_notification_08h",{p_notification_id:notificationId,p_action:action});
    if(error)throw error;
    await this.refreshNotifications();
  }

  async markAllNotificationsRead(){
    if(!hasPermission(this.state,"notifications.mark"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoNotificationUpdate(workspace=>{
        for(const row of workspace.notifications){
          if(row.status==="unread"){row.status="read";row.read_at=new Date().toISOString();}
        }
      });
      return;
    }
    const{error}=await this.client.rpc("collab_mark_all_notifications_read_08h");
    if(error)throw error;
    await this.refreshNotifications();
  }


  async saveNotificationPreferences(valuesList){
    if(!hasPermission(this.state,"notifications.preferences"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoNotificationUpdate(workspace=>{
        for(const values of valuesList){
          const event=this.state.notificationModel.eventTypes.find(item=>item.code===values.eventType);
          if(!event)throw new Error(`Tipo de notificação não encontrado: ${values.eventType}`);
          if(event.mandatoryInApp&&!values.inAppEnabled)throw new Error("Um aviso obrigatório foi desativado.");
          let row=workspace.preferences.find(item=>item.event_type===values.eventType&&item.user_id===this.state.session.user.id);
          const next={
            project_id:"demo-project",user_id:this.state.session.user.id,event_type:values.eventType,
            in_app_enabled:event.mandatoryInApp?true:Boolean(values.inAppEnabled),
            email_enabled:Boolean(values.emailEnabled),
            quiet_hours_start:values.quietHoursStart||null,
            quiet_hours_end:values.quietHoursEnd||null,
            timezone:values.timezone||"Europe/Lisbon",
            language:values.language||"pt-PT",updated_at:new Date().toISOString()
          };
          if(row)Object.assign(row,next);else workspace.preferences.push(next);
        }
      });
      return;
    }
    for(const values of valuesList){
      const{error}=await this.client.rpc("collab_update_notification_preference_08h",{
        p_event_type:values.eventType,
        p_in_app_enabled:Boolean(values.inAppEnabled),
        p_email_enabled:Boolean(values.emailEnabled),
        p_quiet_hours_start:values.quietHoursStart||null,
        p_quiet_hours_end:values.quietHoursEnd||null,
        p_timezone:values.timezone||"Europe/Lisbon",
        p_language:values.language||"pt-PT"
      });
      if(error)throw error;
    }
    await this.refreshNotifications();
  }

  async saveNotificationPreference(values){
    if(!hasPermission(this.state,"notifications.preferences"))throw new Error("Permissão insuficiente.");
    const event=this.state.notificationModel.eventTypes.find(item=>item.code===values.eventType);
    if(!event)throw new Error("Tipo de notificação não encontrado.");
    if(event.mandatoryInApp&&!values.inAppEnabled)throw new Error("Este aviso interno é obrigatório.");
    if(values.emailEnabled&&!event.emailAllowed)throw new Error("O e-mail não está disponível para este evento.");
    if(Boolean(values.quietHoursStart)!==Boolean(values.quietHoursEnd))throw new Error("Defina o início e o fim do horário silencioso.");
    if(this.config.mode==="demo"){
      this.demoNotificationUpdate(workspace=>{
        let row=workspace.preferences.find(item=>item.event_type===values.eventType&&item.user_id===this.state.session.user.id);
        const next={
          project_id:"demo-project",user_id:this.state.session.user.id,event_type:values.eventType,
          in_app_enabled:event.mandatoryInApp?true:Boolean(values.inAppEnabled),
          email_enabled:Boolean(values.emailEnabled),
          quiet_hours_start:values.quietHoursStart||null,
          quiet_hours_end:values.quietHoursEnd||null,
          timezone:values.timezone||"Europe/Lisbon",
          language:values.language||"pt-PT",updated_at:new Date().toISOString()
        };
        if(row)Object.assign(row,next);else workspace.preferences.push(next);
      });
      return;
    }
    const{error}=await this.client.rpc("collab_update_notification_preference_08h",{
      p_event_type:values.eventType,
      p_in_app_enabled:Boolean(values.inAppEnabled),
      p_email_enabled:Boolean(values.emailEnabled),
      p_quiet_hours_start:values.quietHoursStart||null,
      p_quiet_hours_end:values.quietHoursEnd||null,
      p_timezone:values.timezone||"Europe/Lisbon",
      p_language:values.language||"pt-PT"
    });
    if(error)throw error;
    await this.refreshNotifications();
  }

  async saveNotificationTemplate(templateId,values){
    if(!hasPermission(this.state,"notifications.templates.manage"))throw new Error("Permissão insuficiente.");
    const allowedTokens=this.state.notificationModel.templateTokens||[];
    const combined=`${values.subjectTemplate} ${values.titleTemplate} ${values.bodyTextTemplate}`;
    const used=[...combined.matchAll(/\{\{([a-z_][a-z0-9_]*)\}\}/g)].map(match=>match[1]);
    const unknown=used.filter(token=>!allowedTokens.includes(token));
    if(unknown.length)throw new Error(`Tokens não permitidos: ${[...new Set(unknown)].join(", ")}`);
    if(this.config.mode==="demo"){
      this.demoNotificationUpdate(workspace=>{
        if(templateId){
          const existing=workspace.operations.templates.find(item=>item.id===templateId);
          if(!existing)throw new Error("Template não encontrado.");
          if(["approved","retired"].includes(existing.status))throw new Error("Templates publicados são imutáveis.");
          Object.assign(existing,{
            subjectTemplate:values.subjectTemplate,titleTemplate:values.titleTemplate,
            bodyTextTemplate:values.bodyTextTemplate,allowedTokens,status:values.status,
            updatedAt:new Date().toISOString()
          });
        }else{
          const previous=workspace.operations.templates.filter(item=>item.eventType===values.eventType&&item.language===values.language);
          if(values.status==="approved")for(const item of previous)if(item.status==="approved")item.status="retired";
          workspace.operations.templates.push({
            id:`demo-template-${Date.now()}`,eventType:values.eventType,channel:"email",
            language:values.language||"pt-PT",version:Math.max(0,...previous.map(item=>item.version||0))+1,
            status:values.status,subjectTemplate:values.subjectTemplate,titleTemplate:values.titleTemplate,
            bodyTextTemplate:values.bodyTextTemplate,allowedTokens,updatedAt:new Date().toISOString()
          });
        }
      });
      return;
    }
    const{error}=await this.client.rpc("collab_upsert_notification_template_08h",{
      p_template_id:templateId||null,
      p_event_type:values.eventType,
      p_language:values.language||"pt-PT",
      p_subject_template:values.subjectTemplate,
      p_title_template:values.titleTemplate,
      p_body_text_template:values.bodyTextTemplate,
      p_allowed_tokens:allowedTokens,
      p_status:values.status
    });
    if(error)throw error;
    await this.refreshNotifications();
  }

  async updateNotificationChannel(values){
    if(!hasPermission(this.state,"notifications.channel.manage"))throw new Error("Permissão insuficiente.");
    if(values.channel==="email"&&values.status==="active"){
      if(values.provider==="disabled")throw new Error("Configure um fornecedor antes de ativar o e-mail.");
      if(values.confirmation!=="ACTIVATE_MILREU_TRANSACTIONAL_EMAIL")throw new Error("Confirmação literal obrigatória.");
      if(!values.fromEmail)throw new Error("O remetente é obrigatório.");
    }
    if(this.config.mode==="demo"){
      this.demoNotificationUpdate(workspace=>{
        let row=workspace.channels.find(item=>item.channel===values.channel);
        const next={
          project_id:"demo-project",channel:values.channel,status:values.status,
          provider:values.provider,from_name:values.fromName||null,
          from_email:values.fromEmail||null,settings:values.settings||{},
          updated_at:new Date().toISOString()
        };
        if(row)Object.assign(row,next);else workspace.channels.push(next);
        workspace.operations.channels=workspace.channels.map(channel=>({
          ...channel,fromEmailConfigured:Boolean(channel.from_email),from_email:undefined
        }));
      });
      return;
    }
    const{error}=await this.client.rpc("collab_update_notification_channel_08h",{
      p_channel:values.channel,p_status:values.status,p_provider:values.provider,
      p_from_name:values.fromName||null,p_from_email:values.fromEmail||null,
      p_settings:values.settings||{},p_confirmation:values.confirmation||null
    });
    if(error)throw error;
    await this.refreshNotifications();
  }

  async sendTestNotification(targetUserId,eventType="task.assigned",includeEmail=false){
    if(!hasPermission(this.state,"notifications.test"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoNotificationUpdate(workspace=>{
        if(targetUserId!==this.state.session.user.id&&targetUserId!=="demo-master"&&targetUserId!=="demo-volunteer")throw new Error("Membro de teste não encontrado.");
        if(targetUserId===this.state.session.user.id){
          workspace.notifications.unshift({
            id:`demo-notification-${Date.now()}`,project_id:"demo-project",user_id:targetUserId,
            event_type:eventType,entity_type:"test",entity_id:"08H",
            title:"Notificação de teste",body:"Esta notificação confirma o funcionamento do centro interno.",
            action_url:"#/area-colaborativa/notificacoes",severity:"info",status:"unread",
            metadata:{demo:true},created_at:new Date().toISOString(),
            expires_at:new Date(Date.now()+365*24*60*60*1000).toISOString()
          });
        }
        if(includeEmail){
          const channel=workspace.channels.find(item=>item.channel==="email");
          if(channel?.status!=="active")throw new Error("O canal de e-mail não está ativo.");
          workspace.operations.recentOutbox.unshift({
            id:`demo-outbox-${Date.now()}`,eventType,recipientKind:"user",
            recipient:`membro:${String(targetUserId).slice(0,8)}`,status:"pending",
            attempts:0,maxAttempts:5,availableAt:new Date().toISOString(),
            lastError:null,createdAt:new Date().toISOString()
          });
          workspace.operations.outboxCounts.pending=(workspace.operations.outboxCounts.pending||0)+1;
        }
      });
      return;
    }
    const{error}=await this.client.rpc("collab_send_test_notification_08h",{
      p_target_user_id:targetUserId,p_event_type:eventType,p_include_email:Boolean(includeEmail)
    });
    if(error)throw error;
    await this.refreshNotifications();
  }

  async queueInvitationEmail(invitationId){
    if(!hasPermission(this.state,"notifications.invitation-email"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoNotificationUpdate(workspace=>{
        const channel=workspace.channels.find(item=>item.channel==="email");
        if(channel?.status!=="active")throw new Error("O canal de e-mail não está ativo.");
        workspace.operations.recentOutbox.unshift({
          id:`demo-invitation-outbox-${Date.now()}`,eventType:"invitation.created",
          recipientKind:"email",recipient:"c***@local.invalid",status:"pending",
          attempts:0,maxAttempts:5,availableAt:new Date().toISOString(),
          lastError:null,createdAt:new Date().toISOString()
        });
        workspace.operations.outboxCounts.pending=(workspace.operations.outboxCounts.pending||0)+1;
      });
      return;
    }
    const{error}=await this.client.rpc("collab_queue_invitation_email_08h",{p_invitation_id:invitationId});
    if(error)throw error;
    await this.refreshNotifications();
  }

  async retryNotificationOutbox(outboxId){
    if(!hasPermission(this.state,"notifications.outbox.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoNotificationUpdate(workspace=>{
        const row=workspace.operations.recentOutbox.find(item=>item.id===outboxId);
        if(!row||!["failed","dead-letter"].includes(row.status))throw new Error("Entrega não disponível para repetição.");
        row.status="pending";row.availableAt=new Date().toISOString();row.lastError=null;
      });
      return;
    }
    const{error}=await this.client.rpc("collab_retry_notification_outbox_08h",{p_outbox_id:outboxId});
    if(error)throw error;
    await this.refreshNotifications();
  }

  async cancelNotificationOutbox(outboxId,reason){
    if(!hasPermission(this.state,"notifications.outbox.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoNotificationUpdate(workspace=>{
        const row=workspace.operations.recentOutbox.find(item=>item.id===outboxId);
        if(!row)throw new Error("Entrega não encontrada.");
        row.status="cancelled";row.lastError=`Cancelado: ${reason}`;
      });
      return;
    }
    const{error}=await this.client.rpc("collab_cancel_notification_outbox_08h",{
      p_outbox_id:outboxId,p_reason:reason
    });
    if(error)throw error;
    await this.refreshNotifications();
  }


  demoOperationalUpdate(mutator){
    const operationalWorkspace=structuredClone(this.state.operationalWorkspace);
    mutator(operationalWorkspace);
    operationalWorkspace.summary={
      openCriticalIncidents:operationalWorkspace.incidents.filter(item=>["sev-1","sev-2"].includes(item.severity)&&!["resolved","closed","cancelled"].includes(item.status)).length,
      activeLegalHolds:operationalWorkspace.legalHolds.filter(item=>item.status==="active").length,
      failedBackupVerifications:operationalWorkspace.backupVerifications.filter(item=>item.status==="failed").length,
      latestOperationalStatus:operationalWorkspace.operationalRuns[0]?.status||"not-run",
      auditEvents30Days:operationalWorkspace.audit?.rows?.length||0
    };
    this.persistDemo({operationalWorkspace});
  }

  async refreshOperations(){
    if(this.config.mode==="supabase"){await this.loadRemoteOperations();this.emit();}
  }

  async saveOperationalSetting(values){
    if(!hasPermission(this.state,"operations.settings.manage"))throw new Error("Permissão insuficiente.");
    const raw=JSON.stringify(values.value||{});
    if(/service[_-]?role|secret|password|access[_-]?token|refresh[_-]?token|private[_-]?key|webhook[_-]?token/i.test(raw)){
      throw new Error("Configurações sensíveis não podem ser guardadas nesta área.");
    }
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{
        let row=workspace.settings.find(item=>item.code===values.code);
        const next={code:values.code,category:values.category,value:values.value||{},status:values.status,description:values.description||null,updatedAt:new Date().toISOString()};
        if(row)Object.assign(row,next);else workspace.settings.push(next);
      });
      return;
    }
    const{error}=await this.client.rpc("collab_upsert_operational_setting_08i",{
      p_code:values.code,p_category:values.category,p_value:values.value||{},
      p_status:values.status,p_description:values.description||null
    });
    if(error)throw error;
    await this.refreshOperations();
  }

  async startOperationalRun(environment,version="",commitSha=""){
    if(!hasPermission(this.state,"health.run"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{
        if(workspace.operationalRuns.some(item=>item.environment===environment&&item.status==="running"))throw new Error("Já existe uma execução ativa.");
        const runId=`demo-operational-run-${Date.now()}`;
        workspace.operationalRuns.unshift({id:runId,environment,version:version||null,commitSha:commitSha||null,status:"running",summary:null,startedAt:new Date().toISOString(),completedAt:null});
        workspace.operationalResults.push(...workspace.checkCatalog.map(check=>({id:`demo-result-${runId}-${check.code}`,runId,checkCode:check.code,status:"pending",evidenceReference:null,notes:null,checkedAt:null})));
      });
      return;
    }
    const{error}=await this.client.rpc("collab_start_operational_run_08i",{p_environment:environment,p_version:version||null,p_commit_sha:commitSha||null});
    if(error)throw error;
    await this.refreshOperations();
  }

  async recordOperationalResult(runId,checkCode,status,evidenceReference="",notes=""){
    if(!hasPermission(this.state,"health.check"))throw new Error("Permissão insuficiente.");
    const check=this.state.operationalWorkspace.checkCatalog.find(item=>item.code===checkCode);
    if(check?.evidence_required&&["passed","failed","blocked"].includes(status)&&!evidenceReference.trim())throw new Error("Este check exige evidência.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{
        const row=workspace.operationalResults.find(item=>item.runId===runId&&item.checkCode===checkCode);
        if(!row)throw new Error("Check não encontrado.");
        Object.assign(row,{status,evidenceReference:evidenceReference||null,notes:notes||null,checkedAt:["passed","failed","blocked","not-applicable"].includes(status)?new Date().toISOString():null});
      });
      return;
    }
    const{error}=await this.client.rpc("collab_record_operational_result_08i",{p_run_id:runId,p_check_code:checkCode,p_status:status,p_evidence_reference:evidenceReference||null,p_notes:notes||null});
    if(error)throw error;
    await this.refreshOperations();
  }

  async completeOperationalRun(runId,summary=""){
    if(!hasPermission(this.state,"health.run"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{
        const run=workspace.operationalRuns.find(item=>item.id===runId&&item.status==="running");
        if(!run)throw new Error("Execução ativa não encontrada.");
        const results=workspace.operationalResults.filter(item=>item.runId===runId);
        if(results.some(item=>["pending","running"].includes(item.status)))throw new Error("Existem checks por concluir.");
        const blocking=new Set(workspace.checkCatalog.filter(item=>item.blocking).map(item=>item.code));
        run.status=results.some(item=>item.status==="blocked"||(item.status==="failed"&&blocking.has(item.checkCode)))?"blocked":results.some(item=>item.status==="failed")?"failed":"passed";
        run.summary=summary||null;run.completedAt=new Date().toISOString();
      });
      return;
    }
    const{error}=await this.client.rpc("collab_complete_operational_run_08i",{p_run_id:runId,p_summary:summary||null});
    if(error)throw error;
    await this.refreshOperations();
  }

  async searchAudit(filters={}){
    if(!hasPermission(this.state,"audit.search")&&!hasPermission(this.state,"audit.view"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      const all=this.state.operationalWorkspace.audit?.rows||[];
      const query=String(filters.query||"").toLowerCase();
      const rows=all.filter(item=>(!query||`${item.action} ${item.entityType} ${item.entityId} ${item.actorName}`.toLowerCase().includes(query))&&(!filters.action||item.action===filters.action)&&(!filters.entityType||item.entityType===filters.entityType)&&(!filters.severity||item.severity===filters.severity)&&(!filters.category||item.category===filters.category));
      this.demoOperationalUpdate(workspace=>{workspace.audit={total:rows.length,limit:Number(filters.limit||100),offset:Number(filters.offset||0),rows:rows.slice(Number(filters.offset||0),Number(filters.offset||0)+Number(filters.limit||100))};});
      return;
    }
    const{data,error}=await this.client.rpc("collab_search_audit_08i",{
      p_query:filters.query||null,p_action:filters.action||null,
      p_entity_type:filters.entityType||null,p_severity:filters.severity||null,
      p_category:filters.category||null,p_actor_user_id:filters.actorUserId||null,
      p_from:filters.from||null,p_to:filters.to||null,
      p_limit:Number(filters.limit||100),p_offset:Number(filters.offset||0)
    });
    if(error)throw error;
    this.state.operationalWorkspace.audit=data||{total:0,limit:100,offset:0,rows:[]};
    this.emit();
  }

  async verifyAuditIntegrity(){
    if(!hasPermission(this.state,"audit.integrity"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{workspace.integrity={valid:true,checkedCount:workspace.audit.rows.length,firstBreakId:null,lastHash:workspace.audit.rows[0]?.eventHash||null,verifiedAt:new Date().toISOString()};});
      return;
    }
    const{data,error}=await this.client.rpc("collab_verify_audit_chain_08i",{p_from_id:null,p_to_id:null});
    if(error)throw error;
    this.state.operationalWorkspace.integrity=data;
    this.emit();
  }

  async exportAudit(filters={}){
    if(!hasPermission(this.state,"audit.export"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      const rows=this.state.operationalWorkspace.audit?.rows||[];
      const headers=["id","createdAt","actorName","action","entityType","entityId","category","severity","changedKeys","eventHash"];
      const csv=[headers.join(","),...rows.map(row=>headers.map(key=>`"${String(key==="changedKeys"?(row[key]||[]).join("|"):row[key]??"").replaceAll('"','""')}"`).join(","))].join("\n");
      const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
      const url=URL.createObjectURL(blob),anchor=document.createElement("a");
      anchor.href=url;anchor.download="milreu-auditoria-demo.csv";anchor.click();URL.revokeObjectURL(url);
      return;
    }
    const session=(await this.client.auth.getSession()).data.session;
    if(!session?.access_token)throw new Error("Sessão necessária.");
    const functionUrl=`${String(this.config.supabaseUrl).replace(/\/+$/,"")}/functions/v1/export-collab-audit`;
    const response=await fetch(functionUrl,{
      method:"POST",
      headers:{"Authorization":`Bearer ${session.access_token}`,"Content-Type":"application/json"},
      body:JSON.stringify(filters)
    });
    if(!response.ok)throw new Error((await response.text())||"Falha ao exportar auditoria.");
    const blob=await response.blob(),url=URL.createObjectURL(blob),anchor=document.createElement("a");
    anchor.href=url;anchor.download=response.headers.get("x-milreu-filename")||"milreu-auditoria.csv";anchor.click();URL.revokeObjectURL(url);
  }

  async saveRetentionPolicy(values){
    if(!hasPermission(this.state,"retention.manage"))throw new Error("Permissão insuficiente.");
    if(values.automaticAllowed)throw new Error("A aplicação automática não é suportada.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{
        let row=workspace.retentionPolicies.find(item=>item.code===values.code);
        const next={code:values.code,resource_type:values.resourceType,name:values.name,retention_days:Number(values.retentionDays),action:values.action,automatic_allowed:false,legal_hold_supported:Boolean(values.legalHoldSupported),risk:values.risk,scope_description:values.scopeDescription,status:values.status,updated_at:new Date().toISOString()};
        if(row)Object.assign(row,next);else workspace.retentionPolicies.push(next);
      });
      return;
    }
    const{error}=await this.client.rpc("collab_upsert_retention_policy_08i",{p_code:values.code,p_resource_type:values.resourceType,p_name:values.name,p_retention_days:Number(values.retentionDays),p_action:values.action,p_automatic_allowed:false,p_legal_hold_supported:Boolean(values.legalHoldSupported),p_risk:values.risk,p_scope_description:values.scopeDescription,p_status:values.status});
    if(error)throw error;
    await this.refreshOperations();
  }

  async createLegalHold(values){
    if(!hasPermission(this.state,"legal-holds.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{workspace.legalHolds.unshift({id:`demo-hold-${Date.now()}`,resourceType:values.resourceType,entityId:values.entityId||null,reason:values.reason,status:"active",startsAt:new Date().toISOString(),endsAt:values.endsAt||null,createdAt:new Date().toISOString()});});
      return;
    }
    const{error}=await this.client.rpc("collab_create_legal_hold_08i",{p_resource_type:values.resourceType,p_entity_id:values.entityId||null,p_reason:values.reason,p_ends_at:values.endsAt||null});
    if(error)throw error;
    await this.refreshOperations();
  }

  async releaseLegalHold(holdId,reason){
    if(!hasPermission(this.state,"legal-holds.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{const row=workspace.legalHolds.find(item=>item.id===holdId&&item.status==="active");if(!row)throw new Error("Legal hold ativo não encontrado.");row.status="released";row.releasedAt=new Date().toISOString();row.reason+=`\nLibertação: ${reason}`;});
      return;
    }
    const{error}=await this.client.rpc("collab_release_legal_hold_08i",{p_hold_id:holdId,p_reason:reason});
    if(error)throw error;
    await this.refreshOperations();
  }

  async previewRetention(policyCode,environment){
    if(!hasPermission(this.state,"retention.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{const policy=workspace.retentionPolicies.find(item=>item.code===policyCode&&item.status==="active");if(!policy)throw new Error("Política ativa não encontrada.");if(!["delete","anonymize"].includes(policy.action))throw new Error("A política exige revisão manual.");workspace.lifecycleRuns.unshift({id:`demo-retention-${Date.now()}`,policyCode,environment,mode:"preview",status:"previewed",cutoffAt:new Date(Date.now()-policy.retention_days*86400000).toISOString(),candidateCount:3,affectedCount:0,excludedByHoldCount:workspace.legalHolds.some(item=>item.status==="active"&&item.resourceType===policy.resource_type)?1:0,candidateHash:`demo-${Date.now()}`,summary:{resourceType:policy.resource_type,action:policy.action,retentionDays:policy.retention_days,eligibleCount:2},previewedAt:new Date().toISOString(),approvedAt:null,completedAt:null,errorMessage:null});});
      return;
    }
    const{error}=await this.client.rpc("collab_preview_retention_run_08i",{p_policy_code:policyCode,p_environment:environment});
    if(error)throw error;
    await this.refreshOperations();
  }

  async approveRetention(runId,confirmation){
    if(!hasPermission(this.state,"retention.approve"))throw new Error("Permissão insuficiente.");
    if(confirmation!=="APPROVE_MILREU_RETENTION_RUN")throw new Error("Confirmação literal inválida.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{const row=workspace.lifecycleRuns.find(item=>item.id===runId&&item.status==="previewed");if(!row)throw new Error("Execução não aprovável.");row.status="approved";row.approvedAt=new Date().toISOString();});
      return;
    }
    const{error}=await this.client.rpc("collab_approve_retention_run_08i",{p_run_id:runId,p_confirmation:confirmation});
    if(error)throw error;
    await this.refreshOperations();
  }

  async cancelRetention(runId,reason){
    if(!hasPermission(this.state,"retention.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{const row=workspace.lifecycleRuns.find(item=>item.id===runId);if(!row)throw new Error("Execução não encontrada.");row.status="cancelled";row.errorMessage=`Cancelado: ${reason}`;row.completedAt=new Date().toISOString();});
      return;
    }
    const{error}=await this.client.rpc("collab_cancel_retention_run_08i",{p_run_id:runId,p_reason:reason});
    if(error)throw error;
    await this.refreshOperations();
  }

  async createIncident(values){
    if(!hasPermission(this.state,"incidents.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{const id=`demo-incident-${Date.now()}`,reference=`INC-2026-${String(workspace.incidents.length+1).padStart(3,"0")}`;workspace.incidents.unshift({id,reference,title:values.title,description:values.description,category:values.category,severity:values.severity,status:"open",environment:values.environment,impactSummary:values.impactSummary||null,detectedAt:new Date().toISOString(),acknowledgedAt:null,mitigatedAt:null,resolvedAt:null,closedAt:null,ownerUserId:values.ownerUserId||null,publicSummary:null,updatedAt:new Date().toISOString()});workspace.incidentUpdates.unshift({id:`demo-update-${Date.now()}`,incidentId:id,updateType:"status",body:"Incidente aberto.",statusAfter:"open",createdBy:this.state.session.user.id,createdAt:new Date().toISOString()});});
      return;
    }
    const{error}=await this.client.rpc("collab_create_incident_08i",{p_title:values.title,p_description:values.description,p_category:values.category,p_severity:values.severity,p_environment:values.environment,p_impact_summary:values.impactSummary||null,p_owner_user_id:values.ownerUserId||null});
    if(error)throw error;
    await this.refreshOperations();
  }

  async updateIncident(incidentId,values){
    if(!hasPermission(this.state,"incidents.manage"))throw new Error("Permissão insuficiente.");
    if(["resolved","closed"].includes(values.status)&&!hasPermission(this.state,"incidents.close"))throw new Error("Permissão de fecho necessária.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{const row=workspace.incidents.find(item=>item.id===incidentId);if(!row)throw new Error("Incidente não encontrado.");Object.assign(row,{status:values.status,ownerUserId:values.ownerUserId||null,impactSummary:values.impactSummary||null,publicSummary:values.publicSummary||null,updatedAt:new Date().toISOString()});if(["resolved","closed"].includes(values.status))row.resolvedAt=row.resolvedAt||new Date().toISOString();if(values.status==="closed")row.closedAt=new Date().toISOString();workspace.incidentUpdates.unshift({id:`demo-update-${Date.now()}`,incidentId,updateType:["resolved","closed"].includes(values.status)?"resolution":"status",body:values.updateBody,statusAfter:values.status,createdBy:this.state.session.user.id,createdAt:new Date().toISOString()});});
      return;
    }
    const{error}=await this.client.rpc("collab_update_incident_08i",{p_incident_id:incidentId,p_status:values.status,p_owner_user_id:values.ownerUserId||null,p_impact_summary:values.impactSummary||null,p_public_summary:values.publicSummary||null,p_update_body:values.updateBody});
    if(error)throw error;
    await this.refreshOperations();
  }

  async addIncidentUpdate(incidentId,updateType,body){
    if(!hasPermission(this.state,"incidents.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{workspace.incidentUpdates.unshift({id:`demo-update-${Date.now()}`,incidentId,updateType,body,statusAfter:null,createdBy:this.state.session.user.id,createdAt:new Date().toISOString()});});
      return;
    }
    const{error}=await this.client.rpc("collab_add_incident_update_08i",{p_incident_id:incidentId,p_update_type:updateType,p_body:body});
    if(error)throw error;
    await this.refreshOperations();
  }

  async saveIncidentAction(actionId,incidentId,values){
    if(!hasPermission(this.state,"incidents.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{let row=workspace.incidentActions.find(item=>item.id===actionId);const next={id:actionId||`demo-action-${Date.now()}`,incidentId,title:values.title,description:values.description||null,status:values.status,priority:values.priority,assignedTo:values.assignedTo||null,dueAt:values.dueAt||null,completedAt:values.status==="completed"?new Date().toISOString():null,updatedAt:new Date().toISOString()};if(row)Object.assign(row,next);else workspace.incidentActions.unshift(next);});
      return;
    }
    const{error}=await this.client.rpc("collab_upsert_incident_action_08i",{p_action_id:actionId||null,p_incident_id:incidentId,p_title:values.title,p_description:values.description||null,p_status:values.status,p_priority:values.priority,p_assigned_to:values.assignedTo||null,p_due_at:values.dueAt||null});
    if(error)throw error;
    await this.refreshOperations();
  }

  async saveBackupPlan(planId,values){
    if(!hasPermission(this.state,"backups.manage"))throw new Error("Permissão insuficiente.");
    if(values.responsibleUserId&&values.responsibleUserId===values.secondaryUserId)throw new Error("O responsável secundário deve ser diferente.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{let row=workspace.backupPlans.find(item=>item.id===planId);const next={id:planId||`demo-backup-${Date.now()}`,code:values.code,name:values.name,backupType:values.backupType,provider:values.provider,frequency:values.frequency,retentionDays:Number(values.retentionDays),targetRpoMinutes:values.targetRpoMinutes?Number(values.targetRpoMinutes):null,targetRtoMinutes:values.targetRtoMinutes?Number(values.targetRtoMinutes):null,status:values.status,instructionsReference:values.instructionsReference||null,responsibleUserId:values.responsibleUserId||null,secondaryUserId:values.secondaryUserId||null,lastSuccessfulAt:row?.lastSuccessfulAt||null,nextDueAt:values.nextDueAt||null,updatedAt:new Date().toISOString()};if(row)Object.assign(row,next);else workspace.backupPlans.push(next);});
      return;
    }
    const{error}=await this.client.rpc("collab_upsert_backup_plan_08i",{p_plan_id:planId||null,p_code:values.code,p_name:values.name,p_backup_type:values.backupType,p_provider:values.provider,p_frequency:values.frequency,p_retention_days:Number(values.retentionDays),p_target_rpo_minutes:values.targetRpoMinutes?Number(values.targetRpoMinutes):null,p_target_rto_minutes:values.targetRtoMinutes?Number(values.targetRtoMinutes):null,p_status:values.status,p_instructions_reference:values.instructionsReference||null,p_responsible_user_id:values.responsibleUserId||null,p_secondary_user_id:values.secondaryUserId||null,p_next_due_at:values.nextDueAt||null});
    if(error)throw error;
    await this.refreshOperations();
  }

  async recordBackupVerification(planId,values){
    if(!hasPermission(this.state,"backups.verify"))throw new Error("Permissão insuficiente.");
    if(["passed","partial","failed"].includes(values.status)&&!values.evidenceReference?.trim())throw new Error("A evidência é obrigatória.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{workspace.backupVerifications.unshift({id:`demo-verification-${Date.now()}`,planId,status:values.status,backupObservedAt:values.backupObservedAt||null,verifiedAt:new Date().toISOString(),restoreTested:Boolean(values.restoreTested),evidenceReference:values.evidenceReference||null,notes:values.notes||null,verifiedBy:this.state.session.user.id});if(values.status==="passed"){const plan=workspace.backupPlans.find(item=>item.id===planId);if(plan)plan.lastSuccessfulAt=values.backupObservedAt||new Date().toISOString();}});
      return;
    }
    const{error}=await this.client.rpc("collab_record_backup_verification_08i",{p_plan_id:planId,p_status:values.status,p_backup_observed_at:values.backupObservedAt||null,p_restore_tested:Boolean(values.restoreTested),p_evidence_reference:values.evidenceReference||null,p_notes:values.notes||null});
    if(error)throw error;
    await this.refreshOperations();
  }

  async saveContinuityExercise(exerciseId,values){
    if(!hasPermission(this.state,"continuity.manage"))throw new Error("Permissão insuficiente.");
    if(values.status==="completed"&&(!values.resultSummary?.trim()||!values.evidenceReference?.trim()))throw new Error("Um exercício concluído exige resultado e evidência.");
    if(this.config.mode==="demo"){
      this.demoOperationalUpdate(workspace=>{let row=workspace.continuityExercises.find(item=>item.id===exerciseId);const next={id:exerciseId||`demo-exercise-${Date.now()}`,title:values.title,scenario:values.scenario,status:values.status,objectives:values.objectives,scheduledAt:values.scheduledAt||null,startedAt:values.status==="running"?(row?.startedAt||new Date().toISOString()):row?.startedAt||null,completedAt:values.status==="completed"?(row?.completedAt||new Date().toISOString()):null,targetRtoMinutes:values.targetRtoMinutes?Number(values.targetRtoMinutes):null,targetRpoMinutes:values.targetRpoMinutes!==""?Number(values.targetRpoMinutes):null,actualRecoveryMinutes:values.actualRecoveryMinutes!==""?Number(values.actualRecoveryMinutes):null,resultSummary:values.resultSummary||null,evidenceReference:values.evidenceReference||null,coordinatorUserId:values.coordinatorUserId||null,updatedAt:new Date().toISOString()};if(row)Object.assign(row,next);else workspace.continuityExercises.unshift(next);});
      return;
    }
    const{error}=await this.client.rpc("collab_upsert_continuity_exercise_08i",{p_exercise_id:exerciseId||null,p_title:values.title,p_scenario:values.scenario,p_status:values.status,p_objectives:values.objectives,p_scheduled_at:values.scheduledAt||null,p_target_rto_minutes:values.targetRtoMinutes?Number(values.targetRtoMinutes):null,p_target_rpo_minutes:values.targetRpoMinutes!==""?Number(values.targetRpoMinutes):null,p_actual_recovery_minutes:values.actualRecoveryMinutes!==""?Number(values.actualRecoveryMinutes):null,p_result_summary:values.resultSummary||null,p_evidence_reference:values.evidenceReference||null,p_coordinator_user_id:values.coordinatorUserId||null});
    if(error)throw error;
    await this.refreshOperations();
  }

  demoExhibitionUpdate(mutator){const exhibitionWorkspace=structuredClone(this.state.exhibitionWorkspace);mutator(exhibitionWorkspace);this.persistDemo({exhibitionWorkspace});}
  async refreshExhibitions(){if(this.config.mode==="supabase"){await this.loadRemoteExhibitions();this.emit();}}

  async saveVenue(venueId,payload){
    if(!hasPermission(this.state,"venues.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){this.demoExhibitionUpdate(workspace=>{const id=venueId||`demo-venue-${Date.now()}`;let row=workspace.venues.find(item=>item.id===id);const next={id,project_id:"demo-project",...payload,name:payload.name?.trim(),venue_type:payload.venueType||"other",address_text:payload.addressText||null,country_code:payload.countryCode||"PT",postal_code:payload.postalCode||null,contact_name:payload.contactName||null,contact_email:payload.contactEmail||null,public_email:payload.publicEmail||null,public_phone:payload.publicPhone||null,public_url:payload.publicUrl||null,opening_hours:payload.openingHours||null,public_description:payload.publicDescription||null,accessibility_notes:payload.accessibilityNotes||null,accessibility_summary:payload.accessibilitySummary||null,internal_notes:payload.internalNotes||null,public_visibility:Boolean(payload.publicVisibility),active:payload.status!=="archived",updated_at:new Date().toISOString()};if(!next.name)throw new Error("Nome do local é obrigatório.");if(row)Object.assign(row,next);else workspace.venues.push(next);});return;}
    const{error}=await this.client.rpc("collab_upsert_venue_08d",{p_venue_id:venueId||null,p_payload:payload});if(error)throw error;await this.refreshExhibitions();
  }

  async saveExhibition(exhibitionId,payload){
    if(!hasPermission(this.state,"exhibitions.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){this.demoExhibitionUpdate(workspace=>{const id=exhibitionId||`demo-exhibition-${Date.now()}`;let row=workspace.exhibitions.find(item=>item.id===id);const next={id,project_id:"demo-project",...payload,title:payload.title?.trim(),exhibition_type:payload.exhibitionType||"itinerant",public_summary:payload.publicSummary||null,internal_objectives:payload.internalObjectives||null,default_duration_days:payload.defaultDurationDays?Number(payload.defaultDurationDays):null,public_visibility:Boolean(payload.publicVisibility),published_at:payload.publicVisibility&&payload.publishNow?(row?.published_at||new Date().toISOString()):row?.published_at||null,updated_at:new Date().toISOString()};if(!next.title)throw new Error("Título da exposição é obrigatório.");if(row)Object.assign(row,next);else workspace.exhibitions.push(next);});return;}
    const{error}=await this.client.rpc("collab_upsert_exhibition_08d",{p_exhibition_id:exhibitionId||null,p_payload:payload});if(error)throw error;await this.refreshExhibitions();
  }

  async checkScheduleConflicts(scheduleId,payload){
    if(this.config.mode==="demo"){
      const workspace=this.state.exhibitionWorkspace;
      const overlap=(row)=>row.id!==scheduleId&&row.status!=="cancelled"&&row.starts_on<=payload.endsOn&&row.ends_on>=payload.startsOn;
      return{
        exhibitionOverlaps:workspace.schedules.filter(row=>row.exhibition_id===payload.exhibitionId&&overlap(row)),
        venueWarnings:workspace.schedules.filter(row=>row.venue_id===payload.venueId&&overlap(row))
      };
    }
    const{data,error}=await this.client.rpc("collab_schedule_conflicts_08d",{p_schedule_id:scheduleId||null,p_exhibition_id:payload.exhibitionId,p_venue_id:payload.venueId,p_starts_on:payload.startsOn,p_ends_on:payload.endsOn});if(error)throw error;return data;
  }

  async saveSchedule(scheduleId,payload){
    if(!hasPermission(this.state,"exhibitions.manage"))throw new Error("Permissão insuficiente.");
    const conflicts=await this.checkScheduleConflicts(scheduleId,payload);
    if(conflicts.exhibitionOverlaps?.length)throw new Error("A exposição já possui outro período que se sobrepõe.");
    if(this.config.mode==="demo"){this.demoExhibitionUpdate(workspace=>{const id=scheduleId||`demo-schedule-${Date.now()}`;let row=workspace.schedules.find(item=>item.id===id);const next={id,project_id:"demo-project",...payload,exhibition_id:payload.exhibitionId,venue_id:payload.venueId,starts_on:payload.startsOn,ends_on:payload.endsOn,installation_at:payload.installationAt||null,dismantling_at:payload.dismantlingAt||null,public_title:payload.publicTitle||null,public_summary:payload.publicSummary||null,public_notes:payload.publicNotes||null,internal_notes:payload.internalNotes||null,public_visibility:Boolean(payload.publicVisibility),published_at:payload.publicVisibility&&payload.publishNow?(row?.published_at||new Date().toISOString()):row?.published_at||null,opening_hours:payload.openingHours||null,public_contact:payload.publicContact||null,registration_url:payload.registrationUrl||null,installation_status:payload.installationStatus||"not-started",logistics_status:payload.logisticsStatus||"not-started",transport_notes:payload.transportNotes||null,condition_report_before:payload.conditionReportBefore||null,condition_report_after:payload.conditionReportAfter||null,updated_at:new Date().toISOString()};if(row)Object.assign(row,next);else workspace.schedules.push(next);workspace.conflicts=conflicts.venueWarnings||[];});return conflicts;}
    const{data,error}=await this.client.rpc("collab_upsert_schedule_08d",{p_schedule_id:scheduleId||null,p_payload:payload});if(error)throw error;await this.refreshExhibitions();return data?.conflicts||conflicts;
  }

  async saveAgendaEvent(eventId,payload){
    if(!hasPermission(this.state,"agenda.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){this.demoExhibitionUpdate(workspace=>{const id=eventId||`demo-event-${Date.now()}`;let row=workspace.events.find(item=>item.id===id);const next={id,project_id:"demo-project",...payload,exhibition_schedule_id:payload.exhibitionScheduleId||null,task_id:payload.taskId||null,venue_id:payload.venueId||null,event_type:payload.eventType||"other",starts_at:payload.startsAt,ends_at:payload.endsAt,location_text:payload.locationText||null,registration_required:Boolean(payload.registrationRequired),registration_url:payload.registrationUrl||null,public_contact:payload.publicContact||null,updated_at:new Date().toISOString()};if(!next.title?.trim())throw new Error("Título do evento é obrigatório.");if(row)Object.assign(row,next);else workspace.events.push(next);});return;}
    const{error}=await this.client.rpc("collab_upsert_agenda_event_08d",{p_event_id:eventId||null,p_payload:payload});if(error)throw error;await this.refreshExhibitions();
  }

  async rsvpEvent(eventId,status,notes=""){
    if(!hasPermission(this.state,"agenda.rsvp"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){this.demoExhibitionUpdate(workspace=>{let row=workspace.participants.find(item=>item.event_id===eventId&&item.user_id===this.state.session.user.id);const event=workspace.events.find(item=>item.id===eventId);if(!event||event.status!=="confirmed")throw new Error("Evento indisponível.");let nextStatus=status;if(status==="attending"&&event.capacity){const count=workspace.participants.filter(item=>item.event_id===eventId&&["attending","attended"].includes(item.status)&&item.user_id!==this.state.session.user.id).length;if(count>=event.capacity)nextStatus="waitlist";}const next={event_id:eventId,user_id:this.state.session.user.id,status:nextStatus,notes,responded_at:new Date().toISOString()};if(row)Object.assign(row,next);else workspace.participants.push(next);});return;}
    const{error}=await this.client.rpc("collab_rsvp_event_08d",{p_event_id:eventId,p_status:status,p_notes:notes||null});if(error)throw error;await this.refreshExhibitions();
  }

  async saveChecklistItem(itemId,scheduleId,payload){
    if(!(hasPermission(this.state,"exhibitions.logistics")||hasPermission(this.state,"exhibitions.manage")))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){this.demoExhibitionUpdate(workspace=>{const id=itemId||`demo-check-${Date.now()}`;let row=workspace.checklist.find(item=>item.id===id);const next={id,project_id:"demo-project",schedule_id:scheduleId,...payload,assigned_to:payload.assignedTo||null,due_at:payload.dueAt||null,sort_order:Number(payload.sortOrder||0),completed_at:payload.status==="completed"?new Date().toISOString():null,updated_at:new Date().toISOString()};if(!next.title?.trim())throw new Error("Título do item é obrigatório.");if(row)Object.assign(row,next);else workspace.checklist.push(next);});return;}
    const{error}=await this.client.rpc("collab_upsert_checklist_item_08d",{p_item_id:itemId||null,p_schedule_id:scheduleId,p_payload:payload});if(error)throw error;await this.refreshExhibitions();
  }

  async publishSchedule(scheduleId,publish){
    if(!hasPermission(this.state,"exhibitions.publish"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){this.demoExhibitionUpdate(workspace=>{const row=workspace.schedules.find(item=>item.id===scheduleId);if(!row||!["confirmed","installed","open","closed"].includes(row.status))throw new Error("Período ainda não publicável.");row.public_visibility=Boolean(publish);row.published_at=publish?(row.published_at||new Date().toISOString()):null;});return;}
    const{error}=await this.client.rpc("collab_publish_schedule_08d",{p_schedule_id:scheduleId,p_publish:Boolean(publish)});if(error)throw error;await this.refreshExhibitions();
  }

  async generateLogisticsTasks(scheduleId){
    if(!(hasPermission(this.state,"exhibitions.logistics")&&hasPermission(this.state,"tasks.manage")))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){const workspace=structuredClone(this.state.taskWorkspace),exhibitions=this.state.exhibitionWorkspace,schedule=exhibitions.schedules.find(item=>item.id===scheduleId),exhibition=exhibitions.exhibitions.find(item=>item.id===schedule?.exhibition_id),venue=exhibitions.venues.find(item=>item.id===schedule?.venue_id);if(!schedule)throw new Error("Agendamento não encontrado.");for(const type of ["Montagem","Desmontagem"]){const title=`${type} — ${exhibition?.title||"Exposição"}`;if(!workspace.tasks.some(item=>item.source_entity_id===scheduleId&&item.title===title))workspace.tasks.push({id:`demo-task-logistics-${type}-${Date.now()}`,project_id:"demo-project",title,summary:`${type} em ${venue?.name||"local por definir"}.`,description:"Tarefa gerada pela gestão da exposição.",category:"exhibition-setup",category_code:"exhibition-setup",status:"draft",priority:"high",assignment_mode:"approval",location_mode:"on-site",location_name:venue?.name||null,starts_at:type==="Montagem"?schedule.installation_at:schedule.dismantling_at,due_at:type==="Montagem"?schedule.installation_at:schedule.dismantling_at,estimated_minutes:180,source_entity_type:"exhibition_schedule",source_entity_id:scheduleId,created_by:this.state.session.user.id,updated_at:new Date().toISOString()});}this.persistDemo({taskWorkspace:workspace});return;}
    const{error}=await this.client.rpc("collab_generate_logistics_tasks_08d",{p_schedule_id:scheduleId});if(error)throw error;await Promise.all([this.refreshTasks(),this.refreshExhibitions()]);
  }

  async approveAccess(userId,roleCodes=["volunteer"],notes=""){const member=this.state.management.members.find(x=>x.user_id===userId);return this.manageMember({userId,primaryProfileType:member?.primary_profile_type||"volunteer",roleCodes,status:"active",note:notes});}
  async signOut(){if(this.config.mode==="demo"){localStorage.removeItem(DEMO_KEY);this.resetAuthentication();this.emit();return;}const{error}=await this.client.auth.signOut();if(error)throw error;this.resetAuthentication();this.emit();}
}
export const collaborative=new CollaborativeController();
