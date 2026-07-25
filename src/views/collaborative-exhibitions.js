/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell, statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const dateOnly=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium"}).format(new Date(`${value}T12:00:00`)):"—";
const dateTime=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)):"—";
const isoDate=value=>value?new Date(value).toISOString().slice(0,10):"";
const isoDateTimeLocal=value=>value?new Date(value).toISOString().slice(0,16):"";
const today=()=>new Date().toISOString().slice(0,10);

function heading(eyebrow,title,description="",actions=""){
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>${esc(eyebrow)}</span><h1>${esc(title)}</h1>${description?`<p>${esc(description)}</p>`:""}</div>${actions?`<div class="collab-heading-actions">${actions}</div>`:""}</header>`;
}
function workspace(context){return context.exhibitionWorkspace||{venues:[],exhibitions:[],schedules:[],events:[],participants:[],checklist:[],conflicts:[]};}
function modelLabel(context,collection,code){return context.exhibitionModel?.[collection]?.find(item=>item.code===code)?.name||code||"—";}
function options(items,selected="",empty="Selecione"){
  return `<option value="">${esc(empty)}</option>${(items||[]).map(item=>`<option value="${esc(item.code)}" ${String(item.code)===String(selected)?"selected":""}>${esc(item.name)}</option>`).join("")}`;
}
function exhibition(context,id){return workspace(context).exhibitions.find(item=>item.id===id);}
function venue(context,id){return workspace(context).venues.find(item=>item.id===id);}
function schedule(context,id){return workspace(context).schedules.find(item=>item.id===id);}
function myRsvp(context,eventId){return workspace(context).participants.find(item=>item.event_id===eventId&&item.user_id===context.session?.user?.id);}
function publicState(row){return row.public_visibility&&row.published_at?"Publicado":"Interno";}
function dateRange(row){return `${dateOnly(row.starts_on)} — ${dateOnly(row.ends_on)}`;}
function locationName(context,row){return venue(context,row.venue_id)?.name||row.location_text||"Local por definir";}
function exhibitionName(context,row){return exhibition(context,row.exhibition_id)?.title||"Exposição";}

function agendaEventCard(context,event){
  const participation=myRsvp(context,event.id);
  return `<article class="agenda-event-card">
    <div class="agenda-event-card__date"><time>${esc(dateTime(event.starts_at))}</time><span>${esc(modelLabel(context,"eventTypes",event.event_type))}</span></div>
    <div class="agenda-event-card__body">
      <div class="agenda-event-card__top">${statusPill(event.status)}<span>${esc(modelLabel(context,"visibilityOptions",event.visibility))}</span></div>
      <h2>${esc(event.title)}</h2>
      <p>${esc(event.description||"Sem descrição.")}</p>
      <dl><div><dt>Local</dt><dd>${esc(locationName(context,event))}</dd></div><div><dt>Fim</dt><dd>${esc(dateTime(event.ends_at))}</dd></div>${event.capacity?`<div><dt>Capacidade</dt><dd>${esc(event.capacity)}</dd></div>`:""}</dl>
      ${event.status==="confirmed"&&hasPermission(context,"agenda.rsvp")?`<div class="agenda-rsvp">
        <span>${participation?`Resposta: ${esc(modelLabel(context,"rsvpStatuses",participation.status))}`:"Confirme a sua participação"}</span>
        <button type="button" data-agenda-rsvp="interested" data-event-id="${esc(event.id)}">Tenho interesse</button>
        <button type="button" data-agenda-rsvp="attending" data-event-id="${esc(event.id)}">Vou participar</button>
        <button type="button" data-agenda-rsvp="not-attending" data-event-id="${esc(event.id)}">Não vou</button>
      </div>`:""}
    </div>
  </article>`;
}

function scheduleCard(context,row,management=false){
  const place=venue(context,row.venue_id),showInternal=management||hasPermission(context,"exhibitions.view-internal");
  return `<article class="exhibition-stop-card ${row.status==="open"?"exhibition-stop-card--current":""}">
    <div class="exhibition-stop-card__date"><strong>${esc(dateRange(row))}</strong><span>${esc(modelLabel(context,"scheduleStatuses",row.status))}</span></div>
    <div>
      <span class="exhibition-stop-card__visibility">${esc(publicState(row))}</span>
      <h2>${esc(row.public_title||exhibitionName(context,row))}</h2>
      <p class="exhibition-stop-card__place">${esc(place?.name||"Local por definir")} · ${esc([place?.locality,place?.municipality].filter(Boolean).join(", ")||"Localidade por definir")}</p>
      ${row.public_summary?`<p>${esc(row.public_summary)}</p>`:""}
      <dl class="exhibition-stop-card__meta">
        <div><dt>Instalação</dt><dd>${esc(modelLabel(context,"installationStatuses",row.installation_status))}</dd></div>
        <div><dt>Logística</dt><dd>${esc(modelLabel(context,"logisticsStatuses",row.logistics_status))}</dd></div>
        ${row.opening_hours?`<div><dt>Horário</dt><dd>${esc(row.opening_hours)}</dd></div>`:""}
      </dl>
      ${showInternal&&row.internal_notes?`<div class="internal-note"><strong>Nota interna</strong><p>${esc(row.internal_notes)}</p></div>`:""}
      ${management?`<p><a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/exposicoes/agendamentos/${esc(row.id)}">Abrir gestão do período</a></p>`:""}
    </div>
  </article>`;
}

function calendarMonth(context,monthValue){
  const month=/^\d{4}-\d{2}$/.test(monthValue||"")?monthValue:new Date().toISOString().slice(0,7);
  const [year,monthNumber]=month.split("-").map(Number);
  const first=new Date(year,monthNumber-1,1);
  const last=new Date(year,monthNumber,0);
  const offset=(first.getDay()+6)%7;
  const total=Math.ceil((offset+last.getDate())/7)*7;
  const events=workspace(context).events;
  const schedules=workspace(context).schedules;
  const cells=[];
  for(let index=0;index<total;index++){
    const day=index-offset+1;
    if(day<1||day>last.getDate()){cells.push(`<div class="agenda-calendar__day agenda-calendar__day--outside" aria-hidden="true"></div>`);continue;}
    const iso=`${year}-${String(monthNumber).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const dayEvents=events.filter(event=>isoDate(event.starts_at)===iso);
    const daySchedules=schedules.filter(row=>row.starts_on<=iso&&row.ends_on>=iso&&row.status!=="cancelled");
    cells.push(`<div class="agenda-calendar__day ${iso===today()?"agenda-calendar__day--today":""}">
      <time datetime="${iso}">${day}</time>
      ${daySchedules.slice(0,2).map(row=>`<span class="calendar-chip calendar-chip--exhibition">${esc(exhibitionName(context,row))}</span>`).join("")}
      ${dayEvents.slice(0,3).map(event=>`<span class="calendar-chip">${esc(event.title)}</span>`).join("")}
      ${daySchedules.length+dayEvents.length>5?`<small>+${daySchedules.length+dayEvents.length-5}</small>`:""}
    </div>`);
  }
  const previous=new Date(year,monthNumber-2,1).toISOString().slice(0,7);
  const next=new Date(year,monthNumber,1).toISOString().slice(0,7);
  const label=new Intl.DateTimeFormat("pt-PT",{month:"long",year:"numeric"}).format(first);
  return `<section class="agenda-calendar">
    <header><a href="#/area-colaborativa/agenda?view=calendar&month=${previous}" aria-label="Mês anterior">←</a><h2>${esc(label)}</h2><a href="#/area-colaborativa/agenda?view=calendar&month=${next}" aria-label="Mês seguinte">→</a></header>
    <div class="agenda-calendar__weekdays">${["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map(day=>`<span>${day}</span>`).join("")}</div>
    <div class="agenda-calendar__grid">${cells.join("")}</div>
  </section>`;
}

