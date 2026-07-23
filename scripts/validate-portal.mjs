/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";

const content = JSON.parse(readFileSync("public/data/portal-content.json","utf8"));
if (content.version !== "0.9.0") throw new Error("Versão do conteúdo do Portal inválida.");
if (content.sourceLanguage !== "pt-PT") throw new Error("pt-PT deve ser a língua de origem.");
if (!Array.isArray(content.initiatives) || content.initiatives.length < 5) {
  throw new Error("Esperadas pelo menos cinco iniciativas.");
}

const slugs = content.initiatives.map(item => item.slug);
if (new Set(slugs).size !== slugs.length) throw new Error("Slugs de iniciativas duplicados.");

const router = readFileSync("src/lib/router.js","utf8");
for (const route of ["/projeto","/metodologia","/iniciativas","/conhecimento","/participar","/sobre"]) {
  if (!router.includes(`"${route}"`)) throw new Error(`Rota ausente: ${route}`);
}

const portal = readFileSync("src/views/portal.js","utf8");
for (const view of ["projectView","methodologyView","initiativesView","knowledgeView","participateView","aboutView"]) {
  if (!portal.includes(`function ${view}`)) throw new Error(`View ausente: ${view}`);
}

if (portal.includes("projeto.milreu@example.invalid")) {
  throw new Error("O Portal não deve publicar um contacto fictício.");
}
console.log("Portal 07B validado.");
