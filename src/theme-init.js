/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Modo escuro (ADR 2026-10-13). Corre no <head>, antes do CSS pintar, para evitar o «flash» claro.
 * Sem escolha guardada segue o dispositivo (prefers-color-scheme) e acompanha as suas mudanças;
 * o botão do cabeçalho guarda a escolha neste navegador (localStorage, só preferência visual).
 */
(function () {
  var KEY = "milreu-theme";
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function stored() {
    try { var v = localStorage.getItem(KEY); return v === "dark" || v === "light" ? v : null; } catch (e) { return null; }
  }
  function apply(theme) { root.dataset.theme = theme; }
  function resolve() { return stored() || (media && media.matches ? "dark" : "light"); }
  apply(resolve());
  if (media && media.addEventListener) {
    media.addEventListener("change", function () {
      if (!stored()) { apply(resolve()); window.dispatchEvent(new Event("milreu-theme-change")); }
    });
  }
  window.milreuTheme = {
    set: function (theme) {
      try { localStorage.setItem(KEY, theme); } catch (e) {}
      apply(theme);
    }
  };
})();
