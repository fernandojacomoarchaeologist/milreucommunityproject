/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { text, languages } from "../lib/i18n.js";
import { assetUrl } from "../lib/data.js";

export function languageSwitcher(lang) {
  return `<div class="language-switcher" role="group" aria-label="Idioma">${languages.map(code => `<button type="button" data-language="${code}" aria-pressed="${code===lang}">${code.replace("pt-PT","PT").toUpperCase()}</button>`).join("")}</div>`;
}
export function portalHeader(lang, current="") {
  const links=[["/projeto","project"],["/iniciativas","initiatives"],["/museu","museum"],["/conhecimento","knowledge"],["/participar","participate"]];
  const nav=links.map(([path,key])=>`<a href="#${path}" ${current===path?'aria-current="page"':''}>${text(lang,key)}</a>`).join("");
  return `<div class="preview-banner">${text(lang,"preliminary")} · conteúdos em revisão</div><header class="site-header"><div class="site-header__inner"><a class="site-logo" href="#/" aria-label="Projeto Comunitário de Milreu"><img src="${assetUrl("public/brand/logo-light.webp")}" alt="Projeto Comunitário de Milreu"></a><nav class="primary-nav" aria-label="Principal">${nav}</nav><div class="header-actions"><button class="icon-button mobile-menu-button" data-menu aria-label="Abrir menu"><img src="${assetUrl("public/icons/menu.svg")}" alt=""></button>${languageSwitcher(lang)}</div></div><nav class="mobile-drawer" data-drawer data-open="false" aria-label="Menu móvel">${nav}</nav></header>`;
}
export function museumHeader(lang, current="") {
  const links=[["/museu/explorar","explore"],["/museu/linha-do-tempo","timeline"]];
  const nav=links.map(([path,key])=>`<a href="#${path}" ${current===path?'aria-current="page"':''}>${text(lang,key)}</a>`).join("");
  return `<header class="museum-header"><div class="museum-header__inner"><a class="museum-brand" href="#/museu"><img src="${assetUrl("public/brand/symbol.webp")}" alt=""><span>Museu de Memórias</span></a><nav class="museum-nav" aria-label="Museu">${nav}</nav><a class="back-project" href="#/"><span>${text(lang,"backProject")}</span> ↗</a><button class="icon-button mobile-menu-button" data-menu aria-label="Abrir menu"><img src="${assetUrl("public/icons/menu.svg")}" alt=""></button>${languageSwitcher(lang)}</div><nav class="mobile-drawer" data-drawer data-open="false">${nav}<a href="#/">${text(lang,"backProject")}</a></nav></header>`;
}
export function footer() { return `<footer class="ml-project-footer"><div class="ml-project-footer__inner"><div><p><strong>Projeto Comunitário de Milreu</strong></p><p>© 2026 Fernando Rodrigues de Jácomo.</p><p>Fotografias: consultar créditos de cada memória.</p></div><p>Versão 07A · pré-visualização não indexável</p></div></footer>`; }
export function bindCommon(setLanguage) {
  document.querySelectorAll("[data-language]").forEach(btn=>btn.addEventListener("click",()=>setLanguage(btn.dataset.language)));
  document.querySelectorAll("[data-menu]").forEach(btn=>btn.addEventListener("click",()=>{const drawer=document.querySelector("[data-drawer]");const open=drawer?.dataset.open!=="true";if(drawer)drawer.dataset.open=String(open);btn.setAttribute("aria-expanded",String(open));}));
}
