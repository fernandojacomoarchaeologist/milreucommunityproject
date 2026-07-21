/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();
const required=['README.md','PROMPT_CLAUDE.md','packages/design-tokens/v0.2/tokens.json','packages/design-tokens/v0.2/tokens.css','apps/foundations-lab/index.html','releases/PACKAGE_05B_v0.2.0.md'];
for(const f of required){if(!fs.existsSync(path.join(root,f)))throw new Error(`Em falta: ${f}`)}
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);e.isDirectory()?walk(p):files.push(p)}}walk(root);
const fonts=files.filter(f=>/\.(woff2?|ttf|otf)$/i.test(f));if(fonts.length)throw new Error(`Ficheiros de fontes proibidos: ${fonts.join(', ')}`);
for(const f of files.filter(f=>f.endsWith('.json')))JSON.parse(fs.readFileSync(f,'utf8'));
console.log(`Pacote 05B válido: ${files.length} ficheiros; sem fontes binárias.`);
