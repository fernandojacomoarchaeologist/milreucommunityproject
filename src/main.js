/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import {
  loadMemories, loadPortalContent, loadMuseumCollections, loadMuseumIndex, loadMuseumAudit,
  findMemory, findInitiative, findCollection, loadChannelConfig, loadChannelRecords, findChannelRecord, loadHomeCarousel, loadPublicExhibitions, loadPublicContentEffects
} from "./lib/data.js";
import { getRoute, go } from "./lib/router.js";
import { bindCommon } from "./components/layout.js";
import {
  homeView, projectView, methodologyView, initiativesView, initiativeDetailView,
  knowledgeView, participateView, aboutView, notFoundView
} from "./views/portal.js";
import {
  museumHome, galleryView, detailView, immersiveView, timelineView,
  collectionsView, collectionDetailView
} from "./views/museum.js";
import { channelLabView, totemPreviewView, panelPreviewView } from "./views/channels.js";
import { text } from "./lib/i18n.js";
import { collaborative } from "./collab/controller.js";
import {
  collaborativeLoginView, collaborativeOnboardingView, collaborativeDashboardView,
  collaborativeProfileView, collaborativeSkeletonView,
  collaborativeProfileManagementView, collaborativeMemberDetailView, collaborativeInvitationsView
} from "./views/collaborative.js";
import {
  collaborativeTasksView, collaborativeTaskDetailView, collaborativeAvailabilityView,
  collaborativeTaskManagementView, collaborativeTaskEditorView
} from "./views/collaborative-tasks.js";
import {
  collaborativeAgendaView, collaborativeExhibitionManagementView,
  collaborativeVenueManagementView, collaborativeVenueEditorView,
  collaborativeExhibitionEditorView, collaborativeExhibitionDetailView,
  collaborativeScheduleEditorView, collaborativeScheduleDetailView,
  collaborativeAgendaEventEditorView
} from "./views/collaborative-exhibitions.js";
import { publicExhibitionsView } from "./views/exhibitions-public.js";
import {
  collaborativeContributionsView, collaborativeContributionNewView,
  collaborativeContributionDetailView, collaborativeContributionModerationView
} from "./views/collaborative-contributions.js";
import {
  publicContributionFormView, publicContributionTrackingView, publicWithdrawalView
} from "./views/contributions-public.js";
import {
  collaborativeLibraryView, collaborativeLibraryResourceView, collaborativeTrainingView, collaborativeTrainingTrailView,
  collaborativeMuseumReviewView, collaborativeMuseumReviewDetailView,
  collaborativeMuseumReviewPreviewView, collaborativeMuseumReviewManagementView
} from "./views/collaborative-museum-review.js";
import {
  collaborativeDeploymentHomologationView, collaborativeHomologationRunView
} from "./views/collaborative-deployment.js";
import { collaborativeReleaseCandidateView } from "./views/collaborative-release-candidate.js";
import {
  collaborativeNotificationsView, collaborativeNotificationPreferencesView,
  collaborativeNotificationManagementView
} from "./views/collaborative-notifications.js";
import {
  collaborativeSystemAdministrationView, collaborativeAuditGovernanceView,
  collaborativeIncidentsContinuityView, collaborativeIncidentDetailView
} from "./views/collaborative-operations.js";
import {
  collaborativePilotView, collaborativePilotManagementView
} from "./views/collaborative-pilot.js";
import { collaborativeParticipationView } from "./views/collaborative-participation.js";
import { collaborativePublicIntegrationView } from "./views/public-integration-management.js";
import { operationsGovernanceDashboardView } from "./views/operations-dashboard.js";
import { governanceManagementView } from "./views/governance-management.js";
import { publicTransparencyView } from "./views/public-transparency.js";

const app = document.querySelector("#app");
const state = {
  records: [],
  portal: null,
  homeCarousel: null,
  homeCarouselIndex: 0,
  homeCarouselPaused: false,
  publicExhibitions: null,
  publicContentEffects: null,
  collections: [],
  museumIndex: [],
  audit: null,
  channelConfig: null,
  channelRecords: [],
  collab: {ready:false,authenticated:false,mode:"demo"},
  collabTaskFilters: {query:"",category:"",location:""},
  collabAgendaFilters: {view:"list",month:""},
  collabContributionFilters: {query:"",status:"",type:"",assignee:""},
  collabLibraryFilters: {query:"",category:""},
  collabMuseumReviewFilters: {query:"",status:""},
  collabNotificationFilters: {query:"",status:"",category:""},
  collabAuditFilters: {query:"",action:"",entityType:"",category:"",severity:"",from:"",to:""},
  contributionSubmissionResult: null,
  contributionTrackingResult: null,
  contributionWithdrawalResult: null,
  lang: localStorage.getItem("milreu-language") || "pt-PT",
  filters: {
    query:"", period:"", type:"", dateKnown:"", intervention:"",
    sort:"catalog", layout:localStorage.getItem("milreu-gallery-layout") || "grid"
  },
  immersiveInfo: true,
  slideshowSpeed: 0
};

const slideshowIntervals = {
  1: 15000,
  2: 7000,
  3: 4000
};

let immersiveKeyHandler = null;
let slideshowTimer = null;
let homeCarouselTimer = null;

function clearHomeCarouselTimer() {
  if (homeCarouselTimer) {
    clearTimeout(homeCarouselTimer);
    homeCarouselTimer = null;
  }
}

function scheduleHomeCarousel() {
  clearHomeCarouselTimer();
  const route = getRoute();
  const config = state.homeCarousel?.autoplay;
  const slides = state.homeCarousel?.slides || [];
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (route.name !== "home" || !config?.enabled || state.homeCarouselPaused || reducedMotion || slides.length < 2) return;

  homeCarouselTimer = setTimeout(() => {
    state.homeCarouselIndex = (state.homeCarouselIndex + 1) % slides.length;
    render(false);
  }, Number(config.intervalMs || 9000));
}

function moveHomeCarousel(direction) {
  const slides = state.homeCarousel?.slides || [];
  if (!slides.length) return;
  state.homeCarouselIndex = (state.homeCarouselIndex + direction + slides.length) % slides.length;
  render(false);
}

function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem("milreu-language",lang);
  render(false);
}

function setMetadata(title) {
  document.documentElement.lang = state.lang;
  document.title = `${title} | Projeto Comunitário de Milreu`;
}

function clearSlideshowTimer() {
  if (slideshowTimer) {
    clearTimeout(slideshowTimer);
    slideshowTimer = null;
  }
}

function stopSlideshow() {
  state.slideshowSpeed = 0;
  clearSlideshowTimer();
}

function scheduleSlideshow() {
  clearSlideshowTimer();
  const route = getRoute();
  const delay = slideshowIntervals[state.slideshowSpeed];

  if (route.name !== "immersive" || !delay) return;

  const list = state.records.filter(record => record.publication.siteVisible);
  const index = list.findIndex(record => record.id === route.id);
  if (index < 0 || list.length < 2) return;
  const next = list[(index+1)%list.length];

  slideshowTimer = setTimeout(() => {
    go(`/museu/imersivo/${next.id}`);
  }, delay);
}

async function closeImmersive(routeId) {
  stopSlideshow();
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch {}
  }
  go(`/museu/memorias/${routeId}`);
}


function setCollaborativeFeedback(message,isError=false) {
  const target=document.querySelector("[data-collab-feedback]");
  if (!target) return;
  target.textContent=message;
  target.dataset.error=String(Boolean(isError));
}


function setPublicContributionFeedback(message,isError=false) {
  const target=document.querySelector("[data-public-contribution-feedback]");
  if(!target)return;
  target.textContent=message;
  target.dataset.error=String(Boolean(isError));
}

