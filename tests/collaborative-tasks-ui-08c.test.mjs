/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const router=readFileSync("src/lib/router.js","utf8"),views=readFileSync("src/views/collaborative-tasks.js","utf8"),main=readFileSync("src/main.js","utf8"),collab=readFileSync("src/views/collaborative.js","utf8"),css=readFileSync("src/styles/app.css","utf8");
test("rotas de voluntariado",()=>{for(const route of ["/area-colaborativa/tarefas","/area-colaborativa/disponibilidade","/area-colaborativa/gestao/tarefas"]){assert.ok(router.includes(route),route);}for(const name of ["collab-task-detail","collab-task-new","collab-task-edit","collab-task-manage-detail"]){assert.ok(router.includes(name),name);}});
test("interfaces de voluntário e coordenação",()=>{for(const token of ["collaborativeTasksView","collaborativeTaskDetailView","collaborativeAvailabilityView","collaborativeTaskManagementView","collaborativeTaskEditorView","data-task-join-form","data-task-invite-form","data-task-submit-form"]){assert.ok(views.includes(token),token);}});
test("demonstração inclui voluntário",()=>{assert.match(collab,/data-collab-demo-login="volunteer"/);assert.match(main,/collaborative\.demoSignIn/);});
test("bindings operacionais",()=>{for(const token of ["collaborative.joinTask","collaborative.saveAvailability","collaborative.createTask","collaborative.reviewTaskApplication","collaborative.verifyTask","collaborative.logTaskTime"]){assert.ok(main.includes(token),token);}});
test("estilos responsivos",()=>{for(const cls of [".task-grid",".task-detail__layout",".availability-row",".task-management-list",".task-editor-grid"]){assert.ok(css.includes(cls),cls);}assert.match(css,/@media\(max-width:58rem\)/);});
