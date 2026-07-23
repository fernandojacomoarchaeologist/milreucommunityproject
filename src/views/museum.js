/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { museumHeader, footer } from "../components/layout.js";
import { memoryCard } from "../components/memory-card.js";
import { assetUrl, suggestedMemories } from "../lib/data.js";
import { localised, text } from "../lib/i18n.js";

export function museumHome(records,collections,audit,lang) {
  const visible = records.filter(x => x.publication.siteVisible);
  const hero = visible[0];
  const featured = visible.slice(0,3);
  return `<div class="museum-shell">${museumHeader(lang)}
  <main id="main">
    <section class="museum-opening">
      <div class="museum-opening__image"><img src="${assetUrl(hero.media.variants.immersive)}" alt="${escapeHtml(localised(hero.title,lang).value)}"></div>
      <div class="museum-opening__content">
        <span class="eyebrow">Entre Ruínas e Memórias</span>
        <h1>${text(lang,"museumTitle")}</h1>
        <p>${text(lang,"museumLead")}</p>
        <div class="hero-actions">
          <a class="ml-button ml-button--primary" href="#/museu/explorar">${text(lang,"explore")}</a>
          <a class="ml-button ml-button--ghost-on-dark" href="#/museu/imersivo/${hero.id}">${text(lang,"openImmersive")}</a>
        </div>
      </div>
    </section>

    <section class="museum-dashboard">
      <div class="section-heading section-heading--dark">
        <span class="eyebrow">${text(lang,"museumStats")}</span>
        <h2>${visible.length} ${text(lang,"visibleRecords")}</h2>
      </div>
      <div class="museum-stat-grid">
        <div><strong>${audit.digitalInterventions.visibleRecords.length}</strong><span>${text(lang,"documentedInterventions")}</span></div>
        <div><strong>${collections.length}</strong><span>${text(lang,"collectionsLabel")}</span></div>
        <div><strong>${Object.keys(audit.primaryTypes).length}</strong><span>${text(lang,"type")}</span></div>
      </div>
    </section>

    <section class="museum-section">
      <div class="museum-section__heading"><div><span class="eyebrow">${text(lang,"collectionsLabel")}</span><h2>Percursos de exploração</h2></div><a href="#/museu/colecoes">${text(lang,"showAll")} →</a></div>
      <div class="museum-collection-grid">${collections.slice(0,4).map(collection => collectionCard(collection,records,lang)).join("")}</div>
    </section>

    <section class="museum-section">
      <div class="museum-section__heading"><div><span class="eyebrow">${text(lang,"gallery")}</span><h2>${text(lang,"featured")}</h2></div><a href="#/museu/explorar">${text(lang,"viewAll")} →</a></div>
      <div class="memory-grid">${featured.map(x => memoryCard(x,lang)).join("")}</div>
    </section>
  </main></div>`;
}

