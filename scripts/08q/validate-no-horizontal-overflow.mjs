/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08Q — garante que a ausência de scroll horizontal foi verificada em todas
 * as áreas e que o carrossel contém a animação de escala (não gera overflow lateral).
 */
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`08Q overflow horizontal: ${m}`); };

const report = read("reports/responsive-audit-08q.json");
for (const area of report.areas) {
  if (area.checks?.["no-horizontal-overflow"] !== "responsive-passed") {
    fail(`a área ${area.area} não confirma ausência de overflow horizontal.`);
  }
}

// O carrossel usa transform:scale na animação de fade; o contentor deve conter o excesso.
const css = text("src/styles/app.css");
if (!/\.home-carousel\{[^}]*overflow:hidden/.test(css)) fail("o carrossel deve conter o excesso (overflow:hidden) para não gerar scroll lateral.");

console.log(`Pacote 08Q sem overflow horizontal: confirmado em ${report.areas.length} áreas; carrossel contém a escala da animação.`);
