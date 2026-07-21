/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos e condições: consultar RIGHTS.md no repositório principal.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const records=fs.readdirSync(path.join(root,'data','migration','records')).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(root,'data','migration','records',f),'utf8')));
assert.equal(records.length,31);
assert.deepEqual(records.map(r=>r.id),Array.from({length:31},(_,i)=>`MM2026${String(i+1).padStart(2,'0')}`));
assert.equal(records.filter(r=>r.publicationStatus==='blocked').length,1);
assert.equal(records.find(r=>r.id==='MM202617').publicationStatus,'blocked');
assert.ok(records.every(r=>r.recordStatus==='preliminary'));
assert.ok(records.every(r=>r.media.every(m=>m.publicationAllowed===false)));
assert.ok(records.every(r=>r.extensions.legacyFieldsPreserved));
const assets=JSON.parse(fs.readFileSync(path.join(root,'data','migration','manifests','legacy-site-inventory.json'),'utf8'));
assert.ok(assets.duplicates.some(d=>d.paths.includes('assets/images/MM202612.jpg')&&d.paths.includes('assets/images/MM202612.jpeg')));
assert.ok(assets.extensionMismatches.includes('assets/images/milreu_mosaic_hero.png'));
console.log('OK — testes do Pacote 04 concluídos.');
