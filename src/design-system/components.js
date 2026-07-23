/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

window.MilreuComponents=(()=>{
 const esc=v=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const demoAsset=name=>`../../packages/design-components/v0.4/demo-assets/${name}`;
 function memoryCard(data={}){return `<article class="ml-memory-card" ${data.restricted?'data-restricted="true"':''}><div class="ml-memory-card__media"><img src="${esc(data.image||demoAsset('memory-placeholder.svg'))}" alt="${esc(data.alt||'Imagem demonstrativa; não pertence ao acervo.')}"></div><div class="ml-memory-card__body"><span class="ml-memory-card__id">${esc(data.id||'DEMO-MM-001')}</span><h3><a href="#">${esc(data.title||'Memória demonstrativa')}</a></h3><div class="ml-memory-card__meta"><span>${esc(data.date||'Data em revisão')}</span><span class="ml-certainty" data-level="${esc(data.certainty||'probable')}">${esc(data.certaintyLabel||'Provável')}</span></div></div></article>`}
 function confidence(level='confirmed',label='Certa'){return `<span class="ml-certainty" data-level="${esc(level)}">${esc(label)}</span>`}
 function status(state='preliminary',label='Preliminar'){return `<span class="ml-status" data-state="${esc(state)}">${esc(label)}</span>`}
 function rights(state='pending'){return `<aside class="ml-rights" data-state="${esc(state)}"><h3>Direitos e revisão</h3><p>Conteúdo demonstrativo. O estado de publicação e os direitos devem ser verificados antes de qualquer utilização pública.</p><a class="ml-correction" href="#">Comunicar correção, identificação ou pedido de remoção</a></aside>`}
 function enhance(root=document){
   root.querySelectorAll('[data-ml-language]').forEach(group=>group.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;group.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
   root.querySelectorAll('[data-ml-filter-demo]').forEach(bar=>bar.addEventListener('change',()=>{const output=bar.parentElement.querySelector('[data-filter-output]');if(output)output.textContent='Filtros demonstrativos atualizados. Nenhum dado real foi consultado.';}));
 }
 return {memoryCard,confidence,status,rights,enhance,demoAsset};
})();
