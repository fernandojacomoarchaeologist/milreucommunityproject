/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { test, expect } from "@playwright/test";
import { horizontalOverflow } from "../../helpers/geometry.mjs";

const routes = [
  ["museu", "/#/museu"],
  ["galeria", "/#/museu/explorar"],
  ["memória", "/#/museu/memorias/MM202601"],
];

for (const [name, route] of routes) {
  test(`Museu: ${name} carrega sem app-error nem overflow`, async ({ page }) => {
    await page.goto(route);
    await page.waitForFunction(() => document.querySelector("#app")?.textContent.trim().length > 0, { timeout: 15_000 });
    expect(await page.locator(".app-error").count(), "sem app-error").toBe(0);
    await expect(page.locator("h1").first()).toBeVisible();
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(2);
  });
}
