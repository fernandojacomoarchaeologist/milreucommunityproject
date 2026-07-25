/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const router=readFileSync("src/lib/router.js","utf8");
const views=readFileSync("src/views/collaborative-exhibitions.js","utf8");
const publicView=readFileSync("src/views/exhibitions-public.js","utf8");
const main=readFileSync("src/main.js","utf8");

test("rotas de agenda, locais e itinerância",()=>{
  for(const route of [
    "/exposicoes","/area-colaborativa/agenda","/area-colaborativa/gestao/locais",
    "/area-colaborativa/gestao/exposicoes","/area-colaborativa/gestao/agenda/novo"
  ]) assert.ok(router.includes(route),route);
});

test("interfaces de gestão possuem formulários operacionais",()=>{
  for(const marker of [
    "data-venue-form","data-exhibition-form","data-schedule-form",
    "data-agenda-event-form","data-checklist-form"
  ]) assert.ok(views.includes(marker),marker);
});

test("agenda oferece lista, calendário e itinerância",()=>{
  assert.match(views,/Próximas atividades/);
  assert.match(views,/Calendário/);
  assert.match(views,/Itinerância/);
  assert.match(views,/agenda-calendar__grid/);
});

test("página pública não inventa locais",()=>{
  assert.match(publicView,/O próximo local ainda não foi publicado/);
  assert.match(publicView,/publicExhibitionsView/);
  assert.ok(main.includes('case "public-exhibitions"'));
});
