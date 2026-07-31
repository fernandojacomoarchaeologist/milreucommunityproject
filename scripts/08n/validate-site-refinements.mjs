/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";
const read=(p)=>JSON.parse(readFileSync(p,"utf8"));
const fail=(m)=>{throw new Error(`08N: ${m}`);};
const model=read("public/data/site-refinement-model.json");
if(model.version!=="0.31.0")fail("versão do modelo do site incorreta.");
if(model.publicEffectsActive!==0)fail("efeitos públicos ativos devem ser 0.");
if(model.carouselAutoplayEnabled!==true)fail("autoplay do carrossel deve estar ativo.");
const carousel=read("public/data/home-carousel.json");
if(!carousel.autoplay?.enabled)fail("home-carousel.json deve ter autoplay ativo.");
if(carousel.slides.length!==3)fail("o carrossel deve ter 3 slides (Museu, Proteus, Inquérito 2026).");
// crop consistente da imagem do Inquérito (object-fit:cover + object-position)
const css=readFileSync("src/styles/app.css","utf8");
if(!/\.home-carousel__survey-image img\{[^}]*object-fit:cover/.test(css))fail("imagem do Inquérito deve usar object-fit:cover para consistência e crop.");
// imersivo: retorno ao Portal presente + não-regressão (Voltar ao Museu preservado)
const immersive=readFileSync("src/views/museum.js","utf8");
if(!immersive.includes("data-immersive-portal"))fail("imersivo sem controlo de retorno ao Portal.");
if(!immersive.includes("Voltar ao Museu")||!immersive.includes("data-close-immersive"))fail("controlos existentes do imersivo não podem ser removidos.");
const main=readFileSync("src/main.js","utf8");
if(!main.includes("data-immersive-portal"))fail("handler de retorno ao Portal ausente no main.js.");
console.log("08N site validado: carrossel com autoplay e crop consistente, imersivo com retorno ao Portal e Museu preservados, 0 efeitos públicos.");
