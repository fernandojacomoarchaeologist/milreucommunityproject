/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

window.MilreuState = (() => {
  let currentPageId = null;
  function setCurrentPage(id){ currentPageId=id; }
  function getCurrentPage(){ return currentPageId; }
  return {setCurrentPage,getCurrentPage};
})();
