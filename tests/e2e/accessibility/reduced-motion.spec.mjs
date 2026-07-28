/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { test, expect } from "@playwright/test";
import { gotoHome } from "../../helpers/geometry.mjs";

test.use({ reducedMotion: "reduce" });

test("movimento reduzido: o carrossel não avança automaticamente", async ({ page }) => {
  await gotoHome(page);
  const before = await page.evaluate(() => document.querySelector(".home-carousel__slide--active")?.dataset.homeSlide ?? null);
  await page.waitForTimeout(10_500); // intervalo do auto-play + margem
  const after = await page.evaluate(() => document.querySelector(".home-carousel__slide--active")?.dataset.homeSlide ?? null);
  expect(after, "sem avanço sob movimento reduzido").toBe(before);
});

test("movimento reduzido: a animação de fade do slide ativo está desativada", async ({ page }) => {
  await gotoHome(page);
  const animationName = await page.evaluate(() => getComputedStyle(document.querySelector(".home-carousel__slide--active")).animationName);
  expect(animationName === "none" || animationName === "").toBeTruthy();
});
