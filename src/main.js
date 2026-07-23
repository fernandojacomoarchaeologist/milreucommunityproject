/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { loadMemories, loadPortalContent, findMemory, findInitiative } from "./lib/data.js";
import { getRoute, go } from "./lib/router.js";
import { bindCommon } from "./components/layout.js";
import {
  homeView, projectView, methodologyView, initiativesView, initiativeDetailView,
  knowledgeView, participateView, aboutView, notFoundView
} from "./views/portal.js";
import {
  museumHome, galleryView, detailView, immersiveView, timelineView
} from "./views/museum.js";
import { text } from "./lib/i18n.js";

const app = document.querySelector("#app");
const state = {
  records: [],
  portal: null,
  lang: localStorage.getItem("milreu-language") || "pt-PT",
  filters: { query:"", period:"", type:"" }
};

function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem("milreu-language", lang);
  render();
}

function setMetadata(title) {
  document.documentElement.lang = state.lang;
  document.title = `${title} | Projeto Comunitário de Milreu`;
}

function bindPage() {
  bindCommon(setLanguage);
  const form = document.querySelector("[data-filters]");
  if (form) {
    form.addEventListener("input", () => {
      const data = new FormData(form);
      state.filters = Object.fromEntries(data.entries());
      render(false);
    });
  }

  if (getRoute().name === "immersive") {
    document.body.classList.add("is-immersive");
    const close = event => {
      if (event.key === "Escape") {
        const id = getRoute().id;
        go(`/museu/memorias/${id}`);
      }
    };
    document.addEventListener("keydown", close, { once:true });
  } else {
    document.body.classList.remove("is-immersive");
  }
}

function render(scroll=true) {
  const route = getRoute();
  let html = "";

  switch (route.name) {
    case "home":
      html = homeView(state.records, state.portal, state.lang);
      setMetadata(text(state.lang,"homeTitle"));
      break;
    case "project":
      html = projectView(state.portal, state.lang);
      setMetadata(text(state.lang,"project"));
      break;
    case "methodology":
      html = methodologyView(state.portal, state.lang);
      setMetadata(text(state.lang,"methodology"));
      break;
    case "initiatives":
      html = initiativesView(state.portal, state.lang);
      setMetadata(text(state.lang,"initiatives"));
      break;
    case "initiative":
      html = initiativeDetailView(findInitiative(state.portal, route.slug), state.lang);
      setMetadata(route.slug);
      break;
    case "knowledge":
      html = knowledgeView(state.portal, state.lang);
      setMetadata(text(state.lang,"knowledge"));
      break;
    case "participate":
      html = participateView(state.portal, state.lang);
      setMetadata(text(state.lang,"participate"));
      break;
    case "about":
      html = aboutView(state.portal, state.lang);
      setMetadata(text(state.lang,"about"));
      break;
    case "museum-home":
      html = museumHome(state.records, state.lang);
      setMetadata(text(state.lang,"museumTitle"));
      break;
    case "gallery":
      html = galleryView(state.records, state.lang, state.filters);
      setMetadata(text(state.lang,"gallery"));
      break;
    case "timeline":
      html = timelineView(state.records, state.lang);
      setMetadata(text(state.lang,"timeline"));
      break;
    case "memory": {
      const record = findMemory(state.records, route.id);
      html = detailView(state.records, record, state.lang);
      setMetadata(record?.title?.[state.lang] || record?.title?.["pt-PT"] || route.id);
      break;
    }
    case "immersive": {
      const record = findMemory(state.records, route.id);
      html = immersiveView(state.records, record, state.lang);
      setMetadata(record?.title?.[state.lang] || record?.title?.["pt-PT"] || route.id);
      break;
    }
    default:
      html = notFoundView(state.lang);
      setMetadata(text(state.lang,"notFound"));
  }

  app.innerHTML = html;
  bindPage();
  if (scroll) window.scrollTo(0,0);
}

async function start() {
  try {
    [state.records, state.portal] = await Promise.all([
      loadMemories(),
      loadPortalContent()
    ]);
    render();
  } catch (error) {
    console.error(error);
    app.innerHTML = `<main class="app-error"><h1>Não foi possível iniciar a aplicação</h1><p>${error.message}</p></main>`;
  }
}

window.addEventListener("hashchange", () => render());
start();
