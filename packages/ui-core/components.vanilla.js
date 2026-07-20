/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Vanilla UI Core version: 0.1.0
 */

(function exposeMilreuDesignSystem(global) {
  "use strict";

  const allowedCertainty = new Set(["confirmed", "probable", "hypothesis"]);

  function textElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text ?? "";
    return element;
  }

  function createConfidenceDot({ status = "hypothesis", label = status } = {}) {
    const safeStatus = allowedCertainty.has(status) ? status : "hypothesis";
    const wrapper = document.createElement("span");
    wrapper.className = `ds-confidence ds-confidence--${safeStatus}`;
    wrapper.append(textElement("span", "ds-confidence__dot", ""));
    wrapper.append(textElement("span", "ds-confidence__label", label));
    return wrapper;
  }

  function createProvenanceNote({ eyebrow = "Proveniência", text = "" } = {}) {
    const aside = document.createElement("aside");
    aside.className = "ds-provenance-note";
    aside.append(textElement("p", "ds-provenance-note__eyebrow", eyebrow));
    aside.append(textElement("p", "ds-provenance-note__text", text));
    return aside;
  }

  function createFigureCard({ id = "EXAMPLE", title = "Exemplo", text = "Conteúdo demonstrativo.", imageSrc = "", imageAlt = "" } = {}) {
    const article = document.createElement("article");
    article.className = "ds-figure-card";

    const media = document.createElement("div");
    media.className = "ds-figure-card__media";
    if (imageSrc) {
      const image = document.createElement("img");
      image.src = imageSrc;
      image.alt = imageAlt;
      media.append(image);
    } else {
      media.textContent = "Placeholder demonstrativo — sem registo real";
    }

    const body = document.createElement("div");
    body.className = "ds-figure-card__body";
    body.append(textElement("span", "ds-figure-card__id", id));
    body.append(textElement("h3", "ds-figure-card__title", title));
    body.append(textElement("p", "ds-figure-card__text", text));
    article.append(media, body);
    return article;
  }

  function createRightsNotice({ title = "Direitos, correções ou remoção", text = "Esta memória integra um processo comunitário vivo." } = {}) {
    const aside = document.createElement("aside");
    aside.className = "ds-rights-notice";
    aside.append(textElement("h3", "ds-rights-notice__title", title));
    aside.append(textElement("p", "ds-rights-notice__text", text));
    return aside;
  }

  function createStatusBadge(text = "Beta") {
    return textElement("span", "ds-status-badge", text);
  }

  function createLanguageToggle({ languages = ["pt-PT", "en", "es", "fr"], active = "pt-PT", onChange } = {}) {
    const group = document.createElement("div");
    group.className = "ds-lang-toggle";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Idioma");

    languages.forEach((language) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = language === "pt-PT" ? "PT" : language.toUpperCase();
      button.dataset.language = language;
      button.setAttribute("aria-pressed", String(language === active));
      button.addEventListener("click", () => {
        group.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", "false"));
        button.setAttribute("aria-pressed", "true");
        if (typeof onChange === "function") onChange(language);
      });
      group.append(button);
    });
    return group;
  }

  function createStandardFooter({ year = new Date().getFullYear(), owner = "Fernando Rodrigues de Jácomo", project = "Projeto Comunitário de Milreu" } = {}) {
    const footer = document.createElement("footer");
    footer.className = "ds-standard-footer";
    footer.textContent = `© ${year} ${owner} — ${project}.`;
    return footer;
  }

  global.MilreuDS = Object.freeze({
    createConfidenceDot,
    createProvenanceNote,
    createFigureCard,
    createRightsNotice,
    createStatusBadge,
    createLanguageToggle,
    createStandardFooter
  });
})(window);
