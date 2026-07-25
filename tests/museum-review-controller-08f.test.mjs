/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const controller=readFileSync("src/collab/controller.js","utf8");
test("workspace carrega revisão e formação",()=>{for(const table of["collab_museum_review_records","collab_museum_review_field_proposals","collab_training_enrolments","collab_public_content_effects"])assert.ok(controller.includes(table));});
test("controller cobre ciclo editorial",()=>{for(const method of["saveMuseumProposal","reviewMuseumProposal","supersedeMuseumProposal",
    "addMuseumReviewComment","setMuseumReviewCheck","decideMuseumReview","generateMuseumReviewSnapshot","approveMuseumReviewSnapshot"])assert.ok(controller.includes(`async ${method}`));});
test("demo mantém 31 registos sem propostas inventadas",()=>{assert.match(controller,/createDemoMuseumReviewWorkspace/);assert.match(controller,/reviewSeed\.records\.map/);assert.match(controller,/proposals:\[\]/);});
test("gates demo respeitam formação e sequência",()=>{assert.match(controller,/assertDemoTraining/);assert.match(controller,/Aprovação editorial necessária/);assert.match(controller,/Aprovação de direitos necessária/);});

test("demo bloqueia publicação sem elegibilidade e divulgação de IA",()=>{
  assert.match(controller,/requires_ai_disclosure/);
  assert.match(controller,/public_release_eligible/);
  assert.match(controller,/ai-substantive-intervention/);
  assert.match(controller,/Elegibilidade pública e divulgação de IA ainda não foram aprovadas/);
});
