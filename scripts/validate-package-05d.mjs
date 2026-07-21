/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';
const root=path.resolve(process.argv[2]||'.');
const readJSON=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const components=readJSON('packages/design-components/v0.4/components.json').components;
const patterns=readJSON('packages/design-patterns/v0.4/patterns.json').patterns;
const ids=new Set(components.map(x=>x.id));
if(ids.size!==components.length)throw new Error('IDs de componente duplicados');
if(new Set(patterns.map(x=>x.id)).size!==patterns.length)throw new Error('IDs de padrão duplicados');
for(const p of patterns)for(const id of p.components)if(!ids.has(id))throw new Error(`Componente ausente no padrão ${p.id}: ${id}`);
if([...components,...patterns].some(x=>x.status==='approved'))throw new Error('Nenhum elemento pode estar approved neste release');
const cat=readJSON('packages/design-guide-catalog/v0.4/catalog.json');
for(const c of components)if(!cat.pages.some(p=>p.id===`components/${c.id}`))throw new Error(`Rota ausente: ${c.id}`);
for(const p of patterns)if(!cat.pages.some(x=>x.id===`patterns/${p.id}`))throw new Error(`Rota ausente: ${p.id}`);
const forbidden=['MM2026','Hauschild_','TEICHNER_'];
for(const file of ['apps/design-guide/app/component-renderers.js','packages/design-components/v0.4/components.js']){const s=fs.readFileSync(path.join(root,file),'utf8');for(const token of forbidden)if(s.includes(token))throw new Error(`Conteúdo real ou fonte primária encontrada em ${file}: ${token}`)}
console.log(`OK: ${components.length} componentes, ${patterns.length} padrões, ${cat.pages.length} páginas.`);