export function galleryView(records,indexRecords,lang,state={}) {
  const visible = records.filter(x => x.publication.siteVisible);
  const indexById = new Map(indexRecords.map(item => [item.id,item]));
  const types = [...new Set(visible.map(x => x.classification.primaryType).filter(Boolean))].sort();
  const periods = [...new Set(visible.map(x => localised(x.classification.period,"pt-PT").value).filter(Boolean))].sort();
  const query = (state.query || "").trim().casefold?.() || (state.query || "").trim().toLowerCase();

  let filtered = visible.filter(record => {
    const indexed = indexById.get(record.id);
    const searchMatch = !query || indexed?.searchable?.includes(query);
    const typeMatch = !state.type || record.classification.primaryType === state.type;
    const periodMatch = !state.period || localised(record.classification.period,"pt-PT").value === state.period;
    const dateMatch = !state.dateKnown ||
      (state.dateKnown === "known" && record.date.precision !== "unknown") ||
      (state.dateKnown === "unknown" && record.date.precision === "unknown");
    const interventionMatch = !state.intervention ||
      (state.intervention === "with" && record.media.digitalInterventions.length > 0) ||
      (state.intervention === "without" && record.media.digitalInterventions.length === 0);
    return searchMatch && typeMatch && periodMatch && dateMatch && interventionMatch;
  });

  const sort = state.sort || "catalog";
  if (sort === "oldest") filtered.sort(dateAscending);
  if (sort === "newest") filtered.sort((a,b) => dateAscending(b,a));
  if (sort === "catalog") filtered.sort((a,b) => a.id.localeCompare(b.id));

  const layout = state.layout === "list" ? "list" : "grid";
  const active = Object.entries(state).filter(([key,value]) => value && !["layout","sort"].includes(key));

  return `<div class="museum-shell">${museumHeader(lang,"/museu/explorar")}
  <main id="main" class="gallery-page">
    <div class="gallery-intro">
      <div><span class="eyebrow">Entre Ruínas e Memórias</span><h1>${text(lang,"gallery")}</h1></div>
      <div class="gallery-count" aria-live="polite">${filtered.length} ${text(lang,"results")} · ${text(lang,"resultsUpdated")}</div>
    </div>

    <form class="museum-filter-bar museum-filter-bar--expanded" data-filters>
      <div class="filter-field filter-field--search">
        <label for="memory-search">${text(lang,"search")}</label>
        <input id="memory-search" name="query" value="${escapeHtml(state.query||"")}" type="search" autocomplete="off">
      </div>
      ${selectField("period",text(lang,"period"),state.period,periods,text(lang,"all"))}
      ${selectField("type",text(lang,"type"),state.type,types,text(lang,"all"))}
      <div class="filter-field"><label for="memory-date">${text(lang,"datePrecision")}</label>
        <select id="memory-date" name="dateKnown">
          <option value="">${text(lang,"all")}</option>
          <option value="known" ${state.dateKnown==="known"?"selected":""}>${text(lang,"knownDate")}</option>
          <option value="unknown" ${state.dateKnown==="unknown"?"selected":""}>${text(lang,"unknownDate")}</option>
        </select>
      </div>
      <div class="filter-field"><label for="memory-intervention">${text(lang,"digitalIntervention")}</label>
        <select id="memory-intervention" name="intervention">
          <option value="">${text(lang,"all")}</option>
          <option value="with" ${state.intervention==="with"?"selected":""}>${text(lang,"withIntervention")}</option>
          <option value="without" ${state.intervention==="without"?"selected":""}>${text(lang,"withoutIntervention")}</option>
        </select>
      </div>
      <div class="filter-field"><label for="memory-sort">${text(lang,"sort")}</label>
        <select id="memory-sort" name="sort">
          <option value="catalog" ${sort==="catalog"?"selected":""}>${text(lang,"catalogOrder")}</option>
          <option value="oldest" ${sort==="oldest"?"selected":""}>${text(lang,"oldestFirst")}</option>
          <option value="newest" ${sort==="newest"?"selected":""}>${text(lang,"newestFirst")}</option>
        </select>
      </div>
      <input type="hidden" name="layout" value="${layout}">
    </form>

    <div class="gallery-tools">
      <div class="active-filter-list" aria-label="${text(lang,"activeFilters")}">
        ${active.length ? active.map(([key,value]) => `<span class="filter-chip">${escapeHtml(value)}</span>`).join("") : `<span>${text(lang,"showAll")}</span>`}
      </div>
      <div class="gallery-view-toggle">
        <button type="button" data-layout="grid" aria-pressed="${layout==="grid"}">${text(lang,"viewGrid")}</button>
        <button type="button" data-layout="list" aria-pressed="${layout==="list"}">${text(lang,"viewList")}</button>
        <button type="button" data-reset-filters>${text(lang,"resetFilters")}</button>
      </div>
    </div>

    <div class="memory-grid memory-grid--${layout}">
      ${filtered.length ? filtered.map(x => memoryCard(x,lang,{layout})).join("") : `<div class="ml-empty"><h3>${text(lang,"noResults")}</h3></div>`}
    </div>
  </main></div>`;
}

