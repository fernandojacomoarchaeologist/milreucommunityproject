/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08O — garante que os fixtures/demo nunca são apresentados como dados
 * reais em staging ou produção e que não há fallback silencioso para demo.
 */
import { readFileSync, existsSync } from "node:fs";

const readText = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`08O fixtures: ${m}`); };

const controller = readText("src/collab/controller.js");

// 1. O modo demo é explícito e as escritas reais passam pelo Supabase (RPC).
if (!/mode\s*===\s*"supabase"/.test(controller)) fail("controller sem caminho Supabase explícito.");
if (!/mode\s*===\s*"demo"/.test(controller)) fail("controller sem guarda de modo demo explícito.");

// 2. Superfícies que só operam em staging real devem recusar o modo demo.
for (const surface of [
  "participação contínua opera apenas em staging real",
  "integração pública opera apenas em staging real",
  "operação e governação operam apenas em staging real",
]) {
  if (!controller.includes(surface)) fail(`falta a recusa de demo para: "${surface}".`);
}

// 3. Sem fallback silencioso: não pode existir atribuição a modo demo após erro/catch.
if (/catch[\s\S]{0,120}mode\s*=\s*["']demo["']/.test(controller)) fail("fallback silencioso para demo detetado após catch.");
if (/this\.config\.mode\s*=\s*["']demo["']/.test(controller)) fail("o modo demo não pode ser forçado em runtime após configuração.");

// 4. Os dados de demonstração estão claramente marcados como demonstração.
if (existsSync("public/data/collaborative-demo.json")) {
  const demo = readText("public/data/collaborative-demo.json");
  if (!/demonstra|fict/i.test(demo)) fail("collaborative-demo.json sem marcação clara de demonstração.");
}

// 5. A UI indica o modo demo (banner/aviso) na entrada da Área Colaborativa.
const loginView = readText("src/views/collaborative.js");
if (!/demonstra/i.test(loginView)) fail("a UI não indica claramente o modo de demonstração.");

console.log("Pacote 08O sem fixtures em produção: modo demo explícito, staging real exigido nas superfícies sensíveis, sem fallback silencioso e demonstração marcada.");