function contributionFormPayload(form) {
  const values=formValues(form);
  const bool=name=>Boolean(form.elements[name]?.checked);
  const payload={
    contributionType:values.contributionType,
    title:values.title?.trim(),
    summary:values.summary?.trim()||null,
    content:values.content?.trim(),
    historicalContext:values.historicalContext?.trim()||null,
    placeText:values.placeText?.trim()||null,
    dateText:values.dateText?.trim()||null,
    sourceContext:values.sourceContext?.trim()||null,
    displayName:values.displayName?.trim(),
    email:values.email?.trim().toLowerCase(),
    phone:values.phone?.trim()||null,
    locality:values.locality?.trim()||null,
    preferredContact:values.preferredContact||"email",
    attributionPreference:values.attributionPreference||"discuss",
    requestedUsageScope:values.requestedUsageScope||"review-only",
    rightsDeclaration:values.rightsDeclaration?.trim(),
    fileRightsNote:values.fileRightsNote?.trim()||null,
    privacyAccepted:bool("privacyAccepted"),
    rightsConfirmed:bool("rightsConfirmed"),
    projectUseAuthorised:bool("projectUseAuthorised"),
    contactAllowed:bool("contactAllowed"),
    publicAttributionAuthorised:bool("publicAttributionAuthorised"),
    website:values.website||"",
    target:{
      targetType:values.targetType||"general",
      targetIdentifier:values.targetIdentifier?.trim()||null,
      relationType:values.relationType||"supports",
      note:values.targetNote?.trim()||null
    }
  };
  const files=[...(form.elements.files?.files||[])];
  return{payload,files};
}


function parseMuseumProposalValue(raw,baseValue) {
  const value=String(raw??"");
  if(typeof baseValue==="string")return value;
  if(baseValue===null){
    const trimmed=value.trim();
    if(!trimmed)return null;
    try{return JSON.parse(trimmed);}catch{return value;}
  }
  try{return JSON.parse(value);}catch{
    throw new Error("O novo valor deve ser JSON válido para este campo.");
  }
}

function formValues(form) {
  const data=new FormData(form);
  return Object.fromEntries(data.entries());
}

