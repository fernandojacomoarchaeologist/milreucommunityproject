/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 * Agenda (#/exposicoes) e detalhe (#/exposicoes/:id); classificação em lib/agenda.js.
 */
import { portalHeader, footer } from "../components/layout.js";
import { assetUrl } from "../lib/data.js";
import { classifyAgenda, findAgendaEntry, entryStatus, googleMapsUrl } from "../lib/agenda.js";

const esc=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const dateOnly=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"long"}).format(new Date(`${value}T12:00:00`)):"—";
const dateTime=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"long",timeStyle:"short",timeZone:"Europe/Lisbon"}).format(new Date(value)):"—";
const durationDays=(starts,ends)=>{
  if(!starts||!ends)return 0;
  const diff=Math.round((new Date(`${ends}T12:00:00`)-new Date(`${starts}T12:00:00`))/86400000)+1;
  return diff>0?diff:0;
};
const STATUS_LABEL={current:"Em exibição",upcoming:"Próximo",past:"Realizado"};
const EXTERNAL='target="_blank" rel="noopener noreferrer external"',NW=" (abre numa nova janela)";

function periodLabel(entry){
  if(entry.type==="event")return dateTime(entry.startsAt);
  if(!entry.startsOn)return "Data por anunciar";
  if(entry.startsOn===entry.endsOn)return dateOnly(entry.startsOn);
  return `${dateOnly(entry.startsOn)} — ${dateOnly(entry.endsOn)}`;
}

function entryUrl(entry){
  const base=typeof location!=="undefined"?location.href.split("#")[0]:"https://projectomilreu.pt/";
  return `${base}#/exposicoes/${encodeURIComponent(entry.id)}`;
}

function placeBlock(entry){
  const maps=googleMapsUrl(entry.mapsQuery);
  return `<dl class="agenda-place">
    ${entry.venue?`<div><dt>Local</dt><dd>${esc(entry.venue)}</dd></div>`:""}
    ${entry.parish?`<div><dt>Freguesia</dt><dd>${esc(entry.parish)}</dd></div>`:""}
    ${entry.municipality?`<div><dt>Município</dt><dd>${esc(entry.municipality)}</dd></div>`:""}
  </dl>
  ${entry.address&&entry.address!==entry.venue?`<p class="agenda-address">${esc(entry.address)}</p>`:""}
  ${maps?`<a class="agenda-maps" href="${esc(maps)}" ${EXTERNAL} aria-label="Ver ${esc(entry.venue||"o local")} no Google Maps${NW}">Ver no Google Maps ↗</a>`:""}`;
}

function shareBlock(entry){
  if(!entry.id)return "";
  const url=entryUrl(entry);
  const text=`${entry.title} · ${periodLabel(entry)} · ${[entry.venue,entry.municipality].filter(Boolean).join(", ")}`;
  return `<div class="agenda-share" aria-label="Partilhar">
    <span>Partilhar</span>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" ${EXTERNAL} aria-label="Partilhar no Facebook${NW}">Facebook ↗</a>
    <a href="https://wa.me/?text=${encodeURIComponent(`${text} — ${url}`)}" ${EXTERNAL} aria-label="Partilhar no WhatsApp${NW}">WhatsApp ↗</a>
  </div>`;
}

function mediaThumb(item,{linkToFull=true}={}){
  const img=`<img src="${esc(assetUrl(item.thumb||item.src))}" width="${Number(item.thumbWidth||item.width)||""}" height="${Number(item.thumbHeight||item.height)||""}" alt="${esc(item.alt)}" loading="lazy" decoding="async">`;
  return linkToFull?`<a href="${esc(assetUrl(item.src))}" ${EXTERNAL} aria-label="Abrir imagem ampliada: ${esc(item.alt)}${NW}">${img}</a>`:img;
}

function entryCard(entry){
  const status=entry.status;
  const days=entry.type==="stop"?durationDays(entry.startsOn,entry.endsOn):0;
  const detail=entry.id?`#/exposicoes/${encodeURIComponent(entry.id)}`:"";
  const preview=entry.media.slice(0,4);
  return `<article class="agenda-card agenda-card--${esc(status)}">
    <div class="agenda-card__date">
      <span>${esc(STATUS_LABEL[status]||"")}</span>
      <strong>${esc(periodLabel(entry))}</strong>
      ${days>1?`<small>Duração: ${days} dias</small>`:""}
    </div>
    <div class="agenda-card__body">
      ${entry.example?`<span class="public-exhibition-stop__example" role="note">Exemplo · demonstração</span>`:""}
      <span class="agenda-card__category">${esc(entry.category)}</span>
      <h3>${detail?`<a href="${detail}">${esc(entry.title)}</a>`:esc(entry.title)}</h3>
      ${placeBlock(entry)}
      ${entry.summary?`<p>${esc(entry.summary)}</p>`:""}
      ${entry.hours?`<p class="agenda-hours"><strong>Horário:</strong> ${esc(entry.hours)}</p>`:""}
      ${preview.length?`<div class="agenda-thumbs" aria-label="Fotografias e documentos">${preview.map(item=>mediaThumb(item)).join("")}</div>`:""}
      <div class="agenda-card__actions">
        ${detail?`<a class="ml-button ml-button--secondary" href="${detail}">${entry.media.length?`Ver fotografias e documentos (${entry.media.length})`:"Ver detalhes"}</a>`:""}
        ${status!=="past"?shareBlock(entry):""}
      </div>
    </div>
  </article>`;
}

