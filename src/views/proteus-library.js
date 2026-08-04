/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10B — Biblioteca Proteus (páginas públicas iniciais). Lê o snapshot público
 * (proteus-catalog-public.json), que começa VAZIO por decisão. Apenas obras/autores
 * 'published' aparecem. Estados de vazio, zero-resultados, erro e restrito são distintos
 * e honestos. Não mostra texto integral, notas internas, URLs privadas nem controlos
 * editoriais. Segue o design, i18n e SEO existentes.
 */
import { portalHeader, footer } from "../components/layout.js";
import { text } from "../lib/i18n.js";

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TYPE_LABELS = { article: "Artigo", book: "Livro", "book-chapter": "Capítulo", report: "Relatório", thesis: "Tese", "conference-paper": "Comunicação", dataset: "Conjunto de dados", other: "Documento" };
const ACCESS_LABELS = { open: "Acesso aberto", restricted: "Acesso restrito", metadata_only: "Apenas metadados", unknown: "Acesso por confirmar" };

// Bloco de licença + ligação de acesso. Distingue três situações sem inflar direitos:
// (1) acesso aberto comprovado (texto integral externo legal); (2) cópia disponibilizada
// externamente por terceiros com licença por confirmar (não implica reutilização);
// (3) registo bibliográfico institucional (sem texto integral).
function accessBlock(w) {
  const lic = w.reuseLicense || {};
  const licenseLine = lic.label && lic.label !== "unknown"
    ? `<p class="proteus-license">Licença de reutilização: <strong>${esc(lic.label)}</strong>${lic.uri ? ` — <a href="${esc(lic.uri)}" rel="noopener noreferrer external" target="_blank">${esc(lic.uri)} ↗</a>` : ""}${lic.verificationRequired ? ` <span class="proteus-flag">(versão/URI por confirmar)</span>` : ""}</p>`
    : `<p class="proteus-license">Licença de reutilização: <strong>por confirmar</strong>. A disponibilidade externa não implica direito de reutilização.</p>`;
  let link = "";
  if (w.openAccess && w.legalAccessUrl) {
    link = `<p><a class="ml-button ml-button--secondary" href="${esc(w.legalAccessUrl)}" rel="noopener noreferrer external" target="_blank">Aceder ao texto integral (acesso aberto) ↗</a></p>`;
  } else if (w.externalAccessLabelUnknownLicense && w.legalAccessUrl) {
    link = `<p><a class="ml-button ml-button--secondary" href="${esc(w.legalAccessUrl)}" rel="noopener noreferrer external" target="_blank">Ver página externa ↗</a></p>
      <p class="fallback-note">Cópia disponibilizada externamente por terceiros; a licença de reutilização não está confirmada e o Proteus não aloja o texto.</p>`;
  } else if (w.legalAccessUrl) {
    link = `<p><a class="ml-button ml-button--secondary" href="${esc(w.legalAccessUrl)}" rel="noopener noreferrer external" target="_blank">Ver registo bibliográfico ↗</a></p>`;
  }
  return licenseLine + link;
}

function resourceCard(r) {
  return `<li class="proteus-resource-card"><h3>${esc(r.title)}</h3>
    <p class="proteus-work-card__meta">Recurso institucional dinâmico · ${esc(r.provider)}</p>
    <p><a href="${esc(r.publicUrl)}" rel="noopener noreferrer external" target="_blank">Abrir página oficial ↗</a></p>
    ${r.stalenessNotice ? `<p class="fallback-note">Conteúdo dinâmico (ex.: horários e bilhética). Última verificação: ${esc(r.lastVerified || "—")}. Confirme sempre na fonte oficial.</p>` : ""}</li>`;
}

function shell(lang, current, inner) {
  return `${portalHeader(lang, "/conhecimento")}<main id="main" class="portal-main proteus-library">
    <nav class="collab-back-link"><a href="#/conhecimento">← Experiência Proteus</a></nav>
    ${inner}
  </main>${footer(lang)}`;
}

