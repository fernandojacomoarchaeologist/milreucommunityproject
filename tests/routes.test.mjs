/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
const catalog=JSON.parse(fs.readFileSync(new URL("../packages/design-guide-catalog/v0.3/catalog.json",import.meta.url)));
for(const page of catalog.pages){ assert.match(page.id,/^[a-z0-9-]+\/[a-z0-9-]+$/); assert.equal(page.id,`${page.group}/${page.slug}`); }
assert.ok(catalog.pages.some(p=>p.id==="introduction/overview"));
assert.ok(catalog.pages.some(p=>p.id==="governance/releases"));
console.log("routes: ok");
