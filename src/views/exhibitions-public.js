/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { portalHeader, footer } from "../components/layout.js";

const esc=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const dateOnly=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"long"}).format(new Date(`${value}T12:00:00`)):"—";
const dateTime=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"long",timeStyle:"short"}).format(new Date(value)):"—";
const durationDays=(starts,ends)=>{
  if(!starts||!ends)return 0;
  const diff=Math.round((new Date(`${ends}T12:00:00`)-new Date(`${starts}T12:00:00`))/86400000)+1;
  return diff>0?diff:0;
};

function stopCard(row,current=false){
  const place=[row.venue_name,row.locality,row.municipality].filter(Boolean).join(" · ");
  const days=durationDays(row.starts_on,row.ends_on);
  return `<article class="public-exhibition-stop ${current?"public-exhibition-stop--current":""}">
    <div class="public-exhibition-stop__date"><span>${current?"Agora":"Período"}</span><strong>${esc(dateOnly(row.starts_on))}</strong><small>até ${esc(dateOnly(row.ends_on))}</small>${days?`<small class="public-exhibition-stop__duration">Duração: ${days} ${days===1?"dia":"dias"}</small>`:""}</div>
    <div>
      ${row.example?`<span class="public-exhibition-stop__example" role="note">Exemplo · demonstração</span>`:""}
      <span>${esc(row.exhibition_type||"Exposição")}</span>
      <h2>${esc(row.public_title||row.exhibition_title||"Exposição")}</h2>
      <p class="public-exhibition-stop__place">${esc(place||"Local por anunciar")}</p>
      ${row.address?`<p class="public-exhibition-stop__address"><span aria-hidden="true">📍 </span>${esc(row.address)}</p>`:""}
      <p>${esc(row.public_summary||row.exhibition_summary||"")}</p>
      <dl>
        ${row.opening_hours||row.venue_opening_hours?`<div><dt>Horário</dt><dd>${esc(row.opening_hours||row.venue_opening_hours)}</dd></div>`:""}
        ${row.accessibility_summary?`<div><dt>Acessibilidade</dt><dd>${esc(row.accessibility_summary)}</dd></div>`:""}
        ${row.public_contact?`<div><dt>Contacto</dt><dd>${esc(row.public_contact)}</dd></div>`:""}
      </dl>
      ${row.registration_url?`<p><a class="ml-button ml-button--secondary" href="${esc(row.registration_url)}" target="_blank" rel="noopener noreferrer external">Mais informações ↗</a></p>`:""}
    </div>
  </article>`;
}

export function publicExhibitionsView(snapshot,lang="pt-PT"){
  const current=snapshot?.current||[],upcoming=snapshot?.upcoming||[],past=snapshot?.past||[],events=snapshot?.events||[];
  const hasSchedule=current.length||upcoming.length||past.length;
  return `${portalHeader(lang,"")}<main id="main">
    <section class="page-lead page-lead--exhibitions">
      <span>Entre Ruínas e Memórias</span>
      <h1>Onde está a exposição?</h1>
      <p>Acompanhe os locais e períodos confirmados da exposição física do Projeto Comunitário de Milreu.</p>
    </section>
    ${snapshot?.isExample?`<section class="content-section"><div class="public-exhibition-example-banner" role="note"><strong>Exemplo de demonstração</strong><span>Esta agenda apresenta um local e datas fictícios (fevereiro de 2026), apenas para ilustrar como será apresentada a itinerância. Os locais e as datas reais serão publicados quando confirmados e aprovados.</span></div></section>`:""}
    ${hasSchedule?`
      ${current.length?`<section class="content-section public-exhibition-section"><div class="section-heading"><h2>Em exibição</h2><p>Locais com período atualmente ativo.</p></div><div class="public-exhibition-list">${current.map(row=>stopCard(row,true)).join("")}</div></section>`:""}
      ${upcoming.length?`<section class="content-section public-exhibition-section"><div class="section-heading"><h2>Próximos locais</h2><p>Períodos confirmados e publicados.</p></div><div class="public-exhibition-list">${upcoming.map(row=>stopCard(row,false)).join("")}</div></section>`:""}
      ${past.length?`<section class="content-section content-section--muted public-exhibition-section"><div class="section-heading"><h2>Percurso realizado</h2><p>Locais já integrados na itinerância.</p></div><div class="public-exhibition-history">${past.map(row=>`<article><time>${esc(dateOnly(row.starts_on))} — ${esc(dateOnly(row.ends_on))}</time><strong>${esc(row.venue_name||"Local")}</strong><span>${esc(row.municipality||"")}</span></article>`).join("")}</div></section>`:""}
    `:`<section class="content-section"><div class="public-exhibition-empty"><span>Itinerância</span><h2>O próximo local ainda não foi publicado</h2><p>${esc(snapshot?.notice||"A agenda será atualizada quando existirem locais e datas confirmados.")}</p><a class="ml-button ml-button--secondary" href="#/iniciativas/exposicao-itinerante">Conhecer a iniciativa</a></div></section>`}
    ${events.length?`<section class="content-section"><div class="section-heading"><h2>Atividades públicas</h2><p>Aberturas, visitas, conversas e outras ações relacionadas.</p></div><div class="public-event-grid">${events.map(event=>`<article><time>${esc(dateTime(event.startsAt))}</time><h3>${esc(event.title)}</h3><p>${esc(event.description||"")}</p><span>${esc(event.locationText||event.venueName||"Local por anunciar")}</span>${event.registrationUrl?`<a href="${esc(event.registrationUrl)}" target="_blank" rel="noopener noreferrer external">Inscrição ↗</a>`:""}</article>`).join("")}</div></section>`:""}
  </main>${footer(lang)}`;
}