export function collaborativeAgendaView(context,filters={}){
  if(!hasPermission(context,"agenda.view"))return collaborativeAgendaForbidden(context);
  const data=workspace(context),view=filters.view||"list";
  const now=new Date();
  const upcomingEvents=data.events.filter(event=>new Date(event.ends_at)>=now&&event.status!=="cancelled").sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  const visibleSchedules=data.schedules.filter(row=>row.status!=="cancelled").sort((a,b)=>a.starts_on.localeCompare(b.starts_on));
  const actions=`${hasPermission(context,"agenda.manage")?`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/agenda/novo">Novo evento</a>`:""}${hasPermission(context,"exhibitions.manage")?`<a class="ml-button ml-button--primary" href="#/area-colaborativa/gestao/exposicoes">Gerir exposições</a>`:""}`;
  let content="";
  if(view==="calendar")content=calendarMonth(context,filters.month);
  else if(view==="itinerary")content=`<div class="exhibition-itinerary">${visibleSchedules.length?visibleSchedules.map(row=>scheduleCard(context,row,false)).join(""):`<div class="collab-empty-state"><h2>A itinerância ainda não foi registada</h2><p>Os períodos confirmados aparecerão aqui.</p></div>`}</div>`;
  else content=`<div class="agenda-event-list">${upcomingEvents.length?upcomingEvents.map(event=>agendaEventCard(context,event)).join(""):`<div class="collab-empty-state"><h2>Sem atividades próximas</h2><p>Novas reuniões, visitas e ações de voluntariado aparecerão aqui.</p></div>`}</div>`;
  return collaborativeShell(context,"/area-colaborativa/agenda",`
    ${heading("Agenda","Atividades e exposição itinerante","Consulte eventos, confirme participação e acompanhe o percurso físico da exposição.",actions)}
    <nav class="agenda-view-tabs" aria-label="Visualização da agenda">
      <a href="#/area-colaborativa/agenda?view=list" aria-current="${view==="list"?"page":"false"}">Próximas atividades</a>
      <a href="#/area-colaborativa/agenda?view=calendar" aria-current="${view==="calendar"?"page":"false"}">Calendário</a>
      <a href="#/area-colaborativa/agenda?view=itinerary" aria-current="${view==="itinerary"?"page":"false"}">Itinerância</a>
    </nav>
    ${content}
  `);
}

