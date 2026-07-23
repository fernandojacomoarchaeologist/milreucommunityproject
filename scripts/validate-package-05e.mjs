/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const required=[
 'assets/brand/source/logo-original-with-background.png',
 'assets/brand/derived/light/logo-full-colour-transparent.png',
 'assets/brand/derived/dark/logo-dark-mode-transparent.png',
 'assets/brand/derived/monochrome/logo-monochrome-dark.png',
 'assets/brand/derived/monochrome/logo-monochrome-light.png',
 'data/brand/logo-variants.json','data/brand/icon-registry.json','data/brand/brand-relationships.json'
];
for (const rel of required){const p=path.join(root,rel);if(!fs.existsSync(p)) throw new Error(`Missing ${rel}`);}
for (const rel of ['data/brand/logo-variants.json','data/brand/icon-registry.json','data/brand/brand-relationships.json']) JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));
const iconReg=JSON.parse(fs.readFileSync(path.join(root,'data/brand/icon-registry.json'),'utf8'));
for (const icon of iconReg.icons){if(!fs.existsSync(path.join(root,icon.path))) throw new Error(`Missing icon ${icon.path}`);}
const md=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.md'))md.push(p);}}walk(root);
for(const p of md){const t=fs.readFileSync(p,'utf8');if(!t.includes('© 2026 Fernando Rodrigues de Jácomo')) throw new Error(`Copyright missing ${path.relative(root,p)}`);}
console.log(`Package 05E valid: ${required.length} core files, ${iconReg.icons.length} icons, ${md.length} markdown files.`);
