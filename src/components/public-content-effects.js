/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { memoryCard } from "./memory-card.js";
import { localised } from "../lib/i18n.js";

const esc=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));

function active(effect){
  if(!effect?.enabled||!["approved","published"].includes(effect.status))return false;
  const now=Date.now();
  if(effect.startsAt&&new Date(effect.startsAt).getTime()>now)return false;
  if(effect.endsAt&&new Date(effect.endsAt).getTime()<now)return false;
  return true;
}

function renderMemoryEffect(effect,records,lang){
  const selected=(effect.memoryIds||[])
    .map(id=>records.find(record=>record.id===id))
    .filter(record=>record?.publication?.siteVisible&&record.publication.publicReleaseEligible!==false)
    .slice(0,3);
  if(!selected.length)return"";
  const title=localised(effect.title||{},lang).value||"Memórias em destaque";
  const description=localised(effect.description||{},lang).value||"Conteúdos selecionados após revisão editorial.";
  return `<section class="content-effect content-effect--${esc(effect.effectType||"memory-highlight")}">
    <div class="section-heading"><div><span class="eyebrow">Atualização editorial</span><h2>${esc(title)}</h2></div><p>${esc(description)}</p></div>
    <div class="memory-grid">${selected.map(record=>memoryCard(record,lang)).join("")}</div>
  </section>`;
}

export function renderPublicContentEffects(registry,slot,records,lang){
  const effects=registry?.slots?.[slot]||[];
  return effects.filter(active).map(effect=>{
    if(["memory-highlight","editorial-update"].includes(effect.effectType))return renderMemoryEffect(effect,records,lang);
    if(effect.effectType==="participation-callout"){
      const title=localised(effect.title||{},lang).value;
      const description=localised(effect.description||{},lang).value;
      return `<section class="content-effect content-effect--callout"><h2>${esc(title)}</h2><p>${esc(description)}</p></section>`;
    }
    return"";
  }).filter(Boolean).join("");
}
