/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { text, languages, languageAvailability, languageNames } from "../lib/i18n.js";
import { assetUrl } from "../lib/data.js";

// 09B/09D: só pt-PT é selecionável; EN/ES/FR aparecem como "em preparação" (desativados),
// sem navegação falsa nem fallback silencioso. A disponibilidade real por rota vive em
// public/data/locale-availability.json (ver localeAvailableForRoute). O grupo é descrito
// por uma nota acessível que explica que o conteúdo continua em português e que não há
// tradução automática publicada. Acessível a leitores de ecrã.
export function languageSwitcher(lang) {
  const inPrep = text(lang, "languageInPreparation");
  const note = text(lang, "languageInPreparationNote");
  return `<div class="language-switcher" role="group" aria-label="${text(lang, "languageLabel")}" aria-describedby="language-switcher-note">${
    languages.map(code => {
      const label = code.replace("pt-PT", "PT").toUpperCase();
      const enabled = languageAvailability[code]?.selectorEnabled;
      if (enabled) {
        return `<button type="button" class="language-switcher__option" data-language="${code}" ${code===lang?'aria-current="true"':''} aria-pressed="${code===lang}">${label}</button>`;
      }
      return `<button type="button" class="language-switcher__option language-switcher__option--preparation" data-language-disabled="${code}" disabled aria-disabled="true" aria-label="${languageNames[code]||label} — ${inPrep}" title="${languageNames[code]||label} — ${inPrep}"><span aria-hidden="true">${label}</span><small>${inPrep}</small></button>`;
    }).join("")
  }<p id="language-switcher-note" class="language-switcher__note" data-locale-note>${note}</p></div>`;
}

export function portalHeader(lang, current="") {
  const links = [
    ["/projeto","project"],
    ["/metodologia","methodology"],
    ["/iniciativas","initiatives"],
    ["/museu","museum"],
    ["/conhecimento","knowledge"],
    ["/participar","participate"],
    ["/sobre","about"],
    ["/area-colaborativa","collaborativeArea"]
  ];
  const nav = links.map(([path,key]) =>
    `<a href="#${path}" ${current===path?'aria-current="page"':''}>${text(lang,key)}</a>`
  ).join("");

  return `<header class="site-header">
    <div class="site-header__inner">
      <a class="site-brand" href="#/" aria-label="Projeto Comunitário de Milreu">
        <img src="${assetUrl("public/brand/symbol.webp")}" alt="">
        <span>Projeto Comunitário de Milreu</span>
      </a>
      <span class="preview-status">${text(lang,"preliminary")}</span>
      <nav class="primary-nav" aria-label="Principal">${nav}</nav>
      <div class="header-actions">
        <button class="icon-button mobile-menu-button" data-menu aria-label="Abrir menu">
          <img src="${assetUrl("public/icons/menu.svg")}" alt="">
        </button>
        ${languageSwitcher(lang)}
      </div>
    </div>
    <nav class="mobile-drawer" data-drawer data-open="false" aria-label="Menu móvel">${nav}</nav>
  </header>`;
}

export function museumHeader(lang, current="") {
  const links = [
    ["/museu/explorar","explore"],
    ["/museu/linha-do-tempo","timeline"],
    ["/museu/colecoes","collectionsLabel"]
  ];
  const nav = links.map(([path,key]) =>
    `<a href="#${path}" ${current===path?'aria-current="page"':''}>${text(lang,key)}</a>`
  ).join("");

  return `<header class="museum-header">
    <div class="museum-header__inner">
      <a class="museum-brand" href="#/museu">
        <img src="${assetUrl("public/brand/symbol.webp")}" alt="">
        <span>Museu de Memórias</span>
      </a>
      <nav class="museum-nav" aria-label="Museu">${nav}</nav>
      <button class="icon-button mobile-menu-button" data-menu aria-label="Abrir menu">
        <img src="${assetUrl("public/icons/menu.svg")}" alt="">
      </button>
      ${languageSwitcher(lang)}
    </div>
    <nav class="mobile-drawer" data-drawer data-open="false">${nav}</nav>
  </header>
  <a class="museum-return-floating" href="#/" aria-label="${text(lang,"backProject")}">
    <img src="${assetUrl("public/icons/back.svg")}" alt="">
    <span>${text(lang,"backProject")}</span>
  </a>`;
}

export function footer(lang="pt-PT") {
  return `<footer class="ml-project-footer">
    <div class="ml-project-footer__inner">
      <div>
        <p><strong>Projeto Comunitário de Milreu</strong></p>
        <p>© 2026 Fernando Rodrigues de Jácomo.</p>
        <p>Fotografias: consultar créditos de cada memória.</p>
      </div>
      <div>
        <p>Pré-visualização editorial · não indexável</p>
        <p><a href="#/museu">${text(lang,"museum")}</a> · <a href="#/participar">${text(lang,"participate")}</a></p>
      </div>
    </div>
  </footer>`;
}

export function bindCommon(setLanguage) {
  document.querySelectorAll("[data-language]").forEach(btn =>
    btn.addEventListener("click", () => setLanguage(btn.dataset.language))
  );
  document.querySelectorAll("[data-menu]").forEach(btn =>
    btn.addEventListener("click", () => {
      const drawer = document.querySelector("[data-drawer]");
      const open = drawer?.dataset.open !== "true";
      if (drawer) drawer.dataset.open = String(open);
      btn.setAttribute("aria-expanded", String(open));
    })
  );
}
