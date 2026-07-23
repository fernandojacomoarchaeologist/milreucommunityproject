/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */

import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const files=['assets/brand/derived/light/logo-full-colour-transparent.png','assets/brand/derived/dark/logo-dark-mode-transparent.png','assets/brand/derived/monochrome/logo-monochrome-dark.png','assets/brand/derived/monochrome/logo-monochrome-light.png'];
for(const rel of files){const b=fs.readFileSync(path.join(root,rel));if(b.toString('ascii',1,4)!=='PNG') throw new Error(`Not PNG: ${rel}`);const colorType=b[25];if(colorType!==4&&colorType!==6) throw new Error(`PNG without alpha channel: ${rel}`);}
console.log('Alpha channels present.');