export function collectionsView(records,collections,lang) {
  return `<div class="museum-shell">${museumHeader(lang,"/museu/colecoes")}
  <main id="main" class="gallery-page">
    <div class="gallery-intro"><div><span class="eyebrow">${text(lang,"collectionDerived")}</span><h1>${text(lang,"collectionsLabel")}</h1></div></div>
    <div class="derived-notice">${text(lang,"suggestedNotice").replace("Sugestões","As coleções")}</div>
    <div class="museum-collection-grid museum-collection-grid--all">
      ${collections.map(collection => collectionCard(collection,records,lang)).join("")}
    </div>
  </main></div>`;
}

export function collectionDetailView(records,collection,lang) {
  if (!collection) return unavailableView(lang);
  const members = collection.members.map(id => records.find(r => r.id === id)).filter(Boolean);
  const title = localised(collection.title,lang);
  const description = localised(collection.description,lang);
  return `<div class="museum-shell">${museumHeader(lang,"/museu/colecoes")}
  <main id="main" class="gallery-page">
    <div class="collection-detail-heading">
      <span class="eyebrow">${text(lang,"collectionDerived")} · ${collection.memberCount} ${text(lang,"collectionMembers")}</span>
      <h1>${escapeHtml(title.value)}</h1>
      <p>${escapeHtml(description.value)}</p>
    </div>
    <div class="memory-grid">${members.map(record => memoryCard(record,lang)).join("")}</div>
  </main></div>`;
}

