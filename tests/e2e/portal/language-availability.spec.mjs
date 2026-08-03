/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09D — a fundação multilíngue na superfície: o seletor consulta a disponibilidade
 * real por rota, apresenta uma descrição acessível de indisponibilidade e nunca troca de
 * idioma nem navega para uma URL traduzida falsa. Sem fallback silencioso.
 */
import { test, expect } from "@playwright/test";
import { gotoHome } from "../../helpers/geometry.mjs";

test("o grupo do seletor é descrito por uma nota de indisponibilidade acessível", async ({ page }) => {
  await gotoHome(page);
  const group = page.locator(".language-switcher");
  await expect(group).toHaveAttribute("aria-describedby", "language-switcher-note");
  const note = page.locator("#language-switcher-note[data-locale-note]");
  await expect(note).toHaveCount(1);
  await expect(note).toContainText(/em prepara/i);
  await expect(note).toContainText(/portugu[eê]s/i);
});

test("o documento mantém lang=pt-PT e nenhum idioma-alvo fica ativo", async ({ page }) => {
  await gotoHome(page);
  expect(await page.evaluate(() => document.documentElement.lang)).toBe("pt-PT");
  await expect(page.locator('.language-switcher [data-language="pt-PT"]')).toHaveAttribute("aria-current", "true");
});

test("não existe hreflang nem URL traduzida falsa nesta fundação", async ({ page }) => {
  await gotoHome(page);
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
});

test("a página carrega sem erros de consola", async ({ page }) => {
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => errors.push(String(err)));
  await gotoHome(page);
  await page.waitForTimeout(300);
  expect(errors, errors.join("\n")).toEqual([]);
});
