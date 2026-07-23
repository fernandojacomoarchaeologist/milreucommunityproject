/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { portalHeader, footer } from "../components/layout.js";
import { memoryCard } from "../components/memory-card.js";
import { assetUrl } from "../lib/data.js";
import { localised, text } from "../lib/i18n.js";

const esc = (value="") => String(value).replace(/[&<>"]/g, char => ({
  "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;"
}[char]));

function fallbackNote(value, lang) {
  const result = localised(value, lang);
  return {
    value: result.value,
    note: result.fallback ? `<div class="fallback-note">${text(lang,"fallback")}</div>` : ""
  };
}

function pageLead(title, summary, lang, eyebrow="Projeto Comunitário de Milreu") {
  const local = fallbackNote(summary, lang);
  return `<section class="portal-page-hero">
    <div class="portal-page-hero__inner">
      <span class="eyebrow">${esc(eyebrow)}</span>
      <h1>${esc(title)}</h1>
      <p>${esc(local.value)}</p>
      ${local.note}
    </div>
  </section>`;
}

function initiativeCard(item, lang) {
  const title = fallbackNote(item.title, lang);
  const short = fallbackNote(item.short, lang);
  return `<article class="initiative-card">
    <div class="initiative-card__icon">
      <img src="${assetUrl(`public/icons/${item.icon}.svg`)}" alt="">
    </div>
    <span class="status-label">${text(lang,"status")}: ${esc(item.status)}</span>
    <h2>${esc(title.value)}</h2>
    ${title.note}
    <p>${esc(short.value)}</p>
    <a href="#/iniciativas/${item.slug}">${text(lang,"learnMore")} →</a>
  </article>`;
}


function actionLink(action,lang,className="ml-button ml-button--primary") {
  if (!action) return "";
  const label = localised(action.label,lang).value;
  const external = Boolean(action.external);
  const href = external ? action.href : `#${action.href}`;
  return `<a class="${className}" href="${esc(href)}" ${external ? 'target="_blank" rel="noopener noreferrer external"' : ""}>${esc(label)}${external ? " ↗" : ""}</a>`;
}

function homeCarouselSlide(slide,records,lang,isActive,index,total) {
  const title = localised(slide.title,lang);
  const description = localised(slide.description,lang);
  const eyebrow = localised(slide.eyebrow,lang);
  const activeClass = isActive ? " home-carousel__slide--active" : "";
  const ariaHidden = isActive ? "false" : "true";

  if (slide.kind === "museum-memory") {
    const memory = records.find(record => record.id === slide.memoryId) || records.find(record => record.publication.siteVisible);
    const credit = memory ? localised(memory.media.credit,lang).value : "";
    return `<article class="home-carousel__slide home-carousel__slide--image${activeClass}" data-home-slide="${index}" aria-hidden="${ariaHidden}">
      <div class="home-carousel__media">
        <img src="${assetUrl(memory.media.variants.immersive)}" alt="${esc(localised(memory.title,lang).value)}">
      </div>
      <div class="home-carousel__overlay"></div>
      <div class="home-carousel__content">
        <span class="eyebrow">${esc(eyebrow.value)}</span>
        <h1>${esc(title.value)}</h1>
        <p>${esc(description.value)}</p>
        <div class="hero-actions">
          ${actionLink(slide.primaryAction,lang)}
          ${actionLink(slide.secondaryAction,lang,"ml-button ml-button--secondary")}
        </div>
        <div class="hero-credit">${esc(credit)}</div>
      </div>
    </article>`;
  }

  if (slide.kind === "empty-state") {
    const labels = slide.emptyStateLabels || [];
    return `<article class="home-carousel__slide home-carousel__slide--proteus${activeClass}" data-home-slide="${index}" aria-hidden="${ariaHidden}">
      <div class="home-carousel__content">
        <span class="eyebrow">${esc(eyebrow.value)}</span>
        <h1>${esc(title.value)}</h1>
        <p>${esc(description.value)}</p>
        <div class="hero-actions">${actionLink(slide.primaryAction,lang)}</div>
      </div>
      <div class="proteus-empty-state" aria-label="Estrutura visual da Experiência Proteus">
        <div class="proteus-empty-state__core">
          <img src="${assetUrl("public/brand/symbol.webp")}" alt="">
          <strong>Milreu Proteus</strong>
          <span>base de conhecimento</span>
        </div>
        ${labels.map((label,nodeIndex) => `<span class="proteus-node proteus-node--${nodeIndex+1}">${esc(label)}</span>`).join("")}
      </div>
    </article>`;
  }

  return `<article class="home-carousel__slide home-carousel__slide--survey${activeClass}" data-home-slide="${index}" aria-hidden="${ariaHidden}">
    <div class="home-carousel__survey-copy">
      <span class="eyebrow">${esc(eyebrow.value)}</span>
      <h1>${esc(title.value)}</h1>
      <p>${esc(description.value)}</p>
      <div class="hero-actions">${actionLink(slide.primaryAction,lang)}</div>
    </div>
    <div class="home-carousel__survey-image">
      <img src="${assetUrl(slide.image)}" alt="${esc(localised(slide.imageAlt,lang).value)}">
    </div>
  </article>`;
}

