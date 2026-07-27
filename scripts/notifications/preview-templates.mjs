/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile,writeFile,mkdir } from "node:fs/promises";

const registry=JSON.parse(await readFile("public/data/collaborative-notification-templates.json","utf8"));
const sample={
  display_name:"Membro de teste",
  project_name:"Projeto Comunitário de Milreu",
  title:"Exemplo de atividade",
  status:"em revisão",
  reference:"MM202601",
  action_url:"https://example.invalid/#/area-colaborativa",
  due_at:"31/07/2026",
  starts_at:"31/07/2026, 10:00",
  role:"revisor",
  reason:"Exemplo controlado",
  environment:"staging"
};
function render(value){
  return String(value||"").replace(/\{\{([a-z_][a-z0-9_]*)\}\}/g,(_,token)=>String(sample[token]??""));
}
const previews=registry.templates.map(template=>({
  eventType:template.eventType,
  language:template.language,
  subject:render(template.subjectTemplate),
  title:render(template.titleTemplate),
  body:render(template.bodyTextTemplate)
}));
await mkdir("releases/notifications",{recursive:true});
await writeFile("releases/notifications/template-preview-pt-PT.json",JSON.stringify({
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.25.0",
  generatedAt:new Date().toISOString(),
  recipient:"test@example.invalid",
  previews
},null,2)+"\n");
console.log(`Pré-visualização gerada para ${previews.length} templates.`);
