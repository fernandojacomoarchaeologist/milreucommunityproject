/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos e condições: consultar RIGHTS.md no repositório principal.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname=path.dirname(fileURLToPath(import.meta.url)); const root=path.resolve(__dirname,'..');
function walk(d,ext){if(!fs.existsSync(d))return[];return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const p=path.join(d,e.name);return e.isDirectory()?walk(p,ext):(p.endsWith(ext)?[p]:[])})}
function read(p){return JSON.parse(fs.readFileSync(p,'utf8'))}
const errors=[];
const records=walk(path.join(root,'data','migration','records'),'.json').map(read);
if(records.length!==31)errors.push(`Esperados 31 registos; encontrados ${records.length}.`);
const ids=new Set(records.map(r=>r.id)); if(ids.size!==records.length)errors.push('IDs duplicados.');
for(const r of records){
  if(!/^MM\d{6}$/.test(r.id||''))errors.push(`${r.id}: ID inválido.`);
  if(r.schemaVersion!=='0.1.0')errors.push(`${r.id}: schemaVersion inválida.`);
  if(r.recordStatus!=='preliminary')errors.push(`${r.id}: recordStatus deve permanecer preliminary.`);
  if(!['review-required','blocked'].includes(r.publicationStatus))errors.push(`${r.id}: publicationStatus inseguro.`);
  if(r.dataState!=='preliminary')errors.push(`${r.id}: dataState deve permanecer preliminary.`);
  if(r.media?.some(m=>m.publicationAllowed))errors.push(`${r.id}: media não pode estar autorizada automaticamente.`);
  if(r.rightsAndConsent?.rightsStatus!=='pending-review')errors.push(`${r.id}: rightsStatus deve permanecer pending-review.`);
  for(const lang of ['pt-PT','en','es','fr'])if(!(lang in (r.title||{})))errors.push(`${r.id}: título sem ${lang}.`);
  if(!r.extensions?.legacyFieldsPreserved||!r.extensions?.legacy)errors.push(`${r.id}: campos legados não preservados.`);
  for(const rel of r.relations||[])if(!ids.has(rel.targetId))errors.push(`${r.id}: relação aponta para ID ausente ${rel.targetId}.`);
}
const index=read(path.join(root,'data','migration','manifests','migration-index.json')); if(index.recordCount!==31)errors.push('migration-index com contagem incorreta.');
const summary=read(path.join(root,'data','migration','reports','migration-summary.json')); if(!summary.preservation?.reversible)errors.push('Migração não marcada como reversível.');
for(const f of walk(root,'.md'))if(!fs.readFileSync(f,'utf8').includes('© 2026 Fernando Rodrigues de Jácomo'))errors.push(`${path.relative(root,f)}: falta copyright.`);
for(const f of walk(path.join(root,'scripts'),'.mjs'))if(!fs.readFileSync(f,'utf8').includes('© 2026 Fernando Rodrigues de Jácomo'))errors.push(`${path.relative(root,f)}: falta copyright.`);
if(errors.length){console.error(`Falhou: ${errors.length} erro(s).`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log(`OK — ${records.length} registos preliminares, reversíveis e sem publicação automática.`);
