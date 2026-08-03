/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C.1 — jornada de oportunidades pela INTERFACE (modo de demonstração local).
 * Atravessa: master cria→publica → descoberta pública → candidato entra→perfil mínimo→
 * candidata-se → master decide → candidato vê o resultado. Complementa (não substitui)
 * a prova de backend em supabase/collab-tests/009c1. Dados sintéticos; sem dados pessoais.
 */
import { test, expect } from "@playwright/test";

const hash = async (page, h) => { await page.evaluate((x) => { location.hash = x; }, h); await page.waitForTimeout(400); };
const login = async (page, kind) => { await hash(page, "#/area-colaborativa"); await page.locator(`[data-collab-demo-login="${kind}"]`).first().click(); await page.waitForTimeout(400); };

test.beforeEach(async ({ page }) => {
  await page.goto("/#/");
  await page.evaluate(() => { localStorage.removeItem("milreu-opportunities-demo-v1"); localStorage.removeItem("milreu-collaborative-demo-context-v9"); });
});

test("jornada completa: master cria/publica, candidato candidata-se, master decide", async ({ page }) => {
  // Master cria e publica
  await login(page, "master");
  await hash(page, "#/area-colaborativa/oportunidades");
  const form = page.locator("[data-opportunity-form]");
  await expect(form).toBeVisible();
  await form.locator('input[name="title"]').fill("Oficina de digitalização (demonstração)");
  await form.locator('input[name="summary"]').fill("Sessão de demonstração para testar a jornada.");
  await form.locator('select[name="opportunityType"]').selectOption("workshop");
  await form.locator('button[type="submit"]').click();
  await page.waitForTimeout(400);
  await page.locator("[data-opportunity-publish]").first().click();
  await page.waitForTimeout(400);
  await expect(page.locator(".opportunity-manage-card .pill").first()).toHaveText(/Publicada/);

  // Descoberta pública (sem candidatos visíveis)
  await hash(page, "#/oportunidades");
  await expect(page.locator(".opportunity-card h2")).toContainText(/Oficina de digitaliza/);
  await expect(page.locator("body")).not.toContainText("demo-volunteer");

  // Candidato: perfil mínimo + candidatura
  await login(page, "volunteer");
  await hash(page, "#/area-colaborativa/oportunidades");
  const profile = page.locator("[data-minimum-profile-form]");
  await expect(profile).toBeVisible();
  await profile.locator('input[name="displayName"]').fill("Voluntário de demonstração");
  await profile.locator('input[name="consent"]').check();
  await profile.locator('button[type="submit"]').click();
  await page.waitForTimeout(400);
  await page.locator("[data-opportunity-apply]").first().click();
  await page.waitForTimeout(400);
  await expect(page.locator(".opportunity-my-apps .pill").first()).toHaveText(/Submetida/);

  // Master decide (aceitar)
  await login(page, "master");
  await hash(page, "#/area-colaborativa/oportunidades");
  await page.evaluate(() => document.querySelectorAll(".opportunity-manage-card__apps").forEach((d) => (d.open = true)));
  await page.locator('[data-opportunity-decide][data-decision="accepted"]').first().click();
  await page.waitForTimeout(400);

  // Candidato vê o resultado
  await login(page, "volunteer");
  await hash(page, "#/area-colaborativa/oportunidades");
  await expect(page.locator(".opportunity-my-apps .pill").first()).toHaveText(/Aceite/);
});

test("perfil mínimo é obrigatório antes de candidatar-se", async ({ page }) => {
  // Master publica uma oportunidade
  await login(page, "master");
  await hash(page, "#/area-colaborativa/oportunidades");
  const form = page.locator("[data-opportunity-form]");
  await form.locator('input[name="title"]').fill("Evento de demonstração");
  await form.locator('input[name="summary"]').fill("Resumo de demonstração.");
  await form.locator('button[type="submit"]').click();
  await page.waitForTimeout(300);
  await page.locator("[data-opportunity-publish]").first().click();
  await page.waitForTimeout(300);
  // Voluntário sem perfil mínimo vê o formulário, não o botão de candidatura
  await login(page, "volunteer");
  await hash(page, "#/area-colaborativa/oportunidades");
  await expect(page.locator("[data-minimum-profile-form]")).toBeVisible();
});

test("o seletor de idiomas do 09D permanece na página pública de oportunidades", async ({ page }) => {
  await hash(page, "#/oportunidades");
  await expect(page.locator(".language-switcher")).toHaveAttribute("aria-describedby", "language-switcher-note");
  await expect(page.locator(".language-switcher__option--preparation")).toHaveCount(3);
});
