/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C.1 — jornada de oportunidades pela INTERFACE (modo de demonstração local).
 * Atravessa: master cria→publica → descoberta pública → candidato entra→perfil mínimo→
 * candidata-se → master decide → candidato vê o resultado. Complementa (não substitui)
 * a prova de backend em supabase/collab-tests/009c1. Dados sintéticos; sem dados pessoais.
 *
 * Navegação por page.goto (reload) por passo: o estado de demonstração persiste em
 * localStorage; evita a corrida do hashchange antes do bootstrap no arranque frio do CI.
 */
import { test, expect } from "@playwright/test";

async function loginDemo(page, kind) {
  await page.goto("/#/area-colaborativa");
  const btn = page.locator(`[data-collab-demo-login="${kind}"]`);
  await expect(btn).toBeVisible({ timeout: 15000 });
  await btn.click();
  // Espera o re-render pós-login (o dashboard do master). O passo seguinte faz page.goto.
  await expect(page.locator("[data-collab-demo-login]")).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/#/");
  await page.evaluate(() => { try { localStorage.clear(); } catch { /* noop */ } });
});

test("jornada completa: master cria/publica, candidato candidata-se, master decide", async ({ page }) => {
  // Master cria e publica
  await loginDemo(page, "master");
  await page.goto("/#/area-colaborativa/oportunidades");
  const form = page.locator("[data-opportunity-form]");
  await expect(form).toBeVisible({ timeout: 15000 });
  await form.locator('input[name="title"]').fill("Oficina de digitalização (demonstração)");
  await form.locator('input[name="summary"]').fill("Sessão de demonstração para testar a jornada.");
  await form.locator('select[name="opportunityType"]').selectOption("workshop");
  await form.locator('button[type="submit"]').click();
  const publishBtn = page.locator("[data-opportunity-publish]").first();
  await expect(publishBtn).toBeVisible({ timeout: 15000 });
  await publishBtn.click();
  await expect(page.locator(".opportunity-manage-card .pill").first()).toHaveText(/Publicada/, { timeout: 15000 });

  // Descoberta pública (sem candidatos visíveis)
  await page.goto("/#/oportunidades");
  await expect(page.locator(".opportunity-card h2")).toContainText(/Oficina de digitaliza/, { timeout: 15000 });

  // Candidato: perfil mínimo + candidatura
  await loginDemo(page, "volunteer");
  await page.goto("/#/area-colaborativa/oportunidades");
  const profile = page.locator("[data-minimum-profile-form]");
  await expect(profile).toBeVisible({ timeout: 15000 });
  await profile.locator('input[name="displayName"]').fill("Voluntário de demonstração");
  await profile.locator('input[name="consent"]').check();
  await profile.locator('button[type="submit"]').click();
  const applyBtn = page.locator("[data-opportunity-apply]").first();
  await expect(applyBtn).toBeVisible({ timeout: 15000 });
  await applyBtn.click();
  await expect(page.locator(".opportunity-my-apps .pill").first()).toHaveText(/Submetida/, { timeout: 15000 });

  // Master decide (aceitar)
  await loginDemo(page, "master");
  await page.goto("/#/area-colaborativa/oportunidades");
  await page.evaluate(() => document.querySelectorAll(".opportunity-manage-card__apps").forEach((d) => (d.open = true)));
  const acceptBtn = page.locator('[data-opportunity-decide][data-decision="accepted"]').first();
  await expect(acceptBtn).toBeVisible({ timeout: 15000 });
  await acceptBtn.click();
  await page.waitForTimeout(600);

  // Candidato vê o resultado
  await loginDemo(page, "volunteer");
  await page.goto("/#/area-colaborativa/oportunidades");
  await expect(page.locator(".opportunity-my-apps .pill").first()).toHaveText(/Aceite/, { timeout: 15000 });
});

test("perfil mínimo é obrigatório antes de candidatar-se", async ({ page }) => {
  await loginDemo(page, "master");
  await page.goto("/#/area-colaborativa/oportunidades");
  const form = page.locator("[data-opportunity-form]");
  await expect(form).toBeVisible({ timeout: 15000 });
  await form.locator('input[name="title"]').fill("Evento de demonstração");
  await form.locator('input[name="summary"]').fill("Resumo de demonstração.");
  await form.locator('button[type="submit"]').click();
  const publishBtn = page.locator("[data-opportunity-publish]").first();
  await expect(publishBtn).toBeVisible({ timeout: 15000 });
  await publishBtn.click();
  // Voluntário sem perfil mínimo vê o formulário, não o botão de candidatura
  await loginDemo(page, "volunteer");
  await page.goto("/#/area-colaborativa/oportunidades");
  await expect(page.locator("[data-minimum-profile-form]")).toBeVisible({ timeout: 15000 });
});

test("o seletor de idiomas do 09D permanece na página pública de oportunidades", async ({ page }) => {
  await page.goto("/#/oportunidades");
  await expect(page.locator(".language-switcher")).toHaveAttribute("aria-describedby", "language-switcher-note");
  await expect(page.locator(".language-switcher__option--preparation")).toHaveCount(3);
});