export function detailView(records,record,lang) {
  if (!record?.publication.siteVisible) return unavailableView(lang);
  const publicRecords = records.filter(x => x.publication.siteVisible);
  const index = publicRecords.findIndex(x => x.id === record.id);
  const previous = publicRecords[(index-1+publicRecords.length)%publicRecords.length];
  const next = publicRecords[(index+1)%publicRecords.length];
  const title = localised(record.title,lang);
  const short = localised(record.description.short,lang);
  const objective = localised(record.description.objective,lang);
  const community = localised(record.description.community,lang);
  const context = localised(record.description.historicalContext,lang);
  const institutional = localised(record.description.institutionalContext,lang);
  const credit = localised(record.media.credit,lang);
  const date = localised(record.date.display,lang);
  const place = record.places?.[0] ? localised(record.places[0].publicLabel,lang) : {value:""};
  const relationRecords = record.relations.map(id => records.find(x => x.id === id)).filter(x => x?.publication.siteVisible);
  const suggested = suggestedMemories(records,record,4);

  return `<div class="museum-shell">${museumHeader(lang)}
  <main id="main" class="memory-detail">
    <div class="memory-detail__visual">
      <img src="${assetUrl(record.media.variants.detail)}"
        srcset="${assetUrl(record.media.variants.card)} 900w, ${assetUrl(record.media.variants.detail)} 1600w, ${assetUrl(record.media.variants.immersive)} 2400w"
        sizes="(max-width:1024px) 100vw, 62vw" alt="${escapeHtml(title.value)}">
      <div class="visual-controls">
        <a class="ml-button ml-button--immersive" href="#/museu/imersivo/${record.id}">
          <img src="${assetUrl("public/icons/fullscreen.svg")}" alt=""> ${text(lang,"fullscreen")}
        </a>
      </div>
    </div>

    <article class="memory-detail__copy">
      <span class="eyebrow">${record.id} · ${text(lang,"preliminary")}</span>
      <h1>${escapeHtml(title.value)}</h1>
      ${title.fallback ? `<div class="fallback-note">${text(lang,"fallback")}</div>` : ""}
      <p class="memory-lead">${escapeHtml(short.value)}</p>

      <nav class="memory-local-nav" aria-label="${text(lang,"documentation")}">
        <a href="#record-description">${text(lang,"objective")}</a>
        <a href="#record-community">${text(lang,"community")}</a>
        <a href="#record-context">${text(lang,"context")}</a>
        <a href="#record-documentation">${text(lang,"documentation")}</a>
      </nav>

      <section id="record-description" class="memory-section">
        <h2>${text(lang,"objective")}</h2>
        <p>${escapeHtml(objective.value)}</p>
      </section>

      ${community.value ? `<section id="record-community" class="memory-section"><h2>${text(lang,"community")}</h2><div class="ml-community-voice"><blockquote>${escapeHtml(community.value)}</blockquote></div></section>` : ""}

      <section id="record-context" class="memory-section">
        <h2>${text(lang,"context")}</h2>
        ${context.value ? `<p>${escapeHtml(context.value)}</p>` : ""}
        ${institutional.value ? `<div class="institutional-context"><strong>Enquadramento institucional</strong><p>${escapeHtml(institutional.value)}</p></div>` : ""}
      </section>

      <section id="record-documentation" class="memory-section">
        <h2>${text(lang,"documentation")}</h2>
        <dl class="record-facts">
          <dt>${text(lang,"dateAndPlace")}</dt><dd>${escapeHtml(date.value || text(lang,"undated"))}${place.value ? ` · ${escapeHtml(place.value)}` : ""}</dd>
          <dt>${text(lang,"datePrecision")}</dt><dd>${escapeHtml(record.date.precision)}</dd>
          <dt>${text(lang,"type")}</dt><dd>${escapeHtml(record.classification.primaryType)}</dd>
          <dt>${text(lang,"editorialState")}</dt><dd>${escapeHtml(record.editorialStatus)}</dd>
        </dl>

        <h3>${text(lang,"tags")}</h3>
        <div class="record-tags">${record.classification.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div>

        ${digitalInterventionNotice(record,lang)}

        <h3>${text(lang,"sourceList")}</h3>
        <ol class="source-list">${record.sources.map(source => `<li><p>${escapeHtml(source.citation||"")}</p><span>${text(lang,"sourceAccess")}: ${escapeHtml(source.access||"")}</span></li>`).join("")}</ol>

        <div class="ml-provenance"><p><strong>Crédito:</strong> ${escapeHtml(credit.value)}</p></div>

        <div class="ml-rights">
          <h3>${text(lang,"rightsCorrection")}</h3>
          <p>${text(lang,"rightsCorrectionText")}</p>
          <a class="ml-correction" href="#/participar">${text(lang,"participate")} →</a>
        </div>
      </section>

      ${relationRecords.length ? `<section class="memory-section"><h2>${text(lang,"relatedExplicit")}</h2><div class="relation-card-grid">${relationRecords.map(x => compactRelationCard(x,lang)).join("")}</div></section>` : ""}

      ${suggested.length ? `<section class="memory-section"><h2>${text(lang,"suggestedExplore")}</h2><p class="derived-notice">${text(lang,"suggestedNotice")}</p><div class="relation-card-grid">${suggested.map(x => compactRelationCard(x,lang)).join("")}</div></section>` : ""}

      <nav class="memory-pagination" aria-label="Memórias">
        <a class="ml-button ml-button--secondary" href="#/museu/memorias/${previous.id}">← ${text(lang,"previous")}</a>
        <a class="ml-button ml-button--primary" href="#/museu/imersivo/${record.id}">${text(lang,"openImmersive")}</a>
        <a class="ml-button ml-button--secondary" href="#/museu/memorias/${next.id}">${text(lang,"next")} →</a>
      </nav>
    </article>
  </main></div>`;
}

