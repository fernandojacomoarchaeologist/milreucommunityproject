/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { spawn } from "node:child_process";
const child=spawn(process.execPath,["scripts/dev-server.mjs","--root","dist","--port","4187"],{stdio:["ignore","pipe","pipe"]});
await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error("Servidor não iniciou")),5000);child.stdout.on("data",()=>{clearTimeout(timer);resolve()});child.on("error",reject)});
try{for(const path of [
"/",
"/auth/callback/",
"/src/main.js",
"/src/collab/controller.js",
"/src/views/collaborative-tasks.js",
"/src/views/collaborative-exhibitions.js",
"/src/views/exhibitions-public.js",
"/src/views/collaborative-contributions.js",
"/src/views/contributions-public.js",
"/src/views/collaborative-museum-review.js",
"/src/views/collaborative-deployment.js",
"/src/views/collaborative-notifications.js",
"/src/views/collaborative-operations.js",
"/src/views/collaborative-release-candidate.js",
"/src/components/public-content-effects.js",
"/public/config/collaborative-area.runtime.json",
"/public/data/collaborative-modules.json",
"/public/data/collaborative-task-model.json",
"/public/data/collaborative-exhibition-model.json",
"/public/data/exhibitions-public.json",
"/public/data/collaborative-contribution-model.json",
"/public/data/contributions-public-summary.json",
"/public/data/collaborative-museum-review-model.json",
"/public/data/collaborative-training-trails.json",
"/public/data/collaborative-library.json",
"/public/data/museum-review-seed.json",
"/public/data/museum-editorial-approved.json",
"/public/data/public-content-effects.json",
"/public/data/package-impact-registry.json",
"/public/data/collaborative-homologation-model.json",
"/public/data/deployment-readiness.json",
"/public/config/deployment-profile.runtime.json",
"/public/data/collaborative-notification-model.json",
"/public/data/collaborative-notification-templates.json",
"/public/config/notifications.runtime.json",
"/public/data/collaborative-operational-governance-model.json",
"/public/data/collaborative-release-candidate-model.json",
"/public/data/release-candidate-readiness.json",
"/public/data/accessibility-audit-model-08j.json",
"/public/data/e2e-scenarios-08j.json",
"/public/data/collaborative-retention-model.json",
"/public/config/operations.runtime.json",
"/public/data/memories.json",
"/public/media/museum/generated/MM202601/card.webp"
]){const response=await fetch(`http://127.0.0.1:4187${path}`);if(!response.ok)throw new Error(`Smoke falhou em ${path}: ${response.status}`)}console.log("Smoke HTTP concluído.")}finally{child.kill("SIGTERM")}
