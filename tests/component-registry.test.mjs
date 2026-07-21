/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */
import assert from 'node:assert/strict';import fs from 'node:fs';const d=JSON.parse(fs.readFileSync(new URL('../packages/design-components/v0.4/components.json',import.meta.url)));assert.equal(d.version,'0.4.0');assert.equal(new Set(d.components.map(x=>x.id)).size,d.components.length);for(const c of d.components){assert.ok(c.accessibility.length);assert.ok(c.tokens.length);assert.notEqual(c.status,'approved')}console.log('component registry ok');