export function immersiveView(records,record,lang,state={}) {
  if (!record?.publication.siteVisible) return unavailableView(lang);
  const list = records.filter(x => x.publication.siteVisible);
  const index = list.findIndex(x => x.id === record.id);
  const prev = list[(index-1+list.length)%list.length];
  const next = list[(index+1)%list.length];
  const neighbors = [-2,-1,0,1,2].map(offset => list[(index+offset+list.length)%list.length]);
  const infoOpen = state.immersiveInfo !== false;
  const slideshowSpeed = Number(state.slideshowSpeed || 0);

  return `<div class="immersive-view ${infoOpen ? "immersive-view--info" : "immersive-view--clean"}" role="dialog" aria-modal="true" aria-label="${escapeHtml(localised(record.title,lang).value)}">
    <div class="immersive-top">
      <div>
        <span class="immersive-position">${index+1}/${list.length} · ${record.id}</span>
        <span class="immersive-title">${escapeHtml(localised(record.title,lang).value)}</span>
      </div>
      <div class="immersive-actions">
        <div class="immersive-slideshow" role="group" aria-label="${text(lang,"slideshow")}">
          <span>${text(lang,"slideshow")}</span>
          <button type="button" data-slideshow-speed="1" aria-pressed="${slideshowSpeed===1}" title="15 segundos">x1</button>
          <button type="button" data-slideshow-speed="2" aria-pressed="${slideshowSpeed===2}" title="7 segundos">x2</button>
          <button type="button" data-slideshow-speed="3" aria-pressed="${slideshowSpeed===3}" title="4 segundos">x3</button>
          <button type="button" data-slideshow-pause aria-pressed="${slideshowSpeed===0}">${text(lang,"pauseSlideshow")}</button>
        </div>
        <button class="icon-button" data-toggle-immersive-info aria-pressed="${infoOpen}" aria-label="${infoOpen ? text(lang,"hideInfo") : text(lang,"immersiveInfo")}">i</button>
        <button class="icon-button" data-browser-fullscreen aria-label="${text(lang,"browserFullscreen")}"><img src="${assetUrl("public/icons/fullscreen.svg")}" alt=""></button>
        <button type="button" class="icon-button" data-close-immersive aria-label="${text(lang,"close")}"><img src="${assetUrl("public/icons/close.svg")}" alt=""></button>
      </div>
    </div>

    <div class="immersive-stage">
      <a class="immersive-side immersive-side--previous" href="#/museu/imersivo/${prev.id}" aria-label="${text(lang,"previous")}"><img src="${assetUrl("public/icons/back.svg")}" alt=""></a>
      <div class="immersive-frame"><img src="${assetUrl(record.media.variants.immersive)}" alt="${escapeHtml(localised(record.title,lang).value)}"></div>
      <a class="immersive-side immersive-side--next" href="#/museu/imersivo/${next.id}" aria-label="${text(lang,"next")}"><img src="${assetUrl("public/icons/forward.svg")}" alt=""></a>
      <aside class="immersive-info-panel">
        <h2>${escapeHtml(localised(record.title,lang).value)}</h2>
        <p>${escapeHtml(localised(record.channels.museum.introduction,lang).value)}</p>
        <dl>
          <dt>${text(lang,"dateAndPlace")}</dt><dd>${escapeHtml(localised(record.date.display,lang).value || text(lang,"undated"))}</dd>
          <dt>${text(lang,"type")}</dt><dd>${escapeHtml(record.classification.primaryType)}</dd>
        </dl>
        <p class="immersive-credit">${escapeHtml(localised(record.media.credit,lang).value)}</p>
        ${record.media.digitalInterventions.length ? `<p class="immersive-warning">${text(lang,"digitalNotice")}</p>` : ""}
      </aside>
    </div>

    <div class="immersive-bottom">
      <div class="immersive-filmstrip">${neighbors.map(item => `<a href="#/museu/imersivo/${item.id}" aria-current="${item.id===record.id ? "true" : "false"}"><img src="${assetUrl(item.media.variants.thumbnail)}" alt=""><span>${item.id}</span></a>`).join("")}</div>
      <div class="immersive-keyboard-help">${text(lang,"keyboardHelp")}</div>
    </div>
  </div>`;
}