export function collaborativeExhibitionManagementView(context){
  if(!hasPermission(context,"exhibitions.manage"))return collaborativeAgendaForbidden(context);
  const data=workspace(context);
  const current=data.schedules.filter(row=>row.status==="open").length;
  const upcoming=data.schedules.filter(row=>row.starts_on>today()&&row.status!=="cancelled").length;
  const unresolved=data.checklist.filter(item=>!["completed","cancelled"].includes(item.status)).length;
  const actions=`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/locais">Gerir locais</a><a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/agenda/novo">Novo evento</a><a class="ml-button ml-button--primary" href="#/area-colaborativa/gestao/exposicoes/nova">Nova exposição</a>`;
  return collaborativeShell(context,"/area-colaborativa/gestao/exposicoes",`
    ${heading("Gestão","Exposições e itinerância","Planeie exposições, associe locais, confirme períodos e acompanhe a logística.",actions)}
    <section class="exhibition-summary-grid">
      <article><span>Exposições</span><strong>${data.exhibitions.length}</strong></article>
      <article><span>Em exibição agora</span><strong>${current}</strong></article>
      <article><span>Próximos períodos</span><strong>${upcoming}</strong></article>
      <article><span>Itens logísticos abertos</span><strong>${unresolved}</strong></article>
    </section>
    <section class="exhibition-management-list">
      <h2>Exposições</h2>
      ${data.exhibitions.length?data.exhibitions.map(item=>{
        const stops=data.schedules.filter(row=>row.exhibition_id===item.id);
        return `<article>
          <div><span>${esc(modelLabel(context,"exhibitionTypes",item.exhibition_type))}</span><h3>${esc(item.title)}</h3><p>${esc(item.public_summary||item.description||"Sem descrição.")}</p></div>
          <div><strong>${stops.length}</strong><span>períodos</span>${statusPill(item.status)}</div>
          <div><a href="#/area-colaborativa/gestao/exposicoes/${esc(item.id)}">Abrir</a><a href="#/area-colaborativa/gestao/exposicoes/${esc(item.id)}/editar">Editar</a><a href="#/area-colaborativa/gestao/exposicoes/${esc(item.id)}/agendar">Agendar</a></div>
        </article>`;
      }).join(""):`<div class="collab-empty-state"><h2>Nenhuma exposição registada</h2><p>Crie primeiro a exposição e depois associe locais e períodos.</p></div>`}
    </section>
    <section class="exhibition-management-list"><h2>Próximos períodos</h2>${data.schedules.length?data.schedules.slice().sort((a,b)=>a.starts_on.localeCompare(b.starts_on)).map(row=>scheduleCard(context,row,true)).join(""):`<p class="collab-empty-line">Sem períodos registados.</p>`}</section>
  `);
}