function matches(work, q, filters) {
  const hay = `${work.title} ${(work.authors || []).map((a) => a.preferredName || a).join(" ")} ${work.issued?.year || ""} ${(work.identifiers?.doi || "")} ${work.publication?.containerTitle || ""}`.toLowerCase();
  if (q && !hay.includes(q.toLowerCase())) return false;
  if (filters.type && work.workType !== filters.type) return false;
  if (filters.access && work.accessStatus !== filters.access) return false;
  if (filters.language && !(work.languages || []).includes(filters.language)) return false;
  return true;
}

export function proteusLibraryView(catalog, lang, query = {}) {
  const c = catalog || { works: [], authors: [], filters: {} };
  const f = c.filters || {};
  const q = query.q || "";
  const filters = { type: query.type || "", access: query.access || "", language: query.language || "" };
  const results = (c.works || []).filter((w) => w.editorialStatus === "published" || w.published === true).filter((w) => matches(w, q, filters));
  const opt = (arr, sel, labels) => (arr || []).map((v) => `<option value="${esc(v)}"${v === sel ? " selected" : ""}>${esc(labels?.[v] || v)}</option>`).join("");
  const body = (c.works || []).length === 0
    ? `<div class="collab-empty-state"><span>Biblioteca</span><h2>Ainda não há obras publicadas</h2><p>${esc(c.notice || "As fichas surgirão após catalogação e revisão humana, com fontes e direitos verificados.")}</p></div>`
    : results.length === 0
      ? `<div class="collab-empty-state"><span>Biblioteca</span><h2>Sem resultados</h2><p>Nenhuma obra corresponde à pesquisa e aos filtros aplicados.</p></div>`
      : `<ul class="proteus-work-list">${results.map(workCard).join("")}</ul>`;
  return shell(lang, "/conhecimento/biblioteca", `
    <header class="page-heading"><span class="eyebrow">Experiência Proteus</span><h1 class="page-title">Biblioteca</h1>
      <p>Catálogo de obras e autores relacionados com Milreu, com fontes, direitos e estado de acesso. Apenas registos revistos e publicados aparecem aqui.</p></header>
    <section class="portal-section">
      <form class="proteus-library-filters" data-proteus-library-filters role="search">
        <label>Pesquisar<input type="search" name="q" value="${esc(q)}" placeholder="título, autor, ano, DOI, publicação"></label>
        <label>Tipo<select name="type"><option value="">Todos</option>${opt(f.workTypes, filters.type, TYPE_LABELS)}</select></label>
        <label>Acesso<select name="access"><option value="">Todos</option>${opt(f.accessStatuses, filters.access, ACCESS_LABELS)}</select></label>
        <label>Idioma<select name="language"><option value="">Todos</option>${opt(f.languages, filters.language)}</select></label>
        <button type="submit">Aplicar</button>
      </form>
      ${body}
    </section>
    ${(c.externalResources || []).length ? `<section class="portal-section proteus-resources">
      <h2>Recursos institucionais</h2>
      <p class="fallback-note">Páginas oficiais externas relacionadas com Milreu. Não são obras catalogadas; o conteúdo é mantido por terceiros e pode mudar.</p>
      <ul class="proteus-resource-list">${c.externalResources.map(resourceCard).join("")}</ul>
    </section>` : ""}`);
}

function workCard(w) {
  return `<li class="proteus-work-card"><h2><a href="#/conhecimento/biblioteca/${esc(w.slug)}">${esc(w.title)}</a></h2>
    <p class="proteus-work-card__meta">${esc(TYPE_LABELS[w.workType] || w.workType)}${w.issued?.year ? ` · ${esc(w.issued.year)}` : ""} · ${esc(ACCESS_LABELS[w.accessStatus] || w.accessStatus)}</p>
    ${(w.authors || []).length ? `<p class="proteus-work-card__authors">${w.authors.map((a) => esc(a.preferredName || a)).join(", ")}</p>` : ""}</li>`;
}

