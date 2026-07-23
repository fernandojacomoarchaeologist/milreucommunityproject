/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";

const router = readFileSync("src/lib/router.js","utf8");
const main = readFileSync("src/main.js","utf8");
const museum = readFileSync("src/views/museum.js","utf8");
const css = readFileSync("src/styles/app.css","utf8");

const required = [
  [router, "imersivo", "rota de ecrã inteiro"],
  [main, 'case "immersive"', "renderização imersiva"],
  [main, 'event.key === "Escape"', "saída por Escape"],
  [main, 'go(`/museu/memorias/${id}`)', "retorno ao detalhe"],
  [museum, "export function immersiveView", "view imersiva"],
  [museum, "record.media.variants.immersive", "imagem imersiva"],
  [museum, "/museu/imersivo/${prev.id}", "memória anterior"],
  [museum, "/museu/imersivo/${next.id}", "memória seguinte"],
  [css, ".immersive-view{position:fixed;inset:0", "ocupação integral do viewport"],
  [css, ".immersive-frame img{width:100%;height:100%;object-fit:contain}", "imagem sem corte obrigatório"]
];

for (const [source, pattern, label] of required) {
  if (!source.includes(pattern)) throw new Error(`Regressão do Museu: ${label}`);
}
console.log("Contrato incremental do Museu validado, incluindo ecrã inteiro.");
