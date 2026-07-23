/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const main=readFileSync("src/main.js","utf8"),museum=readFileSync("src/views/museum.js","utf8"),html=readFileSync("index.html","utf8");
test("hash routes",()=>{assert.match(main,/museum-home/);assert.match(main,/immersive/)});
test("MM202617 não hardcoded como visível",()=>assert.doesNotMatch(museum,/MM202617/));
test("noindex",()=>assert.match(html,/noindex,nofollow/));
test("skip link",()=>assert.match(html,/skip-link/));
