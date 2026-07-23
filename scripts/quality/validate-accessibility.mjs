/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";

const content = ["index.html","src/views/portal.js","src/views/museum.js","src/views/channels.js","src/components/layout.js","src/main.js"]
  .map(path => readFileSync(path,"utf8")).join("\n");
const css = readFileSync("src/styles/app.css","utf8");

for (const [pattern,label] of [
  ["skip-link","skip link"],['lang="pt-PT"',"idioma"],["aria-label","nomes acessíveis"],
  ["aria-current","estado atual"],["aria-live","anúncio de resultados"],["Escape","saída imersiva"]
]) {
  if (!content.includes(pattern)) throw new Error(`Acessibilidade ausente: ${label}`);
}
if (!css.includes("object-fit:contain")) throw new Error("Imagem imersiva sem garantia de contenção.");
if (!content.includes('aria-label="Código QR pendente de domínio público"')) throw new Error("Placeholder QR sem descrição.");
console.log("Baseline de acessibilidade validada.");
