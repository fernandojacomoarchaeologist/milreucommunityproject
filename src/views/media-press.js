/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Media / Press — área pública (escopo adicional do Item 2, consome Item 9).
 * Rights gate: nenhum download de activo cujo uso correspondente não seja YES.
 */
import { portalHeader, footer } from "../components/layout.js";
import { assetUrl } from "../lib/data.js";

const esc = v => String(v ?? "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

function downloadButton(url, label, format) {
  return `<a class="ml-button ml-button--primary resource-card__dl" href="${esc(assetUrl(url))}" download data-analytics="press_document_download">
    ${esc(label)}${format ? ` <span aria-hidden="true">· ${esc(format)}</span>` : ""}</a>`;
}

function documentCard(doc) {
  const meta = [doc.format, doc.version, doc.note].filter(Boolean).map(esc).join(" · ");
  return `<article class="resource-card">
    <h3>${esc(doc.title)}</h3>
    ${meta ? `<p class="resource-card__meta">${meta}</p>` : ""}
    ${doc.downloadEnabled
      ? downloadButton(doc.fileUrl, "Descarregar", doc.format)
      : `<p class="resource-card__gated" role="note"><span aria-hidden="true">🔒 </span>${esc(doc.reason || "Em validação de direitos.")}</p>`}
  </article>`;
}

export function mediaPressView(media, lang = "pt-PT") {
  const m = media || {};
  const about = m.about || {};
  const contacts = m.contacts || {};
  const docs = m.documents || [];
  const pressImages = m.pressImages || [];
  const hostAssets = m.hostAssets || [];
  const empty = m.emptyStates || {};
  const enq = m.enquadramento2026 || null;
  return `${portalHeader(lang, "")}<main id="main" class="media-press">
    <section class="page-lead">
      <span>Projeto Comunitário de Milreu</span>
      <h1>Media / Press</h1>
      <p>Recursos oficiais para imprensa, parceiros e espaços anfitriões.</p>
      <div class="page-lead__actions">
        ${m.kit?.downloadEnabled ? downloadButton(m.kit.fileUrl, "Descarregar kit", m.kit.format) : ""}
        <a class="ml-button ml-button--secondary" href="#/identidade">Ver identidade visual</a>
        <a class="ml-button ml-button--secondary" href="#/direitos">Direitos e créditos</a>
      </div>
      <p class="muted">Utilização sujeita às condições de cada activo. Ver <a href="#/direitos">Direitos, créditos e reutilização</a>: conteúdo original do projecto em CC BY 4.0 quando indicado; conteúdos de terceiros mantêm créditos/licenças próprias.</p>
    </section>

    <section class="content-section" aria-labelledby="mp-sobre">
      <div class="section-heading"><h2 id="mp-sobre">Sobre o projecto</h2></div>
      <p class="media-press__lead-text">${esc(about.short50)}</p>
      ${about.full250 ? `<details class="media-press__more"><summary>Ler descrição completa</summary><div>${about.full250.split("\n\n").map(p=>`<p>${esc(p)}</p>`).join("")}</div></details>` : ""}
    </section>

    ${enq ? `<section class="content-section" aria-labelledby="mp-enq">
      <div class="section-heading"><h2 id="mp-enq">${esc(enq.identifier)}</h2><p>${esc(enq.initiativesLine)}</p></div>
      <p class="media-press__lead-text">${esc(enq.explanation)}</p>
      ${enq.note ? `<p class="muted">${esc(enq.note)}</p>` : ""}
    </section>` : ""}

    <section class="content-section content-section--muted" aria-labelledby="mp-docs">
      <div class="section-heading"><h2 id="mp-docs">Documentos</h2><p>Textos e documentos oficiais.</p></div>
      <div class="resource-grid">${docs.map(documentCard).join("")}</div>
    </section>

    <section class="content-section" aria-labelledby="mp-fotos">
      <div class="section-heading"><h2 id="mp-fotos">Fotografias para imprensa</h2></div>
      ${pressImages.length
        ? `<div class="resource-grid">${pressImages.map(img=>`<article class="resource-card"><h3>${esc(img.title)}</h3><p class="resource-card__meta">${esc([img.datePeriod,img.credit].filter(Boolean).join(" · "))}</p></article>`).join("")}</div>`
        : `<div class="rights-empty" role="note"><p>${esc(empty.pressImages || "As fotografias para redistribuição editorial encontram-se em validação de direitos.")}</p></div>`}
    </section>

    <section class="content-section content-section--muted" aria-labelledby="mp-host">
      <div class="section-heading"><h2 id="mp-host">Recursos para espaços anfitriões</h2></div>
      ${hostAssets.length
        ? `<div class="resource-grid">${hostAssets.map(a=>`<article class="resource-card"><h3>${esc(a.title)}</h3>${a.downloadEnabled?downloadButton(a.fileUrl,"Descarregar",a.format):`<p class="resource-card__gated" role="note">${esc(a.reason||"Em validação.")}</p>`}</article>`).join("")}</div>`
        : `<div class="rights-empty" role="note"><p>${esc(empty.hostAssets || "Os materiais para espaços anfitriões estão a ser preparados.")}</p></div>`}
    </section>

    <section class="content-section" aria-labelledby="mp-logos">
      <div class="section-heading"><h2 id="mp-logos">Logótipos</h2></div>
      <p>Logótipo oficial e regras de uso da marca na página de <a href="#/identidade">Identidade visual</a>.</p>
    </section>

    <section class="content-section content-section--muted" aria-labelledby="mp-contactos">
      <div class="section-heading"><h2 id="mp-contactos">Contactos</h2></div>
      <ul class="contact-block">
        <li><a href="${esc(contacts.siteUrl)}">${esc(contacts.site)}</a></li>
        <li><a href="mailto:${esc(contacts.email1)}">${esc(contacts.email1)}</a></li>
        <li><a href="mailto:${esc(contacts.email2)}">${esc(contacts.email2)}</a></li>
        <li><a href="tel:+351${esc((contacts.phone||"").replace(/\\s/g,""))}">${esc(contacts.phone)}</a></li>
      </ul>
    </section>
  </main>${footer(lang)}`;
}