export function timelineView(records,lang) {
  const list = records.filter(x => x.publication.siteVisible);
  const known = list.filter(x => x.date.precision !== "unknown").sort(dateAscending);
  const unknown = list.filter(x => x.date.precision === "unknown").sort((a,b) => a.id.localeCompare(b.id));
  return `<div class="museum-shell">${museumHeader(lang,"/museu/linha-do-tempo")}
  <main id="main" class="gallery-page">
    <div class="gallery-intro"><div><span class="eyebrow">Entre Ruínas e Memórias</span><h1>${text(lang,"timeline")}</h1></div><div class="gallery-count">${list.length} ${text(lang,"results")}</div></div>
    <section class="timeline-group"><h2>${text(lang,"timelineKnown")}</h2><div class="museum-timeline">${known.map(record => timelineItem(record,lang)).join("")}</div></section>
    <section class="timeline-group"><h2>${text(lang,"timelineUnknown")}</h2><div class="undated-grid">${unknown.map(record => compactRelationCard(record,lang)).join("")}</div></section>
  </main></div>`;
}

export function unavailableView(lang) {
  return `<div class="museum-shell">${museumHeader(lang)}<main id="main" class="unavailable"><div class="unavailable__box"><span class="eyebrow">Registo protegido</span><h1>${text(lang,"unavailable")}</h1><p>${text(lang,"unavailableText")}</p><a class="ml-button ml-button--primary" href="#/museu/explorar">${text(lang,"returnGallery")}</a></div></main></div>`;
}

function collectionCard(collection,records,lang) {
  const member = collection.members.map(id => records.find(r => r.id === id)).find(Boolean);
  const title = localised(collection.title,lang);
  const description = localised(collection.description,lang);
  return `<article class="museum-collection-card">
    <a class="museum-collection-card__media" href="#/museu/colecoes/${collection.slug}">${member ? `<img src="${assetUrl(member.media.variants.card)}" alt="">` : ""}</a>
    <div><span>${collection.memberCount} ${text(lang,"collectionMembers")}</span><h3><a href="#/museu/colecoes/${collection.slug}">${escapeHtml(title.value)}</a></h3><p>${escapeHtml(description.value)}</p></div>
  </article>`;
}

function compactRelationCard(record,lang) {
  return `<a class="relation-card" href="#/museu/memorias/${record.id}">
    <img src="${assetUrl(record.media.variants.thumbnail)}" alt="">
    <span><small>${record.id}</small>${escapeHtml(localised(record.title,lang).value)}</span>
  </a>`;
}

function digitalInterventionNotice(record,lang) {
  const interventions = record.media.digitalInterventions || [];
  if (!interventions.length) return "";
  return `<div class="digital-intervention-notice"><h3>${text(lang,"digitalNotice")}</h3>${interventions.map(item => `<article><strong>${escapeHtml(item.type)}</strong><p>${escapeHtml(localised(item.description,lang).value)}</p><span>Revisão humana: ${escapeHtml(item.humanReviewStatus||"")}</span></article>`).join("")}</div>`;
}

function timelineItem(record,lang) {
  return `<article class="museum-timeline__item">
    <span>${escapeHtml(localised(record.date.display,lang).value || record.date.start || "")}</span>
    <a href="#/museu/memorias/${record.id}">${escapeHtml(localised(record.title,lang).value)}</a>
  </article>`;
}

function selectField(name,label,value,options,allLabel) {
  return `<div class="filter-field"><label for="memory-${name}">${label}</label><select id="memory-${name}" name="${name}"><option value="">${allLabel}</option>${options.map(option => `<option value="${escapeHtml(option)}" ${option===value?"selected":""}>${escapeHtml(option)}</option>`).join("")}</select></div>`;
}

function dateAscending(a,b) {
  const av = a.date.start || "9999";
  const bv = b.date.start || "9999";
  return av.localeCompare(bv) || a.id.localeCompare(b.id);
}

function escapeHtml(value="") {
  return String(value).replace(/[&<>"]/g,char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
}
