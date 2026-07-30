/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const read=path=>readFileSync(path,"utf8");
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(dir,entry.name)):[join(dir,entry.name)]);
const files=["index.html",...walk("src").filter(path=>/\.(js|css)$/.test(path))];
const source=files.map(read).join("\n");
const css=["src/styles/tokens.css","src/styles/components.css","src/styles/app.css"].map(read).join("\n");
const checks=[];
const check=(code,pass,detail,criterion)=>checks.push({code,pass:Boolean(pass),detail,criterion});

check("document-language",read("index.html").includes('lang="pt-PT"'),"Idioma-fonte definido no documento.","3.1.1");
check("viewport",read("index.html").includes('name="viewport"'),"Viewport responsivo configurado.","1.4.10");
check("skip-link",source.includes("skip-link")&&source.includes('href="#main"'),"Atalho para o conteúdo principal.","2.4.1");
check("main-landmark",source.includes('id="main"'),"Landmark principal disponível nas superfícies.","1.3.1");
check("live-regions",source.includes("aria-live"),"Feedback dinâmico anunciado.","4.1.3");
check("current-navigation",source.includes("aria-current"),"Navegação identifica a página atual.","2.4.8");
check("focus-visible",css.includes(":focus-visible")||css.includes(":focus{"),"Estilo de foco disponível.","2.4.7");
check("reduced-motion",css.includes("prefers-reduced-motion"),"Movimento reduzido respeitado.","2.3.3");
check("immersive-exit",source.includes("Escape")&&source.includes("immersive"),"Modo imersivo possui saída por teclado.","2.1.1");
check("image-containment",css.includes("object-fit:contain"),"Imagem imersiva não é cortada.","1.4.10");
check("form-feedback",source.includes("data-collab-feedback")&&source.includes("aria-live=\"polite\""),"Formulários principais possuem feedback anunciado.","3.3.1");
check("no-secret-browser",!source.includes("SUPABASE_SERVICE_ROLE_KEY")&&!source.includes("service_role_key"),"Service role ausente do código do browser.","4.1.2");

const failed=checks.filter(item=>!item.pass);
const report={
  version:"0.30.0",standard:"WCAG 2.2",target:"AA",generatedAt:new Date().toISOString(),
  scope:"baseline-source-contract",passed:failed.length===0,checks,
  humanReviewRequired:["leitor de ecrã","contraste final","ordem de foco","zoom a 200%","alvos táteis","mensagens de erro","revisão cognitiva"]
};
mkdirSync("reports",{recursive:true});
writeFileSync("reports/accessibility-result.json",JSON.stringify(report,null,2)+"\n");
console.log(`Baseline de acessibilidade 08J: ${checks.length-failed.length}/${checks.length}.`);
if(failed.length)throw new Error(`Falhas de acessibilidade: ${failed.map(item=>item.code).join(", ")}`);
