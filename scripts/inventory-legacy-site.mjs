/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos e condições: consultar RIGHTS.md no repositório principal.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function arg(name, fallback = null) { const i=process.argv.indexOf(name); return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback; }
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p]});}
function sha(p){return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}
function sniff(buffer){
  if(buffer.length>=8 && buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if(buffer.length>=3 && buffer[0]===0xff&&buffer[1]===0xd8&&buffer[2]===0xff) return 'image/jpeg';
  return null;
}
function dimensions(buffer,mime){
  if(mime==='image/png'&&buffer.length>=24) return {width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20)};
  if(mime==='image/jpeg'){
    let i=2; while(i<buffer.length-9){if(buffer[i]!==0xff){i++;continue;} const marker=buffer[i+1]; if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)){return {height:buffer.readUInt16BE(i+5),width:buffer.readUInt16BE(i+7)}} const len=buffer.readUInt16BE(i+2); if(!len||len<2)break;i+=2+len;}
  } return {width:null,height:null};
}
function main(){
  const source=path.resolve(arg('--source')); const output=path.resolve(arg('--output'));
  const all=walk(source); const ignored=[]; const files=[];
  for(const p of all){const rel=path.relative(source,p).replaceAll(path.sep,'/'); if(rel.includes('__MACOSX')||path.basename(p)==='.DS_Store'){ignored.push(rel);continue;} const b=fs.readFileSync(p); const mime=sniff(b); const ext=path.extname(p).toLowerCase(); const d=mime?dimensions(b,mime):{width:null,height:null}; files.push({path:rel,sizeBytes:b.length,sha256:`sha256:${sha(p)}`,extension:ext||null,detectedMime:mime,width:d.width,height:d.height,extensionMismatch:Boolean(mime==='image/jpeg'&&ext==='.png')});}
  const hashes={}; for(const f of files){(hashes[f.sha256]??=[]).push(f.path)}
  const duplicates=Object.entries(hashes).filter(([,ps])=>ps.length>1).map(([sha256,paths])=>({sha256,paths}));
  const report={_copyright:'© 2026 Fernando Rodrigues de Jácomo',_project:'Projeto Comunitário de Milreu',version:'0.1.0',sourceRoot:path.basename(source),logicalFileCount:files.length,ignoredCount:ignored.length,ignored,files,duplicates,extensionMismatches:files.filter(f=>f.extensionMismatch).map(f=>f.path)};
  fs.mkdirSync(path.dirname(output),{recursive:true}); fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n'); console.log(`OK — ${files.length} ficheiros inventariados; ${ignored.length} ignorados.`);
}
main();
