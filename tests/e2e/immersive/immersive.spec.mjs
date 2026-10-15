/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { test, expect } from "@playwright/test";

test("Imersivo: entra, tem saída e estado ativo", async ({ page }) => {
  await page.goto("/#/museu/imersivo/MM202601");
  await expect(page.locator("body")).toHaveClass(/\bis-immersive\b/, { timeout: 15_000 });
  const exit = page.locator("[data-immersive-close], .immersive-close-fixed").first();
  await expect(exit).toBeVisible();
  expect(await page.locator(".app-error").count()).toBe(0);
});

test("Imersivo: retorno ao Museu preserva a app", async ({ page }) => {
  await page.goto("/#/museu/imersivo/MM202601");
  await expect(page.locator("body")).toHaveClass(/\bis-immersive\b/, { timeout: 15_000 });
  const back = page.locator("[data-close-immersive], .immersive-return-fixed").first();
  if (await back.count()) {
    await back.click();
    await expect(page.locator("body")).not.toHaveClass(/\bis-immersive\b/);
  }
  expect(await page.locator(".app-error").count()).toBe(0);
});
