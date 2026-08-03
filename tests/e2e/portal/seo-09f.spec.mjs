/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09F — SEO no HTML entregue a crawlers (não só DOM pós-JS): o index.html e as
 * páginas estáticas de memórias públicas carregam metadados corretos; robots bloqueia a
 * indexação em pré-visualização; sem sitemap sem domínio. As rotas privadas continuam a
 * renderizar mas ficam fora da descoberta.
 */
import { test, expect } from "@playwright/test";

test("index.html entrega OG/Twitter/JSON-LD e mantém noindex (preview)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(ld)["@type"]).toBe("WebSite");
});

test("página estática de memória pública tem título, descrição e JSON-LD factual", async ({ page }) => {
  const res = await page.goto("/museu/memorias/MM202601/");
  expect(res?.status()).toBeLessThan(400);
  await expect(page).toHaveTitle(/Projeto Comunitário de Milreu/);
  await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  const parsed = JSON.parse(ld);
  expect(parsed["@type"]).toBe("Photograph");
  expect(parsed.identifier).toBe("MM202601");
  // Preview sem domínio → noindex.
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("robots.txt bloqueia tudo em pré-visualização e não há sitemap", async ({ page }) => {
  const robots = await page.goto("/robots.txt");
  expect(robots?.status()).toBe(200);
  expect(await robots?.text()).toMatch(/Disallow: \//);
  const sitemap = await page.goto("/sitemap.xml");
  expect(sitemap?.status()).toBeGreaterThanOrEqual(400);
});

test("a memória bloqueada MM202617 não tem página estática dedicada (só fallback SPA)", async ({ page }) => {
  // MM202617 não é gerada como página estática. O dev-server faz fallback para a SPA
  // (index.html), pelo que não deve existir JSON-LD Photograph com este identificador.
  const res = await page.goto("/museu/memorias/MM202617/");
  const body = (await res?.text()) || "";
  expect(body).not.toContain('"identifier":"MM202617"');
  expect(body).not.toMatch(/"@type":"Photograph"[\s\S]*MM202617/);
});
