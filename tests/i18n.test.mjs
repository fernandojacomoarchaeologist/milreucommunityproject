/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
const source=fs.readFileSync(new URL("../apps/design-guide/app/i18n.js",import.meta.url),"utf8");
for(const locale of ["pt-PT","en","es","fr"]) assert.ok(source.includes(`\"${locale}\"`));
for(const key of ["search","groupFoundations","onThisPage","previous","next"]) assert.ok(source.includes(`\"${key}\"`));
console.log("i18n: ok");
