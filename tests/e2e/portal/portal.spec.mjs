/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { test, expect } from "@playwright/test";
import { VIEWPORTS, horizontalOverflow, gotoHome } from "../../helpers/geometry.mjs";

test("home carrega, com título e sem app-error", async ({ page }) => {
  await gotoHome(page);
  await expect(page).toHaveTitle(/Milreu/);
  expect(await page.locator(".app-error").count(), "sem app-error").toBe(0);
  await expect(page.locator("main#main")).toHaveCount(1);
  await expect(page.locator("h1").first()).toBeVisible();
});

for (const vp of VIEWPORTS) {
  test(`home sem overflow horizontal (${vp.name})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await gotoHome(page);
    expect(await horizontalOverflow(page), "overflow horizontal").toBeLessThanOrEqual(2);
  });
}

test("navegação Portal → Museu funciona", async ({ page }) => {
  await gotoHome(page);
  await page.locator('a[href="#/museu"]').first().click();
  await page.waitForFunction(() => location.hash.startsWith("#/museu"));
  expect(await page.locator(".app-error").count()).toBe(0);
});
