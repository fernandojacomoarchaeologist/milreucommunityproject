/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const router=readFileSync("src/lib/router.js","utf8"),view=readFileSync("src/views/collaborative-deployment.js","utf8"),main=readFileSync("src/main.js","utf8"),layout=readFileSync("src/components/collaborative-layout.js","utf8");
test("rotas de homologação existem",()=>{assert.match(router,/collab-deployment-homologation/);assert.match(router,/collab-homologation-run/);});
test("view cobre ambientes, auth, checks e aprovação",()=>{for(const marker of["data-deployment-environment-form","data-auth-policy-form","data-homologation-start-form","data-homologation-check-form","data-homologation-approve"])assert.ok(view.includes(marker),marker);});
test("bindings da interface estão ativos",()=>{for(const marker of["data-deployment-environment-form","data-homologation-complete-form","data-homologation-cancel"])assert.ok(main.includes(marker),marker);});
test("gestão possui link",()=>assert.match(layout,/Implantação e homologação/));
