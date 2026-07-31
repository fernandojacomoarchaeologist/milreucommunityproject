/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C — descoberta pública de oportunidades (sem autenticação): lista com
 * estado vazio honesto, sem overflow horizontal, e detalhe inexistente tratado.
 */
import { test, expect } from "@playwright/test";
import { horizontalOverflow } from "../../helpers/geometry.mjs";

test("lista pública de oportunidades carrega com estado vazio honesto", async ({ page }) => {
  await page.goto("/#/oportunidades");
  await page.waitForFunction(() => document.querySelector("#app")?.textContent.trim().length > 0, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Oportunidades" }).first()).toBeVisible();
  await expect(page.getByText(/ainda não há oportunidades publicadas/i)).toBeVisible();
  expect(await page.locator(".app-error").count()).toBe(0);
});

for (const [name, w, h] of [["mobile", 375, 812], ["desktop", 1280, 800]]) {
  test(`oportunidades sem overflow horizontal (${name})`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/#/oportunidades");
    await page.waitForFunction(() => document.querySelector("#app")?.textContent.trim().length > 0, { timeout: 15_000 });
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(2);
  });
}

test("oportunidade inexistente mostra estado adequado (sem app-error)", async ({ page }) => {
  await page.goto("/#/oportunidades/inexistente");
  await page.waitForFunction(() => /não encontrada/i.test(document.querySelector("#app")?.textContent || ""), { timeout: 15_000 });
  expect(await page.locator(".app-error").count()).toBe(0);
});
