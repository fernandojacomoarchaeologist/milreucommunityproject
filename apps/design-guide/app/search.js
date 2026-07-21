/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

window.MilreuSearch = (() => {
  const normalise = value => (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  function search(query){
    const q=normalise(query).trim();
    if(!q) return window.MILREU_CATALOG.pages.slice(0,8);
    return window.MILREU_CATALOG.pages.map(page=>{
      const fields=[page.title,page.summary,page.group,...page.tags].map(normalise);
      const score=fields.reduce((total,field,index)=>total+(field.includes(q)?(index===0?8:index===1?5:2):0),0);
      return {page,score};
    }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score || a.page.title.localeCompare(b.page.title)).map(item=>item.page).slice(0,12);
  }
  return {search};
})();
