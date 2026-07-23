/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */

import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');const b=JSON.parse(fs.readFileSync(path.join(root,'data/brand/brand-relationships.json'),'utf8'));
if(b.primaryBrand.name!=='Projeto Comunitário de Milreu')throw new Error('Primary brand changed');
if(b.knowledgeLayer.independentLogo!==false)throw new Error('Proteus cannot have independent logo');
console.log('Brand architecture valid.');