function homeCarousel(records,carousel,lang,state={}) {
  const slides = carousel.slides || [];
  const activeIndex = Math.max(0,Math.min(Number(state.index || 0),slides.length-1));
  return `<section class="home-carousel" data-home-carousel aria-roledescription="carousel" aria-label="Destaques do Projeto Comunitário de Milreu">
    <div class="home-carousel__viewport" aria-live="polite">
      ${slides.map((slide,index) => homeCarouselSlide(slide,records,lang,index===activeIndex,index,slides.length)).join("")}
    </div>
    <button type="button" class="home-carousel__arrow home-carousel__arrow--previous" data-home-carousel-previous aria-label="${text(lang,"carouselPrevious")}">←</button>
    <button type="button" class="home-carousel__arrow home-carousel__arrow--next" data-home-carousel-next aria-label="${text(lang,"carouselNext")}">→</button>
    <div class="home-carousel__controls">
      <div class="home-carousel__dots" role="group" aria-label="${text(lang,"carouselSelect")}">
        ${slides.map((slide,index) => `<button type="button" data-home-carousel-index="${index}" aria-label="Destaque ${index+1} de ${slides.length}" aria-pressed="${index===activeIndex}"><span></span></button>`).join("")}
      </div>
      <button type="button" class="home-carousel__pause" data-home-carousel-pause aria-pressed="${Boolean(state.paused)}">${state.paused ? text(lang,"carouselResume") : text(lang,"carouselPause")}</button>
    </div>
  </section>`;
}


export function homeView(records, content, carousel, lang, carouselState={}) {
  const featured = records.filter(x => x.publication.siteVisible).slice(0,3);
  const initiatives = content.initiatives.slice(0,3);

  return `${portalHeader(lang)}
  <main id="main">
    ${homeCarousel(records,carousel,lang,carouselState)}

    <section class="content-section">
      <div class="section-heading section-heading--stacked">
        <h2>${text(lang,"currentInitiatives")}</h2>
        <p>O Portal apresenta as diferentes frentes do Projeto Comunitário de Milreu.</p>
      </div>
      <div class="initiative-grid">${initiatives.map(item => initiativeCard(item,lang)).join("")}</div>
      <p class="section-action"><a class="ml-button ml-button--secondary" href="#/iniciativas">${text(lang,"viewAll")}</a></p>
    </section>

    <section class="content-section">
      <div class="section-heading">
        <h2>${text(lang,"featured")}</h2>
        <p>${text(lang,"featuredLead")}</p>
      </div>
      <div class="memory-grid">${featured.map(x => memoryCard(x,lang)).join("")}</div>
      <p class="section-action"><a class="ml-button ml-button--primary" href="#/museu/explorar">${text(lang,"viewAll")}</a></p>
    </section>
  </main>${footer(lang)}`;
}

export function projectView(content, lang) {
  const project = content.project;
  const summary = fallbackNote(project.summary, lang);
  const objective = fallbackNote(project.objective, lang);

  return `${portalHeader(lang,"/projeto")}<main id="main">
    ${pageLead(text(lang,"project"), project.summary, lang)}
    <section class="content-section">
      <div class="project-objective">
        <span>${text(lang,"projectObjective")}</span>
        <p>${esc(objective.value)}</p>
        ${objective.note}
      </div>
      <div class="section-heading"><h2>${text(lang,"principles")}</h2><p>${esc(summary.value)}</p></div>
      <div class="principle-grid principle-grid--pillars">
        ${project.principles.map((item,index) => {
          const title = fallbackNote(item.title,lang);
          const description = fallbackNote(item.description,lang);
          return `<article class="principle-card principle-card--pillar">
            <span class="principle-number">${String(index+1).padStart(2,"0")}</span>
            <div class="principle-symbol" aria-hidden="true">${["↔","∞","◎"][index] || "•"}</div>
            <h2>${esc(title.value)}</h2>
            ${title.note}
            <p>${esc(description.value)}</p>
          </article>`;
        }).join("")}
      </div>
    </section>
    <section class="content-section content-section--muted">
      <div class="section-heading"><h2>${text(lang,"projectPath")}</h2><p>O calendário organiza a evolução da investigação e das ações públicas.</p></div>
      <div class="project-timeline">
        ${project.methodology.map(item => `<article><span>${esc(item.period)}</span><h3>${esc(localised(item.title,lang).value)}</h3><p>${esc(localised(item.description,lang).value)}</p></article>`).join("")}
      </div>
    </section>
  </main>${footer(lang)}`;
}

