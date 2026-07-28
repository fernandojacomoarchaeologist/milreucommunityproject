/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09A — configuração da regressão visual por screenshots (separada da
 * suite geométrica). Os baselines são estabelecidos por um passo explícito e
 * revisável (workflow manual no Linux); nunca atualizados automaticamente no CI.
 */
import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.MILREU_PW_PORT || 4189);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "tests/visual",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 45_000,
  // Tolerância mínima para ruído de anti-aliasing; baselines gerados no MESMO SO do CI.
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", caret: "hide" } },
  reporter: [["list"], ["html", { outputFolder: "playwright-report-visual", open: "never" }]],
  outputDir: "test-results-visual",
  snapshotPathTemplate: "tests/visual/__screenshots__/{testFilePath}/{arg}{ext}",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Estabiliza o carrossel: sem auto-play e sem animação de fade → screenshots determinísticos.
    reducedMotion: "reduce",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `node scripts/dev-server.mjs --root dist --port ${PORT}`,
    url: `${BASE_URL}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
