/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const router=readFileSync("src/lib/router.js","utf8");
const publicView=readFileSync("src/views/contributions-public.js","utf8");
const collaborative=readFileSync("src/views/collaborative-contributions.js","utf8");
const portal=readFileSync("src/views/portal.js","utf8");
const main=readFileSync("src/main.js","utf8");

test("rotas públicas e internas",()=>{
  for(const route of [
    "/participar/contribuir","/participar/contribuir/acompanhar","/participar/retirada",
    "/area-colaborativa/contributos","/area-colaborativa/gestao/contributos"
  ]) assert.ok(router.includes(route),route);
});

test("formulário público exige conteúdo, direitos e consentimento",()=>{
  for(const field of [
    'name="contributionType"','name="title"','name="content"',
    'name="displayName"','name="email"','name="rightsDeclaration"',
    'name="privacyAccepted"','name="rightsConfirmed"','name="projectUseAuthorised"'
  ]) assert.ok(publicView.includes(field),field);
  assert.match(publicView,/Submeter não significa publicar/);
  assert.match(publicView,/não transfere automaticamente direitos/);
});

test("interface interna possui fila e decisões",()=>{
  assert.match(collaborative,/collaborativeContributionModerationView/);
  assert.match(collaborative,/data-contribution-assignment-form/);
  assert.match(collaborative,/data-contribution-moderation-form/);
  assert.match(collaborative,/data-incorporation-proposal-form/);
  assert.match(collaborative,/data-withdrawal-resolve/);
});

test("Portal encaminha para o fluxo moderado",()=>{
  assert.match(portal,/Partilhar contributo/);
  assert.match(portal,/Acompanhar submissão/);
  assert.match(portal,/Pedir correção ou retirada/);
  assert.match(main,/publicContributionFormView/);
});