function checkedValues(form,name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function isCollaborativeRoute(route) {
  return route.name.startsWith("collab-");
}

function renderCollaborativeRoute(route) {
  const context={...state.collab,canonicalRecords:state.records,publicContentEffects:state.publicContentEffects};
  if (!context?.ready) {
    return `<main class="collab-loading"><p>A preparar a Área Colaborativa…</p></main>`;
  }

  if (!context.authenticated) {
    return collaborativeLoginView(context);
  }

  if (context.membership?.status !== "active") {
    return collaborativeOnboardingView(context);
  }

  switch(route.name) {
    case "collab-login":
    case "collab-callback":
    case "collab-dashboard":
      return collaborativeDashboardView(context);
    case "collab-profile":
      return collaborativeProfileView(context);
    case "collab-tasks":
      return collaborativeTasksView(context,{...state.collabTaskFilters,...(route.query||{})});
    case "collab-task-detail":
      return collaborativeTaskDetailView(context,route.taskId,false);
    case "collab-availability":
      return collaborativeAvailabilityView(context);
    case "collab-contributions":
      return collaborativeContributionsView(context);
    case "collab-contribution-new":
      return collaborativeContributionNewView(context);
    case "collab-contribution-detail":
      return collaborativeContributionDetailView(context,route.contributionId,false);
    case "collab-contribution-moderation":
      return collaborativeContributionModerationView(context,{...state.collabContributionFilters,...(route.query||{})});
    case "collab-contribution-moderation-detail":
      return collaborativeContributionDetailView(context,route.contributionId,true);
    case "collab-agenda":
      return collaborativeAgendaView(context,{...state.collabAgendaFilters,...(route.query||{})});
    case "collab-notifications":
      return collaborativeNotificationsView(context,{...state.collabNotificationFilters,...(route.query||{})});
    case "collab-notification-preferences":
      return collaborativeNotificationPreferencesView(context);
    case "collab-pilot":
      return collaborativePilotView(context);
    case "collab-pilot-management":
      return collaborativePilotManagementView(context);
    case "collab-participation":
      return collaborativeParticipationView(context);
    case "collab-public-integration":
      return collaborativePublicIntegrationView(context);
    case "collab-operations-governance":
      return operationsGovernanceDashboardView(context);
    case "collab-governance":
      return governanceManagementView(context);
    case "collab-system-administration":
      return collaborativeSystemAdministrationView(context);
    case "collab-audit-governance":
      return collaborativeAuditGovernanceView(context,{...state.collabAuditFilters,...(route.query||{})});
    case "collab-incidents-continuity":
      return collaborativeIncidentsContinuityView(context);
    case "collab-incident-detail":
      return collaborativeIncidentDetailView(context,route.incidentId);
    case "collab-notification-management":
      return collaborativeNotificationManagementView(context,"overview");
    case "collab-notification-templates":
      return collaborativeNotificationManagementView(context,"templates");
    case "collab-library":
      return collaborativeLibraryView(context,{...state.collabLibraryFilters,...(route.query||{})});
    case "collab-library-resource":
      return collaborativeLibraryResourceView(context,route.resourceCode);
    case "collab-training":
      return collaborativeTrainingView(context);
    case "collab-training-trail":
      return collaborativeTrainingTrailView(context,route.trailCode);
    case "collab-museum-review":
      return collaborativeMuseumReviewView(context,{...state.collabMuseumReviewFilters,...(route.query||{})},false);
    case "collab-museum-review-detail":
      return collaborativeMuseumReviewDetailView(context,route.memoryId,false);
    case "collab-museum-review-preview":
      return collaborativeMuseumReviewPreviewView(context,route.memoryId,false);
    case "collab-museum-review-management":
      return collaborativeMuseumReviewManagementView(context,"overview");
    case "collab-museum-review-management-detail":
      return collaborativeMuseumReviewDetailView(context,route.memoryId,true);
    case "collab-museum-review-management-preview":
      return collaborativeMuseumReviewPreviewView(context,route.memoryId,true);
    case "collab-museum-review-releases":
      return collaborativeMuseumReviewManagementView(context,"releases");
    case "collab-deployment-homologation":
      return collaborativeDeploymentHomologationView(context);
    case "collab-homologation-run":
      return collaborativeHomologationRunView(context,route.runId);
    case "collab-release-candidate":
      return collaborativeReleaseCandidateView(context);
    case "collab-profile-management":
      return collaborativeProfileManagementView(context);
    case "collab-member-detail":
      return collaborativeMemberDetailView(context,route.userId);
    case "collab-invitations":
      return collaborativeInvitationsView(context);
    case "collab-task-management":
      return collaborativeTaskManagementView(context);
    case "collab-task-new":
      return collaborativeTaskEditorView(context,null);
    case "collab-task-edit":
      return collaborativeTaskEditorView(context,route.taskId);
    case "collab-task-manage-detail":
      return collaborativeTaskDetailView(context,route.taskId,true);
    case "collab-exhibition-management":
      return collaborativeExhibitionManagementView(context);
    case "collab-venue-management":
      return collaborativeVenueManagementView(context);
    case "collab-venue-new":
      return collaborativeVenueEditorView(context,null);
    case "collab-venue-edit":
      return collaborativeVenueEditorView(context,route.venueId);
    case "collab-exhibition-new":
      return collaborativeExhibitionEditorView(context,null);
    case "collab-exhibition-edit":
      return collaborativeExhibitionEditorView(context,route.exhibitionId);
    case "collab-exhibition-detail":
      return collaborativeExhibitionDetailView(context,route.exhibitionId);
    case "collab-schedule-new":
      return collaborativeScheduleEditorView(context,route.exhibitionId,route.query?.schedule||null);
    case "collab-schedule-detail":
      return collaborativeScheduleDetailView(context,route.scheduleId);
    case "collab-agenda-event-new":
      return collaborativeAgendaEventEditorView(context,null,route.query||{});
    case "collab-agenda-event-edit":
      return collaborativeAgendaEventEditorView(context,route.eventId,route.query||{});
    default:
      return collaborativeDashboardView(context);
  }
}

function bindPage() {
  bindCommon(setLanguage);

  document.querySelector("[data-collab-google-login]")?.addEventListener("click",async()=>{
    try {
      await collaborative.signInGoogle();
    } catch(error) {
      alert(error.message);
    }
  });

  document.querySelectorAll("[data-collab-demo-login]").forEach(button =>
    button.addEventListener("click",()=>{
      collaborative.demoSignIn(button.dataset.collabDemoLogin);
      go("/area-colaborativa");
    })
  );

  document.querySelector("[data-collab-logout]")?.addEventListener("click",async()=>{
    try {
      await collaborative.signOut();
      go("/entrar");
    } catch(error) {
      alert(error.message);
    }
  });

  document.querySelector("[data-collab-edit-request]")?.addEventListener("click",()=>{
    document.querySelector("[data-collab-request-editor]")?.classList.toggle("collab-onboarding-form--hidden");
  });

  document.querySelector("[data-collab-access-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const values=formValues(event.currentTarget);
    setCollaborativeFeedback("A guardar…");
    try {
      await collaborative.submitAccessRequest(values);
      setCollaborativeFeedback("Pedido guardado.");
    } catch(error) {
      setCollaborativeFeedback(error.message,true);
    }
  });

  document.querySelector("[data-collab-profile-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget;
    const values=formValues(form);
    values.publicRecognitionOptIn=form.elements.publicRecognitionOptIn?.checked || false;
    values.languages=checkedValues(form,"languages");
    values.interests=checkedValues(form,"interests");
    values.skills=checkedValues(form,"skills");
    setCollaborativeFeedback("A guardar…");
    try {
      await collaborative.updateMyProfile(values);
      setCollaborativeFeedback("Perfil atualizado.");
    } catch(error) {
      setCollaborativeFeedback(error.message,true);
    }
  });

  const applyMemberFilters=()=>{
    const query=(document.querySelector("[data-member-search]")?.value||"").trim().toLowerCase();
    const status=document.querySelector("[data-member-status]")?.value||"";
    const profile=document.querySelector("[data-member-profile]")?.value||"";
    let visible=0;
    document.querySelectorAll("[data-member-row]").forEach(row=>{
      const show=(!query||row.dataset.search.includes(query))&&(!status||row.dataset.status===status)&&(!profile||row.dataset.profile===profile);
      row.hidden=!show;
      if(show) visible+=1;
    });
    const empty=document.querySelector("[data-member-filter-empty]");
    if(empty) empty.hidden=visible>0;
  };
  ["[data-member-search]","[data-member-status]","[data-member-profile]"].forEach(selector=>{
    const control=document.querySelector(selector);
    control?.addEventListener("input",applyMemberFilters);
    control?.addEventListener("change",applyMemberFilters);
  });

  document.querySelector("[data-collab-member-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget;
    const values=formValues(form);
    values.roleCodes=checkedValues(form,"roleCodes");
    setCollaborativeFeedback("A guardar…");
    try {
      await collaborative.manageMember(values);
      setCollaborativeFeedback("Membro atualizado.");
    } catch(error) {
      setCollaborativeFeedback(error.message,true);
    }
  });

  document.querySelector("[data-collab-invitation-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget;
    const values=formValues(form);
    values.roleCodes=checkedValues(form,"roleCodes");
    values.expiresAt=values.expiresAt?new Date(values.expiresAt).toISOString():null;
    setCollaborativeFeedback("A criar…");
    try {
      await collaborative.createInvitation(values);
      setCollaborativeFeedback("Pré-autorização criada.");
      form.reset();
    } catch(error) {
      setCollaborativeFeedback(error.message,true);
    }
  });

  document.querySelectorAll("[data-collab-revoke-invitation]").forEach(button=>
    button.addEventListener("click",async()=>{
      const reason=prompt("Motivo da revogação (opcional):","")||"";
      button.disabled=true;
      try { await collaborative.revokeInvitation(button.dataset.collabRevokeInvitation,reason); }
      catch(error){ alert(error.message); }
      finally { button.disabled=false; }
    })
  );


  const taskFilterForm=document.querySelector("[data-task-filters]");
  taskFilterForm?.addEventListener("input",()=>{
    const values=formValues(taskFilterForm);
    state.collabTaskFilters={query:values.query||"",category:values.category||"",location:values.location||""};
    const query=state.collabTaskFilters.query.toLowerCase();
    let visible=0;
    document.querySelectorAll("[data-task-card]").forEach(card=>{
      const show=(!query||card.dataset.search.includes(query))&&(!state.collabTaskFilters.category||card.dataset.category===state.collabTaskFilters.category)&&(!state.collabTaskFilters.location||card.dataset.location===state.collabTaskFilters.location);
      card.hidden=!show;if(show)visible+=1;
    });
    const empty=document.querySelector("[data-task-filter-empty]");if(empty)empty.hidden=visible>0;
  });

  document.querySelector("[data-task-join-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A guardar…");
    try{await collaborative.joinTask(form.dataset.taskId,values.note||"");setCollaborativeFeedback("Participação registada.");}catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-task-invitation-response]").forEach(button=>button.addEventListener("click",async()=>{
    const note=document.querySelector("[data-task-response-note]")?.value||"";button.disabled=true;
    try{await collaborative.respondTaskInvitation(button.dataset.taskId,button.dataset.taskInvitationResponse==="accept",note);}catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelectorAll("[data-task-withdraw]").forEach(button=>button.addEventListener("click",async()=>{
    const note=prompt("Indique o motivo da desistência ou retirada (opcional):","")||"";button.disabled=true;
    try{await collaborative.withdrawTask(button.dataset.taskId,note);}catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelectorAll("[data-task-start]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;try{await collaborative.startTask(button.dataset.taskId);}catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelector("[data-task-submit-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A submeter…");
    try{await collaborative.submitTask(form.dataset.taskId,values.note||"",values.minutes?Number(values.minutes):null);setCollaborativeFeedback("Conclusão enviada para validação.");}catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-task-time-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A guardar…");
    try{await collaborative.logTaskTime(form.dataset.taskId,values.activityDate,Number(values.minutes),values.note||"");setCollaborativeFeedback("Tempo registado para validação.");form.reset();}catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelector("[data-availability-add]")?.addEventListener("click",()=>{
    const template=document.querySelector("[data-availability-template]"),target=document.querySelector("[data-availability-slots]");
    if(template&&target)target.insertAdjacentHTML("beforeend",template.innerHTML);
  });
  document.querySelector("[data-availability-slots]")?.addEventListener("click",event=>{
    const button=event.target.closest("[data-availability-remove]");if(!button)return;button.closest("[data-availability-row]")?.remove();
  });
  document.querySelector("[data-availability-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,preferredModes=checkedValues(form,"preferredModes");
    const slots=[...form.querySelectorAll("[data-availability-row]")].map(row=>({dayOfWeek:Number(row.querySelector('[name="dayOfWeek"]').value),startsAt:row.querySelector('[name="startsAt"]').value,endsAt:row.querySelector('[name="endsAt"]').value,mode:row.querySelector('[name="mode"]').value}));
    const values=formValues(form);setCollaborativeFeedback("A guardar…");
    try{await collaborative.saveAvailability({preferredModes,maximumWeeklyMinutes:values.maximumWeeklyHours?Number(values.maximumWeeklyHours)*60:null,timezone:values.timezone||"Europe/Lisbon",notes:values.notes||"",slots});setCollaborativeFeedback("Disponibilidade atualizada.");}catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-task-editor-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form),skillCodes=checkedValues(form,"skills");
    const payload={title:values.title,summary:values.summary||null,description:values.description||null,instructions:values.instructions||null,categoryCode:values.categoryCode,priority:values.priority,assignmentMode:values.assignmentMode,locationMode:values.locationMode,locationName:values.locationName||null,municipality:values.municipality||null,startsAt:values.startsAt?new Date(values.startsAt).toISOString():null,dueAt:values.dueAt?new Date(values.dueAt).toISOString():null,applicationDeadline:values.applicationDeadline?new Date(values.applicationDeadline).toISOString():null,estimatedMinutes:values.estimatedMinutes?Number(values.estimatedMinutes):null,capacity:values.capacity?Number(values.capacity):null,minimumParticipants:values.minimumParticipants?Number(values.minimumParticipants):1,recognitionEligible:Boolean(form.elements.recognitionEligible?.checked),skills:skillCodes.map(code=>({code,required:form.elements[`skillRequirement:${code}`]?.value==="required"}))};
    setCollaborativeFeedback("A guardar…");
    try{if(form.dataset.taskId){await collaborative.updateTask(form.dataset.taskId,payload);setCollaborativeFeedback("Tarefa atualizada.");}else{const id=await collaborative.createTask(payload);go(`/area-colaborativa/gestao/tarefas/${id}`);}}catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-task-publish]").forEach(button=>button.addEventListener("click",async()=>{button.disabled=true;try{await collaborative.publishTask(button.dataset.taskId);}catch(error){alert(error.message);}finally{button.disabled=false;}}));
  document.querySelectorAll("[data-task-cancel]").forEach(button=>button.addEventListener("click",async()=>{const reason=prompt("Motivo do cancelamento:","")||"";if(!confirm("Cancelar esta tarefa?"))return;button.disabled=true;try{await collaborative.cancelTask(button.dataset.taskId,reason);}catch(error){alert(error.message);}finally{button.disabled=false;}}));
  document.querySelectorAll("[data-task-complete]").forEach(button=>button.addEventListener("click",async()=>{const note=prompt("Nota de encerramento (opcional):","")||"";button.disabled=true;try{await collaborative.completeTask(button.dataset.taskId,note);}catch(error){alert(error.message);}finally{button.disabled=false;}}));

  document.querySelector("[data-task-invite-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A convidar…");
    try{await collaborative.inviteTaskMember(form.dataset.taskId,values.userId,values.note||"");setCollaborativeFeedback("Convite interno registado.");form.reset();}catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-task-review-application]").forEach(button=>button.addEventListener("click",async()=>{const note=prompt("Nota da decisão (opcional):","")||"";button.disabled=true;try{await collaborative.reviewTaskApplication(button.dataset.taskId,button.dataset.userId,button.dataset.taskReviewApplication==="accept",note);}catch(error){alert(error.message);}finally{button.disabled=false;}}));
  document.querySelectorAll("[data-task-verify]").forEach(button=>button.addEventListener("click",async()=>{const note=prompt("Nota de validação ou correção (opcional):","")||"";button.disabled=true;try{await collaborative.verifyTask(button.dataset.taskId,button.dataset.userId,button.dataset.taskVerify==="accept",note);}catch(error){alert(error.message);}finally{button.disabled=false;}}));




  document.querySelector("[data-library-filters]")?.addEventListener("submit",event=>{
    event.preventDefault();const values=formValues(event.currentTarget);
    state.collabLibraryFilters={query:values.query||"",category:values.category||""};
    const query=new URLSearchParams(Object.entries(state.collabLibraryFilters).filter(([,value])=>value));
    go(`/area-colaborativa/biblioteca${query.toString()?`?${query}`:""}`);
  });

  document.querySelectorAll("[data-training-lesson-complete]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{await collaborative.completeTrainingLesson(button.dataset.trailCode,button.dataset.trainingLessonComplete);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelector("[data-training-assessment-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A registar avaliação…");
    try{await collaborative.assessTraining(values.userId,values.trailCode,Number(values.score));setCollaborativeFeedback("Avaliação registada.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-museum-review-filters]")?.addEventListener("submit",event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);
    state.collabMuseumReviewFilters={query:values.query||"",status:values.status||""};
    const query=new URLSearchParams(Object.entries(state.collabMuseumReviewFilters).filter(([,value])=>value));
    const base=form.dataset.management==="true"?"/area-colaborativa/gestao/revisao-museu":"/area-colaborativa/revisao-museu";
    go(`${base}${query.toString()?`?${query}`:""}`);
  });

  document.querySelectorAll("[data-museum-proposal-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);
    let baseValue;
    try{baseValue=JSON.parse(values.baseValue);}catch{baseValue=values.baseValue;}
    let proposedValue;
    try{proposedValue=parseMuseumProposalValue(values.proposedValue,baseValue);}
    catch(error){setCollaborativeFeedback(error.message,true);return;}
    const payload={
      fieldPath:values.fieldPath,
      baseValue,
      proposedValue,
      rationale:values.rationale,
      sourceIds:String(values.sourceIds||"").split(",").map(value=>value.trim()).filter(Boolean),
      contributionIds:String(values.contributionIds||"").split(",").map(value=>value.trim()).filter(Boolean),
      submit:Boolean(form.elements.submit?.checked)
    };
    setCollaborativeFeedback("A guardar proposta…");
    try{await collaborative.saveMuseumProposal(form.dataset.proposalId||null,form.dataset.reviewRecordId,payload);setCollaborativeFeedback("Proposta guardada.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelectorAll("[data-museum-proposal-review]").forEach(button=>button.addEventListener("click",async()=>{
    const note=prompt("Fundamente a decisão sobre esta proposta:","")||"";
    if(!note.trim())return;button.disabled=true;
    try{await collaborative.reviewMuseumProposal(button.dataset.proposalId,button.dataset.museumProposalReview,note);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));


  document.querySelectorAll("[data-museum-proposal-supersede]").forEach(button=>button.addEventListener("click",async()=>{
    const rationale=prompt("Explique por que a proposta aceite deve ser substituída:","")||"";
    if(!rationale.trim())return;button.disabled=true;
    try{await collaborative.supersedeMuseumProposal(button.dataset.museumProposalSupersede,rationale);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelector("[data-museum-comment-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A guardar comentário…");
    try{await collaborative.addMuseumReviewComment(form.dataset.reviewRecordId,{fieldPath:values.fieldPath||null,commentType:values.commentType,body:values.body,blocking:Boolean(form.elements.blocking?.checked)});setCollaborativeFeedback("Comentário guardado.");form.reset();}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-museum-comment-resolve]").forEach(button=>button.addEventListener("click",async()=>{
    const resolution=prompt("Registe como o comentário foi resolvido:","")||"";
    if(!resolution.trim())return;button.disabled=true;
    try{await collaborative.resolveMuseumReviewComment(button.dataset.museumCommentResolve,resolution);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelectorAll("[data-museum-check-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A guardar check…");
    try{await collaborative.setMuseumReviewCheck(form.dataset.reviewRecordId,form.dataset.checkType,values.status,values.note||"");setCollaborativeFeedback("Check atualizado.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelector("[data-museum-assignment-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A atribuir…");
    try{await collaborative.assignMuseumReview(form.dataset.reviewRecordId,values.userId,values.assignmentRole);setCollaborativeFeedback("Atribuição guardada.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-museum-contribution-link-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A relacionar contributo…");
    try{await collaborative.linkContributionToMuseumReview(form.dataset.reviewRecordId,values.contributionId,values.linkType,values.note||"");setCollaborativeFeedback("Contributo relacionado.");form.reset();}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-museum-decision-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);
    if(!values.decisionType){setCollaborativeFeedback("Selecione uma decisão.",true);return;}
    setCollaborativeFeedback("A validar gates e registar decisão…");
    try{await collaborative.decideMuseumReview(form.dataset.reviewRecordId,values.decisionType,values.rationale);setCollaborativeFeedback("Decisão registada.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-museum-snapshot-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A gerar snapshot…");
    try{await collaborative.generateMuseumReviewSnapshot(form.dataset.cycleId,values.version);setCollaborativeFeedback("Snapshot validado gerado.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-museum-snapshot-approve]").forEach(button=>button.addEventListener("click",async()=>{
    const confirmation=prompt('Escreva exatamente "APPROVE_MUSEUM_EDITORIAL_SNAPSHOT" para aprovar:','')||"";
    button.disabled=true;
    try{await collaborative.approveMuseumReviewSnapshot(button.dataset.museumSnapshotApprove,confirmation);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelector("[data-public-effect-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);
    const payload={cycleId:values.cycleId||null,effectCode:values.effectCode,slotCode:values.slotCode,effectType:values.effectType,title:{"pt-PT":values.titlePt},description:{"pt-PT":values.descriptionPt||null},memoryIds:String(values.memoryIds||"").split(",").map(value=>value.trim()).filter(Boolean),status:values.status,enabled:Boolean(form.elements.enabled?.checked),startsAt:null,endsAt:null};
    setCollaborativeFeedback("A guardar efeito…");
    try{await collaborative.savePublicContentEffect(null,payload);setCollaborativeFeedback("Efeito guardado. Só chegará às páginas públicas através do snapshot aprovado.");form.reset();}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });


  document.querySelectorAll("[data-deployment-environment-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A guardar ambiente…");
    try{
      await collaborative.saveDeploymentEnvironment({
        code:values.code,name:values.name,status:values.status,
        siteUrl:values.siteUrl||null,projectRef:values.projectRef||null,
        authCallbackUrl:values.authCallbackUrl||null,metadata:{source:"08G UI"}
      });
      setCollaborativeFeedback("Ambiente guardado.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelector("[data-auth-policy-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A guardar política…");
    try{
      await collaborative.saveAuthPolicy({
        googleEnabled:Boolean(form.elements.googleEnabled?.checked),
        allowedEmailDomains:String(values.allowedEmailDomains||"").split(",").map(value=>value.trim()).filter(Boolean),
        sessionExpiryMinutes:Number(values.sessionExpiryMinutes||60),
        policyStatus:values.policyStatus||"draft"
      });
      setCollaborativeFeedback("Política guardada.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-homologation-start-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(event.currentTarget);setCollaborativeFeedback("A iniciar homologação…");
    try{
      await collaborative.startHomologation(values.environmentCode,values.version,values.commitSha||"");
      setCollaborativeFeedback("Execução criada.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-homologation-check-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A guardar check…");
    try{
      await collaborative.recordHomologationCheck(
        form.dataset.runId,form.dataset.checkCode,values.status,
        values.evidence||"",values.note||""
      );
      setCollaborativeFeedback("Check atualizado.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelector("[data-homologation-complete-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A concluir execução…");
    try{
      await collaborative.completeHomologation(form.dataset.runId,values.summary);
      setCollaborativeFeedback("Execução concluída.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-homologation-approve]").forEach(button=>button.addEventListener("click",async()=>{
    const expected=button.dataset.environmentCode==="production"
      ?"APPROVE_MILREU_PRODUCTION_RELEASE":"APPROVE_MILREU_HOMOLOGATION";
    const confirmation=prompt(`Escreva exatamente "${expected}" para aprovar:`,"")||"";
    button.disabled=true;
    try{await collaborative.approveHomologation(button.dataset.homologationApprove,confirmation);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelectorAll("[data-homologation-cancel]").forEach(button=>button.addEventListener("click",async()=>{
    const reason=prompt("Fundamente o cancelamento:","")||"";
    if(!reason.trim())return;button.disabled=true;
    try{await collaborative.cancelHomologation(button.dataset.homologationCancel,reason);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));


  document.querySelector("[data-notification-filters]")?.addEventListener("submit",event=>{
    event.preventDefault();const values=formValues(event.currentTarget);
    state.collabNotificationFilters={
      query:values.query||"",status:values.status||"",category:values.category||""
    };
    const query=new URLSearchParams(Object.entries(state.collabNotificationFilters).filter(([,value])=>value));
    go(`/area-colaborativa/notificacoes${query.toString()?`?${query}`:""}`);
  });

  document.querySelectorAll("[data-notification-action]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{await collaborative.markNotification(button.dataset.notificationId,button.dataset.notificationAction);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelector("[data-notification-mark-all]")?.addEventListener("click",async event=>{
    event.currentTarget.disabled=true;
    try{await collaborative.markAllNotificationsRead();}
    catch(error){alert(error.message);}finally{event.currentTarget.disabled=false;}
  });

  document.querySelector("[data-notification-preferences-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);
    const start=values.quietHoursStart||"",end=values.quietHoursEnd||"";
    if(Boolean(start)!==Boolean(end)){setCollaborativeFeedback("Defina o início e o fim do horário silencioso.",true);return;}
    setCollaborativeFeedback("A guardar preferências…");
    try{
      const preferences=state.collab.notificationModel.eventTypes.map(eventType=>{
        const inApp=form.elements[`inApp:${eventType.code}`];
        const email=form.elements[`email:${eventType.code}`];
        return{
          eventType:eventType.code,
          inAppEnabled:eventType.mandatoryInApp?true:Boolean(inApp?.checked),
          emailEnabled:Boolean(email?.checked),
          quietHoursStart:start||null,quietHoursEnd:end||null,
          timezone:values.timezone||"Europe/Lisbon",language:values.language||"pt-PT"
        };
      });
      await collaborative.saveNotificationPreferences(preferences);
      setCollaborativeFeedback("Preferências guardadas.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-notification-template-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A guardar template…");
    try{
      await collaborative.saveNotificationTemplate(form.dataset.templateId||null,{
        eventType:values.eventType,language:values.language||"pt-PT",
        subjectTemplate:values.subjectTemplate,titleTemplate:values.titleTemplate,
        bodyTextTemplate:values.bodyTextTemplate,status:values.status
      });
      setCollaborativeFeedback("Template guardado como nova versão ou rascunho.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelector("[data-notification-channel-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(event.currentTarget);setCollaborativeFeedback("A guardar canal…");
    try{
      await collaborative.updateNotificationChannel({
        channel:values.channel,status:values.status,provider:values.provider,
        fromName:values.fromName||null,fromEmail:values.fromEmail||null,
        confirmation:values.confirmation||null,
        settings:{automaticScheduleEnabled:false,maxBatch:25,maxAttempts:5}
      });
      setCollaborativeFeedback("Canal atualizado.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-notification-test-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A criar teste…");
    try{
      await collaborative.sendTestNotification(
        values.targetUserId,values.eventType||"task.assigned",
        Boolean(form.elements.includeEmail?.checked)
      );
      setCollaborativeFeedback("Teste criado.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-notification-invitation-email]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{await collaborative.queueInvitationEmail(button.dataset.notificationInvitationEmail);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelectorAll("[data-notification-outbox-retry]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{await collaborative.retryNotificationOutbox(button.dataset.notificationOutboxRetry);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelectorAll("[data-notification-outbox-cancel]").forEach(button=>button.addEventListener("click",async()=>{
    const reason=prompt("Fundamente o cancelamento:","")||"";
    if(!reason.trim())return;button.disabled=true;
    try{await collaborative.cancelNotificationOutbox(button.dataset.notificationOutboxCancel,reason);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelector("[data-notification-refresh]")?.addEventListener("click",async event=>{
    event.currentTarget.disabled=true;
    try{await collaborative.refreshNotifications();}
    catch(error){alert(error.message);}finally{event.currentTarget.disabled=false;}
  });


  document.querySelectorAll("[data-operations-refresh]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{await collaborative.refreshOperations();}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelector("[data-operation-run-start-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(event.currentTarget);setCollaborativeFeedback("A iniciar execução…");
    try{await collaborative.startOperationalRun(values.environment,values.version||"",values.commitSha||"");setCollaborativeFeedback("Execução iniciada.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-operation-result-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A guardar check…");
    try{await collaborative.recordOperationalResult(form.dataset.runId,form.dataset.checkCode,values.status,values.evidenceReference||"",values.notes||"");setCollaborativeFeedback("Check atualizado.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelector("[data-operation-complete-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A concluir execução…");
    try{await collaborative.completeOperationalRun(form.dataset.runId,values.summary||"");setCollaborativeFeedback("Execução concluída.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-operation-setting-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);let value;
    try{value=JSON.parse(values.valueJson||"{}");}catch{setCollaborativeFeedback("JSON inválido.",true);return;}
    setCollaborativeFeedback("A guardar configuração…");
    try{await collaborative.saveOperationalSetting({code:form.dataset.settingCode,category:values.category,value,status:values.status,description:values.description||null});setCollaborativeFeedback("Configuração guardada.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelectorAll("[data-backup-plan-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A guardar plano…");
    try{await collaborative.saveBackupPlan(form.dataset.planId||null,{code:values.code,name:values.name,backupType:values.backupType,provider:values.provider,frequency:values.frequency,retentionDays:values.retentionDays,targetRpoMinutes:values.targetRpoMinutes,targetRtoMinutes:values.targetRtoMinutes,status:values.status,instructionsReference:values.instructionsReference||null,responsibleUserId:values.responsibleUserId||null,secondaryUserId:values.secondaryUserId||null,nextDueAt:values.nextDueAt||null});setCollaborativeFeedback("Plano guardado.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelectorAll("[data-backup-verification-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A guardar verificação…");
    try{await collaborative.recordBackupVerification(form.dataset.planId,{status:values.status,backupObservedAt:values.backupObservedAt||null,restoreTested:Boolean(form.elements.restoreTested?.checked),evidenceReference:values.evidenceReference||null,notes:values.notes||null});setCollaborativeFeedback("Verificação guardada.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelector("[data-audit-search-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(event.currentTarget);
    state.collabAuditFilters={query:values.query||"",action:values.action||"",entityType:values.entityType||"",category:values.category||"",severity:values.severity||"",from:values.from||"",to:values.to||""};
    try{await collaborative.searchAudit({...state.collabAuditFilters,limit:100,offset:0});}
    catch(error){alert(error.message);}
  });

  document.querySelector("[data-audit-integrity]")?.addEventListener("click",async event=>{
    event.currentTarget.disabled=true;
    try{await collaborative.verifyAuditIntegrity();}
    catch(error){alert(error.message);}finally{event.currentTarget.disabled=false;}
  });

  document.querySelector("[data-audit-export]")?.addEventListener("click",async event=>{
    event.currentTarget.disabled=true;
    try{await collaborative.exportAudit({...state.collabAuditFilters,limit:5000,offset:0});}
    catch(error){alert(error.message);}finally{event.currentTarget.disabled=false;}
  });

  document.querySelectorAll("[data-retention-preview-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A gerar preview…");
    try{await collaborative.previewRetention(form.dataset.policyCode,values.environment);setCollaborativeFeedback("Preview criado.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelectorAll("[data-retention-approve]").forEach(button=>button.addEventListener("click",async()=>{
    const confirmation=prompt('Escreva exatamente "APPROVE_MILREU_RETENTION_RUN":',"")||"";
    button.disabled=true;
    try{await collaborative.approveRetention(button.dataset.retentionApprove,confirmation);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelectorAll("[data-retention-cancel]").forEach(button=>button.addEventListener("click",async()=>{
    const reason=prompt("Fundamente o cancelamento:","")||"";if(!reason.trim())return;
    button.disabled=true;
    try{await collaborative.cancelRetention(button.dataset.retentionCancel,reason);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelector("[data-legal-hold-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(event.currentTarget);setCollaborativeFeedback("A criar legal hold…");
    try{await collaborative.createLegalHold({resourceType:values.resourceType,entityId:values.entityId||null,reason:values.reason,endsAt:values.endsAt||null});setCollaborativeFeedback("Legal hold criado.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-legal-hold-release]").forEach(button=>button.addEventListener("click",async()=>{
    const reason=prompt("Fundamente a libertação:","")||"";if(!reason.trim())return;
    button.disabled=true;
    try{await collaborative.releaseLegalHold(button.dataset.legalHoldRelease,reason);}
    catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelector("[data-incident-create-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(event.currentTarget);setCollaborativeFeedback("A abrir incidente…");
    try{await collaborative.createIncident({title:values.title,description:values.description,category:values.category,severity:values.severity,environment:values.environment,impactSummary:values.impactSummary||null,ownerUserId:values.ownerUserId||null});setCollaborativeFeedback("Incidente aberto.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  for(const [selector,kind] of [["[data-pilot-confirm-form]","confirm"],["[data-pilot-feedback-form]","feedback"],["[data-pilot-withdraw-form]","withdraw"],["[data-pilot-cycle-form]","cycle"],["[data-pilot-enrol-form]","enrol"],["[data-pilot-gate-form]","gate"],["[data-pilot-approve-form]","approve"]]){
    document.querySelector(selector)?.addEventListener("submit",async event=>{
      event.preventDefault();const values=formValues(event.currentTarget);setCollaborativeFeedback("A processar ação do piloto…");
      try{await collaborative.pilotAction(kind,values);setCollaborativeFeedback("Ação do piloto registada.");}
      catch(error){setCollaborativeFeedback(error.message,true);}
    });
  }
  for(const [selector,kind] of [["[data-participation-enrol-form]","enrol"],["[data-participation-progress-form]","progress"],["[data-participation-programme-form]","programme"]]){
    document.querySelector(selector)?.addEventListener("submit",async event=>{
      event.preventDefault();const values=formValues(event.currentTarget);setCollaborativeFeedback("A processar participação…");
      try{await collaborative.participationAction(kind,values);setCollaborativeFeedback("Ação de participação registada.");}
      catch(error){setCollaborativeFeedback(error.message,true);}
    });
  }
  for(const [selector,kind] of [["[data-public-proposal-form]","proposal"],["[data-public-activation-form]","activation"],["[data-evolution-proposal-form]","evolution"]]){
    document.querySelector(selector)?.addEventListener("submit",async event=>{
      event.preventDefault();const values=formValues(event.currentTarget);setCollaborativeFeedback("A processar integração pública…");
      try{await collaborative.publicIntegrationAction(kind,values);setCollaborativeFeedback("Ação de integração pública registada.");}
      catch(error){setCollaborativeFeedback(error.message,true);}
    });
  }
  for(const [selector,kind] of [["[data-support-submit-form]","support-submit"],["[data-operating-cycle-form]","cycle"],["[data-continuity-form]","continuity"],["[data-governance-form]","governance"],["[data-governance-decide-form]","decide"],["[data-transparency-publish-form]","transparency"]]){
    document.querySelector(selector)?.addEventListener("submit",async event=>{
      event.preventDefault();const values=formValues(event.currentTarget);setCollaborativeFeedback("A processar operação/governação…");
      try{await collaborative.operationsGovernanceAction(kind,values);setCollaborativeFeedback("Ação de operação/governação registada.");}
      catch(error){setCollaborativeFeedback(error.message,true);}
    });
  }

  document.querySelector("[data-incident-update-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A atualizar incidente…");
    try{await collaborative.updateIncident(form.dataset.incidentId,{status:values.status,ownerUserId:values.ownerUserId||null,impactSummary:values.impactSummary||null,publicSummary:values.publicSummary||null,updateBody:values.updateBody});setCollaborativeFeedback("Incidente atualizado.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-incident-note-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();const form=event.currentTarget,values=formValues(form);setCollaborativeFeedback("A adicionar nota…");
    try{await collaborative.addIncidentUpdate(form.dataset.incidentId,values.updateType,values.body);setCollaborativeFeedback("Nota adicionada.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-incident-action-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A guardar ação…");
    try{await collaborative.saveIncidentAction(form.dataset.actionId||null,form.dataset.incidentId,{title:values.title,description:values.description||null,status:values.status,priority:values.priority,assignedTo:values.assignedTo||null,dueAt:values.dueAt||null});setCollaborativeFeedback("Ação guardada.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelectorAll("[data-continuity-exercise-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();const values=formValues(form);setCollaborativeFeedback("A guardar exercício…");
    try{await collaborative.saveContinuityExercise(form.dataset.exerciseId||null,{title:values.title,scenario:values.scenario,status:values.status,objectives:values.objectives,scheduledAt:values.scheduledAt||null,targetRtoMinutes:values.targetRtoMinutes,targetRpoMinutes:values.targetRpoMinutes,actualRecoveryMinutes:values.actualRecoveryMinutes,resultSummary:values.resultSummary||null,evidenceReference:values.evidenceReference||null,coordinatorUserId:values.coordinatorUserId||null});setCollaborativeFeedback("Exercício guardado.");}
    catch(error){setCollaborativeFeedback(error.message,true);}
  }));

  document.querySelector("[data-venue-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget,values=formValues(form);
    values.publicVisibility=Boolean(form.elements.publicVisibility?.checked);
    setCollaborativeFeedback("A guardar local…");
    try{
      await collaborative.saveVenue(form.dataset.venueId||null,values);
      go("/area-colaborativa/gestao/locais");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-exhibition-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget,values=formValues(form);
    values.publicVisibility=Boolean(form.elements.publicVisibility?.checked);
    values.publishNow=Boolean(form.elements.publishNow?.checked);
    setCollaborativeFeedback("A guardar exposição…");
    try{
      await collaborative.saveExhibition(form.dataset.exhibitionId||null,values);
      go("/area-colaborativa/gestao/exposicoes");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-schedule-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget,values=formValues(form);
    values.publicVisibility=Boolean(form.elements.publicVisibility?.checked);
    values.publishNow=Boolean(form.elements.publishNow?.checked);
    const conflictsTarget=document.querySelector("[data-schedule-conflicts]");
    setCollaborativeFeedback("A verificar datas e guardar…");
    try{
      const conflicts=await collaborative.saveSchedule(form.dataset.scheduleId||null,values);
      if(conflicts?.venueWarnings?.length&&conflictsTarget){
        conflictsTarget.innerHTML=`<div class="schedule-warning"><strong>Período guardado com aviso</strong><p>Existem ${conflicts.venueWarnings.length} ocupações sobrepostas no mesmo local. Confirme com o responsável do espaço.</p></div>`;
        setCollaborativeFeedback("Período guardado. Reveja o aviso de ocupação.");
      }else{
        go("/area-colaborativa/gestao/exposicoes");
      }
    }catch(error){
      if(conflictsTarget&&String(error.message).includes("overlap"))conflictsTarget.innerHTML='<div class="schedule-error"><strong>Conflito de itinerância</strong><p>A mesma exposição já possui um período sobreposto.</p></div>';
      setCollaborativeFeedback(error.message,true);
    }
  });

  document.querySelector("[data-agenda-event-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget,values=formValues(form);
    values.registrationRequired=Boolean(form.elements.registrationRequired?.checked);
    setCollaborativeFeedback("A guardar atividade…");
    try{
      await collaborative.saveAgendaEvent(form.dataset.eventId||null,values);
      go("/area-colaborativa/agenda");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-agenda-rsvp]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{
      await collaborative.rsvpEvent(button.dataset.eventId,button.dataset.agendaRsvp);
    }catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelector("[data-checklist-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget,values=formValues(form);
    setCollaborativeFeedback("A guardar item…");
    try{
      await collaborative.saveChecklistItem(null,form.dataset.scheduleId,values);
      form.reset();
      setCollaborativeFeedback("Item adicionado.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-schedule-publish]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{
      await collaborative.publishSchedule(button.dataset.schedulePublish,button.dataset.publish==="true");
    }catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelectorAll("[data-schedule-generate-tasks]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{
      await collaborative.generateLogisticsTasks(button.dataset.scheduleGenerateTasks);
      alert("Tarefas de montagem e desmontagem preparadas em rascunho.");
    }catch(error){alert(error.message);}finally{button.disabled=false;}
  }));


  for(const form of document.querySelectorAll("[data-public-contribution-form],[data-member-contribution-form]")){
    form.addEventListener("submit",async event=>{
      event.preventDefault();
      const publicForm=form.hasAttribute("data-public-contribution-form");
      const feedback=publicForm?setPublicContributionFeedback:setCollaborativeFeedback;
      const{payload,files}=contributionFormPayload(form);
      if(files.length>(state.collab.contributionModel?.limits?.maxFiles||5)){
        feedback("O número máximo de ficheiros foi ultrapassado.",true);return;
      }
      const maxFileBytes=Number(state.collab.contributionModel?.limits?.maxFileSizeBytes||10485760);
      const tooLarge=files.find(file=>file.size>maxFileBytes);
      if(tooLarge){
        feedback(`O ficheiro "${tooLarge.name}" excede o limite de 10 MB. Reduza-o e tente novamente.`,true);return;
      }
      feedback("A submeter o contributo e preparar os ficheiros…");
      try{
        const result=await collaborative.submitContribution(payload,files);
        if(publicForm){
          state.contributionSubmissionResult=result;
          render(false);
        }else{
          go(`/area-colaborativa/contributos/${result.contributionId}`);
        }
      }catch(error){feedback(error.message,true);}
    });
  }

  document.querySelector("[data-public-contribution-track-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const values=formValues(event.currentTarget);
    setPublicContributionFeedback("A consultar…");
    try{
      state.contributionTrackingResult=await collaborative.trackContribution(values.trackingCode?.trim(),values.email?.trim());
      render(false);
    }catch(error){state.contributionTrackingResult=null;setPublicContributionFeedback(error.message,true);}
  });

  document.querySelector("[data-public-withdrawal-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const values=formValues(event.currentTarget);
    setPublicContributionFeedback("A enviar o pedido…");
    try{
      state.contributionWithdrawalResult=await collaborative.requestContributionWithdrawal({
        trackingCode:values.trackingCode?.trim(),
        email:values.email?.trim().toLowerCase(),
        name:values.name?.trim(),
        reason:values.reason?.trim(),
        turnstileToken:null
      });
      render(false);
    }catch(error){setPublicContributionFeedback(error.message,true);}
  });

  document.querySelector("[data-contribution-moderation-filters]")?.addEventListener("submit",event=>{
    event.preventDefault();
    const values=formValues(event.currentTarget);
    state.collabContributionFilters={
      query:values.query||"",
      status:values.status||"",
      type:values.type||"",
      assignee:values.assignee||""
    };
    const query=new URLSearchParams(Object.entries(state.collabContributionFilters).filter(([,value])=>value));
    go(`/area-colaborativa/gestao/contributos${query.toString()?`?${query}`:""}`);
  });

  document.querySelector("[data-contribution-assignment-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget,values=formValues(form);
    setCollaborativeFeedback("A atribuir…");
    try{
      await collaborative.assignContribution(form.dataset.contributionId,values.reviewerUserId,values.assignmentRole,values.note||"");
      setCollaborativeFeedback("Atribuição guardada.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-contribution-moderation-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget,values=formValues(form);
    setCollaborativeFeedback("A registar a ação…");
    try{
      await collaborative.moderateContribution(form.dataset.contributionId,values.action,values.rationale,values.publicMessage||"");
      setCollaborativeFeedback("Ação registada.");
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelector("[data-incorporation-proposal-form]")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const form=event.currentTarget,values=formValues(form);
    setCollaborativeFeedback("A criar proposta…");
    try{
      await collaborative.createIncorporationProposal(form.dataset.contributionId,values.destination,values.targetIdentifier||"",values.summary);
      setCollaborativeFeedback("Proposta criada. O conteúdo canónico não foi alterado.");
      form.reset();
    }catch(error){setCollaborativeFeedback(error.message,true);}
  });

  document.querySelectorAll("[data-contribution-file-link]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{
      const result=await collaborative.getContributionFileLink(button.dataset.contributionFileLink);
      window.open(result.url,"_blank","noopener,noreferrer");
    }catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelectorAll("[data-contribution-file-review]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{
      const note=prompt("Nota técnica opcional:")||"";
      await collaborative.reviewContributionFile(button.dataset.fileId,button.dataset.contributionFileReview,note);
    }catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  document.querySelectorAll("[data-withdrawal-resolve]").forEach(button=>button.addEventListener("click",async()=>{
    button.disabled=true;
    try{
      const note=prompt("Registe a fundamentação desta decisão:")||"";
      await collaborative.resolveWithdrawal(button.dataset.requestId,button.dataset.withdrawalResolve,note);
    }catch(error){alert(error.message);}finally{button.disabled=false;}
  }));

  const form = document.querySelector("[data-filters]");
  if (form) {
    form.addEventListener("input", () => {
      state.filters = {...state.filters,...Object.fromEntries(new FormData(form).entries())};
      render(false);
    });
  }

  document.querySelector("[data-home-carousel-previous]")?.addEventListener("click", () => moveHomeCarousel(-1));
  document.querySelector("[data-home-carousel-next]")?.addEventListener("click", () => moveHomeCarousel(1));
  document.querySelectorAll("[data-home-carousel-index]").forEach(button =>
    button.addEventListener("click", () => {
      state.homeCarouselIndex = Number(button.dataset.homeCarouselIndex);
      render(false);
    })
  );
  document.querySelector("[data-home-carousel-pause]")?.addEventListener("click", () => {
    state.homeCarouselPaused = !state.homeCarouselPaused;
    render(false);
  });

  const carousel = document.querySelector("[data-home-carousel]");
  if (carousel && state.homeCarousel?.autoplay?.pauseOnHover) {
    carousel.addEventListener("mouseenter", clearHomeCarouselTimer);
    carousel.addEventListener("mouseleave", scheduleHomeCarousel);
  }
  if (carousel && state.homeCarousel?.autoplay?.pauseOnFocus) {
    carousel.addEventListener("focusin", clearHomeCarouselTimer);
    carousel.addEventListener("focusout", scheduleHomeCarousel);
  }

  document.querySelectorAll("[data-layout]").forEach(button =>
    button.addEventListener("click", () => {
      state.filters.layout = button.dataset.layout;
      localStorage.setItem("milreu-gallery-layout",state.filters.layout);
      render(false);
    })
  );

  document.querySelector("[data-reset-filters]")?.addEventListener("click", () => {
    const layout = state.filters.layout;
    state.filters = {query:"",period:"",type:"",dateKnown:"",intervention:"",sort:"catalog",layout};
    render(false);
  });

  document.querySelector("[data-toggle-immersive-info]")?.addEventListener("click", () => {
    state.immersiveInfo = !state.immersiveInfo;
    render(false);
  });

  document.querySelector("[data-browser-fullscreen]")?.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {
      console.warn("Fullscreen API indisponível",error);
    }
  });

  document.querySelectorAll("[data-close-immersive]").forEach(control =>
    control.addEventListener("click", event => {
      event.preventDefault();
      const route = getRoute();
      if (route.name === "immersive") closeImmersive(route.id);
    })
  );

  document.querySelectorAll("[data-immersive-portal]").forEach(control =>
    control.addEventListener("click", async event => {
      event.preventDefault();
      stopSlideshow();
      if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} }
      go("/");
    })
  );

  document.querySelectorAll("[data-slideshow-speed]").forEach(button =>
    button.addEventListener("click", () => {
      state.slideshowSpeed = Number(button.dataset.slideshowSpeed);
      render(false);
    })
  );

  document.querySelector("[data-slideshow-pause]")?.addEventListener("click", () => {
    stopSlideshow();
    render(false);
  });

  bindImmersiveKeyboard();
  scheduleSlideshow();
  scheduleHomeCarousel();
}

function bindImmersiveKeyboard() {
  if (immersiveKeyHandler) {
    document.removeEventListener("keydown",immersiveKeyHandler);
    immersiveKeyHandler = null;
  }

  const route = getRoute();
  if (route.name !== "immersive") {
    document.body.classList.remove("is-immersive");
    stopSlideshow();
    return;
  }

  document.body.classList.add("is-immersive");
  const list = state.records.filter(record => record.publication.siteVisible);
  const index = list.findIndex(record => record.id === route.id);
  const previous = list[(index-1+list.length)%list.length];
  const next = list[(index+1)%list.length];

  immersiveKeyHandler = async event => {
    const key = event.key.toLowerCase();
    if (event.key === "Escape") {
      event.preventDefault();
      await closeImmersive(route.id);
    }
    if (event.key === "ArrowLeft") go(`/museu/imersivo/${previous.id}`);
    if (event.key === "ArrowRight") go(`/museu/imersivo/${next.id}`);
    if (key === "i") {
      state.immersiveInfo = !state.immersiveInfo;
      render(false);
    }
    if (key === "f") {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch {}
    }
  };
  document.addEventListener("keydown",immersiveKeyHandler);
}

function render(scroll=true) {
  const route = getRoute();
  let html = "";

  switch (route.name) {
    case "collab-login":
    case "collab-callback":
    case "collab-dashboard":
    case "collab-profile":
    case "collab-tasks":
    case "collab-task-detail":
    case "collab-availability":
    case "collab-contributions":
    case "collab-contribution-new":
    case "collab-contribution-detail":
    case "collab-contribution-moderation":
    case "collab-contribution-moderation-detail":
    case "collab-agenda":
    case "collab-notifications":
    case "collab-notification-preferences":
    case "collab-system-administration":
    case "collab-audit-governance":
    case "collab-incidents-continuity":
    case "collab-incident-detail":
    case "collab-notification-management":
    case "collab-notification-templates":
    case "collab-library":
    case "collab-library-resource":
    case "collab-training":
    case "collab-training-trail":
    case "collab-museum-review":
    case "collab-museum-review-detail":
    case "collab-museum-review-preview":
    case "collab-museum-review-management":
    case "collab-museum-review-management-detail":
    case "collab-museum-review-management-preview":
    case "collab-museum-review-releases":
    case "collab-deployment-homologation":
    case "collab-homologation-run":
    case "collab-release-candidate":
    case "collab-profile-management":
    case "collab-member-detail":
    case "collab-invitations":
    case "collab-task-management":
    case "collab-task-new":
    case "collab-task-edit":
    case "collab-task-manage-detail":
    case "collab-exhibition-management":
    case "collab-venue-management":
    case "collab-venue-new":
    case "collab-venue-edit":
    case "collab-exhibition-new":
    case "collab-exhibition-edit":
    case "collab-exhibition-detail":
    case "collab-schedule-new":
    case "collab-schedule-detail":
    case "collab-agenda-event-new":
    case "collab-agenda-event-edit":
      html=renderCollaborativeRoute(route);
      setMetadata("Área Colaborativa");
      break;
    case "home": html = homeView(state.records,state.portal,state.homeCarousel,state.lang,{index:state.homeCarouselIndex,paused:state.homeCarouselPaused},state.publicContentEffects); setMetadata(text(state.lang,"homeTitle")); break;
    case "project": html = projectView(state.portal,state.lang); setMetadata(text(state.lang,"project")); break;
    case "methodology": html = methodologyView(state.portal,state.lang); setMetadata(text(state.lang,"methodology")); break;
    case "initiatives": html = initiativesView(state.portal,state.lang); setMetadata(text(state.lang,"initiatives")); break;
    case "initiative": html = initiativeDetailView(findInitiative(state.portal,route.slug),state.lang); setMetadata(route.slug); break;
    case "knowledge": html = knowledgeView(state.portal,state.lang); setMetadata(text(state.lang,"knowledge")); break;
    case "participate": html = participateView(state.portal,state.lang); setMetadata(text(state.lang,"participate")); break;
    case "public-contribution-new": html = publicContributionFormView(state.collab.contributionModel,state.lang,state.contributionSubmissionResult); setMetadata("Partilhar contributo"); break;
    case "public-contribution-track": html = publicContributionTrackingView(state.collab.contributionModel,state.lang,state.contributionTrackingResult); setMetadata("Acompanhar contributo"); break;
    case "public-contribution-withdrawal": html = publicWithdrawalView(state.collab.contributionModel,state.lang,state.contributionWithdrawalResult); setMetadata("Pedido de retirada"); break;
    case "about": html = aboutView(state.portal,state.lang); setMetadata(text(state.lang,"about")); break;
    case "public-exhibitions": html = publicExhibitionsView(state.publicExhibitions,state.lang); setMetadata("Agenda da exposição"); break;
    case "public-transparency": html = publicTransparencyView(state.publicTransparency||{}); setMetadata("Transparência"); break;
    case "channel-lab": html = channelLabView(state.channelRecords,state.channelConfig,state.lang); setMetadata("Laboratório multicanal"); break;
    case "totem-preview": html = totemPreviewView(findChannelRecord(state.channelRecords,route.id),state.channelConfig,state.lang); setMetadata(`Totem ${route.id}`); break;
    case "panel-preview": html = panelPreviewView(findChannelRecord(state.channelRecords,route.id),state.channelConfig,state.lang); setMetadata(`Painel ${route.id}`); break;
    case "museum-home": html = museumHome(state.records,state.collections,state.audit,state.lang,state.publicContentEffects); setMetadata(text(state.lang,"museumTitle")); break;
    case "gallery": html = galleryView(state.records,state.museumIndex,state.lang,state.filters); setMetadata(text(state.lang,"gallery")); break;
    case "timeline": html = timelineView(state.records,state.lang); setMetadata(text(state.lang,"timeline")); break;
    case "collections": html = collectionsView(state.records,state.collections,state.lang); setMetadata(text(state.lang,"collectionsLabel")); break;
    case "collection": html = collectionDetailView(state.records,findCollection(state.collections,route.slug),state.lang); setMetadata(route.slug); break;
    case "memory": {
      const record = findMemory(state.records,route.id);
      html = detailView(state.records,record,state.lang);
      setMetadata(record?.title?.[state.lang] || record?.title?.["pt-PT"] || route.id);
      break;
    }
    case "immersive": {
      const record = findMemory(state.records,route.id);
      html = immersiveView(state.records,record,state.lang,{
        immersiveInfo:state.immersiveInfo,
        slideshowSpeed:state.slideshowSpeed
      });
      setMetadata(record?.title?.[state.lang] || record?.title?.["pt-PT"] || route.id);
      break;
    }
    default: html = notFoundView(state.lang); setMetadata(text(state.lang,"notFound"));
  }

  app.innerHTML = html;
  bindPage();
  if (scroll) window.scrollTo(0,0);
}

async function start() {
  try {
    [state.records,state.portal,state.homeCarousel,state.publicExhibitions,state.publicContentEffects,state.collections,state.museumIndex,state.audit,state.channelConfig,state.channelRecords] = await Promise.all([
      loadMemories(),loadPortalContent(),loadHomeCarousel(),loadPublicExhibitions(),loadPublicContentEffects(),loadMuseumCollections(),loadMuseumIndex(),loadMuseumAudit(),loadChannelConfig(),loadChannelRecords()
    ]);
    state.collab=await collaborative.init();
    collaborative.subscribe(context=>{
      state.collab=context;
      if (isCollaborativeRoute(getRoute())) render(false);
    });
    render();
  } catch (error) {
    console.error(error);
    app.innerHTML = `<main class="app-error"><h1>Não foi possível iniciar a aplicação</h1><p>${error.message}</p></main>`;
  }
}

window.addEventListener("hashchange",() => render());
start();
