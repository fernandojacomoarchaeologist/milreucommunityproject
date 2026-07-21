/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */
import assert from 'node:assert/strict';import fs from 'node:fs';const files=['apps/design-guide/app/component-renderers.js','packages/design-components/v0.4/components.js'];for(const f of files){const s=fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');assert.ok(s.includes('demonstr'),f);assert.ok(!/MM2026\d{2}/.test(s),f)}console.log('demo safety ok');
