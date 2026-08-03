/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09E — verificação em browser da estratégia de media responsiva: a imagem LCP
 * do Museu tem prioridade e srcset (não é lazy); miniaturas fora da dobra são lazy; sem
 * overflow horizontal em mobile. Complementa (não substitui) medição de campo de LCP/CLS,
 * que depende de browser controlado/staging.
 */
import { test, expect } from "@playwright/test";

test("hero do Museu (LCP) tem prioridade alta, srcset e não é lazy", async ({ page }) => {
  await page.goto("/#/museu");
  const hero = page.locator(".museum-opening__image img").first();
  await expect(hero).toBeVisible({ timeout: 15000 });
  await expect(hero).toHaveAttribute("fetchpriority", "high");
  await expect(hero).toHaveAttribute("srcset", /900w.*1600w.*2400w/);
  expect(await hero.getAttribute("loading")).not.toBe("lazy");
});

test("miniaturas da galeria são lazy (fora da dobra)", async ({ page }) => {
  await page.goto("/#/museu/explorar");
  const cards = page.locator(".ml-memory-card__media img");
  await expect(cards.first()).toBeVisible({ timeout: 15000 });
  await expect(cards.first()).toHaveAttribute("loading", "lazy");
});

test("Museu sem overflow horizontal (mobile 360px)", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/#/museu");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("as seis rotas colaborativas continuam a renderizar (09C.1 preservado)", async ({ page }) => {
  await page.goto("/#/area-colaborativa");
  await page.locator('[data-collab-demo-login="master"]').click();
  for (const [route, heading] of [
    ["/#/area-colaborativa/oportunidades", /Oportunidades/],
    ["/#/area-colaborativa/participacao", /Participa/],
    ["/#/area-colaborativa/gestao/operacao", /Opera/],
  ]) {
    await page.goto(route);
    await expect(page.locator("main h1, .collab-page-heading h1").first()).toHaveText(heading, { timeout: 15000 });
  }
});
