/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10C — camada pública do modelo de conhecimento do Proteus (afirmações e entidades).
 * Lê o snapshot público (proteus-knowledge-public.json), que começa VAZIO por decisão: só
 * afirmações/entidades 'published' aparecem. Estados vazio, zero-resultados, 404 e divergência
 * são distintos e honestos. Mostra explicitamente a classe epistémica, as fontes e a evidência
 * localizada, a revisão humana e as posições divergentes. NUNCA mostra rascunhos, notas
 * internas, texto integral restrito nem confiança como percentagem de verdade.
 */
import { portalHeader, footer } from "../components/layout.js";

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const EPISTEMIC_LABELS = { fact_claim: "Facto documentado", interpretation: "Interpretação", hypothesis: "Hipótese", memory_account: "Memória/testemunho", inference: "Inferência", uncertainty_statement: "Declaração de incerteza" };
const CONFIDENCE_LABELS = { insufficient: "Base insuficiente", limited: "Base limitada", supported: "Sustentada", well_supported: "Bem sustentada" };
const ENTITY_LABELS = { place: "Lugar", structure: "Estrutura", object: "Objeto", person: "Pessoa", group: "Grupo", event: "Evento", period: "Período", concept: "Conceito", digital_resource: "Recurso digital" };
const LOCATOR_LABELS = { page: "página", page_range: "páginas", section: "secção", figure: "figura", table: "tabela", timestamp: "fragmento temporal", url_snapshot: "captura de URL", whole_resource: "recurso completo" };
const RELATION_LABELS = { supports: "sustenta", complements: "complementa", qualifies: "matiza", contradicts: "contradiz", supersedes: "substitui", withdraws: "retira" };

function shell(lang, inner) {
  return `${portalHeader(lang, "/conhecimento")}<main id="main" class="portal-main proteus-knowledge">
    <nav class="collab-back-link"><a href="#/conhecimento">← Experiência Proteus</a></nav>
    ${inner}
  </main>${footer(lang)}`;
}

const isPublished = (a) => a.status === "published" || a.published === true;

function matches(a, q, filters) {
  const hay = `${a.text || ""} ${EPISTEMIC_LABELS[a.epistemicClass] || a.epistemicClass || ""} ${(a.entities || []).map((e) => e.preferredLabel || "").join(" ")}`.toLowerCase();
  if (q && !hay.includes(q.toLowerCase())) return false;
  if (filters.epistemicClass && a.epistemicClass !== filters.epistemicClass) return false;
  if (filters.language && a.language !== filters.language) return false;
  return true;
}

export function proteusKnowledgeView(knowledge, lang, query = {}) {
  const k = knowledge || { assertions: [], entities: [], filters: {} };
  const f = k.filters || {};
  const q = query.q || "";
  const filters = { epistemicClass: query.class || "", language: query.language || "" };
  const published = (k.assertions || []).filter(isPublished);
  const results = published.filter((a) => matches(a, q, filters));
  const opt = (arr, sel, labels) => (arr || []).map((v) => `<option value="${esc(v)}"${v === sel ? " selected" : ""}>${esc(labels?.[v] || v)}</option>`).join("");
  const body = published.length === 0
    ? `<div class="collab-empty-state"><span>Base de conhecimento</span><h2>Ainda não há afirmações publicadas</h2><p>${esc(k.notice || "As afirmações surgirão após evidência localizada, direitos verificados e revisão humana.")}</p></div>`
    : results.length === 0
      ? `<div class="collab-empty-state"><span>Base de conhecimento</span><h2>Sem resultados</h2><p>Nenhuma afirmação corresponde à pesquisa e aos filtros aplicados.</p></div>`
      : `<ul class="proteus-work-list">${results.map(assertionCard).join("")}</ul>`;
  return shell(lang, `
    <header class="page-heading"><span class="eyebrow">Experiência Proteus</span><h1 class="page-title">Base de conhecimento</h1>
      <p>Afirmações sobre Milreu, com a sua natureza epistémica, as fontes e a evidência localizada que as sustentam, a revisão humana e as posições divergentes. Apenas afirmações revistas e publicadas aparecem aqui.</p></header>
    <section class="portal-section">
      <p class="fallback-note">A confiança é explicada por níveis e razões, nunca por uma percentagem de verdade. Quando as fontes divergem, o Proteus mostra as posições em vez de as resolver por votação.</p>
      <form class="proteus-library-filters" data-proteus-knowledge-filters role="search">
        <label>Pesquisar<input type="search" name="q" value="${esc(q)}" placeholder="afirmação, entidade, tema"></label>
        <label>Natureza<select name="class"><option value="">Todas</option>${opt(f.epistemicClasses, filters.epistemicClass, EPISTEMIC_LABELS)}</select></label>
        <label>Idioma<select name="language"><option value="">Todos</option>${opt(f.languages, filters.language)}</select></label>
        <button type="submit">Aplicar</button>
      </form>
      ${body}
    </section>`);
}

function assertionCard(a) {
  return `<li class="proteus-work-card"><h2><a href="#/conhecimento/afirmacoes/${esc(a.id)}">${esc(a.text)}</a></h2>
    <p class="proteus-work-card__meta">${esc(EPISTEMIC_LABELS[a.epistemicClass] || a.epistemicClass)} · ${esc(CONFIDENCE_LABELS[a.confidence?.level] || "Confiança por avaliar")}</p>
    ${(a.entities || []).length ? `<p class="proteus-work-card__authors">${a.entities.map((e) => esc(e.preferredLabel || e)).join(", ")}</p>` : ""}</li>`;
}

