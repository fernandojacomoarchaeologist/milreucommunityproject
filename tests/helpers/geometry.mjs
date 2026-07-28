/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09A — helpers de geometria partilhados pelos testes E2E.
 * A lógica é numérica (independente do SO), o que a torna estável entre macOS
 * e o CI Linux e capaz de apanhar a classe de regressão 08O→08Q
 * (cards iguais externamente mas conteúdo interno cortado).
 */
export const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "wide", width: 1440, height: 900 },
];

/** Mede a geometria do carrossel da Home a partir do DOM real. */
export async function measureCarousel(page) {
  return page.evaluate(() => {
    const slides = [...document.querySelectorAll(".home-carousel__slide")];
    if (slides.length === 0) return { count: 0 };
    // offsetHeight ignora o transform:scale da animação de fade → altura de layout real.
    const heights = slides.map((s) => s.offsetHeight);
    const contained = slides.every((slide) => {
      const box = slide.getBoundingClientRect();
      const required = [".eyebrow", "h1", "p", ".hero-actions .ml-button"]
        .map((sel) => slide.querySelector(sel))
        .filter(Boolean);
      return required.every((el) => {
        const r = el.getBoundingClientRect();
        return r.top >= box.top - 2 && r.bottom <= box.bottom + 2 && r.left >= box.left - 2 && r.right <= box.right + 2;
      });
    });
    return {
      count: slides.length,
      heights,
      maxDiff: Math.max(...heights) - Math.min(...heights),
      contained,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
}

/** Overflow horizontal global da página. */
export async function horizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

/** Aguarda a Home renderizada (app client-side) e o equalizador do carrossel aplicado. */
export async function gotoHome(page) {
  await page.goto("/#/");
  await page.waitForSelector(".home-carousel__slide--active", { timeout: 15_000 });
  // O equalizador corre no bindPage; damos um instante para o layout assentar.
  await page.waitForTimeout(150);
}