export function proteusWorkView(catalog, slug, lang) {
  const w = (catalog?.works || []).find((x) => x.slug === slug && (x.editorialStatus === "published" || x.published === true));
  if (!w) {
    return shell(lang, "/conhecimento/biblioteca", `<header class="page-heading"><h1 class="page-title">Obra não encontrada</h1>
      <p>Esta obra não existe no catálogo público ou ainda não foi revista e publicada.</p><a class="ml-button ml-button--secondary" href="#/conhecimento/biblioteca">Voltar à Biblioteca</a></header>`);
  }
  const rows = [
    ["Tipo", TYPE_LABELS[w.workType] || w.workType],
    ["Ano", w.issued?.year], ["Publicação", w.publication?.containerTitle], ["Editora", w.publication?.publisher],
    ["Volume", w.publication?.volume], ["Número", w.publication?.issue], ["Páginas", w.publication?.pages],
    ["Idiomas", (w.languages || []).join(", ")], ["DOI", w.identifiers?.doi], ["ISBN", (w.identifiers?.isbn || []).join(", ")],
    ["Acesso", ACCESS_LABELS[w.accessStatus] || w.accessStatus], ["Última verificação", w.lastReviewedAt || w.updatedAt],
  ].filter(([, v]) => v);
  return shell(lang, "/conhecimento/biblioteca", `
    <header class="page-heading"><span class="eyebrow">${esc(TYPE_LABELS[w.workType] || "Obra")}</span><h1 class="page-title">${esc(w.title)}</h1>
      ${w.subtitle ? `<p>${esc(w.subtitle)}</p>` : ""}</header>
    <section class="portal-section proteus-work-detail">
      ${(w.authors || []).length ? `<p class="proteus-work-detail__authors">${w.authors.map((a) => a.slug ? `<a href="#/conhecimento/autores/${esc(a.slug)}">${esc(a.preferredName)}</a>` : esc(a.preferredName || a)).join(", ")}</p>` : ""}
      <dl class="opportunity-detail__facts">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      ${w.publicSummary ? `<h2>Resumo</h2><p>${esc(w.publicSummary)}</p>` : ""}
      ${accessBlock(w)}
      ${w.openAccess ? "" : `<p class="fallback-note">O Proteus apresenta a ficha e as ligações; não aloja o texto integral de obras restritas.</p>`}
    </section>`);
}

export function proteusAuthorView(catalog, slug, lang) {
  const a = (catalog?.authors || []).find((x) => x.slug === slug && (x.editorialStatus === "published" || x.published === true));
  if (!a) {
    return shell(lang, "/conhecimento/biblioteca", `<header class="page-heading"><h1 class="page-title">Autor não encontrado</h1>
      <p>Este perfil não existe no catálogo público ou ainda não foi revisto e publicado.</p><a class="ml-button ml-button--secondary" href="#/conhecimento/biblioteca">Voltar à Biblioteca</a></header>`);
  }
  const works = (catalog?.works || []).filter((w) => (w.editorialStatus === "published" || w.published === true) && (w.authors || []).some((x) => x.slug === slug));
  return shell(lang, "/conhecimento/biblioteca", `
    <header class="page-heading"><span class="eyebrow">Autor</span><h1 class="page-title">${esc(a.preferredName)}</h1></header>
    <section class="portal-section">
      ${a.orcid ? `<p><strong>ORCID:</strong> <a href="https://orcid.org/${esc(a.orcid)}" rel="noopener noreferrer external" target="_blank">${esc(a.orcid)}</a></p>` : ""}
      ${(a.affiliations || []).length ? `<p><strong>Afiliação:</strong> ${a.affiliations.map((x) => esc(x.name || x)).join("; ")}</p>` : ""}
      ${a.publicBio ? `<p>${esc(a.publicBio)}</p>` : `<p class="fallback-note">Perfil mínimo: apenas autoria bibliográfica comprovada. A biografia depende de fontes e revisão humana.</p>`}
      <h2>Obras publicadas</h2>
      ${works.length ? `<ul class="proteus-work-list">${works.map(workCard).join("")}</ul>` : `<p class="collab-empty-inline">Sem obras publicadas associadas de momento.</p>`}
    </section>`);
}
