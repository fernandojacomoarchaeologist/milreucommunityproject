/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import fs from 'node:fs';const t=JSON.parse(fs.readFileSync('packages/design-tokens/v0.2/tokens.json','utf8'));
for(const k of ['color','font','space','breakpoint','container','grid','radius','shadow','duration','themes'])if(!(k in t))throw new Error(`Namespace ausente: ${k}`);
if(t.meta.version!=='0.2.0')throw new Error('Versão incorreta');
console.log('token-schema.test: ok');
