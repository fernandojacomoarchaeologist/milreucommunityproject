/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { test, expect } from "@playwright/test";
import { gotoHome, horizontalOverflow } from "../../helpers/geometry.mjs";

test("Proteus: slide da home é empty-state sem imagem inventada", async ({ page }) => {
  await gotoHome(page);
  const proteus = page.locator(".home-carousel__slide--proteus");
  await expect(proteus).toHaveCount(1);
  // Não deve haver <img> de conteúdo inventado no slide Proteus (apenas o símbolo da marca no diagrama).
  expect(await proteus.locator(".home-carousel__media img").count()).toBe(0);
});

test("Proteus: rota Experiência Proteus carrega sem app-error", async ({ page }) => {
  await page.goto("/#/conhecimento");
  await page.waitForFunction(() => document.querySelector("#app")?.textContent.trim().length > 0, { timeout: 15_000 });
  expect(await page.locator(".app-error").count()).toBe(0);
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(2);
});
