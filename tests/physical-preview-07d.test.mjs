/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const views=readFileSync("src/views/channels.js","utf8");
const css=readFileSync("src/styles/app.css","utf8");
const router=readFileSync("src/lib/router.js","utf8");
test("marca de água",()=>{assert.match(views,/NÃO PRODUZIR/);assert.match(css,/preview-watermark/)});
test("QR pendente explícito",()=>{assert.match(views,/QR pendente/);assert.match(views,/Código QR pendente de domínio público/)});
test("rotas físicas",()=>{assert.match(router,/laboratorio/);assert.match(router,/totem/);assert.match(router,/painel/)});
