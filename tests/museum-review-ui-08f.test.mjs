/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const router=readFileSync("src/lib/router.js","utf8"),views=readFileSync("src/views/collaborative-museum-review.js","utf8"),main=readFileSync("src/main.js","utf8");
test("rotas de formação e revisão",()=>{for(const route of["/area-colaborativa/formacao","/area-colaborativa/revisao-museu","/area-colaborativa/gestao/revisao-museu"])assert.ok(router.includes(route));assert.ok(router.includes("collab-museum-review-releases"));});
test("interface cobre campos, checks e decisões",()=>{for(const marker of["data-museum-proposal-form","data-museum-check-form","data-museum-comment-form","data-museum-decision-form"])assert.ok(views.includes(marker));});
test("preview compara canónico e candidato",()=>{assert.match(views,/Canónico atual/);assert.match(views,/Candidato/);assert.match(views,/A pré-visualização não altera/);});
test("bindings estão ativos",()=>{for(const marker of["data-training-lesson-complete","data-museum-proposal-review","data-museum-snapshot-form","data-public-effect-form"])assert.ok(main.includes(marker));});

test("biblioteca e lições são lidas dentro da Área Colaborativa",()=>{
  assert.match(views,/collaborativeLibraryResourceView/);
  assert.match(views,/collab-reference-content/);
  assert.match(views,/training-lesson-content/);
});
