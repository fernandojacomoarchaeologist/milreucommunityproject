/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */

import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');const reg=JSON.parse(fs.readFileSync(path.join(root,'data/brand/icon-registry.json'),'utf8'));
const ids=new Set();for(const i of reg.icons){if(ids.has(i.id))throw new Error(`Duplicate ${i.id}`);ids.add(i.id);const svg=fs.readFileSync(path.join(root,i.path),'utf8');if(!svg.includes('viewBox="0 0 24 24"')||!svg.includes('currentColor'))throw new Error(`Invalid icon ${i.path}`);}console.log(`${ids.size} icons valid.`);
