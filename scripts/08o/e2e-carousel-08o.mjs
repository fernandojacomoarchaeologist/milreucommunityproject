/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08O — o E2E do carrossel (relógio real) corre dentro do runner
 * Chromium 08J, que passou a incluir as asserções `carousel-*`:
 * contagem/único ativo, navegação manual, paridade da caixa canónica (≤1px),
 * avanço automático após o intervalo real, pausa em hover e movimento reduzido.
 * Este wrapper executa esse runner para que `npm run e2e:08o` seja explícito.
 */
import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["scripts/e2e/run-browser-e2e-08j.mjs"], { stdio: "inherit" });
process.exit(result.status ?? 1);