export function methodologyView(content, lang) {
  return `${portalHeader(lang,"/metodologia")}<main id="main">
    ${pageLead(text(lang,"methodology"), {
      "pt-PT":"A metodologia articula inquéritos, entrevistas, observação, oralidade histórica, ações públicas, curadoria e documentação estruturada."
    }, lang)}
    <section class="content-section">
      <div class="method-grid">
        <article><span>01</span><h2>Diagnóstico</h2><p>Inquéritos e observação para compreender relações com património, arqueologia e Milreu.</p></article>
        <article><span>02</span><h2>Escuta</h2><p>Entrevistas semiestruturadas e recolha de oralidade histórica com perfis diversificados.</p></article>
        <article><span>03</span><h2>Devolução pública</h2><p>Apresentação e discussão dos resultados, preservando perguntas, divergências e limites.</p></article>
        <article><span>04</span><h2>Co-construção</h2><p>Desenvolvimento de iniciativas que colocam a população no centro da discussão e da tomada de decisão.</p></article>
        <article><span>05</span><h2>Proveniência</h2><p>Registo de fontes, direitos, certeza, revisão e relações em cada conteúdo.</p></article>
        <article><span>06</span><h2>Avaliação</h2><p>Acompanhamento de participação, dificuldades, efeitos e possibilidades de continuidade.</p></article>
      </div>
    </section>
  </main>${footer(lang)}`;
}

export function initiativesView(content, lang) {
  return `${portalHeader(lang,"/iniciativas")}<main id="main">
    ${pageLead(text(lang,"initiatives"), {
      "pt-PT":"O Projeto Comunitário de Milreu reúne iniciativas digitais, presenciais, expositivas e de investigação."
    }, lang)}
    <section class="content-section">
      <div class="initiative-grid">${content.initiatives.map(item => initiativeCard(item,lang)).join("")}</div>
    </section>
  </main>${footer(lang)}`;
}

export function initiativeDetailView(item, lang) {
  if (!item) return notFoundView(lang);
  const title = fallbackNote(item.title,lang);
  const description = fallbackNote(item.description,lang);
  const museumAction = item.slug === "museu-de-memorias"
    ? `<p class="initiative-primary-action"><a class="ml-button ml-button--primary" href="#/museu">${text(lang,"accessMuseum")}</a></p>`
    : "";

  return `${portalHeader(lang,"/iniciativas")}<main id="main">
    ${pageLead(title.value, item.short, lang, `${text(lang,"initiatives")} · ${item.status}`)}
    <section class="content-section initiative-detail initiative-detail--single">
      <article class="initiative-detail__content">
        <h2>Enquadramento</h2>
        <p>${esc(description.value)}</p>
        ${description.note}
        ${museumAction}
      </article>
    </section>
  </main>${footer(lang)}`;
}

export function knowledgeView(content, lang) {
  const knowledge = content.knowledge;
  return `${portalHeader(lang,"/conhecimento")}<main id="main">
    ${pageLead(text(lang,"structuredKnowledge"), knowledge.summary, lang, "Milreu Proteus")}
    <section class="content-section">
      <div class="knowledge-grid">
        ${knowledge.categories.map(item => `<article class="knowledge-card"><img src="${assetUrl("public/icons/knowledge.svg")}" alt=""><h2>${esc(localised(item.title,lang).value)}</h2><p>${esc(localised(item.description,lang).value)}</p><span>Estrutura preparada · conteúdo futuro</span></article>`).join("")}
      </div>
      <div class="architecture-note"><h2>Fonte única</h2><p>As páginas públicas, o Museu, os totens e as futuras APIs deverão derivar dos mesmos registos canónicos.</p><p><a class="ml-button ml-button--secondary ml-button--on-dark" href="#/laboratorio/canais">Abrir laboratório multicanal</a></p></div>
    </section>
  </main>${footer(lang)}`;
}

export function participateView(content, lang) {
  return `${portalHeader(lang,"/participar")}<main id="main">
    ${pageLead(text(lang,"participate"), content.participation.summary, lang)}
    <section class="content-section">
      <div class="participation-grid">
        ${content.participation.methods.map(item => `<article><img src="${assetUrl("public/icons/community.svg")}" alt=""><h2>${esc(localised(item.title,lang).value)}</h2><p>${esc(localised(item.description,lang).value)}</p></article>`).join("")}
      </div>
      <div class="pending-contact" role="status"><strong>${text(lang,"contactPending")}</strong><p>Não foi criado um endereço fictício nem um formulário sem infraestrutura de moderação.</p></div>
    </section>
  </main>${footer(lang)}`;
}

export function aboutView(content, lang) {
  const about = content.about;
  return `${portalHeader(lang,"/sobre")}<main id="main">
    ${pageLead(text(lang,"about"), about.institutionalContext, lang)}
    <section class="content-section about-layout">
      <div><h2>Coordenação</h2><p>${esc(localised(about.coordination,lang).value)}</p></div>
      <div><h2>${text(lang,"organisations")}</h2><ul class="organisation-list">${about.organisations.map(item => `<li>${esc(item)}</li>`).join("")}</ul></div>
    </section>
  </main>${footer(lang)}`;
}

export function notFoundView(lang) {
  return `${portalHeader(lang)}<main id="main" class="content-section"><div class="ml-empty"><h1>${text(lang,"notFound")}</h1><p>A rota solicitada não existe nesta versão.</p><a class="ml-button ml-button--primary" href="#/">Início</a></div></main>${footer(lang)}`;
}
