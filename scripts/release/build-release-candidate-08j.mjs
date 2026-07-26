/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
const read=path=>JSON.parse(readFileSync(path,"utf8"));
const safe=path=>existsSync(path)?read(path):null;
const pkg=read("package.json");
const model=read("public/data/collaborative-release-candidate-model.json");
const modules=read("public/data/collaborative-modules.json");
const roles=read("public/data/collaborative-roles-permissions.json");
const deployment=read("public/data/deployment-readiness.json");
const e2e=safe("reports/e2e-result.json");
const accessibility=safe("reports/accessibility-result.json");
const technicalChecks=[
 {code:"version",passed:pkg.version==="0.21.0",detail:pkg.version},
 {code:"modules",passed:modules.modules.length===22&&modules.modules.every(item=>item.status==="active"),detail:`${modules.modules.length} ativos`},
 {code:"permissions",passed:roles.permissions.length===117,detail:`${roles.permissions.length} preservadas`},
 {code:"e2e-browser",passed:e2e?.passed===true,detail:e2e?`${e2e.passedCount}/${e2e.total}`:"não executado"},
 {code:"accessibility-baseline",passed:accessibility?.passed===true,detail:accessibility?`${accessibility.checks.filter(item=>item.pass).length}/${accessibility.checks.length}`:"não executado"},
 {code:"production-writes",passed:deployment.checks?.productionWritesDisabled===true,detail:"escritas de produção desativadas"},
 {code:"service-role-browser",passed:deployment.checks?.serviceRoleInFrontend===false,detail:"service role fora do frontend"},
 {code:"external-gates-honest",passed:model.externalGates.every(item=>item.status==="blocked"),detail:"bloqueios externos preservados"},
 {code:"human-gates-honest",passed:model.humanGates.every(item=>item.status==="pending"),detail:"revisões humanas pendentes"}
];
const blockers=technicalChecks.filter(item=>!item.passed).map(item=>item.code);
const readiness={
 _copyright:model._copyright,version:pkg.version,candidate:model.candidate,generatedAt:new Date().toISOString(),
 technicalCandidate:{status:blockers.length?"blocked":"ready",approved:blockers.length===0,checks:technicalChecks,blockers},
 stagingHomologation:{status:"blocked",approved:false,blockers:model.externalGates.map(item=>item.code)},
 productionApproval:{status:"blocked",approved:false,blockers:[...model.externalGates.map(item=>item.code),...model.humanGates.map(item=>item.code)]},
 notice:"Aprovação técnica local não equivale a homologação de staging nem a aprovação de produção."
};
writeFileSync("public/data/release-candidate-readiness.json",JSON.stringify(readiness,null,2)+"\n");
mkdirSync("reports",{recursive:true});
const checkLines=technicalChecks.map(item=>`- [${item.passed?"x":" "}] ${item.code}: ${item.detail}`);
const markdown=[
"---","copyright: \"© 2026 Fernando Rodrigues de Jácomo\"","project: \"Projeto Comunitário de Milreu\"","package: \"08J\"","rights: \"Consultar RIGHTS.md no repositório principal\"","---","",
"# Release candidate técnica — 08J","",`- Versão: ${pkg.version}`,`- Candidata: ${model.candidate}`,`- Estado técnico: **${readiness.technicalCandidate.status}**`,`- Staging: **blocked**`,`- Produção: **blocked**`,"","## Checks técnicos","",...checkLines,"","## Gates externos preservados","",...model.externalGates.map(item=>`- [ ] ${item.code}: ${item.reason}`),"","## Gates humanos preservados","",...model.humanGates.map(item=>`- [ ] ${item.code}: ${item.reason}`),"","## Declaração","","Esta evidência aprova, no máximo, uma release candidate técnica local. Não prova migrations em PostgreSQL/Supabase, Google OAuth, RLS remoto, Edge Functions, backup, restauração, revisão editorial, direitos, traduções ou acessibilidade humana.",
];
writeFileSync("reports/RELEASE_CANDIDATE_08J.md",markdown.join("\n")+"\n");
console.log(`RC ${model.candidate}: ${readiness.technicalCandidate.status}.`);
if(blockers.length)process.exitCode=2;