export function collaborativeVenueManagementView(context){
  if(!hasPermission(context,"venues.manage"))return collaborativeAgendaForbidden(context);
  const data=workspace(context);
  return collaborativeShell(context,"/area-colaborativa/gestao/locais",`
    ${heading("Gestão","Locais","Museus, escolas, bibliotecas e espaços que podem receber exposições ou atividades.",`<a class="ml-button ml-button--primary" href="#/area-colaborativa/gestao/locais/novo">Novo local</a>`)}
    <div class="venue-grid">${data.venues.length?data.venues.map(item=>`<article class="venue-card">
      <span>${esc(modelLabel(context,"venueTypes",item.venue_type))}</span>
      <h2>${esc(item.name)}</h2>
      <p>${esc([item.locality,item.municipality].filter(Boolean).join(", ")||"Localidade por definir")}</p>
      <div>${statusPill(item.status)}<span>${item.public_visibility?"Público":"Interno"}</span></div>
      ${item.accessibility_summary?`<p class="venue-card__accessibility">${esc(item.accessibility_summary)}</p>`:""}
      <a href="#/area-colaborativa/gestao/locais/${esc(item.id)}">Editar local</a>
    </article>`).join(""):`<div class="collab-empty-state"><h2>Nenhum local registado</h2><p>Registe um local antes de criar a itinerância.</p></div>`}</div>
  `);
}

export function collaborativeVenueEditorView(context,venueId=null){
  if(!hasPermission(context,"venues.manage"))return collaborativeAgendaForbidden(context);
  const item=venueId?venue(context,venueId):null;
  return collaborativeShell(context,item?`/area-colaborativa/gestao/locais/${item.id}`:"/area-colaborativa/gestao/locais/novo",`
    ${heading("Locais",item?"Editar local":"Novo local","Dados internos e públicos permanecem separados.")}
    <form class="collab-form exhibition-editor" data-venue-form data-venue-id="${esc(item?.id||"")}">
      <div class="form-grid-2">
        <label>Nome<input name="name" required value="${esc(item?.name||"")}"></label>
        <label>Tipo<select name="venueType" required>${options(context.exhibitionModel?.venueTypes,item?.venue_type,"Selecione")}</select></label>
        <label>Município<input name="municipality" value="${esc(item?.municipality||"")}"></label>
        <label>Localidade<input name="locality" value="${esc(item?.locality||"")}"></label>
        <label>Morada<input name="addressText" value="${esc(item?.address_text||"")}"></label>
        <label>Código postal<input name="postalCode" value="${esc(item?.postal_code||"")}"></label>
        <label>País<input name="countryCode" maxlength="2" value="${esc(item?.country_code||"PT")}"></label>
        <label>Estado<select name="status">${options([{code:"draft",name:"Rascunho"},{code:"active",name:"Ativo"},{code:"archived",name:"Arquivado"}],item?.status,"Selecione")}</select></label>
      </div>
      <fieldset><legend>Informação pública</legend>
        <label>Descrição<textarea name="publicDescription" rows="4">${esc(item?.public_description||"")}</textarea></label>
        <div class="form-grid-2">
          <label>Horário<input name="openingHours" value="${esc(item?.opening_hours||"")}"></label>
          <label>URL pública<input type="url" name="publicUrl" value="${esc(item?.public_url||"")}"></label>
          <label>E-mail público<input type="email" name="publicEmail" value="${esc(item?.public_email||"")}"></label>
          <label>Telefone público<input name="publicPhone" value="${esc(item?.public_phone||"")}"></label>
        </div>
        <label>Acessibilidade pública<textarea name="accessibilitySummary" rows="3">${esc(item?.accessibility_summary||"")}</textarea></label>
        <label class="collab-check"><input type="checkbox" name="publicVisibility" ${item?.public_visibility?"checked":""}>Este local pode aparecer na agenda pública.</label>
      </fieldset>
      <fieldset><legend>Informação interna</legend>
        <div class="form-grid-2"><label>Contacto interno<input name="contactName" value="${esc(item?.contact_name||"")}"></label><label>E-mail interno<input type="email" name="contactEmail" value="${esc(item?.contact_email||"")}"></label></div>
        <label>Notas de acessibilidade<textarea name="accessibilityNotes" rows="3">${esc(item?.accessibility_notes||"")}</textarea></label>
        <label>Notas internas<textarea name="internalNotes" rows="4">${esc(item?.internal_notes||"")}</textarea></label>
      </fieldset>
      <button class="ml-button ml-button--primary" type="submit">Guardar local</button><p data-collab-feedback aria-live="polite"></p>
    </form>
  `);
}

