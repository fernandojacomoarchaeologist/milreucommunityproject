/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import { readFileSync } from "node:fs";
const model=JSON.parse(readFileSync("public/data/collaborative-release-candidate-model.json","utf8"));
const matrix=JSON.parse(readFileSync("public/data/e2e-scenarios-08j.json","utf8"));
const scenarios=matrix.scenarios||[];
const codes=new Set();
for(const scenario of scenarios){
  if(!/^08J-E2E-\d{3}$/.test(scenario.id))throw new Error(`ID inválido: ${scenario.id}`);
  if(codes.has(scenario.code))throw new Error(`Cenário duplicado: ${scenario.code}`);
  codes.add(scenario.code);
  if(!model.profiles.some(profile=>profile.code===scenario.profile))throw new Error(`Perfil desconhecido: ${scenario.profile}`);
  if(!["automated","human","external"].includes(scenario.execution))throw new Error(`Execução inválida: ${scenario.execution}`);
  if(!scenario.route.startsWith("/"))throw new Error(`Rota inválida: ${scenario.route}`);
  if((scenario.execution==="human"||scenario.execution==="external")&&!scenario.evidenceRequired)throw new Error(`Evidência obrigatória ausente: ${scenario.code}`);
}
const counts={
 total:scenarios.length,
 automated:scenarios.filter(item=>item.execution==="automated").length,
 human:scenarios.filter(item=>item.execution==="human").length,
 external:scenarios.filter(item=>item.execution==="external").length
};
for(const [key,value] of Object.entries(counts))if(model.scenarioCounts[key]!==value)throw new Error(`Contagem divergente ${key}: ${value}`);
for(const code of ["public-home","public-museum","public-immersive","pending-onboarding","volunteer-admin-denied","master-release-candidate","staging-auth","screen-reader-collab"]){
 if(!codes.has(code))throw new Error(`Cenário obrigatório ausente: ${code}`);
}
console.log(`Matriz E2E 08J validada: ${counts.total} cenários (${counts.automated} automáticos, ${counts.human} humanos, ${counts.external} externos).`);