export function proteusAssertionView(knowledge, id, lang) {
  const a = (knowledge?.assertions || []).find((x) => x.id === id && isPublished(x));
  if (!a) {
    return shell(lang, `<header class="page-heading"><h1 class="page-title">Afirmação não encontrada</h1>
      <p>Esta afirmação não existe no espaço público, foi retirada, ou ainda não foi revista e publicada.</p><a class="ml-button ml-button--secondary" href="#/conhecimento/afirmacoes">Voltar à base de conhecimento</a></header>`);
  }
  const conf = a.confidence || {};
  const evidence = a.evidence || [];
  const divergences = (a.relations || []).filter((r) => ["contradicts", "qualifies", "supersedes"].includes(r.relationType));
  return shell(lang, `
    <header class="page-heading"><span class="eyebrow">${esc(EPISTEMIC_LABELS[a.epistemicClass] || "Afirmação")}</span><h1 class="page-title">${esc(a.text)}</h1></header>
    <section class="portal-section proteus-work-detail">
      <dl class="opportunity-detail__facts">
        <div><dt>Natureza</dt><dd>${esc(EPISTEMIC_LABELS[a.epistemicClass] || a.epistemicClass)}</dd></div>
        <div><dt>Confiança</dt><dd>${esc(CONFIDENCE_LABELS[conf.level] || "por avaliar")}</dd></div>
        ${(a.entities || []).length ? `<div><dt>Entidades</dt><dd>${a.entities.map((e) => e.slug ? `<a href="#/conhecimento/entidades/${esc(e.slug)}">${esc(e.preferredLabel)}</a>` : esc(e.preferredLabel || e)).join(", ")}</dd></div>` : ""}
      </dl>
      ${(conf.reasons || []).length ? `<h2>Porquê esta confiança</h2><ul class="proteus-reasons">${conf.reasons.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
      ${(conf.limitations || []).length ? `<p class="fallback-note">Limitações: ${conf.limitations.map(esc).join("; ")}.</p>` : ""}
      <h2>Fontes e evidência localizada</h2>
      ${evidence.length ? `<ul class="proteus-evidence-list">${evidence.map(evidenceItem).join("")}</ul>` : `<p class="collab-empty-inline">Sem evidência pública associada.</p>`}
      ${divergences.length ? `<h2>Posições divergentes</h2><ul class="proteus-divergences">${divergences.map((r) => `<li><strong>${esc(RELATION_LABELS[r.relationType] || r.relationType)}:</strong> ${r.targetAssertionId ? `<a href="#/conhecimento/afirmacoes/${esc(r.targetAssertionId)}">outra afirmação</a>` : ""} — ${esc(r.justification || "")}</li>`).join("")}</ul>` : ""}
      ${a.review ? `<p class="fallback-note">Revisão humana: ${esc(a.review.reviewedAt || "")} (decisão registada). As notas internas de revisão não são públicas.</p>` : ""}
      <p class="fallback-note">O Proteus apresenta a afirmação, a sua natureza e as fontes que a localizam; não aloja o texto integral de obras restritas.</p>
    </section>`);
}

function evidenceItem(e) {
  const loc = e.locatorType === "page" ? `${LOCATOR_LABELS.page} ${esc(e.pageStart)}`
    : e.locatorType === "page_range" ? `${LOCATOR_LABELS.page_range} ${esc(e.pageStart)}–${esc(e.pageEnd)}`
    : e.label ? `${esc(LOCATOR_LABELS[e.locatorType] || e.locatorType)} ${esc(e.label)}`
    : esc(LOCATOR_LABELS[e.locatorType] || e.locatorType);
  const src = e.sourceTitle ? esc(e.sourceTitle) : esc(e.sourceId || "fonte");
  const url = e.url ? ` — <a href="${esc(e.url)}" rel="noopener noreferrer external" target="_blank">ligação ↗</a>` : "";
  const accessed = e.accessedAt ? ` (consultado ${esc(e.accessedAt)})` : "";
  return `<li>${src} — ${loc}${accessed}${url}</li>`;
}

export function proteusEntityView(knowledge, slug, lang) {
  const ent = (knowledge?.entities || []).find((x) => (x.slug === slug || x.id === slug) && (x.status === "published" || x.published === true));
  if (!ent) {
    return shell(lang, `<header class="page-heading"><h1 class="page-title">Entidade não encontrada</h1>
      <p>Esta entidade não existe no espaço público ou ainda não foi revista e publicada.</p><a class="ml-button ml-button--secondary" href="#/conhecimento/afirmacoes">Voltar à base de conhecimento</a></header>`);
  }
  const related = (knowledge?.assertions || []).filter((a) => isPublished(a) && (a.entities || []).some((e) => e.slug === slug || e.id === ent.id));
  return shell(lang, `
    <header class="page-heading"><span class="eyebrow">${esc(ENTITY_LABELS[ent.type] || "Entidade")}</span><h1 class="page-title">${esc(ent.preferredLabel)}</h1></header>
    <section class="portal-section">
      ${(ent.alternativeLabels || []).length ? `<p><strong>Outras designações:</strong> ${ent.alternativeLabels.map(esc).join("; ")}</p>` : ""}
      <h2>Afirmações relacionadas</h2>
      ${related.length ? `<ul class="proteus-work-list">${related.map(assertionCard).join("")}</ul>` : `<p class="collab-empty-inline">Sem afirmações publicadas associadas de momento.</p>`}
    </section>`);
}
