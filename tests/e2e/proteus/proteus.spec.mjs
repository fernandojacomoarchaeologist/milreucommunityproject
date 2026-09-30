/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { test, expect } from "@playwright/test";
import { gotoHome, horizontalOverflow } from "../../helpers/geometry.mjs";

test("Proteus: slide da home está oculto (decisão editorial) e sem imagem inventada", async ({ page }) => {
  await gotoHome(page);
  // 2026-09: o slide Proteus foi ocultado (hidden:true em home-carousel.json; esconder, não remover).
  const proteus = page.locator(".home-carousel__slide--proteus");
  await expect(proteus).toHaveCount(0);
  // Garantia adicional: nunca há <img> de conteúdo inventado num slide Proteus renderizado.
  expect(await proteus.locator(".home-carousel__media img").count()).toBe(0);
});

test("Proteus: rota Experiência Proteus carrega sem app-error", async ({ page }) => {
  await page.goto("/#/conhecimento");
  await page.waitForFunction(() => document.querySelector("#app")?.textContent.trim().length > 0, { timeout: 15_000 });
  expect(await page.locator(".app-error").count()).toBe(0);
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(2);
});