export function collaborativeExhibitionEditorView(context,exhibitionId=null){
  if(!hasPermission(context,"exhibitions.manage"))return collaborativeAgendaForbidden(context);
  const item=exhibitionId?exhibition(context,exhibitionId):null;
  return collaborativeShell(context,item?`/area-colaborativa/gestao/exposicoes/${item.id}/editar`:"/area-colaborativa/gestao/exposicoes/nova",`
    ${heading("Exposições",item?"Editar exposição":"Nova exposição","A exposição é criada uma vez; os locais e períodos são registados separadamente.")}
    <form class="collab-form exhibition-editor" data-exhibition-form data-exhibition-id="${esc(item?.id||"")}">
      <div class="form-grid-2">
        <label>Título<input name="title" required value="${esc(item?.title||"")}"></label>
        <label>Tipo<select name="exhibitionType" required>${options(context.exhibitionModel?.exhibitionTypes,item?.exhibition_type,"Selecione")}</select></label>
        <label>Subtítulo<input name="subtitle" value="${esc(item?.subtitle||"")}"></label>
        <label>Estado<select name="status">${options(context.exhibitionModel?.exhibitionStatuses,item?.status||"planning","Selecione")}</select></label>
        <label>Duração padrão em dias<input type="number" min="1" name="defaultDurationDays" value="${esc(item?.default_duration_days||"")}"></label>
      </div>
      <label>Descrição de trabalho<textarea name="description" rows="4">${esc(item?.description||"")}</textarea></label>
      <label>Resumo público<textarea name="publicSummary" rows="4">${esc(item?.public_summary||"")}</textarea></label>
      <label>Objetivos internos<textarea name="internalObjectives" rows="4">${esc(item?.internal_objectives||"")}</textarea></label>
      <label class="collab-check"><input type="checkbox" name="publicVisibility" ${item?.public_visibility?"checked":""}>Preparar a exposição para apresentação pública.</label>
      <label class="collab-check"><input type="checkbox" name="publishNow">Publicar agora os dados gerais da exposição.</label>
      <button class="ml-button ml-button--primary" type="submit">Guardar exposição</button><p data-collab-feedback aria-live="polite"></p>
    </form>
  `);
}

