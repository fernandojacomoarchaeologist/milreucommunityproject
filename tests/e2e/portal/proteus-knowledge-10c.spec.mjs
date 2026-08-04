/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10C — a base de conhecimento na interface: estado vazio honesto, filtro por natureza
 * epistémica, 404 de afirmação/entidade, aviso de confiança não-probabilística e ligação a
 * partir de /conhecimento. Sem afirmações históricas reais.
 */
import { test, expect } from "@playwright/test";

test("a base de conhecimento abre com estado vazio honesto e filtros acessíveis", async ({ page }) => {
  await page.goto("/#/conhecimento/afirmacoes");
  await expect(page.locator(".page-title")).toHaveText(/Base de conhecimento/, { timeout: 15000 });
  await expect(page.locator(".collab-empty-state h2")).toHaveText(/Ainda não há afirmações publicadas/);
  await expect(page.locator("[data-proteus-knowledge-filters]")).toBeVisible();
  await expect(page.locator('[data-proteus-knowledge-filters] select[name="class"]')).toBeVisible();
});

test("a confiança é apresentada como não-probabilística", async ({ page }) => {
  await page.goto("/#/conhecimento/afirmacoes");
  await expect(page.locator(".portal-section .fallback-note").first()).toContainText(/nunca por uma percentagem de verdade/);
});

test("uma afirmação inexistente mostra 404 honesto", async ({ page }) => {
  await page.goto("/#/conhecimento/afirmacoes/inexistente-abc");
  await expect(page.locator(".page-title")).toHaveText(/Afirmação não encontrada/, { timeout: 15000 });
});

test("uma entidade inexistente mostra 404 honesto", async ({ page }) => {
  await page.goto("/#/conhecimento/entidades/inexistente-abc");
  await expect(page.locator(".page-title")).toHaveText(/Entidade não encontrada/, { timeout: 15000 });
});

test("a página Proteus (10A) liga à base de conhecimento", async ({ page }) => {
  await page.goto("/#/conhecimento");
  await expect(page.locator('a[href="#/conhecimento/afirmacoes"]')).toBeVisible({ timeout: 15000 });
});

test("sem overflow horizontal na base de conhecimento (mobile 360px)", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/#/conhecimento/afirmacoes");
  await expect(page.locator(".page-title")).toBeVisible({ timeout: 15000 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
