/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { localised, text } from "../lib/i18n.js";
import { assetUrl } from "../lib/data.js";
export function memoryCard(record, lang, options={}) {
  const aiRetouched = record.media.digitalInterventions?.some(item => item.substantiveChange && String(item.type).includes("ai"));
  const reviewVisible = record.publication.siteStatus === "review-visible";
  const listClass = options.layout === "list" ? " ml-memory-card--list" : "";
  const title=localised(record.title,lang); const summary=localised(record.description.short,lang); const date=localised(record.date.display,lang); const period=localised(record.classification.period,lang);
  return `<article class="ml-memory-card${listClass}"><div class="ml-memory-card__media"><span class="preview-status">${reviewVisible ? text(lang,"reviewVisible") : text(lang,"preliminary")}</span>${aiRetouched ? `<span class="ai-retouch-badge">${text(lang,"aiRetouchedBadge")}</span>` : ""}<img loading="lazy" src="${assetUrl(record.media.variants.card)}" srcset="${assetUrl(record.media.variants.thumbnail)} 480w, ${assetUrl(record.media.variants.card)} 900w" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" alt="${escapeHtml(title.value)}"></div><div class="ml-memory-card__body"><span class="ml-memory-card__id">${record.id}</span><h3><a href="#/museu/memorias/${record.id}">${escapeHtml(title.value)}</a></h3><p>${escapeHtml(summary.value)}</p><div class="ml-memory-card__meta"><span>${escapeHtml(date.value||record.date.start||"")}</span><span>${escapeHtml(period.value||record.classification.primaryType||"")}</span></div>${aiRetouched ? `<div class="ai-card-notice">${text(lang,"aiDisclosureTitle")}</div>` : ""}${title.fallback||summary.fallback?`<small class="fallback-note">${text(lang,"fallback")}</small>`:""}</div></article>`;
}
function escapeHtml(value="") { return String(value).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
