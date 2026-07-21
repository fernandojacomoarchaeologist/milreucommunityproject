/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

window.MilreuRouter = (() => {
  const defaultId="introduction/overview";
  const pages=()=>window.MILREU_CATALOG.pages;
  const getPage=id=>pages().find(page=>page.id===id) || pages().find(page=>page.id===defaultId);
  function currentId(){ const raw=location.hash.replace(/^#\/?/,"").split("?")[0]; return getPage(raw).id; }
  function navigate(id){ location.hash=`#/${getPage(id).id}`; }
  function init(onChange){ window.addEventListener("hashchange",()=>onChange(getPage(currentId()))); if(!location.hash) navigate(defaultId); else onChange(getPage(currentId())); }
  return {init,navigate,getPage,currentId};
})();
