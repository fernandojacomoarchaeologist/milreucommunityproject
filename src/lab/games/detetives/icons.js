/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Ícones do jogo (laboratório): grelha 24×24, currentColor, decorativos (aria-hidden).
 * Estado: proposed — registo em docs/design/COMPONENT_REGISTRY.md.
 */
const svg = (body, size = 24) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICONS = {
  lupa: size => svg('<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5 20 20"/><path d="M7.5 8.5a3 3 0 0 1 2-1.8"/>', size),
  pista: size => svg('<path d="M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3z"/><path d="M9.5 20h5"/>', size),
  caderno: size => svg('<path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h11"/><path d="M9 8h5M9 11h4"/>', size),
  marca: size => svg('<circle cx="12" cy="12" r="8"/><path d="m8.5 12 2.5 2.5 4.5-5"/>', size),
  selo: size => svg('<path d="M12 3l2.2 2 3-.4.6 3 2.6 1.6-1.3 2.8 1.3 2.8-2.6 1.6-.6 3-3-.4L12 21l-2.2-2-3 .4-.6-3L3.6 14.8 4.9 12 3.6 9.2 6.2 7.6l.6-3 3 .4z"/><path d="m9 12 2 2 4-4"/>', size),
  pausa: size => svg('<path d="M9 6v12M15 6v12"/>', size),
  som: size => svg('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 9a4 4 0 0 1 0 6"/>', size),
  semSom: size => svg('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="m17 10 4 4M21 10l-4 4"/>', size),
  mais: size => svg('<path d="M12 5v14M5 12h14"/>', size),
  menos: size => svg('<path d="M5 12h14"/>', size),
  repor: size => svg('<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4h4"/>', size),
  voltar: size => svg('<path d="M15 18 9 12l6-6"/>', size),
  cadeado: size => svg('<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', size),
  jogos: size => svg('<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5 20 20"/><path d="M10 7v6M7 10h6"/>', size),
  seta: size => svg('<path d="m6 9 6 6 6-6"/>', size)
};
