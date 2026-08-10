/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10D — E2E da documentação da API pública: a rota carrega com estado disponível e
 * coleções vazias honestas, sem overflow horizontal, e a Biblioteca liga discretamente à API.
 */
import { test, expect } from "@playwright/test";
import { horizontalOverflow } from "../../helpers/geometry.mjs";

const ready = async (page) => page.waitForFunction(() => document.querySelector("#app")?.textContent.trim().length > 0, { timeout: 15_000 });

test("a API pública carrega com estado disponível e coleções vazias honestas", async ({ page }) => {
  await page.goto("/#/conhecimento/api");
  await ready(page);
  await expect(page.getByRole("heading", { name: "API pública" }).first()).toBeVisible();
  await expect(page.getByText(/somente leitura/i).first()).toBeVisible();
  await expect(page.getByText(/coleções estão vazias|vazia/i).first()).toBeVisible();
  await expect(page.getByText(/nega/i).first()).toBeVisible();
  expect(await page.locator(".app-error").count()).toBe(0);
});

test("a tabela de recursos mostra os cinco recursos a zero", async ({ page }) => {
  await page.goto("/#/conhecimento/api");
  await ready(page);
  const counts = await page.locator(".proteus-api-table tbody .proteus-api-count").allTextContents();
  expect(counts.length).toBe(5);
  for (const c of counts) expect(c.trim()).toBe("0");
});

for (const [name, w, h] of [["mobile", 375, 812], ["desktop", 1280, 800]]) {
  test(`API pública sem overflow horizontal (${name})`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/#/conhecimento/api");
    await ready(page);
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(2);
  });
}

test("a Biblioteca liga à documentação da API", async ({ page }) => {
  await page.goto("/#/conhecimento/biblioteca");
  await ready(page);
  const link = page.locator('.proteus-api-docs-link a[href="#/conhecimento/api"]');
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "API pública" }).first()).toBeVisible();
});