function pastCard(entry){
  const cover=entry.media.find(item=>item.kind!=="poster")||entry.media[0];
  const place=[entry.venue,entry.parish,entry.municipality].filter((v,i,a)=>v&&a.indexOf(v)===i).join(" · ");
  const inner=`${cover?`<div class="agenda-past__media">${mediaThumb(cover,{linkToFull:false})}</div>`:""}
    <div class="agenda-past__body">
      <time>${esc(periodLabel(entry))}</time>
      <strong>${esc(entry.title)}</strong>
      <span>${esc(place)}</span>
      ${entry.media.length?`<small>${entry.media.length} ${entry.media.length===1?"imagem":"imagens"}</small>`:""}
    </div>`;
  return entry.id
    ?`<a class="agenda-past" href="#/exposicoes/${encodeURIComponent(entry.id)}">${inner}</a>`
    :`<div class="agenda-past">${inner}</div>`;
}

export function publicExhibitionsView(snapshot,lang="pt-PT",nowMs=Date.now()){
  const groups=classifyAgenda(snapshot,nowMs);
  const hasSchedule=groups.current.length||groups.upcoming.length||groups.past.length;
  return `${portalHeader(lang,"")}<main id="main">
    <section class="page-lead page-lead--exhibitions">
      <span>Entre Ruínas e Memórias</span>
      <h1>Onde está a exposição?</h1>
      <p>Acompanhe os locais, as datas e as atividades da exposição física do Projeto Comunitário de Milreu.</p>
    </section>
    ${snapshot?.isExample?`<section class="content-section"><div class="public-exhibition-example-banner" role="note"><strong>Exemplo de demonstração</strong><span>Dados fictícios.</span></div></section>`:""}
    ${hasSchedule?`
      ${groups.current.length?`<section class="content-section public-exhibition-section"><div class="section-heading"><h2>Em exibição</h2><p>Locais com período atualmente ativo.</p></div><div class="agenda-list">${groups.current.map(entryCard).join("")}</div></section>`:""}
      ${groups.upcoming.length?`<section class="content-section public-exhibition-section"><div class="section-heading"><h2>Próximos locais e atividades</h2><p>Períodos e atividades confirmados, do mais próximo para o mais distante.</p></div><div class="agenda-list">${groups.upcoming.map(entryCard).join("")}</div></section>`:""}
      ${groups.past.length?`<section class="content-section content-section--muted public-exhibition-section"><div class="section-heading"><h2>Eventos realizados</h2><p>Do mais recente para o mais antigo. Abra cada evento para ver fotografias e documentos.</p></div><div class="agenda-past-list">${groups.past.map(pastCard).join("")}</div></section>`:""}
    `:`<section class="content-section"><div class="public-exhibition-empty"><span>Itinerância</span><h2>O próximo local ainda não foi publicado</h2><p>${esc(snapshot?.notice||"A agenda será atualizada quando existirem locais e datas confirmados.")}</p><a class="ml-button ml-button--secondary" href="#/iniciativas/exposicao-itinerante">Conhecer a iniciativa</a></div></section>`}
    ${snapshot?.notice&&hasSchedule?`<p class="content-section agenda-notice">${esc(snapshot.notice)}</p>`:""}
  </main>${footer(lang)}`;
}

export function publicExhibitionEntryView(snapshot,id,lang="pt-PT",nowMs=Date.now()){
  const entry=findAgendaEntry(snapshot,id);
  if(!entry){
    return `${portalHeader(lang,"")}<main id="main"><section class="content-section"><div class="public-exhibition-empty"><span>Agenda</span><h1>Evento não encontrado</h1><p>Este evento não existe ou já não está publicado.</p><a class="ml-button ml-button--secondary" href="#/exposicoes">Voltar à agenda</a></div></section></main>${footer(lang)}`;
  }
  const status=entryStatus(entry,nowMs);
  const days=entry.type==="stop"?durationDays(entry.startsOn,entry.endsOn):0;
  const related=entry.stopId?findAgendaEntry(snapshot,entry.stopId):null;
  return `${portalHeader(lang,"")}<main id="main">
    <section class="page-lead page-lead--exhibitions">
      <a class="agenda-back" href="#/exposicoes">← Agenda da exposição</a>
      <span>${esc(STATUS_LABEL[status]||"")} · ${esc(entry.category)}</span>
      <h1>${esc(entry.title)}</h1>
      <p class="agenda-detail__period"><strong>${esc(periodLabel(entry))}</strong>${days>1?` · ${days} dias`:""}</p>
    </section>
    <section class="content-section agenda-detail">
      <div class="agenda-detail__info">
        ${placeBlock(entry)}
        ${entry.summary?`<p>${esc(entry.summary)}</p>`:""}
        ${entry.hours?`<p class="agenda-hours"><strong>Horário:</strong> ${esc(entry.hours)}</p>`:""}
        ${related?`<p><a href="#/exposicoes/${encodeURIComponent(related.id)}">Ver a exposição: ${esc(related.title)} →</a></p>`:""}
        ${status!=="past"?shareBlock(entry):""}
      </div>
    </section>
    ${entry.media.length?`<section class="content-section">
      <div class="section-heading"><h2>Fotografias e documentos</h2><p>Selecione uma imagem para a abrir ampliada.</p></div>
      <div class="agenda-gallery">${entry.media.map(item=>`<figure>${mediaThumb(item)}<figcaption>${esc(item.credit||"")}</figcaption></figure>`).join("")}</div>
    </section>`:""}
  </main>${footer(lang)}`;
}
