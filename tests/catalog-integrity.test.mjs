/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
const catalog=JSON.parse(fs.readFileSync(new URL("../packages/design-guide-catalog/v0.3/catalog.json",import.meta.url)));
assert.equal(catalog.version,"0.3.0");
assert.ok(catalog.groups.length>=7);
assert.ok(catalog.pages.length>=20);
const ids=catalog.pages.map(p=>p.id);
assert.equal(new Set(ids).size,ids.length);
for(const page of catalog.pages){ assert.ok(catalog.groups.some(g=>g.id===page.group)); assert.ok(page.tags.length); assert.ok(page.sections.length); }
console.log("catalog-integrity: ok");
