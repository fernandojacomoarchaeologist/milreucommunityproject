/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { spawn } from "node:child_process";
const child=spawn(process.execPath,["scripts/dev-server.mjs","--root","dist","--port","4187"],{stdio:["ignore","pipe","pipe"]});
await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error("Servidor não iniciou")),5000);child.stdout.on("data",()=>{clearTimeout(timer);resolve()});child.on("error",reject)});
try{for(const path of ["/","/src/main.js","/public/data/memories.json","/public/media/museum/generated/MM202601/card.webp"]){const response=await fetch(`http://127.0.0.1:4187${path}`);if(!response.ok)throw new Error(`Smoke falhou em ${path}: ${response.status}`)}console.log("Smoke HTTP concluído.")}finally{child.kill("SIGTERM")}