export function collaborativeExhibitionDetailView(context,exhibitionId){
  if(!hasPermission(context,"exhibitions.manage"))return collaborativeAgendaForbidden(context);
  const item=exhibition(context,exhibitionId);
  if(!item)return collaborativeShell(context,"",`${heading("Exposição","Registo não encontrado")}`);
  const stops=workspace(context).schedules.filter(row=>row.exhibition_id===item.id).sort((a,b)=>a.starts_on.localeCompare(b.starts_on));
  return collaborativeShell(context,`/area-colaborativa/gestao/exposicoes/${item.id}`,`
    ${heading("Exposição",item.title,item.public_summary||item.description||"",`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/exposicoes/${esc(item.id)}/editar">Editar</a><a class="ml-button ml-button--primary" href="#/area-colaborativa/gestao/exposicoes/${esc(item.id)}/agendar">Novo período</a>`)}
    <section class="exhibition-detail-summary"><div>${statusPill(item.status)}<span>${esc(modelLabel(context,"exhibitionTypes",item.exhibition_type))}</span><span>${item.public_visibility?"Preparada para público":"Interna"}</span></div>${item.internal_objectives?`<div class="internal-note"><strong>Objetivos internos</strong><p>${esc(item.internal_objectives)}</p></div>`:""}</section>
    <section class="exhibition-management-list"><h2>Itinerância</h2>${stops.length?stops.map(row=>scheduleCard(context,row,true)).join(""):`<div class="collab-empty-state"><h2>Sem períodos</h2><p>Associe a exposição a um local e a um intervalo de datas.</p></div>`}</section>
  `);
}

export function collaborativeScheduleEditorView(context,exhibitionId=null,scheduleId=null){
  if(!hasPermission(context,"exhibitions.manage"))return collaborativeAgendaForbidden(context);
  const item=scheduleId?schedule(context,scheduleId):null;
  const selectedExhibition=exhibitionId||item?.exhibition_id||"";
  return collaborativeShell(context,item?`/area-colaborativa/gestao/exposicoes/agendamentos/${item.id}`:`/area-colaborativa/gestao/exposicoes/${selectedExhibition}/agendar`,`
    ${heading("Itinerância",item?"Editar período":"Agendar exposição","Selecione o local, confirme as datas e mantenha dados públicos e internos separados.")}
    <form class="collab-form exhibition-editor" data-schedule-form data-schedule-id="${esc(item?.id||"")}">
      <div class="form-grid-2">
        <label>Exposição<select name="exhibitionId" required>${options(workspace(context).exhibitions.map(row=>({code:row.id,name:row.title})),selectedExhibition,"Selecione")}</select></label>
        <label>Local<select name="venueId" required>${options(workspace(context).venues.filter(row=>row.status!=="archived").map(row=>({code:row.id,name:row.name})),item?.venue_id,"Selecione")}</select></label>
        <label>Início<input type="date" name="startsOn" required value="${esc(item?.starts_on||"")}"></label>
        <label>Fim<input type="date" name="endsOn" required value="${esc(item?.ends_on||"")}"></label>
        <label>Estado<select name="status">${options(context.exhibitionModel?.scheduleStatuses,item?.status||"planned","Selecione")}</select></label>
        <label>Montagem<input type="datetime-local" name="installationAt" value="${esc(isoDateTimeLocal(item?.installation_at))}"></label>
        <label>Desmontagem<input type="datetime-local" name="dismantlingAt" value="${esc(isoDateTimeLocal(item?.dismantling_at))}"></label>
        <label>Estado da instalação<select name="installationStatus">${options(context.exhibitionModel?.installationStatuses,item?.installation_status||"not-started","Selecione")}</select></label>
        <label>Estado da logística<select name="logisticsStatus">${options(context.exhibitionModel?.logisticsStatuses,item?.logistics_status||"not-started","Selecione")}</select></label>
      </div>
      <fieldset><legend>Informação pública</legend>
        <label>Título para este local<input name="publicTitle" value="${esc(item?.public_title||"")}"></label>
        <label>Resumo<textarea name="publicSummary" rows="3">${esc(item?.public_summary||"")}</textarea></label>
        <div class="form-grid-2"><label>Horário<input name="openingHours" value="${esc(item?.opening_hours||"")}"></label><label>Contacto público<input name="publicContact" value="${esc(item?.public_contact||"")}"></label><label>Ligação de inscrição<input type="url" name="registrationUrl" value="${esc(item?.registration_url||"")}"></label></div>
        <label>Notas públicas<textarea name="publicNotes" rows="3">${esc(item?.public_notes||"")}</textarea></label>
        <label class="collab-check"><input type="checkbox" name="publicVisibility" ${item?.public_visibility?"checked":""}>Preparar este período para a agenda pública.</label>
        <label class="collab-check"><input type="checkbox" name="publishNow">Publicar após guardar, se o estado permitir.</label>
      </fieldset>
      <fieldset><legend>Informação interna</legend>
        <label>Transporte e logística<textarea name="transportNotes" rows="3">${esc(item?.transport_notes||"")}</textarea></label>
        <label>Estado antes da instalação<textarea name="conditionReportBefore" rows="3">${esc(item?.condition_report_before||"")}</textarea></label>
        <label>Estado após desmontagem<textarea name="conditionReportAfter" rows="3">${esc(item?.condition_report_after||"")}</textarea></label>
        <label>Notas internas<textarea name="internalNotes" rows="4">${esc(item?.internal_notes||"")}</textarea></label>
      </fieldset>
      <div class="schedule-conflict-result" data-schedule-conflicts aria-live="polite"></div>
      <button class="ml-button ml-button--primary" type="submit">Guardar período</button><p data-collab-feedback aria-live="polite"></p>
    </form>
  `);
}

export function collaborativeScheduleDetailView(context,scheduleId){
  if(!hasPermission(context,"exhibitions.manage"))return collaborativeAgendaForbidden(context);
  const item=schedule(context,scheduleId);
  if(!item)return collaborativeShell(context,"",heading("Itinerância","Período não encontrado"));
  const checklist=workspace(context).checklist.filter(row=>row.schedule_id===item.id).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  const events=workspace(context).events.filter(row=>row.exhibition_schedule_id===item.id);
  const actions=`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/exposicoes/${esc(item.exhibition_id)}/agendar?schedule=${esc(item.id)}">Editar</a>${hasPermission(context,"exhibitions.publish")?`<button type="button" class="ml-button ml-button--secondary" data-schedule-publish="${esc(item.id)}" data-publish="${item.public_visibility?"false":"true"}">${item.public_visibility?"Retirar da agenda pública":"Publicar período"}</button>`:""}${hasPermission(context,"exhibitions.logistics")&&hasPermission(context,"tasks.manage")?`<button type="button" class="ml-button ml-button--primary" data-schedule-generate-tasks="${esc(item.id)}">Gerar tarefas logísticas</button>`:""}`;
  return collaborativeShell(context,`/area-colaborativa/gestao/exposicoes/agendamentos/${item.id}`,`
    ${heading("Itinerância",item.public_title||exhibitionName(context,item),dateRange(item),actions)}
    ${scheduleCard(context,item,false)}
    <section class="exhibition-checklist">
      <div class="section-heading-inline"><h2>Checklist logístico</h2><span>${checklist.filter(row=>row.status==="completed").length}/${checklist.length} concluídos</span></div>
      ${checklist.length?`<div class="checklist-list">${checklist.map(row=>`<article class="checklist-item checklist-item--${esc(row.status)}"><div><span>${esc(modelLabel(context,"checklistCategories",row.category))}</span><h3>${esc(row.title)}</h3><p>${esc(row.description||"")}</p></div><div>${statusPill(row.status)}${row.due_at?`<time>${esc(dateTime(row.due_at))}</time>`:""}</div></article>`).join("")}</div>`:`<p class="collab-empty-line">Ainda não existem itens.</p>`}
      <form class="collab-form checklist-form" data-checklist-form data-schedule-id="${esc(item.id)}">
        <div class="form-grid-2"><label>Categoria<select name="category">${options(context.exhibitionModel?.checklistCategories,"other","Selecione")}</select></label><label>Estado<select name="status">${options([{code:"pending",name:"Pendente"},{code:"in-progress",name:"Em curso"},{code:"completed",name:"Concluído"},{code:"blocked",name:"Bloqueado"}],"pending","Selecione")}</select></label><label>Título<input name="title" required></label><label>Prazo<input type="datetime-local" name="dueAt"></label></div><label>Descrição<textarea name="description" rows="2"></textarea></label><button type="submit">Adicionar item</button><p data-collab-feedback></p>
      </form>
    </section>
    <section class="exhibition-events"><div class="section-heading-inline"><h2>Atividades relacionadas</h2><a href="#/area-colaborativa/gestao/agenda/novo?schedule=${esc(item.id)}">Criar atividade</a></div>${events.length?events.map(event=>agendaEventCard(context,event)).join(""):`<p class="collab-empty-line">Sem atividades relacionadas.</p>`}</section>
  `);
}

export function collaborativeAgendaEventEditorView(context,eventId=null,query={}){
  if(!hasPermission(context,"agenda.manage"))return collaborativeAgendaForbidden(context);
  const item=eventId?workspace(context).events.find(row=>row.id===eventId):null;
  const scheduleId=item?.exhibition_schedule_id||query.schedule||"";
  return collaborativeShell(context,item?`/area-colaborativa/gestao/agenda/${item.id}`:"/area-colaborativa/gestao/agenda/novo",`
    ${heading("Agenda",item?"Editar atividade":"Nova atividade","Reunião, visita, oficina, montagem, abertura ou outra ação do projeto.")}
    <form class="collab-form exhibition-editor" data-agenda-event-form data-event-id="${esc(item?.id||"")}">
      <div class="form-grid-2">
        <label>Título<input name="title" required value="${esc(item?.title||"")}"></label>
        <label>Tipo<select name="eventType">${options(context.exhibitionModel?.eventTypes,item?.event_type||"other","Selecione")}</select></label>
        <label>Início<input type="datetime-local" name="startsAt" required value="${esc(isoDateTimeLocal(item?.starts_at))}"></label>
        <label>Fim<input type="datetime-local" name="endsAt" required value="${esc(isoDateTimeLocal(item?.ends_at))}"></label>
        <label>Estado<select name="status">${options(context.exhibitionModel?.eventStatuses,item?.status||"draft","Selecione")}</select></label>
        <label>Visibilidade<select name="visibility">${options(context.exhibitionModel?.visibilityOptions,item?.visibility||"members","Selecione")}</select></label>
        <label>Local cadastrado<select name="venueId">${options(workspace(context).venues.map(row=>({code:row.id,name:row.name})),item?.venue_id,"Sem local cadastrado")}</select></label>
        <label>Local alternativo<input name="locationText" value="${esc(item?.location_text||"")}"></label>
        <label>Período da exposição<select name="exhibitionScheduleId">${options(workspace(context).schedules.map(row=>({code:row.id,name:`${exhibitionName(context,row)} · ${dateRange(row)}`})),scheduleId,"Sem relação")}</select></label>
        <label>Capacidade<input type="number" min="1" name="capacity" value="${esc(item?.capacity||"")}"></label>
      </div>
      <label>Descrição<textarea name="description" rows="4">${esc(item?.description||"")}</textarea></label>
      <div class="form-grid-2"><label>Ligação de inscrição<input type="url" name="registrationUrl" value="${esc(item?.registration_url||"")}"></label><label>Contacto público<input name="publicContact" value="${esc(item?.public_contact||"")}"></label></div>
      <label class="collab-check"><input type="checkbox" name="registrationRequired" ${item?.registration_required?"checked":""}>A atividade exige inscrição ou confirmação.</label>
      <button class="ml-button ml-button--primary" type="submit">Guardar atividade</button><p data-collab-feedback></p>
    </form>
  `);
}

function collaborativeAgendaForbidden(context){
  return collaborativeShell(context,"",heading("Acesso condicionado","Agenda indisponível","O seu perfil não possui permissão para este módulo."));
}
