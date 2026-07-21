/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
const html=fs.readFileSync(new URL("../apps/design-guide/index.html",import.meta.url),"utf8");
for(const expected of ["skip-link","<main","<aside","<dialog","aria-controls","aria-expanded","aria-live","lang=\"pt-PT\""]) assert.ok(html.includes(expected),expected);
console.log("accessibility-static: ok");
