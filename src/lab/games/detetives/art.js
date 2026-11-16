/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Detetives da Memória — peças gráficas do jogo (SVG próprio, editável e reutilizável).
 * Linhas e formas controladas, superfícies mates, cores SEMPRE por currentColor ou variáveis de
 * tokens (sem hexadecimais). Estado: proposed (registo DS-L005..DS-L011 em COMPONENT_REGISTRY.md).
 */

// Lupa grande (aro + pega) — moldura da lente interactiva. A lente em si é HTML (ampliação real).
export const LOUPE_FRAME = `<svg class="dm-loupe__frame" viewBox="0 0 220 300" aria-hidden="true" focusable="false">
  <circle cx="110" cy="110" r="94" fill="none" stroke="var(--ml-text-primary)" stroke-width="10"/>
  <circle cx="110" cy="110" r="88" fill="none" stroke="var(--ml-color-paper-0)" stroke-width="2" opacity=".55"/>
  <path d="M60 64a68 68 0 0 1 34-24" fill="none" stroke="var(--ml-color-paper-0)" stroke-width="6" stroke-linecap="round" opacity=".7"/>
  <rect x="98" y="200" width="24" height="14" rx="3" fill="var(--ml-text-primary)"/>
  <rect x="96" y="212" width="28" height="80" rx="12" fill="var(--ml-surface-signature)" stroke="var(--ml-text-primary)" stroke-width="4"/>
  <path d="M104 226v52" stroke="var(--ml-color-paper-0)" stroke-width="3" stroke-linecap="round" opacity=".45"/>
</svg>`;

// Ícones das ferramentas (grelha 24×24, currentColor).
const icon = body => `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
export const TOOL = {
  lupa: icon('<circle cx="10" cy="10" r="6.5"/><path d="M15 15l5.5 5.5" stroke-width="2.6"/><path d="M7 8.5a3.5 3.5 0 0 1 2.4-2"/>'),
  mais: icon('<circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6"/><path d="M16.5 16.5 20 20"/>'),
  menos: icon('<circle cx="11" cy="11" r="7"/><path d="M8 11h6"/><path d="M16.5 16.5 20 20"/>'),
  ajustar: icon('<path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4"/>'),
  pista: icon('<path d="M12 3a6 6 0 0 0-3.6 10.8c.4.3.6.8.6 1.3V17h6v-1.9c0-.5.2-1 .6-1.3A6 6 0 0 0 12 3z"/><path d="M9.5 20.5h5"/>'),
  lista: icon('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'),
  voltar: icon('<path d="M15 18l-6-6 6-6"/>'),
  pausa: icon('<path d="M9 6v12M15 6v12"/>'),
  som: icon('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 9a4 4 0 0 1 0 6"/>'),
  semSom: icon('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M17 10l4 4M21 10l-4 4"/>'),
  fechar: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
  certo: icon('<path d="M5 12.5l4.5 4.5L19 7.5" stroke-width="2.6"/>')
};

// Caderno de Campo — objecto pousado no canto da mesa (capa, elástico, etiqueta e uma ponta de fotografia).
export const NOTEBOOK = `<svg class="dm-notebook-obj__svg" viewBox="0 0 120 150" aria-hidden="true" focusable="false">
  <rect x="14" y="10" width="92" height="128" rx="6" fill="var(--ml-text-primary)" opacity=".18" transform="translate(4 5)"/>
  <rect x="96" y="20" width="10" height="110" rx="2" fill="var(--ml-color-paper-0)" stroke="var(--ml-border-strong)" stroke-width="2"/>
  <rect x="12" y="8" width="88" height="128" rx="6" fill="var(--ml-surface-signature)" stroke="var(--ml-text-primary)" stroke-width="3"/>
  <rect x="22" y="8" width="5" height="128" fill="var(--ml-text-primary)" opacity=".25"/>
  <rect x="38" y="34" width="50" height="30" rx="2" fill="var(--ml-color-paper-0)" stroke="var(--ml-text-primary)" stroke-width="2"/>
  <path d="M45 44h36M45 52h24" stroke="var(--ml-text-primary)" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="78" y="8" width="8" height="128" fill="var(--ml-text-primary)" opacity=".7"/>
  <rect x="46" y="96" width="34" height="26" fill="var(--ml-color-paper-0)" stroke="var(--ml-text-primary)" stroke-width="2" transform="rotate(-9 63 109)"/>
</svg>`;

// Selo de missão concluída (carimbo) — anel duplo, estrela de oito pontas e texto curvo.
export function stampSvg(label = "Investigação concluída") {
  const safe = String(label).replace(/[&<>"']/g, "");
  return `<svg class="dm-stamp-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
    <defs><path id="dm-arc" d="M30 100a70 70 0 1 1 140 0"/></defs>
    <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="6"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="2"/>
    <text font-family="Archivo, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="2.5" fill="currentColor"><textPath href="#dm-arc" startOffset="50%" text-anchor="middle">${safe.toUpperCase()}</textPath></text>
    <path d="M100 66l9 16 18-4-4 18 16 9-16 9 4 18-18-4-9 16-9-16-18 4 4-18-16-9 16-9-4-18 18 4z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
    <path d="M86 104l10 10 20-22" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="100" y="160" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-size="13" font-weight="800" letter-spacing="2" fill="currentColor">MILREU</text>
  </svg>`;
}

// Fita-cola de papel (pormenor desenhado nos cantos da fotografia).
export const TAPE = `<svg class="dm-tape" viewBox="0 0 80 28" aria-hidden="true" focusable="false"><path d="M3 5l74-2 -1 21-73 2 3-5-3-5 3-5z" fill="var(--ml-surface-tint-warning)" stroke="var(--ml-border-default)" stroke-width="1.2" opacity=".92"/></svg>`;

// Guia (avatar futuro): por agora, um medalhão com a lupa. O espaço aceita depois um retrato ilustrado
// com expressões (neutra, descoberta, curiosidade, celebração) — ver docs/design/AVATAR_GUIA_ESPECIFICACAO.md.
export const GUIDE_BADGE = `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="22" fill="var(--ml-surface-reading)" stroke="var(--ml-text-primary)" stroke-width="2.5"/><circle cx="21" cy="21" r="8.5" fill="none" stroke="var(--ml-surface-signature)" stroke-width="3"/><path d="M27.5 27.5l7.5 7.5" stroke="var(--ml-text-primary)" stroke-width="4" stroke-linecap="round"/></svg>`;
