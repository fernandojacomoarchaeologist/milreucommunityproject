/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09A — regressão visual por screenshots das superfícies iniciais.
 * Os baselines são estabelecidos por um passo explícito e revisável
 * (`npm run test:visual:update` no Linux, via workflow manual). Nunca no CI automático.
 */
import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "wide", width: 1440, height: 900 },
];

// [área, rota, seletor de espera]
const SURFACES = [
  ["portal", "/#/", ".home-carousel__slide--active"],
  ["museum", "/#/museu", "main#main h1"],
  ["proteus", "/#/conhecimento", "main#main"],
];

for (const [area, route, ready] of SURFACES) {
  for (const vp of VIEWPORTS) {
    test(`${area} @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route);
      await page.waitForSelector(ready, { timeout: 15_000 });
      await page.waitForTimeout(300);
      await expect(page).toHaveScreenshot(`${area}-${vp.name}.png`, { fullPage: true });
    });
  }
}

test("immersive @ desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#/museu/imersivo/MM202601");
  await page.waitForFunction(() => document.body.classList.contains("is-immersive"), { timeout: 15_000 });
  await page.waitForTimeout(400);
  await expect(page).toHaveScreenshot("immersive-desktop.png");
});

test("collaborative-area login @ desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#/entrar");
  await page.waitForSelector("[data-collab-demo-login]", { timeout: 15_000 });
  await page.waitForTimeout(200);
  await expect(page).toHaveScreenshot("collaborative-login-desktop.png", { fullPage: true });
});
