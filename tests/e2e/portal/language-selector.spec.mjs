/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09B — o seletor de idiomas. Decisão editorial 2026-09-30: pt-PT, EN, ES e FR
 * são selecionáveis; o conteúdo ainda sem tradução usa fallback VISÍVEL (não silencioso).
 */
import { test, expect } from "@playwright/test";
import { gotoHome } from "../../helpers/geometry.mjs";

test("pt-PT, EN, ES e FR aparecem como opções selecionáveis (sem estado 'em preparação')", async ({ page }) => {
  await gotoHome(page);
  await expect(page.locator(".language-switcher__option--preparation")).toHaveCount(0);
  for (const code of ["pt-PT", "en", "es", "fr"]) {
    const opt = page.locator(`.language-switcher [data-language="${code}"]`);
    await expect(opt).toHaveCount(1);
    await expect(opt).toBeEnabled();
  }
});

test("clicar em EN muda o idioma da página e persiste", async ({ page }) => {
  await gotoHome(page);
  await page.locator('.language-switcher [data-language="en"]').click();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => document.documentElement.lang)).toBe("en");
  expect(await page.evaluate(() => localStorage.getItem("milreu-language"))).toBe("en");
});

test("pt-PT está marcado como ativo (aria-current) no arranque", async ({ page }) => {
  await gotoHome(page);
  const pt = page.locator('.language-switcher [data-language="pt-PT"]');
  await expect(pt).toHaveAttribute("aria-current", "true");
});
