/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09B — o seletor de idiomas: pt-PT selecionável; EN/ES/FR "em preparação"
 * (desativados, sem navegação falsa nem fallback silencioso).
 */
import { test, expect } from "@playwright/test";
import { gotoHome } from "../../helpers/geometry.mjs";

test("EN/ES/FR aparecem desativados e assinalados como em preparação", async ({ page }) => {
  await gotoHome(page);
  const prep = page.locator(".language-switcher__option--preparation");
  await expect(prep).toHaveCount(3);
  for (const i of [0, 1, 2]) {
    await expect(prep.nth(i)).toBeDisabled();
    await expect(prep.nth(i)).toHaveAttribute("aria-disabled", "true");
    await expect(prep.nth(i)).toContainText(/em prepara/i);
  }
});

test("clicar num idioma em preparação não muda o idioma nem navega", async ({ page }) => {
  await gotoHome(page);
  const htmlLangBefore = await page.evaluate(() => document.documentElement.lang);
  // Botão disabled não dispara clique; forçamos para confirmar que nada acontece.
  await page.locator('[data-language-disabled="en"]').click({ force: true }).catch(() => {});
  await page.waitForTimeout(200);
  const stored = await page.evaluate(() => localStorage.getItem("milreu-language"));
  expect(stored === null || stored === "pt-PT", "idioma permanece pt-PT").toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.lang)).toBe(htmlLangBefore);
});

test("pt-PT está marcado como ativo (aria-current)", async ({ page }) => {
  await gotoHome(page);
  const pt = page.locator('.language-switcher [data-language="pt-PT"]');
  await expect(pt).toHaveAttribute("aria-current", "true");
});
