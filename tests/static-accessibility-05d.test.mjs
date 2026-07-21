/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */
import assert from 'node:assert/strict';import fs from 'node:fs';const s=fs.readFileSync(new URL('../apps/design-guide/app/component-renderers.js',import.meta.url),'utf8');for(const token of ['aria-label','alt=','scope="col"','aria-live'])assert.ok(s.includes(token),token);console.log('static accessibility 05d ok');
