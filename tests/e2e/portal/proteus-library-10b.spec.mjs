/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10B — a Biblioteca Proteus na interface: catálogo inicial VAZIO e honesto,
 * pesquisa/filtros acessíveis, fichas 404 honestas, e regressão do placeholder 10A.
 */
import { test, expect } from "@playwright/test";

test("a Biblioteca abre com estado vazio honesto e filtros acessíveis", async ({ page }) => {
  await page.goto("/#/conhecimento/biblioteca");
  await expect(page.locator(".page-title")).toHaveText(/Biblioteca/, { timeout: 15000 });
  await expect(page.locator(".collab-empty-state h2")).toHaveText(/Ainda não há obras publicadas/);
  await expect(page.locator("[data-proteus-library-filters]")).toBeVisible();
  await expect(page.locator('[data-proteus-library-filters] input[name="q"]')).toBeVisible();
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
