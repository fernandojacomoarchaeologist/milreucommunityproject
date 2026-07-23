/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";

const content = JSON.parse(readFileSync("public/data/portal-content.json","utf8"));
const portal = readFileSync("src/views/portal.js","utf8");
const museum = readFileSync("src/views/museum.js","utf8");
const layout = readFileSync("src/components/layout.js","utf8");
const main = readFileSync("src/main.js","utf8");
const i18n = readFileSync("src/lib/i18n.js","utf8");
const css = readFileSync("src/styles/app.css","utf8");

const pillars = content.project.principles.map(item => item.title["pt-PT"]);
const expected = ["Comunicação","Mutualidade","Pertinência Social e Política"];
if (JSON.stringify(pillars) !== JSON.stringify(expected)) {
  throw new Error(`Pilares incorretos: ${pillars.join(", ")}`);
}
if (!content.project.objective?.["pt-PT"]?.includes("Resgatar a memória")) {
  throw new Error("Objetivo do projeto ausente.");
}

for (const removed of [
  "Um projeto, várias formas de encontro",
  "O portal orienta",
  "Evolução incremental do Museu",
  "museum-continuity"
]) {
  if (portal.includes(removed)) throw new Error(`Conteúdo interno ainda aparece na Home: ${removed}`);
}

if (portal.includes("Relação multicanal") || portal.includes('class="channel-card"')) {
  throw new Error("Relação multicanal ainda aparece em iniciativas.");
}
if (!portal.includes('item.slug === "museu-de-memorias"') || !portal.includes('href="#/museu"')) {
  throw new Error("A iniciativa Museu não possui acesso ao Museu.");
}

if (!layout.includes('class="site-brand"') || !layout.includes('public/brand/symbol.webp')) {
  throw new Error("Header compacto do Portal ausente.");
}
if (layout.includes('class="back-project"')) {
  throw new Error("Voltar ao Projeto ainda ocupa o menu do Museu.");
}
if (!layout.includes('class="museum-return-floating"')) {
  throw new Error("Botão flutuante de retorno ausente.");
}

if (!museum.includes('class="ml-button ml-button--ghost-on-dark"')) {
  throw new Error("Botão imersivo da Home do Museu ainda pode ficar sem texto visível.");
}
if (!museum.includes("data-close-immersive") || !main.includes("[data-close-immersive]")) {
  throw new Error("Correção do botão X ausente.");
}

for (const pair of [["1","15000"],["2","7000"],["3","4000"]]) {
  if (!museum.includes(`data-slideshow-speed="${pair[0]}"`) || !main.includes(`${pair[0]}: ${pair[1]}`)) {
    throw new Error(`Velocidade x${pair[0]} ausente.`);
  }
}
if (!main.includes("scheduleSlideshow") || !main.includes("clearSlideshowTimer")) {
  throw new Error("Motor de apresentação automática ausente.");
}

const timelineItem = museum.slice(museum.indexOf("function timelineItem"), museum.indexOf("function selectField"));
if (timelineItem.includes("record.date.precision") || timelineItem.includes("<small>")) {
  throw new Error("Year/Range ainda aparecem na linha temporal.");
}

const collectionDetail = museum.slice(museum.indexOf("export function collectionDetailView"), museum.indexOf("export function detailView"));
if (collectionDetail.includes("<details>") || collectionDetail.includes("JSON.stringify(collection.rule")) {
  throw new Error("Documentação técnica ainda aparece nas coleções.");
}

if (!i18n.includes('knowledge:"Experiência Proteus"')) {
  throw new Error("Menu Experiência Proteus ausente.");
}
if (!css.includes(".museum-return-floating") || !css.includes(".immersive-slideshow")) {
  throw new Error("Estilos do hotfix incompletos.");
}

console.log("Hotfix 07D.1 validado.");
