/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Estatística de visitas (Umami Cloud, sem cookies) — decisão do responsável 2026-10-13.
 * Desligada por omissão (public/config/analytics.runtime.json: enabled=false, websiteId=null).
 * Só corre no domínio público configurado; respeita «Do Not Track»; não segue a Área Colaborativa.
 * Funil: visita (página vista) → museu | agenda | inquérito (eventos abaixo).
 */
import { assetUrl } from "./data.js";

export const FUNNEL_EVENTS = {
  museum: "funil-museu",
  agenda: "funil-agenda",
  survey: "funil-inquerito"
};
const SURVEY_HOST = "surveymonkey.com";
let config = null, active = false, ready = false, lastPath = null;
const queue = [];

export function isTrackedRoute(route) {
  return !route.name.startsWith("collab-") && route.name !== "channel-lab";
}

export function funnelStep(route) {
  if (["museum","gallery","timeline","collections","collection","memory","immersive"].includes(route.name)) return FUNNEL_EVENTS.museum;
  if (["public-exhibitions","public-exhibition-entry"].includes(route.name)) return FUNNEL_EVENTS.agenda;
  return null;
}

export function analyticsAllowed(cfg, hostname, doNotTrack) {
  if (!cfg?.enabled || !cfg.websiteId || !/^https:\/\/[^/]+\/.+\.js$/.test(cfg.scriptUrl || "")) return false;
  if (!(cfg.domains || []).includes(hostname)) return false;
  if (cfg.respectDoNotTrack !== false && (doNotTrack === "1" || doNotTrack === "yes")) return false;
  return true;
}

export async function initAnalytics() {
  try {
    const response = await fetch(assetUrl("public/config/analytics.runtime.json"), { cache: "no-store" });
    config = response.ok ? await response.json() : null;
  } catch { config = null; }
  active = analyticsAllowed(config, location.hostname, navigator.doNotTrack || window.doNotTrack);
  if (!active) return false;
  const script = document.createElement("script");
  script.defer = true;
  script.src = config.scriptUrl;
  script.dataset.websiteId = config.websiteId;
  script.dataset.autoTrack = "false";
  script.dataset.domains = config.domains.join(",");
  if (config.respectDoNotTrack !== false) script.dataset.doNotTrack = "true";
  script.addEventListener("load", () => { ready = true; queue.splice(0).forEach(run => run()); });
  document.head.append(script);
  return true;
}

export const analyticsActive = () => active;

function send(run) {
  if (!active) return;
  if (ready && window.umami) run(); else queue.push(run);
}

// Chamado a cada render; só conta quando o endereço muda (re-render de idioma/tema/relógio não conta).
export function trackRoute(route) {
  if (!active || !isTrackedRoute(route)) return;
  const path = `/${location.hash.replace(/^#\/?/, "").split("?")[0]}`;
  if (path === lastPath) return;
  lastPath = path;
  send(() => window.umami.track(props => ({ ...props, url: path, title: document.title })));
  const step = funnelStep(route);
  if (step) send(() => window.umami.track(step));
}

export function bindSurveyTracking(root = document) {
  if (!active) return;
  root.querySelectorAll(`a[href*="${SURVEY_HOST}"]`).forEach(link =>
    link.addEventListener("click", () => send(() => window.umami.track(FUNNEL_EVENTS.survey))));
}
