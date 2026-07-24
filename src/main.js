/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import {
  loadMemories, loadPortalContent, loadMuseumCollections, loadMuseumIndex, loadMuseumAudit,
  findMemory, findInitiative, findCollection, loadChannelConfig, loadChannelRecords, findChannelRecord, loadHomeCarousel
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
  collaborativeProfileView, collaborativeSkeletonView, collaborativeAgendaView,
  collaborativeProfileManagementView, collaborativeMemberDetailView, collaborativeInvitationsView, collaborativeExhibitionManagementView
} from "./views/collaborative.js";
import {
  collaborativeTasksView, collaborativeTaskDetailView, collaborativeAvailabilityView,
  collaborativeTaskManagementView, collaborativeTaskEditorView
} from "./views/collaborative-tasks.js";

const app = document.querySelector("#app");
const state = {
  records: [],
  portal: null,
  homeCarousel: null,
  homeCarouselIndex: 0,
  homeCarouselPaused: false,
  collections: [],
  museumIndex: [],
  audit: null,
  channelConfig: null,
  channelRecords: [],
  collab: {ready:false,authenticated:false,mode:"demo"},
  collabTaskFilters: {query:"",category:"",location:""},
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
  const context=state.collab;
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
      return collaborativeSkeletonView(context,"contributions");
    case "collab-agenda":
      return collaborativeAgendaView(context);
    case "collab-library":
      return collaborativeSkeletonView(context,"library");
    case "collab-training":
      return collaborativeSkeletonView(context,"training");
    case "collab-museum-review":
      return collaborativeSkeletonView(context,"museum-review");
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
    case "collab-agenda":
    case "collab-library":
    case "collab-training":
    case "collab-museum-review":
    case "collab-profile-management":
    case "collab-member-detail":
    case "collab-invitations":
    case "collab-task-management":
    case "collab-task-new":
    case "collab-task-edit":
    case "collab-task-manage-detail":
    case "collab-exhibition-management":
      html=renderCollaborativeRoute(route);
      setMetadata("Área Colaborativa");
      break;
    case "home": html = homeView(state.records,state.portal,state.homeCarousel,state.lang,{index:state.homeCarouselIndex,paused:state.homeCarouselPaused}); setMetadata(text(state.lang,"homeTitle")); break;
    case "project": html = projectView(state.portal,state.lang); setMetadata(text(state.lang,"project")); break;
    case "methodology": html = methodologyView(state.portal,state.lang); setMetadata(text(state.lang,"methodology")); break;
    case "initiatives": html = initiativesView(state.portal,state.lang); setMetadata(text(state.lang,"initiatives")); break;
    case "initiative": html = initiativeDetailView(findInitiative(state.portal,route.slug),state.lang); setMetadata(route.slug); break;
    case "knowledge": html = knowledgeView(state.portal,state.lang); setMetadata(text(state.lang,"knowledge")); break;
    case "participate": html = participateView(state.portal,state.lang); setMetadata(text(state.lang,"participate")); break;
    case "about": html = aboutView(state.portal,state.lang); setMetadata(text(state.lang,"about")); break;
    case "channel-lab": html = channelLabView(state.channelRecords,state.channelConfig,state.lang); setMetadata("Laboratório multicanal"); break;
    case "totem-preview": html = totemPreviewView(findChannelRecord(state.channelRecords,route.id),state.channelConfig,state.lang); setMetadata(`Totem ${route.id}`); break;
    case "panel-preview": html = panelPreviewView(findChannelRecord(state.channelRecords,route.id),state.channelConfig,state.lang); setMetadata(`Painel ${route.id}`); break;
    case "museum-home": html = museumHome(state.records,state.collections,state.audit,state.lang); setMetadata(text(state.lang,"museumTitle")); break;
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
    [state.records,state.portal,state.homeCarousel,state.collections,state.museumIndex,state.audit,state.channelConfig,state.channelRecords] = await Promise.all([
      loadMemories(),loadPortalContent(),loadHomeCarousel(),loadMuseumCollections(),loadMuseumIndex(),loadMuseumAudit(),loadChannelConfig(),loadChannelRecords()
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
