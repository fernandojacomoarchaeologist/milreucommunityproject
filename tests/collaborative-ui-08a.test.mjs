/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const router=readFileSync("src/lib/router.js","utf8");
const views=readFileSync("src/views/collaborative.js","utf8");
const main=readFileSync("src/main.js","utf8");
const callback=readFileSync("auth/callback/index.html","utf8");

test("rotas restritas estão preparadas",()=>{
  for(const route of [
    "/area-colaborativa","/area-colaborativa/perfil","/area-colaborativa/tarefas",
    "/area-colaborativa/contributos","/area-colaborativa/agenda",
    "/area-colaborativa/biblioteca","/area-colaborativa/formacao",
    "/area-colaborativa/revisao-museu","/area-colaborativa/gestao/perfis",
    "/area-colaborativa/gestao/exposicoes"
  ]) assert.ok(router.includes(route),route);
});

test("cadastro exige nome, email e perfil",()=>{
  assert.match(views,/name="displayName"/);
  assert.match(views,/name="email"/);
  assert.match(views,/name="primaryProfileType"/);
  assert.match(views,/O e-mail vem da conta Google/);
});

test("área possui demonstração pendente e master",()=>{
  assert.match(views,/data-collab-demo-login="pending"/);
  assert.match(views,/data-collab-demo-login="master"/);
  assert.match(main,/collaborative\.demoSignIn/);
});

test("callback é página estática noindex",()=>{
  assert.match(callback,/noindex,nofollow/);
  assert.match(callback,/src\/collab\/callback\.js/);
});
