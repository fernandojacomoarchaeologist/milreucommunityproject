/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09A — progressive enhancement: sem JavaScript a Home continua legível,
 * com título, subtítulo e botões, sem cards sobrepostos nem overflow horizontal.
 */
import { test, expect } from "@playwright/test";

test.use({ javaScriptEnabled: false });

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1280, height: 800 },
];

for (const vp of viewports) {
  test(`home legível sem JavaScript (${vp.name})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");

    // A app client-side não renderizou; o fallback <noscript> é que garante o conteúdo.
    await expect(page.locator(".no-js-fallback h1")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Museu de Memórias de Milreu" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "O que significa Milreu para si?" })).toBeVisible();

    // Botões/ações essenciais visíveis, incluindo o link externo real do Inquérito.
    await expect(page.getByRole("link", { name: "Entrar no Museu" })).toBeVisible();
    await expect(page.locator('a[href*="surveymonkey.com"]')).toBeVisible();

    // Sem scroll horizontal.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "overflow horizontal sem JS").toBeLessThanOrEqual(2);
  });
}
