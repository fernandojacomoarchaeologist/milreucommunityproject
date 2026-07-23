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

function bindPage() {
  bindCommon(setLanguage);

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
    render();
  } catch (error) {
    console.error(error);
    app.innerHTML = `<main class="app-error"><h1>Não foi possível iniciar a aplicação</h1><p>${error.message}</p></main>`;
  }
}

window.addEventListener("hashchange",() => render());
start();
