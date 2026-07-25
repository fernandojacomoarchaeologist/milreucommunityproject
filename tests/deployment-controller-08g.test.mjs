/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const controller=readFileSync("src/collab/controller.js","utf8");
test("controller carrega workspace remoto",()=>{for(const table of["collab_deployment_environments","collab_auth_policies","collab_homologation_runs","collab_homologation_checks"])assert.ok(controller.includes(table),table);});
test("controller cobre ciclo de homologação",()=>{for(const method of["startHomologation","recordHomologationCheck","completeHomologation","approveHomologation","cancelHomologation"])assert.ok(controller.includes(`async ${method}`),method);});
test("demo respeita staging antes de produção",()=>{assert.match(controller,/APPROVE_MILREU_PRODUCTION_RELEASE/);assert.match(controller,/Homologação de staging aprovada é obrigatória/);});
test("demo não usa dados pessoais reais",()=>{assert.match(controller,/demo-project/);assert.doesNotMatch(controller,/MILREU_MASTER_EMAIL/);});
