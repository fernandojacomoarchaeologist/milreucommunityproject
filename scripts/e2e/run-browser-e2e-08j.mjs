/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, relative, resolve, sep } from "node:path";

const DEBUG_PORT=Number(process.env.MILREU_E2E_DEBUG_PORT||9331);
const ROOT=resolve(".");
const chromiumCandidates=[process.env.MILREU_CHROMIUM_PATH,"/usr/bin/chromium","/usr/bin/chromium-browser","/usr/bin/google-chrome"].filter(Boolean);
const chromium=chromiumCandidates.find(existsSync);
if(!chromium)throw new Error("Chromium não encontrado. Defina MILREU_CHROMIUM_PATH.");

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitHttp(url,timeout=15000){const end=Date.now()+timeout;let last;while(Date.now()<end){try{const response=await fetch(url);if(response.ok)return response;}catch(error){last=error;}await sleep(150);}throw new Error(`Timeout HTTP ${url}: ${last?.message||"sem resposta"}`);}

function walk(directory,predicate=()=>true){
  const output=[];
  for(const entry of readdirSync(directory,{withFileTypes:true})){
    const full=join(directory,entry.name);
    if(entry.isDirectory())output.push(...walk(full,predicate));
    else if(predicate(full))output.push(full);
  }
  return output;
}
function browserModuleId(file){
  return `milreu/${relative(ROOT,file).split(sep).join("/")}`;
}
function transformModule(file,allModuleIds){
  let source=readFileSync(file,"utf8");
  source=source.replace(/\blocalStorage\b/g,"globalThis.__milreuLocalStorage");
  if(relative(ROOT,file).split(sep).join("/")==="src/lib/data.js"){
    source=source.replace('const rootUrl = new URL("../../", import.meta.url);','const rootUrl = new URL("https://milreu.invalid/");');
    source=source.replace('export const assetUrl = path => new URL(path, rootUrl).href;','export const assetUrl = path => globalThis.__milreuAssetUrl(path);');
  }
  if(relative(ROOT,file).split(sep).join("/")==="src/collab/config.js"){
    source=source.replace('const rootUrl = new URL("../../", import.meta.url);','const rootUrl = new URL("https://milreu.invalid/");');
    source=source.replace('return new URL("../../", import.meta.url);','return new URL("https://milreu.invalid/");');
  }
  source=source.replace(/(\b(?:from|import)\s*)(["'])(\.{1,2}\/[^"']+)\2/g,(match,prefix,quote,specifier)=>{
    const target=resolve(dirname(file),specifier);
    const id=allModuleIds.get(target);
    if(!id)throw new Error(`Importação local não resolvida em ${relative(ROOT,file)}: ${specifier}`);
    return `${prefix}${quote}${id}${quote}`;
  });
  return source;
}
function escapeInlineJson(value){return JSON.stringify(value).replace(/</g,"\\u003c");}
function buildInlineBundle(){
  const moduleFiles=walk(resolve(ROOT,"src"),file=>file.endsWith(".js"));
  const moduleIds=new Map(moduleFiles.map(file=>[resolve(file),browserModuleId(file)]));
  const imports={};
  for(const file of moduleFiles){
    const transformed=transformModule(file,moduleIds);
    imports[moduleIds.get(resolve(file))]=`data:text/javascript;base64,${Buffer.from(transformed).toString("base64")}`;
  }
  const jsonFiles=walk(resolve(ROOT,"public"),file=>file.endsWith(".json"));
  const jsonPayload={};
  for(const file of jsonFiles)jsonPayload[relative(ROOT,file).split(sep).join("/")]=readFileSync(file,"utf8");
  const css=["src/styles/tokens.css","src/styles/components.css","src/styles/app.css"].map(file=>readFileSync(resolve(ROOT,file),"utf8")).join("\n");
  const bootstrap=`(()=>{
    const store=new Map();
    globalThis.__milreuLocalStorage={getItem:key=>store.has(String(key))?store.get(String(key)):null,setItem:(key,value)=>store.set(String(key),String(value)),removeItem:key=>store.delete(String(key)),clear:()=>store.clear(),key:index=>[...store.keys()][index]??null,get length(){return store.size;}};
    const json=${escapeInlineJson(jsonPayload)};
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#ece8df"/><path d="M0 600L320 330l210 180 170-140 500 430H0z" fill="#d3cabb"/></svg>';
    const placeholder=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    globalThis.__milreuAssetUrl=path=>String(path).endsWith('.json')?new URL(String(path),'https://milreu.invalid/').href:placeholder;
    const nativeFetch=globalThis.fetch.bind(globalThis);
    globalThis.fetch=async(input,init)=>{
      const raw=typeof input==='string'?input:(input?.url||String(input));
      let pathname;
      try{pathname=new URL(raw,'https://milreu.invalid/').pathname.replace(/^\\//,'');}catch{return nativeFetch(input,init);}
      if(Object.prototype.hasOwnProperty.call(json,pathname))return new Response(json[pathname],{status:200,headers:{'Content-Type':'application/json; charset=utf-8'}});
      if(raw.startsWith('data:')||raw.startsWith('blob:'))return nativeFetch(input,init);
      return new Response(JSON.stringify({error:'E2E offline fixture unavailable',path:pathname}),{status:404,headers:{'Content-Type':'application/json; charset=utf-8'}});
    };
  })();`;
  const html=`<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#A83227"><meta name="description" content="Projeto Comunitário de Milreu — execução E2E offline."><title>Projeto Comunitário de Milreu</title><style>${css}</style></head><body><a class="skip-link" href="#main">Saltar para o conteúdo</a><div id="app" aria-live="polite"></div><noscript>Esta pré-visualização necessita de JavaScript.</noscript></body></html>`;
  return {html,bootstrap,importMap:{imports},rootModule:moduleIds.get(resolve(ROOT,"src/main.js"))};
}

class CDP {
  constructor(url){this.url=url;this.id=0;this.pending=new Map();this.events=new Map();this.ws=null;}
  async connect(){
    this.ws=new WebSocket(this.url);
    await new Promise((resolve,reject)=>{this.ws.addEventListener("open",resolve,{once:true});this.ws.addEventListener("error",reject,{once:true});});
    this.ws.addEventListener("message",event=>{
      const message=JSON.parse(event.data);
      if(message.id){const pending=this.pending.get(message.id);if(!pending)return;this.pending.delete(message.id);message.error?pending.reject(new Error(message.error.message)):pending.resolve(message.result);return;}
      const listeners=this.events.get(message.method)||[];for(const listener of listeners)listener(message.params||{});
    });
  }
  send(method,params={}){const id=++this.id;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  on(method,listener){const list=this.events.get(method)||[];list.push(listener);this.events.set(method,list);return()=>this.events.set(method,(this.events.get(method)||[]).filter(item=>item!==listener));}
  close(){this.ws?.close();}
}

const syncScripts=[
 ["node",["scripts/deploy/build-deployment-profile.mjs"]],
 ["node",["scripts/collab/build-runtime-config.mjs"]],
 ["node",["scripts/notifications/build-runtime-config.mjs"]],
 ["node",["scripts/operations/build-runtime-config.mjs"]]
];
for(const [command,args] of syncScripts){const result=spawnSync(command,args,{stdio:"inherit"});if(result.status!==0)throw new Error(`Falha ao preparar runtime: ${args.join(" ")}`);}

const profile=mkdtempSync(join(tmpdir(),"milreu-08j-e2e-"));
const browser=spawn(chromium,[
 "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--no-first-run","--no-default-browser-check","--no-proxy-server","--proxy-bypass-list=<-loopback>","--allow-file-access-from-files","--disable-web-security","--allow-running-insecure-content",
 `--remote-debugging-port=${DEBUG_PORT}`,`--user-data-dir=${profile}`,"about:blank"
],{stdio:["ignore","ignore","pipe"]});
let cdp;
const results=[];
const runtimeErrors=[];
const add=(id,pass,detail,meta={})=>{results.push({id,pass:Boolean(pass),detail,...meta});if(!pass)console.error(`FAIL ${id}: ${detail}`);else console.log(`PASS ${id}: ${detail}`);};
const assert=(id,condition,detail,meta={})=>add(id,condition,detail,meta);

try{
  await waitHttp(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
  const targetResponse=await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?${encodeURIComponent("about:blank")}`,{method:"PUT"});
  const target=await targetResponse.json();
  cdp=new CDP(target.webSocketDebuggerUrl);await cdp.connect();
  await cdp.send("Page.enable");await cdp.send("Runtime.enable");await cdp.send("Log.enable");
  cdp.on("Runtime.exceptionThrown",params=>runtimeErrors.push({type:"exception",text:params.exceptionDetails?.exception?.description||params.exceptionDetails?.text||"Runtime exception",url:params.exceptionDetails?.url||""}));
  cdp.on("Log.entryAdded",params=>{if(params.entry?.level==="error")runtimeErrors.push({type:params.entry.level,text:params.entry.text,url:params.entry.url||""});});
  const frameTree=await cdp.send("Page.getFrameTree");
  const inlineBundle=buildInlineBundle();
  await cdp.send("Page.setDocumentContent",{frameId:frameTree.frameTree.frame.id,html:inlineBundle.html});
  const runExpression=async(expression)=>{
    const result=await cdp.send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true,userGesture:true});
    if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text||"Falha ao preparar o browser E2E");
    return result.result?.value;
  };
  await runExpression(inlineBundle.bootstrap);
  await runExpression(`(()=>{const map=document.createElement("script");map.type="importmap";map.textContent=${JSON.stringify(JSON.stringify(inlineBundle.importMap))};document.head.append(map);return true;})()`);
  await runExpression(`import(${JSON.stringify(inlineBundle.rootModule)}).then(()=>true)`);

  const evaluate=async(expression)=>{
    const result=await cdp.send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true,userGesture:true});
    if(result.exceptionDetails)throw new Error(result.exceptionDetails.text||"Falha de avaliação no browser");
    return result.result?.value;
  };
  const waitFor=async(expression,timeout=12000)=>{const end=Date.now()+timeout;let value,lastError;while(Date.now()<end){try{value=await evaluate(expression);if(value)return value;}catch(error){lastError=error;}await sleep(100);}let diagnostic=null;try{diagnostic=await evaluate(`({url:location.href,ready:document.readyState,title:document.title,app:document.querySelector("#app")?.textContent?.slice(0,500)||null,body:document.body?.innerText?.slice(0,1000)||null,html:document.documentElement?.outerHTML?.slice(0,800)||null})`);}catch{}throw new Error(`Timeout: ${expression}; last=${lastError?.message||"none"}; diagnostic=${JSON.stringify(diagnostic)}`);};
  const navigate=async(route)=>{
    const target=`#${route}`;
    await evaluate(`(()=>{const target=${JSON.stringify(target)};if(location.hash===target)window.dispatchEvent(new HashChangeEvent("hashchange"));else location.hash=target;return true;})()`);
    await waitFor(`location.hash === ${JSON.stringify(target)} && document.querySelector("#app") && document.querySelector("#app").textContent.trim().length > 0`);
    await sleep(120);
  };
  const viewport=async(width,height)=>{await cdp.send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<600});};
  const auditPage=async(prefix,{expectCollaborative=false,allowForbidden=false}={})=>{
    const audit=await evaluate(`(()=>{const ids=[...document.querySelectorAll("[id]")].map(el=>el.id);const duplicates=ids.filter((id,index)=>ids.indexOf(id)!==index);const visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=="none"&&s.visibility!=="hidden"&&r.width>0&&r.height>0};const namelessButtons=[...document.querySelectorAll("button")].filter(el=>visible(el)&&!(el.textContent.trim()||el.getAttribute("aria-label")||el.getAttribute("title"))).length;const namelessLinks=[...document.querySelectorAll("a[href]")].filter(el=>visible(el)&&!(el.textContent.trim()||el.getAttribute("aria-label")||el.querySelector("img[alt]:not([alt=''])"))).length;const unlabeledElements=[...document.querySelectorAll("input:not([type=hidden]),select,textarea")].filter(el=>visible(el)&&el.getAttribute("aria-hidden")!=="true"&&!el.closest('[aria-hidden="true"]')&&!el.labels?.length&&!el.getAttribute("aria-label")&&!el.getAttribute("aria-labelledby"));const unlabeled=unlabeledElements.length;const unlabeledDetails=unlabeledElements.slice(0,8).map(el=>({tag:el.tagName.toLowerCase(),name:el.getAttribute("name"),type:el.getAttribute("type"),placeholder:el.getAttribute("placeholder"),parent:String(el.parentElement?.className||"")}));const client=document.documentElement.clientWidth;const offenders=[...document.querySelectorAll("body *")].filter(el=>visible(el)&&!el.classList.contains("skip-link")).map(el=>{const r=el.getBoundingClientRect();return{tag:el.tagName.toLowerCase(),className:String(el.className||"").slice(0,100),parent:String(el.parentElement?.className||"").slice(0,100),text:String(el.textContent||"").trim().slice(0,80),left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width)}}).filter(item=>item.right>client+2||item.left<-2).sort((a,b)=>b.right-a.right).slice(0,6);return{title:document.title,lang:document.documentElement.lang,h1:document.querySelectorAll("h1").length,main:document.querySelectorAll("main#main").length,appError:Boolean(document.querySelector(".app-error")),duplicates:[...new Set(duplicates)],missingAlt:document.querySelectorAll("img:not([alt])").length,namelessButtons,namelessLinks,unlabeled,unlabeledDetails,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,offenders,collaborative:Boolean(document.querySelector(".collab-app")),forbidden:/Acesso condicionado|permissão/.test(document.querySelector("#app")?.textContent||"")};})()`);
    assert(`${prefix}-title`,audit.title.includes("Milreu"),`Título: ${audit.title}`);
    assert(`${prefix}-lang`,audit.lang==="pt-PT",`Idioma: ${audit.lang}`);
    assert(`${prefix}-h1`,audit.h1>=1,`${audit.h1} H1`);
    assert(`${prefix}-main`,audit.main===1,`${audit.main} landmark principal`);
    assert(`${prefix}-no-app-error`,!audit.appError,"Sem app-error");
    assert(`${prefix}-ids`,audit.duplicates.length===0,`IDs duplicados: ${audit.duplicates.join(",")||"nenhum"}`);
    assert(`${prefix}-alt`,audit.missingAlt===0,`Imagens sem alt: ${audit.missingAlt}`);
    assert(`${prefix}-buttons`,audit.namelessButtons===0,`Botões sem nome: ${audit.namelessButtons}`);
    assert(`${prefix}-links`,audit.namelessLinks===0,`Links sem nome: ${audit.namelessLinks}`);
    assert(`${prefix}-labels`,audit.unlabeled===0,`Campos sem label: ${audit.unlabeled}${audit.unlabeledDetails?.length?` · ${JSON.stringify(audit.unlabeledDetails)}`:""}`);
    assert(`${prefix}-reflow`,audit.overflow<=2,`Overflow horizontal: ${audit.overflow}px${audit.offenders?.length?` · ${JSON.stringify(audit.offenders)}`:""}`);
    if(expectCollaborative)assert(`${prefix}-shell`,audit.collaborative,"Shell colaborativa presente");
    if(allowForbidden)assert(`${prefix}-forbidden`,audit.forbidden,"Acesso condicionado apresentado");
  };

  // Viewports públicos obrigatórios.
  for(const [name,width,height] of [["mobile",375,812],["tablet",768,1024],["desktop",1280,800]]){
    await viewport(width,height);await navigate("/");await auditPage(`home-${name}`);
  }

  // 08O: carrossel da Home em browser real — caixa canónica, navegação manual e auto-play de relógio real.
  const CAROUSEL_INTERVAL_MS=9000, CAROUSEL_WAIT=CAROUSEL_INTERVAL_MS+2000;
  const carouselShape=await evaluate(`(()=>{const slides=document.querySelectorAll('.home-carousel__slide');const vp=document.querySelector('.home-carousel__viewport');return{count:slides.length,active:document.querySelectorAll('.home-carousel__slide--active').length,index:document.querySelector('.home-carousel__slide--active')?.dataset.homeSlide??null,height:vp?Math.round(vp.getBoundingClientRect().height):0};})()`);
  assert("carousel-slide-count",carouselShape.count===3,`${carouselShape.count} slides`);
  assert("carousel-single-active",carouselShape.active===1,`${carouselShape.active} slide ativo`);
  // Navegação manual + paridade de caixa canónica (≤1 CSS px, sem layout shift).
  await evaluate(`document.querySelector('[data-home-carousel-next]').click()`);await sleep(900);
  const afterNext=await evaluate(`(()=>{const vp=document.querySelector('.home-carousel__viewport');return{index:document.querySelector('.home-carousel__slide--active')?.dataset.homeSlide??null,height:vp?Math.round(vp.getBoundingClientRect().height):0};})()`);
  assert("carousel-manual-advance",afterNext.index!==carouselShape.index,`Índice ${carouselShape.index}→${afterNext.index}`);
  assert("carousel-canonical-box",Math.abs(afterNext.height-carouselShape.height)<=1,`Altura ${carouselShape.height}→${afterNext.height}px`);
  // Auto-play de relógio real: aguarda o intervalo real e confirma a mudança do slide.
  const autoBefore=await evaluate(`document.querySelector('.home-carousel__slide--active')?.dataset.homeSlide??null`);
  await sleep(CAROUSEL_WAIT);
  const autoAfter=await evaluate(`document.querySelector('.home-carousel__slide--active')?.dataset.homeSlide??null`);
  assert("carousel-autoplay-advances",autoAfter!==autoBefore&&autoAfter!==null,`Índice ${autoBefore}→${autoAfter} após intervalo real`);
  // Pausa em hover: com o rato sobre o carrossel o slide mantém-se durante um intervalo completo.
  await evaluate(`document.querySelector('[data-home-carousel]').dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}))`);
  const hoverBefore=await evaluate(`document.querySelector('.home-carousel__slide--active')?.dataset.homeSlide??null`);
  await sleep(CAROUSEL_WAIT);
  const hoverAfter=await evaluate(`document.querySelector('.home-carousel__slide--active')?.dataset.homeSlide??null`);
  assert("carousel-hover-pauses",hoverAfter===hoverBefore,`Índice mantém-se ${hoverBefore} sob hover`);
  await evaluate(`document.querySelector('[data-home-carousel]').dispatchEvent(new MouseEvent('mouseleave',{bubbles:true}))`);

  // Regressão pública e Museu.
  await viewport(1280,800);
  for(const [code,route] of [["museum","/museu"],["gallery","/museu/explorar"],["memory","/museu/memorias/MM202601"],["immersive","/museu/imersivo/MM202601"],["participate","/participar"],["contribution","/participar/contribuir"],["exhibitions","/exposicoes"]]){
    await navigate(route);await auditPage(code);
  }
  await navigate("/museu/imersivo/MM202601");
  const immersiveExit=await evaluate(`Boolean(document.querySelector("[data-immersive-close],.immersive-close-fixed")&&document.body.classList.contains("is-immersive"))`);
  assert("immersive-exit",immersiveExit,"Modo imersivo possui saída e estado ativo.");

  const signOutToLogin=async()=>{
    const present=await evaluate(`Boolean(document.querySelector("[data-collab-logout]"))`);
    if(present)await evaluate(`document.querySelector("[data-collab-logout]").click()`);
    await waitFor(`location.hash.includes("/entrar")&&document.querySelectorAll("[data-collab-demo-login]").length===3`);
  };

  // Entrada e membro pendente.
  await navigate("/entrar");await auditPage("auth-entry",{expectCollaborative:true});
  const loginButtons=await evaluate(`document.querySelectorAll("[data-collab-demo-login]").length`);
  assert("auth-demo-options",loginButtons===3,`${loginButtons} perfis de demonstração`);
  await evaluate(`document.querySelector('[data-collab-demo-login="pending"]').click()`);
  await waitFor(`location.hash.includes("/area-colaborativa")&&/Pedido recebido|Primeiro acesso/.test(document.querySelector("#app")?.textContent||"")`);
  await auditPage("pending",{expectCollaborative:true});
  const pendingLeak=await evaluate(`document.querySelectorAll(".collab-sidebar").length`);
  assert("pending-no-sidebar",pendingLeak===0,"Membro pendente não recebe navegação interna.");

  // Voluntário: módulos autorizados e negação segura.
  await signOutToLogin();
  await evaluate(`document.querySelector('[data-collab-demo-login="volunteer"]').click()`);await waitFor(`location.hash.includes("/area-colaborativa")&&document.querySelector(".collab-sidebar")`);
  for(const [code,route] of [["volunteer-dashboard","/area-colaborativa"],["volunteer-profile","/area-colaborativa/perfil"],["volunteer-availability","/area-colaborativa/disponibilidade"],["volunteer-tasks","/area-colaborativa/tarefas"],["volunteer-contributions","/area-colaborativa/contributos"],["volunteer-agenda","/area-colaborativa/agenda"],["volunteer-library","/area-colaborativa/biblioteca"],["volunteer-training","/area-colaborativa/formacao"],["volunteer-notifications","/area-colaborativa/notificacoes"]]){
    await navigate(route);await auditPage(code,{expectCollaborative:true});
  }
  await navigate("/area-colaborativa/gestao/sistema");await auditPage("volunteer-admin-denied",{expectCollaborative:true,allowForbidden:true});

  // Master: rotas transversais e RC.
  await signOutToLogin();
  await evaluate(`document.querySelector('[data-collab-demo-login="master"]').click()`);await waitFor(`location.hash.includes("/area-colaborativa")&&document.querySelector(".collab-sidebar")`);
  for(const [code,route] of [["master-dashboard","/area-colaborativa"],["master-members","/area-colaborativa/gestao/perfis"],["master-tasks","/area-colaborativa/gestao/tarefas"],["master-contributions","/area-colaborativa/gestao/contributos"],["master-review","/area-colaborativa/gestao/revisao-museu"],["master-homologation","/area-colaborativa/gestao/homologacao"],["master-rc","/area-colaborativa/gestao/homologacao/release-candidate"],["master-notifications","/area-colaborativa/gestao/notificacoes"],["master-system","/area-colaborativa/gestao/sistema"],["master-audit","/area-colaborativa/gestao/auditoria"],["master-incidents","/area-colaborativa/gestao/incidentes"]]){
    await navigate(route);await auditPage(code,{expectCollaborative:true});
  }
  await navigate("/area-colaborativa/gestao/homologacao/release-candidate");
  const rcText=await evaluate(`document.querySelector("#app")?.textContent||""`);
  assert("master-rc-honesty",rcText.includes("Release candidate técnica")&&/produção/i.test(rcText)&&rcText.includes("Bloqueada"),"RC distingue técnica, staging e produção.");

  // Teclado e movimento reduzido.
  await navigate("/");
  const skip=await evaluate(`(()=>{const el=document.querySelector(".skip-link");el.focus();return document.activeElement===el&&el.getAttribute("href")==="#main"})()`);
  assert("keyboard-skip-link",skip,"Skip link recebe foco.");
  await cdp.send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"reduce"}]});
  const reduced=await evaluate(`matchMedia("(prefers-reduced-motion: reduce)").matches`);
  assert("reduced-motion",reduced,"Media query de movimento reduzido ativa.");
  // 08O: com movimento reduzido, o auto-play do carrossel não deve avançar.
  await navigate("/");
  const rmBefore=await evaluate(`document.querySelector('.home-carousel__slide--active')?.dataset.homeSlide??null`);
  await sleep(11000);
  const rmAfter=await evaluate(`document.querySelector('.home-carousel__slide--active')?.dataset.homeSlide??null`);
  assert("carousel-reduced-motion",rmAfter===rmBefore,`Sem avanço sob movimento reduzido (${rmBefore}).`);

  const significantErrors=runtimeErrors.filter(item=>!item.text.includes("favicon")&&!item.text.includes("net::ERR_ABORTED"));
  assert("runtime-errors",significantErrors.length===0,significantErrors.length?significantErrors.map(item=>item.text).join(" | "):"Sem exceções ou erros de consola significativos.");

  const failed=results.filter(item=>!item.pass);
  const report={version:"0.26.0",candidate:"RC1",generatedAt:new Date().toISOString(),browser:chromium,total:results.length,passedCount:results.length-failed.length,failedCount:failed.length,passed:failed.length===0,results,runtimeErrors:significantErrors};
  mkdirSync("reports",{recursive:true});writeFileSync("reports/e2e-result.json",JSON.stringify(report,null,2)+"\n");
  console.log(`E2E Chromium 08J: ${report.passedCount}/${report.total}.`);
  if(failed.length)process.exitCode=1;
} finally {
  cdp?.close();
  browser.kill("SIGTERM");
  await sleep(250);
  rmSync(profile,{recursive:true,force:true});
}
