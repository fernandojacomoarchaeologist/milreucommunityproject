/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09A — configuração Playwright para E2E geométrico/funcional e no-JS.
 * A regressão visual por screenshots tem a sua própria configuração
 * (playwright.visual.config.mjs) para poder ser executada e revista à parte.
 */
import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.MILREU_PW_PORT || 4188);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  // Retries baixos apenas no CI; não mascaram defeitos sistemáticos (ver FLAKE_AND_PROCESS_STABILITY).
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  outputDir: "test-results",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // Servidor iniciado e encerrado pelo Playwright (teardown garantido, sem perfis órfãos).
  webServer: {
    command: `node scripts/dev-server.mjs --root dist --port ${PORT}`,
    url: `${BASE_URL}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
