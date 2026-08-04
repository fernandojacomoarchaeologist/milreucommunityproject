/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";
const read=(p)=>JSON.parse(readFileSync(p,"utf8"));
const fail=(m)=>{throw new Error(`08N: ${m}`);};
const model=read("public/data/volunteer-experience-model.json");
if(model.version!=="0.38.0")fail("versão do modelo do voluntário incorreta.");
if(model.newPermissionsExpected!==0||model.newModulesExpected!==0)fail("08N não cria módulos nem permissões.");
for(const b of ["objective","expectedActions","quickGuide","details"])if(!model.requiredEditorialBlocks.includes(b))fail(`bloco editorial ${b} ausente.`);
if(!model.visibleTrainingCards.includes("project-foundations")||model.visibleTrainingCards.length!==1)fail("Formação deve mostrar apenas o percurso Fundamentos (project-foundations).");
// a UI de formação filtra para o percurso visível, sem apagar os restantes do backend
const trainingView=readFileSync("src/views/collaborative-museum-review.js","utf8");
if(!trainingView.includes("VOLUNTEER_VISIBLE_TRAINING_CODES")||!trainingView.includes("project-foundations"))fail("vista de Formação não filtra para o percurso visível.");
const trails=read("public/data/collaborative-training-trails.json").trails;
if(trails.length<5)fail("os percursos de formação não podem ser apagados do backend.");
// a home tem intro orientadora + ações pendentes reais
const dash=readFileSync("src/views/collaborative.js","utf8");
if(!dash.includes("sectionIntro")||!dash.includes("homePendingActions"))fail("home sem estrutura orientadora ou ações pendentes.");
// contributos: limite 10 MB no cliente e config
const model2=read("public/data/collaborative-contribution-model.json");
const limit=model2.limits?.maxFileSizeBytes??model2.maxFileSizeBytes;
if(limit!==10485760)fail(`limite de ficheiro deve ser 10 MB (10485760), é ${limit}.`);
console.log("08N voluntário validado: estrutura orientadora, Formação com 1 percurso visível (backend intacto), home com pendências reais, anexos a 10 MB.");
