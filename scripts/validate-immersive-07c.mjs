/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";

const main = readFileSync("src/main.js","utf8");
const museum = readFileSync("src/views/museum.js","utf8");
const css = readFileSync("src/styles/app.css","utf8");
const router = readFileSync("src/lib/router.js","utf8");

const requirements = [
  [router,"/museu\\/imersivo","rota imersiva"],
  [main,'event.key === "Escape"',"Escape"],
  [main,'event.key === "ArrowLeft"',"seta esquerda"],
  [main,'event.key === "ArrowRight"',"seta direita"],
  [main,'key === "i"',"atalho de informação"],
  [main,'key === "f"',"atalho Fullscreen API"],
  [main,"requestFullscreen","Fullscreen API"],
  [museum,"record.media.variants.immersive","variante imersiva"],
  [museum,"immersive-filmstrip","filmstrip"],
  [museum,"immersive-info-panel","painel de informação"],
  [css,".immersive-view{position:fixed;inset:0","viewport integral"],
  [css,"object-fit:contain","preservação da imagem"]
];

for (const [source,pattern,label] of requirements) {
  if (!source.includes(pattern)) throw new Error(`Modo imersivo 07C incompleto: ${label}`);
}
console.log("Modo imersivo 07C validado.");
