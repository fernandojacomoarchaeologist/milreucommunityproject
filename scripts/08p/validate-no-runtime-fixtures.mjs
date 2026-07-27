/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08P — garante que progressos, tarefas, pendências e contadores não vêm
 * de fixtures em staging/produção e que não há fallback silencioso para demo.
 */
import { readFileSync } from "node:fs";

const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`08P fixtures: ${m}`); };

const controller = text("src/collab/controller.js");

// Modo explícito: supabase = RPC canónicas; demo = dados marcados.
if (!/mode\s*===\s*"supabase"/.test(controller)) fail("caminho Supabase explícito ausente.");
if (!/mode\s*===\s*"demo"/.test(controller)) fail("guarda de modo demo explícito ausente.");

// Sem fallback silencioso para demo após erro/config.
if (/catch[\s\S]{0,120}mode\s*=\s*["']demo["']/.test(controller)) fail("fallback silencioso para demo após catch.");
if (/this\.config\.mode\s*=\s*["']demo["']/.test(controller)) fail("modo demo forçado em runtime.");

// As superfícies sensíveis recusam demo (não apresentam fixtures como reais).
for (const surface of [
  "participação contínua opera apenas em staging real",
  "integração pública opera apenas em staging real",
  "operação e governação operam apenas em staging real",
]) {
  if (!controller.includes(surface)) fail(`falta a recusa de demo para: "${surface}".`);
}

// Dados de demonstração marcados como tal.
const demo = text("public/data/collaborative-demo.json");
if (!/demonstra|fict/i.test(demo)) fail("collaborative-demo.json sem marcação de demonstração.");

// A UI de entrada indica o modo demo.
if (!/demonstra/i.test(text("src/views/collaborative.js"))) fail("a UI não indica o modo de demonstração.");

// service_role nunca no browser.
if (!/service_role no navegador/.test(text("src/collab/config.js"))) fail("config não recusa service_role no browser.");

console.log("Pacote 08P sem fixtures em produção: modo explícito, staging real exigido, sem fallback silencioso, demonstração marcada e service_role fora do browser.");
