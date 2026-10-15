// © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.
// Item 2B — verificação local da CSP em Chrome headless (dev; não corre no CI).
// Uso: servir o repositório em 127.0.0.1:8771 e correr: node scripts/security/csp-browser-check.mjs <pasta com umami-script.js>
// Percorre as rotas públicas e a Área Colaborativa em demonstração, simula Umami/Supabase (pedidos interceptados,
// nada é enviado) e faz um controlo negativo (deve ser bloqueado). Saída: violações por cenário.
import { spawn } from "node:child_process"; import { mkdtempSync, readFileSync } from "node:fs";
const [,,SP]=process.argv;
const C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ch=spawn(C,["--headless=new","--disable-gpu","--remote-debugging-port=9340",`--user-data-dir=${mkdtempSync(process.env.TMPDIR+"/cdp-")}`,"--host-resolver-rules=MAP projectomilreu.pt 127.0.0.1:8771","about:blank"],{stdio:"ignore"});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let t; for(let i=0;i<30;i++){try{t=await (await fetch("http://127.0.0.1:9340/json")).json();break}catch{await sleep(500)}}
const ws=new WebSocket(t.find(x=>x.type==="page").webSocketDebuggerUrl); await new Promise(r=>ws.onopen=r);
let id=0; const pend=new Map(); const errors=[]; const intercepted=[];
const umami=readFileSync(`${SP}/umami-script.js`);
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
ws.onmessage=async m=>{const d=JSON.parse(m.data); if(d.id&&pend.has(d.id)){pend.get(d.id)(d.result);pend.delete(d.id);}
  if(d.method==="Runtime.exceptionThrown")errors.push(d.params.exceptionDetails.exception?.description?.slice(0,140)||d.params.exceptionDetails.text);
  if(d.method==="Fetch.requestPaused"){const u=d.params.request.url;intercepted.push(u.replace(/\?.*/,""));
    const body=u.includes("script.js")?umami.toString("base64"):Buffer.from('{"ok":true}').toString("base64");
    send("Fetch.fulfillRequest",{requestId:d.params.requestId,responseCode:200,responseHeaders:[{name:"Content-Type",value:u.includes("script.js")?"application/javascript":"application/json"},{name:"Access-Control-Allow-Origin",value:"*"}],body});}};
const ev=async e=>(await send("Runtime.evaluate",{expression:e,returnByValue:true,awaitPromise:true})).result?.value;
await send("Page.enable"); await send("Runtime.enable");
// Intercepta tudo o que sai do site (nada chega à Umami, Supabase ou outro domínio real).
await send("Fetch.enable",{patterns:[{urlPattern:"*umami*"},{urlPattern:"*supabase.co*"},{urlPattern:"*evil.example*"}]});
await send("Page.addScriptToEvaluateOnNewDocument",{source:"window.__csp=[];document.addEventListener('securitypolicyviolation',e=>window.__csp.push(e.violatedDirective+' '+(e.blockedURI||'inline')+' '+(e.sourceFile||'').split('/').pop()+':'+e.lineNumber));"});
const out={};
const visit=async(base,route,wait=1600)=>{ await send("Page.navigate",{url:base+"#"+route}); await sleep(wait); return await ev("window.__csp.slice()"); };
const B="http://127.0.0.1:8771/";
const routes=["/","/museu","/museu/explorar","/museu/memorias/MM202601","/museu/imersivo/MM202601","/museu/linha-do-tempo","/museu/colecoes","/exposicoes","/exposicoes/2026-10-30-estoi-inauguracao","/direitos","/identidade","/imprensa","/conhecimento","/conhecimento/api","/participar","/participar/contribuir","/expor","/oportunidades","/sobre","/projeto","/iniciativas","/entrar"];
await send("Page.navigate",{url:B}); await sleep(2500);
for(const r of routes){ await ev(`location.hash=${JSON.stringify("#"+r)}`); await sleep(1100); }
out.publicRoutes=await ev("window.__csp.slice()");
out.swatches=await ev(`(location.hash="#/identidade",new Promise(r=>setTimeout(()=>r([...document.querySelectorAll('[data-swatch]')].slice(0,3).map(e=>getComputedStyle(e).backgroundColor)),900)))`);
out.paperBox=await ev(`getComputedStyle(document.querySelector('.logo-example__box--paper')).backgroundColor`);
// Área Colaborativa em demonstração: formação (barra de progresso via data-progress).
await ev(`location.hash="#/entrar"`); await sleep(2500);
await ev(`document.querySelector('[data-collab-demo-login="master"]')?.click()`); await sleep(1800);
await ev(`location.hash="#/area-colaborativa/formacao"`); await sleep(2200);
out.progressBars=await ev(`[...document.querySelectorAll('[data-progress]')].map(e=>e.dataset.progress+'→'+e.style.width).slice(0,3)`);
out.collab=await ev("window.__csp.slice()");
// Formulário «Quero expor»: fetch para a função Supabase (interceptado) + controlo negativo.
out.supabaseFetch=await ev(`fetch("https://abcdefgh.supabase.co/functions/v1/exhibition-proposal-intake",{method:"POST",body:"{}"}).then(r=>r.status).catch(e=>"BLOQUEADO "+e.message)`);
out.negativeControl=await ev(`fetch("https://evil.example/x").then(r=>"PERMITIDO "+r.status).catch(e=>"bloqueado como esperado")`);
out.afterFetch=await ev("window.__csp.slice()");
// Domínio público simulado (DNS local): a estatística carrega e envia (ambos interceptados).
await send("Page.navigate",{url:"http://projectomilreu.pt/#/"}); await sleep(3500);
await ev(`location.hash="#/museu"`); await sleep(1500);
out.umami={csp:await ev("window.__csp.slice()"),umamiLoaded:await ev("typeof window.umami"),intercepted:[...new Set(intercepted)]};
// 404.html: redireccionamento inline autorizado por hash.
await send("Page.navigate",{url:"http://127.0.0.1:8771/404.html"}); await sleep(1500);
out.page404={url:await ev("location.href"),csp:await ev("window.__csp.slice()")};
out.exceptions=errors;
console.log(JSON.stringify(out,null,1)); ws.close(); ch.kill();
