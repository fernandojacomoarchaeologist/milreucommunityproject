/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08P — garante que o primeiro acesso distingue os estados obrigatórios
 * (sem sessão, sem membership, pendente, suspenso, removido/arquivado, recusado)
 * e que o router bloqueia módulos internos para quem não está ativo.
 */
import { readFileSync } from "node:fs";

const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`08P primeiro acesso: ${m}`); };

const main = text("src/main.js");
const view = text("src/views/collaborative.js");

// Gate do router: sessão → membership active → módulos.
if (!/if\s*\(\s*!context\.authenticated\s*\)/.test(main)) fail("gate de sessão ausente no router.");
if (!/context\.membership\?\.status\s*!==\s*"active"/.test(main)) fail("gate de membership active ausente no router.");

// Estados distintos na vista de onboarding (não mostrar o formulário de pedido a suspenso/removido).
if (!/status===?"suspended"/.test(view.replace(/\s+/g, "")) && !/status\s*===\s*"suspended"/.test(view)) fail("estado suspenso não distinguido.");
if (!/"archived"|"removed"/.test(view)) fail("estado removido/arquivado não distinguido.");
if (!/status\s*===\s*"rejected"|request\?\.status\s*===\s*"rejected"/.test(view)) fail("estado recusado não distinguido.");
if (!/request\?\.status\s*===\s*"pending"/.test(view)) fail("estado pendente não tratado.");
if (!/membershipBlockedView/.test(view)) fail("vista de bloqueio de membership ausente.");
// O bloqueio não expõe notas internas nem o motivo interno.
if (!/não são apresentadas notas internas/.test(view)) fail("o estado bloqueado deve declarar que não mostra notas internas.");
// Oferece suporte neutro (sem inventar contactos).
if (!/contacte a coordenação/i.test(view)) fail("o estado bloqueado deve oferecer suporte neutro.");

console.log("Pacote 08P primeiro acesso validado: sessão, sem membership, pendente, suspenso, removido e recusado distinguidos; sem módulos para não-ativos; sem notas internas.");
