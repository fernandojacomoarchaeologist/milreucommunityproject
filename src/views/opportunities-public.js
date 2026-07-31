/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C — descoberta pública de oportunidades (leitura sem autenticação).
 * Mostra apenas oportunidades public+published (snapshot). Nunca mostra candidatos
 * nem nomes. O CTA "Tenho interesse" leva à autenticação e ao perfil mínimo.
 */
import { portalHeader, footer } from "../components/layout.js";
import { text } from "../lib/i18n.js";

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TYPE_LABELS = {
  course: "Curso", event: "Evento", volunteering: "Voluntariado", fieldwork: "Trabalho de campo",
  workshop: "Oficina", "documentation-support": "Apoio documental", "community-activity": "Atividade comunitária",
  "research-participation": "Investigação participativa", other: "Oportunidade",
};
const fmtDate = (v) => v ? new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(new Date(v)) : null;

function capacityLabel(o) {
  if (o.applicationsClosed) return "Candidaturas encerradas";
  if (o.capacityMode === "limited" && o.capacityReached) return "Lotação atingida";
  return "Candidaturas abertas";
}

function card(o) {
  const when = fmtDate(o.startsAt);
  return `<article class="opportunity-card">
    <span class="opportunity-card__type">${esc(TYPE_LABELS[o.opportunityType] || TYPE_LABELS.other)}</span>
    <h2><a href="#/oportunidades/${esc(o.slug)}">${esc(o.title)}</a></h2>
    ${o.summary ? `<p>${esc(o.summary)}</p>` : ""}
    <dl class="opportunity-card__meta">
      ${when ? `<div><dt>Quando</dt><dd>${esc(when)}</dd></div>` : ""}
      ${o.locationText ? `<div><dt>Onde</dt><dd>${esc(o.locationText)}</dd></div>` : ""}
      ${o.applicationDeadline ? `<div><dt>Prazo</dt><dd>${esc(fmtDate(o.applicationDeadline))}</dd></div>` : ""}
    </dl>
    <div class="opportunity-card__foot"><span class="opportunity-card__state">${esc(capacityLabel(o))}</span>
      <a class="ml-button ml-button--secondary" href="#/oportunidades/${esc(o.slug)}">Ver oportunidade</a></div>
  </article>`;
}

export function opportunitiesListView(snapshot, lang) {
  const list = (snapshot?.opportunities || []);
  const body = list.length
    ? `<div class="opportunity-grid">${list.map(card).join("")}</div>`
    : `<div class="collab-empty-state"><span>Oportunidades</span><h2>Ainda não há oportunidades publicadas</h2><p>${esc(snapshot?.notice || "As oportunidades aparecem aqui quando forem criadas e publicadas pela coordenação.")}</p></div>`;
  return `<div class="portal-shell">${portalHeader(lang, "/oportunidades")}
    <main id="main" class="portal-main">
      <header class="page-heading"><span class="eyebrow">Participar</span><h1 class="page-title">Oportunidades</h1>
        <p>Cursos, eventos, voluntariado, oficinas e outras formas de participar em Milreu. A leitura é pública; candidatar-se exige entrar e completar um perfil mínimo.</p></header>
      <section class="portal-section">${body}</section>
    </main>${footer(lang)}</div>`;
}

export function opportunityDetailView(snapshot, slug, lang) {
  const o = (snapshot?.opportunities || []).find((x) => x.slug === slug);
  if (!o) {
    return `<div class="portal-shell">${portalHeader(lang, "/oportunidades")}
      <main id="main" class="portal-main"><header class="page-heading"><h1 class="page-title">Oportunidade não encontrada</h1>
        <p>Esta oportunidade pode ter sido encerrada ou ainda não está publicada.</p><a class="ml-button ml-button--secondary" href="#/oportunidades">Ver oportunidades</a></header></main>${footer(lang)}</div>`;
  }
  const rows = [
    ["Tipo", TYPE_LABELS[o.opportunityType] || TYPE_LABELS.other],
    ["Quando", [fmtDate(o.startsAt), fmtDate(o.endsAt)].filter(Boolean).join(" – ")],
    ["Onde", o.locationText], ["Duração", o.durationText], ["Esforço", o.effortText],
    ["Requisitos", o.requirements], ["Acessibilidade", o.accessibilityText],
    ["Custo", o.costText], ["Remuneração", o.remunerationText], ["Organização", o.organizerText],
    ["Prazo de candidatura", fmtDate(o.applicationDeadline)],
  ].filter(([, v]) => v);
  return `<div class="portal-shell">${portalHeader(lang, "/oportunidades")}
    <main id="main" class="portal-main">
      <a class="collab-back-link" href="#/oportunidades">← Todas as oportunidades</a>
      <header class="page-heading"><span class="eyebrow">${esc(TYPE_LABELS[o.opportunityType] || TYPE_LABELS.other)}</span>
        <h1 class="page-title">${esc(o.title)}</h1>${o.summary ? `<p>${esc(o.summary)}</p>` : ""}</header>
      <section class="portal-section opportunity-detail">
        <div class="opportunity-detail__body">
          ${o.description ? `<p>${esc(o.description)}</p>` : ""}
          <dl class="opportunity-detail__facts">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
          <p class="opportunity-detail__state"><strong>${esc(capacityLabel(o))}</strong></p>
        </div>
        <aside class="opportunity-detail__aside">
          <a class="ml-button ml-button--primary" href="#/entrar?intent=opportunity:${esc(o.slug)}" data-opportunity-interest="${esc(o.slug)}">Tenho interesse</a>
          <p class="opportunity-detail__hint">Ao candidatar-se, entra com a sua conta e confirma um perfil mínimo. Os candidatos são sempre privados.</p>
          <div class="opportunity-share" data-opportunity-share data-share-title="${esc(o.title)}" data-share-slug="${esc(o.slug)}">
            <span>Partilhar</span>
            <button type="button" data-share="native">Partilhar…</button>
            <button type="button" data-share="copy">Copiar link</button>
            <a data-share="facebook" href="#" rel="noopener noreferrer">Facebook</a>
            <a data-share="x" href="#" rel="noopener noreferrer">X</a>
            <a data-share="email" href="#">E-mail</a>
          </div>
        </aside>
      </section>
    </main>${footer(lang)}</div>`;
}
