/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { test, expect } from "@playwright/test";

async function demoLogin(page, profile) {
  await page.goto("/#/entrar");
  await page.waitForSelector('[data-collab-demo-login]', { timeout: 15_000 });
  await page.locator(`[data-collab-demo-login="${profile}"]`).click();
  await page.waitForFunction(() => location.hash.includes("/area-colaborativa"));
}

test("Área Colaborativa: entrada de demonstração com três perfis", async ({ page }) => {
  await page.goto("/#/entrar");
  await expect(page.locator("[data-collab-demo-login]")).toHaveCount(3);
});

test("pendente: sem navegação interna (sidebar)", async ({ page }) => {
  await demoLogin(page, "pending");
  await page.waitForTimeout(150);
  expect(await page.locator(".collab-sidebar").count(), "membro pendente não recebe sidebar").toBe(0);
});

test("voluntário: sidebar presente, biblioteca mostra a fonte, admin negado", async ({ page }) => {
  await demoLogin(page, "volunteer");
  await expect(page.locator(".collab-sidebar")).toBeVisible();
  // 08P: a Biblioteca mostra a fonte do recurso.
  await page.goto("/#/area-colaborativa/biblioteca");
  await expect(page.locator(".collab-library-source").first()).toContainText("Fonte:");
  // Rota de administração deve apresentar acesso condicionado.
  await page.goto("/#/area-colaborativa/gestao/sistema");
  await page.waitForFunction(() => /Acesso condicionado|permissão/.test(document.querySelector("#app")?.textContent || ""));
});

test("master: gestão de perfis carrega", async ({ page }) => {
  await demoLogin(page, "master");
  await page.goto("/#/area-colaborativa/gestao/perfis");
  await page.waitForFunction(() => document.querySelector(".collab-sidebar") && /Membros|perfis|Gestão/i.test(document.querySelector("#app")?.textContent || ""));
  expect(await page.locator(".app-error").count()).toBe(0);
});
