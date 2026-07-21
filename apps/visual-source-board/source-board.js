/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md e SOURCE_RIGHTS_NOTICE.md.
 */
const state={pages:[]};
const el={grid:document.querySelector('#grid'),search:document.querySelector('#search'),decision:document.querySelector('#decision'),tag:document.querySelector('#tag'),count:document.querySelector('#count')};
async function load(){
  const response=await fetch('../../data/design-source/page-elements.json');
  if(!response.ok) throw new Error('Não foi possível carregar o mapa de páginas.');
  const data=await response.json(); state.pages=data.pages;
  const tags=[...new Set(state.pages.flatMap(p=>p.tags))].sort();
  for(const tag of tags){const option=document.createElement('option');option.value=tag;option.textContent=tag;el.tag.append(option)}
  render();
}
function render(){
  const q=el.search.value.trim().toLowerCase(); const decision=el.decision.value; const tag=el.tag.value;
  const pages=state.pages.filter(p=>{const hay=[p.title,p.observation,p.notes,...p.tags].join(' ').toLowerCase();return(!q||hay.includes(q))&&(!decision||p.decision===decision)&&(!tag||p.tags.includes(tag))});
  el.count.textContent=`${pages.length} de ${state.pages.length} páginas`;
  el.grid.replaceChildren();
  if(!pages.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='Nenhuma página corresponde aos filtros.';el.grid.append(empty);return}
  for(const p of pages){
    const article=document.createElement('article');article.className='card';
    article.innerHTML=`<img src="assets/pages/page-${String(p.page).padStart(2,'0')}.webp" alt="Miniatura interna da página PDF ${p.page}: ${p.title}" loading="lazy"><div class="card-body"><div class="meta"><span class="badge">PDF ${String(p.page).padStart(2,'0')}</span><span class="badge decision">${p.decision}</span></div><h2>${p.title}</h2><p>${p.observation}</p><div class="meta">${p.tags.map(t=>`<span class="badge">${t}</span>`).join('')}</div><p><strong>Nota:</strong> ${p.notes}</p></div>`;
    el.grid.append(article);
  }
}
for(const input of [el.search,el.decision,el.tag]) input.addEventListener('input',render);
load().catch(err=>{el.grid.innerHTML=`<p class="empty">${err.message} Sirva a raiz do repositório através de HTTP.</p>`});
