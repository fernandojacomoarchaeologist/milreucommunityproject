/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Laboratório de jogos — arranque (SÓ em ambientes de teste/HML).
 * Carregado dinamicamente por src/main.js quando public/config/lab.runtime.json tem enabled:true
 * e o domínio não é o de produção. O build de produção remove src/lab, os dados e as imagens do
 * laboratório (scripts/build.mjs), por isso nada disto chega ao site público.
 * Fornece: o menu suspenso «Jogos» (à direita do cabeçalho), a página do laboratório e o jogo.
 */
import { ICONS } from "./games/detetives/icons.js";

const GAMES = [
  { id: "detetives-da-memoria", title: "Detetives da Memória", tagline: "Cada fotografia guarda uma história. Consegues descobri-la?", route: "/laboratorio/jogos/detetives-da-memoria", status: "Jogo de procurar · 3 fotografias do acervo" }
];
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

export function installLab({ setLabMenuRenderer, assetUrl, config }) {
  if (!document.querySelector("link[data-lab-css]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = assetUrl("src/lab/lab.css"); link.dataset.labCss = "";
    document.head.appendChild(link);
  }
  setLabMenuRenderer(menuHtml);
  // Um único ouvinte global fecha os menus abertos ao clicar fora (o cabeçalho é redesenhado a cada rota).
  document.addEventListener("click", event => {
    document.querySelectorAll("[data-lab-menu].is-open").forEach(menu => {
      if (menu.contains(event.target)) return;
      menu.classList.remove("is-open");
      menu.querySelector("[data-lab-menu-toggle]")?.setAttribute("aria-expanded", "false");
      menu.querySelector("[data-lab-menu-panel]")?.setAttribute("hidden", "");
    });
  });
  let game = null, dataPromise = null;
  const getJson = path => fetch(assetUrl(path)).then(r => (r.ok ? r.json() : null)).catch(() => null);
  // Jogabilidade (laboratório) + FONTE CANÓNICA do Museu (fichas e manifesto de imagens) + autorizações.
  const loadData = () => (dataPromise ||= Promise.all([
    getJson("public/data/lab/detetives-missions.json"), getJson("public/data/memories.json"),
    getJson("public/data/media-manifest.json"), getJson("public/data/lab/detetives-authorisations.json"),
    getJson("public/data/lab/detetives-derivados.json")
  ]));

  function menuHtml() {
    return `<div class="lab-menu" data-lab-menu>
      <button type="button" class="lab-menu__button" data-lab-menu-toggle aria-expanded="false" aria-controls="lab-menu-panel">${ICONS.jogos(20)}<span>Jogos</span>${ICONS.seta(16)}</button>
      <div class="lab-menu__panel" id="lab-menu-panel" data-lab-menu-panel hidden>
        <p class="lab-menu__eyebrow">Jogos e Descobertas · <span>versão de teste (${esc(config.environment || "hml")})</span></p>
        <ul>${GAMES.map(game => `<li><a class="lab-menu__item" href="#${game.route}">
          <span class="lab-menu__icon">${ICONS.lupa(26)}</span>
          <span><strong>${esc(game.title)}</strong><span>${esc(game.tagline)}</span><small>${esc(game.status)}</small></span></a></li>`).join("")}</ul>
        <a class="lab-menu__all" href="#/laboratorio/jogos">Ver o laboratório de jogos</a>
        <p class="lab-menu__note">Experiência em validação. Não está publicada no site público.</p>
      </div>
    </div>`;
  }

  function bindMenu(root = document) {
    root.querySelectorAll("[data-lab-menu]").forEach(menu => {
      const button = menu.querySelector("[data-lab-menu-toggle]"), panel = menu.querySelector("[data-lab-menu-panel]");
      const set = open => {
        button.setAttribute("aria-expanded", String(open)); panel.hidden = !open; menu.classList.toggle("is-open", open);
        // Se o painel sair do ecrã pela esquerda (botão perto do início da linha), abre para a direita.
        panel.classList.remove("lab-menu__panel--start");
        if (open && panel.getBoundingClientRect().left < 8) panel.classList.add("lab-menu__panel--start");
      };
      button.addEventListener("click", event => { event.stopPropagation(); set(panel.hidden); if (!panel.hidden) panel.querySelector("a")?.focus(); });
      panel.addEventListener("click", event => { if (event.target.closest("a")) set(false); });
      menu.addEventListener("keydown", event => { if (event.key === "Escape" && !panel.hidden) { set(false); button.focus(); } });
    });
  }

  const isLabRoute = route => route?.name === "lab-games" || route?.name === "lab-detetives";

  function shellHtml(route, header, foot) {
    if (route.name === "lab-games") {
      return `${header}<main id="main" class="lab-hub">
        <p class="dm-lab-flag">${ICONS.lupa(16)} Laboratório de jogos · versão de teste, não publicada</p>
        <h1>Jogos e Descobertas</h1>
        <p class="lab-hub__lead">Experiências para aprender a observar fotografias e memórias. Estão em validação e não fazem parte do site público.</p>
        <div class="lab-hub__grid">${GAMES.map(game => `<a class="lab-hub__card" href="#${game.route}"><span class="lab-hub__icon">${ICONS.lupa(40)}</span><strong>${esc(game.title)}</strong><span>${esc(game.tagline)}</span><small>${esc(game.status)}</small></a>`).join("")}</div>
      </main>${foot}`;
    }
    return `${header}<main id="main" class="dm" data-dm-root><p class="dm-loading" role="status">A preparar a lupa…</p></main>`;
  }

  async function mount(app, route) {
    unmount();
    if (route.name !== "lab-detetives") return;
    const root = app.querySelector("[data-dm-root]");
    const [{ createDetetivesGame }, { resolveMissions }, [catalog, memories, manifest, auth, derivados]] = await Promise.all([
      import("./games/detetives/game.js"), import("./games/detetives/editorial-adapter.js"), loadData()
    ]);
    if (!root.isConnected) return;
    const { missions, blocked } = resolveMissions(catalog, memories?.records || [], manifest || { items: [] }, auth?.authorisations || [], derivados || { items: [] });
    game = createDetetivesGame({ root, missions, blocked, assetUrl, lang: document.documentElement.lang || "pt-PT", query: route.query || {} });
  }

  function unmount() { game?.destroy(); game = null; }

  return { bindMenu, isLabRoute, shellHtml, mount, unmount };
}
