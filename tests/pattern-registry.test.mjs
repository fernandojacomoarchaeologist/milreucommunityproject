/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */
import assert from 'node:assert/strict';import fs from 'node:fs';const c=JSON.parse(fs.readFileSync(new URL('../packages/design-components/v0.4/components.json',import.meta.url)));const p=JSON.parse(fs.readFileSync(new URL('../packages/design-patterns/v0.4/patterns.json',import.meta.url)));const ids=new Set(c.components.map(x=>x.id));for(const pattern of p.patterns){for(const id of pattern.components)assert.ok(ids.has(id),`${pattern.id}: ${id}`);assert.notEqual(pattern.status,'approved')}console.log('pattern registry ok');
