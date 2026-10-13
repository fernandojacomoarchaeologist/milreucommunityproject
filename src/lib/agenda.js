/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Agenda: classificação pela hora do servidor. Paragens por dia (Lisboa), atividades
 * pelo instante. Próximos: início crescente. Realizados: fim decrescente.
 */
export const lisbonDay=ms=>new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Lisbon",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(ms));
export const clockNow=(clock,now=Date.now())=>clock&&Number.isFinite(clock.ms)&&Number.isFinite(clock.fetchedAt)?clock.ms+(now-clock.fetchedAt):now;
export const googleMapsUrl=q=>q?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`:"";

const fromStop=r=>({id:r.id||null,type:"stop",title:r.public_title||r.exhibition_title||"Exposição",category:r.exhibition_type||"Exposição",
  startsOn:r.starts_on||null,endsOn:r.ends_on||r.starts_on||null,venue:r.venue_name||"",parish:r.parish||r.locality||"",municipality:r.municipality||"",
  address:r.address||"",mapsQuery:r.maps_query||[r.venue_name,r.locality].filter(Boolean).join(", "),summary:r.public_summary||r.exhibition_summary||"",
  hours:r.opening_hours||r.venue_opening_hours||"",media:r.media||[],stopId:null,example:r.example===true});
const fromEvent=e=>({id:e.id||null,type:"event",title:e.title||"Atividade",category:"Atividade pública",startsAt:e.startsAt||null,endsAt:e.endsAt||null,
  venue:e.venueName||"",parish:e.parish||"",municipality:e.municipality||"",address:e.locationText||"",mapsQuery:e.mapsQuery||"",summary:e.description||"",
  hours:"",media:e.media||[],stopId:e.stopId||null,example:e.example===true});

export function entryStatus(e,nowMs){
  if(e.type==="stop"){const d=lisbonDay(nowMs);return e.startsOn&&d<e.startsOn?"upcoming":e.endsOn&&d>e.endsOn?"past":"current";}
  const end=Date.parse(e.endsAt||e.startsAt||"");
  return Number.isFinite(end)&&end<nowMs?"past":"upcoming";
}
export const sortKey=(e,end)=>e.type==="stop"?`${(end?e.endsOn:e.startsOn)||""}T00:00:00Z`:new Date((end&&e.endsAt)||e.startsAt||0).toISOString();
export const agendaEntries=s=>[...(s?.current||[]),...(s?.upcoming||[]),...(s?.past||[])].map(fromStop).concat((s?.events||[]).map(fromEvent));

export function classifyAgenda(snapshot,nowMs){
  const g={current:[],upcoming:[],past:[]};
  for(const e of agendaEntries(snapshot)){const status=entryStatus(e,nowMs);g[status].push({...e,status});}
  const asc=(a,b)=>sortKey(a).localeCompare(sortKey(b));
  g.current.sort(asc);g.upcoming.sort(asc);g.past.sort((a,b)=>sortKey(b,1).localeCompare(sortKey(a,1)));
  return g;
}
export const findAgendaEntry=(s,id)=>agendaEntries(s).find(e=>e.id&&e.id===id)||null;
