/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C.1 — teste de renderização das rotas colaborativas que estavam ausentes do
 * switch principal de render em src/main.js (rotas mortas → "Página não encontrada"),
 * apesar de existirem no router e na vista. Confirma que cada rota renderiza o seu
 * cabeçalho próprio para um master de demonstração. Não recria páginas nem permissões.
 */
import { test, expect } from "@playwright/test";

const ROUTES = [
  ["/#/area-colaborativa/oportunidades", /Oportunidades/],
  ["/#/area-colaborativa/participacao", /Participa/],
  ["/#/area-colaborativa/piloto", /Piloto/],
  ["/#/area-colaborativa/gestao/piloto", /Gest[aã]o do piloto/],
  ["/#/area-colaborativa/gestao/integracao-publica", /Integra/],
  ["/#/area-colaborativa/gestao/operacao", /Opera/],
];

test.beforeEach(async ({ page }) => {
  await page.goto("/#/");
  await page.evaluate(() => { try { localStorage.clear(); } catch { /* noop */ } });
  await page.goto("/#/area-colaborativa");
  const master = page.locator('[data-collab-demo-login="master"]');
  await expect(master).toBeVisible({ timeout: 15000 });
  await master.click();
});

for (const [route, heading] of ROUTES) {
  test(`a rota ${route} renderiza o seu cabeçalho (não é rota morta)`, async ({ page }) => {
    await page.goto(route);
    const h1 = page.locator("main h1, .collab-page-heading h1").first();
    await expect(h1).toBeVisible({ timeout: 15000 });
    await expect(h1).not.toHaveText(/Página não encontrada/);
    await expect(h1).toHaveText(heading);
  });
}
