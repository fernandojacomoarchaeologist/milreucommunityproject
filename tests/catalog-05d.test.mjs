/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */
import assert from 'node:assert/strict';import fs from 'node:fs';const c=JSON.parse(fs.readFileSync(new URL('../packages/design-components/v0.4/components.json',import.meta.url)));const p=JSON.parse(fs.readFileSync(new URL('../packages/design-patterns/v0.4/patterns.json',import.meta.url)));const cat=JSON.parse(fs.readFileSync(new URL('../packages/design-guide-catalog/v0.4/catalog.json',import.meta.url)));assert.equal(cat.version,'0.4.0');for(const x of c.components)assert.ok(cat.pages.some(y=>y.id===`components/${x.id}`));for(const x of p.patterns)assert.ok(cat.pages.some(y=>y.id===`patterns/${x.id}`));console.log('catalog 05d ok');
