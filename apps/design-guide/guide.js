/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

(() => {
  const catalog=window.MILREU_CATALOG;
  const nav=document.getElementById("catalog-nav");
  const breadcrumb=document.getElementById("breadcrumb");
  const pagination=document.getElementById("page-pagination");
  const toc=document.getElementById("toc");
  const dialog=document.getElementById("search-dialog");
  const input=document.getElementById("search-input");
  const results=document.getElementById("search-results");
  const navToggle=document.getElementById("nav-toggle");
  const backdrop=document.getElementById("nav-backdrop");
  let resultIndex=0;

  function groupLabel(group){ return MilreuI18n.t(group.labelKey); }
  function renderNav(){
    nav.innerHTML=catalog.groups.map(group=>{
      const pages=catalog.pages.filter(page=>page.group===group.id);
      return `<section class="nav-group"><h2 class="nav-group-title">${groupLabel(group)}</h2>${pages.map(page=>`<a href="#/${page.id}" data-page-id="${page.id}"><span>${page.title}</span><span class="nav-status-dot" data-status="${page.status}" title="${MilreuRenderers.statusLabel(page.status)}"></span></a>`).join("")}</section>`;
    }).join("");
  }
  function renderBreadcrumb(page){ const group=catalog.groups.find(g=>g.id===page.group); breadcrumb.innerHTML=`<a href="#/introduction/overview">Milreu DS</a><span aria-hidden="true">/</span><span>${groupLabel(group)}</span><span aria-hidden="true">/</span><span aria-current="page">${page.title}</span>`; }
  function renderPagination(page){ const index=catalog.pages.findIndex(item=>item.id===page.id); const prev=catalog.pages[index-1]; const next=catalog.pages[index+1]; pagination.innerHTML=`${prev?`<a href="#/${prev.id}"><small>← ${MilreuI18n.t("previous")}</small><strong>${prev.title}</strong></a>`:"<span></span>"}${next?`<a href="#/${next.id}"><small>${MilreuI18n.t("next")} →</small><strong>${next.title}</strong></a>`:""}`; }
  function renderToc(page){ toc.innerHTML=`<h2>${MilreuI18n.t("onThisPage")}</h2>${page.sections.map(s=>`<a href="#${s.id}" data-anchor="${s.id}">${s.title}</a>`).join("")}<a href="#implementation" data-anchor="implementation">Implementação</a>`; toc.querySelectorAll("[data-anchor]").forEach(link=>link.addEventListener("click",event=>{ event.preventDefault(); document.getElementById(link.dataset.anchor)?.scrollIntoView({behavior:"smooth",block:"start"}); })); }
  function activateNav(page){ document.querySelectorAll("[data-page-id]").forEach(link=>link.setAttribute("aria-current",link.dataset.pageId===page.id?"page":"false")); const active=nav.querySelector(`[data-page-id="${CSS.escape(page.id)}"]`); active?.scrollIntoView({block:"nearest"}); }
  function closeMobileNav(){ document.body.classList.remove("nav-open"); navToggle.setAttribute("aria-expanded","false"); backdrop.hidden=true; }
  function onPage(page){ MilreuState.setCurrentPage(page.id); MilreuRenderers.renderPage(page); renderBreadcrumb(page); renderPagination(page); renderToc(page); activateNav(page); document.title=`${page.title} — Sistema de Design de Milreu`; document.getElementById("page-content").focus({preventScroll:true}); window.scrollTo({top:0,behavior:"instant"}); closeMobileNav(); }

  function renderSearch(query=""){
    const pages=MilreuSearch.search(query); resultIndex=0;
    if(!pages.length){ results.innerHTML=`<p class="empty-state">${MilreuI18n.t("noResults")}</p>`; return; }
    results.innerHTML=pages.map((page,index)=>`<a class="search-result" href="#/${page.id}" role="option" aria-selected="${index===0}" data-result-index="${index}"><strong>${page.title}</strong><span>${page.summary}</span></a>`).join("");
    results.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>dialog.close()));
  }
  function openSearch(){ dialog.showModal(); input.value=""; renderSearch(); setTimeout(()=>input.focus(),0); }
  function selectResult(next){ const items=[...results.querySelectorAll("[data-result-index]")]; if(!items.length) return; resultIndex=(next+items.length)%items.length; items.forEach((item,i)=>item.setAttribute("aria-selected",String(i===resultIndex))); items[resultIndex].scrollIntoView({block:"nearest"}); }

  document.getElementById("search-trigger").addEventListener("click",openSearch);
  input.addEventListener("input",()=>renderSearch(input.value));
  input.addEventListener("keydown",event=>{ if(event.key==="ArrowDown"){event.preventDefault();selectResult(resultIndex+1);} if(event.key==="ArrowUp"){event.preventDefault();selectResult(resultIndex-1);} if(event.key==="Enter"){ const active=results.querySelector(`[data-result-index="${resultIndex}"]`); if(active){event.preventDefault();active.click();} } });
  window.addEventListener("keydown",event=>{ if(event.key==="/" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)){ event.preventDefault(); openSearch(); } });
  navToggle.addEventListener("click",()=>{ const open=!document.body.classList.contains("nav-open"); document.body.classList.toggle("nav-open",open); navToggle.setAttribute("aria-expanded",String(open)); backdrop.hidden=!open; });
  backdrop.addEventListener("click",closeMobileNav);
  window.addEventListener("milreu:locale",()=>{ renderNav(); const page=MilreuRouter.getPage(MilreuState.getCurrentPage()); onPage(page); });

  MilreuI18n.init(); renderNav(); MilreuRouter.init(onPage);
})();
