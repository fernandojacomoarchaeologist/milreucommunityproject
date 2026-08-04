/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10B/10B.1 — a Biblioteca Proteus na interface: piloto catalográfico controlado
 * (obras publicadas com fontes/direitos), pesquisa/filtros acessíveis, fichas 404 honestas,
 * distinção acesso aberto vs disponibilidade externa, e regressão do placeholder 10A.
 */
import { test, expect } from "@playwright/test";

test("a Biblioteca lista o piloto controlado e mantém filtros acessíveis", async ({ page }) => {
  await page.goto("/#/conhecimento/biblioteca");
  await expect(page.locator(".page-title")).toHaveText(/Biblioteca/, { timeout: 15000 });
  await expect(page.locator(".proteus-work-card")).toHaveCount(3);
  await expect(page.locator("[data-proteus-library-filters]")).toBeVisible();
  await expect(page.locator('[data-proteus-library-filters] input[name="q"]')).toBeVisible();
  // Recurso institucional (bilheteira) com aviso de atualidade.
  await expect(page.locator(".proteus-resource-card")).toHaveCount(1);
  await expect(page.locator(".proteus-resource-card .fallback-note")).toContainText(/Última verificação/);
});

test("obra de acesso aberto liga ao texto integral", async ({ page }) => {
  await page.goto("/#/conhecimento/biblioteca/hauschild-2008-arquitectura-mosaicos-milreu");
  await expect(page.locator(".page-title")).toBeVisible({ timeout: 15000 });
  await expect(page.locator(".proteus-work-detail")).toContainText(/Aceder ao texto integral/);
});

test("obra restrita distingue disponibilidade externa de licença por confirmar", async ({ page }) => {
  await page.goto("/#/conhecimento/biblioteca/teichner-2006-de-lo-romano-a-lo-arabe");
  await expect(page.locator(".page-title")).toBeVisible({ timeout: 15000 });
  const detail = page.locator(".proteus-work-detail");
  await expect(detail).toContainText(/Ver página externa/);
  await expect(detail).toContainText(/não implica direito de reutilização/);
  await expect(detail).not.toContainText(/Aceder ao texto integral/);
});

test("um registo privado do piloto continua fora do catálogo público (404)", async ({ page }) => {
  await page.goto("/#/conhecimento/biblioteca/jacomo-2026-desafios-integracao-comunitaria");
  await expect(page.locator(".page-title")).toHaveText(/Obra não encontrada/, { timeout: 15000 });
});

test("uma obra inexistente mostra 404 honesto", async ({ page }) => {
  await page.goto("/#/conhecimento/biblioteca/obra-inexistente");
  await expect(page.locator(".page-title")).toHaveText(/Obra não encontrada/, { timeout: 15000 });
});

test("um autor inexistente mostra 404 honesto", async ({ page }) => {
  await page.goto("/#/conhecimento/autores/autor-inexistente");
  await expect(page.locator(".page-title")).toHaveText(/Autor não encontrado/, { timeout: 15000 });
});

test("a página Proteus (10A) preserva o placeholder e liga à Biblioteca", async ({ page }) => {
  await page.goto("/#/conhecimento");
  await expect(page.locator(".proteus-overview")).toBeVisible({ timeout: 15000 });
  await expect(page.locator('a[href="#/conhecimento/biblioteca"]')).toBeVisible();
});

test("sem overflow horizontal na Biblioteca (mobile 360px)", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/#/conhecimento/biblioteca");
  await expect(page.locator(".page-title")).toBeVisible({ timeout: 15000 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
