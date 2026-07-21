/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const fail=[];
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/design-source/source-manifest.json'),'utf8'));
const pages=JSON.parse(fs.readFileSync(path.join(root,'data/design-source/page-elements.json'),'utf8')).pages;
const pdf=path.join(root,manifest.file);
if(!fs.existsSync(pdf)) fail.push('PDF de referência ausente');
if(pages.length!==36) fail.push(`Esperadas 36 páginas, encontradas ${pages.length}`);
for(let i=1;i<=36;i++){const f=path.join(root,'apps/visual-source-board/assets/pages',`page-${String(i).padStart(2,'0')}.webp`);if(!fs.existsSync(f))fail.push(`Miniatura ausente: ${f}`)}
if(fs.existsSync(pdf)){const hash=crypto.createHash('sha256').update(fs.readFileSync(pdf)).digest('hex');if(hash!==manifest.sha256)fail.push('SHA-256 do PDF não corresponde ao manifesto')}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
for(const file of walk(root)){
  if(file.endsWith('.md')){const text=fs.readFileSync(file,'utf8');if(!text.includes('© 2026 Fernando Rodrigues de Jácomo'))fail.push(`Copyright ausente: ${path.relative(root,file)}`)}
  if(/\.(js|mjs|css)$/.test(file)){const text=fs.readFileSync(file,'utf8');if(!text.includes('© 2026 Fernando Rodrigues de Jácomo'))fail.push(`Copyright ausente no código: ${path.relative(root,file)}`)}
  if(/\.(ttf|otf|woff2?|eot)$/i.test(file))fail.push(`Ficheiro de fonte proibido: ${path.relative(root,file)}`)
}
const colours=JSON.parse(fs.readFileSync(path.join(root,'data/design-source/colour-observations.json'),'utf8'));
if(colours.decisions.red!=='signature-opening-transition-closing')fail.push('Decisão do vermelho não está registada');
if(!colours.decisions.black.includes('highlight'))fail.push('Decisão do preto não está registada');
if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log('Pacote 05A válido: 36 páginas, fonte verificada, direitos e decisões registados.');
