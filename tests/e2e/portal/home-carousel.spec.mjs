/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09A — regressão do banner da Home (classe 08O→08Q): caixa idêntica
 * entre slides, conteúdo essencial dentro da caixa e ausência de scroll horizontal,
 * em cada viewport. Substitui, em Playwright, as asserções banner-* do harness legado.
 */
import { test, expect } from "@playwright/test";
import { VIEWPORTS, measureCarousel, gotoHome } from "../../helpers/geometry.mjs";

for (const vp of VIEWPORTS) {
  test(`banner: caixa igual, conteúdo dentro e sem overflow (${vp.name} ${vp.width}×${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await gotoHome(page);

    const m = await measureCarousel(page);
    expect(m.count, "três slides no carrossel").toBe(3);
    // Caixa idêntica entre os três slides (a regressão 08O→08Q falharia aqui).
    expect(m.maxDiff, `diferença de caixa entre slides (${m.heights?.join("/")})`).toBeLessThanOrEqual(1);
    // Título, subtítulo e botões dentro da caixa de cada slide (não cortados).
    expect(m.contained, "title/subtitle/actions dentro da caixa de cada slide").toBe(true);
    // Sem scroll horizontal global.
    expect(m.horizontalOverflow, "overflow horizontal").toBeLessThanOrEqual(2);
  });
}

test("banner: navegação manual muda de slide e mantém a caixa", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await gotoHome(page);
  const before = await page.evaluate(() => document.querySelector(".home-carousel__slide--active")?.dataset.homeSlide ?? null);
  await page.locator("[data-home-carousel-next]").click();
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => document.querySelector(".home-carousel__slide--active")?.dataset.homeSlide ?? null);
  expect(after, "o índice do slide ativo muda").not.toBe(before);
  const m = await measureCarousel(page);
  expect(m.maxDiff).toBeLessThanOrEqual(1);
  expect(m.contained).toBe(true);
});

test("banner: controlos do carrossel presentes e rotulados", async ({ page }) => {
  await gotoHome(page);
  await expect(page.locator("[data-home-carousel-previous]")).toBeVisible();
  await expect(page.locator("[data-home-carousel-next]")).toBeVisible();
  await expect(page.locator("[data-home-carousel-pause]")).toBeVisible();
  await expect(page.locator("[data-home-carousel-index]")).toHaveCount(3);
});
